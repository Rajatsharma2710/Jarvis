import { LanguageMode } from '@/types/jarvis';

// Pre-packaged JARVIS offline fallback responses for different languages
export const FALLBACK_RESPONSES: Record<LanguageMode, string[]> = {
  english: [
    "At your service, boss. All core systems are operational and ready for your command.",
    "Indeed. I've analyzed your request. Everything appears to be operating smoothly.",
    "Right away. I have processed the request and stand prepared for further instructions.",
    "Always a pleasure assisting you. Is there anything else you require at the moment?",
  ],
  hinglish: [
    "Aapke sewa me haazir hoon! Saare systems ekdam badhiya chal rahe hain.",
    "Ji haan, maine aapka request process kar diya hai. Sab kuch smooth hai.",
    "Bilkul! Main agle command ke liye ready hoon.",
    "Aapki madad karke khushi hui. Kya aur koi madad chahiye?",
  ],
  hindi: [
    "आपकी सेवा में प्रस्तुत हूँ। सभी कोर सिस्टम सुचारू रूप से कार्य कर रहे हैं।",
    "जी हाँ, मैंने आपके अनुरोध का विश्लेषण कर लिया है। सब कुछ सही चल रहा है।",
    "बिल्कुल! मैं आपके अगले आदेश के लिए तैयार हूँ।",
    "आपकी सहायता करके मुझे प्रसन्नता हुई। क्या आपको किसी और चीज़ की आवश्यकता है?",
  ],
};

export function getRandomFallback(lang: LanguageMode = 'english'): string {
  const list = FALLBACK_RESPONSES[lang] || FALLBACK_RESPONSES.english;
  return list[Math.floor(Math.random() * list.length)];
}

export function getContextualFallback(userText: string, lang: LanguageMode = 'english'): string | null {
  if (!userText) return null;
  const text = userText.toLowerCase().trim();

  // 1. USA / States / Kitne rajya
  if (/\b(usa|america|states|rajya|state|अमेरिका|राज्य)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'संयुक्त राज्य अमेरिका (USA) में कुल 50 राज्य हैं। इसकी राजधानी वाशिंगटन डी.सी. है।';
    } else if (lang === 'hinglish') {
      return 'USA (United States of America) me total 50 states (rajya) hain. Iski capital Washington D.C. hai.';
    }
    return 'The United States of America (USA) consists of 50 states, and its capital is Washington, D.C.';
  }

  // 2. India / Bharat
  if (/\b(india|bharat|भारत|इंडिया)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'भारत (India) दक्षिण एशिया में स्थित दुनिया की सबसे बड़ी लोकतान्त्रिक व्यवस्था है। इसमें 28 राज्य और 8 केंद्र शासित प्रदेश हैं।';
    } else if (lang === 'hinglish') {
      return 'India South Asia me sthit duniya ki sabse badi democracy hai.isme 28 states aur 8 Union Territories hain.';
    }
    return 'India is a country in South Asia consisting of 28 states and 8 union territories, with New Delhi as its capital.';
  }

  // 3. Red Fort / Laal Kila
  if (/\b(laal kila|red fort|लाल किला)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'लाल किला भारत की राजधानी नई दिल्ली में स्थित एक ऐतिहासिक किला है, जिसे मुगल सम्राट शाहजहाँ ने बनवाया था।';
    } else if (lang === 'hinglish') {
      return 'Laal Kila (Red Fort) India ki rajdhani Delhi me sthit ek aitihaasik kila hai, jise Shah Jahan ne banwaya tha.';
    }
    return 'The Red Fort (Laal Kila) is a historic fort in Delhi, India, constructed by Emperor Shah Jahan.';
  }

  // 4. Delhi
  if (/\b(delhi|dilli|दिल्ली)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'दिल्ली भारत की राजधानी और एक केंद्र शासित प्रदेश है, जो उत्तरी भारत में यमुना नदी के तट पर स्थित है।';
    } else if (lang === 'hinglish') {
      return 'Delhi India ki capital city aur ek union territory hai, jo North India me Yamuna nadi ke kinare sthit hai.';
    }
    return 'Delhi is the capital territory of India, located in North India along the Yamuna River.';
  }

  // 5. Taj Mahal
  if (/\b(taj mahal|ताज महल)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'ताजमहल उत्तर प्रदेश के आगरा शहर में यमुना नदी के तट पर स्थित एक विश्व प्रसिद्ध ऐतिहासिक संगमरमर का मकबरा है।';
    } else if (lang === 'hinglish') {
      return 'Taj Mahal Uttar Pradesh ke Agra shehar me Yamuna nadi ke kinare sthit ek vishwa prasiddh aitihaasik maqbara hai.';
    }
    return 'The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in Agra, India.';
  }

  // 6. Greetings
  if (/\b(hello|hi|hey|greetings|namaste|नमस्ते|kaise ho|kya haal)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'नमस्ते! मैं जार्विस हूँ। मैं आपकी क्या सहायता कर सकती हूँ?';
    } else if (lang === 'hinglish') {
      return 'Namaste! Main JARVIS hoon. Bataiye aaj main aapki kya help kar sakti hoon?';
    }
    return 'Greetings! I am JARVIS. How may I assist you today?';
  }

  // 7. Identity / Who are you
  if (/\b(who are you|your name|what are you|kaun ho|kaun hai|naam kya)\b/.test(text)) {
    if (lang === 'hindi') {
      return 'मैं जार्विस हूँ, आपकी एडवांस्ड एआई वॉइस असिस्टेंट। मैं आपके सभी सवालों का सटीक उत्तर देती हूँ।';
    } else if (lang === 'hinglish') {
      return 'Main JARVIS hoon, aapki Advanced AI Voice Assistant. Main aapke saare sawalon ka sahi jawab deti hoon.';
    }
    return 'I am JARVIS, your Just A Rather Very Intelligent System. I manage your diagnostics and answer commands.';
  }

  return null;
}
