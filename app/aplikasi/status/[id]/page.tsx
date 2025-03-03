"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockApplications, mockJobs, mockEmployees } from "@/app/data/mockData"
import type { Application, Job, Employee } from "@/types"

export default function ApplicationStatus({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [application, setApplication] = useState<Application | null>(null)
  const [job, setJob] = useState<Job | null>(null)
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const appId = Number.parseInt(params.id)
    const app = mockApplications.find((a) => a.id === appId)
    if (app) {
      setApplication(app)
      const relatedJob = mockJobs.find((j) => j.id === app.jobId)
      if (relatedJob) setJob(relatedJob)
      const relatedEmployee = mockEmployees.find((e) => e.id === app.employeeId)
      if (relatedEmployee) setEmployee(relatedEmployee)
    }
  }, [params.id])

  if (!application || !job || !employee) {
    return <div className="container mx-auto mt-10 text-center">Aplikasi tidak ditemukan</div>
  }

  return (
    <div className="container mx-auto mt-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Status Aplikasi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Informasi Pelamar</h3>
            <p>Nama: {employee.name}</p>
            <p>Posisi: {employee.position}</p>
            <p>Email: {employee.email}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Informasi Lowongan</h3>
            <p>Posisi: {job.title}</p>
            <p>Departemen: {job.department}</p>
            <p>Lokasi: {job.location}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Status Aplikasi</h3>
            <p>Status: {application.status}</p>
            <p>Tanggal Aplikasi: {new Date(application.appliedAt).toLocaleDateString("id-ID")}</p>
          </div>
          {application.cv && (
            <div>
              <h3 className="text-lg font-semibold">CV</h3>
              <p>File CV: {application.cv}</p>
            </div>
          )}
          {application.specialQuestion && (
            <div>
              <h3 className="text-lg font-semibold">Jawaban Pertanyaan Khusus</h3>
              <p>{application.specialQuestion}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

