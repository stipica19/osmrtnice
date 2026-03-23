export function toCloudinaryAvif(url: string | null | undefined): string {
  if (!url) return "";

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (!parsed.hostname.endsWith("res.cloudinary.com")) {
    return url;
  }

  const marker = "/upload/";
  const path = parsed.pathname;
  const markerIndex = path.indexOf(marker);

  if (markerIndex === -1) {
    return url;
  }

  const before = path.slice(0, markerIndex + marker.length);
  const after = path.slice(markerIndex + marker.length);

  if (/(^|,)f_avif(,|$)/.test(after)) {
    return parsed.toString();
  }

  parsed.pathname = `${before}f_avif,q_auto/${after}`;
  return parsed.toString();
}
