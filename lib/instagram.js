const FALLBACK = Array.from({ length: 8 }, (_, i) => ({
  id: "stub-" + i,
  src: null,
  url: "https://instagram.com/jarana_para_todos",
  alt: "",
  label: "IG POST " + String(i + 1).padStart(2, "0")
}));

/** Lee el feed JSON de Behold en el servidor. Revalida cada 10 min. */
export async function getInstagramPosts(limit = 8) {
  const url = process.env.BEHOLD_FEED_URL;
  if (!url) return FALLBACK.slice(0, limit);
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return FALLBACK.slice(0, limit);
    const data = await res.json();
    const raw = Array.isArray(data) ? data : data.posts || data.media || [];
    const posts = raw.slice(0, limit).map((p, i) => ({
      id: p.id || "ig-" + i,
      src: p.sizes?.medium?.mediaUrl || p.thumbnailUrl || p.mediaUrl || null,
      url: p.permalink || "https://instagram.com/jarana_para_todos",
      alt: (p.prunedCaption || p.caption || "Jarana Para Todos").slice(0, 90),
      label: ""
    })).filter((p) => p.src);
    return posts.length ? posts : FALLBACK.slice(0, limit);
  } catch {
    return FALLBACK.slice(0, limit);
  }
}
