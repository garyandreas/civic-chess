"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
  Volume2,
  Eye,
  LogOut,
  Pencil,
  UserPlus,
  Check,
  X,
} from "lucide-react";

const AVATAR_COLORS = [
  "#A7F3D0",
  "#9EE0EE",
  "#F5B700",
  "#F9B8C0",
  "#C7D2FE",
  "#FCA5A5",
];

type ProfileUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  className: string;
  school: string;
  bio: string;
  avatarColor: string;
  points: number;
  notifEnabled: boolean;
  soundEnabled: boolean;
  publicProfile: boolean;
};

export function ProfilClient({
  user,
  completedModules,
  totalModules,
  avgScore,
  quizHistory,
  chessHistory,
}: {
  user: ProfileUser;
  completedModules: number;
  totalModules: number;
  avgScore: number;
  quizHistory: {
    id: string;
    title: string;
    score: number;
    points: number;
    correct: number;
    total: number;
  }[];
  chessHistory: {
    id: string;
    levelNumber: number;
    levelTitle: string;
    result: string;
    points: number;
  }[];
}) {
  const router = useRouter();
  const [notifOn, setNotifOn] = useState(user.notifEnabled);
  const [soundOn, setSoundOn] = useState(user.soundEnabled);
  const [publicProfile, setPublicProfile] = useState(user.publicProfile);

  // State Edit Profil
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [username, setUsername] = useState(user.username);
  const [role, setRole] = useState(user.role);
  const [className, setClassName] = useState(user.className);
  const [school, setSchool] = useState(user.school);
  const [bio, setBio] = useState(user.bio);
  const [avatarColor, setAvatarColor] = useState(user.avatarColor);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  async function updateToggle(field: string, value: boolean) {
    try {
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      router.refresh();
    } catch {
      // ignore
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFeedback("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          role,
          className,
          school,
          bio,
          avatarColor,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback(data.error || "Gagal menyimpan profil.");
      } else {
        setEditing(false);
        setFeedback("Profil berhasil diperbarui!");
        router.refresh();
      }
    } catch {
      setFeedback("Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  }

  const roleLabel =
    role === "TEACHER"
      ? "Guru Mata Pelajaran"
      : `Siswa Kelas ${className}`;

  return (
    <div className="w-full pb-16 bg-white">
      {/* Banner biru atas sesuai screenshot */}
      <section className="bg-[#00529B] text-white px-6 sm:px-14 pt-8 pb-8 rounded-b-2xl">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="font-condensed-title text-2xl sm:text-3xl font-bold uppercase tracking-wide">
              PROGRES BELAJAR
            </h1>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing((v) => !v);
                  setFeedback("");
                }}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs sm:text-sm font-semibold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>{editing ? "Tutup Edit" : "Edit Profil"}</span>
              </button>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 bg-white text-[#00529B] text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl hover:bg-gray-100 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Buat Profil Baru</span>
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-6">
            {/* Avatar lingkaran putih */}
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
              <svg
                viewBox="0 0 64 64"
                className="w-20 h-20"
                fill={avatarColor}
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="21" r="11" />
                <path d="M14 44 C14 38, 50 38, 50 44 C50 53, 14 53, 14 44 Z" />
              </svg>
            </div>

            <div>
              <div className="text-lg sm:text-xl font-normal text-white">
                {name.toUpperCase()} - {roleLabel}
              </div>
              <div className="text-xs sm:text-sm text-[#B5D6F6] mt-0.5">
                @{username} • {school} • {user.points} Poin
              </div>
              {bio && (
                <p className="text-xs text-white/85 mt-1 italic">
                  &ldquo;{bio}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* 2 Kotak putih di kanan bawah sesuai screenshot */}
          <div className="mt-4 flex flex-wrap justify-end gap-6">
            <div className="bg-white text-black rounded-xl px-10 py-3 min-w-[170px] text-center shadow-xs">
              <span className="text-xl sm:text-2xl font-bold">
                Modul {completedModules}/{totalModules}
              </span>
            </div>

            <div className="bg-white text-black rounded-xl px-8 py-3 min-w-[170px] flex items-baseline justify-center gap-2 shadow-xs">
              <span className="text-xl sm:text-2xl font-bold">{avgScore}</span>
              <span className="text-xs font-bold">Rata-Rata Kuis</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 sm:px-14 mt-8 space-y-6">
        {feedback && (
          <div className="bg-[#E6ECFA] border border-[#3A75B5] text-[#00529B] text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl">
            {feedback}
          </div>
        )}

        {/* Form Edit Profil */}
        {editing && (
          <form
            onSubmit={handleSaveProfile}
            className="border-2 border-[#00529B] rounded-2xl p-6 bg-[#F8FAFF] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-condensed-title text-xl font-bold text-[#00529B]">
                EDIT PROFIL AKUN
              </h2>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-gray-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Username (@)
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, "")
                    )
                  }
                  className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Peran
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white"
                >
                  <option value="STUDENT">Peserta Didik</option>
                  <option value="TEACHER">Guru Mata Pelajaran</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Kelas
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Sekolah
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Bio Profil
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black mb-1">
                  Warna Avatar
                </label>
                <div className="flex items-center gap-2.5 pt-1">
                  {AVATAR_COLORS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => setAvatarColor(hex)}
                      className={`w-7 h-7 rounded-full border cursor-pointer ${
                        avatarColor === hex
                          ? "border-black scale-110 ring-2 ring-[#00529B]"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 bg-[#00529B] text-white text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#003E75] cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
              </button>
            </div>
          </form>
        )}

        {/* Baris 1: Notifikasi belajar */}
        <div className="border-b border-gray-400 pb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Bell className="w-7 h-7 text-[#A7F3D0] fill-[#A7F3D0] shrink-0" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-black leading-tight">
                Notifikasi belajar
              </div>
              <div className="text-xs text-black">
                Pengingat jadwal belajar harian
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !notifOn;
              setNotifOn(next);
              updateToggle("notifEnabled", next);
            }}
            aria-label="Toggle Notifikasi belajar"
            className={`w-12 h-6 rounded-full p-0.5 transition flex items-center cursor-pointer ${
              notifOn ? "bg-[#A7F3D0] justify-end" : "bg-[#FCA5A5] justify-start"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Baris 2: Suara game */}
        <div className="border-b border-gray-400 pb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Volume2 className="w-7 h-7 text-[#A7F3D0] fill-[#A7F3D0] shrink-0" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-black leading-tight">
                Suara game
              </div>
              <div className="text-xs text-black">
                Efek suara saat bermain catur
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              updateToggle("soundEnabled", next);
            }}
            aria-label="Toggle Suara game"
            className={`w-12 h-6 rounded-full p-0.5 transition flex items-center cursor-pointer ${
              soundOn ? "bg-[#A7F3D0] justify-end" : "bg-[#FCA5A5] justify-start"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Baris 3: Profil publik */}
        <div className="border-b border-gray-400 pb-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Eye className="w-7 h-7 text-[#E6BFC1] shrink-0" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-black leading-tight">
                Profil publik
              </div>
              <div className="text-xs text-black">
                Tampil di leaderboard kelas
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !publicProfile;
              setPublicProfile(next);
              updateToggle("publicProfile", next);
            }}
            aria-label="Toggle Profil publik"
            className={`w-12 h-6 rounded-full p-0.5 transition flex items-center cursor-pointer ${
              publicProfile
                ? "bg-[#A7F3D0] justify-end"
                : "bg-[#FCA5A5] justify-start"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
          </button>
        </div>

        {/* Ringkasan Riwayat Aktivitas Akun Ini */}
        {(quizHistory.length > 0 || chessHistory.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="border border-[#3A75B5] rounded-xl p-4 bg-white">
              <div className="text-sm font-bold text-[#00529B] mb-2">
                Riwayat Quis Akun Ini
              </div>
              {quizHistory.length === 0 ? (
                <p className="text-xs text-gray-500">Belum ada kuis.</p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {quizHistory.map((q) => (
                    <li
                      key={q.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-1"
                    >
                      <span className="truncate pr-2">{q.title}</span>
                      <span className="font-bold text-[#00529B] shrink-0">
                        Skor {q.score} (+{q.points})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-[#3A75B5] rounded-xl p-4 bg-white">
              <div className="text-sm font-bold text-[#00529B] mb-2">
                Riwayat Civic Chess Akun Ini
              </div>
              {chessHistory.length === 0 ? (
                <p className="text-xs text-gray-500">Belum ada permainan.</p>
              ) : (
                <ul className="space-y-1.5 text-xs">
                  {chessHistory.map((g) => (
                    <li
                      key={g.id}
                      className="flex items-center justify-between border-b border-gray-100 pb-1"
                    >
                      <span>
                        Level {g.levelNumber} ({g.result})
                      </span>
                      <span className="font-bold text-[#00529B]">
                        +{g.points} Poin
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Tombol Keluar */}
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={handleLogout}
            className="border border-[#3A75B5] bg-[#FDECEF] hover:bg-[#fbd8df] text-black font-bold text-lg sm:text-xl px-12 py-3 rounded-xl inline-flex items-center gap-2 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-[#EF4444]" />
            <span>Keluar</span>
          </button>
        </div>
      </section>
    </div>
  );
}
