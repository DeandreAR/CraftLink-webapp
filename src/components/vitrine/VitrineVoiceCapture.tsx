"use client";

import { useEffect, useRef, useState } from "react";
import { LuMic, LuPlay } from "react-icons/lu";
import type { VitrineDictionary } from "@/i18n/types";

const MAX_SECONDS = 120;

type VitrineVoiceCaptureProps = {
  copy: VitrineDictionary;
  onRecorded: (hasVoice: boolean) => void;
  variant?: "default" | "compact";
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VitrineVoiceCapture({
  copy,
  onRecorded,
  variant = "default",
}: VitrineVoiceCaptureProps) {
  const isCompact = variant === "compact";
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const stopRecording = () => {
    clearTimer();
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setHasVoice(true);
    onRecorded(true);
  };

  const startRecording = async () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    chunksRef.current = [];
    setElapsed(0);
    setHasVoice(false);
    setIsRecording(true);
    onRecorded(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        if (chunksRef.current.length > 0) {
          const blob = new Blob(chunksRef.current, { type: "audio/webm" });
          setAudioUrl(URL.createObjectURL(blob));
        }
      };

      recorder.start();
    } catch {
      /* Fallback démo sans micro */
    }

    timerRef.current = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= MAX_SECONDS) {
          stopRecording();
          return MAX_SECONDS;
        }
        return prev + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimer();
      mediaRecorderRef.current?.stop();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const recordButtonClass = isCompact
    ? `inline-flex min-h-[2.5rem] items-center justify-center gap-2 rounded-xl border-2 px-4 text-xs font-semibold transition ${
        isRecording
          ? "animate-pulse border-red-300 bg-red-50 text-red-800"
          : hasVoice
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : "border-[var(--primary-color)]/35 bg-white text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_6%,white)]"
      }`
    : `flex min-h-[3.75rem] w-full items-center justify-center gap-2 rounded-[20px] text-sm font-bold transition ${
        isRecording
          ? "animate-pulse bg-red-50 text-red-900 ring-2 ring-red-400"
          : hasVoice
            ? "bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400"
            : "bg-[var(--primary-color)] text-[var(--v-primary-fg)] shadow-lg"
      }`;

  return (
    <div className={isCompact ? "mt-3" : "mt-4"}>
      {!isCompact ? (
        <>
          <p className="text-sm font-bold text-[var(--v-text)]">{copy.voice.title}</p>
          <p className="mt-0.5 text-xs text-[var(--v-muted)]">{copy.voice.maxDuration}</p>
        </>
      ) : (
        <p className="mb-2 text-xs text-[var(--v-muted)]">{copy.voice.orRecord}</p>
      )}

      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`${recordButtonClass} ${isCompact ? "" : "mt-3 w-full"}`}
      >
        <LuMic className={isCompact ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        {isRecording
          ? copy.voice.recording
          : hasVoice
            ? copy.voice.added
            : copy.voice.record}
      </button>

      {isRecording ? (
        <p
          className={`text-[var(--v-text)] ${isCompact ? "mt-1.5 text-xs" : "mt-2 text-center text-sm font-semibold"}`}
        >
          {copy.voice.timerLabel} : {formatTimer(elapsed)} / {formatTimer(MAX_SECONDS)}
        </p>
      ) : null}

      {isRecording && !isCompact ? (
        <p className="mt-1 text-center text-xs text-[var(--v-muted)]">{copy.voice.stop}</p>
      ) : null}

      {hasVoice && audioUrl ? (
        <div
          className={`rounded-xl border border-[var(--v-muted)]/20 bg-[var(--v-surface)] p-2.5 ${isCompact ? "mt-2" : "mt-3"}`}
        >
          <audio ref={audioRef} src={audioUrl} controls className="h-8 w-full" />
          <button
            type="button"
            onClick={() => audioRef.current?.play()}
            className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--v-muted)]/20 py-1.5 text-[11px] font-semibold text-[var(--v-text)]"
          >
            <LuPlay className="h-3.5 w-3.5" aria-hidden />
            {copy.voice.replay}
          </button>
        </div>
      ) : null}
    </div>
  );
}
