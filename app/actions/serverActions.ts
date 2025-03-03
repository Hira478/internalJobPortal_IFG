"use server";
import { revalidatePath } from "next/cache";
import type { Employee, Job, Application, Company } from "@/types";
import { prisma } from "@/lib/prisma";

// Remove the following line as we're now importing prisma from @/lib/prisma
// const prisma = new PrismaClient();

const processDate = (dateValue: any): Date | null => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === "number") {
    // Excel menyimpan tanggal sebagai jumlah hari sejak 1/1/1900
    return new Date(Date.UTC(1900, 0, dateValue - 1));
  }
  if (typeof dateValue === "string") {
    const parsedDate = new Date(dateValue);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }
  return null;
};

export async function addEmployee(data: Omit<Employee, "id">) {
  try {
    const employee = await prisma.employee.create({
      data: {
        name: data.name,
        email: data.email,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        position: data.position,
        department: data.department,
        companyId: data.companyId,
        level: data.level,
        rumpunJabatan: data.rumpunJabatan,
        talentMobility: data.talentMobility,
        pendidikanKaryawan: {
          create: data.pendidikanKaryawan.map((edu) => ({
            namaInstitut: edu.namaInstitut,
            jenjang: edu.jenjang,
            jurusan: edu.jurusan,
            tahunMasuk: Number.parseInt(edu.tahunMasuk.toString(), 10),
            tahunAkhir: Number.parseInt(edu.tahunAkhir.toString(), 10),
          })),
        },
        workExperiences: {
          create: data.workExperiences.map((exp) => ({
            company: exp.company,
            position: exp.position,
            startDate: new Date(exp.startDate),
            endDate: exp.endDate ? new Date(exp.endDate) : null,
            description: exp.description,
          })),
        },
        certifications: {
          create: data.certifications.map((cert) => ({
            name: cert.name,
            issuer: cert.issuer,
            issueDate: new Date(cert.issueDate),
            expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
            description: cert.description,
          })),
        },
        organizationHistories: {
          create: data.organizationHistories.map((org) => ({
            organization: org.organization,
            position: org.position,
            startDate: new Date(org.startDate),
            endDate: org.endDate ? new Date(org.endDate) : null,
            description: org.description,
          })),
        },
      },
    });

    return { success: true, employee };
  } catch (error) {
    console.error("Error adding employee:", error);
    return { success: false, error: "Failed to add employee" };
  }
}

export async function updateEmployee(employee: Employee) {
  const {
    id,
    company,
    companyId,
    pendidikanKaryawan,
    workExperiences,
    certifications,
    organizationHistories,
    applications,
    completedApplications,
    ...employeeData
  } = employee;

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: {
      ...employeeData,
      birthDate: employeeData.birthDate
        ? new Date(employeeData.birthDate)
        : null,
      company: {
        connect: { id: companyId },
      },
      pendidikanKaryawan: {
        deleteMany: {},
        create: pendidikanKaryawan.map((edu) => ({
          namaInstitut: edu.namaInstitut,
          jenjang: edu.jenjang,
          jurusan: edu.jurusan,
          tahunMasuk: Number(edu.tahunMasuk),
          tahunAkhir: Number(edu.tahunAkhir),
        })),
      },
      workExperiences: {
        deleteMany: {},
        create: workExperiences.map((exp) => ({
          company: exp.company,
          position: exp.position,
          startDate: new Date(exp.startDate),
          endDate: exp.endDate ? new Date(exp.endDate) : null,
          description: exp.description,
        })),
      },
      certifications: {
        deleteMany: {},
        create: certifications.map((cert) => ({
          name: cert.name,
          issuer: cert.issuer,
          issueDate: new Date(cert.issueDate),
          expiryDate: cert.expiryDate ? new Date(cert.expiryDate) : null,
          description: cert.description,
        })),
      },
      organizationHistories: {
        deleteMany: {},
        create: organizationHistories.map((org) => ({
          organization: org.organization,
          position: org.position,
          startDate: new Date(org.startDate),
          endDate: org.endDate ? new Date(org.endDate) : null,
          description: org.description,
        })),
      },
    },
    include: {
      pendidikanKaryawan: true,
      workExperiences: true,
      certifications: true,
      organizationHistories: true,
      company: true,
    },
  });

  revalidatePath("/karyawan");
  return updatedEmployee;
}

export async function getEmployeeById(id: number): Promise<Employee | null> {
  try {
    console.log(`Fetching employee with id: ${id}`);
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        company: true,
        pendidikanKaryawan: true,
        workExperiences: true,
        certifications: true,
        organizationHistories: true,
      },
    });

    if (employee) {
      console.log(`Successfully fetched employee: ${employee.name}`);
      console.log(`PendidikanKaryawan: ${employee.pendidikanKaryawan.length}`);
      console.log(`WorkExperiences: ${employee.workExperiences.length}`);
      console.log(`Certifications: ${employee.certifications.length}`);
      console.log(
        `OrganizationHistories: ${employee.organizationHistories.length}`
      );
    } else {
      console.log(`No employee found with id: ${id}`);
    }

    return employee;
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error);
    return null;
  }
}

export async function getCompanies(): Promise<Company[]> {
  return await prisma.company.findMany();
}

export async function getEmployees(
  companyId?: number,
  userRole?: string
): Promise<Employee[]> {
  const where = userRole === "superadmin" ? {} : companyId ? { companyId } : {};
  console.log("Fetching employees with where clause:", where);
  const employees = await prisma.employee.findMany({
    where,
    include: {
      company: true,
      pendidikanKaryawan: true,
    },
  });
  console.log("Fetched employees:", employees.length);
  return employees;
}

export async function deleteEmployee(id: number) {
  try {
    await prisma.$transaction(async (prisma) => {
      // Hapus data terkait
      await prisma.pendidikanKaryawan.deleteMany({ where: { employeeId: id } });
      await prisma.workExperience.deleteMany({ where: { employeeId: id } });
      await prisma.certification.deleteMany({ where: { employeeId: id } });
      await prisma.organizationHistory.deleteMany({
        where: { employeeId: id },
      });
      await prisma.application.deleteMany({ where: { employeeId: id } });
      await prisma.completedApplication.deleteMany({
        where: { employeeId: id },
      });

      // Hapus karyawan
      await prisma.employee.delete({ where: { id } });
    });

    revalidatePath("/karyawan");
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw new Error("Failed to delete employee");
  }
}

export async function seedEmployeeData(sheets: { [key: string]: any[] }) {
  try {
    // Start a transaction
    await prisma.$transaction(async (prisma) => {
      for (const employee of sheets["Data Karyawan"]) {
        const existingEmployee = await prisma.employee.findFirst({
          where: {
            OR: [
              { name: employee["Nama Lengkap"] },
              { email: employee["Email"] },
            ],
          },
        });

        let newEmployee;

        if (existingEmployee) {
          console.log(
            `Karyawan dengan nama ${employee["Nama Lengkap"]} atau email ${employee["Email"]} sudah ada. Memperbarui data...`
          );
          // Update existing employee
          newEmployee = await prisma.employee.update({
            where: { id: existingEmployee.id },
            data: {
              name: employee["Nama Lengkap"],
              email: employee["Email"],
              birthDate: processDate(employee["Tanggal Lahir"]),
              position: employee["Posisi"],
              department: employee["Departemen"],
              level: employee["Level"],
              rumpunJabatan: employee["Rumpun Jabatan"],
              talentMobility: employee["Talent Mobility"],
              companyId: Number.parseInt(employee["ID Perusahaan"]),
            },
          });
        } else {
          // Create new employee
          newEmployee = await prisma.employee.create({
            data: {
              name: employee["Nama Lengkap"],
              email: employee["Email"],
              birthDate: processDate(employee["Tanggal Lahir"]),
              position: employee["Posisi"],
              department: employee["Departemen"],
              level: employee["Level"],
              rumpunJabatan: employee["Rumpun Jabatan"],
              talentMobility: employee["Talent Mobility"],
              companyId: Number.parseInt(employee["ID Perusahaan"]),
            },
          });
        }

        // Delete existing related data
        await prisma.pendidikanKaryawan.deleteMany({
          where: { employeeId: newEmployee.id },
        });
        await prisma.workExperience.deleteMany({
          where: { employeeId: newEmployee.id },
        });
        await prisma.certification.deleteMany({
          where: { employeeId: newEmployee.id },
        });
        await prisma.organizationHistory.deleteMany({
          where: { employeeId: newEmployee.id },
        });

        // Add education data
        const employeeEducations = sheets["Data Pendidikan"].filter(
          (edu) => edu["ID Karyawan"] === employee["ID Karyawan"]
        );
        for (const education of employeeEducations) {
          await prisma.pendidikanKaryawan.create({
            data: {
              employeeId: newEmployee.id,
              jenjang: education["Jenjang Pendidikan"],
              namaInstitut: education["Nama Institusi"],
              jurusan: education["Jurusan"],
              tahunMasuk: Number.parseInt(education["Tahun Masuk"]),
              tahunAkhir: Number.parseInt(education["Tahun Lulus"]),
            },
          });
        }

        // Add work experience data
        const workExperiences = sheets["Pengalaman Kerja"].filter(
          (exp) => exp["ID Karyawan"] === employee["ID Karyawan"]
        );
        for (const experience of workExperiences) {
          await prisma.workExperience.create({
            data: {
              employeeId: newEmployee.id,
              company: experience["Nama Perusahaan"],
              position: experience["Posisi"],
              startDate: processDate(experience["Tanggal Mulai"]),
              endDate: processDate(experience["Tanggal Selesai"]),
              description: experience["Deskripsi"],
            },
          });
        }

        // Add certification data
        const certifications = sheets["Sertifikasi"].filter(
          (cert) => cert["ID Karyawan"] === employee["ID Karyawan"]
        );
        for (const certification of certifications) {
          await prisma.certification.create({
            data: {
              employeeId: newEmployee.id,
              name: certification["Nama Sertifikasi"],
              issuer: certification["Penerbit"],
              issueDate: processDate(certification["Tanggal Terbit"]),
              expiryDate: processDate(certification["Tanggal Kadaluarsa"]),
              description: certification["Deskripsi"],
            },
          });
        }

        // Add organization history data
        const organizationHistories = sheets["Riwayat Organisasi"].filter(
          (org) => org["ID Karyawan"] === employee["ID Karyawan"]
        );
        for (const orgHistory of organizationHistories) {
          await prisma.organizationHistory.create({
            data: {
              employeeId: newEmployee.id,
              organization: orgHistory["Nama Organisasi"],
              position: orgHistory["Posisi"],
              startDate: processDate(orgHistory["Tanggal Mulai"]),
              endDate: processDate(orgHistory["Tanggal Selesai"]),
              description: orgHistory["Deskripsi"],
            },
          });
        }
      }
    });

    revalidatePath("/karyawan");
    return { success: true };
  } catch (error) {
    console.error("Error seeding employee data:", error);
    return {
      success: false,
      error: `Terjadi kesalahan saat menyimpan data: ${error.message}`,
    };
  }
}

export async function getJobs() {
  return await prisma.job.findMany({
    include: { company: true },
  });
}

export async function addJob(job: Omit<Job, "id">) {
  try {
    const newJob = await prisma.job.create({
      data: {
        ...job,
        postingDate: new Date(job.postingDate),
        expirationDate: new Date(job.expirationDate),
      },
    });
    revalidatePath("/lowongan");
    return newJob;
  } catch (error) {
    console.error("Error adding job:", error);
    throw new Error("Failed to add job");
  }
}

export async function updateJob(job: Job) {
  try {
    const { id, companyId, ...updateData } = job;
    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        ...updateData,
        postingDate: new Date(updateData.postingDate),
        expirationDate: new Date(updateData.expirationDate),
        company: {
          connect: { id: companyId },
        },
      },
      include: { company: true },
    });
    revalidatePath("/lowongan");
    return updatedJob;
  } catch (error) {
    console.error("Error updating job:", error);
    throw new Error(`Failed to update job: ${error.message}`);
  }
}

export async function deleteJob(id: number) {
  try {
    await prisma.job.delete({ where: { id } });
    revalidatePath("/lowongan");
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new Error("Failed to delete job");
  }
}

export async function getApplications(companyId?: number, userRole?: string) {
  try {
    const where =
      userRole === "superadmin"
        ? {}
        : companyId
        ? {
            job: { companyId },
          }
        : {};

    console.log("Fetching applications with where clause:", where);

    const applications = await prisma.application.findMany({
      where,
      include: {
        employee: {
          include: {
            company: true,
          },
        },
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    console.log(`Fetched ${applications.length} applications`);

    return applications;
  } catch (error) {
    console.error("Error fetching applications:", error);
    throw new Error("Failed to fetch applications");
  }
}

export async function addApplication(application: Omit<Application, "id">) {
  try {
    console.log("Attempting to add application:", application);
    const newApplication = await prisma.application.create({
      data: {
        employeeId: application.employeeId,
        jobId: application.jobId,
        status: application.status,
        appliedAt: application.appliedAt,
      },
      include: {
        employee: {
          include: {
            company: true,
          },
        },
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    await prisma.employee.update({
      where: { id: application.employeeId },
      data: { talentMobility: "Yes" },
    });

    console.log("New application added:", newApplication);
    revalidatePath("/lowongan");
    revalidatePath("/administrasi-seleksi");
    revalidatePath("/karyawan");
    revalidatePath("/dashboard");
    revalidatePath("/talent-mobility");
    return newApplication;
  } catch (error) {
    console.error("Error adding application:", error);
    throw new Error(
      "Failed to add application: " + (error.message || "Unknown error")
    );
  }
}

export async function updateApplication(application: Application) {
  try {
    const updatedApplication = await prisma.application.update({
      where: { id: application.id },
      data: {
        status: application.status,
      },
    });
    revalidatePath("/administrasi-seleksi");
    return updatedApplication;
  } catch (error) {
    console.error("Error updating application:", error);
    throw new Error("Failed to update application");
  }
}

export async function deleteApplication(id: number) {
  try {
    await prisma.application.delete({ where: { id } });
    revalidatePath("/administrasi-seleksi");
  } catch (error) {
    console.error("Error deleting application:", error);
    throw new Error("Failed to delete application");
  }
}

export async function getJobById(id: number) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: { company: true },
    });
    return job;
  } catch (error) {
    console.error("Error fetching job:", error);
    throw new Error("Failed to fetch job");
  }
}

export async function getJobOpenings(companyId?: number) {
  try {
    const jobOpenings = await prisma.job.findMany({
      where: companyId ? { companyId } : {},
      include: { company: true },
    });
    return jobOpenings;
  } catch (error) {
    console.error("Error fetching job openings:", error);
    throw new Error("Failed to fetch job openings");
  }
}

export async function completeApplication(applicationId: number) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { employee: true, job: true },
    });

    if (!application) {
      throw new Error("Application not found");
    }

    const completedApplication = await prisma.completedApplication.create({
      data: {
        employeeId: application.employeeId,
        jobId: application.jobId,
        status: "Selesai",
        appliedAt: application.appliedAt,
        completedAt: new Date(),
      },
    });

    await prisma.application.delete({
      where: { id: applicationId },
    });

    revalidatePath("/administrasi-seleksi");
    revalidatePath("/laporan");
    return completedApplication;
  } catch (error) {
    console.error("Error completing application:", error);
    throw new Error("Failed to complete application");
  }
}

export async function getCompletedApplications(
  companyId?: number,
  userRole?: string
) {
  try {
    let where = {};

    if (userRole === "hrd" && companyId) {
      where = {
        OR: [
          { employee: { companyId: companyId } },
          { job: { companyId: companyId } },
        ],
      };
    }

    const completedApplications = await prisma.completedApplication.findMany({
      where,
      include: {
        employee: {
          include: {
            company: true,
          },
        },
        job: {
          include: {
            company: true,
          },
        },
      },
    });

    console.log("Fetched completed applications:", completedApplications);
    return completedApplications;
  } catch (error) {
    console.error("Error fetching completed applications:", error);
    throw new Error("Failed to fetch completed applications");
  }
}

export async function getAllEmployees() {
  return await prisma.employee.findMany({
    include: {
      company: true,
      pendidikanKaryawan: true,
    },
  });
}

export async function getAllJobs() {
  return await prisma.job.findMany({
    include: { company: true },
  });
}

export async function getAllApplications() {
  return await prisma.application.findMany({
    include: {
      employee: { include: { company: true } },
      job: { include: { company: true } },
    },
  });
}

export async function getAllCompletedApplications() {
  return await prisma.completedApplication.findMany({
    include: {
      employee: { include: { company: true } },
      job: { include: { company: true } },
    },
  });
}

export async function getAllPendidikanKaryawan() {
  return await prisma.pendidikanKaryawan.findMany({
    include: { employee: true },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      companyId: true,
    },
  });
}

export async function getEmployeesWithTalentMobility(
  companyId?: number,
  userRole?: string
) {
  try {
    console.log(
      `Fetching talent mobility data for companyId: ${companyId}, userRole: ${userRole}`
    );

    if (userRole !== "hrd" || !companyId) {
      throw new Error("Invalid user role or missing company ID");
    }

    const employees = await prisma.employee.findMany({
      where: {
        companyId: companyId,
        OR: [{ talentMobility: "Yes" }, { applications: { some: {} } }],
      },
      include: {
        company: true,
        applications: {
          include: {
            job: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    console.log(
      `Found ${employees.length} employees with talent mobility or applications`
    );

    employees.forEach((employee) => {
      console.log(
        `Employee: ${employee.name}, Company: ${employee.company.name}, Applications: ${employee.applications.length}`
      );
      employee.applications.forEach((app) => {
        console.log(
          `  Application for job: ${app.job.title} at ${app.job.company.name}, Status: ${app.status}`
        );
      });
    });

    return employees;
  } catch (error) {
    console.error("Error fetching employees with talent mobility:", error);
    throw new Error("Failed to fetch employees with talent mobility");
  }
}

export async function getApplicationsForCompany(companyId: number) {
  try {
    const applications = await prisma.application.findMany({
      where: {
        employee: { companyId: companyId },
      },
      include: {
        employee: {
          include: { company: true },
        },
        job: {
          include: { company: true },
        },
      },
    });

    console.log(
      `Found ${applications.length} applications for companyId: ${companyId}`
    );
    applications.forEach((app) => {
      console.log(
        `Application: Employee ${app.employee.name} (${app.employee.company.name}) applied for ${app.job.title} at ${app.job.company.name}, Status: ${app.status}`
      );
    });

    return applications;
  } catch (error) {
    console.error("Error fetching applications for company:", error);
    throw new Error("Failed to fetch applications for company");
  }
}

export async function deleteCompletedApplication(id: number) {
  try {
    await prisma.completedApplication.delete({
      where: { id },
    });
    revalidatePath("/laporan");
    return { success: true };
  } catch (error) {
    console.error("Error deleting completed application:", error);
    throw new Error("Failed to delete completed application");
  }
}
