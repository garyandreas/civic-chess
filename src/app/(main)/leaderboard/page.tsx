import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const currentUser = await requireUser();

  const users = await prisma.user.findMany({
    where: {
      OR: [{ publicProfile: true }, { id: currentUser.id }],
    },
    orderBy: [{ points: "desc" }, { name: "asc" }],
  });

  return (
    <div className="flex-1 bg-[#FDECEF] pb-16">
      <div className="bg-[#00529B] h-10 rounded-b-xl" />

      <section className="max-w-5xl mx-auto px-4 sm:px-10 mt-7">
        <div className="bg-white border-2 border-[#00529B] rounded-xl p-8 sm:p-12 min-h-[480px]">
          <h1 className="font-condensed-title text-3xl sm:text-4xl font-bold text-[#083B6B] uppercase tracking-wide">
            LEADERBOARD
          </h1>
          <p className="mt-2 text-base sm:text-xl font-bold text-black">
            Peringkat peserta didik berdasarkan total poin
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 max-w-3xl">
            <span className="inline-block border border-[#3A75B5] bg-[#FDECEF] text-black font-bold text-base sm:text-xl px-8 py-3 rounded-xl">
              Kelas Saya ({currentUser.className})
            </span>

            {!currentUser.publicProfile && (
              <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg">
                Profil publikmu sedang nonaktif (hanya terlihat olehmu)
              </span>
            )}
          </div>

          <div className="mt-2 max-w-3xl">
            <div className="text-xs text-gray-300 font-sans mb-1 pl-0.5">
              Table
            </div>
            <div className="border border-gray-200 overflow-hidden font-sans">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#E6BFC1] text-white">
                    <th className="w-1/2 py-2.5 px-4 text-center font-normal border-r border-gray-200 uppercase">
                      NAMA
                    </th>
                    <th className="w-1/2 py-2.5 px-4 text-center font-normal uppercase">
                      POIN
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-black">
                  {users.map((u, idx) => {
                    const isMe = u.id === currentUser.id;
                    return (
                      <tr
                        key={u.id}
                        className={isMe ? "bg-[#FDECEF] font-bold" : ""}
                      >
                        <td className="py-2.5 px-4 border-r border-gray-200">
                          {idx + 1}. {u.name.toUpperCase()}
                          {isMe ? " (KAMU)" : ""}
                        </td>
                        <td className="py-2.5 px-4">{u.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
