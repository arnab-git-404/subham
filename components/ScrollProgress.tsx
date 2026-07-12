"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [visible, setVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Heartbeat pulse line */}
      <motion.div
        className="fixed left-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-clinical-blue via-bio-teal to-clinical-blue"
        style={{ scaleX: scaleY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      {/* Vertical line on left edge */}
      <motion.div
        className="fixed left-0 top-0 z-[100] h-full w-[3px] bg-gradient-to-b from-clinical-blue/30 via-bio-teal/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
}
