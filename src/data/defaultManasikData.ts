import { ManasikStep, QuizQuestion } from '../types';

export const DEFAULT_MANASIK_STEPS: ManasikStep[] = [
  // ===================== UMROH =====================
  {
    id: 'umroh-1-ihram',
    category: 'umroh',
    stepNumber: 1,
    title: 'Ihram & Niat Umroh dari Miqat',
    arabicTitle: 'الإِحْرَامُ وَالنِّيَّةُ مِنَ الْمِيقَاتِ',
    statusType: 'rukun',
    location: 'Miqat (Bir Ali / Bandara King Abdul Aziz / Qarnul Manazil)',
    dayOrTime: 'Sebelum melintasi batas Miqat',
    shortDesc: 'Mandi sunnah, mengenakan pakaian ihram, shalat sunnah ihram, dan berniat umroh.',
    fullDesc: 'Ihram adalah keadaan suci seseorang yang berniat menunaikan umroh atau haji. Jamaah mandi sunnah, memakai wewangian di badan (sebelum niat), mengenakan dua lembar kain putih tanpa jahitan bagi pria, dan pakaian menutup aurat biasa bagi wanita, lalu melafadzkan niat umroh di Miqat.',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-niat-umroh',
        title: 'Lafadz Niat Umroh',
        arabic: 'لَبَّيْكَ اللَّهُمَّ عُمْرَةً',
        latin: 'Labbaikallahumma \'umratan',
        translation: 'Aku penuhi panggilan-Mu ya Allah untuk menunaikan ibadah umroh.',
        repetition: 'Dibaca 1x saat berniat di Miqat',
        note: 'Jika khawatir terhalang uzur/sakit, tambahkan syarat: Fain habasanii haabisun famahillii haitsu habastanii.'
      },
      {
        id: 'p-talbiyah',
        title: 'Bacaan Talbiyah',
        arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        latin: 'Labbaikallaahumma labbaaik, labbaaikalaa syariika laka labbaaik, innal hamda wan ni\'mata laka wal mulk, laa syariika lak.',
        translation: 'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Tidak ada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, kenikmatan, dan kekuasaan adalah milik-Mu semata, tiada sekutu bagi-Mu.',
        repetition: 'Terus dibaca hingga mulai Tawaf',
        note: 'Bagi lansia, baca dengan tenang, tidak perlu berteriak kencang agar tenaga tidak cepat habis.'
      }
    ],
    elderlyTips: [
      'Gunakan sabuk ihram berkantung tebal dan kuat untuk menyimpan dokumen paspor mini, uang receh riyal, dan obat rutin.',
      'Bagi jamaah pria sepuh, pastikan ikatan kain ihram bagian bawah kencang atau gunakan peniti besar pengaman di samping sabuk.',
      'Pakailah sandal yang lentur dan tidak licin, serta tidak menutupi mata kaki dan jari-jari kaki.',
      'Sebelum naik bus dari Miqat, pastikan sudah buang air kecil di toilet masjid Miqat agar nyaman di perjalanan.'
    ],
    doAndDonts: {
      do: [
        'Mandi sunnah dan merapikan kuku/kumis sebelum niat ihram',
        'Memperbanyak membaca talbiyah di sepanjang perjalanan menuju Makkah',
        'Menjaga wudhu dan dzikir dengan tenang'
      ],
      dont: [
        'Memakai wewangian setelah niat ihram terucap',
        'Memotong kuku atau rambut setelah berniat ihram',
        'Bagi pria: dilarang memakai baju bertutup/berjahit, topi/penutup kepala, dan sepatu menutupi mata kaki',
        'Bagi wanita: dilarang menutup wajah (cadar rapat) dan memakai sarung tangan'
      ]
    },
    presenterNotes: 'Tekankan pada jamaah bahwa ihram bukan sekadar kain, melainkan niat masuk dalam kondisi haram. Ingatkan larangan ihram dan denda (dam) jika melanggar.'
  },
  {
    id: 'umroh-2-masuk-masjidil-haram',
    category: 'umroh',
    stepNumber: 2,
    title: 'Masuk Masjidil Haram & Melihat Ka\'bah',
    arabicTitle: 'دُخُولُ الْمَسْجِدِ الْحَرَامِ وَرُؤْيَةُ الْكَعْبَةِ',
    statusType: 'sunnah',
    location: 'Masjidil Haram, Makkah',
    dayOrTime: 'Saat tiba di Masjidil Haram',
    shortDesc: 'Masuk dengan kaki kanan, membaca doa masuk masjid, dan berdoa saat pertama kali memandang Ka\'bah.',
    fullDesc: 'Jamaah masuk dengan khusyuk mendahulukan kaki kanan. Membaca doa masuk masjid. Saat mata pertama kali menatap Baitullah Ka\'bah, angkat kedua tangan dan panjatkan doa terbaik, karena ini termasuk saat mustajab (dikabulkannya doa).',
    imageUrl: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-masuk-masjid',
        title: 'Doa Masuk Masjidil Haram',
        arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
        latin: 'Allahummaf-tah lii abwaaba rahmatik.',
        translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
        repetition: 'Dibaca saat melangkahkan kaki kanan'
      },
      {
        id: 'p-doa-melihat-kabah',
        title: 'Doa Melihat Ka\'bah',
        arabic: 'اللَّهُمَّ زِدْ هَذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً، وَزِدْ مَنْ شَرَّفَهُ وَعَظَّمَهُ مِمَّنْ حَجَّهُ أَوِ اعْتَمَرَهُ تَشْرِيفًا وَتَكْرِيمًا وَتَعْظِيمًا وَبِرًّا',
        latin: 'Allahumma zid haadzal baita tasyriifan wa ta\'zhiiman wa takriiman wa mahaabatan, wa zid man syarrafahu wa \'azzhamahu mimman hajjahu awi\'tamarahu tasyriifan wa takriiman wa ta\'zhiiman wa birraa.',
        translation: 'Ya Allah, tambahkanlah kemuliaan, keagungan, kehormatan, dan wibawa pada Rumah (Ka\'bah) ini. Dan tambahkanlah pula kemuliaan, kehormatan, keagungan, dan kebaikan bagi orang-orang yang memuliakan dan mengagungkannya dari kalangan mereka yang berhaji atau berumroh.'
      }
    ],
    elderlyTips: [
      'Bawa kantong plastik khusus untuk sandal dan bawa ke dalam tas kecil ransel agar tidak hilang atau tertukar di rak.',
      'Perhatikan nomor pintu masuk (Gate Number) yang dilewati (misal Gate King Fahd no. 79 atau Gate King Abdulaziz no. 1) untuk patokan kembali ke hotel.',
      'Gunakan gelang identitas resmi dan catat nomor telepon Muthawwif / pembimbing rombongan di saku baju.',
      'Jika kondisi fisik lelah setelah perjalanan, istirahatlah sejenak di pelataran sebelum memulai tawaf.'
    ],
    doAndDonts: {
      do: [
        'Mendahulukan kaki kanan dan berdzikir saat masuk',
        'Berdoa dengan penuh harap dan kerendahan hati saat melihat Ka\'bah',
        'Tetap bersama rombongan dan jangan melepaskan pandangan dari ketua regu'
      ],
      dont: [
        'Mendorong jamaah lain saat ingin mendekat ke Ka\'bah',
        'Berhenti mendadak di tengah arus masuk jamaah yang padat'
      ]
    },
    presenterNotes: 'Tunjukkan foto gerbang utama dan ingatkan jamaah lansia agar tidak panik bila terpisah, cukup menuju titik kumpul pintu gerbang yang disepakati.'
  },
  {
    id: 'umroh-3-tawaf',
    category: 'umroh',
    stepNumber: 3,
    title: 'Tawaf 7 Putaran Mengelilingi Ka\'bah',
    arabicTitle: 'الطَّوَافُ حَوْلَ الْكَعْبَةِ سَبْعَةَ أَشْوَاطٍ',
    statusType: 'rukun',
    location: 'Mataf (Pelataran Ka\'bah / Lantai 2 / Lantai Atas)',
    dayOrTime: 'Setelah masuk masjid & bersuci',
    shortDesc: 'Mengelilingi Ka\'bah sebanyak 7 putaran berlawanan arah jarum jam, dimulai dan diakhiri di Hajar Aswad.',
    fullDesc: 'Tawaf dimulai sejajar garis Hajar Aswad (lampu hijau). Posisi Ka\'bah selalu berada di sebelah kiri jamaah. Selesaikan 7 putaran sempurna dalam keadaan suci dari hadats kecil maupun besar. Bagi pria, disunnahkan idhthiba\' (membuka pundak kanan) selama tawaf umroh.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-bismillah-allahuakbar',
        title: 'Doa Saat Menghadap Hajar Aswad (Awal Tiap Putaran)',
        arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ',
        latin: 'Bismillahi wallahu akbar.',
        translation: 'Dengan menyebut nama Allah, dan Allah Maha Besar.',
        repetition: 'Angkat tangan kanan menghadap Hajar Aswad lalu kecup telapak tangan (Istilam isyarat).'
      },
      {
        id: 'p-doa-yamani-hajar-aswad',
        title: 'Doa Antara Rukun Yamani dan Hajar Aswad',
        arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
        latin: 'Rabbanaa aatinaa fid-dunyaa hasanah, wa fil aakhirati hasanah, wa qinaa \'adzaaban-naar.',
        translation: 'Wahai Tuhan kami, berikanlah kami kebaikan di dunia dan kebaikan di akhirat, serta lindungilah kami dari siksa api neraka.',
        repetition: 'Dibaca berulang-ulang dari Rukun Yamani sampai Hajar Aswad'
      },
      {
        id: 'p-doa-umum-tawaf',
        title: 'Dzikir Bebas Selama Tawaf',
        arabic: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيمِ',
        latin: 'Subhanallah walhamdulillah wa laa ilaha illallah wallahu akbar, wa laa hawla wa laa quwwata illa billahil \'aliyyil \'azhiim.',
        translation: 'Maha Suci Allah, segala puji bagi Allah, tiada sesembahan yang berhak disembah selain Allah, dan Allah Maha Besar. Tiada daya dan kekuatan melainkan dengan pertolongan Allah Yang Maha Tinggi lagi Maha Agung.'
      }
    ],
    elderlyTips: [
      'PILIHAN UTAMA LANSIA: Gunakan kursi roda resmi (berompi hijau resmi Masjidil Haram) atau skuter matic di Lantai Mezzanine/Lantai 3 agar aman dan tidak terdesak massa.',
      'Hindari memaksakan diri mencium Hajar Aswad jika situasi sangat padat; cukup beri isyarat lambaian tangan kanan dari kejauhan (Istilam).',
      'Minum air yang cukup sebelum tawaf untuk mencegah dehidrasi.',
      'Gunakan tasbih digital atau jari untuk menghitung jumlah putaran agar tidak lupa.'
    ],
    doAndDonts: {
      do: [
        'Memastikan wudhu tidak batal; jika batal, keluar berwudhu di tempat terdekat lalu lanjutkan',
        'Menjaga agar bahu kiri selalu menghadap ke Ka\'bah (tidak boleh membelakangi atau menghadap lurus ke Ka\'bah saat berjalan)',
        'Berjalan di luar Hijir Ismail (tidak boleh memotong lewat dalam Hijir Ismail)'
      ],
      dont: [
        'Berteriak-teriak membaca doa secara gaduh sehingga mengganggu jamaah lain',
        'Memotret selfie berlebihan yang menghalangi laju jamaah di belakang',
        'Menyentuh sudut-sudut Ka\'bah yang wangi jika masih dalam ihram'
      ]
    },
    presenterNotes: 'Peragakan posisi bahu kiri terhadap Ka\'bah dan batas lampu hijau penanda Hajar Aswad. Jelaskan opsi kursi roda dan skuter listrik bagi lansia risti.'
  },
  {
    id: 'umroh-4-shalat-sunnah-zamzam',
    category: 'umroh',
    stepNumber: 4,
    title: 'Shalat Sunnah Tawaf & Minum Air Zamzam',
    arabicTitle: 'صَلَاةُ رَكْعَتَيِ الطَّوَافِ وَشُرْبُ مَاءِ زَمْزَمَ',
    statusType: 'sunnah',
    location: 'Belakang Maqam Ibrahim / Seluruh Area Masjidil Haram',
    dayOrTime: 'Tepat setelah selesai 7 putaran Tawaf',
    shortDesc: 'Shalat sunnah 2 rakaat di belakang Maqam Ibrahim (jika memungkinkan), lalu minum air Zamzam sampai kenyang.',
    fullDesc: 'Menutup kembali pundak kanan yang terbuka. Melakukan shalat 2 rakaat tawaf: rakaat pertama membaca Surah Al-Kafirun, rakaat kedua membaca Surah Al-Ikhlas. Setelah itu, menuju dispenser air Zamzam, minum menghadap kiblat dengan membaca doa.',
    imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-zamzam',
        title: 'Doa Minum Air Zamzam',
        arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا وَاسِعًا، وَشِفَاءً مِنْ كُلِّ دَاءٍ',
        latin: 'Allahumma innii as-aluka \'ilman naafi\'an, wa rizqan waasi\'an, wa syifaa-an min kulli daa-in.',
        translation: 'Ya Allah, sungguh aku memohon kepada-Mu ilmu yang bermanfaat, rizki yang luas, dan kesembuhan dari segala macam penyakit.'
      }
    ],
    elderlyTips: [
      'Bila area belakang Maqam Ibrahim penuh sesak, shalatlah di bagian belakang masjid manapun yang lapang dan aman.',
      'Pilih air Zamzam berlabel "NOT COLD" (ghairu mubarrad / tidak dingin) agar tenggorokan dan lambung lansia tetap hangat dan nyaman.',
      'Usapkan sedikit sisa air Zamzam ke wajah, kepala, dan dada untuk memohon kesegaran dan kesembuhan.'
    ],
    doAndDonts: {
      do: [
        'Minum sambil berdiri atau duduk dengan tenang menghadap kiblat',
        'Menutup kembali kedua pundak dengan kain ihram setelah selesai tawaf'
      ],
      dont: [
        'Memaksakan shalat persis di belakang Maqam Ibrahim bila membahayakan arus jamaah'
      ]
    },
    presenterNotes: 'Tegaskan bahwa shalat sunnah tawaf sah dilakukan di mana saja di dalam Masjidil Haram. Lansia tidak perlu berdesakan di dekat Maqam Ibrahim.'
  },
  {
    id: 'umroh-5-sai',
    category: 'umroh',
    stepNumber: 5,
    title: 'Sa\'i 7 Kali Perjalanan Shafa - Marwah',
    arabicTitle: 'السَّعْيُ بَيْنَ الصَّفَا وَالْمَرْوَةِ سَبْعَةَ أَشْوَاطٍ',
    statusType: 'rukun',
    location: 'Mas\'a (Jalur Shafa dan Marwah)',
    dayOrTime: 'Setelah Tawaf dan Minum Air Zamzam',
    shortDesc: 'Berjalan 7 putaran dimulai dari bukit Shafa dan berakhir di bukit Marwah.',
    fullDesc: 'Dimulai dari bukit Shafa menuju Marwah (dihitung 1 putaran), lalu Marwah ke Shafa (putaran 2), dan seterusnya hingga putaran ke-7 berakhir di Marwah. Total jarak sekitar 2,8 km. Bagi pria disunnahkan lari-lari kecil di antara dua pilar berlampu hijau.',
    imageUrl: 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-naik-shafa',
        title: 'Doa Memulai Sa\'i di Bukit Shafa (Surah Al-Baqarah: 158)',
        arabic: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ ۖ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا',
        latin: 'Innash-shafaa wal-marwata min sya\'aa-irillah, faman hajjal baita awi\'tamara falaa junaaha \'alaihi an yath-thawwafa bihimaa. Nabda-u bimaa bada-allahu bih.',
        translation: 'Sesungguhnya Shafa dan Marwah adalah sebahagian dari syi\'ar Allah. Maka barangsiapa yang beribadah haji ke Baitullah atau berumroh, tidak ada dosa baginya mengerjakan sa\'i antara keduanya. Kami memulai dengan apa yang Allah mulai.'
      },
      {
        id: 'p-takbir-shafa',
        title: 'Takbir & Tahlil di Puncak Shafa Menghadap Ka\'bah',
        arabic: 'اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Allahu akbar, Allahu akbar, Allahu akbar. Laa ilaha illallah wahdahu laa syariika lah, lahul mulku wa lahul hamdu yuhyii wa yumiitu wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Allah Maha Besar (3x). Tiada sesembahan selain Allah semata, tiada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan pujian, Dia Maha Menghidupkan dan Mematikan, dan Dia Maha Kuasa atas segala sesuatu.'
      },
      {
        id: 'p-lampu-hijau',
        title: 'Doa di Antara Dua Pilar Lampu Hijau',
        arabic: 'رَبِّ اغْفِرْ وَارْحَمْ وَاعْفُ وَتَكَرَّمْ وَتَجَاوَزْ عَمَّا تَعْلَمُ، إِنَّكَ تَعْلَمُ مَا لَا نَعْلَمُ، إِنَّكَ أَنْتَ اللَّهُ الْأَعَزُّ الْأَكْرَمُ',
        latin: 'Rabbighfir warham wa\'fu wa takarram wa tajaawaz \'ammaa ta\'lam, innaka ta\'lamu maa laa na\'lam, innaka antallaahul a\'azzul akram.',
        translation: 'Ya Tuhanku, ampunilah, sayangilah, maafkanlah, muliakanlah, dan hapuslah dosa yang Engkau ketahui. Sesungguhnya Engkau mengetahui apa yang tidak kami ketahui, dan Engkau adalah Allah Yang Maha Perkasa lagi Maha Mulia.'
      }
    ],
    elderlyTips: [
      'Gunakan jalur khusus kursi roda di lantai dasar bagian tengah atau lantai 2/3 bila kaki mudah lelah atau ada riwayat radang sendi lutut.',
      'Jamaah lansia TIDAK PERLU berlari kecil di pilar hijau; cukup berjalan biasa dengan santai dan tenang.',
      'Bila merasa haus atau lelah, berhentilah sejenak di tepi jalur sa\'i untuk minum air Zamzam yang tersedia di banyak dispenser.',
      'Ingat rumus hitungan: Ganjil (1, 3, 5, 7) selalu berakhir di Marwah. Genap (2, 4, 6) selalu berakhir di Shafa.'
    ],
    doAndDonts: {
      do: [
        'Menaiki bukit Shafa dan Marwah hingga batas aman dan menghadap kiblat untuk berdoa',
        'Mengulang doa dan hajat pribadi sebanyak-banyaknya di setiap putaran'
      ],
      dont: [
        'Menghitung Shafa-Marwah-Shafa sebagai 1 putaran (yang benar: Shafa ke Marwah = 1 putaran)',
        'Memaksakan berlari bagi lansia yang dapat membahayakan keseimbangan badan'
      ]
    },
    presenterNotes: 'Gambarkan ilustrasi lintasan Shafa-Marwah. Jelaskan bahwa wudhu tidak menjadi syarat sah sa\'i (jika batal wudhu saat sa\'i tetap sah), namun disunnahkan suci.'
  },
  {
    id: 'umroh-6-tahallul',
    category: 'umroh',
    stepNumber: 6,
    title: 'Tahallul & Tertib (Selesai Ibadah Umroh)',
    arabicTitle: 'التَّحَلُّلُ بِالْحَلْقِ أَوِ التَّقْصِيرِ وَالتَّرْتِيبُ',
    statusType: 'rukun',
    location: 'Bukit Marwah / Barbershop sekitar Masjidil Haram',
    dayOrTime: 'Tepat setelah putaran ke-7 Sa\'i selesai di Marwah',
    shortDesc: 'Mencukur habis atau memotong minimal 3 helai rambut, mengakhiri larangan ihram.',
    fullDesc: 'Bagi pria lebih utama mencukur gundul (tahalluq) atau memotong rata sebagian rambut (taqshir). Bagi wanita cukup memotong ujung rambut sepanjang satu ruas jari telunjuk. Dengan tahallul, seluruh larangan ihram telah gugur dan ibadah umroh telah selesai secara sempurna.',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-tahallul',
        title: 'Doa Saat Memotong Rambut (Tahallul)',
        arabic: 'اللَّهُمَّ اجْعَلْ لِكُلِّ شَعْرَةٍ نُورًا يَوْمَ الْقِيَامَةِ، وَاغْفِرْ لِي وَلِلْمُحَلِّقِينَ وَالْمُقَصِّرِينَ',
        latin: 'Allahummaj\'al likulli sya\'ratin nuuran yaumal qiyaamah, waghfir lii wa lil-muhalliqiina wal-muqash-shiriin.',
        translation: 'Ya Allah, jadikanlah setiap helai rambut ini cahaya pada hari kiamat, dan ampunilah diriku serta orang-orang yang mencukur habis dan memendekkan rambutnya.'
      }
    ],
    elderlyTips: [
      'Bawa gunting kecil khusus di tas koper bagasi (bukan tas kabin pesawat) untuk memotong rambut di Marwah.',
      'Saling memotongkan rambut antar sesama jamaah yang sama-sama telah menyelesaikan putaran ke-7 sa\'i.',
      'Setelah tahallul, jamaah dapat berganti dengan pakaian harian biasa yang sejuk dan bersih kembali ke hotel.'
    ],
    doAndDonts: {
      do: [
        'Memastikan seluruh 7 putaran Sa\'i sudah selesai sebelum memotong rambut',
        'Mengucap rasa syukur dan tahmid: Alhamdulillahirabbil \'aalamiin'
      ],
      dont: [
        'Memotong rambut sendiri atau orang lain sebelum putaran ke-7 Sa\'i tuntas'
      ]
    },
    presenterNotes: 'Jelaskan perbedaan tahallul pria dan wanita. Sampaikan ucapan tahniah (selamat) atas selesainya ibadah umroh.'
  },

  // ===================== HAJI =====================
  {
    id: 'haji-1-ihram-tarwiyah',
    category: 'haji',
    stepNumber: 1,
    title: 'Ihram & Niat Haji (8 Dzulhijjah - Hari Tarwiyah)',
    arabicTitle: 'الإِحْرَامُ بِالْحَجِّ (يَوْمُ التَّرْوِيَةِ)',
    statusType: 'rukun',
    location: 'Pemondokan / Hotel di Makkah',
    dayOrTime: '8 Dzulhijjah pagi / siang hari',
    shortDesc: 'Mandi sunnah, mengenakan kain ihram dari hotel, dan melafadzkan niat ibadah haji.',
    fullDesc: 'Pada hari Tarwiyah (8 Dzulhijjah), jamaah haji Tamattu\' bersiap ihram dari tempat menginapnya di Makkah. Memakai kain ihram, berniat haji, membaca talbiyah, dan bersiap menuju Mina (atau langsung skema persiapan Arafah sesuai regulasi Kemenag/PPIH).',
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-niat-haji',
        title: 'Lafadz Niat Haji',
        arabic: 'لَبَّيْكَ اللَّهُمَّ حَجًّا',
        latin: 'Labbaikallahumma hajjan.',
        translation: 'Aku penuhi panggilan-Mu ya Allah untuk menunaikan ibadah haji.',
        repetition: 'Dibaca saat berniat di kamar hotel'
      },
      {
        id: 'p-talbiyah-haji',
        title: 'Talbiyah Haji',
        arabic: 'لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
        latin: 'Labbaikallaahumma labbaaik, labbaaikalaa syariika laka labbaaik, innal hamda wan ni\'mata laka wal mulk, laa syariika lak.',
        translation: 'Aku datang memenuhi panggilan-Mu ya Allah...'
      }
    ],
    elderlyTips: [
      'Siapkan ransel kecil berisi obat pribadi untuk 4-5 hari (Armuzna: Arafah, Muzdalifah, Mina), masker, semprotan air, dan pakaian ganti.',
      'Gantungkan botol air minum di dada atau selempang pundak agar mudah dijangkau saat di bus.',
      'Pastikan smart tag / gelang identitas haji logam terpasang erat di pergelangan tangan.'
    ],
    doAndDonts: {
      do: [
        'Memeriksa kembali obat rutin hipertensi / diabetes jangan sampai tertinggal di koper besar',
        'Mengikuti arahan ketua kloter dan regu dalam menaiki bus maktab'
      ],
      dont: [
        'Membawa barang koper besar ke Arafah-Mina (hanya bawa tas tenteng kecil)'
      ]
    },
    presenterNotes: 'Jelaskan jadwal pergerakan bus maktab dari hotel Makkah menuju tenda Arafah. Ingatkan persiapan fisik jamaah lansia.'
  },
  {
    id: 'haji-2-wukuf-arafah',
    category: 'haji',
    stepNumber: 2,
    title: 'Wukuf di Arafah (9 Dzulhijjah - Puncak Ibadah Haji)',
    arabicTitle: 'الْوُقُوفُ بِعَرَفَةَ (أَعْظَمُ أَرْكَانِ الْحَجِّ)',
    statusType: 'rukun',
    location: 'Padang Arafah & Tenda Maktab',
    dayOrTime: '9 Dzulhijjah (Mulai tergelincir matahari Dzuhur hingga terbenam Maghrib)',
    shortDesc: 'Al-Hajju Arafah (Haji adalah Arafah). Inti puncak haji dengan khutbah wukuf, shalat jamak qashar, dan doa air mata.',
    fullDesc: 'Wukuf di Arafah adalah rukun terpenting dalam haji. Barangsiapa luput dari wukuf, maka tiada haji baginya. Jamaah mendengarkan khutbah wukuf, shalat Dzuhur dan Ashar secara jamak taqdim dan qashar, lalu bermunajat, menangis, bertaubat, dan mendoakan keluarga hingga matahari tenggelam.',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-arafah-utama',
        title: 'Doa Terbaik di Hari Arafah (Sabda Rasulullah SAW)',
        arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        latin: 'Laa ilaha illallahu wahdahu laa syariika lahu, lahul mulku wa lahul hamdu, wa huwa \'alaa kulli syai-in qadiir.',
        translation: 'Tiada sesembahan yang berhak disembah melainkan Allah semata, tiada sekutu bagi-Nya. Bagi-Nya segala kerajaan dan segala pujian, dan Dia Maha Kuasa atas segala sesuatu.'
      },
      {
        id: 'p-istighfar-taubat',
        title: 'Sayyidul Istighfar & Taubat',
        arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
        latin: 'Allahumma anta rabbii laa ilaha illa anta, khalaqtanii wa ana \'abduka, wa ana \'alaa \'ahdika wa wa\'dika mastatha\'tu, a\'uudzu bika min syarri maa shana\'tu, abuu-u laka bini\'matika \'alayya, wa abuu-u bidzanbii faghfir lii fa-innahu laa yaghfirudz-dzunuuba illa anta.',
        translation: 'Ya Allah, Engkau adalah Tuhanku, tiada sesembahan melainkan Engkau. Engkaulah yang menciptakanku dan aku adalah hamba-Mu...'
      }
    ],
    elderlyTips: [
      'Tetaplah berada di dalam tenda maktab yang ber-AC, jangan keluar berpanas-panasan ke Jabal Rahmah di siang hari karena suhu dapat mencapai 45-48°C.',
      'Sering-seringlah menyemprotkan air bersih ke wajah dan tengkuk memakai botol spray mini.',
      'Minum oralit atau larutan elektrolit 1 botol kecil setiap 2 jam untuk mencegah heatstroke (sengatan panas).',
      'Siapkan buku doa kecil berisi nama-nama anak, cucu, orang tua, dan kerabat yang telah menitipkan doa.'
    ],
    doAndDonts: {
      do: [
        'Fokus memperbanyak dzikir, membaca Al-Quran, dan berdoa dengan linangan air mata',
        'Istirahat sejenak saat lelah agar kondisi fisik tetap bugar menjelang malam'
      ],
      dont: [
        'Menghabiskan waktu berharga untuk mengobrol santai, tidur seharian, atau berbelanja',
        'Keluar dari batas wilayah Arafah sebelum waktu matahari terbenam'
      ]
    },
    presenterNotes: 'Tekankan keutamaan doa Arafah. Ingatkan para pendamping lansia untuk mengecek asupan cairan jamaah setiap jam.'
  },
  {
    id: 'haji-3-mabit-muzdalifah',
    category: 'haji',
    stepNumber: 3,
    title: 'Mabit di Muzdalifah & Mengambil Kerikil',
    arabicTitle: 'الْمَبِيتُ بِمُزْدَلِفَةَ وَجَمْعُ الْحَصَى',
    statusType: 'wajib',
    location: 'Muzdalifah (Antara Arafah dan Mina)',
    dayOrTime: 'Malam 10 Dzulhijjah (Setelah maghrib)',
    shortDesc: 'Singgah di Muzdalifah setelah matahari terbenam di Arafah, shalat Maghrib-Isya jamak qashar, dan mengumpulkan kerikil.',
    fullDesc: 'Setelah Maghrib 9 Dzulhijjah, jamaah bergerak menuju Muzdalifah. Shalat Maghrib dan Isya dikerjakan di Muzdalifah dengan jamak ta\'khir dan qashar. Jamaah mabit (bermalam/singgah) hingga melewati tengah malam dan mengumpulkan butir kerikil seukuran kacang tanah untuk lempar jumrah.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-masyaril-haram',
        title: 'Dzikir di Masy\'aril Haram (Muzdalifah)',
        arabic: 'فَإِذَا أَفَضْتُمْ مِنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ ۖ وَاذْكُرُوهُ كَمَا هَدَاكُمْ',
        latin: 'Fa-idzaa afadhtum min \'arafaatin fadzkurullaaha \'indal masy\'aril haraam, wadzkuruuhu kamaa hadaakum.',
        translation: 'Maka apabila kamu telah bertolak dari Arafat, berdzikirlah kepada Allah di Masy\'arilharam. Dan berdzikirlah (dengan menyebut) Allah sebagaimana Dia telah memberi petunjuk kepadamu.'
      }
    ],
    elderlyTips: [
      'SKEMA MURUR: Pemerintah RI memberlakukan skema Murur (bus melintas pelan di Muzdalifah tanpa turun) khusus untuk jamaah lansia, disabilitas, dan risti demi keselamatan nyawa.',
      'Jika turun beristirahat, gunakan tikar gulung dan kenakan jaket/selimut tipis karena angin malam Muzdalifah cukup dingin.',
      'Pengambilan batu kerikil dapat dibantu oleh pendamping atau menggunakan kerikil yang telah disediakan panitia maktab.'
    ],
    doAndDonts: {
      do: [
        'Beristirahat dan tidur sejenak untuk memulihkan energi fisik',
        'Mengumpulkan kerikil secukupnya (7 butir untuk Aqabah, atau 49-70 butir untuk hari Tasyrik)'
      ],
      dont: [
        'Mengambil batu kerikil berukuran besar (cukup seukuran kacang polong)',
        'Mencuci kerikil secara berlebihan'
      ]
    },
    presenterNotes: 'Jelaskan rukhsah (keringanan) syariat bagi lansia untuk skema Murur di Muzdalifah, fatwa MUI membolehkannya demi mashlahat.'
  },
  {
    id: 'haji-4-jumrah-aqabah-tahallul-awwal',
    category: 'haji',
    stepNumber: 4,
    title: 'Lempar Jumrah Aqabah & Tahallul Awwal',
    arabicTitle: 'رَمْيُ جَمْرَةِ الْعَقَبَةِ وَالتَّحَلُّلُ الأَوَّلُ',
    statusType: 'wajib',
    location: 'Jamarat, Mina',
    dayOrTime: '10 Dzulhijjah (Hari Raya Idul Adha)',
    shortDesc: 'Melempar 7 butir kerikil ke Jumrah Aqabah pada hari Idul Adha, dilanjutkan memotong rambut (Tahallul Awwal).',
    fullDesc: 'Pada 10 Dzulhijjah, jamaah melempar Jumrah Aqabah (Kubro) sebanyak 7 kali lontaran, setiap lemparan disertai ucapan takbir. Setelah selesai melempar, jamaah memotong rambut (tahallul awal), sehingga terbebas dari seluruh larangan ihram KECUALI hubungan suami-istri.',
    imageUrl: 'https://images.unsplash.com/photo-1590076215667-875d4ef2d7ee?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-lempar-jumrah',
        title: 'Doa Setiap Lontaran Jumrah',
        arabic: 'بِسْمِ اللَّهِ، اللَّهُ أَكْبَرُ، رَغْمًا لِلشَّيْطَانِ وَرِضًا لِلرَّحْمَنِ، اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا وَذَنْبًا مَغْفُورًا',
        latin: 'Bismillaahi Allahu akbar, raghman lisysyaitaani wa ridhan lir-rahmaan, allahummaj\'alhu hajjan mabruuraa wa dzanban maghfuuraa.',
        translation: 'Dengan menyebut nama Allah, Allah Maha Besar, sebagai penentangan terhadap setan dan keridhaan bagi Dzat Yang Maha Penyayang. Ya Allah, jadikanlah hajiku ini haji yang mabrur dan dosa yang diampuni.'
      }
    ],
    elderlyTips: [
      'BADAL LEMPAR JUMRAH: Jamaah lansia yang lemah fisik, memakai kursi roda, atau sesak napas SANGAT DIANJURKAN MEMBADALKAN (mewakilkan) lontar jumrah kepada kerabat atau petugas.',
      'Membadalkan jumrah bagi yang udzur hukumnya sah secara syar\'i dan tidak mengurangi pahala haji.',
      'Jika tetap ingin melempar sendiri, pilih waktu afdhal/aman yang sepi (misal: malam hari atau dini hari, hindari waktu puncak Dzuhur).'
    ],
    doAndDonts: {
      do: [
        'Memastikan kerikil masuk ke dalam lubang marma (tempat jatuhnya kerikil)',
        'Mencukur rambut begitu selesai melempar untuk meraih tahallul awal'
      ],
      dont: [
        'Melempar dengan sandal, botol, atau payung (harus kerikil)',
        'Melontar 7 butir sekaligus dalam satu kali lemparan'
      ]
    },
    presenterNotes: 'Tegaskan kembali kemudahan Islam: lansia uzur sangat dianjurkan badal jumrah agar tidak membahayakan jiwa di Jamarat.'
  },
  {
    id: 'haji-5-tawaf-ifadhah-sai',
    category: 'haji',
    stepNumber: 5,
    title: 'Tawaf Ifadhah & Sa\'i Haji (Tahallul Tsani)',
    arabicTitle: 'طَوَافُ الإِفَاضَةِ وَالسَّعْيُ (التَّحَلُّلُ الثَّانِي)',
    statusType: 'rukun',
    location: 'Masjidil Haram, Makkah',
    dayOrTime: 'Mulai 10 Dzulhijjah setelah Jumrah Aqabah',
    shortDesc: 'Menuju Masjidil Haram untuk menunaikan Tawaf Ifadhah (Rukun Haji) dan Sa\'i Haji.',
    fullDesc: 'Tawaf Ifadhah adalah rukun haji yang wajib dilaksanakan sendiri (tidak boleh dibadalkan bagi yang mampu). Setelah tawaf 7 putaran dan sa\'i haji selesai, tercapailah Tahallul Tsani (Tahallul Akbar), yang membolehkan kembali seluruh hal yang sebelumnya dilarang dalam ihram secara mutlak.',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-ifadhah',
        title: 'Doa Tawaf Ifadhah',
        arabic: 'اللَّهُمَّ إِيمَانًا بِكَ، وَتَصْدِيقًا بِكِتَابِكَ، وَوَفَاءً بِعَهْدِكَ، وَاتِّبَاعًا لِسُنَّةِ نَبِيِّكَ مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
        latin: 'Allahumma iimaanan bika, wa tashdiiqan bikitaabika, wa wafaa-an bi\'ahdika, wattibaa\'an lisunnati nabiyyika Muhammadin shallallaahu \'alaihi wa sallam.',
        translation: 'Ya Allah, aku thawaf ini karena beriman kepada-Mu, membenarkan kitab-Mu, menepati janji-Mu, dan mengikuti sunnah Nabi-Mu Muhammad SAW.'
      }
    ],
    elderlyTips: [
      'Tawaf Ifadhah tidak harus dikerjakan terburu-buru di hari 10 Dzulhijjah; lansia bisa menundanya hingga hari tasyrik selesai (12 atau 13 Dzulhijjah) saat kondisi badan sudah cukup istirahat.',
      'Gunakan fasilitas skuter matic sewa resmi di lantai 3 Masjidil Haram untuk tawaf dan sa\'i haji.',
      'Jangan pergi sendiri; selalu didampingi pendamping keluarga atau muthawwif.'
    ],
    doAndDonts: {
      do: [
        'Menjaga kondisi stamina dan cairan tubuh',
        'Memakai pakaian biasa jika sudah tahallul awal'
      ],
      dont: [
        'Memaksakan turun ke lantai dasar jika fisik sangat lemah'
      ]
    },
    presenterNotes: 'Beri pengertian bahwa waktu Tawaf Ifadhah terbentang luas hingga akhir bulan Dzulhijjah, jadi lansia tidak perlu cemas.'
  },
  {
    id: 'haji-6-mabit-mina-tasyrik',
    category: 'haji',
    stepNumber: 6,
    title: 'Mabit di Mina & Lempar 3 Jumrah (Hari Tasyrik)',
    arabicTitle: 'الْمَبِيتُ بِمِنَى أَيَّامَ التَّشْرِيقِ وَرَمْيُ الْجِمَارِ الثَّلَاثِ',
    statusType: 'wajib',
    location: 'Tenda Mina & Jembatan Jamarat',
    dayOrTime: '11, 12, dan 13 Dzulhijjah',
    shortDesc: 'Bermalam di tenda Mina dan melempar 3 jumrah (Ula, Wustha, Aqabah) masing-masing 7 kerikil setiap hari.',
    fullDesc: 'Jamaah tinggal di Mina selama hari Tasyrik. Setiap hari setelah zawal (tergelincir matahari Dzuhur), melempar 3 jumrah secara berurutan: Jumrah Ula (7 kerikil), Jumrah Wustha (7 kerikil), dan Jumrah Aqabah (7 kerikil). Jamaah bisa memilih Nafar Awwal (keluar 12 Dzulhijjah) atau Nafar Tsani (keluar 13 Dzulhijjah).',
    imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-antara-jumrah',
        title: 'Doa Menghadap Kiblat Setelah Jumrah Ula & Wustha',
        arabic: 'اللَّهُمَّ اجْعَلْهُ حَجًّا مَبْرُورًا، وَذَنْبًا مَغْفُورًا، وَسَعْيًا مَشْكُورًا',
        latin: 'Allahummaj\'alhu hajjan mabruuraa, wa dzanban maghfuuraa, wa sa\'yan masjkuuraa.',
        translation: 'Ya Allah, jadikanlah ibadah haji ini mabrur, dosa yang terampuni, dan usaha yang disyukuri.'
      }
    ],
    elderlyTips: [
      'Bagi lansia, sangat dianjurkan mengambil opsi NAFAR AWWAL (pulang ke Makkah pada 12 Dzulhijjah sebelum maghrib) agar tidak terlalu kelelahan.',
      'Sama seperti hari ke-10, lempar jumrah 3 pilar pada hari tasyrik dapat diwakilkan (dibadalkan) sepenuhnya kepada pendamping.',
      'Perbanyak istirahat di dalam tenda, perhatikan tanda regu/pos maktab agar tidak tersesat saat keluar ke toilet.'
    ],
    doAndDonts: {
      do: [
        'Membaca dzikir dan memperbanyak takbiran di hari-hari tasyrik',
        'Makan dan minum yang cukup karena hari tasyrik adalah hari makan, minum, dan dzikrullah'
      ],
      dont: [
        'Berpuasa pada hari tasyrik (11, 12, 13 Dzulhijjah diharamkan berpuasa)'
      ]
    },
    presenterNotes: 'Ingatkan larangan puasa hari tasyrik dan rekomendasi Nafar Awwal untuk kenyamanan fisik jamaah sepuh.'
  },
  {
    id: 'haji-7-tawaf-wada',
    category: 'haji',
    stepNumber: 7,
    title: 'Tawaf Wada\' (Tawaf Perpisahan)',
    arabicTitle: 'طَوَافُ الْوَدَاعِ قَبْلَ مُغَادَرَةِ مَكَّةَ',
    statusType: 'wajib',
    location: 'Masjidil Haram, Makkah',
    dayOrTime: 'Sesaat sebelum meninggalkan kota suci Makkah',
    shortDesc: 'Tawaf perpisahan 7 putaran tanpa sa\'i sebagai penghormatan terakhir kepada Baitullah sebelum pulang.',
    fullDesc: 'Tawaf Wada\' merupakan kewajiban terakhir sebelum jamaah meninggalkan kota suci Makkah untuk kembali ke tanah air atau bertolak ke Madinah. Dikerjakan sebanyak 7 putaran tanpa idhthiba\' dan tanpa sa\'i. Wanita yang sedang haidh atau nifas diringankan dan gugur kewajiban tawaf wada\'-nya tanpa membayar dam.',
    imageUrl: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&w=1200&q=80',
    prayers: [
      {
        id: 'p-doa-wada',
        title: 'Doa Perpisahan Baitullah',
        arabic: 'اللَّهُمَّ لَا تَجْعَلْ هَذَا آخِرَ الْعَهْدِ بِبَيْتِكَ الْحَرَامِ، وَإِنْ جَعَلْتَهُ فَاعْوِضْنِي عَنْهُ الْجَنَّةَ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ',
        latin: 'Allahumma laa taj\'al haadzaa aakhiral \'ahdi bibaitikal haraam, wa in ja\'altahu fa\'widhni \'anhul jannata birahmatika yaa arhamar raahimiin.',
        translation: 'Ya Allah, janganlah Engkau jadikan kunjungan ini sebagai pertemuan terakhirku dengan Rumah Suci-Mu. Dan jika Engkau mentakdirkannya sebagai yang terakhir, maka gantikanlah bagiku dengan surga berkat rahmat-Mu, wahai Dzat Yang Maha Pengasih.'
      }
    ],
    elderlyTips: [
      'Lakukan tawaf wada\' beberapa jam sebelum jadwal keberangkatan bus bandara/Madinah agar tidak terburu-buru.',
      'Setelah tawaf wada\', segera kembali ke hotel dan tidak berlama-lama belanja atau beraktivitas santai.',
      'Gunakan kursi roda jika tenaga sudah terkuras dari rangkaian Armuzna.'
    ],
    doAndDonts: {
      do: [
        'Berpamitan dengan penuh haru dan doa husnul khatimah',
        'Menjaga barang bawaan dan tas paspor'
      ],
      dont: [
        'Berjalan mundur saat keluar masjid (tidak ada dasarnya dalam sunnah Rasulullah SAW)'
      ]
    },
    presenterNotes: 'Luruskan mitos berjalan mundur saat keluar masjid. Sampaikan pesan istiqamah memelihara kemabruran haji di tanah air.'
  }
];

export const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'quiz-1',
    category: 'umroh',
    question: 'Berapakah jumlah putaran yang dilakukan saat Tawaf mengelilingi Ka\'bah?',
    options: ['3 Putaran', '5 Putaran', '7 Putaran', '9 Putaran'],
    correctIndex: 2,
    explanation: 'Tawaf dikerjakan sebanyak 7 putaran sempurna mengelilingi Ka\'bah, dimulai dan diakhiri sejajar dengan garis Hajar Aswad.'
  },
  {
    id: 'quiz-2',
    category: 'umroh',
    question: 'Dari manakah perjalanan Sa\'i dimulai dan di manakah berakhirnya?',
    options: [
      'Mulai dari Marwah berakhir di Shafa',
      'Mulai dari Shafa berakhir di Marwah',
      'Mulai dari Ka\'bah berakhir di Shafa',
      'Mulai dari Hijir Ismail ke Maqam Ibrahim'
    ],
    correctIndex: 1,
    explanation: 'Sa\'i dimulai dari bukit Shafa dan berakhir di bukit Marwah pada putaran ke-7.'
  },
  {
    id: 'quiz-3',
    category: 'haji',
    question: 'Kapan waktu pelaksanaan Wukuf di Padang Arafah sebagai puncak ibadah haji?',
    options: [
      '8 Dzulhijjah (Hari Tarwiyah)',
      '9 Dzulhijjah (Mulai Dzuhur hingga Maghrib)',
      '10 Dzulhijjah (Hari Raya Idul Adha)',
      '11 Dzulhijjah (Hari Tasyrik pertama)'
    ],
    correctIndex: 1,
    explanation: 'Wukuf dilaksanakan pada tanggal 9 Dzulhijjah, mulai tergelincir matahari (waktu Dzuhur) hingga terbenam matahari (Maghrib).'
  },
  {
    id: 'quiz-4',
    category: 'haji',
    question: 'Bagi calon jamaah lansia yang lemah fisik atau menggunakan kursi roda, bagaimana hukum melempar Jumrah?',
    options: [
      'Haji dinyatakan batal jika tidak melempar sendiri',
      'Boleh dibadalkan (diwakilkan) kepada pendamping/keluarga secara sah',
      'Wajib membayar denda 1 ekor unta',
      'Harus ditunda hingga tahun depan'
    ],
    correctIndex: 1,
    explanation: 'Islam memberikan rukhsah (keringanan). Bagi jamaah lansia yang sakit atau udzur fisik, melempar jumrah sah diwakilkan/dibadalkan kepada pendamping tanpa mengurangi keabsahan haji.'
  },
  {
    id: 'quiz-5',
    category: 'umroh',
    question: 'Apa arti dan tujuan dari Tahallul dalam ibadah Umroh?',
    options: [
      'Memakai kain ihram di Miqat',
      'Minum air Zamzam sampai kenyang',
      'Mencukur atau memotong sebagian rambut untuk mengakhiri larangan ihram',
      'Shalat sunnah 2 rakaat di belakang Maqam Ibrahim'
    ],
    correctIndex: 2,
    explanation: 'Tahallul adalah memotong atau mencukur rambut yang menandai berakhirnya kondisi ihram beserta seluruh larangannya.'
  }
];
