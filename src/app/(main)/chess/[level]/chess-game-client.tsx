"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Chess, type Square, type Move } from "chess.js";
import { Check, RotateCcw } from "lucide-react";

type QuestionItem = {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

const PIECE_UNICODE: Record<string, string> = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚",
};

const PIECE_VALUE: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20000,
};

function evaluateBoard(game: Chess): number {
  if (game.isCheckmate()) {
    return game.turn() === "w" ? -99999 : 99999;
  }
  if (game.isDraw()) return 0;

  let score = 0;
  const board = game.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const val = PIECE_VALUE[piece.type] ?? 0;
      score += piece.color === "w" ? val : -val;
    }
  }
  return score;
}

function chooseBotMove(
  game: Chess,
  depth: number,
  blunderRate: number
): Move | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  if (Math.random() * 100 < blunderRate) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  let bestMove = moves[0];
  let bestEval = Infinity;

  for (const m of moves) {
    game.move(m);
    const val = minimax(
      game,
      Math.max(0, depth - 1),
      -Infinity,
      Infinity,
      true
    );
    game.undo();
    const jitter = (Math.random() - 0.5) * 15;
    if (val + jitter < bestEval) {
      bestEval = val + jitter;
      bestMove = m;
    }
  }
  return bestMove;
}

function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizingWhite: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }
  const moves = game.moves({ verbose: true });
  if (maximizingWhite) {
    let maxEval = -Infinity;
    for (const m of moves) {
      game.move(m);
      const ev = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      if (ev > maxEval) maxEval = ev;
      if (ev > alpha) alpha = alpha = ev;
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const m of moves) {
      game.move(m);
      const ev = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      if (ev < minEval) minEval = ev;
      if (ev < beta) beta = ev;
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

export function ChessGameClient({
  levelId,
  levelNumber,
  botDepth,
  blunderRate,
  moduleOrder,
  initialPoints = 840,
  questions,
  allLevels = [],
}: {
  levelId: string;
  levelNumber: number;
  levelTitle: string;
  difficulty: string;
  botDepth: number;
  blunderRate: number;
  moduleOrder: number;
  moduleTitle: string;
  initialPoints?: number;
  questions: QuestionItem[];
  allLevels?: { number: number; title: string }[];
}) {
  const gameRef = useRef<Chess>(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [points, setPoints] = useState(initialPoints);
  const [showPieces, setShowPieces] = useState(true);

  // State pertanyaan giliran ini di kartu kanan
  const [qIdx, setQIdx] = useState(0);
  const [answering, setAnswering] = useState(false);
  const [chosenOpt, setChosenOpt] = useState<number | null>(null);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [questionsTotal, setQuestionsTotal] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const currentQuestion: QuestionItem =
    questions[qIdx % Math.max(1, questions.length)] ?? {
      id: "default",
      text: "Apa yang dimaksud dengan hak pilih aktif dalam sistem demokrasi Indonesia?",
      options: [
        "Hak warga negara untuk memilih wakil rakyat dalam pemilu",
        "Hak untuk dipilih menjadi pejabat negara",
        "Kewajiban membayar pajak tepat waktu",
        "Hak mendirikan organisasi kemasyarakatan",
      ],
      answerIndex: 0,
      explanation:
        "Hak pilih aktif adalah hak warga negara untuk memberikan suara (memilih) dalam pemilihan umum.",
    };

  function nextQuestion() {
    setQIdx((i) => i + 1);
    setAnswering(false);
    setChosenOpt(null);
  }

  function scheduleBotMove() {
    setTimeout(() => {
      const g = gameRef.current;
      if (g.isGameOver() || g.turn() !== "b") return;
      const botMove = chooseBotMove(g, botDepth, blunderRate);
      if (!botMove) return;
      g.move(botMove);
      setFen(g.fen());

      if (g.isGameOver()) {
        const res = g.isCheckmate() ? "LOSE" : "DRAW";
        saveGameResult(res);
        setStatusMessage(
          res === "LOSE"
            ? "Skakmat! Bot menang. Klik Reset Papan untuk main lagi."
            : "Permainan berakhir seri."
        );
      }
    }, 350);
  }

  async function saveGameResult(result: "WIN" | "LOSE" | "DRAW") {
    try {
      await fetch("/api/chess/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          levelId,
          result,
          questionsCorrect,
          questionsTotal,
        }),
      });
    } catch {
      // ignore
    }
  }

  function handleSquareClick(sq: Square) {
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() !== "w") return;

    if (selectedSquare && legalTargets.includes(sq)) {
      const move = g.move({
        from: selectedSquare,
        to: sq,
        promotion: "q",
      });
      setSelectedSquare(null);
      setLegalTargets([]);

      if (move) {
        setFen(g.fen());
        if (g.isGameOver()) {
          const res = g.isCheckmate() ? "WIN" : "DRAW";
          setPoints((p) => p + (res === "WIN" ? 50 : 10));
          saveGameResult(res);
          setStatusMessage(
            res === "WIN"
              ? "Selamat, Skakmat! Kamu menang (+50 Poin)."
              : "Permainan berakhir seri."
          );
          return;
        }
        // Saat memakan bidak atau melangkah, tampilkan soal baru di kartu kanan
        if (move.captured) {
          setAnswering(true);
        }
        scheduleBotMove();
      }
      return;
    }

    const piece = g.get(sq);
    if (piece && piece.color === "w") {
      setSelectedSquare(sq);
      const moves = g.moves({ square: sq, verbose: true });
      setLegalTargets(moves.map((m) => m.to as Square));
    } else {
      setSelectedSquare(null);
      setLegalTargets([]);
    }
  }

  async function syncPointDelta(delta: number) {
    try {
      const res = await fetch("/api/chess/point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      const data = await res.json();
      if (typeof data.points === "number") {
        setPoints(data.points);
      }
    } catch {
      // ignore
    }
  }

  function handleSelectOption(idx: number) {
    if (chosenOpt !== null) return;
    setChosenOpt(idx);
    setQuestionsTotal((t) => t + 1);
    if (idx === currentQuestion.answerIndex) {
      setQuestionsCorrect((c) => c + 1);
      setPoints((p) => p + 20);
      syncPointDelta(20);
      setStatusMessage("Jawaban benar! +20 Poin tersimpan ke akunmu.");
    } else {
      setStatusMessage(
        `Kurang tepat. Kunci: ${currentQuestion.explanation}`
      );
    }
  }

  function handleSkipQuestion() {
    setPoints((p) => Math.max(0, p - 10));
    syncPointDelta(-10);
    setStatusMessage("Pertanyaan dilewati (-10 Poin dari akunmu).");
    nextQuestion();
  }

  function handleRestart() {
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setSelectedSquare(null);
    setLegalTargets([]);
    setStatusMessage(null);
  }

  const board = gameRef.current.board();
  void fen;

  return (
    <div className="flex-1 bg-[#EBF0FD] pb-16">
      {/* Banner salmon/rose sesuai gambar Civic Chess */}
      <section className="bg-[#E8BDB9] py-8 px-6 rounded-b-2xl text-center">
        <h1 className="font-condensed-title text-4xl sm:text-5xl font-bold text-[#083B6B] tracking-wide uppercase">
          CIVIC CHESS
        </h1>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Kiri: Papan Catur 8x8 Putih & Biru Tua */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[430px] border-2 border-[#0A0DA8] bg-white shadow-xs">
            {ranks.map((rank, rIdx) => (
              <div key={rank} className="grid grid-cols-8">
                {files.map((file, fIdx) => {
                  const sq = `${file}${rank}` as Square;
                  const piece = board[rIdx][fIdx];
                  const isLight = (rIdx + fIdx) % 2 === 0;
                  const isSelected = selectedSquare === sq;
                  const isTarget = legalTargets.includes(sq);

                  const bgClass = isSelected
                    ? "bg-[#F5B700]"
                    : isLight
                    ? "bg-white"
                    : "bg-[#0A0DA8]";

                  const symbol =
                    showPieces && piece
                      ? PIECE_UNICODE[`${piece.color}${piece.type}`]
                      : "";

                  return (
                    <button
                      key={sq}
                      type="button"
                      onClick={() => handleSquareClick(sq)}
                      className={`aspect-square relative flex items-center justify-center text-2xl sm:text-3xl select-none cursor-pointer ${bgClass}`}
                    >
                      {isTarget && (
                        <span className="w-3 h-3 rounded-full bg-[#4CD92B] ring-2 ring-white" />
                      )}
                      {symbol && (
                        <span
                          className={
                            piece?.color === "w"
                              ? "text-[#F5B700] drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.9)]"
                              : "text-[#FF6B6B] drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.9)]"
                          }
                        >
                          {symbol}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Kontrol kecil di bawah papan */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 w-full max-w-[430px] text-xs text-gray-700">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1 bg-white border border-[#3A75B5] px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Papan</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPieces((s) => !s)}
              className="bg-white border border-[#3A75B5] px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              {showPieces ? "Sembunyikan Bidak" : "Tampilkan Bidak"}
            </button>
            {allLevels.length > 1 && (
              <div className="flex items-center gap-1">
                {allLevels.map((l) => (
                  <Link
                    key={l.number}
                    href={`/chess/${l.number}`}
                    className={`px-2 py-1 rounded ${
                      l.number === levelNumber
                        ? "bg-[#083B6B] text-white font-bold"
                        : "bg-white border border-[#3A75B5] text-black"
                    }`}
                  >
                    L{l.number}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Kanan: Materi & Kartu Pertanyaan Giliran Ini */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="text-right text-xl sm:text-2xl font-bold text-black mb-4">
            Materi {moduleOrder}: {points} Poin
          </div>

          <div className="bg-white border border-[#3A75B5] rounded-xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-black">
              Pertanyaan giliran ini!
            </h2>

            <p className="mt-4 text-xs sm:text-sm text-black leading-relaxed">
              {currentQuestion.text}
            </p>

            {answering && (
              <div className="mt-4 space-y-2">
                {currentQuestion.options.map((opt, idx) => {
                  const locked = chosenOpt !== null;
                  const isAnswer = idx === currentQuestion.answerIndex;
                  const isChosen = idx === chosenOpt;

                  let optCls =
                    "border-[#3A75B5] bg-white hover:bg-[#F5F8FF] text-black";
                  if (locked) {
                    if (isAnswer) {
                      optCls = "border-[#3A75B5] bg-[#D9F9C4] text-black";
                    } else if (isChosen) {
                      optCls = "border-[#3A75B5] bg-[#FDC5C5] text-black";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={locked}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left border rounded-lg px-4 py-2 text-xs sm:text-sm flex items-center justify-between gap-2 cursor-pointer ${optCls}`}
                    >
                      <span>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </span>
                      {locked && isAnswer && (
                        <Check className="w-4 h-4 text-[#0080FF] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {statusMessage && (
              <div className="mt-3 text-xs font-semibold text-[#00529B]">
                {statusMessage}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-5">
              <button
                type="button"
                onClick={() => {
                  if (!answering) {
                    setAnswering(true);
                    setStatusMessage(null);
                  } else if (chosenOpt !== null) {
                    setStatusMessage(null);
                    nextQuestion();
                  }
                }}
                className="border border-[#3A75B5] bg-[#DFFFD6] hover:bg-[#ccf8bf] text-black text-xs sm:text-sm py-3.5 px-4 rounded-xl text-center transition cursor-pointer"
              >
                {answering && chosenOpt !== null
                  ? "Soal Berikutnya"
                  : "Jawab & Lanjutkan"}
              </button>

              <button
                type="button"
                onClick={handleSkipQuestion}
                className="border border-[#3A75B5] bg-[#FDECEF] hover:bg-[#fbd8df] text-black text-xs sm:text-sm py-3.5 px-4 rounded-xl text-center transition cursor-pointer"
              >
                Lewati (-10 Poin)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
