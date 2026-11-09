"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { ESSAY_QUESTIONS_BY_MODULE } from "@/lib/civic-chess-questions";

type QuestionItem = {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

export function QuizRunner({
  moduleOrder,
  moduleId,
  moduleTitle,
  quizId,
  questions,
  moduleList = [],
  initialEssayAnswers = {},
}: {
  moduleOrder: number;
  moduleId: string;
  moduleTitle: string;
  quizId: string;
  questions: QuestionItem[];
  moduleList?: { order: number; title: string }[];
  initialEssayAnswers?: Record<number, string>;
}) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    pointsEarned: number;
  } | null>(null);
  const [essayAnswers, setEssayAnswers] =
    useState<Record<number, string>>(initialEssayAnswers);
  const [essaySavedMsg, setEssaySavedMsg] = useState("");
  const [savingEssay, setSavingEssay] = useState(false);

  const current = questions[index];
  const essays = ESSAY_QUESTIONS_BY_MODULE[moduleOrder] ?? [];

  function handleSelect(optIdx: number) {
    if (locked) return;
    setSelected(optIdx);
    setLocked(true);
    if (optIdx === current.answerIndex) {
      setCorrectCount((c) => c + 1);
    }
  }

  async function handleNext() {
    if (index + 1 < questions.length) {
      setIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleId,
          quizId,
          correct: correctCount,
          total: questions.length,
        }),
      });
      const data = await res.json();
      setResult({
        score: data.score ?? Math.round((correctCount / questions.length) * 100),
        pointsEarned: data.pointsEarned ?? correctCount * 5,
      });
      router.refresh();
    } catch {
      setResult({
        score: Math.round((correctCount / questions.length) * 100),
        pointsEarned: correctCount * 5,
      });
    } finally {
      setSubmitting(false);
      setFinished(true);
    }
  }

  async function handleSaveEssay() {
    setSavingEssay(true);
    setEssaySavedMsg("");
    try {
      const res = await fetch("/api/quiz/essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, answers: essayAnswers }),
      });
      const data = await res.json();
      if (res.ok) {
        setEssaySavedMsg(
          data.bonusPoints > 0
            ? `✓ Jawaban esai tersimpan ke akunmu (+${data.bonusPoints} Poin)!`
            : "✓ Jawaban esai berhasil diperbarui di akunmu!"
        );
        router.refresh();
      }
    } finally {
      setSavingEssay(false);
    }
  }

  function handleRestart() {
    setIndex(0);
    setSelected(null);
    setLocked(false);
    setCorrectCount(0);
    setFinished(false);
    setResult(null);
  }

  return (
    <div className="flex-1 bg-[#FDECEF] pb-16">
      <div className="bg-[#00529B] h-8 rounded-b-xl" />

      <section className="max-w-5xl mx-auto px-4 sm:px-10 mt-6 space-y-6">
        <div className="border border-[#3A75B5] rounded-xl p-6 sm:p-10 bg-white">
          {!finished ? (
            <>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h1 className="font-condensed-title text-3xl sm:text-4xl font-bold text-black leading-none">
                    Quis
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-black">
                    Latihan soal untuk menguji pemahamanmu — {moduleTitle}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/quiz"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#00529B] bg-[#E6ECFA] px-3 py-1.5 rounded-lg hover:bg-[#d6e0f7] transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Semua Quis</span>
                  </Link>
                  <div className="text-xl sm:text-2xl font-normal text-black">
                    Materi {moduleOrder}
                  </div>
                </div>
              </div>

              <div className="mt-3 w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7CC0FF] rounded-full transition-all"
                  style={{
                    width: `${Math.round(
                      ((index + 1) / questions.length) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="mt-2 text-[11px] sm:text-xs text-black">
                Soal {index + 1} dari {questions.length}
              </div>

              <h2 className="mt-3 pl-4 text-lg sm:text-2xl font-normal text-black leading-snug whitespace-pre-line">
                {index + 1}. {current.text}
              </h2>

              <div className="mt-5 space-y-4">
                {current.options.map((opt, idx) => {
                  const isAnswer = idx === current.answerIndex;
                  const isChosen = idx === selected;

                  let btnClass =
                    "border-[#3A75B5] bg-white hover:bg-[#F5F8FF] text-black";
                  if (locked) {
                    if (isAnswer) {
                      btnClass = "border-[#3A75B5] bg-[#D9F9C4] text-black";
                    } else if (isChosen) {
                      btnClass = "border-[#3A75B5] bg-[#FDC5C5] text-black";
                    } else {
                      btnClass = "border-[#3A75B5] bg-white text-black";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={locked}
                      onClick={() => handleSelect(idx)}
                      className={`w-full text-left border rounded-xl px-6 sm:px-10 py-4 text-base sm:text-xl flex items-center justify-between gap-4 transition cursor-pointer ${btnClass}`}
                    >
                      <span>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </span>
                      {locked && isAnswer && (
                        <Check className="w-7 h-7 text-[#0080FF] stroke-[2.5] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {locked && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 bg-[#FDECEF] border border-[#3A75B5] rounded-xl px-5 py-3 text-xs sm:text-sm text-black">
                  <span>
                    <strong>Pembahasan:</strong> {current.explanation}
                  </span>
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleNext}
                    className="bg-[#00529B] text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#003E75] transition cursor-pointer shrink-0"
                  >
                    {submitting
                      ? "Menyimpan..."
                      : index + 1 < questions.length
                      ? "Soal Berikutnya →"
                      : "Lihat Skor Akhir"}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#9EE0EE] mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8 text-[#F5B700]" />
              </div>
              <h2 className="text-2xl font-bold text-black">
                Quis Materi {moduleOrder} ({moduleTitle}) Selesai!
              </h2>
              <p className="text-sm sm:text-base text-gray-800">
                Skor dan poin telah disimpan ke profil akunmu. Kamu menjawab
                benar <strong>{correctCount}</strong> dari{" "}
                <strong>{questions.length}</strong> soal.
              </p>

              <div className="flex justify-center gap-6 py-2">
                <div className="bg-[#9EE0EE] rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold text-[#F5B700]">
                    {result?.score ?? 0}/100
                  </div>
                  <div className="text-xs text-black">Skor Akhir</div>
                </div>
                <div className="bg-[#9EE0EE] rounded-xl px-6 py-3">
                  <div className="text-2xl font-bold text-[#F5B700]">
                    +{result?.pointsEarned ?? 0}
                  </div>
                  <div className="text-xs text-black">Poin Diperoleh</div>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex items-center gap-2 border border-[#3A75B5] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#E6ECFA] transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulangi Quis</span>
                </button>
                <Link
                  href="/chess"
                  className="bg-[#00529B] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#003E75] transition"
                >
                  Main Civic Chess
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Bagian B. Soal Esai (tersimpan per akun) */}
        {essays.length > 0 && (
          <div className="border border-[#3A75B5] rounded-xl p-6 sm:p-10 bg-white space-y-5">
            <div>
              <h2 className="font-condensed-title text-2xl sm:text-3xl font-bold text-black">
                B. Soal Esai — Materi {moduleOrder}
              </h2>
              <p className="text-xs sm:text-sm text-gray-800 mt-1">
                Petunjuk: Jawablah pertanyaan berikut dengan jelas dan disertai
                alasan yang tepat! Jawaban tersimpan langsung di profil akunmu.
              </p>
            </div>

            {essays.map((qText, i) => (
              <div key={i} className="space-y-2">
                <label className="block text-sm sm:text-base font-medium text-black leading-relaxed">
                  {i + 1}. {qText}
                </label>
                <textarea
                  rows={3}
                  value={essayAnswers[i] ?? ""}
                  onChange={(e) => {
                    setEssayAnswers((prev) => ({
                      ...prev,
                      [i]: e.target.value,
                    }));
                    setEssaySavedMsg("");
                  }}
                  placeholder="Tulis jawaban esaimu di sini..."
                  className="w-full border border-[#3A75B5] rounded-xl p-3.5 text-xs sm:text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                />
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3">
              {essaySavedMsg ? (
                <span className="text-xs sm:text-sm font-semibold text-green-700">
                  {essaySavedMsg}
                </span>
              ) : (
                <span />
              )}
              <button
                type="button"
                disabled={savingEssay}
                onClick={handleSaveEssay}
                className="bg-[#00529B] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-[#003E75] transition cursor-pointer disabled:opacity-60"
              >
                {savingEssay ? "Menyimpan..." : "Simpan Jawaban Esai"}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
