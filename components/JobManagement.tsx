import { useState } from "react"
import type { Job, Company } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

type JobManagementProps = {
  jobs: Job[]
  companies: Company[]
  onAddJob: (job: Omit<Job, "id">) => void
  onEditJob: (job: Job) => void
  onDeleteJob: (jobId: number) => void
}

export function JobManagement({ jobs, companies, onAddJob, onEditJob, onDeleteJob }: JobManagementProps) {
  const { user } = useAuth()
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [newJob, setNewJob] = useState<Omit<Job, "id">>({
    title: "",
    department: "",
    location: "",
    description: "",
    companyId: user?.companyId || 0,
  })

  // Fungsi untuk menambah lowongan baru
  const handleAddJob = () => {
    onAddJob(newJob)
    // Reset form setelah menambah lowongan
    setNewJob({
      title: "",
      department: "",
      location: "",
      description: "",
      companyId: user?.companyId || 0,
    })
  }

  // Fungsi untuk menyimpan perubahan pada lowongan yang diedit
  const handleEditJob = () => {
    if (editingJob) {
      onEditJob(editingJob)
      setEditingJob(null)
    }
  }

  // Fungsi untuk mengecek apakah user bisa mengedit lowongan
  const canEditJob = (job: Job) => {
    return user?.role === "superadmin" || (user?.role === "hrd" && job.companyId === user?.companyId)
  }

  // Filter lowongan berdasarkan peran user
  const filteredJobs = user?.role === "superadmin" ? jobs : jobs.filter((job) => job.companyId === user?.companyId)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Kelola Lowongan Pekerjaan</h2>

      {/* Form untuk menambah lowongan baru */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tambah Lowongan Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Judul Pekerjaan"
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Departemen"
            value={newJob.department}
            onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
            className="mb-2"
          />
          <Input
            placeholder="Lokasi"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
            className="mb-2"
          />
          <Textarea
            placeholder="Deskripsi"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            className="mb-2"
          />
          {user?.role === "superadmin" && (
            <select
              value={newJob.companyId}
              onChange={(e) => setNewJob({ ...newJob, companyId: Number(e.target.value) })}
              className="w-full p-2 border rounded mb-2"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddJob}>Tambah Lowongan</Button>
        </CardFooter>
      </Card>

      {/* Daftar lowongan yang ada */}
      {filteredJobs.map((job) => (
        <Card key={job.id} className="mb-4">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Departemen: {job.department}</p>
            <p>Lokasi: {job.location}</p>
            <p>Deskripsi: {job.description}</p>
            <p>Perusahaan: {companies.find((c) => c.id === job.companyId)?.name}</p>
          </CardContent>
          <CardFooter>
            {canEditJob(job) && (
              <>
                <Button onClick={() => setEditingJob(job)} className="mr-2">
                  Edit
                </Button>
                <Button onClick={() => onDeleteJob(job.id)} variant="destructive">
                  Hapus
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      ))}

      {/* Form untuk mengedit lowongan */}
      {editingJob && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Edit Lowongan</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Judul Pekerjaan"
              value={editingJob.title}
              onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Departemen"
              value={editingJob.department}
              onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
              className="mb-2"
            />
            <Input
              placeholder="Lokasi"
              value={editingJob.location}
              onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
              className="mb-2"
            />
            <Textarea
              placeholder="Deskripsi"
              value={editingJob.description}
              onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
              className="mb-2"
            />
            {user?.role === "superadmin" && (
              <select
                value={editingJob.companyId}
                onChange={(e) => setEditingJob({ ...editingJob, companyId: Number(e.target.value) })}
                className="w-full p-2 border rounded mb-2"
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleEditJob}>Simpan Perubahan</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

