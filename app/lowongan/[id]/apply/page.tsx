"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

export default function ApplyForm({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    pengalaman: "",
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Di sini Anda akan mengirim data ke server
    console.log("Form submitted:", formData)
    // Redirect ke halaman konfirmasi
    router.push("/aplikasi-terkirim")
  }

  if (!user) {
    return null // atau tampilkan pesan loading
  }

  return (
    <div className="container mx-auto mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Formulir Aplikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nama" className="block mb-2">
                Nama Lengkap
              </label>
              <Input id="nama" name="nama" value={formData.nama} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2">
                Email
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="telepon" className="block mb-2">
                Nomor Telepon
              </label>
              <Input id="telepon" name="telepon" value={formData.telepon} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="pengalaman" className="block mb-2">
                Pengalaman Kerja
              </label>
              <Textarea
                id="pengalaman"
                name="pengalaman"
                value={formData.pengalaman}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSubmit}>
            Kirim Aplikasi
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

