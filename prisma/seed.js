const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function main() {
  // Seed companies
  const companies = [
    {
      name: "PT Bahana Pembinaan Usaha Indonesia (Persero)",
      description:
        "BPUI adalah perusahaan induk yang bergerak di bidang jasa keuangan dan investasi.",
      isParent: true,
    },
    {
      name: "PT Asuransi Kerugian Jasa Raharja",
      description:
        "Perusahaan asuransi yang fokus pada perlindungan masyarakat dalam bidang transportasi.",
      isParent: false,
    },
    {
      name: "PT Jaminan Kredit Indonesia",
      description:
        "Menyediakan jaminan kredit untuk mendukung pengembangan UMKM di Indonesia.",
      isParent: false,
    },
    {
      name: "PT Asuransi Kredit Indonesia",
      description:
        "Spesialis dalam asuransi kredit dan penjaminan untuk mendukung pertumbuhan ekonomi.",
      isParent: false,
    },
    {
      name: "PT Asuransi Jasa Indonesia",
      description:
        "Menyediakan berbagai produk asuransi umum untuk perlindungan aset dan bisnis.",
      isParent: false,
    },
    {
      name: "PT Asuransi Jiwa IFG Life",
      description:
        "Fokus pada penyediaan asuransi jiwa dan produk investasi untuk masyarakat Indonesia.",
      isParent: false,
    },
    {
      name: "PT Bahana TCW Investment Management",
      description:
        "Manajer investasi yang menawarkan berbagai produk reksa dana dan solusi investasi.",
      isParent: false,
    },
    {
      name: "PT Bahana Sekuritas",
      description:
        "Perusahaan sekuritas yang menyediakan layanan perdagangan efek dan riset pasar modal.",
      isParent: false,
    },
    {
      name: "PT Bahana Artha Ventura",
      description:
        "Bergerak dalam pembiayaan modal ventura untuk mendukung pertumbuhan usaha.",
      isParent: false,
    },
    {
      name: "PT Bahana Kapital Investa",
      description:
        "Menyediakan layanan manajemen aset dan investasi untuk institusi dan individu.",
      isParent: false,
    },
    {
      name: "PT Grahaniaga Tatautama",
      description:
        "Bergerak dalam bidang teknologi informasi untuk mendukung grup BPUI dan klien eksternal.",
      isParent: false,
    },
  ];

  console.log("Seeding companies...");
  for (const company of companies) {
    await prisma.company.upsert({
      where: { name: company.name },
      update: {},
      create: company,
    });
  }
  console.log("Companies seeded successfully.");

  // Fetch all companies to get their IDs
  const createdCompanies = await prisma.company.findMany();
  const companyIdMap = createdCompanies.reduce((acc, company) => {
    acc[company.name] = company.id;
    return acc;
  }, {});

  // Seed users
  const users = [
    {
      name: "Admin BPUI",
      email: "admin@bpui.co.id",
      password: "admin123",
      role: "superadmin",
      companyId: companyIdMap["PT Bahana Pembinaan Usaha Indonesia (Persero)"],
    },
    {
      name: "HRD Jasa Raharja",
      email: "hrd@jasaraharja.co.id",
      password: "hrd123",
      role: "hrd",
      companyId: companyIdMap["PT Asuransi Kerugian Jasa Raharja"],
    },
    {
      name: "HRD Jamkrindo",
      email: "hrd@jamkrindo.co.id",
      password: "hrd234",
      role: "hrd",
      companyId: companyIdMap["PT Jaminan Kredit Indonesia"],
    },
    {
      name: "HRD Askrindo",
      email: "hrd@askrindo.co.id",
      password: "hrd345",
      role: "hrd",
      companyId: companyIdMap["PT Asuransi Kredit Indonesia"],
    },
    {
      name: "HRD Jasindo",
      email: "hrd@jasindo.co.id",
      password: "hrd456",
      role: "hrd",
      companyId: companyIdMap["PT Asuransi Jasa Indonesia"],
    },
  ];

  console.log("Seeding users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: await hashPassword(user.password),
      },
    });
  }
  console.log("Users seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
