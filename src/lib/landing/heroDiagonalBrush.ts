/** Vue + silhouette d’un coup de pinceau ondulé en diagonale (SVG natif, fond transparent). */
export const HERO_DIAGONAL_BRUSH_VIEWBOX = "0 0 1200 720";

/** Ruban ondulé classique — bord supérieur + inférieur, franges organiques aux extrémités. */
export const HERO_DIAGONAL_BRUSH_PATH = `
  M -60 118
  C 40 78, 120 188, 240 148
  S 420 98, 540 168
  S 720 118, 860 198
  S 1020 148, 1140 218
  C 1200 248, 1260 198, 1320 238
  L 1348 228
  L 1372 252
  L 1340 268
  C 1280 288, 1220 248, 1160 268
  S 1000 228, 880 248
  S 700 208, 560 258
  S 380 218, 240 268
  S 80 238, -80 288
  L -100 268
  L -72 248
  Z
`.replace(/\s+/g, " ").trim();

export const HERO_PEACH = "#EFA188";
export const HERO_PEACH_DEEP = "#E08A6F";
