"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useResizableColumns<T extends string>(
  initial: Record<T, number>,
  minWidth = 56,
) {
  const [widths, setWidths] = useState(initial);
  const dragging = useRef<{ column: T; startX: number; startWidth: number } | null>(null);

  const startResize = useCallback(
    (column: T, clientX: number) => {
      dragging.current = {
        column,
        startX: clientX,
        startWidth: widths[column],
      };
    },
    [widths],
  );

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      if (!dragging.current) return;
      const { column, startX, startWidth } = dragging.current;
      const next = Math.max(minWidth, startWidth + event.clientX - startX);
      setWidths((prev) => ({ ...prev, [column]: next }));
    };

    const onUp = () => {
      dragging.current = null;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [minWidth]);

  return { widths, startResize };
}
