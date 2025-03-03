import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockCompanies } from "../data/mockData"
import Link from "next/link"

export default function BiodataPerusahaanPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Biodata Perusahaan</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCompanies.map((company) => (
          <Link href={`/biodata-perusahaan/${company.id}`} key={company.id}>
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
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
          </Link>
        ))}
      </div>
    </div>
  )
}

