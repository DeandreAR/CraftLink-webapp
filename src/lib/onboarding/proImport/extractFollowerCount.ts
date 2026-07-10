const FOLLOWER_KEYS = [
  "follower_count",
  "followers_count",
  "followers",
  "fans",
  "fan_count",
  "likes",
  "subscribers",
] as const;

function parseCount(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof value === "string") {
    const digits = value.replace(/\s/g, "").replace(/[^\d]/g, "");
    const parsed = Number(digits);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  return null;
}

export function extractFollowerCountFromRecord(
  record: Record<string, unknown> | null | undefined,
): number | null {
  if (!record) return null;

  const edgeFollowedBy = record.edge_followed_by;
  if (edgeFollowedBy && typeof edgeFollowedBy === "object" && "count" in edgeFollowedBy) {
    const fromEdge = parseCount((edgeFollowedBy as { count?: unknown }).count);
    if (fromEdge) return fromEdge;
  }

  for (const key of FOLLOWER_KEYS) {
    const value = parseCount(record[key]);
    if (value) return value;
  }

  return null;
}

export function deepFindFollowerCount(node: unknown, depth = 0): number | null {
  if (depth > 14 || node == null) return null;

  if (Array.isArray(node)) {
    for (const item of node) {
      const found = deepFindFollowerCount(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  if (typeof node !== "object") return null;

  const fromRecord = extractFollowerCountFromRecord(node as Record<string, unknown>);
  if (fromRecord) return fromRecord;

  for (const value of Object.values(node as Record<string, unknown>)) {
    const found = deepFindFollowerCount(value, depth + 1);
    if (found) return found;
  }

  return null;
}
