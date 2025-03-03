"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEmployeeById } from "@/app/actions/serverActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Employee } from "@/types";
import { formatDate } from "@/lib/utils";

export default function EmployeeDetailPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const employeeData = await getEmployeeById(Number(id));
        if (employeeData) {
          setEmployee(employeeData);
        } else {
          setError("Employee not found");
        }
      } catch (err) {
        console.error("Error fetching employee details:", err);
        setError("Failed to fetch employee details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEmployeeDetails();
    }
  }, [id]);

  if (isLoading) {
    return <div className="p-8">Loading employee details...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  if (!employee) {
    return <div className="p-8">No employee data found</div>;
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Detail Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-200px)] pr-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Nama Lengkap</h3>
                  <p>{employee.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Email</h3>
                  <p>{employee.email}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Tanggal Lahir</h3>
                  <p>
                    {employee.birthDate
                      ? formatDate(employee.birthDate)
                      : "Tidak ada data"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Posisi</h3>
                  <p>{employee.position}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Divisi</h3>
                  <p>{employee.department}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Perusahaan</h3>
                  <p>{employee.company?.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Level</h3>
                  <p>{employee.level}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Rumpun Jabatan</h3>
                  <p>{employee.rumpunJabatan}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Talent Mobility</h3>
                  <p>{employee.talentMobility}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Pendidikan</h3>
                {employee.pendidikanKaryawan &&
                employee.pendidikanKaryawan.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {employee.pendidikanKaryawan.map((edu, index) => (
                      <li key={index}>
                        {edu.jenjang} - {edu.namaInstitut}, {edu.jurusan} (
                        {edu.tahunMasuk} - {edu.tahunAkhir})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Tidak ada data pendidikan</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Pengalaman Kerja</h3>
                {employee.workExperiences &&
                employee.workExperiences.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {employee.workExperiences.map((exp, index) => (
                      <li key={index}>
                        {exp.position} di {exp.company} (
                        {formatDate(exp.startDate)} -{" "}
                        {exp.endDate ? formatDate(exp.endDate) : "Sekarang"})
                        <p className="text-sm text-gray-600">
                          {exp.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Tidak ada data pengalaman kerja</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Sertifikasi</h3>
                {employee.certifications &&
                employee.certifications.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {employee.certifications.map((cert, index) => (
                      <li key={index}>
                        {cert.name} - {cert.issuer} (
                        {formatDate(cert.issueDate)})
                        {cert.expiryDate &&
                          ` - Kadaluarsa: ${formatDate(cert.expiryDate)}`}
                        <p className="text-sm text-gray-600">
                          {cert.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Tidak ada data sertifikasi</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Riwayat Organisasi
                </h3>
                {employee.organizationHistories &&
                employee.organizationHistories.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2">
                    {employee.organizationHistories.map((org, index) => (
                      <li key={index}>
                        {org.position} di {org.organization} (
                        {formatDate(org.startDate)} -{" "}
                        {org.endDate ? formatDate(org.endDate) : "Sekarang"})
                        <p className="text-sm text-gray-600">
                          {org.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Tidak ada data riwayat organisasi</p>
                )}
              </div>
            </div>
          </ScrollArea>
          <div className="mt-6">
            <Button onClick={() => router.back()}>Kembali</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
