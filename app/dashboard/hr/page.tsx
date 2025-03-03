"use client"

import { useState, useEffect } from "react"
import type { Job, Application, Company, User } from "@/types"
import { JobList } from "@/components/JobList"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Simulasi data (dalam implementasi nyata, ini akan diambil dari API)
const mockJobs: Job[] = [
  { id: 1, title: "Software Engineer", department: "IT", location: "Jakarta", description: "...", companyId: 1 },
  {
    id: 2,
    title: "Marketing Manager",
    department: "Marketing",
    location: "Surabaya",
    description: "...",
    companyId: 2,
  },
]

const mockCompanies: Company[] = [
  { id: 1, name: "Tech Corp", isParent: false },
  { id: 2, name: "Marketing Inc", isParent: false },
  { id: 3, name: "Parent Company", isParent: true },
]

const mockApplications: Application[] = [
  {
    id: 1,
    jobId: 1,
    applicantName: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    experience: "2 years",
    status: "Dalam Review",
  },
  {
    id: 2,
    jobId: 2,
    applicantName: "Jane Smith",
    email: "jane@example.com",
    phone: "0987654321",
    experience: "5 years",
    status: "Interview",
  },
]

const mockUser: User = { id: 1, name: "HR User", email: "hr@techcorp.com", companyId: 1, role: "hr" }

export default function HRDashboard() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])

  useEffect(() => {
    // Simulasi fetch data (ganti dengan panggilan API nyata)
    setJobs(mockJobs.filter((job) => job.companyId === mockUser.companyId))
    setApplications(mockApplications.filter((app) => jobs.some((job) => job.id === app.jobId)))
  }, [mockJobs, mockApplications, mockUser.companyId]) // Added dependencies

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard HR</h1>
      <h2 className="text-2xl font-semibold mb-4">Lowongan Perusahaan Anda</h2>
      <JobList jobs={jobs} companies={mockCompanies} />
      <h2 className="text-2xl font-semibold my-6">Aplikasi Terbaru</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {applications.map((app) => (
          <Card key={app.id}>
            <CardHeader>
              <CardTitle>{app.applicantName}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {app.email}</p>
              <p>Telepon: {app.phone}</p>
              <p>Status: {app.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

