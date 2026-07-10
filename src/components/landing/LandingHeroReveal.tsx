"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type LandingHeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function LandingHeroReveal({
  children,
  className = "",
  delay = 0,
}: LandingHeroRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
