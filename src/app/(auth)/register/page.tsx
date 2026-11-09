"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CivicChessLogo } from "@/components/navbar";
import { UserPlus } from "lucide-react";

const AVATAR_COLORS = [
  { label: "Mint", hex: "#A7F3D0" },
  { label: "Biru Muda", hex: "#9EE0EE" },
  { label: "Kuning Emas", hex: "#F5B700" },
  { label: "Merah Muda", hex: "#F9B8C0" },
  { label: "Lavender", hex: "#C7D2FE" },
  { label: "Coral", hex: "#FCA5A5" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [className, setClassName] = useState("XI IPA 1");
  const [school, setSchool] = useState("SMA Negeri 1");
  const [bio, setBio] = useState("Siap belajar PPKn bersama Civic Chess!");
  const [avatarColor, setAvatarColor] = useState("#A7F3D0");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          role,
          className,
          school,
          bio,
          avatarColor,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal membuat profil.");
        setLoading(false);
        return;
      }

      await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      });
      router.push("/");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan saat membuat profil.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#3A75B5] overflow-hidden">
        <div className="bg-[#00529B] px-6 py-6 flex flex-col items-center text-white text-center">
          <CivicChessLogo className="h-14" />
          <h1 className="mt-2 font-condensed-title text-2xl font-bold tracking-wide">
            BUAT PROFIL BARU
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-white/90">
            Mulai progres belajarmu dari nol dan simpan skor atas namamu sendiri
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-xs sm:text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Pratinjau Avatar */}
          <div className="flex items-center gap-4 bg-[#E6ECFA] p-3.5 rounded-xl">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
              <svg
                viewBox="0 0 64 64"
                className="w-12 h-12"
                fill={avatarColor}
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="32" cy="21" r="11" />
                <path d="M14 44 C14 38, 50 38, 50 44 C50 53, 14 53, 14 44 Z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-black">
                {name || "Nama Lengkapmu"}{" "}
                <span className="text-xs font-normal text-[#00529B]">
                  @{username || "username"}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                {role === "TEACHER"
                  ? "Guru Mata Pelajaran"
                  : `Siswa Kelas ${className}`}{" "}
                • {school}
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] text-gray-700">Warna Avatar:</span>
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setAvatarColor(c.hex)}
                    title={c.label}
                    className={`w-5 h-5 rounded-full border cursor-pointer ${
                      avatarColor === c.hex
                        ? "border-black scale-110 ring-2 ring-[#00529B]"
                        : "border-gray-400"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!username) {
                    setUsername(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "")
                        .slice(0, 16)
                    );
                  }
                }}
                className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                placeholder="Nama lengkap kamu"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Username Unik
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
                className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                placeholder="username"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Peran
              </label>
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "STUDENT" | "TEACHER")
                }
                className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black bg-white focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
              >
                <option value="STUDENT">Peserta Didik</option>
                <option value="TEACHER">Guru Mapel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Kelas / Jabatan
              </label>
              <input
                type="text"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                placeholder="XI IPA 1"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Sekolah
              </label>
              <input
                type="text"
                required
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                className="w-full border border-[#3A75B5] rounded-lg px-3 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                placeholder="SMA Negeri 1"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
              Bio Singkat
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
              placeholder="Motto atau bio belajar kamu"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                placeholder="nama@sekolah.id"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
                Password (min. 6 karakter)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00529B] text-white font-semibold py-2.5 rounded-lg hover:bg-[#003E75] transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>
              {loading ? "Membuat Profil..." : "Buat Profil & Mulai Belajar"}
            </span>
          </button>

          <p className="text-center text-xs sm:text-sm text-gray-700 pt-1">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-[#00529B] font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
