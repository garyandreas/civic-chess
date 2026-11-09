/**
 * Seed Materi Civic Chess — BAB III: Bhinneka Tunggal Ika sebagai Pemersatu Bangsa
 * Berisi Modul 1–4 lengkap beserta subbab, Ringkasan Materi, Kuis Pilihan Ganda,
 * Soal Esai, serta 15 Soal Khusus Kuis Civic Chess (pilihan A–E).
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL ??
      "",
  }),
});

type Q = {
  text: string;
  options: string[];
  answer: number;
  explanation: string;
};

type ModuleSeed = {
  order: number;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  sections: { title: string; content: string }[];
  summary: string;
  video: { title: string; youtubeId: string; duration: string };
  questions: Q[];
  chessQuestions: Q[];
};

const bab3Intro =
  "Indonesia merupakan negara yang memiliki keberagaman masyarakat. Perbedaan tersebut dapat menjadi kekuatan apabila dikelola dengan baik, tetapi juga dapat menimbulkan konflik apabila tidak disertai sikap saling menghormati. Bhinneka Tunggal Ika berperan sebagai pedoman untuk menjaga persatuan di tengah keberagaman. Semboyan ini mengingatkan masyarakat bahwa perbedaan bukanlah alasan untuk memisahkan diri, melainkan kenyataan yang harus diterima dan dihargai. Persatuan tidak berarti menghilangkan perbedaan. Persatuan berarti membangun kesadaran bahwa setiap warga negara memiliki kedudukan sebagai bagian dari bangsa Indonesia. Dengan menerapkan nilai Bhinneka Tunggal Ika, masyarakat diharapkan mampu membangun kehidupan yang harmonis melalui toleransi, gotong royong, saling menghargai, dan kerja sama.";

const civicChess15Questions: Q[] = [
  {
    text: "Semboyan Bhinneka Tunggal Ika berasal dari kitab Kakawin Sutasoma yang ditulis oleh ....",
    options: [
      "Mpu Prapanca",
      "Mpu Tantular",
      "Empu Sedah",
      "Mpu Kanwa",
      "Ki Hajar Dewantara",
    ],
    answer: 1,
    explanation:
      "Mpu Tantular — Semboyan Bhinneka Tunggal Ika berasal dari Kakawin Sutasoma karya Mpu Tantular.",
  },
  {
    text: "Makna utama semboyan Bhinneka Tunggal Ika dalam kehidupan bangsa Indonesia adalah ....",
    options: [
      "menghilangkan seluruh perbedaan yang ada di masyarakat",
      "mengutamakan kebudayaan mayoritas daripada kebudayaan lainnya",
      "menyatukan seluruh masyarakat dengan latar belakang yang sama",
      "berbeda-beda tetapi tetap satu sebagai bangsa Indonesia",
      "membatasi interaksi antarkelompok yang memiliki perbedaan",
    ],
    answer: 3,
    explanation:
      "Berbeda-beda tetapi tetap satu — Semboyan ini mengajarkan bahwa perbedaan tidak menghalangi masyarakat Indonesia untuk bersatu sebagai satu bangsa.",
  },
  {
    text: "Di sebuah sekolah, terdapat siswa yang berasal dari berbagai suku dan agama. Ketika salah satu siswa menjalankan ibadah sesuai agamanya, siswa lain memberikan kesempatan dan menghormatinya. Sikap tersebut merupakan bentuk ....",
    options: [
      "toleransi dalam keberagaman",
      "persaingan antarkelompok",
      "penyeragaman kebudayaan",
      "pengutamaan kepentingan pribadi",
      "pembatasan kebebasan beragama",
    ],
    answer: 0,
    explanation:
      "Toleransi dalam keberagaman — Menghormati orang lain yang menjalankan ibadah merupakan bentuk toleransi dan penghargaan terhadap perbedaan agama.",
  },
  {
    text: "Perkembangan teknologi dan perubahan budaya dapat memengaruhi nilai serta norma dalam masyarakat. Sikap yang tepat dalam menghadapi perubahan tersebut adalah ....",
    options: [
      "menerima seluruh perubahan tanpa mempertimbangkan dampaknya",
      "menolak semua bentuk perubahan dari luar",
      "mengikuti kebiasaan orang lain agar tidak dianggap berbeda",
      "mempertahankan semua kebiasaan lama tanpa pengecualian",
      "menyaring perubahan dengan mempertimbangkan nilai Pancasila dan dampaknya bagi masyarakat",
    ],
    answer: 4,
    explanation:
      "Menyaring perubahan dengan mempertimbangkan nilai Pancasila dan dampaknya bagi masyarakat — Perubahan perlu disikapi secara kritis dengan mempertimbangkan nilai moral, norma, dan kepentingan bersama.",
  },
  {
    text: "Perselisihan terjadi antara dua kelompok siswa karena perbedaan pendapat mengenai kegiatan sekolah. Tindakan yang paling tepat untuk menyelesaikan persoalan tersebut adalah ....",
    options: [
      "membiarkan kedua kelompok menyelesaikan masalah dengan caranya masing-masing",
      "mendukung kelompok yang memiliki anggota paling banyak",
      "mengadakan musyawarah untuk mencari kesepakatan bersama",
      "meminta salah satu kelompok mengalah tanpa mendengarkan pendapatnya",
      "memisahkan kedua kelompok agar tidak perlu berinteraksi kembali",
    ],
    answer: 2,
    explanation:
      "Mengadakan musyawarah untuk mencari kesepakatan bersama — Musyawarah memberikan kesempatan kepada setiap pihak untuk menyampaikan pendapat dan mencari penyelesaian yang dapat diterima bersama.",
  },
  {
    text: "Kerja sama merupakan kegiatan yang dilakukan oleh dua pihak atau lebih untuk mencapai tujuan bersama. Salah satu manfaat kerja sama dalam kehidupan masyarakat adalah ....",
    options: [
      "meningkatkan persaingan untuk menguasai sumber daya",
      "meringankan pekerjaan dan mempererat persatuan",
      "mengurangi tanggung jawab setiap anggota masyarakat",
      "menghilangkan seluruh perbedaan pendapat",
      "menjadikan kepentingan pribadi sebagai prioritas utama",
    ],
    answer: 1,
    explanation:
      "Meringankan pekerjaan dan mempererat persatuan — Kerja sama membantu mencapai tujuan secara lebih efektif sekaligus memperkuat solidaritas dan hubungan sosial.",
  },
  {
    text: "Warga sebuah desa secara sukarela membantu tetangganya memperbaiki rumah yang rusak akibat bencana. Mereka bekerja bersama tanpa mengharapkan imbalan. Kegiatan tersebut mencerminkan ....",
    options: [
      "persaingan sosial",
      "kepentingan individu",
      "transaksi ekonomi",
      "gotong royong dalam bentuk tolong-menolong",
      "kerja bakti untuk kepentingan fasilitas umum",
    ],
    answer: 3,
    explanation:
      "Gotong royong dalam bentuk tolong-menolong — Membantu tetangga yang mengalami kesulitan merupakan bentuk tolong-menolong yang dilandasi kepedulian dan semangat kekeluargaan.",
  },
  {
    text: "Menurut pembagian bentuk gotong royong yang dikemukakan Koentjaraningrat, kegiatan warga membersihkan saluran air dan memperbaiki jalan desa untuk kepentingan umum termasuk ....",
    options: [
      "kerja bakti",
      "tolong-menolong untuk kepentingan pribadi",
      "kegiatan ekonomi perseorangan",
      "persaingan dalam masyarakat",
      "hubungan kerja berdasarkan upah",
    ],
    answer: 0,
    explanation:
      "Kerja bakti — Kerja bakti merupakan kegiatan bersama untuk memenuhi kepentingan umum, seperti membersihkan lingkungan dan memperbaiki fasilitas desa.",
  },
  {
    text: "Perhatikan beberapa kegiatan berikut!\n1. Membantu tetangga mempersiapkan acara pernikahan.\n2. Membersihkan lingkungan desa secara bersama-sama.\n3. Membantu korban bencana yang kehilangan tempat tinggal.\n4. Memperbaiki fasilitas umum yang rusak.\nKegiatan yang termasuk bentuk kerja bakti ditunjukkan oleh nomor ....",
    options: ["1 dan 2", "1 dan 3", "1 dan 4", "2 dan 3", "2 dan 4"],
    answer: 4,
    explanation:
      "2 dan 4 — Membersihkan lingkungan desa dan memperbaiki fasilitas umum merupakan kegiatan kerja bakti untuk kepentingan bersama.",
  },
  {
    text: "Dalam kegiatan kerja kelompok, seorang siswa hanya ingin mendapatkan nilai bagus, tetapi tidak bersedia membantu anggota kelompok lainnya. Sikap tersebut bertentangan dengan semangat gotong royong karena ....",
    options: [
      "setiap orang harus menyelesaikan semua pekerjaan sendiri",
      "gotong royong hanya dapat dilakukan dalam kegiatan masyarakat",
      "gotong royong menekankan kebersamaan, kerelaan, dan tanggung jawab bersama",
      "kerja kelompok seharusnya mengutamakan persaingan antaranggota",
      "keberhasilan kelompok tidak berkaitan dengan kontribusi setiap anggota",
    ],
    answer: 2,
    explanation:
      "Gotong royong menekankan kebersamaan, kerelaan, dan tanggung jawab bersama — Gotong royong menuntut kesediaan untuk berkontribusi dan saling membantu demi mencapai tujuan bersama.",
  },
  {
    text: "Sistem Ekonomi Pancasila merupakan sistem ekonomi yang berlandaskan Pancasila dan UUD NRI Tahun 1945. Salah satu prinsip utama sistem ekonomi tersebut adalah ....",
    options: [
      "kebebasan individu tanpa memperhatikan kepentingan masyarakat",
      "persaingan ekonomi sebagai tujuan utama pembangunan",
      "penguasaan seluruh kegiatan ekonomi oleh kelompok tertentu",
      "asas kekeluargaan dan keadilan sosial",
      "keuntungan materi sebagai satu-satunya ukuran keberhasilan",
    ],
    answer: 3,
    explanation:
      "Asas kekeluargaan dan keadilan sosial — Sistem Ekonomi Pancasila mengutamakan kesejahteraan rakyat, kebersamaan, dan keadilan dalam kegiatan ekonomi.",
  },
  {
    text: "Koperasi sekolah menyediakan kebutuhan belajar siswa dan mengelola usahanya berdasarkan partisipasi anggota. Koperasi tersebut mencerminkan Sistem Ekonomi Pancasila karena ....",
    options: [
      "mengutamakan keuntungan pengurus dibandingkan anggota",
      "menerapkan kerja sama berdasarkan asas kekeluargaan",
      "membatasi keterlibatan anggota dalam pengambilan keputusan",
      "memberikan keuntungan hanya kepada siswa yang mampu",
      "mengutamakan persaingan daripada kesejahteraan bersama",
    ],
    answer: 1,
    explanation:
      "Menerapkan kerja sama berdasarkan asas kekeluargaan — Koperasi merupakan salah satu bentuk usaha yang menerapkan prinsip kerja sama dan demokrasi ekonomi untuk meningkatkan kesejahteraan anggota.",
  },
  {
    text: "Pemerintah memberikan pelatihan, pendampingan, dan bantuan akses permodalan kepada pelaku UMKM agar usaha mereka berkembang. Kebijakan tersebut menunjukkan peran negara dalam ....",
    options: [
      "membatasi kegiatan ekonomi masyarakat",
      "mengurangi partisipasi masyarakat dalam pembangunan",
      "mengutamakan kepentingan perusahaan besar",
      "menyerahkan seluruh tanggung jawab ekonomi kepada individu",
      "mendorong kemandirian ekonomi dan meningkatkan kesejahteraan masyarakat",
    ],
    answer: 4,
    explanation:
      "Mendorong kemandirian ekonomi dan meningkatkan kesejahteraan masyarakat — Dukungan terhadap UMKM membantu masyarakat mengembangkan usaha, memperluas kesempatan ekonomi, dan meningkatkan kesejahteraan.",
  },
  {
    text: "Pajak merupakan salah satu sumber penerimaan negara yang digunakan untuk membiayai berbagai kebutuhan publik. Membayar pajak sesuai dengan ketentuan peraturan perundang-undangan merupakan bentuk ....",
    options: [
      "partisipasi masyarakat dalam mendukung pembangunan nasional",
      "transaksi ekonomi yang memberikan keuntungan langsung kepada pembayar",
      "kegiatan ekonomi yang hanya menguntungkan pemerintah",
      "kerja sama yang dilakukan untuk memperoleh imbalan pribadi",
      "tanggung jawab yang hanya berlaku bagi pelaku usaha besar",
    ],
    answer: 0,
    explanation:
      "Partisipasi masyarakat dalam mendukung pembangunan nasional — Pajak digunakan untuk membiayai kebutuhan negara dan pembangunan bagi kepentingan masyarakat sesuai dengan ketentuan peraturan perundang-undangan.",
  },
  {
    text: "Sebuah perusahaan memperoleh keuntungan besar, tetapi memberikan upah yang tidak layak kepada pekerjanya dan mengabaikan dampak pencemaran lingkungan. Berdasarkan prinsip Sistem Ekonomi Pancasila, tindakan yang seharusnya dilakukan adalah ....",
    options: [
      "mempertahankan kebijakan tersebut selama perusahaan tetap memperoleh keuntungan",
      "mengurangi jumlah pekerja agar biaya produksi semakin rendah",
      "memperbaiki kesejahteraan pekerja dan menjalankan usaha dengan memperhatikan kelestarian lingkungan",
      "mengutamakan kepentingan pemilik perusahaan daripada masyarakat sekitar",
      "menyerahkan seluruh persoalan kepada masyarakat tanpa memperbaiki kegiatan usaha",
    ],
    answer: 2,
    explanation:
      "Memperbaiki kesejahteraan pekerja dan menjalankan usaha dengan memperhatikan kelestarian lingkungan — Sistem Ekonomi Pancasila menekankan keseimbangan antara kegiatan ekonomi, keadilan sosial, hak pekerja, dan tanggung jawab terhadap lingkungan.",
  },
];

const modules: ModuleSeed[] = [
  {
    order: 1,
    title: "Asal-Usul dan Makna Bhinneka Tunggal Ika",
    subtitle: "Kakawin Sutasoma, makna historis & kontekstual, serta lambang negara",
    description: bab3Intro,
    color: "#00529B",
    sections: [
      {
        title: "Asal-Usul Bhinneka Tunggal Ika",
        content: `Bhinneka Tunggal Ika merupakan semboyan Negara Kesatuan Republik Indonesia yang tercantum pada lambang negara Garuda Pancasila. Semboyan ini menggambarkan keberagaman masyarakat Indonesia yang tetap bersatu sebagai satu bangsa. Secara historis, ungkapan Bhinneka Tunggal Ika berasal dari kitab Kakawin Sutasoma, karya Mpu Tantular yang ditulis pada masa Kerajaan Majapahit. Ungkapan tersebut mengandung pesan mengenai toleransi dan persatuan di tengah perbedaan, khususnya perbedaan agama antara penganut Hindu dan Buddha.

Pesan persatuan yang terkandung di dalamnya dinilai relevan dengan kondisi Indonesia yang memiliki keberagaman suku, agama, ras, bahasa, budaya, dan adat istiadat. Oleh karena itu, Bhinneka Tunggal Ika kemudian digunakan sebagai semboyan negara untuk menegaskan bahwa keberagaman tidak menghalangi persatuan bangsa. Semboyan tersebut terdapat pada pita yang dicengkeram oleh burung Garuda dalam lambang negara Garuda Pancasila.`,
      },
      {
        title: "Makna Bhinneka Tunggal Ika (Historis & Kontekstual)",
        content: `Bhinneka Tunggal Ika secara umum diartikan sebagai berbeda-beda tetapi tetap satu. Semboyan ini menegaskan bahwa meskipun masyarakat Indonesia memiliki latar belakang dan karakteristik yang berbeda, seluruh masyarakat tetap merupakan bagian dari satu bangsa.

Makna Historis:
Secara historis, Bhinneka Tunggal Ika berkaitan dengan semangat toleransi dan persatuan dalam keberagaman agama pada masa Kerajaan Majapahit. Ungkapan ini menggambarkan pentingnya menghormati perbedaan keyakinan serta menjaga hubungan yang harmonis di tengah masyarakat yang memiliki kepercayaan berbeda.

Makna Kontekstual:
Secara kontekstual, makna Bhinneka Tunggal Ika dapat dipahami sesuai dengan kondisi dan perkembangan zaman. Dalam kehidupan bangsa Indonesia saat ini, semboyan tersebut mengajarkan masyarakat untuk:
• Menghormati dan menghargai perbedaan.
• Menumbuhkan sikap toleransi dalam kehidupan bermasyarakat.
• Menghindari diskriminasi dan konflik akibat perbedaan.
• Mengutamakan kepentingan bersama daripada kepentingan pribadi atau kelompok.
• Membangun persatuan melalui kerja sama dan gotong royong.

Keberagaman merupakan bagian dari identitas bangsa Indonesia. Oleh karena itu, masyarakat perlu menyikapi perbedaan dengan bijaksana agar tidak menimbulkan perpecahan.`,
      },
      {
        title: "Bhinneka Tunggal Ika sebagai Bagian dari Lambang Negara",
        content: `Bhinneka Tunggal Ika memiliki hubungan yang erat dengan lambang negara Indonesia, yaitu Garuda Pancasila. Dalam proses perancangan lambang negara, Sultan Hamid II berperan penting dalam perancangan bentuk lambang negara, sedangkan Soekarno turut berperan dalam proses pembahasan dan penyempurnaannya. Muhammad Yamin juga dikenal berkaitan dengan pengenalan semboyan Bhinneka Tunggal Ika dalam perumusan identitas kebangsaan Indonesia. Semboyan Bhinneka Tunggal Ika kemudian ditempatkan pada pita yang dicengkeram oleh burung Garuda. Keberadaannya menegaskan bahwa persatuan dalam keberagaman merupakan salah satu prinsip penting dalam kehidupan bangsa Indonesia.

Dasar Hukum Lambang Negara:
Ketentuan mengenai lambang negara diatur dalam Peraturan Pemerintah Republik Indonesia Nomor 66 Tahun 1951 tentang Lambang Negara. Ketentuan tersebut kemudian diperkuat melalui Undang-Undang Republik Indonesia Nomor 24 Tahun 2009 tentang Bendera, Bahasa, dan Lambang Negara, serta Lagu Kebangsaan. Pasal 46 UU Nomor 24 Tahun 2009 menjelaskan bahwa lambang negara Indonesia berbentuk Garuda Pancasila dengan kepala menoleh lurus ke sebelah kanan, perisai berbentuk jantung yang digantung dengan rantai pada leher Garuda, serta semboyan Bhinneka Tunggal Ika yang ditulis pada pita yang dicengkeram oleh Garuda.`,
      },
      {
        title: "Unsur-Unsur dan Makna dalam Lambang Negara",
        content: `Lambang negara Garuda Pancasila memiliki beberapa unsur utama:
1. Burung Garuda: Merupakan lambang negara Indonesia yang menggambarkan kebesaran dan kekuatan bangsa. Garuda juga menjadi simbol identitas nasional yang menyatukan seluruh masyarakat Indonesia.
2. Perisai: Perisai yang terletak pada dada Garuda melambangkan perjuangan dan perlindungan. Di dalamnya terdapat simbol-simbol yang mewakili sila-sila Pancasila sebagai dasar negara Indonesia.
3. Pita bertuliskan Bhinneka Tunggal Ika: Pita yang dicengkeram oleh burung Garuda memuat semboyan Bhinneka Tunggal Ika. Semboyan ini menegaskan bahwa meskipun masyarakat Indonesia memiliki beragam latar belakang, seluruhnya tetap menjadi bagian dari satu bangsa dan negara.

Makna Bhinneka Tunggal Ika dalam Lambang Negara:
Penempatan Bhinneka Tunggal Ika pada lambang negara bukan sekadar unsur pelengkap. Semboyan tersebut mengandung pesan penting bahwa persatuan bangsa harus tetap dijaga di tengah keberagaman. Keberadaan semboyan ini mengingatkan setiap warga negara untuk menghargai perbedaan, menjunjung tinggi toleransi, serta berpartisipasi dalam menjaga keutuhan Negara Kesatuan Republik Indonesia. Dengan demikian, Bhinneka Tunggal Ika menjadi bagian penting dari identitas nasional sekaligus pedoman dalam membangun kehidupan masyarakat yang bersatu, harmonis, dan saling menghormati.

Soal Esai Refleksi Modul 1:
1. Bhinneka Tunggal Ika merupakan semboyan bangsa Indonesia yang menegaskan persatuan dalam keberagaman. Menurut pendapatmu, bagaimana semboyan tersebut dapat diterapkan untuk menghadapi tantangan keberagaman di Indonesia saat ini? Berikan contoh konkret.
2. Keberagaman suku, agama, budaya, dan norma dapat menjadi kekuatan sekaligus tantangan bagi bangsa Indonesia. Jelaskan hubungan Bhinneka Tunggal Ika dengan upaya membangun harmoni dalam keberagaman. Sertakan contoh tindakan toleransi, kerja sama, atau gotong royong yang dapat dilakukan dalam kehidupan sehari-hari.`,
      },
    ],
    summary:
      "Bhinneka Tunggal Ika merupakan semboyan negara Indonesia yang berasal dari ungkapan dalam kitab Kakawin Sutasoma karya Mpu Tantular pada masa Kerajaan Majapahit. Semboyan ini berarti berbeda-beda tetapi tetap satu. Secara historis, ungkapan tersebut berkaitan dengan toleransi dalam keberagaman agama, sedangkan dalam konteks Indonesia saat ini, maknanya mencakup penghormatan terhadap berbagai perbedaan dan penguatan persatuan bangsa. Bhinneka Tunggal Ika juga menjadi bagian dari lambang negara Garuda Pancasila dan memiliki dasar hukum dalam peraturan perundang-undangan Indonesia. Nilai-nilai utama yang terkandung dalam semboyan ini meliputi toleransi, penghormatan terhadap perbedaan, persatuan, kerja sama, dan gotong royong.",
    video: {
      title: "Asal-Usul dan Makna Bhinneka Tunggal Ika",
      youtubeId: "",
      duration: "08:45",
    },
    questions: [
      {
        text: "Semboyan Bhinneka Tunggal Ika berasal dari karya sastra Kakawin Sutasoma yang ditulis oleh ....",
        options: ["Mpu Prapanca", "Mpu Tantular", "Mpu Sedah", "Mpu Panuluh"],
        answer: 1,
        explanation:
          "Semboyan Bhinneka Tunggal Ika berasal dari kitab Kakawin Sutasoma karya Mpu Tantular pada masa Kerajaan Majapahit.",
      },
      {
        text: "Makna utama semboyan Bhinneka Tunggal Ika bagi bangsa Indonesia adalah ....",
        options: [
          "Kebudayaan daerah harus diganti dengan budaya nasional",
          "Perbedaan harus dihilangkan demi keseragaman",
          "Berbeda-beda tetapi tetap satu",
          "Setiap kelompok harus mengutamakan kepentingannya sendiri",
        ],
        answer: 2,
        explanation:
          "Bhinneka Tunggal Ika secara umum diartikan sebagai berbeda-beda tetapi tetap satu.",
      },
      {
        text: "Mengapa Bhinneka Tunggal Ika penting bagi kehidupan bangsa Indonesia yang beragam?",
        options: [
          "Untuk membuat semua daerah memiliki adat yang sama",
          "Untuk memperkuat persatuan di tengah perbedaan",
          "Untuk membatasi interaksi antarkelompok budaya",
          "Untuk menentukan budaya daerah yang paling unggul",
        ],
        answer: 1,
        explanation:
          "Bhinneka Tunggal Ika menjadi pedoman untuk memperkuat persatuan di tengah perbedaan masyarakat Indonesia.",
      },
      {
        text: "Ketika menghadapi perubahan norma dan nilai budaya, sikap yang tepat adalah ....",
        options: [
          "Menolak semua perubahan dari luar",
          "Menerima semua perubahan tanpa pertimbangan",
          "Mengubah norma agar kelompok sendiri lebih unggul",
          "Mempertimbangkan nilai moral dan dampaknya bagi masyarakat",
        ],
        answer: 3,
        explanation:
          "Perubahan norma dan budaya perlu disikapi dengan mempertimbangkan nilai moral serta dampaknya bagi masyarakat.",
      },
      {
        text: "Mengapa persoalan suku, agama, ras, dan antargolongan (SARA) perlu disikapi secara bijaksana?",
        options: [
          "Agar perbedaan identitas tidak menjadi sumber konflik",
          "Agar satu kelompok dapat menguasai kelompok lain",
          "Agar setiap kelompok hanya bergaul dengan kelompoknya",
          "Agar masyarakat tidak perlu mengenal budaya lain",
        ],
        answer: 0,
        explanation:
          "Menyikapi SARA secara bijaksana mencegah perbedaan identitas menjadi sumber perpecahan atau konflik.",
      },
      {
        text: "Contoh perilaku yang menunjukkan toleransi terhadap perbedaan agama adalah ....",
        options: [
          "Memaksa teman mengikuti kegiatan ibadah agama sendiri",
          "Menolak berteman dengan orang yang berbeda agama",
          "Tetap menjalin persahabatan meskipun berbeda agama",
          "Menganggap agama sendiri membuat semua orang lain salah",
        ],
        answer: 2,
        explanation:
          "Tetap menjalin persahabatan dan menghormati keyakinan teman merupakan wujud toleransi beragama.",
      },
      {
        text: "Sikap yang paling mendukung terciptanya harmoni dalam keberagaman di lingkungan masyarakat adalah ....",
        options: [
          "Bekerja sama dan bergotong royong tanpa membeda-bedakan latar belakang",
          "Meminta kelompok lain mengikuti seluruh kebiasaan kita",
          "Menghindari kegiatan bersama dengan kelompok berbeda",
          "Mendahulukan kepentingan kelompok sendiri dalam setiap kegiatan",
        ],
        answer: 0,
        explanation:
          "Kerja sama dan gotong royong tanpa membeda-bedakan latar belakang memperkuat harmoni dalam keberagaman.",
      },
      {
        text: "Sebuah kelompok siswa memiliki kebiasaan budaya yang berbeda dari kelompok lain. Agar kegiatan kelas berjalan harmonis, tindakan yang paling tepat adalah ....",
        options: [
          "Membiarkan perbedaan menjadi alasan untuk tidak bekerja sama",
          "Membahas perbedaan dengan saling menghormati dan menyepakati aturan bersama",
          "Meminta kelompok tersebut meninggalkan seluruh kebiasaannya",
          "Menetapkan bahwa kebiasaan kelompok terbanyak selalu benar",
        ],
        answer: 1,
        explanation:
          "Musyawarah dengan saling menghormati dan menyepakati aturan bersama menjaga keharmonisan di kelas.",
      },
    ],
    chessQuestions: civicChess15Questions,
  },
  {
    order: 2,
    title: "Bhinneka Tunggal Ika sebagai Modal Sosial",
    subtitle: "Toleransi norma, suku, agama, ras, golongan & tiga unsur modal sosial",
    description:
      "Memahami keberagaman masyarakat Indonesia, pentingnya toleransi terhadap keberagaman norma, agama, suku bangsa, ras, dan golongan, serta tiga unsur Bhinneka Tunggal Ika sebagai modal sosial.",
    color: "#E55353",
    sections: [
      {
        title: "Pentingnya Memahami Keberagaman Masyarakat Indonesia",
        content: `Indonesia merupakan negara kepulauan yang memiliki wilayah sangat luas. Penduduknya tersebar di berbagai pulau dengan karakteristik geografis, sosial, dan budaya yang beragam. Kondisi tersebut menyebabkan masyarakat Indonesia memiliki perbedaan dalam hal adat istiadat, norma, bahasa, agama, suku bangsa, ras, serta kebiasaan yang berkembang di setiap daerah.

Keberagaman merupakan salah satu kekayaan bangsa Indonesia yang perlu dijaga dan dilestarikan. Meskipun memiliki latar belakang yang berbeda-beda, seluruh masyarakat Indonesia merupakan bagian dari satu bangsa dan negara. Oleh karena itu, setiap warga negara perlu mengembangkan sikap saling menghormati, menghargai, dan bekerja sama agar keberagaman tidak menjadi penyebab perpecahan.

Dalam kehidupan bermasyarakat, perbedaan terkadang dapat menimbulkan persinggungan kepentingan antarkelompok. Apabila tidak disikapi dengan bijaksana, persinggungan tersebut dapat berkembang menjadi kesalahpahaman, prasangka, bahkan konflik. Untuk mencegah hal tersebut, masyarakat perlu menumbuhkan sikap toleransi, saling menghormati, dan gotong royong.

Sikap toleransi memungkinkan masyarakat hidup berdampingan secara damai meskipun memiliki perbedaan. Selain menjaga persatuan, sikap saling menghormati budaya juga penting untuk melestarikan kebudayaan Indonesia tanpa membedakan suku, agama, ras, golongan, maupun status sosial.`,
      },
      {
        title: "Toleransi terhadap Keberagaman Norma dan Agama",
        content: `Toleransi merupakan sikap terbuka dalam menghormati dan menghargai perbedaan antarsesama manusia.

a. Toleransi terhadap Keberagaman Norma:
Norma merupakan seperangkat aturan atau ketentuan yang berlaku dalam masyarakat (norma agama, kesusilaan, kesopanan, hukum, dan adat). Toleransi terhadap keberagaman norma dapat diwujudkan melalui perilaku:
• Tidak memandang rendah norma dan kebiasaan yang berbeda dari lingkungan sendiri.
• Tidak memaksakan norma atau kebiasaan tertentu kepada masyarakat lain.
• Memahami bahwa norma dalam suatu masyarakat memiliki latar belakang serta makna, selama tidak melanggar hukum dan hak orang lain.
• Menghargai dan menghormati perbedaan norma serta kebiasaan di daerah lain.

b. Toleransi terhadap Keberagaman Agama:
Kebebasan beragama dijamin dalam Pasal 29 ayat (2) UUD NRI Tahun 1945: "Negara menjamin kemerdekaan tiap-tiap penduduk untuk memeluk agamanya masing-masing dan untuk beribadat menurut agamanya dan kepercayaannya itu."
Sikap toleransi beragama dapat diwujudkan melalui:
• Bersedia membangun dialog lintas agama.
• Menjalankan ibadah sesuai ajaran agama dan kepercayaan masing-masing.
• Menghargai dan menghormati agama serta kepercayaan orang lain.
• Tidak memandang rendah orang yang memiliki agama berbeda.
• Bersedia bekerja sama dalam kegiatan sosial kemasyarakatan.
• Tidak memaksakan keyakinan agama kepada orang lain.
• Menunjukkan sikap toleran terhadap perayaan keagamaan pemeluk agama lain.`,
      },
      {
        title: "Toleransi terhadap Keberagaman Suku Bangsa, Ras, dan Golongan",
        content: `c. Toleransi terhadap Keberagaman Suku Bangsa dan Ras:
Setiap suku bangsa dan ras mempunyai karakteristik, sejarah, adat istiadat, serta kebudayaan yang berbeda-beda namun memiliki kedudukan setara. Toleransi terhadap keberagaman suku bangsa dan ras diwujudkan melalui:
• Bersedia bekerja sama dengan orang dari suku bangsa dan ras berbeda.
• Menjunjung tinggi nilai persaudaraan dan kemanusiaan.
• Mengakui persamaan derajat setiap orang tanpa membedakan suku bangsa dan ras.
• Melaksanakan hak dan kewajiban secara setara sesuai ketentuan yang berlaku.
• Menghargai dan menghormati adat istiadat serta kebudayaan suku bangsa dan ras berbeda.

d. Toleransi terhadap Keberagaman Golongan:
Masyarakat Indonesia terdiri atas berbagai golongan sosial (berdasarkan usia, profesi, maupun lapisan sosial seperti petani, buruh, pegawai, pengusaha, dan cendekiawan). Sikap toleransi terhadap keberagaman golongan dapat diwujudkan melalui:
• Menghargai dan menghormati keberadaan golongan lain.
• Menghindari tindakan diskriminasi terhadap golongan tertentu.
• Memahami kepentingan golongan lain dan tidak hanya mengutamakan kepentingan kelompok sendiri.`,
      },
      {
        title: "Bhinneka Tunggal Ika sebagai Modal Sosial",
        content: `Modal sosial merupakan sumber daya dalam hubungan antarmanusia yang tumbuh melalui nilai, norma, rasa saling percaya, kebersamaan, dan hubungan sosial yang mendukung kerja sama. Bhinneka Tunggal Ika mencakup tiga unsur penting sebagai modal sosial:

a. Rasa Saling Memiliki sebagai Bangsa:
Setiap warga negara menyadari bahwa dirinya merupakan bagian dari NKRI dan memiliki tanggung jawab terhadap kemajuan bangsa, yang diwujudkan melalui kepedulian terhadap lingkungan, menjaga persatuan, dan menaati peraturan.

b. Rasa Kebersamaan dan Persaudaraan Antarsesama Bangsa Indonesia:
Rasa kebersamaan terlihat ketika masyarakat mampu menghormati perbedaan dan tetap bekerja sama demi kepentingan bersama melalui gotong royong, kegiatan sosial, musyawarah, dan kepedulian terhadap sesama.

c. Rasa Saling Percaya antara Seluruh Komponen Bangsa:
Kepercayaan mengurangi kecurigaan dan prasangka terhadap kelompok lain. Kepercayaan dibangun melalui sikap jujur, tanggung jawab, keterbukaan, menjaga ucapan, tidak menyebarkan informasi yang belum terverifikasi, dan menyelesaikan perbedaan melalui dialog.

d. Mewujudkan Bhinneka Tunggal Ika dalam Kehidupan Sehari-hari:
Di sekolah, siswa bekerja sama dengan teman yang berbeda suku, agama, atau latar belakang sosial. Di masyarakat, warga mengikuti kegiatan gotong royong tanpa membedakan identitas.

Soal Esai Refleksi Modul 2:
1. Indonesia memiliki keberagaman norma, agama, suku bangsa, ras, dan golongan. Jelaskan mengapa sikap toleransi diperlukan untuk menjaga persatuan dan kesatuan bangsa di tengah keberagaman tersebut!
2. Bhinneka Tunggal Ika merupakan salah satu modal sosial bangsa Indonesia. Jelaskan tiga unsur penting yang dapat memperkuat Bhinneka Tunggal Ika sebagai modal sosial, serta berikan contoh penerapannya dalam kehidupan sehari-hari!`,
      },
    ],
    summary:
      "Indonesia memiliki keberagaman norma, agama, suku, ras, dan golongan yang harus dihormati. Sikap toleransi diperlukan untuk mencegah konflik, menghindari diskriminasi, dan menjaga persatuan bangsa.\nBhinneka Tunggal Ika berarti berbeda-beda tetapi tetap satu. Semboyan ini menjadi modal sosial yang memperkuat persatuan melalui tiga unsur, yaitu rasa saling memiliki sebagai bangsa, kebersamaan dan persaudaraan, serta rasa saling percaya. Penerapannya dapat dilakukan dengan saling menghormati, bergotong royong, bekerja sama, dan menghargai perbedaan dalam kehidupan sehari-hari.",
    video: {
      title: "Bhinneka Tunggal Ika sebagai Modal Sosial",
      youtubeId: "",
      duration: "09:15",
    },
    questions: [
      {
        text: "Keberagaman merupakan bagian yang tidak dapat dipisahkan dari kehidupan bangsa Indonesia. Sikap yang tepat dalam memandang keberagaman tersebut adalah ....",
        options: [
          "mengutamakan kepentingan kelompok sendiri daripada kepentingan bersama",
          "menjadikan budaya daerah sendiri sebagai budaya yang paling unggul",
          "menghargai perbedaan dan menempatkan diri sebagai bagian dari masyarakat yang beragam",
          "menghindari interaksi dengan kelompok yang memiliki kebudayaan berbeda",
        ],
        answer: 2,
        explanation:
          "Menghargai perbedaan dan menyadari diri sebagai bagian dari masyarakat yang beragam memperkuat persatuan bangsa.",
      },
      {
        text: "Perubahan norma dan nilai dalam suatu kebudayaan dapat terjadi seiring perkembangan zaman. Sikap yang tepat dalam menghadapi perubahan tersebut adalah ....",
        options: [
          "menolak seluruh perubahan agar kebudayaan tidak mengalami perkembangan",
          "mengikuti semua perubahan tanpa mempertimbangkan nilai moral",
          "mengutamakan kebudayaan sendiri agar lebih unggul daripada kebudayaan lain",
          "mempertimbangkan nilai moral, manfaat, dan dampak perubahan bagi masyarakat",
        ],
        answer: 3,
        explanation:
          "Setiap perubahan nilai dan norma harus disaring dengan mempertimbangkan nilai moral, manfaat, dan dampaknya bagi masyarakat.",
      },
      {
        text: "Persoalan yang berkaitan dengan suku, agama, ras, dan antargolongan (SARA) perlu disikapi secara bijaksana. Hal tersebut penting dilakukan karena ....",
        options: [
          "perbedaan identitas harus dihilangkan agar masyarakat menjadi seragam",
          "setiap kelompok masyarakat perlu memiliki kepentingan yang sama dalam segala hal",
          "keberagaman akan menghambat pembangunan apabila setiap kelompok memiliki identitas berbeda",
          "persoalan SARA yang tidak disikapi dengan baik dapat memicu konflik dan mengancam persatuan bangsa",
        ],
        answer: 3,
        explanation:
          "Persoalan SARA yang tidak disikapi secara bijaksana dapat memicu prasangka, konflik, dan mengancam keutuhan bangsa.",
      },
      {
        text: "Setiap masyarakat memiliki norma dan kebiasaan yang dapat berbeda antara satu daerah dan daerah lainnya. Contoh sikap toleransi terhadap keberagaman norma adalah ....",
        options: [
          "memaksa masyarakat lain mengikuti kebiasaan yang berlaku di daerah sendiri",
          "menghormati norma yang berlaku dalam masyarakat lain selama tidak bertentangan dengan hukum dan hak orang lain",
          "menganggap norma masyarakat sendiri lebih baik daripada norma masyarakat lain",
          "menolak berinteraksi dengan masyarakat yang memiliki kebiasaan berbeda",
        ],
        answer: 1,
        explanation:
          "Toleransi terhadap keberagaman norma diwujudkan dengan menghormati norma masyarakat lain selama tidak melanggar hukum dan hak orang lain.",
      },
      {
        text: "Pasal 29 ayat (2) UUD Negara Republik Indonesia Tahun 1945 menjamin kemerdekaan setiap penduduk untuk memeluk agama dan beribadat menurut agama dan kepercayaannya. Perilaku yang sesuai dengan ketentuan tersebut adalah ....",
        options: [
          "mengajak orang lain berpindah agama dengan cara memaksa",
          "membatasi pergaulan hanya dengan orang yang memiliki agama yang sama",
          "menghormati teman yang menjalankan ibadah sesuai agama dan kepercayaannya",
          "menganggap ajaran agama sendiri sebagai alasan untuk merendahkan agama lain",
        ],
        answer: 2,
        explanation:
          "Menghormati teman yang sedang beribadah sesuai agama dan kepercayaannya sesuai dengan amanat Pasal 29 ayat (2) UUD NRI 1945.",
      },
      {
        text: "Keberagaman suku bangsa dan ras merupakan kekayaan bangsa Indonesia. Sikap yang tepat untuk menjaga keharmonisan dalam keberagaman tersebut adalah ....",
        options: [
          "memberikan kesempatan lebih besar kepada suku tertentu dalam kehidupan bermasyarakat",
          "membatasi kerja sama hanya dengan orang yang memiliki latar belakang suku yang sama",
          "mengutamakan kepentingan kelompok sendiri dalam setiap kegiatan bersama",
          "menghormati kesetaraan hak dan kewajiban serta bekerja sama tanpa membedakan suku dan ras",
        ],
        answer: 3,
        explanation:
          "Mengakui kesetaraan hak dan kewajiban serta bekerja sama tanpa membedakan suku dan ras menjaga keharmonisan bangsa.",
      },
      {
        text: "Kelompok sosial dapat terbentuk berdasarkan kesamaan profesi, kepentingan, nilai, maupun kebiasaan. Contoh penerapan toleransi terhadap keberagaman golongan adalah ....",
        options: [
          "menghargai perbedaan profesi dan memberikan kesempatan yang sama kepada setiap orang untuk berpartisipasi dalam masyarakat",
          "menganggap golongan dengan penghasilan tinggi lebih pantas dihormati",
          "membatasi hubungan sosial dengan orang yang memiliki pekerjaan berbeda",
          "memberikan hak yang lebih besar kepada golongan yang memiliki kedudukan tinggi",
        ],
        answer: 0,
        explanation:
          "Menghargai setiap profesi dan memberi kesempatan berpartisipasi yang setara merupakan wujud toleransi antargolongan.",
      },
      {
        text: "Bhinneka Tunggal Ika dapat menjadi modal sosial bagi bangsa Indonesia. Salah satu bentuk penerapannya dalam kehidupan sehari-hari adalah ....",
        options: [
          "mengutamakan kepentingan kelompok sendiri dalam pengambilan keputusan",
          "menghindari pembahasan mengenai perbedaan dalam kehidupan bermasyarakat",
          "membangun persatuan dengan menghilangkan identitas setiap kelompok",
          "menumbuhkan rasa saling memiliki, persaudaraan, dan kepercayaan di tengah keberagaman",
        ],
        answer: 3,
        explanation:
          "Tiga unsur utama Bhinneka Tunggal Ika sebagai modal sosial adalah rasa saling memiliki, persaudaraan/kebersamaan, dan saling percaya.",
      },
    ],
    chessQuestions: civicChess15Questions,
  },
  {
    order: 3,
    title: "Membangun Harmoni dalam Keberagaman",
    subtitle: "Hakikat kerja sama dan gotong royong dalam kehidupan bermasyarakat",
    description:
      "Memahami hakikat kerja sama dan gotong royong (tolong-menolong dan kerja bakti), nilai-nilai luhurnya, perbedaan keduanya, serta penerapannya di keluarga, sekolah, masyarakat, dan negara.",
    color: "#F1A7AD",
    sections: [
      {
        title: "Hakikat Kerja Sama dalam Kehidupan Bermasyarakat",
        content: `Indonesia merupakan negara yang memiliki keberagaman suku, agama, ras, budaya, adat istiadat, dan norma. Diperlukan sikap toleransi, saling menghormati, kerja sama, dan gotong royong agar perbedaan tidak menimbulkan konflik.

Pengertian Kerja Sama:
Kerja sama adalah kegiatan atau usaha yang dilakukan oleh dua orang atau lebih untuk mencapai tujuan bersama. Kerja sama dapat dilakukan oleh individu, kelompok, lembaga, maupun pemerintah. Dalam sejarah Indonesia, rakyat dari berbagai daerah bersatu melawan penjajahan demi mencapai kemerdekaan.

Pentingnya Kerja Sama dalam Kehidupan Bermasyarakat:
Dalam pidatonya pada 1 Juni 1945, Sukarno menekankan pentingnya negara yang diperuntukkan bagi semua kalangan serta semangat gotong royong untuk kepentingan bersama. Manfaat kerja sama antara lain:
• Mendahulukan kepentingan umum di atas kepentingan pribadi.
• Mempermudah pencapaian tujuan melalui kontribusi bersama.
• Memperkuat persatuan dan kesatuan.
• Meringankan pekerjaan dan mempercepat penyelesaian pekerjaan.
• Menumbuhkan tanggung jawab sosial dan meningkatkan rasa setia kawan.
• Mempererat persaudaraan, memupuk kebersamaan, dan menciptakan kerukunan.`,
      },
      {
        title: "Hakikat Gotong Royong (Tolong-Menolong & Kerja Bakti)",
        content: `Secara bahasa, istilah gotong royong berasal dari bahasa Jawa: gotong berarti memikul atau mengangkat, sedangkan royong berarti bersama-sama. Menurut Koentjaraningrat, gotong royong dibedakan menjadi dua bentuk utama:

1. Gotong royong dalam arti tolong-menolong (kebutuhan individu/keluarga):
• Membantu tetangga yang sedang membangun atau memperbaiki rumah.
• Menolong tetangga yang mengalami kesulitan atau musibah.
• Membantu tetangga mempersiapkan acara syukuran atau hajatan.
• Membantu persiapan upacara kematian.

2. Gotong royong dalam arti kerja bakti (kepentingan umum):
• Membersihkan lingkungan desa atau permukiman.
• Memperbaiki jalan atau jembatan yang rusak.
• Membersihkan masjid atau balai desa.
• Memperbaiki fasilitas kesehatan yang mengalami kerusakan.
• Membangun tanggul untuk mengantisipasi banjir.
• Melaksanakan ronda untuk menjaga keamanan dan ketertiban lingkungan.

Nilai-Nilai dalam Gotong Royong:
• Kerelaan: membantu tanpa harus selalu diminta atau dipaksa.
• Kebersamaan: menyatukan kemampuan untuk mencapai tujuan bersama.
• Keikhlasan: memberikan bantuan tanpa semata-mata mengharapkan imbalan.
• Kepercayaan: membangun keyakinan bahwa setiap orang akan berkontribusi dengan baik.
• Toleransi: menghargai perbedaan latar belakang, pendapat, dan kebiasaan.
• Kepedulian: memperhatikan kebutuhan dan kesulitan orang lain.
• Tanggung jawab: melaksanakan peran yang menjadi bagian dari kegiatan bersama.`,
      },
      {
        title: "Perbedaan Kerja Sama dan Gotong Royong serta Pentingnya bagi Bangsa",
        content: `Perbedaan Kerja Sama dan Gotong Royong:
• Pengertian: Kerja sama adalah usaha bersama untuk mencapai tujuan tertentu; Gotong royong adalah kegiatan saling membantu dan bekerja bersama.
• Dasar kegiatan: Kerja sama didasari kesepakatan atau komitmen bersama; Gotong royong didasari kerelaan, kebersamaan, dan kepedulian.
• Penekanan: Kerja sama menekankan koordinasi dan kontribusi; Gotong royong menekankan solidaritas dan semangat saling membantu.
• Contoh: Panitia kelas membagi tugas kegiatan sekolah (kerja sama) vs siswa secara sukarela membersihkan kelas bersama-sama (gotong royong).

Alasan Gotong Royong Penting bagi Bangsa Indonesia:
1. Mempererat persatuan dalam keberagaman.
2. Meringankan beban sesama.
3. Mencegah kesalahpahaman dan konflik.
4. Memperkuat semangat kebangsaan.
5. Menumbuhkan kepedulian sosial.
6. Menjaga keharmonisan masyarakat.`,
      },
      {
        title: "Penerapan Kerja Sama dan Gotong Royong dalam Kehidupan Sehari-hari",
        content: `Di lingkungan keluarga:
• Membagi tugas membersihkan rumah.
• Membantu anggota keluarga yang sedang mengalami kesulitan.
• Bermusyawarah untuk menyelesaikan masalah keluarga.

Di lingkungan sekolah:
• Melaksanakan piket kelas bersama.
• Membantu teman yang mengalami kesulitan belajar.
• Bekerja sama menyelesaikan tugas kelompok.
• Menghargai pendapat teman yang berbeda.

Di lingkungan masyarakat:
• Mengikuti kegiatan kebersihan lingkungan dan menjaga keamanan bersama.
• Membantu tetangga yang terkena musibah dan berpartisipasi dalam kegiatan sosial.
• Menghormati kebiasaan masyarakat yang berbeda selama tidak melanggar hak orang lain.

Dalam kehidupan berbangsa dan bernegara:
• Mengutamakan kepentingan bersama dan menghargai keberagaman suku, agama, ras, budaya, dan golongan.
• Mendukung upaya pelestarian budaya daerah.
• Menyelesaikan perbedaan melalui dialog dan musyawarah.`,
      },
    ],
    summary:
      "Membangun harmoni dalam keberagaman memerlukan sikap toleransi, kerja sama, dan gotong royong. Kerja sama membantu masyarakat menyatukan kemampuan untuk mencapai tujuan bersama, sedangkan gotong royong menumbuhkan semangat kerelaan, kepedulian, dan saling membantu.\nKeduanya berperan penting dalam memperkuat persatuan, meringankan beban masyarakat, mencegah konflik, dan menjaga keharmonisan bangsa Indonesia. Oleh karena itu, nilai kerja sama dan gotong royong perlu diterapkan secara konsisten dalam kehidupan sehari-hari sebagai wujud pengamalan nilai-nilai Pancasila.",
    video: {
      title: "Membangun Harmoni melalui Kerja Sama dan Gotong Royong",
      youtubeId: "",
      duration: "08:30",
    },
    questions: [
      {
        text: "Kerja sama merupakan kegiatan yang dilakukan oleh dua pihak atau lebih untuk mencapai tujuan bersama. Salah satu manfaat kerja sama dalam kehidupan masyarakat adalah ....",
        options: [
          "meningkatkan persaingan untuk menguasai sumber daya",
          "meringankan pekerjaan dan mempererat persatuan",
          "mengurangi tanggung jawab setiap anggota masyarakat",
          "menjadikan kepentingan pribadi sebagai prioritas utama",
        ],
        answer: 1,
        explanation:
          "Kerja sama membantu meringankan pekerjaan, mempercepat pencapaian tujuan, sekaligus mempererat persatuan.",
      },
      {
        text: "Warga sebuah desa secara sukarela membantu tetangganya memperbaiki rumah yang rusak akibat bencana tanpa mengharapkan imbalan. Kegiatan tersebut mencerminkan ....",
        options: [
          "persaingan sosial",
          "kepentingan individu",
          "gotong royong dalam bentuk tolong-menolong",
          "kerja bakti untuk kepentingan fasilitas umum",
        ],
        answer: 2,
        explanation:
          "Membantu tetangga yang mengalami musibah atau urusan keluarga termasuk gotong royong dalam arti tolong-menolong.",
      },
      {
        text: "Menurut pembagian bentuk gotong royong yang dikemukakan Koentjaraningrat, kegiatan warga membersihkan saluran air dan memperbaiki jalan desa untuk kepentingan umum termasuk ....",
        options: [
          "kerja bakti",
          "tolong-menolong untuk kepentingan pribadi",
          "kegiatan ekonomi perseorangan",
          "hubungan kerja berdasarkan upah",
        ],
        answer: 0,
        explanation:
          "Kerja bakti adalah kegiatan bersama untuk memenuhi kepentingan umum, seperti membersihkan lingkungan dan memperbaiki jalan desa.",
      },
      {
        text: "Perhatikan beberapa kegiatan berikut!\n1. Membantu tetangga mempersiapkan acara pernikahan.\n2. Membersihkan lingkungan desa secara bersama-sama.\n3. Membantu korban bencana yang kehilangan tempat tinggal.\n4. Memperbaiki fasilitas umum yang rusak.\nKegiatan yang termasuk bentuk kerja bakti ditunjukkan oleh nomor ....",
        options: ["1 dan 2", "1 dan 3", "2 dan 3", "2 dan 4"],
        answer: 3,
        explanation:
          "Nomor 2 (membersihkan lingkungan desa) dan nomor 4 (memperbaiki fasilitas umum) adalah kerja bakti untuk kepentingan bersama.",
      },
      {
        text: "Dalam kegiatan kerja kelompok, seorang siswa hanya ingin mendapatkan nilai bagus, tetapi tidak bersedia membantu anggota kelompok lainnya. Sikap tersebut bertentangan dengan semangat gotong royong karena ....",
        options: [
          "setiap orang harus menyelesaikan semua pekerjaan sendiri",
          "gotong royong hanya dapat dilakukan dalam kegiatan masyarakat",
          "gotong royong menekankan kebersamaan, kerelaan, dan tanggung jawab bersama",
          "kerja kelompok seharusnya mengutamakan persaingan antaranggota",
        ],
        answer: 2,
        explanation:
          "Gotong royong mengandung nilai kebersamaan, kerelaan, kepedulian, dan tanggung jawab bersama.",
      },
      {
        text: "Secara bahasa, istilah gotong royong berasal dari bahasa Jawa, di mana kata 'gotong' berarti ....",
        options: [
          "bekerja sendiri",
          "memikul atau mengangkat",
          "membagi keuntungan",
          "berkumpul di balai desa",
        ],
        answer: 1,
        explanation:
          "Kata gotong berarti memikul atau mengangkat, sedangkan royong berarti bersama-sama.",
      },
    ],
    chessQuestions: civicChess15Questions,
  },
  {
    order: 4,
    title: "Kerja Sama Ekonomi & Sistem Ekonomi Pancasila",
    subtitle: "Koperasi, pajak, peran negara, dan kemandirian ekonomi yang berkeadilan",
    description:
      "Memahami kerja sama dalam kehidupan ekonomi (koperasi dan pajak), pengertian dan ciri-ciri Sistem Ekonomi Pancasila, peran negara menurut UUD NRI 1945, serta kemandirian ekonomi dan kesejahteraan rakyat.",
    color: "#F5B700",
    sections: [
      {
        title: "Kerja Sama dalam Kehidupan Ekonomi",
        content: `Kerja sama merupakan salah satu bentuk penerapan nilai gotong royong dalam kehidupan ekonomi masyarakat Indonesia yang dilandasi semangat kekeluargaan dan tolong-menolong ("seorang buat semua dan semua buat seorang").

Berdasarkan UU Nomor 25 Tahun 1992 tentang Perkoperasian, koperasi berperan sebagai gerakan ekonomi rakyat sekaligus badan usaha yang bertujuan mewujudkan masyarakat yang maju, adil, dan makmur berdasarkan Pancasila dan UUD NRI Tahun 1945.

a. Sistem Ekonomi Pancasila:
Menurut Mubyarto (1998), sistem ekonomi Pancasila memandang manusia sebagai manusia seutuhnya—perilaku ekonomi tidak semata-mata didorong oleh keuntungan materi, tetapi juga faktor sosial dan moralitas. Sri Edi Swasono menekankan penyelarasan prinsip ekonomi dengan nilai spiritual, moral, keadilan, dan kesejahteraan sosial. Pemerintah juga perlu membina dan melindungi UMKM serta mendorong persaingan usaha yang sehat.

b. Penerapan Kerja Sama dalam Kehidupan Ekonomi & Pajak:
Berdasarkan UU Nomor 28 Tahun 2007 dan Pasal 23A UUD NRI Tahun 1945, pajak adalah kontribusi wajib kepada negara yang digunakan bagi sebesar-besarnya kemakmuran rakyat (fasilitas umum, pendidikan, kesehatan, infrastruktur). Kerja sama ekonomi diwujudkan dengan menerapkan nilai kekeluargaan, bersikap adil, menjaga keseimbangan hak dan kewajiban, menghindari pemerasan dan perilaku boros/hedonisme, menerapkan gaya hidup sederhana, serta bekerja secara bertanggung jawab.`,
      },
      {
        title: "Peran Negara dan Ciri-Ciri Sistem Ekonomi Pancasila",
        content: `Peran Negara dalam Sistem Ekonomi Pancasila (Pasal 27 ayat (2), Pasal 33, dan Pasal 34 UUD NRI Tahun 1945):
• Menjamin hak masyarakat atas pekerjaan dan penghidupan yang layak.
• Mengembangkan koperasi sebagai usaha berlandaskan asas kekeluargaan dan demokrasi ekonomi.
• Memelihara dan mengembangkan BUMN.
• Mengelola sumber daya alam (bumi, air, dan kekayaan alam) untuk sebesar-besarnya kemakmuran rakyat.
• Memelihara fakir miskin dan anak-anak terlantar.

Ciri-Ciri Sistem Ekonomi Pancasila menurut Mubyarto:
1. Kegiatan ekonomi didorong oleh faktor ekonomi, sosial, dan moral.
2. Terdapat keinginan untuk mewujudkan pemerataan sosial-ekonomi.
3. Kebijakan ekonomi mengutamakan pengembangan ekonomi nasional yang kuat dan tangguh.
4. Koperasi menjadi salah satu sokoguru perekonomian nasional.
5. Terdapat keseimbangan antara kebijakan yang terpusat dan kewenangan di daerah.

Empat Ciri Utama menurut Sri Edi Swasono:
1. Pentingnya peran negara.
2. Sistem ekonomi berdasarkan asas kekeluargaan.
3. Masyarakat turut memegang peranan penting.
4. Negara menguasai cabang-cabang produksi yang penting bagi negara dan menguasai hajat hidup orang banyak sesuai konstitusi.`,
      },
      {
        title: "Keadilan Sosial, Kemandirian Ekonomi, dan Revitalisasi Kesejahteraan",
        content: `Sasaran Pembangunan Ekonomi yang Berkeadilan:
• Mendorong kebijakan anggaran yang berpihak pada kesejahteraan umum (Pasal 23 UUD NRI 1945).
• Mengembangkan semangat kerja sama dalam bidang usaha melalui koperasi.
• Memperkuat peran negara dalam pengelolaan kekayaan bersama dan cabang produksi strategis (Pasal 33 ayat (1) dan (2) UUD NRI 1945).
• Meningkatkan kemandirian dan kedaulatan ekonomi melalui penguasaan teknologi dan produksi dalam negeri.

Kemandirian Ekonomi dan Revitalisasi Kesejahteraan Rakyat:
Kemandirian ekonomi (berdikari) berarti kemampuan bangsa mengelola perekonomian tanpa ketergantungan berlebihan kepada pihak lain, antara lain dengan meningkatkan penggunaan produk dalam negeri, memperkuat koperasi, dan mengembangkan kewirausahaan.
Revitalisasi kesejahteraan rakyat menempatkan rakyat sebagai sasaran utama pembangunan dengan tetap memperhatikan keselamatan manusia dan kelestarian lingkungan agar tidak menimbulkan pencemaran, bencana ekologis, maupun upah di bawah standar.`,
      },
      {
        title: "Penerapan Gotong Royong dalam Sistem Ekonomi Pancasila",
        content: `Prinsip gotong royong dalam bidang ekonomi diterapkan melalui:
• Mengembangkan koperasi secara profesional dan akuntabel.
• Memberikan upah dan jaminan sosial yang layak bagi pekerja.
• Meningkatkan keterlibatan pekerja dalam perusahaan.
• Mengelola sumber daya alam secara bertanggung jawab demi kemakmuran rakyat dan kelestarian lingkungan.
• Melindungi dan mengembangkan UMKM (permodalan, pendampingan, promosi).
• Mengembangkan ekonomi kreatif dan pariwisata.
• Memperluas akses permodalan bagi masyarakat.
• Menciptakan kesempatan ekonomi yang merata dan bebas diskriminasi.
• Mengembangkan jaminan dan perlindungan sosial bagi masyarakat yang membutuhkan.
• Menciptakan iklim usaha yang sehat dan memberikan kepastian hukum.

Soal Esai Refleksi Modul 4:
1. Jelaskan dua ciri Sistem Ekonomi Pancasila dan berikan contoh penerapannya dalam kehidupan sehari-hari!
2. Menurut pendapatmu, bagaimana cara menerapkan semangat gotong royong untuk mewujudkan perekonomian yang adil dan meningkatkan kesejahteraan masyarakat? Berikan minimal dua contoh!`,
      },
    ],
    summary:
      "Sistem Ekonomi Pancasila merupakan sistem perekonomian yang berlandaskan nilai-nilai Pancasila dan UUD NRI Tahun 1945. Sistem ini menekankan asas kekeluargaan, demokrasi ekonomi, keadilan sosial, kemandirian ekonomi, dan kesejahteraan rakyat.\nDalam pelaksanaannya, negara berperan mengatur dan mengawasi kegiatan ekonomi, melindungi kepentingan masyarakat, serta memastikan bahwa pemanfaatan sumber daya dan hasil pembangunan diarahkan untuk kesejahteraan bersama. Masyarakat juga memiliki peran penting melalui partisipasi dalam kegiatan ekonomi, pengembangan koperasi dan UMKM, serta pelaksanaan kewajiban sebagai warga negara.\nGotong royong menjadi nilai penting yang menghubungkan berbagai peran tersebut. Dengan menerapkan semangat kerja sama, keadilan, tanggung jawab, dan kepedulian sosial, masyarakat dapat turut mewujudkan perekonomian yang lebih adil dan sejahtera.",
    video: {
      title: "Kerja Sama Ekonomi dan Sistem Ekonomi Pancasila",
      youtubeId: "",
      duration: "09:40",
    },
    questions: [
      {
        text: "Sistem Ekonomi Pancasila merupakan sistem ekonomi yang berlandaskan pada ....",
        options: [
          "kebebasan individu tanpa batas",
          "persaingan untuk menguasai pasar",
          "Pancasila dan UUD NRI Tahun 1945",
          "kepentingan pemilik modal semata",
        ],
        answer: 2,
        explanation:
          "Sistem Ekonomi Pancasila berlandaskan nilai-nilai Pancasila dan UUD NRI Tahun 1945.",
      },
      {
        text: "Salah satu ciri Sistem Ekonomi Pancasila adalah ....",
        options: [
          "mengutamakan kepentingan kelompok tertentu",
          "mengembangkan asas kekeluargaan dan keadilan sosial",
          "membatasi keterlibatan masyarakat dalam kegiatan ekonomi",
          "menyerahkan seluruh kegiatan ekonomi kepada individu",
        ],
        answer: 1,
        explanation:
          "Sistem Ekonomi Pancasila menempatkan asas kekeluargaan, demokrasi ekonomi, dan keadilan sosial sebagai prinsip utama.",
      },
      {
        text: "Koperasi memiliki peran penting dalam Sistem Ekonomi Pancasila karena ....",
        options: [
          "bertujuan meningkatkan kesejahteraan anggota berdasarkan asas kekeluargaan",
          "hanya memberikan keuntungan kepada pengurusnya",
          "mengutamakan persaingan antaranggotanya",
          "membatasi keterlibatan masyarakat dalam kegiatan ekonomi",
        ],
        answer: 0,
        explanation:
          "Koperasi merupakan sokoguru perekonomian nasional yang bertujuan meningkatkan kesejahteraan anggota berdasarkan asas kekeluargaan.",
      },
      {
        text: "Pemerintah memberikan pelatihan, bantuan permodalan, dan promosi kepada pelaku UMKM. Kebijakan tersebut merupakan contoh ....",
        options: [
          "pembatasan kegiatan ekonomi masyarakat",
          "persaingan usaha yang tidak sehat",
          "pengutamaan kepentingan pemilik modal",
          "dukungan terhadap kemandirian ekonomi masyarakat",
        ],
        answer: 3,
        explanation:
          "Pembinaan dan bantuan permodalan kepada UMKM mendorong kemandirian ekonomi dan kesejahteraan masyarakat.",
      },
      {
        text: "Salah satu bentuk partisipasi masyarakat dalam mendukung pembangunan nasional adalah ....",
        options: [
          "menghindari kewajiban yang ditetapkan undang-undang",
          "menggunakan fasilitas umum untuk kepentingan pribadi",
          "mengutamakan keuntungan pribadi dalam setiap kegiatan",
          "membayar pajak sesuai dengan ketentuan peraturan perundang-undangan",
        ],
        answer: 3,
        explanation:
          "Pembayaran pajak sesuai ketentuan undang-undang merupakan kontribusi masyarakat untuk membiayai pembangunan nasional.",
      },
      {
        text: "Dalam Sistem Ekonomi Pancasila, pemanfaatan bumi, air, dan kekayaan alam harus diarahkan untuk ....",
        options: [
          "keuntungan sebesar-besarnya bagi perusahaan tertentu",
          "kepentingan kelompok yang menguasai sumber daya",
          "sebesar-besarnya kemakmuran rakyat",
          "meningkatkan keuntungan tanpa memperhatikan lingkungan",
        ],
        answer: 2,
        explanation:
          "Sesuai Pasal 33 UUD NRI Tahun 1945, bumi, air, dan kekayaan alam dikelola untuk sebesar-besarnya kemakmuran rakyat.",
      },
      {
        text: "Sebuah perusahaan memberikan upah yang layak, jaminan sosial, dan perlindungan kerja kepada karyawannya. Tindakan tersebut mencerminkan ....",
        options: [
          "pengutamaan keuntungan perusahaan",
          "keseimbangan hak dan kewajiban dalam kegiatan ekonomi",
          "pembatasan kebebasan pekerja",
          "persaingan ekonomi yang tidak sehat",
        ],
        answer: 1,
        explanation:
          "Pemberian upah dan jaminan sosial yang layak menjaga keseimbangan antara hak dan kewajiban pekerja dengan pengusaha.",
      },
      {
        text: "Pembangunan ekonomi yang berkeadilan seharusnya ....",
        options: [
          "hanya berfokus pada peningkatan keuntungan perusahaan besar",
          "mengutamakan pertumbuhan ekonomi tanpa memperhatikan masyarakat",
          "memberikan kesempatan usaha hanya kepada kelompok tertentu",
          "memperluas kesempatan ekonomi dan meningkatkan kesejahteraan masyarakat secara merata",
        ],
        answer: 3,
        explanation:
          "Pembangunan ekonomi yang berkeadilan berorientasi pada pemerataan kesempatan dan peningkatan kesejahteraan seluruh rakyat.",
      },
    ],
    chessQuestions: civicChess15Questions,
  },
];

const chessLevels = [
  {
    number: 1,
    title: "Asal-Usul & Makna Bhinneka Tunggal Ika",
    description:
      "Uji pemahamanmu mengenai Kakawin Sutasoma, makna historis & kontekstual, serta lambang negara Garuda Pancasila.",
    difficulty: "EASY",
    botDepth: 1,
    blunderRate: 55,
  },
  {
    number: 2,
    title: "Bhinneka Tunggal Ika sebagai Modal Sosial",
    description:
      "Hadapi tantangan toleransi keberagaman norma, agama, suku, ras, golongan, dan tiga unsur modal sosial.",
    difficulty: "EASY",
    botDepth: 1,
    blunderRate: 30,
  },
  {
    number: 3,
    title: "Membangun Harmoni dalam Keberagaman",
    description:
      "Terapkan nilai kerja sama, tolong-menolong, dan kerja bakti dalam permainan catur interaktif.",
    difficulty: "MEDIUM",
    botDepth: 2,
    blunderRate: 15,
  },
  {
    number: 4,
    title: "Kerja Sama & Sistem Ekonomi Pancasila",
    description:
      "Level puncak Bab III: koperasi, pajak, peran negara, dan kemandirian ekonomi yang berkeadilan.",
    difficulty: "HARD",
    botDepth: 3,
    blunderRate: 5,
  },
] as const;

async function main() {
  console.log("Menghapus modul lama di luar Modul 1-4...");
  await prisma.chessLevel.deleteMany({ where: { number: { gt: 4 } } });
  await prisma.module.deleteMany({ where: { order: { gt: 4 } } });

  console.log("Menyiapkan 4 Modul Bab III: Bhinneka Tunggal Ika...");
  for (const m of modules) {
    const mod = await prisma.module.upsert({
      where: { order: m.order },
      update: {
        title: m.title,
        subtitle: m.subtitle,
        description: m.description,
        color: m.color,
        summary: m.summary,
      },
      create: {
        order: m.order,
        title: m.title,
        subtitle: m.subtitle,
        description: m.description,
        color: m.color,
        summary: m.summary,
      },
    });

    await prisma.section.deleteMany({ where: { moduleId: mod.id } });
    await prisma.video.deleteMany({ where: { moduleId: mod.id } });
    await prisma.question.deleteMany({ where: { moduleId: mod.id } });

    await prisma.section.createMany({
      data: m.sections.map((s, i) => ({
        moduleId: mod.id,
        order: i + 1,
        title: s.title,
        content: s.content,
      })),
    });

    await prisma.video.create({ data: { moduleId: mod.id, ...m.video } });

    // Gabungkan soal kuis modul + soal khusus Civic Chess
    await prisma.question.createMany({
      data: m.questions.map((q) => ({
        moduleId: mod.id,
        text: q.text,
        options: JSON.stringify(q.options),
        answerIndex: q.answer,
        explanation: q.explanation,
      })),
    });

    await prisma.quiz.upsert({
      where: { moduleId: mod.id },
      update: { title: `Kuis Modul ${m.order}: ${m.title}` },
      create: {
        moduleId: mod.id,
        title: `Kuis Modul ${m.order}: ${m.title}`,
        difficulty:
          m.order === 1 ? "EASY" : m.order <= 3 ? "MEDIUM" : "HARD",
      },
    });

    const lvl = chessLevels[m.order - 1];
    await prisma.chessLevel.upsert({
      where: { number: lvl.number },
      update: { ...lvl, moduleId: mod.id },
      create: { ...lvl, moduleId: mod.id },
    });
  }

  console.log("Menyiapkan akun siswa & mereset leaderboard + progres...");
  // Hapus akun dummy tambahan agar isi leaderboard hanya sesuai jumlah akun user yang aktif
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          "budi@civicchess.id",
          "ayu@civicchess.id",
          "rizky@civicchess.id",
          "dewi@civicchess.id",
          "fajar@civicchess.id",
          "nadia@civicchess.id",
          "yoga@civicchess.id",
          "intan@civicchess.id",
          "guru@civicchess.id",
          "gita@civicchess.id",
          "garry@civicchess.id",
          "raja@civicchess.id",
          "junisah@civicchess.id",
          "eka@civicchess.id",
        ],
      },
    },
  });

  const sitiPasswordHash = await bcrypt.hash("12345", 10);
  const garyPasswordHash = await bcrypt.hash("54321", 10);

  await prisma.user.upsert({
    where: { email: "siti@civicchess.id" },
    update: {
      name: "Siti Hadriyani",
      username: "siti_hadriyani",
      passwordHash: sitiPasswordHash,
      points: 0,
    },
    create: {
      name: "Siti Hadriyani",
      username: "siti_hadriyani",
      email: "siti@civicchess.id",
      passwordHash: sitiPasswordHash,
      className: "XI IPA 1",
      school: "SMA Negeri 1",
      points: 0,
    },
  });

  // Jika user sudah pernah membuat akun Gary dengan email lain, perbarui passwordnya ke 54321;
  // jika belum ada, buat akun Gary (@gary) dengan password 54321
  const existingGary = await prisma.user.findFirst({
    where: {
      OR: [
        { username: { contains: "gary", mode: "insensitive" } },
        { name: { contains: "gary", mode: "insensitive" } },
      ],
    },
  });

  if (existingGary) {
    await prisma.user.update({
      where: { id: existingGary.id },
      data: {
        passwordHash: garyPasswordHash,
        points: 0,
      },
    });
  } else {
    await prisma.user.upsert({
      where: { email: "gary@civicchess.id" },
      update: {
        name: "Gary",
        username: "gary",
        passwordHash: garyPasswordHash,
        points: 0,
      },
      create: {
        name: "Gary",
        username: "gary",
        email: "gary@civicchess.id",
        passwordHash: garyPasswordHash,
        className: "XI IPA 1",
        school: "SMA Negeri 1",
        points: 0,
      },
    });
  }

  // Reset poin seluruh user menjadi 0 dan hapus seluruh riwayat/progres pembelajaran
  await prisma.user.updateMany({ data: { points: 0 } });
  await prisma.moduleProgress.deleteMany({});
  await prisma.quizAttempt.deleteMany({});
  await prisma.essaySubmission.deleteMany({});
  await prisma.chessGame.deleteMany({});

  console.log("Seed BAB III & reset progres selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
