"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type HeroRotatingTitleProps = {
  before: string;
  words: string[];
  after: string;
  className?: string;
};

const INTERVAL_MS = 2500;

/** Mot rotatif : surlignage marqueur pour rester lisible sur le brush pêche. */
const rotatingWordClass =
  "rounded-[0.28em] bg-[linear-gradient(transparent_58%,rgba(239,161,136,0.55)_58%)] px-[0.12em] text-black";

/** H1 hero avec mot dynamique — la virgule suit le mot en alternance. */
export function HeroRotatingTitle({
  before,
  words,
  after,
  className = "",
}: HeroRotatingTitleProps) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const safeWords = words.length > 0 ? words : [""];
  const current = safeWords[index % safeWords.length] ?? "";

  const longestWord = useMemo(
    () => safeWords.reduce((a, b) => (b.length > a.length ? b : a), safeWords[0] ?? ""),
    [safeWords],
  );

  useEffect(() => {
    if (reduce || safeWords.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % safeWords.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduce, safeWords.length]);

  return (
    <h1 className={`lk-display text-3xl md:text-4xl lg:text-[2.75rem] ${className}`.trim()}>
      <span className="text-black">{before}</span>{" "}
      <span className="relative inline-grid align-baseline">
        {/* Réserve la largeur du plus long mot — opacity-0, pas de couleur visible */}
        <span
          className="pointer-events-none col-start-1 row-start-1 select-none whitespace-nowrap opacity-0"
          aria-hidden
        >
          <span className={rotatingWordClass}>{longestWord}</span>
          <span>,</span>
        </span>
        {reduce ? (
          <span className="col-start-1 row-start-1 whitespace-nowrap">
            <span className={rotatingWordClass}>{safeWords[0]}</span>
            <span className="text-black">,</span>
          </span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current}
              className="col-start-1 row-start-1 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className={rotatingWordClass}>{current}</span>
              <span className="text-black">,</span>
            </motion.span>
          </AnimatePresence>
        )}
      </span>{" "}
      <span className="text-black">{after.replace(/^,\s*/, "")}</span>
    </h1>
  );
}
