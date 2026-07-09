"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LOADER_MS = 950;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

type DashboardEntranceProps = {
  loadingLabel: string;
  children: React.ReactNode;
};

export function DashboardEntrance({ loadingLabel, children }: DashboardEntranceProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), LOADER_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {!ready ? (
          <motion.div
            key="dashboard-loader"
            role="status"
            aria-live="polite"
            aria-busy="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35 } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-6"
          >
            <p className="text-sm font-semibold text-[#212129]">CraftLink</p>
            <motion.p
              className="mt-6 text-sm font-medium text-neutral-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              {loadingLabel}
            </motion.p>
            <div className="mt-5 h-1 w-40 overflow-hidden rounded-full bg-neutral-100">
              <motion.div
                className="h-full rounded-full bg-[#EFA188]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: LOADER_MS / 1000, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {ready ? (
          <motion.div
            key="dashboard-content"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
