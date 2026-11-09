"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  PlaySquare,
  Award,
  BookOpen,
  Sparkles,
} from "lucide-react";

type SectionItem = {
  id: string;
  order: number;
  title: string;
  content: string;
};

type SlideCard = {
  index: number;
  sectionOrder: number;
  sectionTitle: string;
  partLabel?: string;
  paragraphs: string[];
  isSummary?: boolean;
};

/**
 * Memecah setiap subbab panjang menjadi beberapa halaman/slide yang ringkas
 * (maksimal ~2 paragraf / blok per halaman) agar tidak perlu scroll panjang,
 * lalu menambahkan halaman terakhir khusus Ringkasan Materi yang baru muncul
 * setelah seluruh halaman materi selesai dibaca satu per satu.
 */
function buildSlides(
  moduleOrder: number,
  sections: SectionItem[],
  summary: string
): SlideCard[] {
  const slides: SlideCard[] = [];

  for (const sec of sections) {
    const blocks = sec.content
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter(Boolean);

    const chunks: string[][] = [];
    let currentChunk: string[] = [];
    let currentLen = 0;

    for (const block of blocks) {
      if (
        currentChunk.length > 0 &&
        (currentChunk.length >= 2 || currentLen + block.length > 520)
      ) {
        chunks.push(currentChunk);
        currentChunk = [block];
        currentLen = block.length;
      } else {
        currentChunk.push(block);
        currentLen += block.length;
      }
    }
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    chunks.forEach((paras, idx) => {
      slides.push({
        index: slides.length,
        sectionOrder: sec.order,
        sectionTitle: sec.title,
        partLabel:
          chunks.length > 1
            ? `Bagian ${idx + 1} dari ${chunks.length}`
            : undefined,
        paragraphs: paras,
        isSummary: false,
      });
    });
  }

  // Halaman paling terakhir: Ringkasan Materi (muncul setelah halaman materi terakhir selesai)
  const summaryParas = summary
    .split(/\n\s*\n|\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  slides.push({
    index: slides.length,
    sectionOrder: sections.length + 1,
    sectionTitle: `Ringkasan Materi ${moduleOrder}`,
    partLabel: "Halaman Akhir — Intisari Materi",
    paragraphs: summaryParas,
    isSummary: true,
  });

  return slides;
}

export function MateriReaderClient({
  moduleOrder,
  sections,
  summary,
}: {
  moduleOrder: number;
  moduleTitle: string;
  sections: SectionItem[];
  summary: string;
}) {
  const router = useRouter();
  const slides = buildSlides(moduleOrder, sections, summary);
  const totalSlides = slides.length;
  const totalMaterialSlides = Math.max(1, totalSlides - 1);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxVisited, setMaxVisited] = useState(0);
  const [summaryMarked, setSummaryMarked] = useState(false);

  // State untuk swipe sentuhan / drag mouse
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const active = slides[currentSlide] ?? slides[0];
  const isFirst = currentSlide === 0;
  const isLast = currentSlide === totalSlides - 1;
  const summaryUnlocked = maxVisited >= totalSlides - 1;

  // Progress bar di atas kotak materi
  const progressPct = active.isSummary
    ? 100
    : Math.round(((currentSlide + 1) / totalMaterialSlides) * 90);

  // Hanya mengizinkan pindah ke halaman yang sudah pernah dibuka secara berurutan
  function goToVisitedSlide(idx: number) {
    if (idx < 0 || idx > maxVisited) return;
    setCurrentSlide(idx);
  }

  function handlePrev() {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  }

  function handleNext() {
    if (currentSlide < totalSlides - 1) {
      const nextIdx = currentSlide + 1;
      setCurrentSlide(nextIdx);
      setMaxVisited((prev) => Math.max(prev, nextIdx));
    }
  }

  // Tandai materi + ringkasan selesai (progres materi 90%) hanya ketika semua halaman telah dibaca berurutan sampai ringkasan muncul
  useEffect(() => {
    if (
      currentSlide === totalSlides - 1 &&
      maxVisited >= totalSlides - 1 &&
      !summaryMarked
    ) {
      setSummaryMarked(true);
      fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleOrder, type: "summary" }),
      })
        .then(() => router.refresh())
        .catch(() => {});
    }
  }, [currentSlide, maxVisited, totalSlides, summaryMarked, moduleOrder, router]);

  // Navigasi dengan tombol panah kiri / kanan keyboard (tetap wajib berurutan satu per satu)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        setCurrentSlide((c) => {
          if (c < totalSlides - 1) {
            const next = c + 1;
            setMaxVisited((m) => Math.max(m, next));
            return next;
          }
          return c;
        });
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((c) => Math.max(0, c - 1));
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [totalSlides]);

  function onPointerDown(clientX: number) {
    touchStartX.current = clientX;
    touchEndX.current = null;
  }

  function onPointerMove(clientX: number) {
    touchEndX.current = clientX;
  }

  function onPointerUp() {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 45;
    if (diff > threshold && !isLast) {
      handleNext();
    } else if (diff < -threshold && !isFirst) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  }

  // Daftar titik di guliran bawah: titik Ringkasan tidak akan muncul sebelum seluruh halaman materi selesai dibaca satu per satu
  const visibleDots = slides.filter((s) => !s.isSummary || summaryUnlocked);

  return (
    <div className="flex-1 flex flex-col">
      {/* Area Pembaca Slide di atas latar merah muda */}
      <div className="bg-[#FDECEF] px-4 sm:px-10 py-8 flex-1 flex flex-col items-center justify-start">
        <div className="w-full max-w-3xl">
          {/* Bar atas indikator halaman & progress */}
          <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#0B2545] mb-2.5 px-1">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#00529B]" />
              <span>
                {active.isSummary
                  ? "Ringkasan Materi"
                  : `Subbab ${active.sectionOrder} • ${
                      active.partLabel ?? "Materi"
                    }`}
              </span>
            </span>
            <span className="bg-white border border-[#3A75B5] text-[#00529B] font-bold px-3 py-0.5 rounded-full text-xs">
              {active.isSummary
                ? "Ringkasan Akhir"
                : `Halaman ${currentSlide + 1} / ${totalMaterialSlides}`}
            </span>
          </div>

          <div className="w-full h-2 bg-white/80 border border-[#3A75B5]/30 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-[#00529B] rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Stage dengan tinggi tetap agar tombol Sebelumnya & Selanjutnya di bawahnya tidak pernah naik-turun,
              sementara ukuran kotak materi di dalamnya tetap mengikuti banyak/sedikitnya isi materi */}
          <div className="h-[360px] sm:h-[395px] flex flex-col justify-center">
            <div
              onTouchStart={(e) => onPointerDown(e.targetTouches[0].clientX)}
              onTouchMove={(e) => onPointerMove(e.targetTouches[0].clientX)}
              onTouchEnd={onPointerUp}
              onMouseDown={(e) => onPointerDown(e.clientX)}
              onMouseMove={(e) => {
                if (e.buttons === 1) onPointerMove(e.clientX);
              }}
              onMouseUp={onPointerUp}
              className={`w-full max-h-full overflow-y-auto border-2 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-md select-none transition-all duration-200 ${
                active.isSummary
                  ? "bg-gradient-to-br from-[#F0F7FF] to-white border-[#00529B]"
                  : "bg-white border-[#3A75B5]"
              }`}
            >
              <div>
                {/* Label kategori halaman */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  {active.isSummary ? (
                    <span className="inline-flex items-center gap-1.5 bg-[#00529B] text-white text-xs font-bold px-3 py-1 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-[#F5B700]" />
                      <span>RINGKASAN MATERI</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#00529B] uppercase tracking-wider bg-[#E6ECFA] px-3 py-1 rounded-md">
                      {active.sectionOrder}. {active.sectionTitle}
                    </span>
                  )}

                  {active.partLabel && !active.isSummary && (
                    <span className="text-xs font-medium text-gray-500">
                      {active.partLabel}
                    </span>
                  )}
                </div>

                {/* Judul pada halaman Ringkasan */}
                {active.isSummary && (
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#00529B] mb-3">
                    {active.sectionTitle}
                  </h2>
                )}

                {/* Isi Teks Halaman */}
                <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-gray-800 whitespace-pre-line">
                  {active.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              {/* Footer dalam kartu: petunjuk geser */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-gray-500">
                <span>
                  💡 Geser (swipe) kotak ke kiri/kanan atau gunakan tombol di
                  bawah
                </span>
                {active.isSummary && (
                  <span className="text-[#2E8B19] font-bold">
                    ✓ Materi & ringkasan selesai (Progres 90% — Selesaikan Quis
                    untuk 100%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigasi Depan - Belakang & Titik Halaman (Posisi Vertikal Tetap / Tidak Naik-Turun) */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={isFirst}
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 bg-white border border-[#3A75B5] text-[#0B2545] font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl hover:bg-[#E6ECFA] transition disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Indikator titik halaman: halaman yang belum dibaca terkunci agar tidak bisa di-skip */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-[240px] sm:max-w-md">
              {visibleDots.map((s) => {
                const isActive = s.index === currentSlide;
                const isVisited = s.index <= maxVisited;
                return (
                  <button
                    key={s.index}
                    type="button"
                    disabled={!isVisited}
                    onClick={() => goToVisitedSlide(s.index)}
                    title={
                      !isVisited
                        ? "Baca halaman secara berurutan terlebih dahulu"
                        : s.isSummary
                        ? "Ringkasan Materi"
                        : `Halaman ${s.index + 1}: ${s.sectionTitle}`
                    }
                    className={`h-2.5 rounded-full transition-all ${
                      isActive
                        ? "w-7 bg-[#00529B] cursor-pointer"
                        : s.isSummary
                        ? "w-2.5 bg-[#F5B700] cursor-pointer"
                        : isVisited
                        ? "w-2.5 bg-[#3A75B5]/65 hover:bg-[#3A75B5] cursor-pointer"
                        : "w-2.5 bg-gray-300/80 cursor-not-allowed"
                    }`}
                  />
                );
              })}
            </div>

            <button
              type="button"
              disabled={isLast}
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 bg-[#00529B] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-[#003E75] transition disabled:opacity-40 cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bar bawah berisi 2 tombol aksi (tanpa tombol Ringkasan) */}
      <div className="bg-[#E6ECFA] px-6 sm:px-14 py-7">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link
            href={`/video?materi=${moduleOrder}`}
            className="bg-white border border-[#3A75B5] rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-sm sm:text-base font-semibold text-[#0B2545] hover:shadow-md transition"
          >
            <PlaySquare className="w-6 h-6 fill-[#0B2545] text-white" />
            <span>Tonton video</span>
          </Link>

          <Link
            href={`/quiz/${moduleOrder}`}
            className="bg-white border border-[#3A75B5] rounded-xl py-4 px-6 flex items-center justify-center gap-3 text-sm sm:text-base font-semibold text-[#0B2545] hover:shadow-md transition"
          >
            <Award className="w-6 h-6" />
            <span>Mulai Quis</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
