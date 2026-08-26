import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import OpenAI from 'openai';
import { getContextualFallback, getRandomFallback } from '@/lib/jarvisIntents';
import { LanguageMode } from '@/types/jarvis';

const BASE_SYSTEM_PROMPT = `You are JARVIS, a highly advanced, witty, polite, and empathetic AI assistant inspired by Iron Man's JARVIS. Answer the user's questions accurately and conversationally in 1 to 3 concise sentences so it sounds natural when spoken aloud.`;

// gemini-3.6-flash is what Google's own API error message suggested as replacement
const GEMINI_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.5-flash',
  'gemini-2.5-flash-preview-04-17',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export async function POST(req: NextRequest) {
  let userMessage = '';
  let language: LanguageMode = 'hinglish';
  let isOffline = false;

  try {
    const body = await req.json();
    userMessage = body.message || '';
    language = (body.language as LanguageMode) || 'hinglish';
    isOffline = !!body.isOffline;
    const history = body.history || [];

    if (!userMessage || typeof userMessage !== 'string') {
      const defaultReply = getContextualFallback('hello', language) || getRandomFallback(language);
      return NextResponse.json({ response: defaultReply });
    }

    // Force Offline Mode if requested by user toggle
    if (isOffline) {
      const offlineReply = getContextualFallback(userMessage, language) || getRandomFallback(language);
      return NextResponse.json({
        response: offlineReply,
        provider: 'JARVIS Local Offline Engine',
      });
    }

    // Language instruction tuning
    let langInstruction = 'Reply fluently in Hinglish (Hindi written in Roman script).';
    if (language === 'hindi') {
      langInstruction = 'Reply fluently in natural Devanagari Hindi (हिंदी भाषा में सटीक उत्तर दें).';
    } else if (language === 'english') {
      langInstruction = 'Reply fluently in refined English.';
    }

    const systemPrompt = `${BASE_SYSTEM_PROMPT} ${langInstruction}`;

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // 1. TOP PRIORITY: Google Gemini API
    if (geminiKey && geminiKey.trim() !== '' && !geminiKey.includes('your_gemini_api_key')) {
      const genAI = new GoogleGenerativeAI(geminiKey);

      // Format history properly for Gemini (must start with 'user' role)
      let chatHistory = Array.isArray(history)
        ? history.slice(-6).map((msg: { sender: string; text: string }) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          }))
        : [];

      // Ensure the first item in chatHistory is 'user'
      while (chatHistory.length > 0 && chatHistory[0].role !== 'user') {
        chatHistory.shift();
      }

      for (const modelName of GEMINI_MODELS) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          });

          const chat = model.startChat({ history: chatHistory });
          const result = await chat.sendMessage(userMessage);
          const reply = result.response.text().trim();

          if (reply) {
            console.log(`✓ Gemini (${modelName}) generated response successfully: "${reply.substring(0, 40)}..."`);
            return NextResponse.json({
              response: reply,
              provider: `Google Gemini (${modelName})`,
            });
          }
        } catch (geminiErr: any) {
          console.warn(`Gemini model ${modelName} issue:`, geminiErr?.message || geminiErr);
        }
      }
    }

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((msg: { sender: string; text: string }) => ({
          role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
          content: msg.text,
        }))
      : [];

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...formattedHistory,
      { role: 'user' as const, content: userMessage },
    ];

    // 2. SECOND PRIORITY: Groq API
    if (groqKey && groqKey.trim() !== '' && !groqKey.includes('your_groq_api_key')) {
      try {
        const groq = new Groq({ apiKey: groqKey });
        const completion = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages,
          max_tokens: 150,
          temperature: 0.7,
        });

        const reply =
          completion.choices[0]?.message?.content?.trim() ||
          getContextualFallback(userMessage, language) ||
          getRandomFallback(language);

        return NextResponse.json({
          response: reply,
          provider: 'Groq (Llama-3.3-70b)',
        });
      } catch (groqErr: any) {
        console.warn('Groq API call issue:', groqErr?.message || groqErr);
      }
    }

    // 3. THIRD PRIORITY: OpenAI API
    if (openaiKey && openaiKey.trim() !== '' && !openaiKey.includes('your_openai_api_key')) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey });
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          max_tokens: 150,
          temperature: 0.7,
        });

        const reply =
          completion.choices[0]?.message?.content?.trim() ||
          getContextualFallback(userMessage, language) ||
          getRandomFallback(language);

        return NextResponse.json({
          response: reply,
          provider: 'OpenAI (GPT-4o-mini)',
        });
      } catch (openaiErr: any) {
        console.warn('OpenAI API call issue:', openaiErr?.message || openaiErr);
      }
    }

    // 4. FOURTH PRIORITY: Local Intent Engine
    const fallbackReply = getContextualFallback(userMessage, language) || getRandomFallback(language);
    return NextResponse.json({
      response: fallbackReply,
      provider: 'JARVIS Local Engine',
    });
  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    const fallbackReply = getContextualFallback(userMessage, language) || getRandomFallback(language);
    return NextResponse.json({ response: fallbackReply, provider: 'JARVIS Fallback' });
  }
}
