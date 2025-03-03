import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const hrdUsers = [
  {
    name: "HRD IFG Life",
    email: "hrd@ifglife.co.id",
    password: "hrd567",
    companyId: 6,
    role: "hrd",
  },
  {
    name: "HRD Bahana TCW",
    email: "hrd@bahanatcw.co.id",
    password: "hrd678",
    companyId: 7,
    role: "hrd",
  },
  {
    name: "HRD Bahana Sekuritas",
    email: "hrd@bahanasekuritas.co.id",
    password: "hrd789",
    companyId: 8,
    role: "hrd",
  },
  {
    name: "HRD Bahana Artha Ventura",
    email: "hrd@bahanaartha.co.id",
    password: "hrd890",
    companyId: 9,
    role: "hrd",
  },
  {
    name: "HRD Bahana Kapital Investa",
    email: "hrd@bahanakapital.co.id",
    password: "hrd901",
    companyId: 10,
    role: "hrd",
  },
  {
    name: "HRD Grahaniaga Tatautama",
    email: "hrd@grahaniaga.co.id",
    password: "hrd012",
    companyId: 11,
    role: "hrd",
  },
];

async function seedHrdUsers() {
  console.log("Starting to seed HRD users...");

  try {
    for (const userData of hrdUsers) {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        console.log(`User ${userData.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      console.log(`Created user: ${user.name} with email: ${user.email}`);
    }

    console.log("✅ Seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute seeding
seedHrdUsers().catch((error) => {
  console.error("Failed to seed database:", error);
  process.exit(1);
});
