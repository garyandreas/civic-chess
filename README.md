# ♟️ Civic Chess — Media Pembelajaran Interaktif PPKn

**Civic Chess** adalah aplikasi web pembelajaran interaktif mata pelajaran **Pendidikan Pancasila dan Kewarganegaraan (PPKn) Kelas XI — BAB III: Bhinneka Tunggal Ika sebagai Pemersatu Bangsa** yang memadukan modul bacaan berhalaman (*swipeable reader*), video pembelajaran, kuis evaluasi (pilihan ganda & esai), papan peringkat (*leaderboard*) kelas, serta permainan catur edukatif (**Civic Chess**).

---

## ✨ Fitur Utama

1. **Autentikasi & Manajemen Profil per Akun (NextAuth v5):**
   - Setiap peserta didik wajib login atau membuat profil baru dari nol (`0 Poin`, `0% Progres`).
   - Edit profil lengkap (Nama, `@username`, kelas, sekolah, bio, warna avatar, dan pengaturan privasi *leaderboard*).
2. **Pembaca Materi Interaktif per Halaman (*Sequential Swipeable Reader*):**
   - Materi tiap modul dipecah menjadi kartu halaman ringkas yang dapat digeser (*swipe*) atau dinavigasi secara berurutan.
   - Halaman **Ringkasan Materi** otomatis *pop-up* setelah seluruh halaman materi dibaca satu per satu (progres terkunci di `90%` hingga kuis diselesaikan).
3. **Video Pembelajaran Terintegrasi:**
   - Pemutar video HTML5 dengan *preview* otomatis dari berkas video modul (`public/videos/modul-{1..4}.mp4`).
4. **Evaluasi Kuis Pilihan Ganda & Esai:**
   - Kuis pilihan ganda (A–E) dilengkapi pembahasan otomatis dan poin langsung ke akun.
   - Lembar jawab esai refleksi yang tersimpan per akun pada setiap modul.
   - Penyelesaian kuis menaikkan progres modul dari `90%` menjadi `100%` (*Modul Selesai*).
5. **Permainan Catur Edukatif (*Civic Chess*):**
   - Papan catur interaktif melawan AI (`chess.js`) dengan 4 tingkat kesulitan sesuai modul.
   - Setiap kali bidak berhasil memakan bidak lawan, muncul kuis PPKn (*Civic Question*) untuk meraih poin tambahan.
6. **Leaderboard Kelas Real-Time:**
   - Peringkat peserta didik diurutkan secara dinamis berdasarkan total poin dari kuis dan permainan *Civic Chess*.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Google Fonts (`Fraunces` & `Plus Jakarta Sans`)
- **Database & ORM:** [Prisma ORM 7](https://www.prisma.io/) + SQLite (`better-sqlite3` untuk lokal)
- **Authentication:** [NextAuth.js v5 (Auth.js)](https://authjs.dev/)
- **Game Engine:** [chess.js](https://github.com/jhlywa/chess.js)

---

## 🚀 Cara Menjalankan di Lokal

1. **Clone repositori & instal dependensi:**
   ```bash
   git clone <url-repo-github-anda>
   cd projectkakyani
   npm install
   ```

2. **Siapkan variabel lingkungan (`.env`):**
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Inisialisasi database & isi materi awal (*seed*):**
   ```bash
   npm run setup
   ```

4. **(Opsional) Tambahkan video modul:**
   Letakkan file video pembelajaran ke dalam folder `public/videos/` dengan nama `modul-1.mp4`, `modul-2.mp4`, `modul-3.mp4`, dan `modul-4.mp4`.

5. **Jalankan server pengembangan:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser.
