"use client";

import { useEffect, useRef, useState } from "react";
import { LuMic } from "react-icons/lu";
import type { VitrineDictionary } from "@/i18n/types";

const MAX_SECONDS = 120;

type VitrineVoiceCaptureProps = {
  copy: VitrineDictionary;
  onRecorded: (hasVoice: boolean) => void;
};

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VitrineVoiceCapture({ copy, onRecorded }: VitrineVoiceCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [hasVoice, setHasVoice] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    setIsRecording(false);
    setHasVoice(true);
    onRecorded(true);
  };

  const startRecording = async () => {
    setElapsed(0);
    setHasVoice(false);
    setIsRecording(true);
    onRecorded(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.start();
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
      };
    } catch {
      /* Fallback démo sans micro — timer seul */
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
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRecorderRef.current?.stop();
    };
  }, []);

  return (
    <div className="mt-5">
      <p className="text-sm font-bold text-[var(--v-text)]">{copy.voice.title}</p>
      <p className="mt-0.5 text-xs text-[var(--v-muted)]">{copy.voice.maxDuration}</p>
      <button
        type="button"
        onClick={isRecording ? stopRecording : startRecording}
        className={`mt-3 flex min-h-[4rem] w-full items-center justify-center gap-2 rounded-[20px] text-base font-bold transition ${
          isRecording
            ? "animate-pulse bg-red-50 text-red-900 ring-2 ring-red-400"
            : hasVoice
              ? "bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400"
              : "bg-[var(--primary-color)] text-[var(--v-primary-fg)] shadow-lg"
        }`}
      >
        <LuMic className="h-5 w-5" aria-hidden />
        {isRecording
          ? copy.voice.recording
          : hasVoice
            ? copy.voice.added
            : copy.voice.record}
      </button>
      {isRecording ? (
        <p className="mt-2 text-center text-sm font-semibold text-[var(--v-text)]">
          {copy.voice.timerLabel} : {formatTimer(elapsed)} / {formatTimer(MAX_SECONDS)}
        </p>
      ) : null}
      {isRecording ? (
        <p className="mt-1 text-center text-xs text-[var(--v-muted)]">{copy.voice.stop}</p>
      ) : null}
    </div>
  );
}
