import type { Job, Application, Company, User } from "@/types"

export const mockCompanies: Company[] = [
  {
    id: 1,
    name: "Tech Corp",
    description: "Tech company",
  },
  {
    id: 2,
    name: "Marketing Inc",
    description: "Marketing company",
  },
  {
    id: 3,
    name: "Parent Company",
    description: "Parent company",
  },
]

export const mockJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    description: "Software Engineer description",
    companyId: 1,
  },
  {
    id: 2,
    title: "Marketing Manager",
    description: "Marketing Manager description",
    companyId: 2,
  },
  {
    id: 3,
    title: "Data Scientist",
    description: "Data Scientist description",
    companyId: 1,
  },
]

export const mockApplications: Application[] = [
  {
    id: 1,
    jobId: 1,
    userId: 2,
    status: "applied",
  },
  {
    id: 2,
    jobId: 2,
    userId: 3,
    status: "interview",
  },
  {
    id: 3,
    jobId: 3,
    userId: 2,
    status: "offer",
  },
]

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@parentcompany.com",
    password: "admin123", // Dalam implementasi nyata, password harus di-hash
    companyId: 3,
    role: "superadmin",
  },
  {
    id: 2,
    name: "HRD Tech Corp",
    email: "hrd@techcorp.com",
    password: "hrd123",
    companyId: 1,
    role: "hrd",
  },
  {
    id: 3,
    name: "HRD Marketing Inc",
    email: "hrd@marketinginc.com",
    password: "hrd456",
    companyId: 2,
    role: "hrd",
  },
]

export { mockJobs, mockApplications, mockCompanies }

