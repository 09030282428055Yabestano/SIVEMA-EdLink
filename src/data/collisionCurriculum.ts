import photoPendulum from '@/src/assets/images/photo_pendulum_collision_1794749478929.jpg';
import photoBilliard from '@/src/assets/images/photo_billiard_elastic_1794749479472.jpg';
import photoAirtrack from '@/src/assets/images/photo_airtrack_impulse_1794749480205.jpg';
import type {
  ChapterMaterial,
  ChapterStageProgress,
  MediaPhoto,
  StudentReflection,
  TaskAttempt,
  TaskBundle,
} from '@/src/types/academic';

export const STUDENT_PROFILE = {
  name: 'Amanda Asti Vania',
  nim: '06111182429012',
  program: 'Pendidikan Fisika & Teknik Komputasi',
  semester: 'Semester 3',
  course: 'Mekanika Klasik · Modul Tumbukan',
  lecturer: 'Amanda Asti Vania',
};

export const CHAPTERS: ChapterMaterial[] = [
  {
    id: 'bab-1',
    babNumber: 1,
    title: 'Momentum & Impuls',
    subtitle: 'Besaran vektor gerak dan perubahan momentum akibat gaya sesaat',
    durationMinutes: 20,
    summary:
      'Momentum linear mengukur kecenderungan benda bergerak untuk mempertahankan geraknya, sedangkan impuls menggambarkan efek total gaya yang bekerja selama selang waktu tumbukan.',
    keyConcepts: [
      'Momentum (p) merupakan besaran vektor yang searah dengan vektor kecepatan benda (v).',
      'Impuls (I) sama dengan luas area di bawah kurva gaya terhadap waktu (F–t) dan setara dengan perubahan momentum (Δp).',
      'Memperpanjang waktu kontak tumbukan (Δt) menurunkan gaya rata-rata benturan secara signifikan — prinsip dasar kantung udara dan helm pelindung.',
    ],
    formulas: [
      {
        label: 'Momentum Linear',
        equation: 'p = m · v',
        variables: 'p = momentum (kg·m/s), m = massa (kg), v = kecepatan (m/s)',
      },
      {
        label: 'Teorema Impuls-Momentum',
        equation: 'I = F_rata · Δt = Δp = m(v₂ − v₁)',
        variables: 'I = impuls (N·s), F = gaya rata-rata (N), Δt = selang waktu kontak (s)',
      },
    ],
    workedExample: {
      title: 'Analisis Impuls pada Bola Golf',
      problem:
        'Sebuah bola bermassa 0,2 kg mula-mula diam di atas lintasan, lalu dipukul dengan gaya rata-rata 120 N selama 0,05 detik. Tentukan besar impuls dan kecepatan bola sesaat setelah dipukul.',
      given: ['m = 0,2 kg', 'v₁ = 0 m/s', 'F = 120 N', 'Δt = 0,05 s'],
      steps: [
        'Hitung impuls: I = F · Δt = 120 × 0,05 = 6 N·s.',
        'Gunakan teorema impuls-momentum: I = m(v₂ − v₁).',
        '6 = 0,2 × (v₂ − 0) → v₂ = 6 / 0,2 = 30 m/s.',
      ],
      answer: 'I = 6 N·s dan v₂ = 30 m/s',
    },
    realWorldContext:
      'Pada desain bumper mobil modern (crumple zone), material dirancang melunak saat tabrakan agar waktu kontak Δt membesar sehingga gaya puncak F yang diterima penumpang berkurang drastis.',
    simulationPresetId: 'different-mass',
    relatedPhotoId: 'photo-airtrack',
  },
  {
    id: 'bab-2',
    babNumber: 2,
    title: 'Hukum Kekekalan Momentum',
    subtitle: 'Invariansi momentum total pada sistem terisolasi sebelum dan sesudah interaksi',
    durationMinutes: 25,
    summary:
      'Apabila resultan gaya eksternal yang bekerja pada sistem dua benda atau lebih sama dengan nol, momentum total sistem sebelum tumbukan selalu sama dengan momentum total sesudah tumbukan.',
    keyConcepts: [
      'Gaya aksi-reaksi antara dua benda saat bertumbukan merupakan gaya internal yang saling meniadakan (F₁₂ = −F₂₁).',
      'Hukum kekekalan momentum berlaku untuk semua jenis tumbukan (lenting sempurna, sebagian, maupun tidak lenting) selama sistem terisolasi.',
      'Arah gerak sangat krusial: tetapkan acuan sumbu positif (ke kanan +) dan negatif (ke kiri −) sebelum menghitung.',
    ],
    formulas: [
      {
        label: 'Kekekalan Momentum 1D',
        equation: 'm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′',
        variables: 'v₁, v₂ = kecepatan awal (m/s); v₁′, v₂′ = kecepatan setelah tumbukan (m/s)',
      },
      {
        label: 'Koefisien Restitusi Umum',
        equation: 'e = −(v₁′ − v₂′) / (v₁ − v₂)',
        variables: 'e = koefisien restitusi (0 ≤ e ≤ 1, tanpa satuan)',
      },
    ],
    workedExample: {
      title: 'Tumbukan Dua Troli di Rel Udara',
      problem:
        'Troli A (m₁ = 2 kg) bergerak ke kanan dengan laju 4 m/s menumbuk troli B (m₂ = 3 kg) yang bergerak ke kiri dengan laju 2 m/s. Jika setelah tumbukan troli A terpental ke kiri dengan laju 1 m/s, berapakah kecepatan troli B?',
      given: ['m₁ = 2 kg, v₁ = +4 m/s', 'm₂ = 3 kg, v₂ = −2 m/s', 'v₁′ = −1 m/s'],
      steps: [
        'Momentum awal: p_awal = (2)(4) + (3)(−2) = 8 − 6 = +2 kg·m/s.',
        'Momentum akhir: p_akhir = (2)(−1) + 3·v₂′ = −2 + 3·v₂′.',
        'Samakan p_awal = p_akhir: 2 = −2 + 3·v₂′ → 3·v₂′ = 4 → v₂′ = +1,33 m/s (ke kanan).',
      ],
      answer: 'v₂′ = +1,33 m/s ke arah kanan',
    },
    realWorldContext:
      'Prinsip pendorong roket dan recoil senapan memanfaatkan kekekalan momentum total dari keadaan diam (p_awal = 0) menjadi dua bagian bergerak berlawanan arah.',
    simulationPresetId: 'elastic',
    relatedPhotoId: 'photo-airtrack',
  },
  {
    id: 'bab-3',
    babNumber: 3,
    title: 'Tumbukan Lenting Sempurna',
    subtitle: 'Tumbukan ideal dengan koefisien restitusi e = 1 dan energi kinetik kekal',
    durationMinutes: 25,
    summary:
      'Pada tumbukan lenting sempurna, tidak ada energi kinetik yang hilang menjadi panas, bunyi, atau deformasi permanen. Baik momentum total maupun energi kinetik total sistem bernilai kekal.',
    keyConcepts: [
      'Koefisien restitusi bernilai tepat e = 1, artinya laju relatif saling menjauh sesudah tumbukan sama dengan laju relatif saling mendekat sebelum tumbukan.',
      'Jika dua benda bermassa identik (m₁ = m₂) bertumbukan lenting sempurna secara sentral, kedua benda saling bertukar kecepatan.',
      'Jika benda bermassa kecil menumbuk benda bermassa sangat besar yang diam, benda kecil memantul dengan laju hampir sama dan benda besar nyaris tetap diam.',
    ],
    formulas: [
      {
        label: 'Kekekalan Energi Kinetik',
        equation: '½m₁v₁² + ½m₂v₂² = ½m₁v₁′² + ½m₂v₂′²',
        variables: 'Ek_total awal = Ek_total akhir (Joule)',
      },
      {
        label: 'Relasi Kecepatan Relatif (e = 1)',
        equation: 'v₁ − v₂ = −(v₁′ − v₂′)  atau  v₁ + v₁′ = v₂ + v₂′',
        variables: 'Berlaku khusus pada tumbukan sentral lenting sempurna 1D',
      },
    ],
    workedExample: {
      title: 'Pertukaran Kecepatan Bola Biliar',
      problem:
        'Bola biliar putih (m₁ = 0,17 kg) bergerak dengan kecepatan 5 m/s menumbuk sentral bola bernomor 7 (m₂ = 0,17 kg) yang diam secara lenting sempurna. Tentukan kecepatan masing-masing bola setelah tumbukan.',
      given: ['m₁ = m₂ = 0,17 kg', 'v₁ = 5 m/s, v₂ = 0 m/s', 'e = 1'],
      steps: [
        'Dari kekekalan momentum (m₁ = m₂): v₁′ + v₂′ = 5.',
        'Dari e = 1: v₂′ − v₁′ = v₁ − v₂ = 5.',
        'Jumlahkan kedua persamaan: 2·v₂′ = 10 → v₂′ = 5 m/s, dan v₁′ = 0 m/s.',
      ],
      answer: 'Bola putih berhenti (0 m/s), bola 7 melaju 5 m/s',
    },
    realWorldContext:
      'Ayunan Newton (Newton’s Cradle) dengan bola baja keras dan tumbukan antar partikel gas ideal mendekati perilaku tumbukan lenting sempurna.',
    simulationPresetId: 'elastic',
    relatedPhotoId: 'photo-billiard',
  },
  {
    id: 'bab-4',
    babNumber: 4,
    title: 'Tumbukan Lenting Sebagian',
    subtitle: 'Tumbukan nyata di alam dengan 0 < e < 1 dan sebagian energi terdisipasi',
    durationMinutes: 25,
    summary:
      'Hampir seluruh tumbukan makroskopik di dunia nyata bersifat lenting sebagian. Momentum tetap kekal, tetapi sebagian energi kinetik berubah menjadi energi panas, suara, atau getaran.',
    keyConcepts: [
      'Nilai koefisien restitusi berada di rentang 0 < e < 1; semakin mendekati 1 semakin elastis bahan tersebut.',
      'Pada kasus bola jatuh bebas dari ketinggian h₁ lalu memantul setinggi h₂, koefisien restitusi memenuhi e = √(h₂ / h₁).',
      'Energi kinetik yang hilang dihitung dari selisih ΔEk = Ek_awal − Ek_akhir > 0.',
    ],
    formulas: [
      {
        label: 'Restitusi Pantulan Lantai',
        equation: 'e = √(h₂ / h₁) = √(h₃ / h₂)',
        variables: 'h₁ = tinggi jatuh awal (m), h₂ = tinggi pantulan pertama (m)',
      },
      {
        label: 'Energi Kinetik Terdisipasi',
        equation: 'ΔE_k = E_k,awal − E_k,akhir',
        variables: 'ΔEk > 0 menunjukkan energi berubah menjadi panas/bunyi/deformasi',
      },
    ],
    workedExample: {
      title: 'Bola Basket Memantul di Lantai Lab',
      problem:
        'Sebuah bola dijatuhkan tanpa kecepatan awal dari ketinggian 4 meter. Setelah menyentuh lantai, bola memantul hingga ketinggian maksimum 1,44 meter. Hitung koefisien restitusi antara bola dan lantai.',
      given: ['h₁ = 4,0 m', 'h₂ = 1,44 m'],
      steps: [
        'Gunakan persamaan pantulan: e = √(h₂ / h₁).',
        'e = √(1,44 / 4,0) = √0,36.',
        'e = 0,60.',
      ],
      answer: 'Koefisien restitusi e = 0,60',
    },
    realWorldContext:
      'Standar kelayakan bola tenis, bola basket, dan sepatu lari diuji menggunakan koefisien restitusi untuk memastikan pantulan dan penyerapan energi sesuai regulasi.',
    simulationPresetId: 'partial',
    relatedPhotoId: 'photo-pendulum',
  },
  {
    id: 'bab-5',
    babNumber: 5,
    title: 'Tumbukan Tidak Lenting Sama Sekali',
    subtitle: 'Kedua benda menyatu pasca-tumbukan (e = 0) dengan kehilangan energi maksimum',
    durationMinutes: 20,
    summary:
      'Tumbukan tidak lenting sama sekali terjadi ketika dua benda menempel atau bergerak bersama dengan satu kecepatan akhir yang sama (v₁′ = v₂′ = v′) setelah bertumbukan.',
    keyConcepts: [
      'Koefisien restitusi bernilai tepat e = 0 karena tidak ada gerak relatif memisah sesudah tumbukan.',
      'Persamaan momentum menyederhana menjadi m₁v₁ + m₂v₂ = (m₁ + m₂)v′.',
      'Kehilangan energi kinetik mencapai nilai maksimum yang diizinkan oleh hukum kekekalan momentum.',
    ],
    formulas: [
      {
        label: 'Kecepatan Gabungan (e = 0)',
        equation: 'v′ = (m₁v₁ + m₂v₂) / (m₁ + m₂)',
        variables: 'v′ = kecepatan bersama kedua benda setelah menyatu (m/s)',
      },
      {
        label: 'Rasio Energi Hilang',
        equation: 'ΔE_k = ½ · [m₁m₂ / (m₁ + m₂)] · (v₁ − v₂)²',
        variables: 'Energi kinetik yang hilang berubah menjadi deformasi permanen & kalor',
      },
    ],
    workedExample: {
      title: 'Penggandengan Gerbong Kereta',
      problem:
        'Gerbong A bermassa 4.000 kg melaju 6 m/s menumbuk gerbong B bermassa 2.000 kg yang diam di rel datar, lalu keduanya tersambung otomatis. Tentukan kecepatan gabungan dan energi kinetik yang hilang.',
      given: ['m₁ = 4.000 kg, v₁ = 6 m/s', 'm₂ = 2.000 kg, v₂ = 0 m/s', 'e = 0'],
      steps: [
        'v′ = (4.000 × 6 + 2.000 × 0) / (4.000 + 2.000) = 24.000 / 6.000 = 4 m/s.',
        'Ek_awal = ½(4.000)(6²) = 72.000 J.',
        'Ek_akhir = ½(6.000)(4²) = 48.000 J → ΔEk = 72.000 − 48.000 = 24.000 J.',
      ],
      answer: 'v′ = 4 m/s dan energi hilang ΔEk = 24.000 J',
    },
    realWorldContext:
      'Bandul balistik (ballistic pendulum) digunakan di laboratorium untuk mengukur kecepatan proyektil dengan menembakkannya ke balok kayu yang kemudian berayun bersama.',
    simulationPresetId: 'inelastic',
    relatedPhotoId: 'photo-airtrack',
  },
];

export const MEDIA_PHOTOS: MediaPhoto[] = [
  {
    id: 'photo-pendulum',
    title: 'Ayunan Newton — Transfer Momentum Beruntun',
    category: 'Foto Eksperimen Lab · Bab 3 & 4',
    imageSrc: photoPendulum,
    caption:
      'Bola baja berderet menunjukkan perambatan gelombang impuls dan kekekalan momentum hampir elastis sempurna (e ≈ 0,98).',
    experimentNotes: [
      'Ketika 1 bola dilepaskan dari ujung kiri, tepat 1 bola di ujung kanan terangkat dengan simpangan hampir identik.',
      'Bola-bola tengah berfungsi sebagai medium penerus gaya kontak dalam mikrodetik.',
      'Sedikit bunyi klik menandakan adanya disipasi energi sangat kecil (tumbukan lenting sebagian mendekati ideal).',
    ],
    formulaObserved: 'm · v₁ = m · v₂′  (karena m₁ = m₂ dan e ≈ 1)',
    chapterId: 'bab-3',
  },
  {
    id: 'photo-billiard',
    title: 'Tumbukan Dua Dimensi Bola Biliar',
    category: 'Foto Studio Mekanika · Bab 3',
    imageSrc: photoBilliard,
    caption:
      'Tumbukan elastis bola bermassa identik di meja biliar memperlihatkan pemisahan sudut lintasan mendekati 90° saat tumbukan tidak sentral.',
    experimentNotes: [
      'Jejak kapur di titik kontak menandai garis normal tempat gaya impuls bekerja.',
      'Momentum kekal pada sumbu-x dan sumbu-y secara independen.',
      'Untuk massa sama dan e ≈ 1, sudut antara vektor kecepatan akhir kedua bola hampir tegak lurus.',
    ],
    formulaObserved: 'p_awal = p₁′ + p₂′  (vektor 2D) &  v₁′ ⊥ v₂′',
    chapterId: 'bab-3',
  },
  {
    id: 'photo-airtrack',
    title: 'Rel Udara Linear & Sensor Photogate',
    category: 'Dokumentasi Praktikum · Bab 1, 2 & 5',
    imageSrc: photoAirtrack,
    caption:
      'Praktikum tumbukan 1 dimensi bebas gesekan menggunakan rel udara (air track) dan dua sensor gerbang cahaya (photogate) digital.',
    experimentNotes: [
      'Bantalan udara bertekanan meminimalkan gaya gesek eksternal sehingga syarat sistem terisolasi terpenuhi.',
      'Sensor photogate mengukur selang waktu Δt bendera peluncur untuk memperoleh kecepatan v₁ dan v₂ secara presisi.',
      'Pegas bumper menghasilkan tumbukan lenting, sedangkan velcro menghasilkan tumbukan tidak lenting sama sekali (e = 0).',
    ],
    formulaObserved: 'm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′',
    chapterId: 'bab-2',
  },
];

export const TASK_BUNDLES: TaskBundle[] = [
  {
    id: 'tugas-komprehensif-tumbukan',
    chapterId: 'bab-3',
    kind: 'tugas',
    title: 'Tugas Terstruktur 1: Analisis Tumbukan & Momentum',
    description:
      'Kerjakan soal secara fleksibel. Jika soal no. 1 belum dapat dijawab, Anda bebas melompat ke soal no. 2 atau nomor mana saja melalui Peta Soal dan kembali kapan saja.',
    estimatedMinutes: 20,
    passingScore: 75,
    questions: [
      {
        id: 'tk-1',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Impuls & Waktu Kontak',
        prompt:
          'Sebuah truk bermassa 2.000 kg melaju 15 m/s menabrak pembatas elastis dan berhenti dalam waktu 0,5 detik. Berapakah besar gaya rata-rata yang dialami pembatas selama benturan?',
        equationHint: 'I = F · Δt = m(v₂ − v₁)',
        options: ['30.000 N', '45.000 N', '60.000 N', '90.000 N'],
        correctOptionIndex: 2,
        points: 15,
        explanation:
          'Perubahan momentum Δp = m(0 − 15) = −30.000 kg·m/s. Besar gaya rata-rata F = |Δp| / Δt = 30.000 / 0,5 = 60.000 N.',
      },
      {
        id: 'tk-2',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Kekekalan Momentum 1D',
        prompt:
          'Benda A (m = 3 kg) bergerak ke kanan 6 m/s menumbuk benda B (m = 2 kg) yang diam. Jika setelah tumbukan benda A tetap bergerak ke kanan 2 m/s, tentukan kecepatan benda B setelah tumbukan (dalam m/s).',
        equationHint: 'm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′',
        correctNumericValue: 6,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 15,
        explanation:
          'p_awal = (3)(6) + (2)(0) = 18 kg·m/s. p_akhir = (3)(2) + 2·v₂′ = 6 + 2·v₂′. Maka 2·v₂′ = 12 → v₂′ = 6 m/s.',
      },
      {
        id: 'tk-3',
        chapterId: 'bab-3',
        format: 'multiple-choice',
        conceptTag: 'Tumbukan Lenting Sempurna',
        prompt:
          'Dua bola biliar bermassa identik bertumbukan lenting sempurna (e = 1) secara sentral. Bola 1 bergerak 4 m/s ke kanan dan bola 2 bergerak 2 m/s ke kiri. Kecepatan bola 1 dan bola 2 setelah tumbukan berturut-turut adalah...',
        equationHint: 'Untuk m₁ = m₂ dan e = 1, kedua benda bertukar vektor kecepatan.',
        options: [
          '−2 m/s dan +4 m/s',
          '+2 m/s dan −4 m/s',
          '0 m/s dan +2 m/s',
          '−4 m/s dan +2 m/s',
        ],
        correctOptionIndex: 0,
        points: 15,
        explanation:
          'Pada tumbukan lenting sempurna 1D dua benda bermassa sama, keduanya saling bertukar kecepatan: v₁′ = v₂ = −2 m/s (ke kiri) dan v₂′ = v₁ = +4 m/s (ke kanan).',
      },
      {
        id: 'tk-4',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Koefisien Restitusi Pantulan',
        prompt:
          'Bola tenis dijatuhkan dari ketinggian 5 meter di atas lantai keramik dan memantul hingga ketinggian maksimum 3,2 meter. Hitung nilai koefisien restitusi (e) antara bola dan lantai.',
        equationHint: 'e = √(h₂ / h₁)',
        correctNumericValue: 0.8,
        numericTolerance: 0.02,
        unit: '(tanpa satuan)',
        points: 15,
        explanation:
          'e = √(3,2 / 5,0) = √0,64 = 0,8.',
      },
      {
        id: 'tk-5',
        chapterId: 'bab-5',
        format: 'multiple-choice',
        conceptTag: 'Tumbukan Tidak Lenting',
        prompt:
          'Peluru bermassa 0,02 kg ditembakkan mendatar dengan laju 200 m/s ke dalam balok kayu bermassa 0,98 kg yang diam di atas meja licin lalu bersarang di dalamnya. Kecepatan gabungan balok dan peluru adalah...',
        equationHint: 'v′ = (m₁v₁ + m₂v₂) / (m₁ + m₂)',
        options: ['2,0 m/s', '4,0 m/s', '6,5 m/s', '8,0 m/s'],
        correctOptionIndex: 1,
        points: 20,
        explanation:
          'v′ = (0,02 × 200 + 0) / (0,02 + 0,98) = 4,0 / 1,0 = 4,0 m/s.',
      },
      {
        id: 'tk-6',
        chapterId: 'bab-5',
        format: 'multiple-choice',
        conceptTag: 'Disipasi Energi Kinetik',
        prompt:
          'Manakah pernyataan yang paling tepat membedakan tumbukan lenting sebagian dengan tumbukan tidak lenting sama sekali?',
        options: [
          'Pada tumbukan lenting sebagian momentum tidak kekal, sedangkan pada tidak lenting momentum kekal',
          'Pada tumbukan tidak lenting sama sekali e = 0 dan kedua benda menyatu setelah bertumbukan',
          'Energi kinetik total selalu bertambah pada tumbukan lenting sebagian',
          'Koefisien restitusi tumbukan tidak lenting sama sekali bernilai e = 1',
        ],
        correctOptionIndex: 1,
        points: 20,
        explanation:
          'Momentum total kekal pada seluruh jenis tumbukan sistem terisolasi. Ciri khas tumbukan tidak lenting sama sekali adalah e = 0 sehingga kedua benda bergerak bersama setelah bertumbukan.',
      },
    ],
  },
  {
    id: 'pretest-bab-1',
    chapterId: 'bab-1',
    kind: 'pretest',
    title: 'Pre-test Bab 1: Momentum & Impuls',
    description: 'Evaluasi awal pemahaman konsep momentum linear dan teorema impuls.',
    estimatedMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'pre1-1',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Definisi Momentum',
        prompt:
          'Sebuah benda bermassa 4 kg bergerak dengan kecepatan 5 m/s ke utara. Besar momentum benda tersebut adalah...',
        equationHint: 'p = m · v',
        options: ['1,25 kg·m/s', '9 kg·m/s', '20 kg·m/s', '40 kg·m/s'],
        correctOptionIndex: 2,
        points: 25,
        explanation: 'p = m · v = 4 kg × 5 m/s = 20 kg·m/s ke arah utara.',
      },
      {
        id: 'pre1-2',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Konsep Impuls',
        prompt:
          'Mengapa petinju menggerakkan kepalanya searah pukulan lawan saat terkena hantaman?',
        options: [
          'Untuk memperkecil perubahan momentum yang terjadi',
          'Untuk memperpanjang waktu kontak Δt sehingga gaya rata-rata F mengecil',
          'Untuk mengubah tumbukan menjadi lenting sempurna',
          'Agar impuls yang diterima bernilai nol',
        ],
        correctOptionIndex: 1,
        points: 25,
        explanation:
          'Karena I = F · Δt = Δp, memperpanjang waktu kontak Δt menurunkan gaya benturan F pada nilai Δp tertentu.',
      },
      {
        id: 'pre1-3',
        chapterId: 'bab-1',
        format: 'numeric',
        conceptTag: 'Perhitungan Impuls',
        prompt:
          'Gaya konstan 40 N bekerja pada benda selama 0,25 detik. Berapakah besar impuls yang diberikan (dalam N·s)?',
        equationHint: 'I = F · Δt',
        correctNumericValue: 10,
        numericTolerance: 0.05,
        unit: 'N·s',
        points: 25,
        explanation: 'I = 40 N × 0,25 s = 10 N·s.',
      },
      {
        id: 'pre1-4',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Arah Vektor Momentum',
        prompt:
          'Bola 0,5 kg menabrak dinding tegak lurus pada laju 8 m/s dan memantul balik dengan laju 6 m/s. Besar perubahan momentum bola adalah...',
        equationHint: 'Perhatikan tanda arah berlawanan: v₁ = +8 m/s, v₂ = −6 m/s',
        options: ['1 kg·m/s', '2 kg·m/s', '7 kg·m/s', '14 kg·m/s'],
        correctOptionIndex: 2,
        points: 25,
        explanation:
          'Δp = m(v₂ − v₁) = 0,5 × (−6 − 8) = −7 kg·m/s. Besar perubahan momentum adalah 7 kg·m/s.',
      },
    ],
  },
  {
    id: 'posttest-bab-3',
    chapterId: 'bab-3',
    kind: 'posttest',
    title: 'Post-test Bab 3: Tumbukan Lenting Sempurna',
    description:
      'Uji capaian pembelajaran Bab 3 mencakup kekekalan momentum, energi kinetik, dan koefisien restitusi e = 1.',
    estimatedMinutes: 15,
    passingScore: 75,
    questions: [
      {
        id: 'post3-1',
        chapterId: 'bab-3',
        format: 'multiple-choice',
        conceptTag: 'Syarat Lenting Sempurna',
        prompt:
          'Dua besaran fisika yang selalu bernilai kekal pada tumbukan lenting sempurna dalam sistem terisolasi adalah...',
        options: [
          'Kecepatan dan percepatan',
          'Momentum linear dan energi kinetik',
          'Gaya impuls dan koefisien gesek',
          'Energi potensial dan massa jenis',
        ],
        correctOptionIndex: 1,
        points: 25,
        explanation:
          'Pada tumbukan lenting sempurna (e = 1), momentum linear total dan energi kinetik total sama-sama kekal.',
      },
      {
        id: 'post3-2',
        chapterId: 'bab-3',
        format: 'numeric',
        conceptTag: 'Tumbukan Sentral Massa Berbeda',
        prompt:
          'Benda 2 kg bergerak 6 m/s menumbuk lenting sempurna benda 4 kg yang diam. Jika kecepatan benda 2 kg setelah tumbukan adalah −2 m/s, berapakah kecepatan benda 4 kg setelah tumbukan (m/s)?',
        equationHint: 'e = 1 → v₂′ − v₁′ = v₁ − v₂',
        correctNumericValue: 4,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 25,
        explanation:
          'Dari v₂′ − (−2) = 6 − 0 → v₂′ + 2 = 6 → v₂′ = 4 m/s. Cek momentum: 2(6) = 2(−2) + 4(4) = 12 (terbukti).',
      },
      {
        id: 'post3-3',
        chapterId: 'bab-3',
        format: 'multiple-choice',
        conceptTag: 'Koefisien Restitusi',
        prompt:
          'Nilai koefisien restitusi (e) untuk tumbukan lenting sempurna adalah...',
        options: ['e = 0', '0 < e < 1', 'e = 1', 'e > 1'],
        correctOptionIndex: 2,
        points: 25,
        explanation: 'Tumbukan lenting sempurna didefinisikan memiliki koefisien restitusi e = 1.',
      },
      {
        id: 'post3-4',
        chapterId: 'bab-3',
        format: 'multiple-choice',
        conceptTag: 'Energi Kinetik Tumbukan',
        prompt:
          'Jika dua benda bertumbukan lenting sempurna dengan energi kinetik total awal 120 Joule, maka energi kinetik total sesudah tumbukan adalah...',
        options: ['0 Joule', '60 Joule', '120 Joule', '240 Joule'],
        correctOptionIndex: 2,
        points: 25,
        explanation:
          'Karena tidak ada energi yang terdisipasi menjadi panas atau deformasi pada e = 1, Ek_akhir = Ek_awal = 120 Joule.',
      },
    ],
  },
  {
    id: 'tugas-bab-4-5',
    chapterId: 'bab-4',
    kind: 'tugas',
    title: 'Tugas Terstruktur 2: Restitusi & Tumbukan Tidak Lenting',
    description:
      'Latihan penerapan koefisien restitusi (0 < e < 1) dan perhitungan kehilangan energi kinetik pada tumbukan tidak lenting.',
    estimatedMinutes: 15,
    passingScore: 75,
    questions: [
      {
        id: 't45-1',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Pantulan Berulang',
        prompt:
          'Sebuah bola jatuh dari ketinggian 10 m dengan koefisien restitusi lantai e = 0,5. Berapakah ketinggian pantulan pertama bola tersebut (dalam meter)?',
        equationHint: 'h₂ = e² · h₁',
        correctNumericValue: 2.5,
        numericTolerance: 0.05,
        unit: 'meter',
        points: 25,
        explanation: 'e = √(h₂/h₁) → h₂ = e² · h₁ = (0,5)² × 10 = 0,25 × 10 = 2,5 meter.',
      },
      {
        id: 't45-2',
        chapterId: 'bab-4',
        format: 'multiple-choice',
        conceptTag: 'Identifikasi Jenis Tumbukan',
        prompt:
          'Dua kereta bermassa sama (1 kg) melaju saling mendekat masing-masing 4 m/s. Setelah bertumbukan keduanya berbalik arah dengan laju masing-masing 2 m/s. Jenis tumbukan ini adalah...',
        equationHint: 'Hitung e = −(v₁′ − v₂′) / (v₁ − v₂)',
        options: [
          'Lenting sempurna (e = 1)',
          'Lenting sebagian (e = 0,5)',
          'Tidak lenting sama sekali (e = 0)',
          'Ledakan (e > 1)',
        ],
        correctOptionIndex: 1,
        points: 25,
        explanation:
          'v₁ = +4, v₂ = −4; v₁′ = −2, v₂′ = +2. Maka e = −(−2 − 2) / (4 − (−4)) = 4 / 8 = 0,5 (lenting sebagian).',
      },
      {
        id: 't45-3',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Kecepatan Akhir Menyatu',
        prompt:
          'Mobil A (1.000 kg) melaju ke timur 12 m/s menabrak mobil B (1.500 kg) yang diam lalu tersangkut bersama. Hitung kecepatan bersama kedua mobil setelah tabrakan (dalam m/s).',
        equationHint: 'v′ = (m₁v₁ + m₂v₂) / (m₁ + m₂)',
        correctNumericValue: 4.8,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 25,
        explanation: 'v′ = (1.000 × 12) / (1.000 + 1.500) = 12.000 / 2.500 = 4,8 m/s.',
      },
      {
        id: 't45-4',
        chapterId: 'bab-5',
        format: 'multiple-choice',
        conceptTag: 'Energi Hilang Maksimum',
        prompt:
          'Dua benda bermassa sama m = 2 kg bergerak saling berlawanan arah dengan laju sama 5 m/s, lalu bertumbukan tidak lenting sama sekali. Energi kinetik yang hilang akibat tumbukan adalah...',
        equationHint: 'Hitung Ek_awal total dan Ek_akhir gabungan',
        options: ['0 J', '25 J', '50 J', '100 J'],
        correctOptionIndex: 2,
        points: 25,
        explanation:
          'Ek_awal = ½(2)(5²) + ½(2)(5²) = 25 + 25 = 50 J. Karena momentum awal nol (+10 − 10 = 0), keduanya diam pasca-tumbukan (v′ = 0, Ek_akhir = 0). Jadi ΔEk = 50 J.',
      },
    ],
  },
  {
    id: 'posttest-bab-1',
    chapterId: 'bab-1',
    kind: 'posttest',
    title: 'Post-test Bab 1: Momentum & Impuls',
    description: 'Evaluasi akhir penguasaan hubungan gaya impuls, waktu kontak, dan perubahan momentum.',
    estimatedMinutes: 10,
    passingScore: 75,
    questions: [
      {
        id: 'post1-1',
        chapterId: 'bab-1',
        format: 'numeric',
        conceptTag: 'Teorema Impuls-Momentum',
        prompt:
          'Bola bermassa 0,4 kg mula-mula diam kemudian ditendang sehingga melaju 15 m/s. Hitung besar impuls yang diterima bola (dalam N·s).',
        equationHint: 'I = m(v₂ − v₁)',
        correctNumericValue: 6,
        numericTolerance: 0.1,
        unit: 'N·s',
        points: 50,
        explanation: 'I = 0,4 × (15 − 0) = 6 N·s.',
      },
      {
        id: 'post1-2',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Aplikasi Crumple Zone',
        prompt:
          'Tujuan utama penggunaan kantung udara (airbag) saat tabrakan adalah...',
        options: [
          'Mengurangi massa total pengemudi saat tumbukan',
          'Memperpanjang waktu kontak Δt untuk menurunkan gaya rata-rata F',
          'Menghilangkan momentum total kendaraan sebelum tabrakan',
          'Mengubah tumbukan menjadi lenting sempurna',
        ],
        correctOptionIndex: 1,
        points: 50,
        explanation:
          'Airbag memperpanjang selang waktu kontak Δt sehingga untuk perubahan momentum Δp yang sama, gaya benturan F = Δp/Δt menjadi jauh lebih kecil.',
      },
    ],
  },
  {
    id: 'pretest-bab-2',
    chapterId: 'bab-2',
    kind: 'pretest',
    title: 'Pre-test Bab 2: Kekekalan Momentum',
    description: 'Uji kesiapan konsep sistem terisolasi dan tanda arah vektor kecepatan.',
    estimatedMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'pre2-1',
        chapterId: 'bab-2',
        format: 'multiple-choice',
        conceptTag: 'Syarat Sistem Terisolasi',
        prompt:
          'Hukum kekekalan momentum linear berlaku pada dua benda yang bertumbukan apabila...',
        options: [
          'Kedua benda memiliki massa yang sama persis',
          'Resultan gaya eksternal pada sistem sama dengan nol',
          'Energi kinetik total selalu bertambah',
          'Kedua benda bergerak dengan arah yang sama',
        ],
        correctOptionIndex: 1,
        points: 50,
        explanation:
          'Gaya tumbukan antar benda merupakan gaya internal yang saling meniadakan, sehingga momentum total kekal bila resultan gaya eksternal nol.',
      },
      {
        id: 'pre2-2',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Recoil Senapan / Roket',
        prompt:
          'Sebuah meriam mainan bermassa 2 kg menembakkan bola bermassa 0,2 kg ke kanan dengan laju 10 m/s dari keadaan diam. Hitung besar laju tolak balik meriam ke kiri (dalam m/s, masukkan nilai positif).',
        equationHint: '0 = m_meriam·v_meriam + m_bola·v_bola',
        correctNumericValue: 1,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 50,
        explanation:
          '0 = 2·v_m + 0,2(10) → 2·v_m = −2 → v_m = −1 m/s (besar laju tolak balik 1 m/s).',
      },
    ],
  },
  {
    id: 'posttest-bab-2',
    chapterId: 'bab-2',
    kind: 'posttest',
    title: 'Post-test Bab 2: Hukum Kekekalan Momentum',
    description: 'Evaluasi akhir perhitungan momentum 1D sebelum dan sesudah tumbukan.',
    estimatedMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'post2-1',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Momentum Total 1D',
        prompt:
          'Benda A (2 kg, +5 m/s) dan Benda B (3 kg, −2 m/s) bergerak di lintasan lurus. Berapakah momentum total sistem (dalam kg·m/s)?',
        equationHint: 'p_total = m₁v₁ + m₂v₂',
        correctNumericValue: 4,
        numericTolerance: 0.1,
        unit: 'kg·m/s',
        points: 50,
        explanation: 'p_total = (2)(5) + (3)(−2) = 10 − 6 = +4 kg·m/s.',
      },
      {
        id: 'post2-2',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Kecepatan Pasca-Tumbukan',
        prompt:
          'Troli 4 kg melaju 3 m/s menumbuk troli 2 kg yang diam. Jika setelah tumbukan troli 4 kg melaju 1 m/s searah semula, tentukan kecepatan troli 2 kg (dalam m/s).',
        equationHint: 'm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′',
        correctNumericValue: 4,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 50,
        explanation: '(4)(3) + 0 = (4)(1) + 2·v₂′ → 12 = 4 + 2·v₂′ → v₂′ = 4 m/s.',
      },
    ],
  },
  {
    id: 'posttest-bab-5',
    chapterId: 'bab-5',
    kind: 'posttest',
    title: 'Post-test Bab 5: Tumbukan Tidak Lenting Sama Sekali',
    description: 'Evaluasi akhir tumbukan benda menyatu (e = 0) dan analisis kehilangan energi kinetik.',
    estimatedMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'post5-1',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Kecepatan Gabungan',
        prompt:
          'Troli A (2 kg) bergerak 6 m/s menumbuk troli B (4 kg) yang diam lalu menyatu. Berapa kecepatan gabungan keduanya setelah tumbukan (dalam m/s)?',
        equationHint: 'v′ = (m₁v₁ + m₂v₂) / (m₁ + m₂)',
        correctNumericValue: 2,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 50,
        explanation: 'v′ = (2 × 6 + 0) / (2 + 4) = 12 / 6 = 2 m/s.',
      },
      {
        id: 'post5-2',
        chapterId: 'bab-5',
        format: 'multiple-choice',
        conceptTag: 'Nilai Koefisien Restitusi',
        prompt:
          'Jika dua benda menyatu dan bergerak bersama setelah bertumbukan, berapakah nilai koefisien restitusi (e) nya?',
        options: ['e = 0', 'e = 0,5', 'e = 1', 'e tak hingga'],
        correctOptionIndex: 0,
        points: 50,
        explanation:
          'Karena v₁′ = v₂′ = v′, maka pembilang (v₁′ − v₂′) = 0 sehingga koefisien restitusi e = 0.',
      },
    ],
  },
  {
    id: 'tugas-bab-1',
    chapterId: 'bab-1',
    kind: 'tugas',
    title: 'Tugas Bab 1: Analisis Momentum & Gaya Impuls',
    description: 'Latihan soal penerapan hubungan impuls gaya rata-rata dan perubahan momentum.',
    estimatedMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'tb1-1',
        chapterId: 'bab-1',
        format: 'numeric',
        conceptTag: 'Gaya Rata-rata Impuls',
        prompt:
          'Bola bermassa 0,5 kg melaju 10 m/s menabrak dinding dan berhenti dalam waktu 0,05 detik. Berapakah besar gaya rata-rata dinding pada bola (dalam Newton)?',
        equationHint: 'F = |m(v₂ − v₁)| / Δt',
        correctNumericValue: 100,
        numericTolerance: 1,
        unit: 'N',
        points: 50,
        explanation: 'Δp = 0,5 × |0 − 10| = 5 kg·m/s. F = 5 / 0,05 = 100 N.',
      },
      {
        id: 'tb1-2',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Luas Grafik F–t',
        prompt:
          'Besaran fisika yang nilainya sama dengan luas daerah di bawah kurva Gaya (F) terhadap Waktu (t) adalah...',
        options: ['Daya mekanik', 'Impuls', 'Energi potensial', 'Percepatan'],
        correctOptionIndex: 1,
        points: 50,
        explanation: 'Secara integral, impuls I = ∫ F dt merupakan luas area di bawah grafik F–t.',
      },
    ],
  },
  {
    id: 'tugas-bab-2',
    chapterId: 'bab-2',
    kind: 'tugas',
    title: 'Tugas Bab 2: Penerapan Kekekalan Momentum',
    description: 'Latihan perhitungan kecepatan pasca-tumbukan dengan memperhatikan arah vektor (±).',
    estimatedMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'tb2-1',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Tumbukan 1D Berlawanan Arah',
        prompt:
          'Benda A (2 kg) bergerak ke kanan 5 m/s menumbuk benda B (1 kg) yang bergerak ke kiri 4 m/s. Jika setelah tumbukan benda A bergerak ke kanan 1 m/s, berapa kecepatan benda B setelah tumbukan (m/s)?',
        equationHint: 'm₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′',
        correctNumericValue: 4,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 50,
        explanation: '(2)(5) + (1)(−4) = (2)(1) + 1·v₂′ → 6 = 2 + v₂′ → v₂′ = +4 m/s.',
      },
      {
        id: 'tb2-2',
        chapterId: 'bab-2',
        format: 'multiple-choice',
        conceptTag: 'Sifat Vektor Momentum',
        prompt:
          'Dua benda bermassa sama bergerak saling mendekat dengan kelajuan sama 3 m/s. Momentum total sistem sebelum tumbukan adalah...',
        options: ['6 kg·m/s', '3 kg·m/s', '0 kg·m/s', '9 kg·m/s'],
        correctOptionIndex: 2,
        points: 50,
        explanation: 'Karena arah berlawanan (+m·3 dan −m·3), jumlah vektor momentum totalnya adalah 0.',
      },
    ],
  },
  {
    id: 'pretest-bab-3',
    chapterId: 'bab-3',
    kind: 'pretest',
    title: 'Pre-test Bab 3: Tumbukan Lenting Sempurna',
    description: 'Uji pemahaman awal mengenai syarat tumbukan elastis sempurna dan kekekalan energi.',
    estimatedMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'pre3-1',
        chapterId: 'bab-3',
        format: 'multiple-choice',
        conceptTag: 'Ciri Tumbukan Elastis',
        prompt:
          'Pada tumbukan lenting sempurna dua benda bermassa identik di mana benda kedua mula-mula diam, setelah tumbukan akan terjadi...',
        options: [
          'Kedua benda menempel dan berhenti',
          'Benda pertama berhenti, benda kedua bergerak dengan kecepatan awal benda pertama',
          'Kedua benda bergerak bersama dengan setengah kecepatan awal',
          'Benda pertama terpental dua kali lebih cepat',
        ],
        correctOptionIndex: 1,
        points: 50,
        explanation: 'Massa identik dengan e = 1 menyebabkan pertukaran kecepatan sempurna: v₁′ = 0 dan v₂′ = v₁.',
      },
      {
        id: 'pre3-2',
        chapterId: 'bab-3',
        format: 'numeric',
        conceptTag: 'Nilai Koefisien Restitusi',
        prompt: 'Tuliskan nilai koefisien restitusi (e) untuk tumbukan lenting sempurna.',
        correctNumericValue: 1,
        numericTolerance: 0.01,
        unit: '(tanpa satuan)',
        points: 50,
        explanation: 'Secara definisi, tumbukan lenting sempurna memiliki koefisien restitusi e = 1.',
      },
    ],
  },
  {
    id: 'pretest-bab-4',
    chapterId: 'bab-4',
    kind: 'pretest',
    title: 'Pre-test Bab 4: Tumbukan Lenting Sebagian',
    description: 'Penjajakan awal rentang koefisien restitusi dan pantulan benda jatuh.',
    estimatedMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'pre4-1',
        chapterId: 'bab-4',
        format: 'multiple-choice',
        conceptTag: 'Rentang Restitusi',
        prompt: 'Rentang nilai koefisien restitusi (e) pada tumbukan lenting sebagian adalah...',
        options: ['e < 0', 'e = 0', '0 < e < 1', 'e = 1'],
        correctOptionIndex: 2,
        points: 50,
        explanation: 'Tumbukan lenting sebagian berada di antara tidak lenting (0) dan lenting sempurna (1).',
      },
      {
        id: 'pre4-2',
        chapterId: 'bab-4',
        format: 'multiple-choice',
        conceptTag: 'Disipasi Energi Nyata',
        prompt: 'Mengapa bola bekel yang dijatuhkan ke lantai selalu memantul lebih rendah dari tinggi awalnya?',
        options: [
          'Karena momentum total sistem tidak berlaku',
          'Sebagian energi mekanik berubah menjadi panas dan bunyi saat kontak',
          'Karena massa bola berkurang saat menyentuh lantai',
          'Karena percepatan gravitasi meningkat',
        ],
        correctOptionIndex: 1,
        points: 50,
        explanation: 'Pada tumbukan nyata (0 < e < 1), sebagian energi kinetik terdisipasi menjadi kalor, bunyi, dan deformasi.',
      },
    ],
  },
  {
    id: 'posttest-bab-4',
    chapterId: 'bab-4',
    kind: 'posttest',
    title: 'Post-test Bab 4: Tumbukan Lenting Sebagian',
    description: 'Evaluasi akhir perhitungan koefisien restitusi pantulan dan energi yang hilang.',
    estimatedMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'post4-1',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Koefisien Restitusi Pantulan',
        prompt:
          'Bola dijatuhkan dari ketinggian 9 meter dan memantul pertama kali setinggi 4 meter. Hitung koefisien restitusi e (desimal dua angka).',
        equationHint: 'e = √(h₂ / h₁)',
        correctNumericValue: 0.67,
        numericTolerance: 0.03,
        unit: '(tanpa satuan)',
        points: 50,
        explanation: 'e = √(4 / 9) = 2 / 3 ≈ 0,67.',
      },
      {
        id: 'post4-2',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Tinggi Pantulan Kedua',
        prompt:
          'Bola jatuh dari ketinggian 16 meter pada lantai dengan koefisien restitusi e = 0,5. Berapakah tinggi pantulan pertama (dalam meter)?',
        equationHint: 'h₂ = e² · h₁',
        correctNumericValue: 4,
        numericTolerance: 0.1,
        unit: 'meter',
        points: 50,
        explanation: 'h₂ = (0,5)² × 16 = 0,25 × 16 = 4 meter.',
      },
    ],
  },
  {
    id: 'pretest-bab-5',
    chapterId: 'bab-5',
    kind: 'pretest',
    title: 'Pre-test Bab 5: Tumbukan Tidak Lenting Sama Sekali',
    description: 'Evaluasi awal ciri khas benda menyatu pasca-tumbukan.',
    estimatedMinutes: 10,
    passingScore: 70,
    questions: [
      {
        id: 'pre5-1',
        chapterId: 'bab-5',
        format: 'multiple-choice',
        conceptTag: 'Ciri Benda Menyatu',
        prompt: 'Ciri utama tumbukan tidak lenting sama sekali adalah...',
        options: [
          'Energi kinetik total kekal',
          'Kedua benda bergerak bersama dengan kecepatan yang sama setelah tumbukan',
          'Kecepatan relatif sesudah tumbukan lebih besar dari sebelum tumbukan',
          'Koefisien restitusi bernilai 1',
        ],
        correctOptionIndex: 1,
        points: 50,
        explanation: 'Pada tumbukan tidak lenting sama sekali (e = 0), v₁′ = v₂′ = v′.',
      },
      {
        id: 'pre5-2',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Kecepatan Gabungan Sederhana',
        prompt:
          'Benda 3 kg bergerak 4 m/s menumbuk benda 1 kg yang diam lalu menempel bersama. Hitung kecepatan bersama keduanya (m/s).',
        equationHint: 'v′ = m₁v₁ / (m₁ + m₂)',
        correctNumericValue: 3,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 50,
        explanation: 'v′ = (3 × 4) / (3 + 1) = 12 / 4 = 3 m/s.',
      },
    ],
  },
  {
    id: 'tugas-bab-5',
    chapterId: 'bab-5',
    kind: 'tugas',
    title: 'Tugas Bab 5: Bandul Balistik & Energi Hilang',
    description: 'Latihan perhitungan kecepatan gabungan dan energi kinetik yang hilang pada e = 0.',
    estimatedMinutes: 12,
    passingScore: 75,
    questions: [
      {
        id: 'tb5-1',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Kecepatan Gabungan Dua Benda Bergerak',
        prompt:
          'Kereta A (2 kg) melaju ke kanan 5 m/s menumbuk kereta B (2 kg) yang melaju ke kiri 1 m/s hingga tersambung bersama. Hitung kecepatan gabungan keduanya setelah tumbukan (m/s).',
        equationHint: 'v′ = (m₁v₁ + m₂v₂) / (m₁ + m₂)',
        correctNumericValue: 2,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 50,
        explanation: 'v′ = [(2)(5) + (2)(−1)] / (2 + 2) = 8 / 4 = 2 m/s.',
      },
      {
        id: 'tb5-2',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Energi Terdisipasi',
        prompt:
          'Benda 2 kg bergerak 4 m/s menumbuk benda 2 kg yang diam lalu menyatu. Hitung besar energi kinetik yang hilang (dalam Joule).',
        equationHint: 'ΔEk = Ek_awal − Ek_akhir',
        correctNumericValue: 8,
        numericTolerance: 0.1,
        unit: 'Joule',
        points: 50,
        explanation: 'Ek_awal = ½(2)(4²) = 16 J. v′ = 4/2 = 2 m/s → Ek_akhir = ½(4)(2²) = 8 J. Jadi ΔEk = 16 − 8 = 8 J.',
      },
    ],
  },
  {
    id: 'tantangan-bab-1',
    chapterId: 'bab-1',
    kind: 'tantangan',
    title: 'Latihan Tantangan Bab 1: Grafik Impuls & Perubahan Vektor',
    description:
      'Soal tingkat lanjut Bab 1: analisis luas kurva gaya-waktu F–t, tumbukan berbalik arah, impuls bertahap, dan pantulan sudut.',
    estimatedMinutes: 18,
    passingScore: 75,
    questions: [
      {
        id: 'tb1-ch1',
        chapterId: 'bab-1',
        format: 'numeric',
        conceptTag: 'Grafik Gaya-Waktu F–t',
        prompt:
          'Gaya dorong berbentuk segitiga bekerja pada bola bermassa 0,5 kg yang mula-mula diam: naik linear dari 0 N (t = 0 s) ke puncak 80 N (t = 0,10 s), lalu turun linear ke 0 N pada t = 0,25 s. Hitung kelajuan akhir bola (dalam m/s).',
        equationHint: 'I = Luas Segitiga (½ · alas · tinggi) = m · Δv',
        correctNumericValue: 20,
        numericTolerance: 0.2,
        unit: 'm/s',
        points: 25,
        explanation:
          'Luas di bawah kurva F–t adalah I = ½ × 0,25 s × 80 N = 10 N·s. Karena bola mula-mula diam, v = I / m = 10 / 0,5 = 20 m/s.',
      },
      {
        id: 'tb1-ch2',
        chapterId: 'bab-1',
        format: 'numeric',
        conceptTag: 'Gaya Impuls Berbalik Arah',
        prompt:
          'Bola tenis bermassa 0,1 kg bergerak mendatar dengan laju 20 m/s mengenai raket dan terpental berbalik arah berlawanan dengan laju 30 m/s. Jika waktu kontak berlangsung 0,02 detik, hitung besar gaya rata-rata raket pada bola (dalam Newton).',
        equationHint: 'F = |m(v₂ − v₁)| / Δt dengan v₁ = +20 m/s dan v₂ = −30 m/s',
        correctNumericValue: 250,
        numericTolerance: 2,
        unit: 'N',
        points: 25,
        explanation:
          'Δp = 0,1 × (−30 − 20) = −5 kg·m/s. Besar gaya rata-rata F = |Δp| / Δt = 5 / 0,02 = 250 N.',
      },
      {
        id: 'tb1-ch3',
        chapterId: 'bab-1',
        format: 'numeric',
        conceptTag: 'Impuls Bertahap',
        prompt:
          'Sebuah troli bermassa 2 kg mula-mula bergerak 3 m/s lalu dikenai gaya searah gerak sebesar 12 N selama 1,5 detik, diikuti gaya 8 N selama 1,0 detik. Hitung kecepatan akhir troli (dalam m/s).',
        equationHint: 'I_total = F₁Δt₁ + F₂Δt₂ = m(v_akhir − v_awal)',
        correctNumericValue: 16,
        numericTolerance: 0.2,
        unit: 'm/s',
        points: 25,
        explanation:
          'I_total = (12 × 1,5) + (8 × 1,0) = 18 + 8 = 26 N·s. Momentum akhir = 2(3) + 26 = 32 kg·m/s → v_akhir = 32 / 2 = 16 m/s.',
      },
      {
        id: 'tb1-ch4',
        chapterId: 'bab-1',
        format: 'multiple-choice',
        conceptTag: 'Impuls Pantulan Bersudut',
        prompt:
          'Bola bermassa 1 kg menumbuk dinding licin dengan kelajuan 10 m/s pada sudut datang 60° terhadap garis normal dinding dan memantul simetris dengan kelajuan sama 10 m/s. Besar impuls yang diterima bola adalah...',
        equationHint: 'Hanya komponen tegak lurus dinding yang berubah arah: I = 2·m·v·cos 60°',
        options: ['5 N·s', '10 N·s', '17,3 N·s', '20 N·s'],
        correctOptionIndex: 1,
        points: 25,
        explanation:
          'Komponen kecepatan sejajar dinding tetap sama, sedangkan komponen normal berbalik arah. Maka I = 2 × 1 × 10 × cos 60° = 20 × 0,5 = 10 N·s.',
      },
    ],
  },
  {
    id: 'tantangan-bab-2',
    chapterId: 'bab-2',
    kind: 'tantangan',
    title: 'Latihan Tantangan Bab 2: Pemisahan Sistem, Recoil & Beban Jatuh',
    description:
      'Soal tingkat lanjut Bab 2: analisis kekekalan momentum pada sistem terpisah, pelompatan dari perahu bergerak, penambahan massa vertikal, dan rasio energi ledakan.',
    estimatedMinutes: 18,
    passingScore: 75,
    questions: [
      {
        id: 'tb2-ch1',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Pemisahan Sistem Bergerak',
        prompt:
          'Sebuah kapsul bermassa total 5 kg melaju ke kanan 6 m/s lalu melepaskan bagian belakangnya (2 kg) sehingga bagian 2 kg tersebut tepat berhenti (0 m/s). Hitung kecepatan bagian depan (3 kg) sesudah terpisah (dalam m/s).',
        equationHint: 'm_total · v_awal = m_belakang · v_belakang′ + m_depan · v_depan′',
        correctNumericValue: 10,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 25,
        explanation:
          'Momentum awal sistem = 5 × 6 = 30 kg·m/s. Setelah terpisah: 30 = 2(0) + 3·v_depan′ → v_depan′ = 30 / 3 = 10 m/s.',
      },
      {
        id: 'tb2-ch2',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Sistem Perahu & Penumpang',
        prompt:
          'Perahu bermassa 120 kg dan seorang mahasiswa bermassa 60 kg meluncur tenang ke kanan pada laju 2 m/s. Mahasiswa kemudian melompat ke belakang sehingga kecepatannya relatif terhadap air menjadi −2 m/s. Hitung kecepatan perahu sekarang (dalam m/s).',
        equationHint: '(m_p + m_m)v_awal = m_p·v_p′ + m_m·v_m′',
        correctNumericValue: 4,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 25,
        explanation:
          'p_awal = (120 + 60)(2) = 360 kg·m/s. 360 = 120·v_p′ + 60(−2) = 120·v_p′ − 120 → 120·v_p′ = 480 → v_p′ = 4 m/s ke kanan.',
      },
      {
        id: 'tb2-ch3',
        chapterId: 'bab-2',
        format: 'numeric',
        conceptTag: 'Penambahan Massa Vertikal',
        prompt:
          'Kereta terbuka bermassa 8 kg meluncur di rel datar tanpa gesekan pada laju 5 m/s. Dari atas dijatuhkan karung pasir bermassa 2 kg secara vertikal (kecepatan mendatar awal = 0) tepat masuk ke dalam kereta. Hitung kelajuan kereta bersama karung sekarang (dalam m/s).',
        equationHint: 'Kekekalan momentum sumbu horizontal: m₁v₁ + 0 = (m₁ + m₂)v′',
        correctNumericValue: 4,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 25,
        explanation:
          'Momentum mendatar awal karung nol, sehingga (8)(5) = (8 + 2)v′ → 40 = 10v′ → v′ = 4 m/s.',
      },
      {
        id: 'tb2-ch4',
        chapterId: 'bab-2',
        format: 'multiple-choice',
        conceptTag: 'Rasio Energi Kinetik Ledakan',
        prompt:
          'Sebuah benda diam meledak menjadi dua fragmen bermassa m₁ = 2 kg dan m₂ = 6 kg yang terpental berlawanan arah. Perbandingan energi kinetik Ek₁ : Ek₂ setelah ledakan adalah...',
        equationHint: 'Karena p_awal = 0, maka |p₁| = |p₂| dan Ek = p² / (2m)',
        options: ['1 : 3', '1 : 9', '3 : 1', '9 : 1'],
        correctOptionIndex: 2,
        points: 25,
        explanation:
          'Besar momentum kedua fragmen sama (|p₁| = |p₂|). Karena Ek = p²/(2m), energi kinetik berbanding terbalik dengan massa: Ek₁ : Ek₂ = m₂ : m₁ = 6 : 2 = 3 : 1.',
      },
    ],
  },
  {
    id: 'tantangan-bab-3',
    chapterId: 'bab-3',
    kind: 'tantangan',
    title: 'Latihan Tantangan Bab 3: Tumbukan Berantai & Transfer Energi Elastis',
    description:
      'Soal tingkat lanjut Bab 3: tumbukan tiga benda berurutan, fraksi transfer energi elastis, tumbukan lenting dua benda bergerak berlawanan, dan penentuan massa target.',
    estimatedMinutes: 20,
    passingScore: 75,
    questions: [
      {
        id: 'tb3-ch1',
        chapterId: 'bab-3',
        format: 'numeric',
        conceptTag: 'Tumbukan Berantai 3 Benda',
        prompt:
          'Di atas rel udara licin berjajar m₁ = 1 kg, m₂ = 2 kg (diam), dan m₃ = 2 kg (diam). Troli m₁ melaju 6 m/s menumbuk m₂ secara lenting sempurna (e = 1), lalu m₂ menumbuk m₃ secara tidak lenting sama sekali (e = 0) dan menyatu. Tentukan kecepatan akhir gabungan (m₂ + m₃) dalam m/s.',
        equationHint: 'Tahap 1: v₂′ = 2m₁v₁/(m₁+m₂). Tahap 2: v_gab = m₂v₂′/(m₂+m₃)',
        correctNumericValue: 2,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 25,
        explanation:
          'Tumbukan 1 (e = 1): v₂′ = (2 × 1 × 6) / (1 + 2) = 4 m/s. Tumbukan 2 (e = 0): v_gab = (2 × 4) / (2 + 2) = 2 m/s.',
      },
      {
        id: 'tb3-ch2',
        chapterId: 'bab-3',
        format: 'multiple-choice',
        conceptTag: 'Fraksi Transfer Energi Elastis',
        prompt:
          'Benda bermassa m bergerak dengan energi kinetik E₀ menumbuk sentral secara lenting sempurna benda bermassa 3m yang diam. Berapa persen energi kinetik awal yang berpindah ke benda 3m?',
        equationHint: 'v_B′ = 2m₁v₁ / (m₁ + m₂), lalu hitung ½(3m)(v_B′)²',
        options: ['25%', '50%', '75%', '100%'],
        correctOptionIndex: 2,
        points: 25,
        explanation:
          'v_B′ = 2m·v₁ / (m + 3m) = ½v₁. Maka Ek_B′ = ½(3m)(½v₁)² = ¾(½mv₁²) = ¾E₀ = 75%.',
      },
      {
        id: 'tb3-ch3',
        chapterId: 'bab-3',
        format: 'numeric',
        conceptTag: 'Tumbukan Elastis Dua Benda Bergerak',
        prompt:
          'Bola A (2 kg, v₁ = +6 m/s) menumbuk sentral secara lenting sempurna (e = 1) bola B (4 kg, v₂ = −3 m/s). Hitung kecepatan bola A (v₁′) setelah tumbukan (sertakan tanda minus jika ke kiri, dalam m/s).',
        equationHint: 'v₁′ = [(m₁ − m₂)v₁ + 2m₂v₂] / (m₁ + m₂)',
        correctNumericValue: -6,
        numericTolerance: 0.1,
        unit: 'm/s',
        points: 25,
        explanation:
          'Momentum total awal = 2(6) + 4(−3) = 0. Karena momentum pusat massa nol dan e = 1, kedua bola berbalik dengan kelajuan tetap: v₁′ = −6 m/s dan v₂′ = +3 m/s.',
      },
      {
        id: 'tb3-ch4',
        chapterId: 'bab-3',
        format: 'numeric',
        conceptTag: 'Menentukan Massa Target Elastis',
        prompt:
          'Partikel bermassa 2 kg melaju +10 m/s menumbuk sentral lenting sempurna target diam bermassa M, lalu partikel 2 kg terpental balik dengan kecepatan −2 m/s. Hitung besar massa M (dalam kg).',
        equationHint: 'Dari e = 1: v₂′ = v₁ + v₁′. Lalu gunakan m₁v₁ = m₁v₁′ + M·v₂′',
        correctNumericValue: 3,
        numericTolerance: 0.05,
        unit: 'kg',
        points: 25,
        explanation:
          'Dari e = 1: v₂′ − (−2) = 10 − 0 → v₂′ = 8 m/s. Dari kekekalan momentum: 2(10) = 2(−2) + M(8) → 24 = 8M → M = 3 kg.',
      },
    ],
  },
  {
    id: 'tantangan-bab-4',
    chapterId: 'bab-4',
    kind: 'tantangan',
    title: 'Latihan Tantangan Bab 4: Pantulan Beruntun, Lintasan Total & Restitusi',
    description:
      'Soal tingkat lanjut Bab 4: deret pantulan bola, persentase energi terdisipasi, total jarak tempuh pantulan tak hingga, dan tumbukan dua benda dengan 0 < e < 1.',
    estimatedMinutes: 20,
    passingScore: 75,
    questions: [
      {
        id: 'tb4-ch1',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Pantulan Beruntun ke-n',
        prompt:
          'Bola dijatuhkan dari ketinggian h₁ = 16 meter pada lantai dengan koefisien restitusi e = 0,5. Hitung ketinggian maksimum pantulan KEDUA (h₃) dalam meter.',
        equationHint: 'h₂ = e² · h₁ dan h₃ = e² · h₂ = e⁴ · h₁',
        correctNumericValue: 1,
        numericTolerance: 0.05,
        unit: 'meter',
        points: 25,
        explanation:
          'Pantulan pertama h₂ = (0,5)² × 16 = 4 meter. Pantulan kedua h₃ = (0,5)² × 4 = 1 meter.',
      },
      {
        id: 'tb4-ch2',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Persentase Energi Hilang Pantulan',
        prompt:
          'Sebuah bola jatuh bebas memantul di lantai dengan koefisien restitusi e = 0,6. Berapa persen (%) energi mekanik yang hilang dalam SATU kali pantulan?',
        equationHint: 'Ek_sisa / Ek_awal = h₂ / h₁ = e²',
        correctNumericValue: 64,
        numericTolerance: 0.5,
        unit: '%',
        points: 25,
        explanation:
          'Rasio energi tersisa adalah e² = (0,6)² = 0,36 (36%). Maka energi yang terdisipasi adalah 100% − 36% = 64%.',
      },
      {
        id: 'tb4-ch3',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Panjang Lintasan Pantulan Total',
        prompt:
          'Bola dijatuhkan dari ketinggian h₁ = 9 meter ke lantai datar dengan koefisien restitusi e = 0,5. Hitung panjang lintasan vertikal TOTAL yang ditempuh bola hingga berhenti memantul (dalam meter).',
        equationHint: 'S_total = h₁ · (1 + e²) / (1 − e²)',
        correctNumericValue: 15,
        numericTolerance: 0.2,
        unit: 'meter',
        points: 25,
        explanation:
          'Dengan deret geometri tak hingga: S_total = h₁·(1 + e²)/(1 − e²) = 9 × (1 + 0,25) / (1 − 0,25) = 9 × (1,25 / 0,75) = 15 meter.',
      },
      {
        id: 'tb4-ch4',
        chapterId: 'bab-4',
        format: 'numeric',
        conceptTag: 'Tumbukan Lenting Sebagian 1D',
        prompt:
          'Troli A (2 kg) melaju +6 m/s menumbuk troli B (4 kg) yang mula-mula diam dengan koefisien restitusi e = 0,5. Hitung kecepatan troli B (v₂′) sesudah tumbukan (dalam m/s).',
        equationHint: 'v₂′ = [m₁v₁ + m₂v₂ + m₁·e(v₁ − v₂)] / (m₁ + m₂)',
        correctNumericValue: 3,
        numericTolerance: 0.05,
        unit: 'm/s',
        points: 25,
        explanation:
          'v₂′ = [2(6) + 0 + 2(0,5)(6 − 0)] / (2 + 4) = (12 + 6) / 6 = 3 m/s (sedangkan v₁′ = 0 m/s).',
      },
    ],
  },
  {
    id: 'tantangan-bab-5',
    chapterId: 'bab-5',
    kind: 'tantangan',
    title: 'Latihan Tantangan Bab 5: Bandul Balistik, Bidang Miring & Energi Hilang',
    description:
      'Soal tingkat lanjut Bab 5: integrasi tumbukan tidak lenting sama sekali dengan energi potensial gravitasi pada bandul balistik, bidang miring licin, dan disipasi maksimum.',
    estimatedMinutes: 20,
    passingScore: 75,
    questions: [
      {
        id: 'tb5-ch1',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Bandul Balistik',
        prompt:
          'Peluru 0,02 kg ditembakkan mendatar ke balok kayu 1,98 kg yang tergantung diam lalu bersarang di dalamnya. Keduanya berayun naik hingga tinggi maksimum h = 0,20 m (g = 10 m/s²). Hitung kelajuan peluru sebelum mengenai balok (dalam m/s).',
        equationHint: 'v′ = √(2gh), kemudian m_p · v_p = (m_p + m_b) · v′',
        correctNumericValue: 200,
        numericTolerance: 2,
        unit: 'm/s',
        points: 25,
        explanation:
          'Dari kekekalan energi ayunan: v′ = √(2 × 10 × 0,20) = √4 = 2 m/s. Dari kekekalan momentum: 0,02·v_p = (0,02 + 1,98)(2) = 4 → v_p = 200 m/s.',
      },
      {
        id: 'tb5-ch2',
        chapterId: 'bab-5',
        format: 'multiple-choice',
        conceptTag: 'Rasio Energi Tidak Lenting',
        prompt:
          'Benda bermassa m₁ menumbuk tidak lenting sama sekali (e = 0) benda bermassa m₂ yang mula-mula diam. Rasio energi kinetik akhir terhadap awal (Ek_akhir / Ek_awal) adalah...',
        equationHint: 'Ek_akhir = ½(m₁ + m₂)[m₁v₁ / (m₁ + m₂)]²',
        options: [
          'm₂ / (m₁ + m₂)',
          'm₁ / (m₁ + m₂)',
          '(m₁ / m₂)²',
          'm₁m₂ / (m₁ + m₂)²',
        ],
        correctOptionIndex: 1,
        points: 25,
        explanation:
          'Ek_akhir = ½(m₁ + m₂)·[m₁v₁/(m₁ + m₂)]² = [m₁ / (m₁ + m₂)] · (½m₁v₁²) = [m₁ / (m₁ + m₂)] · Ek_awal.',
      },
      {
        id: 'tb5-ch3',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Tumbukan Menempel Menaiki Bidang Miring',
        prompt:
          'Balok A (2 kg) bergerak 10 m/s menumbuk balok B (3 kg) yang diam di lantai licin lalu keduanya menempel dan meluncur menaiki bidang miring licin (g = 10 m/s²). Hitung ketinggian maksimum yang dicapai gabungan balok (dalam meter).',
        equationHint: 'v′ = m₁v₁/(m₁+m₂), lalu h_maks = v′² / (2g)',
        correctNumericValue: 0.8,
        numericTolerance: 0.03,
        unit: 'meter',
        points: 25,
        explanation:
          'Kecepatan gabungan v′ = (2 × 10) / (2 + 3) = 4 m/s. Menggunakan kekekalan energi mekanik di bidang miring: h_maks = v′²/(2g) = 16 / 20 = 0,8 meter.',
      },
      {
        id: 'tb5-ch4',
        chapterId: 'bab-5',
        format: 'numeric',
        conceptTag: 'Disipasi Energi Dua Benda Berlawanan',
        prompt:
          'Kereta A (3 kg) bergerak ke kanan 6 m/s menumbuk kereta B (1 kg) yang bergerak ke kiri 2 m/s, lalu keduanya tersambung menyatu (e = 0). Hitung besar energi kinetik yang hilang akibat tumbukan (dalam Joule).',
        equationHint: 'ΔEk = ½·[m₁m₂/(m₁+m₂)]·(v₁ − v₂)²',
        correctNumericValue: 24,
        numericTolerance: 0.3,
        unit: 'Joule',
        points: 25,
        explanation:
          'v′ = [3(6) + 1(−2)] / 4 = 16 / 4 = 4 m/s. Ek_awal = ½(3)(36) + ½(1)(4) = 56 J; Ek_akhir = ½(4)(16) = 32 J. Jadi ΔEk = 56 − 32 = 24 Joule.',
      },
    ],
  },
];

export const INITIAL_STAGE_PROGRESS: Record<string, ChapterStageProgress> = {
  'bab-1': {
    mediaCompleted: true,
    pretestCompleted: true,
    moduleCompleted: true,
    tugasCompleted: true,
    posttestCompleted: true,
  },
  'bab-2': {
    mediaCompleted: true,
    pretestCompleted: true,
    moduleCompleted: true,
    tugasCompleted: true,
    posttestCompleted: false,
  },
  'bab-3': {
    mediaCompleted: true,
    pretestCompleted: true,
    moduleCompleted: true,
    tugasCompleted: false,
    posttestCompleted: false,
  },
  'bab-4': {
    mediaCompleted: true,
    pretestCompleted: false,
    moduleCompleted: false,
    tugasCompleted: false,
    posttestCompleted: false,
  },
  'bab-5': {
    mediaCompleted: false,
    pretestCompleted: false,
    moduleCompleted: false,
    tugasCompleted: false,
    posttestCompleted: false,
  },
};

export const INITIAL_ATTEMPTS: TaskAttempt[] = [
  {
    id: 'att-1',
    taskId: 'pretest-bab-1',
    chapterId: 'bab-1',
    kind: 'pretest',
    taskTitle: 'Pre-test Bab 1: Momentum & Impuls',
    submittedAt: '2026-11-10T09:15:00',
    score: 75,
    correctCount: 3,
    totalQuestions: 4,
    durationSeconds: 380,
    details: [
      { questionId: 'pre1-1', selectedOptionIndex: 2, isCorrect: true, earnedPoints: 25, maxPoints: 25 },
      { questionId: 'pre1-2', selectedOptionIndex: 1, isCorrect: true, earnedPoints: 25, maxPoints: 25 },
      { questionId: 'pre1-3', numericInput: '10', isCorrect: true, earnedPoints: 25, maxPoints: 25 },
      { questionId: 'pre1-4', selectedOptionIndex: 1, isCorrect: false, earnedPoints: 0, maxPoints: 25 },
    ],
    lecturerFeedback:
      'Pemahaman awal tentang besaran impuls sudah kuat. Perhatikan konvensi tanda positif-negatif saat menghitung perubahan momentum benda yang memantul.',
    strengthNote: 'Tepat dalam konsep perpanjangan waktu kontak Δt.',
    improvementNote: 'Tinjau kembali soal no. 4 tentang arah vektor kecepatan pantul.',
  },
  {
    id: 'att-2',
    taskId: 'tugas-komprehensif-tumbukan',
    chapterId: 'bab-2',
    kind: 'tugas',
    taskTitle: 'Latihan Diagnostik: Kekekalan Momentum (Bab 2)',
    submittedAt: '2026-11-12T14:30:00',
    score: 83,
    correctCount: 5,
    totalQuestions: 6,
    durationSeconds: 740,
    details: [
      { questionId: 'tk-1', selectedOptionIndex: 2, isCorrect: true, earnedPoints: 15, maxPoints: 15 },
      { questionId: 'tk-2', numericInput: '6', isCorrect: true, earnedPoints: 15, maxPoints: 15 },
      { questionId: 'tk-3', selectedOptionIndex: 0, isCorrect: true, earnedPoints: 15, maxPoints: 15 },
      { questionId: 'tk-4', numericInput: '0.8', isCorrect: true, earnedPoints: 15, maxPoints: 15 },
      { questionId: 'tk-5', selectedOptionIndex: 1, isCorrect: true, earnedPoints: 20, maxPoints: 20 },
      { questionId: 'tk-6', selectedOptionIndex: 0, isCorrect: false, earnedPoints: 0, maxPoints: 20 },
    ],
    lecturerFeedback:
      'Kemajuan sangat baik pada perhitungan numerik kekekalan momentum dan koefisien restitusi. Tinggal memantapkan pemahaman konseptual disipasi energi.',
    strengthNote: 'Akurasi hitung kecepatan pasca-tumbukan mencapai 100%.',
    improvementNote: 'Review perbedaan syarat kekekalan momentum vs energi kinetik.',
  },
  {
    id: 'att-3',
    taskId: 'posttest-bab-3',
    chapterId: 'bab-3',
    kind: 'posttest',
    taskTitle: 'Post-test Bab 3: Tumbukan Lenting Sempurna (Percobaan 1)',
    submittedAt: '2026-11-14T10:45:00',
    score: 75,
    correctCount: 3,
    totalQuestions: 4,
    durationSeconds: 495,
    details: [
      { questionId: 'post3-1', selectedOptionIndex: 1, isCorrect: true, earnedPoints: 25, maxPoints: 25 },
      { questionId: 'post3-2', numericInput: '3', isCorrect: false, earnedPoints: 0, maxPoints: 25 },
      { questionId: 'post3-3', selectedOptionIndex: 2, isCorrect: true, earnedPoints: 25, maxPoints: 25 },
      { questionId: 'post3-4', selectedOptionIndex: 2, isCorrect: true, earnedPoints: 25, maxPoints: 25 },
    ],
    lecturerFeedback:
      'Sudah memenuhi batas kelulusan 75, namun masih keliru pada soal perhitungan dua benda bermassa berbeda. Coba simulasikan kasus m₁ ≠ m₂ di lab virtual lalu kerjakan ulang jika ingin meningkatkan nilai.',
    strengthNote: 'Konsep kekekalan Ek dan nilai e = 1 dikuasai dengan baik.',
    improvementNote: 'Latih substitusi tanda negatif pada v₁′ di persamaan e = −(v₁′ − v₂′)/(v₁ − v₂).',
  },
];

export const INITIAL_REFLECTIONS: StudentReflection[] = [
  {
    id: 'ref-1',
    chapterId: 'bab-3',
    author: 'Amanda Asti Vania',
    message:
      'Saya sempat bingung tanda minus pada rumus koefisien restitusi ketika benda 1 memantul ke kiri. Setelah mencoba simulasi tumbukan dengan kecepatan berlawanan, konsep vektornya jauh lebih jelas.',
    createdAt: '2026-11-14T11:10:00',
    lecturerReply:
      'Bagus sekali Amanda! Selalu tetapkan arah kanan sebagai (+) dan kiri sebagai (−) sebelum memasukkan angka ke persamaan e maupun momentum.',
  },
];
