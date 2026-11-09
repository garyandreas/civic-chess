"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Info,
  BookOpen,
  PlaySquare,
  FileText,
  Award,
  User,
} from "lucide-react";

export function CivicChessLogo({ className = "h-12" }: { className?: string }) {
  return (
    <Link href="/" className={`inline-flex items-end select-none group ${className}`}>
      <svg
        viewBox="0 0 210 72"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="translate(4,3) rotate(-25 32 34)">
          <path
            d="M14 14 H20 V20 H25 V14 H31 V20 H36 V14 H42 V24 H14 Z"
            stroke="white"
            strokeWidth="3"
            fill="#00529B"
          />
          <path
            d="M44 27 C34 19, 16 23, 14 38 C12 52, 28 60, 44 52 L41 44 C31 49, 22 45, 23 37 C24 29, 33 27, 41 33 Z"
            stroke="white"
            strokeWidth="3.2"
            fill="#00529B"
          />
        </g>
        <text
          x="55"
          y="56"
          fill="white"
          fontFamily="var(--font-sans-body), system-ui, sans-serif"
          fontWeight="800"
          fontSize="22"
          letterSpacing="0.6"
        >
          IVIC CHESS
        </text>
      </svg>
    </Link>
  );
}

export function ChessRookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 4h2v3h3V4h4v3h3V4h2v5l-2 2v6l2 2v1H5v-1l2-2v-6L5 9V4z" />
    </svg>
  );
}

export function QuizPlusIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="14" height="16" rx="2" />
      <text
        x="6"
        y="12"
        fontSize="7"
        fontWeight="bold"
        fill="currentColor"
        stroke="none"
      >
        A+
      </text>
      <circle cx="17" cy="17" r="4" fill="white" stroke="currentColor" strokeWidth="1.8" />
      <path d="M17 15.3v3.4M15.3 17h3.4" strokeWidth="1.8" />
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/petunjuk", label: "Petunjuk", icon: Info },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/video", label: "Video", icon: PlaySquare },
  { href: "/ringkasan", label: "Ringkasan", icon: FileText },
  { href: "/chess", label: "Civic Chess", icon: ChessRookIcon },
  { href: "/quiz", label: "Quis", icon: QuizPlusIcon },
  { href: "/leaderboard", label: "Leaderboard", icon: Award },
  { href: "/profil", label: "Profil", icon: User },
];

export type NavbarUser = {
  name: string;
  username: string;
  points: number;
  avatarColor: string;
};

export function Navbar({ user }: { user?: NavbarUser }) {
  const pathname = usePathname();

  if (/^\/materi\/[^/]+$/.test(pathname)) {
    return null;
  }

  const isChessPage = pathname === "/chess" || pathname.startsWith("/chess/");
  const isHomePage = pathname === "/";

  return (
    <header className="w-full">
      <div
        className={`${
          isChessPage ? "bg-[#E8BDB9]" : "bg-[#00529B]"
        } px-6 sm:px-10 h-16 flex items-center justify-between`}
      >
        {isHomePage ? <CivicChessLogo className="h-14" /> : <div />}

        {user && (
          <Link
            href="/profil"
            className="inline-flex items-center gap-2.5 bg-white/15 hover:bg-white/25 text-white px-3.5 py-1.5 rounded-full text-xs sm:text-sm transition"
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-[#00529B]"
              style={{ backgroundColor: user.avatarColor || "#A7F3D0" }}
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="font-semibold">@{user.username}</span>
            <span className="bg-[#F5B700] text-black font-bold px-2 py-0.5 rounded-full text-[11px]">
              {user.points} Poin
            </span>
          </Link>
        )}
      </div>

      <nav
        className={`${
          isChessPage
            ? "bg-[#FDF2F2] border-b border-[#e5d2d2]"
            : "bg-[#E6ECFA] border-b border-[#cfd9f2]"
        } px-4 sm:px-10 py-2 overflow-x-auto`}
      >
        <ul className="max-w-6xl mx-auto flex items-center justify-between gap-2 min-w-[640px]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-md transition-colors ${
                    active
                      ? "text-[#00529B] font-semibold bg-white/70 shadow-xs"
                      : "text-black hover:bg-white/40"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs sm:text-sm leading-tight">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
