import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, Geist_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  variable: "--font-serif-heading",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Civic Chess — Media Pembelajaran PPKn Interaktif",
  description:
    "Media pembelajaran PPKn daring sesuai Kurikulum Merdeka dengan permainan catur edukatif Civic Chess.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakarta.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#111827]">
        {children}
      </body>
    </html>
  );
}
