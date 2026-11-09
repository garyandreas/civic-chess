/**
 * Aturan progres per materi (dipakai bersama di Beranda, Materi, dan Quis).
 * - Selesai membaca seluruh halaman + ringkasan  -> 90%
 * - Selesai mengerjakan Quis                     -> 100%
 */
export type ProgressFlags = {
  readDone: boolean;
  videoDone: boolean;
  summaryDone: boolean;
  quizDone: boolean;
};

/** Batas minimal progres materi agar Quis materi tersebut terbuka. */
export const QUIZ_UNLOCK_PCT = 80;

export function calcMateriPct(p?: ProgressFlags | null) {
  if (!p) return 0;
  if (p.quizDone) return 100;
  if (p.readDone && p.summaryDone) return 90;
  if (p.readDone || p.summaryDone || p.videoDone) return 45;
  return 0;
}

export function isQuizUnlocked(p?: ProgressFlags | null) {
  return calcMateriPct(p) >= QUIZ_UNLOCK_PCT;
}
