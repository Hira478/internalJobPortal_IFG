"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Trash2 } from "lucide-react"
// import { mockCompanies as companies } from "@/app/data/mockData"
import type { Employee } from "@/types"
import { useAuth } from "@/contexts/AuthContext"
import { COMPANIES } from "@/app/data/companies"

type Education = {
  level: string
  institution: string
  major: string
  graduationYear: string
}

type WorkExperience = {
  company: string
  position: string
  startDate: string
  endDate: string
  description: string
}

type Certification = {
  name: string
  issuer: string
  year: string
}

type OrganizationHistory = {
  name: string
  position: string
  startDate: string
  endDate: string
  description: string
}

type EmployeeFormProps = {
  employee?: Employee
  onSubmit: (employee: Employee) => void
  onCancel?: () => void
}

export function EmployeeForm({ employee, onSubmit, onCancel }: EmployeeFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<Omit<Employee, "id">>({
    name: "",
    email: "",
    position: "",
    department: "",
    company: "",
    companyId: 0, // Tambahkan ini
    level: "",
    rumpunJabatan: "",
    talentMobility: "No",
    education: [],
    experience: [],
    certifications: [],
    organizationHistory: [],
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
        education: employee.education || [],
        experience: employee.experience || [],
        certifications: employee.certifications || [],
        organizationHistory: employee.organizationHistory || [],
      })
    } else {
      // Set default company for new employees based on logged in user
      const userCompany = COMPANIES.find((c) => c.id === user?.companyId)
      setFormData((prev) => ({
        ...prev,
        company: userCompany?.name || "",
        companyId: userCompany?.id || 0,
      }))
    }
  }, [employee, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "company") {
      const selectedCompany = COMPANIES.find((c) => c.name === value)
      setFormData((prev) => ({
        ...prev,
        company: value,
        companyId: selectedCompany ? selectedCompany.id : prev.companyId,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    setFormData((prev) => {
      const newEducation = [...prev.education]
      newEducation[index] = { ...newEducation[index], [field]: value }
      return { ...prev, education: newEducation }
    })
  }

  const handleWorkExperienceChange = (index: number, field: keyof WorkExperience, value: string) => {
    setFormData((prev) => {
      const newWorkExperience = [...prev.experience]
      newWorkExperience[index] = { ...newWorkExperience[index], [field]: value }
      return { ...prev, experience: newWorkExperience }
    })
  }

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    setFormData((prev) => {
      const newCertification = [...prev.certifications]
      newCertification[index] = { ...newCertification[index], [field]: value }
      return { ...prev, certifications: newCertification }
    })
  }

  const handleOrganizationHistoryChange = (index: number, field: keyof OrganizationHistory, value: string) => {
    setFormData((prev) => {
      const newOrganizationHistory = [...prev.organizationHistory]
      newOrganizationHistory[index] = { ...newOrganizationHistory[index], [field]: value }
      return { ...prev, organizationHistory: newOrganizationHistory }
    })
  }

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { level: "", institution: "", major: "", graduationYear: "" }],
    }))
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addWorkExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", startDate: "", endDate: "", description: "" }],
    }))
  }

  const removeWorkExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", issuer: "", year: "" }],
    }))
  }

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }))
  }

  const addOrganizationHistory = () => {
    setFormData((prev) => ({
      ...prev,
      organizationHistory: [
        ...prev.organizationHistory,
        { name: "", position: "", startDate: "", endDate: "", description: "" },
      ],
    }))
  }

  const removeOrganizationHistory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      organizationHistory: prev.organizationHistory.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Pastikan HRD hanya dapat menambahkan karyawan untuk perusahaan mereka sendiri
      if (user?.role === "hrd" && formData.companyId !== user.companyId) {
        throw new Error("Anda hanya dapat menambahkan karyawan untuk perusahaan Anda sendiri.")
      }
      console.log("Submitting employee data:", formData) // Log untuk debugging
      await onSubmit(formData)
      console.log("Employee data submitted successfully") // Log untuk debugging
      // Reset form atau tampilkan pesan sukses
    } catch (error) {
      console.error("Error submitting employee data:", error)
      // Tampilkan pesan error kepada pengguna
      alert(error.message || "Terjadi kesalahan saat menambahkan karyawan. Silakan coba lagi.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="position">Posisi</Label>
              <Input id="position" name="position" value={formData.position} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="level">Level</Label>
              <Select name="level" value={formData.level} onValueChange={(value) => handleSelectChange("level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BOD-1">BOD-1</SelectItem>
                  <SelectItem value="BOD-2">BOD-2</SelectItem>
                  <SelectItem value="BOD-3">BOD-3</SelectItem>
                  <SelectItem value="BOD-4">BOD-4</SelectItem>
                  <SelectItem value="BOD-5">BOD-5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Divisi</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="rumpunJabatan">Rumpun Jabatan</Label>
              <Input
                id="rumpunJabatan"
                name="rumpunJabatan"
                value={formData.rumpunJabatan}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="company" className="text-right">
              Perusahaan
            </Label>
            {user?.role === "superadmin" ? (
              <Select
                name="company"
                value={formData.company}
                onValueChange={(value) => handleSelectChange("company", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih perusahaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PT Bahana Pembinaan Usaha Indonesia (Persero)">
                    PT Bahana Pembinaan Usaha Indonesia (Persero)
                  </SelectItem>
                  <SelectItem value="PT Asuransi Kerugian Jasa Raharja">PT Asuransi Kerugian Jasa Raharja</SelectItem>
                  <SelectItem value="PT Jaminan Kredit Indonesia">PT Jaminan Kredit Indonesia</SelectItem>
                  <SelectItem value="PT Asuransi Kredit Indonesia">PT Asuransi Kredit Indonesia</SelectItem>
                  <SelectItem value="PT Asuransi Jasa Indonesia">PT Asuransi Jasa Indonesia</SelectItem>
                  <SelectItem value="PT Asuransi Jiwa IFG Life">PT Asuransi Jiwa IFG Life</SelectItem>
                  <SelectItem value="PT Bahana TCW Investment Management">
                    PT Bahana TCW Investment Management
                  </SelectItem>
                  <SelectItem value="PT Bahana Sekuritas">PT Bahana Sekuritas</SelectItem>
                  <SelectItem value="PT Bahana Artha Ventura">PT Bahana Artha Ventura</SelectItem>
                  <SelectItem value="PT Bahana Kapital Investa">PT Bahana Kapital Investa</SelectItem>
                  <SelectItem value="PT Grahaniaga Tatautama">PT Grahaniaga Tatautama</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Input className="col-span-3" value={formData.company} disabled />
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="talentMobility" className="text-right">
              Talent Mobility
            </Label>
            <Select
              name="talentMobility"
              value={formData.talentMobility}
              onValueChange={(value) => handleSelectChange("talentMobility", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Pilih status Talent Mobility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Pendidikan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.education.map((pendidikan, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`jenjang-${index}`}>Jenjang</Label>
                  <Select
                    value={pendidikan.level}
                    onValueChange={(value) => handleEducationChange(index, "level", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D3">D3</SelectItem>
                      <SelectItem value="S1">S1</SelectItem>
                      <SelectItem value="S2">S2</SelectItem>
                      <SelectItem value="S3">S3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor={`institusi-${index}`}>Institusi</Label>
                  <Input
                    id={`institusi-${index}`}
                    value={pendidikan.institution}
                    onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`jurusan-${index}`}>Jurusan</Label>
                  <Input
                    id={`jurusan-${index}`}
                    value={pendidikan.major}
                    onChange={(e) => handleEducationChange(index, "major", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`graduationYear-${index}`}>Tahun Lulus</Label>
                  <Input
                    id={`graduationYear-${index}`}
                    value={pendidikan.graduationYear}
                    onChange={(e) => handleEducationChange(index, "graduationYear", e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="button" variant="destructive" onClick={() => removeEducation(index)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Pendidikan
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addEducation}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pendidikan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengalaman Kerja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.experience.map((pengalaman, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`namaPerusahaan-${index}`}>Nama Perusahaan</Label>
                  <Input
                    id={`namaPerusahaan-${index}`}
                    value={pengalaman.company}
                    onChange={(e) => handleWorkExperienceChange(index, "company", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`jabatan-${index}`}>Jabatan</Label>
                  <Input
                    id={`jabatan-${index}`}
                    value={pengalaman.position}
                    onChange={(e) => handleWorkExperienceChange(index, "position", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`periodeMulai-${index}`}>Periode Mulai</Label>
                  <Input
                    id={`periodeMulai-${index}`}
                    type="date"
                    value={pengalaman.startDate}
                    onChange={(e) => handleWorkExperienceChange(index, "startDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`periodeSelesai-${index}`}>Periode Selesai</Label>
                  <Input
                    id={`periodeSelesai-${index}`}
                    type="date"
                    value={pengalaman.endDate}
                    onChange={(e) => handleWorkExperienceChange(index, "endDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`deskripsi-${index}`}>Deskripsi</Label>
                <Textarea
                  id={`deskripsi-${index}`}
                  value={pengalaman.description}
                  onChange={(e) => handleWorkExperienceChange(index, "description", e.target.value)}
                  required
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => removeWorkExperience(index)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Pengalaman Kerja
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addWorkExperience}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengalaman Kerja
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sertifikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.certifications.map((sertifikat, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`namaSertifikasi-${index}`}>Nama Sertifikasi</Label>
                  <Input
                    id={`namaSertifikasi-${index}`}
                    value={sertifikat.name}
                    onChange={(e) => handleCertificationChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`penerbit-${index}`}>Penerbit</Label>
                  <Input
                    id={`penerbit-${index}`}
                    value={sertifikat.issuer}
                    onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`tanggal-${index}`}>Tahun</Label>
                  <Input
                    id={`tanggal-${index}`}
                    type="number"
                    value={sertifikat.year}
                    onChange={(e) => handleCertificationChange(index, "year", e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="button" variant="destructive" onClick={() => removeCertification(index)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Sertifikasi
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addCertification}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Sertifikasi
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Organisasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.organizationHistory.map((organisasi, index) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`namaOrganisasi-${index}`}>Nama Organisasi</Label>
                  <Input
                    id={`namaOrganisasi-${index}`}
                    value={organisasi.name}
                    onChange={(e) => handleOrganizationHistoryChange(index, "name", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`jabatanOrganisasi-${index}`}>Jabatan</Label>
                  <Input
                    id={`jabatanOrganisasi-${index}`}
                    value={organisasi.position}
                    onChange={(e) => handleOrganizationHistoryChange(index, "position", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`periodeMulaiOrganisasi-${index}`}>Periode Mulai</Label>
                  <Input
                    id={`periodeMulaiOrganisasi-${index}`}
                    type="date"
                    value={organisasi.startDate}
                    onChange={(e) => handleOrganizationHistoryChange(index, "startDate", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor={`periodeSelesaiOrganisasi-${index}`}>Periode Selesai</Label>
                  <Input
                    id={`periodeSelesaiOrganisasi-${index}`}
                    type="date"
                    value={organisasi.endDate}
                    onChange={(e) => handleOrganizationHistoryChange(index, "endDate", e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor={`deskripsiOrganisasi-${index}`}>Deskripsi</Label>
                <Textarea
                  id={`deskripsiOrganisasi-${index}`}
                  value={organisasi.description}
                  onChange={(e) => handleOrganizationHistoryChange(index, "description", e.target.value)}
                  required
                />
              </div>
              <Button type="button" variant="destructive" onClick={() => removeOrganizationHistory(index)}>
                <Trash2 className="mr-2 h-4 w-4" /> Hapus Riwayat Organisasi
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addOrganizationHistory}>
            <PlusCircle className="mr-2 h-4 w-4" /> Tambah Riwayat Organisasi
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => onCancel?.()}>
          Batal
        </Button>
        <Button type="submit">Simpan Data Karyawan</Button>
      </div>
    </form>
  )
}

