"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Film } from "lucide-react";
import { MODULE_YOUTUBE_LINKS, extractYouTubeId } from "@/lib/video-links";

type VideoItem = {
  order: number;
  moduleTitle: string;
  videoTitle: string;
  duration: string;
  youtubeId: string;
};

const thumbColors: Record<number, { bg: string; iconColor: string }> = {
  1: { bg: "#00529B", iconColor: "#00529B" },
  2: { bg: "#E6ECFA", iconColor: "#FFFFFF" },
  3: { bg: "#F7B500", iconColor: "#FFFFFF" },
  4: { bg: "#FDE8EC", iconColor: "#FFFFFF" },
  5: { bg: "#E06363", iconColor: "#FFFFFF" },
  6: { bg: "#9EE0EE", iconColor: "#FFFFFF" },
};

function getModuleYouTubeId(item?: VideoItem): string | null {
  if (!item) return null;
  const configuredLink = MODULE_YOUTUBE_LINKS[item.order];
  if (configuredLink) {
    return extractYouTubeId(configuredLink);
  }
  return extractYouTubeId(item.youtubeId);
}

export function VideoClient({
  items,
  initialOrder,
}: {
  items: VideoItem[];
  initialOrder: number;
}) {
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState(initialOrder);
  const [playing, setPlaying] = useState(false);

  const current =
    items.find((i) => i.order === selectedOrder) ?? items[0];

  const currentYtId = getModuleYouTubeId(current);

  async function markVideoWatched(order: number) {
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleOrder: order, type: "video" }),
      });
      router.refresh();
    } catch {
      // ignore
    }
  }

  function handleStartPlay(order: number) {
    setPlaying(true);
    if (currentYtId) {
      markVideoWatched(order);
    }
  }

  return (
    <div className="w-full pb-16">
      <section className="bg-[#00529B] text-white px-6 sm:px-14 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-condensed-title text-2xl sm:text-3xl font-bold tracking-wide">
            Video Pembelajaran
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/95 font-semibold">
            Tonton video penjelasan materi PPKn yang interaktif
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-10 mt-6">
        <div className="text-xs sm:text-sm font-bold text-[#2E8B19] mb-2">
          Sedang Ditonton
        </div>

        {/* Area Pemutar Video */}
        <div className="w-full rounded-xl bg-[#D98282] min-h-[240px] sm:min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden shadow-sm border border-[#3A75B5]">
          {!playing ? (
            <div
              onClick={() => current && handleStartPlay(current.order)}
              className="w-full h-full min-h-[240px] sm:min-h-[420px] flex flex-col items-center justify-center relative cursor-pointer group"
            >
              {/* Thumbnail Preview Otomatis dari YouTube jika link tersedia */}
              {currentYtId && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://i.ytimg.com/vi/${currentYtId}/hqdefault.jpg`}
                    alt={current?.moduleTitle ?? "Thumbnail Video"}
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition pointer-events-none" />
                </>
              )}

              <div className="relative z-10 p-6 text-center flex flex-col items-center">
                <button
                  type="button"
                  aria-label="Putar video"
                  className="w-16 h-14 rounded-xl bg-black/90 text-white flex items-center justify-center group-hover:scale-105 transition cursor-pointer shadow-lg"
                >
                  <Play className="w-7 h-7 fill-current ml-0.5" />
                </button>
                {current && (
                  <div className="mt-3 text-white text-sm sm:text-lg font-bold drop-shadow-md">
                    Materi {current.order} — {current.moduleTitle}
                  </div>
                )}
              </div>
            </div>
          ) : currentYtId ? (
            <div className="w-full aspect-video bg-black">
              <iframe
                key={currentYtId}
                src={`https://www.youtube.com/embed/${currentYtId}?autoplay=1&rel=0`}
                title={current?.moduleTitle ?? "Video Pembelajaran"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full min-h-[260px] sm:min-h-[420px] border-0"
              />
            </div>
          ) : (
            <div className="max-w-md p-6 text-center text-white space-y-3">
              <Film className="w-10 h-10 mx-auto text-white/90" />
              <div className="text-base sm:text-lg font-bold">
                Video Materi {current?.order} Belum Tersedia
              </div>
              <p className="text-xs sm:text-sm text-white/90">
                Link video pembelajaran untuk materi ini belum ditambahkan.
              </p>
              <button
                type="button"
                onClick={() => setPlaying(false)}
                className="mt-1 inline-block bg-black/80 text-white text-xs sm:text-sm px-4 py-2 rounded-lg hover:bg-black cursor-pointer"
              >
                Kembali
              </button>
            </div>
          )}
        </div>

        {/* Semua Video */}
        <div className="mt-7">
          <div className="text-xs sm:text-sm font-bold text-[#2E8B19] mb-4">
            Semua Video
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => {
              const style = thumbColors[item.order] ?? thumbColors[1];
              const isSelected = item.order === current?.order;
              const ytId = getModuleYouTubeId(item);

              return (
                <button
                  key={item.order}
                  type="button"
                  onClick={() => {
                    setSelectedOrder(item.order);
                    setPlaying(false);
                  }}
                  className={`text-left border rounded-xl overflow-hidden bg-white transition hover:shadow-md cursor-pointer group ${
                    isSelected
                      ? "border-[#00529B] ring-2 ring-[#00529B]/30"
                      : "border-[#3A75B5]"
                  }`}
                >
                  <div
                    className="h-28 flex items-center justify-center rounded-b-lg relative overflow-hidden"
                    style={{ backgroundColor: style.bg }}
                  >
                    {ytId && (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                          alt={item.moduleTitle}
                          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        />
                        <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition pointer-events-none" />
                      </>
                    )}

                    <div className="relative z-10 w-9 h-7 rounded-md bg-black/90 flex items-center justify-center shadow-xs">
                      <Play
                        className="w-4 h-4 ml-0.5"
                        style={{
                          color: ytId ? "#FFFFFF" : style.iconColor,
                          fill: ytId ? "#FFFFFF" : style.iconColor,
                        }}
                      />
                    </div>
                  </div>
                  <div className="px-5 py-3.5">
                    <div className="text-xs sm:text-sm font-bold text-[#0B2545] leading-snug">
                      {item.moduleTitle}
                    </div>
                    <div className="text-xs font-semibold text-gray-600 mt-1">
                      Materi {item.order}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
