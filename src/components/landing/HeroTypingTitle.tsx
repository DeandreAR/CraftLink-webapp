"use client";

import { useEffect, useState } from "react";
import type { HeroTypingChannel } from "@/i18n/types";

type HeroTypingTitleProps = {
  intro: string;
  channels: HeroTypingChannel[];
  className?: string;
};

const TYPING_MS = 85;
const DELETING_MS = 45;
const PAUSE_AFTER_WORD_MS = 1800;

export function HeroTypingTitle({
  intro,
  channels,
  className = "",
}: HeroTypingTitleProps) {
  const [channelIndex, setChannelIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const current = channels[channelIndex]?.label ?? "";
  const currentColor = channels[channelIndex]?.color ?? "#EFA188";

  useEffect(() => {
    if (!current) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayText === current) {
      timeout = setTimeout(() => setIsDeleting(true), PAUSE_AFTER_WORD_MS);
    } else if (!isDeleting && displayText.length < current.length) {
      timeout = setTimeout(
        () => setDisplayText(current.slice(0, displayText.length + 1)),
        TYPING_MS,
      );
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(
        () => setDisplayText(displayText.slice(0, -1)),
        DELETING_MS,
      );
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setChannelIndex((i) => (i + 1) % channels.length);
    }

    return () => clearTimeout(timeout);
  }, [current, displayText, isDeleting, channels.length]);

  useEffect(() => {
    setDisplayText("");
    setIsDeleting(false);
  }, [channelIndex]);

  return (
    <h1
      className={`lk-display text-[2.35rem] font-semibold leading-[1.08] text-[#212129] md:text-5xl lg:text-[3.15rem] ${className}`.trim()}
    >
      {intro}
      <span style={{ color: currentColor }}>{displayText}</span>
      <span className="animate-pulse" style={{ color: currentColor }}>
        |
      </span>
    </h1>
  );
}
