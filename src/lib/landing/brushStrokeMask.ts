import type { CSSProperties } from "react";

/** Silhouette coup de pinceau horizontal — franges gauche, poils secs droite. */
export const BRUSH_STROKE_PATH = `
  M -32,98
  C -28,72 -18,118 -8,82
  C 2,58 8,108 18,68
  C 28,48 22,102 38,62
  C 52,42 44,98 62,58
  C 78,44 70,104 90,64
  C 108,50 98,110 122,66
  C 142,52 132,112 158,68
  C 178,54 168,114 198,70
  C 218,56 208,116 242,72
  C 262,58 252,118 290,74
  C 310,60 300,120 342,76
  C 362,62 352,122 398,78
  C 418,64 408,124 458,80
  C 478,66 468,126 522,82
  C 542,68 532,128 590,84
  C 610,70 600,130 662,86
  C 682,72 672,132 738,88
  C 758,74 748,134 818,90
  C 838,76 828,136 902,92
  C 922,78 912,138 990,94
  C 1010,80 1000,140 1082,96
  C 1102,82 1092,142 1178,98
  C 1198,84 1188,118 1210,90
  L 1238,82 L 1268,78 L 1298,74 L 1328,70
  L 1358,76 L 1388,72 L 1418,78 L 1448,74
  L 1428,88 L 1398,92 L 1368,86 L 1338,94
  L 1308,90 L 1278,98 L 1248,94 L 1218,102
  L 1188,98 L 1158,106 L 1128,102 L 1098,110
  L 1068,106 L 1038,114 L 1008,110 L 978,118
  L 948,114 L 918,122 L 888,118 L 858,126
  L 828,122 L 798,130 L 768,126 L 738,134
  L 708,130 L 678,138 L 648,134 L 618,142
  L 588,138 L 558,146 L 528,142 L 498,150
  L 468,146 L 438,154 L 408,150 L 378,158
  L 348,154 L 318,162 L 288,158 L 258,166
  L 228,162 L 198,170 L 168,166 L 138,174
  L 108,170 L 78,178 L 48,174 L 18,182
  L -12,178 L -32,170
  Z
`.replace(/\s+/g, " ").trim();

export function brushStrokeMaskDataUri(): string {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 200">',
    `<path fill="white" d="${BRUSH_STROKE_PATH}"/>`,
    "</svg>",
  ].join("");
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const BRUSH_MASK_URI = brushStrokeMaskDataUri();

export const BRUSH_MASK_STYLE: CSSProperties = {
  maskImage: `url("${BRUSH_MASK_URI}")`,
  WebkitMaskImage: `url("${BRUSH_MASK_URI}")`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskPosition: "center",
};
