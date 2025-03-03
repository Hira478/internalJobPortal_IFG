# Website Rekrutmen IFG

Website Rekrutmen IFG adalah aplikasi web yang dirancang untuk memfasilitasi proses rekrutmen dan manajemen karyawan di lingkungan IFG (Indonesia Financial Group). Aplikasi ini menyediakan fitur untuk mengelola data karyawan, lowongan pekerjaan, dan proses aplikasi pekerjaan.

## Fitur Utama

1. **Manajemen Karyawan**

   - Tambah, edit, dan hapus data karyawan
   - Lihat detail informasi karyawan termasuk riwayat pendidikan, pengalaman kerja, sertifikasi, dan riwayat organisasi
   - Upload data karyawan melalui file Excel

2. **Manajemen Lowongan Pekerjaan**

   - Buat, edit, dan hapus lowongan pekerjaan
   - Lihat daftar lowongan pekerjaan yang tersedia

3. **Proses Aplikasi Pekerjaan**

   - Karyawan dapat melamar pekerjaan internal
   - HRD dapat mengelola dan memproses aplikasi pekerjaan

4. **Talent Mobility**

   - Pantau dan kelola mobilitas talent antar perusahaan dalam grup IFG

5. **Laporan dan Analisis**

   - Lihat berbagai laporan terkait karyawan dan proses rekrutmen

6. **Manajemen Pengguna**
   - Sistem multi-user dengan peran berbeda (superadmin, HRD, karyawan)

## Teknologi yang Digunakan

- **Frontend**: Next.js 13 (App Router), React 18
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **UI Components**: shadcn/ui
- **Form Handling**: react-hook-form
- **Data Fetching**: SWR
- **File Upload**: XLSX.js untuk parsing Excel

## Persyaratan Sistem

- Node.js (versi 16 atau lebih tinggi)
- PostgreSQL
- npm atau yarn

## Prasyarat

Sebelum memulai instalasi, pastikan Anda telah memiliki:

- Node.js (versi 14 atau lebih tinggi)
- npm (biasanya terinstal bersama Node.js)
- PostgreSQL (pastikan server database sudah berjalan)
- Git

## Langkah-langkah Instalasi

Ikuti langkah-langkah berikut untuk menginstal dan menjalankan Website Rekrutmen IFG:

1. Clone repositori proyek (jika belum dilakukan)

2. Install dependensi proyek:

```plaintext
npm install
```

3. Salin file `.env.example` menjadi `.env` dan sesuaikan konfigurasi:

```plaintext
cp .env.example .env
```

Buka file `.env` dan pastikan `DATABASE_URL` sudah diisi dengan URL koneksi database PostgreSQL Anda.

4. Jalankan migrasi database untuk membuat skema:

```plaintext
npx prisma migrate dev
```

Ini akan membuat skema database berdasarkan model Prisma yang telah didefinisikan.

5. Jalankan seeding data menggunakan file `prisma/seed.js` dan seeding tambahan users yang berada di file `seed-users.js` yang telah kita modifikasi:

```plaintext
npx prisma db seed
```

Ini akan mengisi database dengan data perusahaan dan pengguna awal.

6. Verifikasi bahwa seeding berhasil dengan memeriksa database menggunakan Prisma Studio:

```plaintext
npx prisma studio
```

Buka browser dan akses URL yang ditampilkan (biasanya [http://localhost:5555](http://localhost:5555)) untuk melihat data yang telah di-seed.

7. Generate Prisma Client:

```plaintext
npx prisma generate
```

Ini akan menghasilkan Prisma Client berdasarkan skema database terbaru.

8. Jalankan aplikasi dalam mode development:

```plaintext
npm run dev
```

9. Buka browser dan akses `http://localhost:3000` untuk melihat aplikasi berjalan.

Catatan tambahan:

- Pastikan PostgreSQL sudah terinstal dan berjalan di sistem Anda.
- Jika Anda mengalami masalah dengan koneksi database, periksa kembali `DATABASE_URL` di file `.env`.
- Jika ada perubahan pada skema database di masa mendatang, Anda perlu menjalankan `npx prisma migrate dev` lagi untuk memperbarui skema database.

Setelah mengikuti langkah-langkah di atas, aplikasi Website Rekrutmen IFG seharusnya sudah terinstal dan berjalan dengan data awal yang telah di-seed. Anda dapat mulai menggunakan aplikasi dengan login menggunakan salah satu akun yang telah di-seed, misalnya:

- Email: [admin@bpui.co.id](mailto:admin@bpui.co.id)
- Password: admin123
