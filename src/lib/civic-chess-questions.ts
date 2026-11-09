export type CivicChessQuestion = {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

/**
 * 15 Soal Resmi KUIS CIVIC CHESS (Pilihan A–E) beserta Kunci Jawaban & Umpan Balik
 * Materi: Bhinneka Tunggal Ika, Harmoni dalam Keberagaman, Kerja Sama, Gotong Royong, dan Sistem Ekonomi Pancasila
 */
export const CIVIC_CHESS_QUESTIONS: CivicChessQuestion[] = [
  {
    id: "cc-1",
    text: "Semboyan Bhinneka Tunggal Ika berasal dari kitab Kakawin Sutasoma yang ditulis oleh ....",
    options: [
      "Mpu Prapanca",
      "Mpu Tantular",
      "Empu Sedah",
      "Mpu Kanwa",
      "Ki Hajar Dewantara",
    ],
    answerIndex: 1,
    explanation:
      "B — Mpu Tantular. Semboyan Bhinneka Tunggal Ika berasal dari Kakawin Sutasoma karya Mpu Tantular.",
  },
  {
    id: "cc-2",
    text: "Makna utama semboyan Bhinneka Tunggal Ika dalam kehidupan bangsa Indonesia adalah ....",
    options: [
      "menghilangkan seluruh perbedaan yang ada di masyarakat",
      "mengutamakan kebudayaan mayoritas daripada kebudayaan lainnya",
      "menyatukan seluruh masyarakat dengan latar belakang yang sama",
      "berbeda-beda tetapi tetap satu sebagai bangsa Indonesia",
      "membatasi interaksi antarkelompok yang memiliki perbedaan",
    ],
    answerIndex: 3,
    explanation:
      "D — Berbeda-beda tetapi tetap satu. Semboyan ini mengajarkan bahwa perbedaan tidak menghalangi masyarakat Indonesia untuk bersatu sebagai satu bangsa.",
  },
  {
    id: "cc-3",
    text: "Di sebuah sekolah, terdapat siswa yang berasal dari berbagai suku dan agama. Ketika salah satu siswa menjalankan ibadah sesuai agamanya, siswa lain memberikan kesempatan dan menghormatinya. Sikap tersebut merupakan bentuk ....",
    options: [
      "toleransi dalam keberagaman",
      "persaingan antarkelompok",
      "penyeragaman kebudayaan",
      "pengutamaan kepentingan pribadi",
      "pembatasan kebebasan beragama",
    ],
    answerIndex: 0,
    explanation:
      "A — Toleransi dalam keberagaman. Menghormati orang lain yang menjalankan ibadah merupakan bentuk toleransi dan penghargaan terhadap perbedaan agama.",
  },
  {
    id: "cc-4",
    text: "Perkembangan teknologi dan perubahan budaya dapat memengaruhi nilai serta norma dalam masyarakat. Sikap yang tepat dalam menghadapi perubahan tersebut adalah ....",
    options: [
      "menerima seluruh perubahan tanpa mempertimbangkan dampaknya",
      "menolak semua bentuk perubahan dari luar",
      "mengikuti kebiasaan orang lain agar tidak dianggap berbeda",
      "mempertahankan semua kebiasaan lama tanpa pengecualian",
      "menyaring perubahan dengan mempertimbangkan nilai Pancasila dan dampaknya bagi masyarakat",
    ],
    answerIndex: 4,
    explanation:
      "E — Menyaring perubahan dengan mempertimbangkan nilai Pancasila dan dampaknya bagi masyarakat. Perubahan perlu disikapi secara kritis dengan mempertimbangkan nilai moral, norma, dan kepentingan bersama.",
  },
  {
    id: "cc-5",
    text: "Perselisihan terjadi antara dua kelompok siswa karena perbedaan pendapat mengenai kegiatan sekolah. Tindakan yang paling tepat untuk menyelesaikan persoalan tersebut adalah ....",
    options: [
      "membiarkan kedua kelompok menyelesaikan masalah dengan caranya masing-masing",
      "mendukung kelompok yang memiliki anggota paling banyak",
      "mengadakan musyawarah untuk mencari kesepakatan bersama",
      "meminta salah satu kelompok mengalah tanpa mendengarkan pendapatnya",
      "memisahkan kedua kelompok agar tidak perlu berinteraksi kembali",
    ],
    answerIndex: 2,
    explanation:
      "C — Mengadakan musyawarah untuk mencari kesepakatan bersama. Musyawarah memberikan kesempatan kepada setiap pihak untuk menyampaikan pendapat dan mencari penyelesaian yang dapat diterima bersama.",
  },
  {
    id: "cc-6",
    text: "Kerja sama merupakan kegiatan yang dilakukan oleh dua pihak atau lebih untuk mencapai tujuan bersama. Salah satu manfaat kerja sama dalam kehidupan masyarakat adalah ....",
    options: [
      "meningkatkan persaingan untuk menguasai sumber daya",
      "meringankan pekerjaan dan mempererat persatuan",
      "mengurangi tanggung jawab setiap anggota masyarakat",
      "menghilangkan seluruh perbedaan pendapat",
      "menjadikan kepentingan pribadi sebagai prioritas utama",
    ],
    answerIndex: 1,
    explanation:
      "B — Meringankan pekerjaan dan mempererat persatuan. Kerja sama membantu mencapai tujuan secara lebih efektif sekaligus memperkuat solidaritas dan hubungan sosial.",
  },
  {
    id: "cc-7",
    text: "Warga sebuah desa secara sukarela membantu tetangganya memperbaiki rumah yang rusak akibat bencana. Mereka bekerja bersama tanpa mengharapkan imbalan. Kegiatan tersebut mencerminkan ....",
    options: [
      "persaingan sosial",
      "kepentingan individu",
      "transaksi ekonomi",
      "gotong royong dalam bentuk tolong-menolong",
      "kerja bakti untuk kepentingan fasilitas umum",
    ],
    answerIndex: 3,
    explanation:
      "D — Gotong royong dalam bentuk tolong-menolong. Membantu tetangga yang mengalami kesulitan merupakan bentuk tolong-menolong yang dilandasi kepedulian dan semangat kekeluargaan.",
  },
  {
    id: "cc-8",
    text: "Menurut pembagian bentuk gotong royong yang dikemukakan Koentjaraningrat, kegiatan warga membersihkan saluran air dan memperbaiki jalan desa untuk kepentingan umum termasuk ....",
    options: [
      "kerja bakti",
      "tolong-menolong untuk kepentingan pribadi",
      "kegiatan ekonomi perseorangan",
      "persaingan dalam masyarakat",
      "hubungan kerja berdasarkan upah",
    ],
    answerIndex: 0,
    explanation:
      "A — Kerja bakti. Kerja bakti merupakan kegiatan bersama untuk memenuhi kepentingan umum, seperti membersihkan lingkungan dan memperbaiki fasilitas desa.",
  },
  {
    id: "cc-9",
    text: "Perhatikan beberapa kegiatan berikut!\n1. Membantu tetangga mempersiapkan acara pernikahan.\n2. Membersihkan lingkungan desa secara bersama-sama.\n3. Membantu korban bencana yang kehilangan tempat tinggal.\n4. Memperbaiki fasilitas umum yang rusak.\nKegiatan yang termasuk bentuk kerja bakti ditunjukkan oleh nomor ....",
    options: ["1 dan 2", "1 dan 3", "1 dan 4", "2 dan 3", "2 dan 4"],
    answerIndex: 4,
    explanation:
      "E — 2 dan 4. Membersihkan lingkungan desa dan memperbaiki fasilitas umum merupakan kegiatan kerja bakti untuk kepentingan bersama.",
  },
  {
    id: "cc-10",
    text: "Dalam kegiatan kerja kelompok, seorang siswa hanya ingin mendapatkan nilai bagus, tetapi tidak bersedia membantu anggota kelompok lainnya. Sikap tersebut bertentangan dengan semangat gotong royong karena ....",
    options: [
      "setiap orang harus menyelesaikan semua pekerjaan sendiri",
      "gotong royong hanya dapat dilakukan dalam kegiatan masyarakat",
      "gotong royong menekankan kebersamaan, kerelaan, dan tanggung jawab bersama",
      "kerja kelompok seharusnya mengutamakan persaingan antaranggota",
      "keberhasilan kelompok tidak berkaitan dengan kontribusi setiap anggota",
    ],
    answerIndex: 2,
    explanation:
      "C — Gotong royong menekankan kebersamaan, kerelaan, dan tanggung jawab bersama. Gotong royong menuntut kesediaan untuk berkontribusi dan saling membantu demi mencapai tujuan bersama.",
  },
  {
    id: "cc-11",
    text: "Sistem Ekonomi Pancasila merupakan sistem ekonomi yang berlandaskan Pancasila dan UUD NRI Tahun 1945. Salah satu prinsip utama sistem ekonomi tersebut adalah ....",
    options: [
      "kebebasan individu tanpa memperhatikan kepentingan masyarakat",
      "persaingan ekonomi sebagai tujuan utama pembangunan",
      "penguasaan seluruh kegiatan ekonomi oleh kelompok tertentu",
      "asas kekeluargaan dan keadilan sosial",
      "keuntungan materi sebagai satu-satunya ukuran keberhasilan",
    ],
    answerIndex: 3,
    explanation:
      "D — Asas kekeluargaan dan keadilan sosial. Sistem Ekonomi Pancasila mengutamakan kesejahteraan rakyat, kebersamaan, dan keadilan dalam kegiatan ekonomi.",
  },
  {
    id: "cc-12",
    text: "Koperasi sekolah menyediakan kebutuhan belajar siswa dan mengelola usahanya berdasarkan partisipasi anggota. Koperasi tersebut mencerminkan Sistem Ekonomi Pancasila karena ....",
    options: [
      "mengutamakan keuntungan pengurus dibandingkan anggota",
      "menerapkan kerja sama berdasarkan asas kekeluargaan",
      "membatasi keterlibatan anggota dalam pengambilan keputusan",
      "memberikan keuntungan hanya kepada siswa yang mampu",
      "mengutamakan persaingan daripada kesejahteraan bersama",
    ],
    answerIndex: 1,
    explanation:
      "B — Menerapkan kerja sama berdasarkan asas kekeluargaan. Koperasi merupakan salah satu bentuk usaha yang menerapkan prinsip kerja sama dan demokrasi ekonomi untuk meningkatkan kesejahteraan anggota.",
  },
  {
    id: "cc-13",
    text: "Pemerintah memberikan pelatihan, pendampingan, dan bantuan akses permodalan kepada pelaku UMKM agar usaha mereka berkembang. Kebijakan tersebut menunjukkan peran negara dalam ....",
    options: [
      "membatasi kegiatan ekonomi masyarakat",
      "mengurangi partisipasi masyarakat dalam pembangunan",
      "mengutamakan kepentingan perusahaan besar",
      "menyerahkan seluruh tanggung jawab ekonomi kepada individu",
      "mendorong kemandirian ekonomi dan meningkatkan kesejahteraan masyarakat",
    ],
    answerIndex: 4,
    explanation:
      "E — Mendorong kemandirian ekonomi dan meningkatkan kesejahteraan masyarakat. Dukungan terhadap UMKM membantu masyarakat mengembangkan usaha, memperluas kesempatan ekonomi, dan meningkatkan kesejahteraan.",
  },
  {
    id: "cc-14",
    text: "Pajak merupakan salah satu sumber penerimaan negara yang digunakan untuk membiayai berbagai kebutuhan publik. Membayar pajak sesuai dengan ketentuan peraturan perundang-undangan merupakan bentuk ....",
    options: [
      "partisipasi masyarakat dalam mendukung pembangunan nasional",
      "transaksi ekonomi yang memberikan keuntungan langsung kepada pembayar",
      "kegiatan ekonomi yang hanya menguntungkan pemerintah",
      "kerja sama yang dilakukan untuk memperoleh imbalan pribadi",
      "tanggung jawab yang hanya berlaku bagi pelaku usaha besar",
    ],
    answerIndex: 0,
    explanation:
      "A — Partisipasi masyarakat dalam mendukung pembangunan nasional. Pajak digunakan untuk membiayai kebutuhan negara dan pembangunan bagi kepentingan masyarakat sesuai dengan ketentuan peraturan perundang-undangan.",
  },
  {
    id: "cc-15",
    text: "Sebuah perusahaan memperoleh keuntungan besar, tetapi memberikan upah yang tidak layak kepada pekerjanya dan mengabaikan dampak pencemaran lingkungan. Berdasarkan prinsip Sistem Ekonomi Pancasila, tindakan yang seharusnya dilakukan adalah ....",
    options: [
      "mempertahankan kebijakan tersebut selama perusahaan tetap memperoleh keuntungan",
      "mengurangi jumlah pekerja agar biaya produksi semakin rendah",
      "memperbaiki kesejahteraan pekerja dan menjalankan usaha dengan memperhatikan kelestarian lingkungan",
      "mengutamakan kepentingan pemilik perusahaan daripada masyarakat sekitar",
      "menyerahkan seluruh persoalan kepada masyarakat tanpa memperbaiki kegiatan usaha",
    ],
    answerIndex: 2,
    explanation:
      "C — Memperbaiki kesejahteraan pekerja dan menjalankan usaha dengan memperhatikan kelestarian lingkungan. Sistem Ekonomi Pancasila menekankan keseimbangan antara kegiatan ekonomi, keadilan sosial, hak pekerja, dan tanggung jawab terhadap lingkungan.",
  },
];

export const ESSAY_QUESTIONS_BY_MODULE: Record<number, string[]> = {
  1: [
    "Bhinneka Tunggal Ika merupakan semboyan bangsa Indonesia yang menegaskan persatuan dalam keberagaman. Menurut pendapatmu, bagaimana semboyan tersebut dapat diterapkan untuk menghadapi tantangan keberagaman di Indonesia saat ini? Berikan contoh konkret.",
    "Keberagaman suku, agama, budaya, dan norma dapat menjadi kekuatan sekaligus tantangan bagi bangsa Indonesia. Jelaskan hubungan Bhinneka Tunggal Ika dengan upaya membangun harmoni dalam keberagaman. Sertakan contoh tindakan toleransi, kerja sama, atau gotong royong yang dapat dilakukan dalam kehidupan sehari-hari.",
  ],
  2: [
    "Indonesia memiliki keberagaman norma, agama, suku bangsa, ras, dan golongan. Jelaskan mengapa sikap toleransi diperlukan untuk menjaga persatuan dan kesatuan bangsa di tengah keberagaman tersebut!",
    "Bhinneka Tunggal Ika merupakan salah satu modal sosial bangsa Indonesia. Jelaskan tiga unsur penting yang dapat memperkuat Bhinneka Tunggal Ika sebagai modal sosial, serta berikan contoh penerapannya dalam kehidupan sehari-hari!",
  ],
  3: [
    "Jelaskan perbedaan antara kerja sama dan gotong royong (baik dalam arti tolong-menolong maupun kerja bakti) beserta contoh penerapannya di lingkungan sekolah dan masyarakat!",
    "Mengapa semangat gotong royong penting dipertahankan untuk membangun harmoni di tengah keberagaman masyarakat Indonesia?",
  ],
  4: [
    "Jelaskan dua ciri Sistem Ekonomi Pancasila dan berikan contoh penerapannya dalam kehidupan sehari-hari!",
    "Menurut pendapatmu, bagaimana cara menerapkan semangat gotong royong untuk mewujudkan perekonomian yang adil dan meningkatkan kesejahteraan masyarakat? Berikan minimal dua contoh!",
  ],
};
