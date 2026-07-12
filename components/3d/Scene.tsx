"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/LoadingSpinner";

const DNAHelix = dynamic(() => import("@/components/3d/DNAHelix"), {
  ssr: false,
});

const ParticleField = dynamic(() => import("@/components/3d/ParticleField"), {
  ssr: false,
});

function SceneContent({
  mouseX,
  mouseY,
  isReducedMotion,
  isMobile,
}: {
  mouseX: number;
  mouseY: number;
  isReducedMotion: boolean;
  isMobile: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#0077B6" />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3}
        color="#00B4D8"
      />

      <Suspense fallback={null}>
        <DNAHelix
          mouseX={mouseX}
          mouseY={mouseY}
          isReducedMotion={isReducedMotion}
        />
        <ParticleField
          isReducedMotion={isReducedMotion}
          isMobile={isMobile}
        />
      </Suspense>

      {!isMobile && !isReducedMotion && (
        <EffectComposer>
          <Bloom
            intensity={0.4}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function Scene3D() {
  const [mounted, setMounted] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Check for reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mq.matches);
    mq.addEventListener("change", (e) => setIsReducedMotion(e.matches));

    // Check mobile
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) setWebglSupported(false);
    } catch {
      setWebglSupported(false);
    }

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth) * 2 - 1);
      setMouseY(-((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      mq.removeEventListener("change", () => {});
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!mounted || !webglSupported) {
    return (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-clinical-blue/10 to-bio-teal/10" />
          <p className="text-xs text-muted-foreground">
            {!webglSupported
              ? "3D canvas not supported"
              : "Loading 3D scene..."}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-full w-full"
      >
        <Canvas
          dpr={[1, isMobile ? 1.5 : 2]}
          camera={{ position: [1.2, 0.8, 7], fov: 42 }}
          style={{ background: "transparent" }}
          gl={{
            antialias: !isMobile,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <SceneContent
            mouseX={mouseX}
            mouseY={mouseY}
            isReducedMotion={isReducedMotion}
            isMobile={isMobile}
          />
        </Canvas>
      </motion.div>
    </div>
  );
}
