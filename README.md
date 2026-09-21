# 🕋 Manasik Pintar (Smart Hajj & Umrah Guide)

Aplikasi panduan digital interaktif bimbingan manasik Haji dan Umroh berbasis web modern dengan dukungan audio doa, fitur aksesibilitas ramah lansia, evaluasi kuis, sistem manajemen konten (CMS), dan panel tata kelola pengguna terintegrasi Supabase.

---

## 👥 Dokumentasi Peran & Hak Akses (Role & Permission)

Aplikasi **Manasik Pintar** memiliki 3 (tiga) tingkatan peran pengguna (*User Role*) serta akses tamu (*Guest*):

```
┌────────────────────────────────────────────────────────┐
│                      SUPER ADMIN                       │
│    (Tata Kelola Pengguna, Approval, Audit Log, CMS)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                    ADMIN / PEMBIMBING                  │
│     (CMS Materi, Doa, Tips Lansia, Mode Presentasi)    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────┴────────────────────────────┐
│                         JAMAAH                         │
│  (Panduan Interaktif, Audio Doa, Progres Belajar, Kuis)│
└────────────────────────────────────────────────────────┘
```

---

### 1. 👑 Super Admin (`super_admin`)
Peran administratif tertinggi dengan wewenang penuh atas seluruh ekosistem aplikasi, keamanan data, dan tata kelola akun.

#### Wewenang & Fitur Khusus:
* **Manajemen Pengguna Penuh (User Management CRUD)**:
  * **Tambah Pengguna Baru**: Membuat akun baru langsung melalui dashboard dengan role apapun (`super_admin`, `admin`, `jamaah`) dan langsung berstatus aktif (*approved*).
  * **Edit Profil Pengguna**: Memperbarui informasi nama, email, nomor telepon/WhatsApp, asal kloter/KBIHU/biro umroh, serta catatan internal.
  * **Ubah Role (Hak Akses)**: Mengubah tingkatan wewenang pengguna secara fleksibel.
  * **Hapus Akun**: Menghapus akun dari basis data (dilengkapi proteksi otomatis agar tidak dapat menghapus satu-satunya Super Admin aktif).
* **Sistem Persetujuan Pendaftaran (Approval Workflow)**:
  * Meninjau seluruh pendaftaran mandiri yang masuk dengan status *Pending Approval*.
  * **Approve**: Menyetujui akun pendaftar agar dapat segera login.
  * **Reject**: Menolak pendaftaran jika berkas atau data tidak valid.
* **Suspensi & Keamanan Akun (Account Suspension)**:
  * Menangguhkan akun (*Suspend*) dengan mencantumkan alasan resmi (misal: verifikasi validasi paspor atau klarifikasi data nomor porsi haji).
  * Mengaktifkan kembali akun (*Unsuspend*) setelah verifikasi selesai.
* **Audit Trail / Log Aktivitas Sistem**:
  * Memantau catatan riwayat (*audit logs*) setiap tindakan administratif: siapa yang mengeksekusi, target pengguna, jenis aksi, serta stempel waktu (*timestamp*).
* **Content Management System (CMS)**:
  * Memiliki akses penuh ke CMS untuk mengubah materi manasik, doa, tips lansia, dan kuis.
* **Pemantauan Kunjungan Jamaah (Visitor Analytics)**:
  * Melihat statistik pengunjung aktif (*online real-time*), total kunjungan harian, dan jumlah pengunjung unik.
  * Fitur reset statistik kunjungan.

#### Akun Bawaan (Default):
| Nama | Email | Password | Role | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Yusuf Wisnubrata** | `yusufwisnubrata26@gmail.com` | `admin123` | `super_admin` | `approved` |
| **KH. Abdullah Syukri** | `superadmin@manasik.id` | `admin123` | `super_admin` | `approved` |

---

### 2. 👳 Admin / Pembimbing Ibadah (`admin`)
Peran yang dikhususkan bagi pembimbing ibadah haji & umroh resmi (Ustadz, Muthawwif, KBIHU, atau pengelola biro travel umroh).

#### Wewenang & Fitur Khusus:
* **Pengelolaan Kurikulum & Konten Manasik (CMS)**:
  * Menambah, mengedit, atau menghapus tahapan rukun, wajib, dan sunnah manasik (Haji & Umroh).
  * Mengelola doa-doa manasik (Teks Arab berharakat, transliterasi Latin, terjemahan Indonesia, dan jumlah pengulangan).
  * Menyusun tips ramah lansia (*Elderly Tips*) pada setiap pos tahapan.
  * Mengatur panduan larangan ihram serta amalan yang dianjurkan (*Do & Don'ts*).
  * Mengedit bank soal evaluasi pemahaman (Kuis Fiqih Manasik) beserta pembahasan kunci jawaban.
  * Ekspor dan Impor materi kurikulum dalam format file JSON.
* **Mode Presentasi Bimbingan (Presentation Mode)**:
  * Menjalankan slide interaktif materi manasik untuk presentasi di hadapan jamaah saat bimbingan tatap muka, lengkap dengan catatan pembimbing (*presenter notes*).
* **Pemantauan Jamaah Online**:
  * Memantau jumlah jamaah yang sedang aktif belajar secara real-time via badge navbar.
* **Batasan**:
  * *Tidak memiliki akses* ke menu Super Admin (tidak dapat mengelola user lain, mengubah role, atau melihat audit log).

#### Akun Bawaan (Default):
| Nama | Email | Password | Role | Status | Instansi / Kloter |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ustadz Hilman Fawzi, M.Ag** | `ustadz@manasik.id` | `ustadz123` | `admin` | `approved` | KBIHU Al-Mabroor Jakarta |

---

### 3. 🧕 Jamaah (`jamaah`) & Tamu Umum (Guest)
Peran bagi calon jamaah haji atau umroh untuk mempelajari materi manasik secara mandiri dan terstruktur.

#### Wewenang & Fitur:
* **Panduan Manasik Step-by-Step**:
  * Mempelajari tahapan ibadah secara urut (mulai dari Ihram di Miqat hingga Thawaf Wada').
  * Beralih antara kategori **Umroh** dan **Haji** dengan satu sentuhan.
* **Audio Doa & Bantuan Lansia (Elderly Friendly)**:
  * Memutar pelafalan audio doa otomatis (*Text-to-Speech*) dengan kontrol kecepatan suara yang dapat diperlambat.
  * Pengaturan ukuran teks (*Normal*, *Besar*, *Sangat Besar*) dan mode kontras tinggi (*High Contrast*) untuk kenyamanan mata jamaah lanjut usia.
* **Pencatatan Progres Belajar Mandiri**:
  * Menandai status penguasaan materi pada tiap tahapan: `Belum Dibaca`, `Paham`, atau `Perlu Diulangi`.
  * Menambahkan catatan pribadi untuk bekal saat berada di tanah suci.
* **Evaluasi Pemahaman (Kuis Interaktif)**:
  * Mengerjakan latihan soal pemahaman manasik dengan skor langsung dan pembahasan fiqih.
* **Alur Pendaftaran (Registrasi)**:
  * Calon jamaah dapat mendaftar mandiri melalui form registrasi di web. Akun baru akan masuk ke antrean *Pending* untuk diverifikasi oleh Super Admin.
  * *Catatan:* Seluruh panduan manasik dan audio doa tetap dapat diakses bebas oleh jamaah maupun pengunjung umum (Guest) tanpa harus login terlebih dahulu.

#### Akun Contoh:
| Nama | Email | Password | Role | Status | Keterangan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hj. Siti Aminah** | `siti.aminah@gmail.com` | `jamaah123` | `jamaah` | `approved` | Jamaah aktif (Kloter 12 JKS) |
| **Bpk. Hendra Kusuma** | `hendra.kusuma@gmail.com` | `jamaah123` | `jamaah` | `pending` | Contoh akun menunggu persetujuan |
| **Farhan Maulana** | `farhan.suspended@gmail.com` | `jamaah123` | `jamaah` | `suspended` | Contoh akun ditangguhkan |

---

## 🚦 Siklus Status Akun Pengguna

Setiap akun pengguna dalam sistem memiliki salah satu status berikut:

| Status | Arti & Hak Akses |
| :--- | :--- |
| **`approved`** | **Disetujui / Aktif**: Pengguna dapat login dan mengakses seluruh fitur sesuai role yang dimiliki. |
| **`pending`** | **Menunggu Persetujuan**: Akun baru hasil registrasi mandiri. Pengguna belum dapat login hingga diverifikasi oleh Super Admin. |
| **`suspended`** | **Ditangguhkan**: Akun dibekukan sementara oleh Super Admin disertai alasan tertulis. Pengguna tidak dapat login. |
| **`rejected`** | **Ditolak**: Pendaftaran akun ditolak oleh Super Admin. |

---

## 🛠️ Ringkasan Matriks Fitur & Hak Akses

| Fitur / Modul | Guest / Tamu | Jamaah (`jamaah`) | Admin (`admin`) | Super Admin (`super_admin`) |
| :--- | :---: | :---: | :---: | :---: |
| **Baca Panduan Haji & Umroh** | ✅ | ✅ | ✅ | ✅ |
| **Putar Audio Doa & Teks Latin/Arab** | ✅ | ✅ | ✅ | ✅ |
| **Fitur Aksesibilitas & Bantuan Lansia** | ✅ | ✅ | ✅ | ✅ |
| **Kerjakan Kuis Pemahaman** | ✅ | ✅ | ✅ | ✅ |
| **Simpan Progres Belajar & Catatan** | ✅ *(Lokal)* | ✅ *(Tersimpan)* | ✅ | ✅ |
| **Mode Presentasi Bimbingan** | ❌ | ❌ | ✅ | ✅ |
| **Lihat Indikator Pengunjung Online** | ❌ | ❌ | ✅ | ✅ |
| **CMS: Edit Materi, Doa & Kuis** | ❌ | ❌ | ✅ | ✅ |
| **CMS: Export & Import Kurikulum** | ❌ | ❌ | ✅ | ✅ |
| **Panel Manajemen Pengguna (CRUD)** | ❌ | ❌ | ❌ | ✅ |
| **Approval / Reject Pendaftaran User** | ❌ | ❌ | ❌ | ✅ |
| **Suspend / Unsuspend Akun Pengguna** | ❌ | ❌ | ❌ | ✅ |
| **Ubah Hak Akses / Role Pengguna** | ❌ | ❌ | ❌ | ✅ |
| **Lihat Audit Log Aktivitas Sistem** | ❌ | ❌ | ❌ | ✅ |
| **Reset Statistik Kunjungan Jamaah** | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Instal dependensi**:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment Variables**:
   Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi konfigurasi Supabase Anda (`SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`).

3. **Jalankan aplikasi (Development)**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```
