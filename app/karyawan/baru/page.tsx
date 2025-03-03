"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  addEmployee,
  updateEmployee,
  getEmployeeById,
  getCompanies,
} from "../../actions/serverActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Employee, Company } from "@/types";

const levelOptions = ["BOD-1", "BOD-2", "BOD-3", "BOD-4", "BOD-5"];
const educationLevels = ["D3", "S1", "S2", "S3"];

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return date;
};

export default function NewEmployeePage() {
  const [employee, setEmployee] = useState<Partial<Employee>>({
    name: "",
    email: "",
    birthDate: undefined,
    position: "",
    department: "",
    companyId: 0,
    level: "",
    rumpunJabatan: "",
    talentMobility: "No",
    pendidikanKaryawan: [],
    workExperiences: [],
    certifications: [],
    organizationHistories: [],
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const employeeId = searchParams.get("id");

  useEffect(() => {
    fetchCompanies();
    if (employeeId) {
      fetchEmployee(Number.parseInt(employeeId));
    } else if (user?.role === "hrd" && user?.companyId) {
      setEmployee((prev) => ({ ...prev, companyId: user.companyId }));
    }
  }, [employeeId, user]);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({ title: "Gagal memuat data perusahaan", variant: "destructive" });
    }
  };

  const fetchEmployee = async (id: number) => {
    try {
      const data = await getEmployeeById(id);
      setEmployee(data);
    } catch (error) {
      console.error("Error fetching employee:", error);
      toast({ title: "Gagal memuat data karyawan", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const employeeData = {
        ...employee,
        company: { id: Number(employee.companyId) },
      };

      if (employeeId) {
        await updateEmployee(employeeData as Employee);
        toast({ title: "Data karyawan berhasil diperbarui" });
      } else {
        await addEmployee(employeeData as Omit<Employee, "id">);
        toast({ title: "Karyawan baru berhasil ditambahkan" });
      }
      router.push("/karyawan");
    } catch (error) {
      console.error("Error saving employee:", error);
      toast({ title: "Gagal menyimpan data karyawan", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setEmployee((prev) => ({
      ...prev,
      [name]: name === "companyId" ? Number(value) : value,
    }));
  };

  const handleArrayChange = (
    index: number,
    field: keyof Employee,
    subField: string,
    value: string
  ) => {
    setEmployee((prev) => {
      const newArray = [...(prev[field] as any[])];
      newArray[index] = {
        ...newArray[index],
        [subField]: [
          "startDate",
          "endDate",
          "issueDate",
          "expiryDate",
        ].includes(subField)
          ? value
            ? new Date(value)
            : null
          : value,
      };
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: keyof Employee) => {
    setEmployee((prev) => ({
      ...prev,
      [field]: [...(prev[field] as any[]), {}],
    }));
  };

  const removeArrayItem = (field: keyof Employee, index: number) => {
    setEmployee((prev) => ({
      ...prev,
      [field]: (prev[field] as any[]).filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>
            {employeeId ? "Edit Karyawan" : "Tambah Karyawan Baru"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Informasi Pribadi</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    value={employee.name}
                    onChange={handleChange}
                    name="name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={employee.email}
                    onChange={handleChange}
                    name="email"
                  />
                </div>
                <div>
                  <Label htmlFor="birthDate">Tanggal Lahir</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formatDate(employee.birthDate)}
                    onChange={handleChange}
                    name="birthDate"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Jabatan</Label>
                  <Input
                    id="position"
                    value={employee.position}
                    onChange={handleChange}
                    name="position"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Departemen</Label>
                  <Input
                    id="department"
                    value={employee.department}
                    onChange={handleChange}
                    name="department"
                  />
                </div>
                <div>
                  <Label htmlFor="companyId">Perusahaan</Label>
                  <Select
                    value={employee.companyId?.toString()}
                    onValueChange={(value) =>
                      handleSelectChange("companyId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Perusahaan" />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem
                          key={company.id}
                          value={company.id.toString()}
                        >
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={employee.level}
                    onValueChange={(value) =>
                      handleSelectChange("level", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levelOptions.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rumpunJabatan">Rumpun Jabatan</Label>
                  <Input
                    id="rumpunJabatan"
                    value={employee.rumpunJabatan}
                    onChange={handleChange}
                    name="rumpunJabatan"
                  />
                </div>
                <div>
                  <Label htmlFor="talentMobility">Talent Mobility</Label>
                  <Select
                    value={employee.talentMobility}
                    onValueChange={(value) =>
                      handleSelectChange("talentMobility", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Talent Mobility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Education section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Data Pendidikan</h2>
              {employee.pendidikanKaryawan?.map((edu, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 border rounded"
                >
                  <div>
                    <Label htmlFor={`education-${index}-jenjang`}>
                      Jenjang
                    </Label>
                    <Select
                      value={edu.jenjang}
                      onValueChange={(value) =>
                        handleArrayChange(
                          index,
                          "pendidikanKaryawan",
                          "jenjang",
                          value
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenjang" />
                      </SelectTrigger>
                      <SelectContent>
                        {educationLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`education-${index}-namaInstitut`}>
                      Institusi
                    </Label>
                    <Input
                      id={`education-${index}-namaInstitut`}
                      value={edu.namaInstitut}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "pendidikanKaryawan",
                          "namaInstitut",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`education-${index}-jurusan`}>
                      Jurusan
                    </Label>
                    <Input
                      id={`education-${index}-jurusan`}
                      value={edu.jurusan}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "pendidikanKaryawan",
                          "jurusan",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`education-${index}-tahunMasuk`}>
                      Tahun Masuk
                    </Label>
                    <Input
                      id={`education-${index}-tahunMasuk`}
                      type="number"
                      value={edu.tahunMasuk}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "pendidikanKaryawan",
                          "tahunMasuk",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`education-${index}-tahunAkhir`}>
                      Tahun Lulus
                    </Label>
                    <Input
                      id={`education-${index}-tahunAkhir`}
                      type="number"
                      value={edu.tahunAkhir}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "pendidikanKaryawan",
                          "tahunAkhir",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeArrayItem("pendidikanKaryawan", index)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              {(employee.pendidikanKaryawan?.length || 0) < 5 && (
                <Button
                  type="button"
                  onClick={() => addArrayItem("pendidikanKaryawan")}
                >
                  Tambah Pendidikan
                </Button>
              )}
            </div>

            {/* Work Experience section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pengalaman Kerja</h2>
              {employee.workExperiences?.map((exp, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 border rounded"
                >
                  <div>
                    <Label htmlFor={`experience-${index}-company`}>
                      Nama Perusahaan
                    </Label>
                    <Input
                      id={`experience-${index}-company`}
                      value={exp.company}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "workExperiences",
                          "company",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`experience-${index}-position`}>
                      Jabatan
                    </Label>
                    <Input
                      id={`experience-${index}-position`}
                      value={exp.position}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "workExperiences",
                          "position",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`experience-${index}-startDate`}>
                      Periode Mulai
                    </Label>
                    <Input
                      id={`experience-${index}-startDate`}
                      type="date"
                      value={formatDate(exp.startDate)}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "workExperiences",
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`experience-${index}-endDate`}>
                      Periode Selesai
                    </Label>
                    <Input
                      id={`experience-${index}-endDate`}
                      type="date"
                      value={formatDate(exp.endDate)}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "workExperiences",
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`experience-${index}-description`}>
                      Deskripsi
                    </Label>
                    <Textarea
                      id={`experience-${index}-description`}
                      value={exp.description}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "workExperiences",
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeArrayItem("workExperiences", index)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addArrayItem("workExperiences")}
              >
                Tambah Pengalaman Kerja
              </Button>
            </div>

            {/* Certifications section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Sertifikasi</h2>
              {employee.certifications?.map((cert, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 border rounded"
                >
                  <div>
                    <Label htmlFor={`certification-${index}-name`}>
                      Nama Sertifikasi
                    </Label>
                    <Input
                      id={`certification-${index}-name`}
                      value={cert.name}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "certifications",
                          "name",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`certification-${index}-issuer`}>
                      Penerbit
                    </Label>
                    <Input
                      id={`certification-${index}-issuer`}
                      value={cert.issuer}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "certifications",
                          "issuer",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`certification-${index}-issueDate`}>
                      Tanggal Terbit
                    </Label>
                    <Input
                      id={`certification-${index}-issueDate`}
                      type="date"
                      value={formatDate(cert.issueDate)}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "certifications",
                          "issueDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`certification-${index}-expiryDate`}>
                      Tanggal Kadaluarsa
                    </Label>
                    <Input
                      id={`certification-${index}-expiryDate`}
                      type="date"
                      value={formatDate(cert.expiryDate)}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "certifications",
                          "expiryDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`certification-${index}-description`}>
                      Deskripsi
                    </Label>
                    <Textarea
                      id={`certification-${index}-description`}
                      value={cert.description}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "certifications",
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeArrayItem("certifications", index)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addArrayItem("certifications")}
              >
                Tambah Sertifikasi
              </Button>
            </div>

            {/* Organization History section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Riwayat Organisasi</h2>
              {employee.organizationHistories?.map((org, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 border rounded"
                >
                  <div>
                    <Label htmlFor={`organization-${index}-organization`}>
                      Nama Organisasi
                    </Label>
                    <Input
                      id={`organization-${index}-organization`}
                      value={org.organization}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "organizationHistories",
                          "organization",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`organization-${index}-position`}>
                      Jabatan
                    </Label>
                    <Input
                      id={`organization-${index}-position`}
                      value={org.position}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "organizationHistories",
                          "position",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`organization-${index}-startDate`}>
                      Periode Mulai
                    </Label>
                    <Input
                      id={`organization-${index}-startDate`}
                      type="date"
                      value={formatDate(org.startDate)}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "organizationHistories",
                          "startDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`organization-${index}-endDate`}>
                      Periode Selesai
                    </Label>
                    <Input
                      id={`organization-${index}-endDate`}
                      type="date"
                      value={formatDate(org.endDate)}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "organizationHistories",
                          "endDate",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor={`organization-${index}-description`}>
                      Deskripsi
                    </Label>
                    <Textarea
                      id={`organization-${index}-description`}
                      value={org.description}
                      onChange={(e) =>
                        handleArrayChange(
                          index,
                          "organizationHistories",
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() =>
                      removeArrayItem("organizationHistories", index)
                    }
                  >
                    Hapus
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={() => addArrayItem("organizationHistories")}
              >
                Tambah Riwayat Organisasi
              </Button>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
