export interface Company {
  id: number;
  name: string;
  description?: string;
  isParent: boolean;
}

export interface PendidikanKaryawan {
  id: number;
  employeeId: number;
  namaInstitut: string;
  jenjang: string;
  jurusan: string;
  tahunMasuk: number;
  tahunAkhir: number;
}

export interface WorkExperience {
  id: number;
  employeeId: number;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Certification {
  id: number;
  employeeId: number;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  description?: string;
}

export interface OrganizationHistory {
  id: number;
  employeeId: number;
  organization: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  birthDate?: Date;
  position: string;
  department: string;
  companyId: number;
  level: string;
  rumpunJabatan: string;
  talentMobility?: string;
  pendidikanKaryawan: PendidikanKaryawan[];
  workExperiences: WorkExperience[];
  certifications: Certification[];
  organizationHistories: OrganizationHistory[];
}

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  description: string;
  companyId: number;
  postingDate: Date;
  expirationDate: Date;
  jobType: string;
  jobQualification: string;
  levelJabatan: string;
  rumpunJabatan: string;
  durationMonths: number;
  lokasiPenempatan: string;
}

export interface Application {
  id: number;
  employeeId: number;
  jobId: number;
  status: string;
  appliedAt: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  companyId: number;
}

export interface NewEmployeeData {
  name: string;
  email: string;
  position: string;
  department: string;
  companyId: number;
  level: string;
  rumpunJabatan: string;
  talentMobility?: string;
  pendidikanKaryawan: Omit<PendidikanKaryawan, "id" | "employeeId">[];
  workExperiences: Omit<WorkExperience, "id" | "employeeId">[];
  certifications: Omit<Certification, "id" | "employeeId">[];
  organizationHistories: Omit<OrganizationHistory, "id" | "employeeId">[];
}
