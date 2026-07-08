import { HERO_DIAGONAL_BRUSH_VIEWBOX, HERO_PEACH } from "@/lib/landing/heroDiagonalBrush";

export { HERO_DIAGONAL_BRUSH_VIEWBOX };

/** Trait central — rendu peinture (stroke épais, caps arrondis). */
export const HERO_BRUSH_STROKE_PATH = `
  M -80 468
  C 120 398, 260 428, 400 368
  S 620 308, 760 358
  S 980 318, 1120 278
  S 1260 248, 1340 268
`.replace(/\s+/g, " ").trim();

/** Silhouette remplie — bords irréguliers (franges + ondulations). */
export const HERO_BRUSH_FILL_PATH = `
  M -72 452
  C 48 418, 108 448, 188 422
  C 268 396, 328 438, 408 408
  C 488 378, 548 418, 628 388
  C 708 358, 768 398, 848 368
  C 928 338, 988 378, 1068 348
  C 1148 318, 1208 358, 1288 328
  C 1338 308, 1368 322, 1388 338
  L 1402 352
  L 1388 368
  C 1362 382, 1328 372, 1298 388
  C 1218 418, 1158 378, 1078 408
  C 998 438, 938 398, 858 428
  C 778 458, 718 418, 638 448
  C 558 478, 498 438, 418 468
  C 338 498, 278 458, 198 488
  C 118 518, 58 478, -22 508
  C -52 522, -78 508, -92 492
  L -78 476
  Z
`.replace(/\s+/g, " ").trim();

/** Contour secondaire — relief / trace de poils. */
export const HERO_BRUSH_BRISTLE_PATH = `
  M 40 432
  C 180 392, 320 412, 460 372
  S 700 332, 840 382
  S 1020 342, 1180 302
`.replace(/\s+/g, " ").trim();

export const HERO_PEACH_PAINT_DEEP = "#D97A5E";
export const HERO_PEACH_LIGHT = "#F5C4B4";
export const HERO_BRUSH_FILTER_ID = "hero-brush-roughen";
export const HERO_BRUSH_GRADIENT_ID = "hero-brush-paint-gradient";

export const HERO_PAINT_PEACH = HERO_PEACH;
