import type { Job, Application, Company } from "@/types"

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

export { mockJobs, mockApplications, mockCompanies }

