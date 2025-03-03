"use client"

import { useState, useEffect } from "react"
import type { Job, Application } from "@/types"
import { JobList } from "@/components/JobList"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockJobs, mockApplications, mockCompanies } from "@/data/mockData"

// Gunakan data mock yang sama seperti di halaman HR

export default function AdminDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    // Simulasi fetch data (ganti dengan panggilan API nyata)
    setJobs(mockJobs)
    setApplications(mockApplications)
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <h2 className="text-2xl font-semibold mb-4">Semua Lowongan</h2>
      <JobList jobs={jobs} companies={mockCompanies} />
      <h2 className="text-2xl font-semibold my-6">Semua Aplikasi</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {applications.map((app) => {
          const job = jobs.find((j) => j.id === app.jobId)
          const company = mockCompanies.find((c) => c.id === job?.companyId)
          return (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle>{app.applicantName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Email: {app.email}</p>
                <p>Telepon: {app.phone}</p>
                <p>Status: {app.status}</p>
                <p>Posisi: {job?.title}</p>
                <p>Perusahaan: {company?.name}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

