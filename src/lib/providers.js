export function detectProvider(url) {
  const u = (url || "").toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("tiktok.com")) return "tiktok";
  return "other";
}

export function youtubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.replace("/", "");
    const v = u.searchParams.get("v");
    return v || "";
  } catch {
    return "";
  }
}

export function youtubeThumb(url) {
  const id = youtubeId(url);
  if (!id) return "";
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
