'use client';

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { AssistantState } from '@/types/jarvis';

interface JarvisCoreProps {
  state: AssistantState;
  audioLevel: number;
}

// Subcomponent: Rotating Particle Sphere Core
function ParticleSphere({ state, audioLevel }: { state: AssistantState; audioLevel: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);
  const outerRingRef1 = useRef<THREE.Mesh>(null);
  const outerRingRef2 = useRef<THREE.Mesh>(null);

  // Generate 2500 3D particle positions on a sphere
  const count = 2500;
  const [positions, initialRadius] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rad = new Float32Array(count);
    const radius = 2.2;

    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = radius + (Math.random() - 0.5) * 0.4;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      rad[i] = r;
    }
    return [pos, rad];
  }, []);

  // Determine state-based target colors
  const targetColor = useMemo(() => {
    switch (state) {
      case 'listening':
        return new THREE.Color('#ff2a5f'); // Red (Listening)
      case 'thinking':
        return new THREE.Color('#3b82f6'); // Cobalt Blue / Rapid Vortex (Thinking)
      case 'speaking':
        return new THREE.Color('#00ffaa'); // Electric Green/Cyan Pulse (Speaking)
      case 'idle':
      default:
        return new THREE.Color('#00f0ff'); // Neon Cyan (Standby)
    }
  }, [state]);

  const currentColor = useRef(new THREE.Color('#00f0ff'));

  useFrame((stateObj, delta) => {
    // Smoothly transition particle colors
    currentColor.current.lerp(targetColor, delta * 4);

    if (pointsRef.current) {
      // Rotation speed based on state
      let speed = 0.4;
      if (state === 'thinking') speed = 2.5;
      if (state === 'speaking') speed = 0.8;
      if (state === 'listening') speed = 1.2;

      pointsRef.current.rotation.y += delta * speed;
      pointsRef.current.rotation.x += delta * (speed * 0.5);

      // Scale pulsating based on audio level and state
      let scaleTarget = 1.0 + audioLevel * 0.35;
      if (state === 'listening') scaleTarget += Math.sin(stateObj.clock.getElapsedTime() * 10) * 0.08;
      if (state === 'speaking') scaleTarget += Math.sin(stateObj.clock.getElapsedTime() * 15) * 0.12;

      pointsRef.current.scale.lerp(new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget), delta * 6);
    }

    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.y -= delta * 0.8;
      innerMeshRef.current.rotation.z += delta * 0.5;

      const innerScale = 0.9 + audioLevel * 0.25;
      innerMeshRef.current.scale.set(innerScale, innerScale, innerScale);
    }

    if (outerRingRef1.current) {
      outerRingRef1.current.rotation.x += delta * 0.6;
      outerRingRef1.current.rotation.y += delta * 0.4;
    }

    if (outerRingRef2.current) {
      outerRingRef2.current.rotation.x -= delta * 0.4;
      outerRingRef2.current.rotation.z += delta * 0.7;
    }
  });

  return (
    <group>
      {/* Central Wireframe Core */}
      <mesh ref={innerMeshRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial
          color={currentColor.current}
          wireframe
          transparent
          opacity={state === 'thinking' ? 0.85 : 0.45}
        />
      </mesh>

      {/* Orbital Sci-Fi Ring 1 */}
      <mesh ref={outerRingRef1}>
        <torusGeometry args={[2.7, 0.018, 16, 100]} />
        <meshBasicMaterial color={currentColor.current} transparent opacity={0.6} />
      </mesh>

      {/* Orbital Sci-Fi Ring 2 */}
      <mesh ref={outerRingRef2}>
        <torusGeometry args={[3.2, 0.012, 16, 100]} />
        <meshBasicMaterial color={currentColor.current} transparent opacity={0.35} />
      </mesh>

      {/* Main 3D Particle Cloud */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color={currentColor.current}
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Central Glowing Light source */}
      <pointLight color={currentColor.current} intensity={state === 'speaking' ? 3.5 : 2.0} distance={10} />
    </group>
  );
}

export default function JarvisCore({ state, audioLevel }: JarvisCoreProps) {
  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[450px] flex items-center justify-center">
      {/* Background Radial Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-[100px] opacity-35 transition-all duration-700 pointer-events-none ${
          state === 'listening'
            ? 'bg-jarvis-red'
            : state === 'thinking'
            ? 'bg-cobalt-blue'
            : state === 'speaking'
            ? 'bg-jarvis-green'
            : 'bg-cyan-glow'
        }`}
      />

      <Canvas className="w-full h-full cursor-grab active:cursor-grabbing">
        <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={50} />
        <ambientLight intensity={0.4} />
        <ParticleSphere state={state} audioLevel={audioLevel} />
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
