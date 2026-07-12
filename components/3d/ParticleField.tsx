"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  count?: number;
  isReducedMotion?: boolean;
  isMobile?: boolean;
}

export default function ParticleField({
  count = 200,
  isReducedMotion = false,
  isMobile = false,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const particleCount = isMobile ? Math.floor(count / 2) : count;

  const { geometry, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;

      vel[i * 3] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    return { geometry: geo, velocities: vel };
  }, [particleCount]);

  useFrame(() => {
    if (!pointsRef.current || isReducedMotion) return;

    const pos = pointsRef.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] += velocities[i * 3];
      pos[i * 3 + 1] += velocities[i * 3 + 1];
      pos[i * 3 + 2] += velocities[i * 3 + 2];

      // Wrap around
      if (Math.abs(pos[i * 3]) > 7.5) velocities[i * 3] *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 5) velocities[i * 3 + 1] *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 5) velocities[i * 3 + 2] *= -1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#00B4D8"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
