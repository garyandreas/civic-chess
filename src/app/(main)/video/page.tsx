import { prisma } from "@/lib/prisma";
import { VideoClient } from "./video-client";

export const dynamic = "force-dynamic";

export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<{ materi?: string }>;
}) {
  const sp = await searchParams;
  const activeOrder = Number(sp.materi) || 1;

  const modules = await prisma.module.findMany({
    orderBy: { order: "asc" },
    include: { videos: true },
  });

  const items = modules.map((m) => ({
    order: m.order,
    moduleTitle: m.title,
    videoTitle: m.videos[0]?.title ?? m.title,
    duration: m.videos[0]?.duration ?? "08:00",
    youtubeId: m.videos[0]?.youtubeId ?? "",
  }));

  return <VideoClient items={items} initialOrder={activeOrder} />;
}
