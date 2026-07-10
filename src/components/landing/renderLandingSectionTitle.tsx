import type { ReactNode } from "react";
import type { LandingSectionHeaderCopy } from "@/i18n/landing/types";

export function renderLandingSectionTitle(
  header: LandingSectionHeaderCopy,
): ReactNode {
  const { title, titleHighlight } = header;
  if (!titleHighlight || !title.includes(titleHighlight)) {
    return title;
  }

  const [before, ...rest] = title.split(titleHighlight);
  const after = rest.join(titleHighlight);

  return (
    <>
      {before}
      <span className="lk-marker">{titleHighlight}</span>
      {after}
    </>
  );
}
