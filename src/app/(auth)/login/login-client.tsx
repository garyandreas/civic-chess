"use client";

import { useState, useRef } from "react";
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
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const firstAcc = accounts[0];
  const placeholderText = firstAcc
    ? `contoh: @${firstAcc.username} atau ${firstAcc.email}`
    : "contoh: @username atau email@sekolah.id";

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

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
        setError("Username/Email atau password salah.");
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

  function handleSelectSavedAccount(acc: SavedAccount) {
    setError("");
    setSelectedAccountId(acc.id);
    setIdentifier(`@${acc.username}`);
    setPassword("");
    setTimeout(() => {
      passwordInputRef.current?.focus();
    }, 30);
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

          {selectedAccount && (
            <div className="bg-[#E6ECFA] border border-[#00529B]/40 text-[#0B2545] text-xs px-3.5 py-2.5 rounded-lg flex items-center justify-between gap-2">
              <span>
                Akun dipilih: <strong>{selectedAccount.name}</strong> (@
                {selectedAccount.username}). Masukkan password di bawah untuk
                masuk.
              </span>
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
              onChange={(e) => {
                setIdentifier(e.target.value);
                setSelectedAccountId(null);
              }}
              className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
              placeholder={placeholderText}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-black mb-1">
              Password
            </label>
            <input
              ref={passwordInputRef}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#3A75B5] rounded-lg px-3.5 py-2.5 text-sm text-black focus:outline-hidden focus:ring-2 focus:ring-[#00529B]"
              placeholder={
                selectedAccount
                  ? `Masukkan password untuk ${selectedAccount.name}`
                  : "••••••••"
              }
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

          {/* Daftar Akun Tersimpan (Wajib memasukkan password setelah dipilih) */}
          {accounts.length > 0 && (
            <div className="bg-[#E6ECFA] p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#00529B]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pilih Akun Tersimpan (Tetap Wajib Password):</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {accounts.map((acc) => {
                  const isSelected = acc.id === selectedAccountId;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      disabled={loading}
                      onClick={() => handleSelectSavedAccount(acc)}
                      className={`bg-white border text-black text-xs py-2 px-2.5 rounded-lg hover:bg-gray-50 cursor-pointer text-left transition flex items-center gap-2 ${
                        isSelected
                          ? "border-[#00529B] ring-2 ring-[#00529B]"
                          : "border-[#3A75B5]"
                      }`}
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
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
