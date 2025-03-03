import { type NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

function generateExcelTemplate() {
  const workbook = XLSX.utils.book_new();

  // Data Karyawan sheet
  const dataKaryawanWs = XLSX.utils.json_to_sheet([
    {
      "ID Karyawan": "Contoh: K001",
      "Nama Lengkap": "Contoh: John Doe",
      Email: "Contoh: john.doe@example.com",
      "Tanggal Lahir": "Contoh: 1990-01-01",
      Posisi: "Contoh: Manager",
      Departemen: "Contoh: IT",
      Level: "Contoh: BOD-3",
      "Rumpun Jabatan": "Contoh: Technical",
      "Talent Mobility": "Contoh: Yes",
      "ID Perusahaan": "Contoh: 1",
    },
    {}, // Empty row for user input
  ]);
  XLSX.utils.book_append_sheet(workbook, dataKaryawanWs, "Data Karyawan");

  // Data Pendidikan sheet
  const dataPendidikanWs = XLSX.utils.json_to_sheet([
    {
      "ID Karyawan": "Contoh: K001",
      "Jenjang Pendidikan": "Contoh: S1",
      "Nama Institusi": "Contoh: Universitas Indonesia",
      Jurusan: "Contoh: Teknik Informatika",
      "Tahun Masuk": "Contoh: 2010",
      "Tahun Lulus": "Contoh: 2014",
    },
    {}, // Empty row for user input
  ]);
  XLSX.utils.book_append_sheet(workbook, dataPendidikanWs, "Data Pendidikan");

  // Pengalaman Kerja sheet
  const pengalamanKerjaWs = XLSX.utils.json_to_sheet([
    {
      "ID Karyawan": "Contoh: K001",
      "Nama Perusahaan": "Contoh: PT XYZ",
      Posisi: "Contoh: Software Developer",
      "Tanggal Mulai": "Contoh: 2015-01-01",
      "Tanggal Selesai": "Contoh: 2020-12-31",
      Deskripsi: "Contoh: Pengembangan aplikasi web",
    },
    {}, // Empty row for user input
  ]);
  XLSX.utils.book_append_sheet(workbook, pengalamanKerjaWs, "Pengalaman Kerja");

  // Sertifikasi sheet
  const sertifikasiWs = XLSX.utils.json_to_sheet([
    {
      "ID Karyawan": "Contoh: K001",
      "Nama Sertifikasi": "Contoh: AWS Certified Developer",
      Penerbit: "Contoh: Amazon Web Services",
      "Tanggal Terbit": "Contoh: 2021-06-01",
      "Tanggal Kadaluarsa": "Contoh: 2024-06-01",
      Deskripsi: "Contoh: Sertifikasi untuk pengembang AWS",
    },
    {}, // Empty row for user input
  ]);
  XLSX.utils.book_append_sheet(workbook, sertifikasiWs, "Sertifikasi");

  // Riwayat Organisasi sheet
  const riwayatOrganisasiWs = XLSX.utils.json_to_sheet([
    {
      "ID Karyawan": "Contoh: K001",
      "Nama Organisasi": "Contoh: Komunitas Programmer Indonesia",
      Posisi: "Contoh: Ketua",
      "Tanggal Mulai": "Contoh: 2018-01-01",
      "Tanggal Selesai": "Contoh: 2020-12-31",
      Deskripsi: "Contoh: Memimpin komunitas dengan 1000+ anggota",
    },
    {}, // Empty row for user input
  ]);
  XLSX.utils.book_append_sheet(
    workbook,
    riwayatOrganisasiWs,
    "Riwayat Organisasi"
  );

  // Add instructions sheet
  const instructionsWs = XLSX.utils.aoa_to_sheet([
    ["Petunjuk Pengisian Template:"],
    ["1. Isi data pada setiap sheet sesuai dengan contoh yang diberikan."],
    [
      "2. Pastikan ID Karyawan konsisten di semua sheet untuk data yang berkaitan dengan karyawan yang sama.",
    ],
    [
      "   Catatan: ID Karyawan digunakan untuk mencocokkan data antar sheet, bukan sebagai ID di database.",
    ],
    ["3. Format tanggal: YYYY-MM-DD (contoh: 2023-05-25)"],
    ['4. Untuk kolom Talent Mobility, isi dengan "Yes" atau "No".'],
    [
      "5. ID Perusahaan harus sesuai dengan ID yang ada di sistem. Lihat daftar perusahaan di bawah.",
    ],
    [
      "6. Level karyawan harus diisi dengan salah satu dari: BOD-1, BOD-2, BOD-3, BOD-4, atau BOD-5.",
    ],
    [
      "7. Jenjang Pendidikan harus diisi dengan salah satu dari: D3, S1, S2, atau S3.",
    ],
    [
      "8. Pastikan untuk mengisi Tanggal Lahir pada sheet Data Karyawan dengan format yang benar (YYYY-MM-DD).",
    ],
    ["9. Jika ada kolom yang tidak relevan, biarkan kosong."],
    ["10. Tambahkan baris sesuai kebutuhan untuk setiap karyawan."],
    [""],
    ["Daftar Perusahaan:"],
    ["ID | Nama Perusahaan"],
    ["1  | PT Bahana Pembinaan Usaha Indonesia (Persero)"],
    ["2  | PT Asuransi Kerugian Jasa Raharja"],
    ["3  | PT Jaminan Kredit Indonesia"],
    ["4  | PT Asuransi Kredit Indonesia"],
    ["5  | PT Asuransi Jasa Indonesia"],
    ["6  | PT Asuransi Jiwa IFG Life"],
    ["7  | PT Bahana TCW Investment Management"],
    ["8  | PT Bahana Sekuritas"],
    ["9  | PT Bahana Artha Ventura"],
    ["10 | PT Bahana Kapital Investa"],
    ["11 | PT Grahaniaga Tatautama"],
  ]);
  XLSX.utils.book_append_sheet(workbook, instructionsWs, "Petunjuk");

  // Write to buffer
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buffer;
}

export async function GET(request: NextRequest) {
  const buffer = generateExcelTemplate();

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=template-karyawan.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
