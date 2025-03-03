"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Users, Upload, ClipboardList, Building, UserPlus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function ManajemenDataPage() {
  const { user } = useAuth()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const cards = [
    {
      id: "dataKaryawan",
      title: "Data Karyawan",
      description: "Lihat dan kelola informasi karyawan",
      icon: <Users className="h-6 w-6" />,
      link: "/karyawan",
      secondaryAction: {
        text: "Rekrut Karyawan Baru",
        link: "/karyawan/baru",
        icon: <UserPlus className="h-4 w-4" />,
      },
    },
    {
      id: "uploadData",
      title: "Upload Data Karyawan",
      description: "Unggah data karyawan dalam format Excel",
      icon: <Upload className="h-6 w-6" />,
      link: "/upload-karyawan",
    },
    {
      id: "administrasiSeleksi",
      title: "Administrasi Seleksi",
      description: "Kelola proses seleksi kandidat",
      icon: <ClipboardList className="h-6 w-6" />,
      link: "/administrasi-seleksi",
    },
    {
      id: "biodataPerusahaan",
      title: "Biodata Perusahaan",
      description: "Kelola informasi perusahaan",
      icon: <Building className="h-6 w-6" />,
      link: user?.role === "superadmin" ? "/biodata-perusahaan" : `/biodata-perusahaan/${user?.companyId}`,
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Manajemen Data</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Card
            key={card.id}
            className="transition-shadow duration-300 hover:shadow-lg"
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {card.icon}
                <span>{card.title}</span>
              </CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full mb-2">
                <Link href={card.link}>
                  <span className="flex items-center justify-center">
                    Lihat {card.title}
                    <span className="ml-2">&rarr;</span>
                  </span>
                </Link>
              </Button>
              {hoveredCard === card.id && card.secondaryAction && (
                <Button asChild variant="outline" className="w-full">
                  <Link href={card.secondaryAction.link}>
                    <span className="flex items-center justify-center">
                      {card.secondaryAction.icon}
                      <span className="ml-2">{card.secondaryAction.text}</span>
                    </span>
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

