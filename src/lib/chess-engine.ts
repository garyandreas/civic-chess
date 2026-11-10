/**
 * Mesin catur ringan untuk Civic Chess (berjalan di browser).
 * - Evaluasi: nilai material + tabel posisi bidak (piece-square table)
 * - Pencarian: negamax + alpha-beta + urutan langkah (makan bidak dulu)
 * Semua skor dalam centipawn (100 = 1 pion). Positif = menguntungkan Putih.
 *
 * Catatan performa: pencarian memakai fungsi internal chess.js (_moves, _makeMove,
 * _undoMove) yang tidak membuat FEN/SAN di setiap langkah sehingga jauh lebih cepat.
 * Karena itu versi chess.js dikunci ke 1.4.0 di package.json.
 */
import { Chess, type Move } from "chess.js";

export const MATE_SCORE = 100000;

type Color = "w" | "b";
type PieceType = "p" | "n" | "b" | "r" | "q" | "k";
type InternalMove = {
  color: Color;
  from: number;
  to: number;
  piece: PieceType;
  captured?: PieceType;
  promotion?: PieceType;
  flags: number;
};
type InternalChess = {
  _board: ({ type: PieceType; color: Color } | undefined)[];
  _turn: Color;
  _moves(opts?: { legal?: boolean }): InternalMove[];
  _makeMove(m: InternalMove): void;
  _undoMove(): InternalMove | null;
  _isKingAttacked(color: Color): boolean;
};

const PIECE_VALUE: Record<PieceType, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0,
};

// Tabel posisi dari sudut pandang Putih (baris 0 = rank 8)
const PST: Record<PieceType, number[][]> = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50],
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20],
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0],
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20],
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20],
  ],
};

function toInternal(game: Chess): InternalChess {
  return game as unknown as InternalChess;
}

function sqName(sq: number): string {
  return "abcdefgh"[sq & 7] + String(8 - (sq >> 4));
}

/** Evaluasi statis posisi (sudut pandang Putih). */
function staticEval(g: InternalChess): number {
  let score = 0;
  const board = g._board;
  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) {
      sq += 7;
      continue;
    }
    const piece = board[sq];
    if (!piece) continue;
    const r = sq >> 4;
    const c = sq & 7;
    const row = piece.color === "w" ? r : 7 - r;
    const v = PIECE_VALUE[piece.type] + PST[piece.type][row][c];
    score += piece.color === "w" ? v : -v;
  }
  return score;
}

function moveOrderScore(m: InternalMove): number {
  let s = 0;
  if (m.captured) s += 10 * PIECE_VALUE[m.captured] - PIECE_VALUE[m.piece] / 10 + 1000;
  if (m.promotion) s += 800;
  return s;
}

function orderMoves(moves: InternalMove[]): InternalMove[] {
  return moves.sort((a, b) => moveOrderScore(b) - moveOrderScore(a));
}

/** Negamax: skor dari sudut pandang pihak yang sedang melangkah. */
function negamax(g: InternalChess, depth: number, alpha: number, beta: number, ply: number): number {
  if (depth === 0) {
    // Di daun: evaluasi statis (cek skakmat hanya jika sedang skak)
    if (g._isKingAttacked(g._turn) && g._moves({ legal: true }).length === 0) {
      return -MATE_SCORE + ply;
    }
    const e = staticEval(g);
    return g._turn === "w" ? e : -e;
  }

  const moves = g._moves({ legal: true });
  if (moves.length === 0) {
    return g._isKingAttacked(g._turn) ? -MATE_SCORE + ply : 0;
  }

  let best = -Infinity;
  for (const m of orderMoves(moves)) {
    g._makeMove(m);
    const score = -negamax(g, depth - 1, -beta, -alpha, ply + 1);
    g._undoMove();
    if (score > best) best = score;
    if (score > alpha) alpha = score;
    if (alpha >= beta) break;
  }
  return best;
}

/** Skor langkah-langkah root (sudut pandang pihak yang melangkah). */
function scoreRootMoves(game: Chess, depth: number, exact: boolean) {
  const work = toInternal(new Chess(game.fen()));
  const moves = orderMoves(work._moves({ legal: true }));
  const results: { move: InternalMove; score: number }[] = [];
  let bestSoFar = -Infinity;
  for (const m of moves) {
    work._makeMove(m);
    // exact=true: skor tiap langkah dihitung penuh (dibutuhkan untuk memilih blunder)
    const beta = exact ? Infinity : -bestSoFar;
    const score = -negamax(work, Math.max(0, depth - 1), -Infinity, beta, 1);
    work._undoMove();
    if (score > bestSoFar) bestSoFar = score;
    results.push({ move: m, score });
  }
  return results;
}

/** Ubah langkah internal menjadi objek Move publik chess.js. */
function toPublicMove(game: Chess, m: InternalMove): Move | null {
  const from = sqName(m.from);
  const to = sqName(m.to);
  const candidates = game.moves({ verbose: true });
  return (
    candidates.find(
      (c) => c.from === from && c.to === to && (c.promotion ?? undefined) === (m.promotion ?? undefined)
    ) ?? null
  );
}

/** Langkah terbaik untuk pihak yang sedang melangkah. */
export function findBestMove(game: Chess, depth: number): { move: Move; score: number } | null {
  const scored = scoreRootMoves(game, depth, false);
  if (scored.length === 0) return null;
  scored.sort((a, b) => b.score - a.score);
  const move = toPublicMove(game, scored[0].move);
  return move ? { move, score: scored[0].score } : null;
}

/**
 * Evaluasi posisi untuk bar penguasaan (sudut pandang Putih, centipawn).
 * Memakai pencarian dangkal agar bidak yang "menggantung" ikut terhitung.
 */
export function evaluatePosition(game: Chess, depth = 2): number {
  const work = toInternal(new Chess(game.fen()));
  const s = negamax(work, depth, -Infinity, Infinity, 0);
  return work._turn === "w" ? s : -s;
}

/** Langkah bot sesuai tingkat kesulitan materi. */
export function chooseBotMove(game: Chess, depth: number, blunderRate: number): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;
  if (Math.random() * 100 < blunderRate) {
    return moves[Math.floor(Math.random() * moves.length)];
  }
  const scored = scoreRootMoves(game, depth, true);
  // Sedikit variasi agar permainan tidak selalu sama
  scored.forEach((s) => (s.score += (Math.random() - 0.5) * 20));
  scored.sort((a, b) => b.score - a.score);
  return scored[0] ? toPublicMove(game, scored[0].move) : null;
}

/**
 * Langkah blunder (sengaja buruk) untuk pihak yang sedang melangkah.
 * Dipilih dari langkah dengan skor paling jelek, namun sebisa mungkin
 * bukan langkah yang langsung kalah skakmat agar permainan tetap berjalan.
 */
export function findBlunderMove(game: Chess): Move | null {
  const scored = scoreRootMoves(game, 2, true);
  if (scored.length === 0) return null;
  const notInstantLoss = scored.filter((s) => s.score > -MATE_SCORE / 2);
  const pool = (notInstantLoss.length > 0 ? notInstantLoss : scored).sort(
    (a, b) => a.score - b.score
  );
  const worst = pool.slice(0, Math.min(2, pool.length));
  return toPublicMove(game, worst[Math.floor(Math.random() * worst.length)].move);
}

/** Ubah skor centipawn menjadi persentase bagian Putih pada bar penguasaan (0–100). */
export function evalToWhitePercent(cp: number): number {
  if (cp >= MATE_SCORE / 2) return 100;
  if (cp <= -MATE_SCORE / 2) return 0;
  const pct = 50 + 50 * (2 / (1 + Math.exp(-0.004 * cp)) - 1);
  return Math.max(3, Math.min(97, pct));
}

/** Label skor untuk bar penguasaan, mis. "+1.2", "-0.5", "M". */
export function formatEval(cp: number): string {
  if (Math.abs(cp) >= MATE_SCORE / 2) return cp > 0 ? "M" : "-M";
  const v = cp / 100;
  return `${v > 0 ? "+" : ""}${v.toFixed(1)}`;
}
