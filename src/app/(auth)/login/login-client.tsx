"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { CivicChessLogo } from "@/components/navbar";
import { Lock, UserPlus, Sparkles } from "lucide-react";

type SavedAccount = {
  id: string;
  name: string;
  username: string;
  email: string;
  points: number;
  className: string;
  avatarColor: string;
};

export function LoginClient({ accounts }: { accounts: SavedAccount[] }) {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const firstAcc = accounts[0];
  const placeholderText = firstAcc
    ? `contoh: @${firstAcc.username} atau ${firstAcc.email}`
    : "contoh: @username atau email@sekolah.id";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Email/Username atau password salah.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Gagal masuk. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function quickLogin(userId: string) {
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        quickSwitchUserId: userId,
        redirect: false,
      });
      if (!res?.error) {
        router.push("/");
        router.refresh();
      } else {
        setError("Gagal masuk ke akun tersebut.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#3A75B5] overflow-hidden">
        <div className="bg-[#00529B] px-6 py-7 flex flex-col items-center text-white text-center">
          <CivicChessLogo className="h-14" />
          <p className="mt-2.5 text-xs sm:text-sm text-white/90">
            Masuk ke akunmu untuk menyimpan progres belajar, kuis, dan skor
            Civic Chess
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-xs sm:text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
              Username atau Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
              placeholder={placeholderText}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00529B] text-white font-semibold py-2.5 rounded-lg hover:bg-[#003E75] transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? "Memproses..." : "Masuk"}</span>
          </button>

          {/* Buat profil baru dari nol */}
          <div className="pt-2 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-600 mb-2.5">
              Belum punya profil? Buat profil baru dari nol (0 Poin):
            </p>
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center gap-2 border-2 border-[#00529B] text-[#00529B] font-bold py-2.5 rounded-lg hover:bg-[#E6ECFA] transition text-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Buat Profil Baru</span>
            </Link>
          </div>

          {/* Daftar Akun Tersimpan (Sinkron Otomatis dengan Database & Edit Profil) */}
          {accounts.length > 0 && (
            <div className="bg-[#E6ECFA] p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#00529B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pilih Akun Tersimpan (Masuk Cepat):</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    disabled={loading}
                    onClick={() => quickLogin(acc.id)}
                    className="bg-white border border-[#3A75B5] text-black text-xs py-2 px-2.5 rounded-lg hover:bg-gray-50 cursor-pointer text-left transition flex items-center gap-2"
                  >
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-[#0B2545] shrink-0"
                      style={{ backgroundColor: acc.avatarColor }}
                    >
                      {acc.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold truncate">{acc.name}</div>
                      <div className="text-[10px] text-gray-600 truncate">
                        @{acc.username} • {acc.points} Poin
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
