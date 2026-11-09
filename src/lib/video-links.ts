/**
 * Daftar Link Video YouTube untuk Setiap Modul (Modul 1 s.d. Modul 4).
 *
 * Cara menambahkan video untuk modul lain:
 * Cukup tempelkan link YouTube (format youtu.be/... atau youtube.com/watch?v=...)
 * pada nomor modul yang sesuai di bawah ini.
 */
export const MODULE_YOUTUBE_LINKS: Record<number, string> = {
  1: "https://youtu.be/iXiVCXo13SE?si=0kTxqzsxka0nSWLt",
  2: "", // Tambahkan link YouTube Modul 2 di sini
  3: "", // Tambahkan link YouTube Modul 3 di sini
  4: "", // Tambahkan link YouTube Modul 4 di sini
};

/**
 * Mengekstrak ID video YouTube (11 karakter) dari berbagai format URL YouTube
 * (youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID).
 */
export function extractYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Jika sudah berupa ID 11 karakter murni
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes("youtube.com")) {
      const v = url.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

      const parts = url.pathname.split("/").filter(Boolean);
      const embedIdx = parts.findIndex(
        (p) => p === "embed" || p === "shorts" || p === "v"
      );
      if (embedIdx >= 0 && parts[embedIdx + 1]) {
        const id = parts[embedIdx + 1];
        return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
    }
  } catch {
    // Abaikan jika bukan URL valid
  }

  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}
