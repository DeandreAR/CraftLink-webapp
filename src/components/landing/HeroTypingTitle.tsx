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
  const [typingReady, setTypingReady] = useState(false);

  const current = channels[channelIndex]?.label ?? "";
  const currentColor = channels[channelIndex]?.color ?? "#EFA188";
  const firstChannel = channels[0];

  useEffect(() => {
    setTypingReady(true);
  }, []);

  useEffect(() => {
    if (!typingReady || !current) return;

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
  }, [current, displayText, isDeleting, channels.length, typingReady]);

  useEffect(() => {
    if (!typingReady) return;
    setDisplayText("");
    setIsDeleting(false);
  }, [channelIndex, typingReady]);

  const titleClass =
    `lk-display landing-hero-title mt-5 text-[2rem] leading-[1.08] text-black sm:text-[2.5rem] md:text-[3rem] lg:text-[3.35rem] ${className}`.trim();

  const channelLabel =
    !typingReady && firstChannel ? firstChannel.label : displayText;
  const channelColor =
    !typingReady && firstChannel ? firstChannel.color : currentColor;

  return (
    <h1 className={titleClass}>
      {intro}
      <span style={{ color: channelColor }}>{channelLabel}</span>
      {typingReady ? (
        <span className="animate-pulse" style={{ color: channelColor }} aria-hidden>
          |
        </span>
      ) : null}
    </h1>
  );
}
