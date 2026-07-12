"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, Tube, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

interface DNAHelixProps {
  mouseX?: number;
  mouseY?: number;
  isReducedMotion?: boolean;
}

export default function DNAHelix({
  mouseX = 0,
  mouseY = 0,
  isReducedMotion = false,
}: DNAHelixProps) {
  const groupRef = useRef<THREE.Group>(null);
  const floatRef = useRef(0);
  const count = 32;
  const radius = 1.8;
  const height = 5.5;

  // Generate helix sphere positions and strand curves
  const { spheres, strand1Points, strand2Points, bridgePairs } = useMemo(() => {
    const sphereData: {
      position: [number, number, number];
      color: string;
      size: number;
    }[] = [];

    const s1: [number, number, number][] = [];
    const s2: [number, number, number][] = [];
    const bridges: [number, number][] = [];

    for (let i = 0; i < count; i++) {
      const t = i / count;
      const angle = t * Math.PI * 8;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      s1.push([x1, y, z1]);
      s2.push([x2, y, z2]);

      const sphereSize = (0.08 + Math.sin(angle * 2) * 0.04 + 0.04);
      sphereData.push({
        position: [x1, y, z1],
        color: "#0077B6",
        size: sphereSize,
      });
      sphereData.push({
        position: [x2, y, z2],
        color: "#00B4D8",
        size: sphereSize,
      });

      // Bridge rungs every other step
      if (i % 2 === 0) {
        bridges.push([i, i + count]);
      }
    }

    return {
      spheres: sphereData,
      strand1Points: s1,
      strand2Points: s2,
      bridgePairs: bridges,
    };
  }, []);

  // Create Tube curves for the strands
  const strand1Curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      strand1Points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    );
  }, [strand1Points]);

  const strand2Curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      strand2Points.map((p) => new THREE.Vector3(p[0], p[1], p[2]))
    );
  }, [strand2Points]);

  useFrame((state) => {
    if (!groupRef.current || isReducedMotion) return;

    // Gentle floating motion
    floatRef.current = Math.sin(state.clock.elapsedTime * 0.3) * 0.08;

    // Slow auto-spin around tilted axis
    groupRef.current.rotation.y += 0.003;
    groupRef.current.position.y = floatRef.current;

    // Mouse parallax (gentler to preserve the tilt)
    const targetRotY = mouseX * 0.3;
    const targetRotX = mouseY * 0.15;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.015;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.015;
  });

  return (
    <group
      ref={groupRef}
      rotation={[-0.15, -0.2, -0.45]}
      position={[0.6, 0, -0.5]}
    >
      {/* Strand 1 (Clinical Blue) */}
      <Tube args={[strand1Curve, 48, 0.025, 8, false]}>
        <meshStandardMaterial
          color="#0077B6"
          emissive="#0077B6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Tube>

      {/* Strand 2 (Bio Teal) */}
      <Tube args={[strand2Curve, 48, 0.025, 8, false]}>
        <meshStandardMaterial
          color="#00B4D8"
          emissive="#00B4D8"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </Tube>

      {/* Spheres on strands */}
      {spheres.map((sphere, i) => (
        <Sphere
          key={i}
          position={sphere.position}
          args={[sphere.size, 12, 12]}
        >
          <MeshDistortMaterial
            color={sphere.color}
            emissive={sphere.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.95}
            speed={1.5}
            distort={0.08}
          />
        </Sphere>
      ))}

      {/* Bridge rungs between strands */}
      {bridgePairs.map(([i, j], idx) => {
        const p1 = new THREE.Vector3(
          strand1Points[i][0],
          strand1Points[i][1],
          strand1Points[i][2]
        );
        const p2 = new THREE.Vector3(
          strand2Points[j - count][0],
          strand2Points[j - count][1],
          strand2Points[j - count][2]
        );
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);

        const rungCurve = new THREE.CatmullRomCurve3([
          p1,
          new THREE.Vector3(
            mid.x + (p2.x - p1.x) * 0.2,
            mid.y + 0.05,
            mid.z + (p2.z - p1.z) * 0.2
          ),
          p2,
        ]);

        return (
          <Tube key={`bridge-${idx}`} args={[rungCurve, 8, 0.008, 4, false]}>
            <meshBasicMaterial
              color="#00B4D8"
              transparent
              opacity={0.4}
            />
          </Tube>
        );
      })}

      {/* Glow point light at center */}
      <pointLight
        position={[0, 0, 0]}
        color="#00B4D8"
        intensity={0.6}
        distance={10}
      />

      {/* Small ambient glow sphere */}
      <Sphere args={[0.3, 8, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#00B4D8"
          transparent
          opacity={0.08}
        />
      </Sphere>
    </group>
  );
}
