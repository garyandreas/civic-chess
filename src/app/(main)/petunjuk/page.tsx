import { Lightbulb } from "lucide-react";

export default function PetunjukPage() {
  const steps = [
    {
      num: 1,
      title: "Pelajari Materi & Video",
      desc: "Baca modul materi dan tonton video pembelajaran yang tersedia di setiap bab.",
    },
    {
      num: 2,
      title: "Main Civic Chess",
      desc: "Uji pemahamanmu melalui permainan catur interaktif bertemakan nilai Pancasila.",
    },
    {
      num: 3,
      title: "Latihan Quiz",
      desc: "Kerjakan kuis setiap bab untuk memantapkan pemahaman dan kumpulkan poin.",
    },
  ];

  return (
    <div className="w-full pb-16">
      {/* Header biru */}
      <section className="bg-[#00529B] text-white px-6 sm:px-16 py-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-condensed-title text-2xl sm:text-3xl font-bold tracking-wide">
            Petunjuk Penggunaan
          </h1>
          <p className="mt-1.5 text-sm sm:text-base text-white/95">
            Cara menggunakan Civic Chess untuk belajar PPKn secara efektif
          </p>
        </div>
      </section>

      {/* Daftar langkah */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 mt-8 space-y-6">
        {steps.map((s) => (
          <div
            key={s.num}
            className="border border-[#3A75B5] rounded-xl px-6 sm:px-10 py-6 bg-white"
          >
            <h2 className="text-xl sm:text-2xl font-normal text-black">
              {s.num}. {s.title}
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-gray-900 pl-6">
              {s.desc}
            </p>
          </div>
        ))}

        {/* Kotak Tips */}
        <div className="mt-8 border border-[#3A75B5] bg-[#FDF2F7] px-6 py-3.5 flex items-center justify-center gap-2.5 text-center text-xs sm:text-sm text-black">
          <Lightbulb className="w-5 h-5 text-[#F5B700] shrink-0" />
          <span>
            Tips: Kumpulkan poin sebanyak mungkin dari quiz dan game untuk naik
            peringkat di leaderboard kelas!
          </span>
        </div>
      </section>
    </div>
  );
}
