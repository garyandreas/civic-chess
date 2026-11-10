"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Chess, type Square, type Move } from "chess.js";
import {
  Check,
  RotateCcw,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  HelpCircle,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import {
  chooseBotMove,
  evaluatePosition,
  evalToWhitePercent,
  findBestMove,
  findBlunderMove,
  formatEval,
} from "@/lib/chess-engine";
import { chessAudio } from "@/lib/chess-audio";

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

const PIECE_NAME_ID: Record<string, string> = {
  p: "Pion",
  n: "Kuda",
  b: "Gajah",
  r: "Benteng",
  q: "Menteri",
  k: "Raja",
};

function randomStepTarget(): number {
  return Math.random() < 0.5 ? 3 : 4;
}

export function ChessGameClient({
  levelId,
  botDepth,
  blunderRate,
  moduleOrder,
  moduleTitle,
  initialPoints = 0,
  initialSoundEnabled = true,
  questions,
}: {
  levelId: string;
  difficulty: string;
  botDepth: number;
  blunderRate: number;
  moduleOrder: number;
  moduleTitle: string;
  initialPoints?: number;
  initialSoundEnabled?: boolean;
  questions: QuestionItem[];
}) {
  const gameRef = useRef<Chess>(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalTargets, setLegalTargets] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(
    null
  );
  const [points, setPoints] = useState(initialPoints);

  // Pengaturan Efek Suara (SFX) & Musik Santai (BGM)
  const [sfxOn, setSfxOn] = useState(initialSoundEnabled);
  const [bgmOn, setBgmOn] = useState(initialSoundEnabled);
  const bgmStartedRef = useRef(false);

  // Evaluasi bar penguasaan permainan (centipawn, positif = Putih unggul)
  const [evalCp, setEvalCp] = useState<number>(0);

  // Hitungan langkah menuju pertanyaan berikutnya (setiap 3 atau 4 langkah)
  const [stepsSinceQuiz, setStepsSinceQuiz] = useState<number>(0);
  const [nextQuizTarget, setNextQuizTarget] = useState<number>(3);

  // State pertanyaan pilihan ganda di panel kiri
  const [qIdx, setQIdx] = useState(0);
  const [quizActive, setQuizActive] = useState(false);
  const [chosenOpt, setChosenOpt] = useState<number | null>(null);
  const [questionsCorrect, setQuestionsCorrect] = useState(0);
  const [questionsTotal, setQuestionsTotal] = useState(0);

  // Sugesti Best Move (muncul saat jawaban benar) & Info Blunder (muncul saat salah)
  const [bestMoveHint, setBestMoveHint] = useState<{
    from: Square;
    to: Square;
    san: string;
    pieceName: string;
  } | null>(null);
  const [blunderNotice, setBlunderNotice] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    chessAudio.setSfxEnabled(sfxOn);
  }, [sfxOn]);

  useEffect(() => {
    chessAudio.setBgmEnabled(bgmOn);
    if (bgmOn && bgmStartedRef.current) {
      chessAudio.startBgm();
    }
  }, [bgmOn]);

  useEffect(() => {
    return () => {
      chessAudio.stopBgm();
    };
  }, []);

  function ensureBgmStarted() {
    if (!bgmStartedRef.current) {
      bgmStartedRef.current = true;
      if (bgmOn) {
        chessAudio.startBgm();
      }
    }
  }

  /** Bunyikan efek suara langkah sesuai konteks (makan bidak, skak, skakmat, atau langkah biasa) */
  function playMoveAudio(g: Chess, move: Move, isBestMoveExecution = false) {
    if (g.isCheckmate()) {
      chessAudio.playCheckmate();
      return;
    }
    if (g.inCheck()) {
      chessAudio.playCheck();
      return;
    }
    if (isBestMoveExecution) {
      chessAudio.playBestMove();
    }
    if (move.captured) {
      chessAudio.playCapture();
    } else {
      chessAudio.playMove();
    }
  }

  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

  const currentQuestion: QuestionItem =
    questions[qIdx % Math.max(1, questions.length)] ?? {
      id: "default",
      text: "Semboyan Bhinneka Tunggal Ika berasal dari kitab Kakawin Sutasoma karya ....",
      options: ["Mpu Prapanca", "Mpu Tantular", "Mpu Sedah", "Mpu Kanwa"],
      answerIndex: 1,
      explanation:
        "Semboyan Bhinneka Tunggal Ika berasal dari kitab Kakawin Sutasoma karya Mpu Tantular.",
    };

  function updateBoardState() {
    const g = gameRef.current;
    setFen(g.fen());
    setEvalCp(evaluatePosition(g, 2));
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

  function triggerBotTurn(afterBotCallback?: () => void) {
    setTimeout(() => {
      const g = gameRef.current;
      if (g.isGameOver() || g.turn() !== "b") return;
      const botMove = chooseBotMove(g, botDepth, blunderRate);
      if (!botMove) return;

      const applied = g.move(botMove);
      if (applied) {
        playMoveAudio(g, applied, false);
      }
      setLastMove({ from: botMove.from as Square, to: botMove.to as Square });
      updateBoardState();

      if (g.isGameOver()) {
        const res = g.isCheckmate() ? "LOSE" : "DRAW";
        if (res === "LOSE") {
          setTimeout(() => chessAudio.playGameLose(), 350);
        }
        saveGameResult(res);
        setStatusMessage(
          res === "LOSE"
            ? "Skakmat! Bot menang. Klik Reset Papan untuk bermain lagi."
            : "Permainan berakhir seri."
        );
        return;
      }

      if (afterBotCallback) {
        afterBotCallback();
      }
    }, 350);
  }

  function executePlayerMove(
    from: Square,
    to: Square,
    isBestMoveExecution = false
  ) {
    ensureBgmStarted();
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() !== "w") return;

    const move = g.move({
      from,
      to,
      promotion: "q",
    });

    setSelectedSquare(null);
    setLegalTargets([]);

    if (!move) return;

    playMoveAudio(g, move, isBestMoveExecution);
    setLastMove({ from: move.from as Square, to: move.to as Square });
    setBestMoveHint(null);
    setBlunderNotice(null);
    updateBoardState();

    if (g.isGameOver()) {
      const res = g.isCheckmate() ? "WIN" : "DRAW";
      if (res === "WIN") {
        setTimeout(() => chessAudio.playGameWin(), 350);
      }
      setPoints((p) => p + (res === "WIN" ? 50 : 10));
      saveGameResult(res);
      setStatusMessage(
        res === "WIN"
          ? "Selamat, Skakmat! Kamu menang (+50 Poin)."
          : "Permainan berakhir seri."
      );
      return;
    }

    const nextCount = stepsSinceQuiz + 1;
    const shouldTriggerQuiz = nextCount >= nextQuizTarget;

    if (shouldTriggerQuiz) {
      setStepsSinceQuiz(0);
      setNextQuizTarget(randomStepTarget());
    } else {
      setStepsSinceQuiz(nextCount);
    }

    triggerBotTurn(() => {
      if (shouldTriggerQuiz && !gameRef.current.isGameOver()) {
        setChosenOpt(null);
        setQuizActive(true);
        chessAudio.playQuestionAppear();
        setStatusMessage(
          "Jawab pertanyaan di kiri! Benar = Sugesti Best Move, Salah = 1 Langkah Blunder otomatis."
        );
      }
    });
  }

  function handleSquareClick(sq: Square) {
    ensureBgmStarted();
    const g = gameRef.current;
    if (g.isGameOver() || g.turn() !== "w") return;

    // Jika ada pertanyaan aktif yang belum dijawab, arahkan siswa menjawab dulu
    if (quizActive && chosenOpt === null) {
      chessAudio.playQuestionAppear();
      setStatusMessage(
        "Selesaikan dulu pertanyaan pilihan ganda di sebelah kiri sebelum melangkah!"
      );
      return;
    }

    if (selectedSquare && legalTargets.includes(sq)) {
      const isFollowingBest =
        bestMoveHint?.from === selectedSquare && bestMoveHint?.to === sq;
      executePlayerMove(selectedSquare, sq, isFollowingBest);
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

  function handleSelectOption(idx: number) {
    ensureBgmStarted();
    if (chosenOpt !== null) return;
    setChosenOpt(idx);
    setQuestionsTotal((t) => t + 1);

    const g = gameRef.current;
    const isCorrect = idx === currentQuestion.answerIndex;

    if (isCorrect) {
      chessAudio.playAnswerCorrect();
      setQuestionsCorrect((c) => c + 1);
      setPoints((p) => p + 20);
      syncPointDelta(20);

      // Hitung Best Move untuk Putih
      const best = findBestMove(g, Math.max(2, botDepth));
      if (best) {
        setTimeout(() => chessAudio.playBestMove(), 260);
        const pieceName = PIECE_NAME_ID[best.move.piece] ?? "Bidak";
        setBestMoveHint({
          from: best.move.from as Square,
          to: best.move.to as Square,
          san: best.move.san,
          pieceName,
        });
        setStatusMessage(
          `Jawaban Benar (+20 Poin)! Sugesti Best Move: ${pieceName} dari ${best.move.from.toUpperCase()} ke ${best.move.to.toUpperCase()} (${best.move.san}).`
        );
      } else {
        setStatusMessage("Jawaban Benar (+20 Poin)!");
      }
    } else {
      // Jawaban Salah -> bunyikan suara salah lalu suara blunder & jalankan 1 langkah blunder otomatis
      chessAudio.playAnswerWrong();
      setBestMoveHint(null);
      const blunder = findBlunderMove(g);
      if (blunder && g.turn() === "w" && !g.isGameOver()) {
        const pieceName = PIECE_NAME_ID[blunder.piece] ?? "Bidak";
        const applied = g.move({
          from: blunder.from,
          to: blunder.to,
          promotion: blunder.promotion ?? "q",
        });
        if (applied) {
          setTimeout(() => chessAudio.playBlunder(), 240);
          setLastMove({
            from: applied.from as Square,
            to: applied.to as Square,
          });
          const msg = `Jawaban kurang tepat! Sistem melakukan 1 langkah blunder otomatis: ${pieceName} ${applied.from.toUpperCase()} → ${applied.to.toUpperCase()} (${applied.san}).`;
          setBlunderNotice(msg);
          setStatusMessage(msg);
          updateBoardState();

          if (g.isGameOver()) {
            const res = g.isCheckmate() ? "WIN" : "DRAW";
            if (res === "WIN") {
              setTimeout(() => chessAudio.playGameWin(), 400);
            }
            saveGameResult(res);
          } else {
            triggerBotTurn();
          }
        }
      } else {
        setStatusMessage(
          `Jawaban kurang tepat. Kunci: ${currentQuestion.explanation}`
        );
      }
    }
  }

  function handleCloseQuizCard() {
    setQuizActive(false);
    setChosenOpt(null);
    setQIdx((i) => i + 1);
  }

  function handleApplyBestMove() {
    if (!bestMoveHint) return;
    const { from, to } = bestMoveHint;
    setQuizActive(false);
    setChosenOpt(null);
    setQIdx((i) => i + 1);
    executePlayerMove(from, to, true);
  }

  function handleRestart() {
    ensureBgmStarted();
    chessAudio.playMove();
    gameRef.current = new Chess();
    setFen(gameRef.current.fen());
    setEvalCp(0);
    setSelectedSquare(null);
    setLegalTargets([]);
    setLastMove(null);
    setBestMoveHint(null);
    setBlunderNotice(null);
    setQuizActive(false);
    setChosenOpt(null);
    setStepsSinceQuiz(0);
    setNextQuizTarget(randomStepTarget());
    setStatusMessage(null);
  }

  const board = gameRef.current.board();
  const whitePct = evalToWhitePercent(evalCp);
  const evalLabel = formatEval(evalCp);
  const remainingSteps = Math.max(1, nextQuizTarget - stepsSinceQuiz);
  void fen;

  return (
    <div className="flex-1 bg-[#EBF0FD] pb-16">
      {/* Banner atas Civic Chess */}
      <section className="bg-[#E8BDB9] py-6 px-6 rounded-b-2xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/chess"
            className="inline-flex items-center gap-1.5 bg-white/90 hover:bg-white text-[#083B6B] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Semua Materi Catur</span>
          </Link>

          <div className="text-center">
            <h1 className="font-condensed-title text-3xl sm:text-4xl font-bold text-[#083B6B] tracking-wide uppercase">
              CIVIC CHESS — MATERI {moduleOrder}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#083B6B]/90">
              {moduleTitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Musik Pengiring (Backsound) */}
            <button
              type="button"
              onClick={() => {
                const next = !bgmOn;
                setBgmOn(next);
                if (next) {
                  bgmStartedRef.current = true;
                  chessAudio.setBgmEnabled(true);
                  chessAudio.startBgm();
                }
              }}
              title="Toggle Musik Pengiring Santai"
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition cursor-pointer ${
                bgmOn
                  ? "bg-[#083B6B] text-white border-[#083B6B]"
                  : "bg-white/80 text-gray-600 border-gray-300"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{bgmOn ? "Musik: ON" : "Musik: OFF"}</span>
            </button>

            {/* Tombol Efek Suara (SFX) */}
            <button
              type="button"
              onClick={() => setSfxOn((v) => !v)}
              title="Toggle Efek Suara Catur"
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition cursor-pointer ${
                sfxOn
                  ? "bg-[#083B6B] text-white border-[#083B6B]"
                  : "bg-white/80 text-gray-600 border-gray-300"
              }`}
            >
              {sfxOn ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>{sfxOn ? "SFX: ON" : "SFX: OFF"}</span>
            </button>

            <div className="bg-white/90 border border-[#083B6B]/20 text-[#083B6B] font-bold text-xs sm:text-sm px-4 py-2 rounded-xl">
              {points} Poin
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 mt-7 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* SEBELAH KIRI: Panel Pertanyaan Pilihan Ganda & Sugesti Best Move / Blunder */}
        <div className="lg:col-span-5 flex flex-col space-y-4 order-2 lg:order-1">
          <div className="bg-white border-2 border-[#1C1C1C] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-200">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1C1C1C] text-white">
                <HelpCircle className="w-3.5 h-3.5 text-[#F5B700]" />
                <span>Kuis Langkah Catur</span>
              </span>
              <span className="text-xs font-semibold text-gray-600">
                {quizActive
                  ? "Wajib Dijawab Sekarang"
                  : `${remainingSteps} langkah lagi menuju soal`}
              </span>
            </div>

            {quizActive ? (
              <div className="mt-4">
                <div className="text-xs font-bold text-[#00529B] uppercase tracking-wide">
                  Pertanyaan Muncul!
                </div>
                <p className="mt-2 text-sm sm:text-base font-medium text-black leading-relaxed">
                  {currentQuestion.text}
                </p>

                <div className="mt-4 space-y-2.5">
                  {currentQuestion.options.map((opt, idx) => {
                    const locked = chosenOpt !== null;
                    const isAnswer = idx === currentQuestion.answerIndex;
                    const isChosen = idx === chosenOpt;

                    let optCls =
                      "border-gray-300 bg-white hover:bg-gray-50 text-black";
                    if (locked) {
                      if (isAnswer) {
                        optCls =
                          "border-[#2E8B19] bg-[#D9F9C4] text-black font-semibold";
                      } else if (isChosen) {
                        optCls = "border-[#DC2626] bg-[#FDC5C5] text-black";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={locked}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left border rounded-xl px-4 py-2.5 text-xs sm:text-sm flex items-center justify-between gap-2 transition cursor-pointer ${optCls}`}
                      >
                        <span>
                          {String.fromCharCode(65 + idx)}. {opt}
                        </span>
                        {locked && isAnswer && (
                          <Check className="w-4 h-4 text-[#1F6F12] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {chosenOpt !== null && (
                  <div className="mt-4 space-y-3">
                    <div className="text-xs leading-relaxed bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-800">
                      <strong>Pembahasan:</strong> {currentQuestion.explanation}
                    </div>

                    {bestMoveHint ? (
                      <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-3.5 space-y-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                          <Sparkles className="w-4 h-4 text-[#F5B700]" />
                          <span>
                            Sugesti Best Move: {bestMoveHint.pieceName}{" "}
                            {bestMoveHint.from.toUpperCase()} →{" "}
                            {bestMoveHint.to.toUpperCase()} ({bestMoveHint.san})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleApplyBestMove}
                            className="bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition"
                          >
                            Jalankan Best Move Otomatis
                          </button>
                          <button
                            type="button"
                            onClick={handleCloseQuizCard}
                            className="bg-white border border-gray-300 text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                          >
                            Pilih Langkah Sendiri
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleCloseQuizCard}
                        className="w-full bg-[#1C1C1C] hover:bg-black text-white text-xs sm:text-sm font-bold py-2.5 rounded-xl cursor-pointer transition"
                      >
                        Lanjutkan Permainan
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  Pertanyaan pilihan ganda akan muncul otomatis di kotak ini
                  setiap <strong>3 atau 4 langkah</strong>.
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-xl p-3">
                    <div className="font-bold text-[#065F46] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Jika Benar</span>
                    </div>
                    <p className="mt-1 text-gray-700">
                      Dapat <strong>+20 Poin</strong> & muncul{" "}
                      <strong>Sugesti Best Move</strong> di papan.
                    </p>
                  </div>
                  <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3">
                    <div className="font-bold text-[#991B1B] flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Jika Salah</span>
                    </div>
                    <p className="mt-1 text-gray-700">
                      Sistem otomatis membuat{" "}
                      <strong>1 langkah blunder</strong> pada bidakmu.
                    </p>
                  </div>
                </div>

                {bestMoveHint && (
                  <div className="bg-[#ECFDF5] border border-[#10B981] rounded-xl p-3.5 flex items-center justify-between gap-3">
                    <div className="text-xs text-[#065F46]">
                      <strong>Sugesti Best Move Aktif:</strong>{" "}
                      {bestMoveHint.pieceName}{" "}
                      {bestMoveHint.from.toUpperCase()} →{" "}
                      {bestMoveHint.to.toUpperCase()} ({bestMoveHint.san})
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyBestMove}
                      className="bg-[#065F46] text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                    >
                      Jalankan
                    </button>
                  </div>
                )}

                {blunderNotice && (
                  <div className="bg-[#FEF2F2] border border-[#F87171] rounded-xl p-3 text-xs text-[#991B1B] font-medium">
                    ⚠️ {blunderNotice}
                  </div>
                )}
              </div>
            )}

            {statusMessage && (
              <div className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-[#083B6B]">
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        {/* SEBELAH KANAN: Bar Penguasaan Permainan + Papan Catur Hitam-Putih */}
        <div className="lg:col-span-7 flex flex-col items-center order-1 lg:order-2">
          <div className="flex items-stretch gap-3 w-full max-w-[490px] justify-center">
            {/* Bar Penguasaan Permainan (Vertikal seperti Chess.com) */}
            <div
              title={`Evaluasi Posisi: ${evalLabel}`}
              className="w-7 sm:w-8 rounded-lg overflow-hidden border-2 border-[#1C1C1C] bg-[#1C1C1C] flex flex-col justify-between relative select-none shadow-sm shrink-0"
            >
              {/* Bagian Hitam di atas, Bagian Putih di bawah */}
              <div
                className="w-full bg-[#262626] transition-all duration-300"
                style={{ height: `${100 - whitePct}%` }}
              />
              <div
                className="w-full bg-white transition-all duration-300"
                style={{ height: `${whitePct}%` }}
              />

              {/* Label angka evaluasi */}
              <span
                className={`absolute left-0 right-0 text-center text-[10px] font-extrabold tracking-tighter ${
                  evalCp >= 0
                    ? "bottom-1.5 text-[#1C1C1C]"
                    : "top-1.5 text-white"
                }`}
              >
                {evalLabel}
              </span>
            </div>

            {/* Papan Catur 8x8 Warna Hitam & Putih */}
            <div className="flex-1 max-w-[440px] border-4 border-[#1C1C1C] rounded-lg overflow-hidden bg-white shadow-md">
              {ranks.map((rank, rIdx) => (
                <div key={rank} className="grid grid-cols-8">
                  {files.map((file, fIdx) => {
                    const sq = `${file}${rank}` as Square;
                    const piece = board[rIdx][fIdx];
                    const isLight = (rIdx + fIdx) % 2 === 0;
                    const isSelected = selectedSquare === sq;
                    const isTarget = legalTargets.includes(sq);
                    const isBestFrom = bestMoveHint?.from === sq;
                    const isBestTo = bestMoveHint?.to === sq;
                    const isLastMove =
                      lastMove?.from === sq || lastMove?.to === sq;

                    let bgClass = isLight ? "bg-[#F3F4F6]" : "bg-[#2E2E2E]";
                    if (isSelected) {
                      bgClass = "bg-[#F5B700]";
                    } else if (isBestFrom || isBestTo) {
                      bgClass = "bg-[#34D399] ring-2 ring-inset ring-[#065F46]";
                    } else if (isLastMove) {
                      bgClass = isLight ? "bg-[#FDE68A]" : "bg-[#927024]";
                    }

                    const symbol = piece
                      ? PIECE_UNICODE[`${piece.color}${piece.type}`]
                      : "";

                    return (
                      <button
                        key={sq}
                        type="button"
                        onClick={() => handleSquareClick(sq)}
                        className={`aspect-square relative flex items-center justify-center text-2xl sm:text-4xl select-none cursor-pointer transition-colors ${bgClass}`}
                      >
                        {/* Koordinat tepi papan */}
                        {fIdx === 0 && (
                          <span
                            className={`absolute top-0.5 left-1 text-[9px] font-bold leading-none ${
                              isLight ? "text-[#2E2E2E]" : "text-[#F3F4F6]"
                            }`}
                          >
                            {rank}
                          </span>
                        )}
                        {rIdx === 7 && (
                          <span
                            className={`absolute bottom-0.5 right-1 text-[9px] font-bold leading-none ${
                              isLight ? "text-[#2E2E2E]" : "text-[#F3F4F6]"
                            }`}
                          >
                            {file}
                          </span>
                        )}

                        {isTarget && (
                          <span
                            className={`rounded-full ${
                              piece
                                ? "absolute inset-1 border-4 border-[#22C55E]/80"
                                : "w-3.5 h-3.5 bg-[#22C55E] ring-2 ring-white"
                            }`}
                          />
                        )}

                        {symbol && (
                          <span
                            className={
                              piece?.color === "w"
                                ? "text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)] [text-stroke:1px_#000]"
                                : "text-[#111111] drop-shadow-[0_1px_1.5px_rgba(255,255,255,0.85)]"
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
          </div>

          {/* Keterangan Bar Penguasaan & Tombol Reset di bawah papan */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 w-full max-w-[490px] text-xs text-gray-700">
            <div className="flex items-center gap-2 bg-white border border-gray-300 px-3 py-1.5 rounded-lg">
              <span className="inline-block w-2.5 h-2.5 rounded-xs bg-white border border-black" />
              <span className="font-semibold">
                Penguasaan Putih: {Math.round(whitePct)}% ({evalLabel})
              </span>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 bg-[#1C1C1C] text-white font-semibold px-3.5 py-1.5 rounded-lg hover:bg-black cursor-pointer transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Papan</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
