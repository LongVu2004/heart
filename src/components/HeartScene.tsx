import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PresentationControls, Stars, Sparkles } from '@react-three/drei';

function HeartCloud() {
  const group = useRef<THREE.Group>(null!);
  const [visibleCount, setVisibleCount] = useState(0);

  const particles = useMemo(() => {
    const temp = [];
    const text = "i love you";
    // Outer contour
    for (let t = 0; t < Math.PI * 2; t += 0.065) {
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      const z = (Math.random() - 0.5) * 0.6;
      temp.push({ pos: [x * 0.08, y * 0.08, z * 0.08] as [number, number, number] });
    }
    // Inner contour
    for (let t = 0; t < Math.PI * 2; t += 0.12) {
      const x = 16 * Math.pow(Math.sin(t), 3) * 0.6;
      const y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.6;
      const z = (Math.random() - 0.5) * 0.4;
      temp.push({ pos: [x * 0.08, y * 0.08, z * 0.08] as [number, number, number] });
    }
    return temp;
  }, []);

  useFrame((state, delta) => {
    // Animate particles appearing one by one (~40 per second)
    setVisibleCount(prev => {
      if (prev >= particles.length) return prev;
      return Math.min(particles.length, prev + delta * 45);
    });

    // Rotate + pulse
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.2;
      const pulse = 1 + 0.04 * Math.sin(state.clock.getElapsedTime() * 2.5);
      group.current.scale.setScalar(pulse);
    }
  });

  const showCenter = visibleCount >= particles.length;
  const count = Math.floor(visibleCount);

  return (
    <group ref={group}>
      {particles.slice(0, count).map((p, i) => (
        <Text
          key={i}
          position={p.pos}
          fontSize={0.14}
          color="#ff4d6d"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.003}
          outlineColor="#ff003c"
        >
          i love you
        </Text>
      ))}
      {showCenter && (
        <Text
          position={[0, 0, 0.1]}
          fontSize={0.32}
          color="#ff8fb1"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.008}
          outlineColor="#ff4d6d"
        >
          iu pé Trân
        </Text>
      )}
    </group>
  );
}

export default function HeartScene({ active: _active }: { active?: boolean } = {}) {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#ff4d6d" />
        
        <PresentationControls
          global
          snap
          speed={1.5}
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 2, Math.PI / 2]}
          azimuth={[-Math.PI, Math.PI]}
        >
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
            <HeartCloud />
          </Float>
        </PresentationControls>

        <Sparkles count={150} size={0.4} speed={0.4} color="#ff4d6d" />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
