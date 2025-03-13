"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function getAllUsers() {
  try {
    console.log("Fetching all users...");

    // Periksa apakah koneksi database berfungsi
    await prisma.$queryRaw`SELECT 1`;

    // Query users tanpa relasi company langsung
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        companyId: true,
      },
    });

    console.log(`Found ${users.length} users`);

    // Ambil data company secara terpisah dan gabungkan
    const usersWithCompany = await Promise.all(
      users.map(async (user) => {
        if (user.companyId) {
          try {
            const company = await prisma.company.findUnique({
              where: { id: user.companyId },
              select: { id: true, name: true },
            });
            return { ...user, company };
          } catch (err) {
            console.error(`Error fetching company for user ${user.id}:`, err);
            return { ...user, company: null };
          }
        }
        return { ...user, company: null };
      })
    );

    return usersWithCompany;
  } catch (error) {
    console.error("Detailed error fetching users:", error);

    // Periksa apakah error terkait dengan Prisma
    if (error.name === "PrismaClientKnownRequestError") {
      throw new Error(`Prisma error: ${error.message}`);
    }

    // Periksa apakah error terkait dengan koneksi database
    if (error.message && error.message.includes("connect")) {
      throw new Error(
        "Database connection error. Please check your database configuration."
      );
    }

    throw new Error(`Failed to fetch users: ${error.message}`);
  }
}

export async function updateUserPassword(userId: number, newPassword: string) {
  try {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/admin/manage-logins");
    return { success: true, password: newPassword }; // Return the new password
  } catch (error) {
    console.error("Error updating user password:", error);
    throw new Error("Failed to update user password");
  }
}
