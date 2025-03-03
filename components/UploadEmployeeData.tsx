"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from "xlsx";
import { seedEmployeeData } from "@/app/actions/serverActions";
import { useToast } from "@/components/ui/use-toast";

export function UploadEmployeeData() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [previewData, setPreviewData] = useState<{ [key: string]: any[] }>({});
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const validateData = (sheets: { [key: string]: any[] }) => {
    const requiredSheets = [
      "Data Karyawan",
      "Data Pendidikan",
      "Pengalaman Kerja",
      "Sertifikasi",
      "Riwayat Organisasi",
    ];
    const sheetFields = {
      "Data Karyawan": [
        "ID Karyawan",
        "Nama Lengkap",
        "Email",
        "Tanggal Lahir",
        "Posisi",
        "Departemen",
        "Level",
        "Rumpun Jabatan",
        "Talent Mobility",
        "ID Perusahaan",
      ],
      "Data Pendidikan": [
        "ID Karyawan",
        "Jenjang Pendidikan",
        "Nama Institusi",
        "Jurusan",
        "Tahun Masuk",
        "Tahun Lulus",
      ],
      "Pengalaman Kerja": [
        "ID Karyawan",
        "Nama Perusahaan",
        "Posisi",
        "Tanggal Mulai",
        "Tanggal Selesai",
        "Deskripsi",
      ],
      Sertifikasi: [
        "ID Karyawan",
        "Nama Sertifikasi",
        "Penerbit",
        "Tanggal Terbit",
        "Tanggal Kadaluarsa",
        "Deskripsi",
      ],
      "Riwayat Organisasi": [
        "ID Karyawan",
        "Nama Organisasi",
        "Posisi",
        "Tanggal Mulai",
        "Tanggal Selesai",
        "Deskripsi",
      ],
    };

    for (const sheet of requiredSheets) {
      if (!sheets[sheet] || sheets[sheet].length === 0) {
        throw new Error(`Sheet "${sheet}" tidak ditemukan atau kosong`);
      }

      const fields = sheetFields[sheet as keyof typeof sheetFields];
      for (const field of fields) {
        if (!sheets[sheet][0].hasOwnProperty(field)) {
          throw new Error(
            `Field "${field}" tidak ditemukan di sheet "${sheet}"`
          );
        }
      }
    }

    const validLevels = ["BOD-1", "BOD-2", "BOD-3", "BOD-4", "BOD-5"];
    const validEducationLevels = ["D3", "S1", "S2", "S3"];
    const validCompanyIds = Array.from({ length: 11 }, (_, i) => i + 1);

    const isValidDate = (dateString: string) => {
      const date = new Date(dateString);
      return !isNaN(date.getTime());
    };

    sheets["Data Karyawan"].forEach((employee, index) => {
      const rowNumber = index + 3;

      if (!employee["ID Karyawan"])
        throw new Error(
          `ID Karyawan kosong pada baris ${rowNumber} di sheet Data Karyawan`
        );
      if (!employee["Email"])
        throw new Error(
          `Email kosong pada baris ${rowNumber} di sheet Data Karyawan`
        );

      const birthDate = employee["Tanggal Lahir"];
      if (!isValidDate(birthDate)) {
        throw new Error(
          `Format Tanggal Lahir tidak valid pada baris ${rowNumber} di sheet Data Karyawan. Pastikan sel diformat sebagai tanggal di Excel.`
        );
      }

      if (!["Yes", "No"].includes(employee["Talent Mobility"]))
        throw new Error(
          `Talent Mobility harus diisi dengan "Yes" atau "No" pada baris ${rowNumber} di sheet Data Karyawan`
        );
      if (!validLevels.includes(employee["Level"]))
        throw new Error(
          `Level karyawan tidak valid pada baris ${rowNumber} di sheet Data Karyawan. Gunakan salah satu dari: ${validLevels.join(
            ", "
          )}`
        );
      if (!validCompanyIds.includes(Number(employee["ID Perusahaan"])))
        throw new Error(
          `ID Perusahaan tidak valid pada baris ${rowNumber} di sheet Data Karyawan. Gunakan ID antara 1 sampai 11`
        );
    });

    sheets["Data Pendidikan"].forEach((education, index) => {
      const rowNumber = index + 3;
      if (!validEducationLevels.includes(education["Jenjang Pendidikan"]))
        throw new Error(
          `Jenjang Pendidikan tidak valid pada baris ${rowNumber} di sheet Data Pendidikan. Gunakan salah satu dari: ${validEducationLevels.join(
            ", "
          )}`
        );
    });
  };

  const processDate = (dateValue: any): Date | null => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;
    if (typeof dateValue === "number") {
      // Excel stores dates as number of days since 1/1/1900
      return new Date(Date.UTC(1900, 0, dateValue - 1));
    }
    if (typeof dateValue === "string") {
      const parsedDate = new Date(dateValue);
      return isNaN(parsedDate.getTime()) ? null : parsedDate;
    }
    return null;
  };

  const handlePreview = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Pilih file terlebih dahulu",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        const sheets: { [key: string]: any[] } = {};
        workbook.SheetNames.forEach((sheetName) => {
          if (sheetName !== "Petunjuk") {
            const worksheet = workbook.Sheets[sheetName];
            const allRows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const [headers, _, ...dataRows] = allRows;
            sheets[sheetName] = dataRows.map((row) => {
              return headers.reduce((obj, header, index) => {
                obj[header] = row[index];
                return obj;
              }, {});
            });
          }
        });

        validateData(sheets);
        setPreviewData(sheets);
        setIsPreviewModalOpen(true);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error("Error processing file:", errorMsg);
        toast({
          title: "Error",
          description: `Error: ${errorMsg}`,
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    setUploadStatus("uploading");
    setIsUploading(true);
    setErrorMessage("");

    try {
      console.log("Starting upload process");
      const result = await seedEmployeeData(previewData);
      console.log("Seed result:", result);

      if (result.success) {
        setUploadStatus("success");
        toast({
          title: "Success",
          description: "Data berhasil diupload dan disimpan",
        });
      } else {
        throw new Error(
          result.error || "Terjadi kesalahan saat menyimpan data"
        );
      }
    } catch (error) {
      setUploadStatus("error");
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error("Detailed error:", errorMsg);
      setErrorMessage(errorMsg);
      toast({
        title: "Error",
        description: `Error: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setIsPreviewModalOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data Karyawan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Input
            type="file"
            onChange={handleFileChange}
            accept=".xlsx, .xls"
            disabled={isUploading}
          />
          <Button onClick={handlePreview} disabled={isUploading || !file}>
            Preview
          </Button>
        </div>
        {uploadStatus === "uploading" && <p>Sedang mengupload data...</p>}
        {uploadStatus === "success" && (
          <p className="text-green-600">Data berhasil diupload dan disimpan.</p>
        )}
        {uploadStatus === "error" && (
          <div>
            <p className="text-red-600">
              Terjadi kesalahan saat mengupload data.
            </p>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        )}

        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Preview Data</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[60vh]">
              {Object.entries(previewData).map(([sheetName, data]) => (
                <div key={sheetName} className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">{sheetName}</h3>
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        {Object.keys(data[0] || {}).map((header) => (
                          <th
                            key={header}
                            className="border border-gray-300 px-2 py-1 bg-gray-100"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="border border-gray-300 px-2 py-1"
                            >
                              {value?.toString() || ""}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </ScrollArea>
            <DialogFooter>
              <Button
                onClick={() => setIsPreviewModalOpen(false)}
                variant="outline"
              >
                Batal
              </Button>
              <Button onClick={handleUpload} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
