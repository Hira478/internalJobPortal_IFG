"use client"

import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockCompanies } from "../../data/mockData"

export default function BiodataPerusahaanPage() {
  const params = useParams()
  const companyId = Number.parseInt(params.id as string)
  const company = mockCompanies.find((c) => c.id === companyId)

  if (!company) {
    return <div className="container mx-auto py-6">Perusahaan tidak ditemukan</div>
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Biodata Perusahaan</h1>
      <Card>
        <CardHeader>
          <CardTitle>{company.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{company.description || "Deskripsi perusahaan belum tersedia."}</p>
          <p className="mt-2">
            <strong>Status:</strong> {company.isParent ? "Perusahaan Induk" : "Anak Perusahaan"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

