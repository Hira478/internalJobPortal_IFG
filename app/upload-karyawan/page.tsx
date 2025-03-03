import { UploadEmployeeData } from "@/components/UploadEmployeeData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UploadKaryawanPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Data Karyawan</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Instruksi</CardTitle>
          <CardDescription>
            Ikuti langkah-langkah berikut untuk mengupload data karyawan:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>Download template Excel dengan mengklik tombol di bawah.</li>
            <li>
              Isi template dengan data karyawan dan data pendidikan sesuai
              format yang disediakan.
            </li>
            <li>Pastikan semua kolom wajib telah diisi dengan benar.</li>
            <li>Simpan file Excel yang telah diisi.</li>
            <li>
              Upload file Excel yang telah diisi menggunakan form di bawah.
            </li>
            <li>Tunggu hingga proses upload dan validasi selesai.</li>
          </ol>
        </CardContent>
      </Card>
      <div className="mb-6">
        <Button asChild>
          <a href="/api/download-template" download>
            Download Template Excel
          </a>
        </Button>
      </div>
      <UploadEmployeeData />
    </div>
  );
}
