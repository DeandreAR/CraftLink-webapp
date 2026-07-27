"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type LandingHeroRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Révélation sans opacity:0 initiale — évite de retarder le LCP. */
export function LandingHeroReveal({
  children,
  className = "",
  delay = 0,
}: LandingHeroRevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { y: 14 }}
      animate={{ y: 0 }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
