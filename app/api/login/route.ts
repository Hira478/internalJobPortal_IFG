import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { logLogin } from "@/lib/logger";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Login attempt started");
  try {
    const { email, password } = await req.json();
    console.log(`Login attempt for email: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        companyId: true,
      },
    });

    if (!user) {
      console.log(`Login failed: User not found for email ${email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`User found for email: ${email}`);
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log(`Login failed: Invalid password for email ${email}`);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const { password: _, ...userWithoutPassword } = user;
    console.log(
      `Login successful for user: ${userWithoutPassword.name} (${userWithoutPassword.role})`
    );

    try {
      logLogin(userWithoutPassword.name, userWithoutPassword.role);
    } catch (logError) {
      console.error("Error logging login:", logError);
    }

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
