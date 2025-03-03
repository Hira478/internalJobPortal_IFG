import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "./auth";
import type { User } from "@prisma/client";

const prisma = new PrismaClient();

// Hapus fungsi-fungsi yang telah dipindahkan ke serverActions.ts

export async function initializeDatabase() {
  console.log("Database initialization is handled by Prisma migrations");
}

export async function registerUser(user: Omit<User, "id">) {
  const hashedPassword = await hashPassword(user.password);
  return prisma.user.create({
    data: { ...user, password: hashedPassword },
  });
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { company: true },
  });
  if (user && (await verifyPassword(password, user.password))) {
    const { password: _, ...userWithoutPassword } = user;
    console.log(`User logged in successfully:
      Name: ${user.name}
      Email: ${user.email}
      Role: ${user.role}
      Company: ${user.company ? user.company.name : "N/A"}
    `);
    return {
      ...userWithoutPassword,
      company: user.company
        ? { id: user.company.id, name: user.company.name }
        : null,
    };
  }
  console.log(`Login failed for email: ${email}`);
  return null;
}

export async function updateUserPassword(userId: number, newPassword: string) {
  const hashedPassword = await hashPassword(newPassword);
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export type { Company, Employee, Job, Application, User } from "@prisma/client";
