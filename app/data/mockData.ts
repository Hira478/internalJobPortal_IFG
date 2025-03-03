import type { Company, User, Job, Application, Employee } from "@/types"

export const mockCompanies: Company[] = [
  {
    id: 1,
    name: "PT Bahana Pembinaan Usaha Indonesia (Persero)",
    description: "BPUI adalah perusahaan induk yang bergerak di bidang jasa keuangan dan investasi.",
    isParent: true,
  },
  {
    id: 2,
    name: "PT Asuransi Kerugian Jasa Raharja",
    description: "Perusahaan asuransi yang fokus pada perlindungan masyarakat dalam bidang transportasi.",
    isParent: false,
  },
  {
    id: 3,
    name: "PT Jaminan Kredit Indonesia",
    isParent: false,
    description: "Menyediakan jaminan kredit untuk mendukung pengembangan UMKM di Indonesia.",
  },
  {
    id: 4,
    name: "PT Asuransi Kredit Indonesia",
    isParent: false,
    description: "Spesialis dalam asuransi kredit dan penjaminan untuk mendukung pertumbuhan ekonomi.",
  },
  {
    id: 5,
    name: "PT Asuransi Jasa Indonesia",
    isParent: false,
    description: "Menyediakan berbagai produk asuransi umum untuk perlindungan aset dan bisnis.",
  },
  {
    id: 6,
    name: "PT Asuransi Jiwa IFG Life",
    isParent: false,
    description: "Fokus pada penyediaan asuransi jiwa dan produk investasi untuk masyarakat Indonesia.",
  },
  {
    id: 7,
    name: "PT Bahana TCW Investment Management",
    isParent: false,
    description: "Manajer investasi yang menawarkan berbagai produk reksa dana dan solusi investasi.",
  },
  {
    id: 8,
    name: "PT Bahana Sekuritas",
    isParent: false,
    description: "Perusahaan sekuritas yang menyediakan layanan perdagangan efek dan riset pasar modal.",
  },
  {
    id: 9,
    name: "PT Bahana Artha Ventura",
    isParent: false,
    description: "Bergerak dalam pembiayaan modal ventura untuk mendukung pertumbuhan usaha.",
  },
  {
    id: 10,
    name: "PT Bahana Kapital Investa",
    isParent: false,
    description: "Menyediakan layanan manajemen aset dan investasi untuk institusi dan individu.",
  },
  {
    id: 11,
    name: "PT Grahaniaga Tatautama",
    isParent: false,
    description: "Bergerak dalam bidang teknologi informasi untuk mendukung grup BPUI dan klien eksternal.",
  },
]

export const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi.santoso@bpui.co.id",
    position: "Software Developer",
    department: "IT",
    companyId: 1,
    company: "PT Bahana Pembinaan Usaha Indonesia (Persero)",
    level: "BOD-4",
    rumpunJabatan: "Teknologi Informasi",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Indonesia",
        major: "Teknik Informatika",
        graduationYear: 2015,
      },
    ],
    experience: [
      {
        position: "Junior Developer",
        company: "PT Teknologi Maju",
        startDate: "2015-07-01",
        endDate: "2018-06-30",
        description: "Mengembangkan aplikasi web menggunakan React dan Node.js.",
      },
    ],
    certifications: [
      {
        name: "Oracle Certified Professional, Java SE 11 Developer",
        issuer: "Oracle",
        year: 2019,
      },
    ],
    organizationHistory: [
      {
        name: "Himpunan Mahasiswa Teknik Informatika UI",
        position: "Ketua Divisi Teknologi",
        startDate: "2013-09-01",
        endDate: "2014-08-31",
        description: "Mengelola proyek-proyek teknologi untuk mahasiswa dan fakultas.",
      },
    ],
  },
  {
    id: 2,
    name: "Siti Rahma",
    email: "siti.rahma@jasaraharja.co.id",
    position: "Underwriter",
    department: "Asuransi",
    companyId: 2,
    company: "PT Asuransi Kerugian Jasa Raharja",
    level: "BOD-3",
    rumpunJabatan: "Asuransi",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Gadah Mada",
        major: "Manajemen",
        graduationYear: 2012,
      },
    ],
    experience: [
      {
        position: "Asisten Underwriter",
        company: "PT Asuransi Maju Bersama",
        startDate: "2012-08-01",
        endDate: "2016-07-31",
        description: "Membantu dalam proses underwriting untuk berbagai jenis polis asuransi.",
      },
    ],
    certifications: [
      {
        name: "Ahli Asuransi Indonesia Kerugian (AAIK)",
        issuer: "Asosiasi Ahli Manajemen Asuransi Indonesia",
        year: 2015,
      },
    ],
    organizationHistory: [
      {
        name: "Ikatan Underwriter Indonesia",
        position: "Anggota",
        startDate: "2014-01-01",
        endDate: "Sekarang",
        description: "Berpartisipasi dalam kegiatan pengembangan profesi underwriter di Indonesia.",
      },
    ],
  },
  {
    id: 3,
    name: "Ahmad Hidayat",
    email: "ahmad.hidayat@jamkrindo.co.id",
    position: "Analis Kredit",
    department: "Keuangan",
    companyId: 3,
    company: "PT Jaminan Kredit Indonesia",
    level: "BOD-4",
    rumpunJabatan: "Keuangan",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Padjadjaran",
        major: "Akuntansi",
        graduationYear: 2014,
      },
    ],
    experience: [
      {
        position: "Staf Akuntansi",
        company: "PT Bank Negara Indonesia",
        startDate: "2014-09-01",
        endDate: "2017-08-31",
        description: "Mengelola laporan keuangan dan analisis kredit nasabah korporat.",
      },
    ],
    certifications: [
      {
        name: "Certified Credit Professional",
        issuer: "Lembaga Sertifikasi Profesi Perbankan",
        year: 2016,
      },
    ],
    organizationHistory: [
      {
        name: "Ikatan Akuntan Indonesia",
        position: "Anggota",
        startDate: "2014-01-01",
        endDate: "Sekarang",
        description: "Mengikuti perkembangan standar akuntansi dan praktik terbaik di industri keuangan.",
      },
    ],
  },
  {
    id: 4,
    name: "Dewi Lestari",
    email: "dewi.lestari@askrindo.co.id",
    position: "Manajer Investasi",
    department: "Investasi",
    companyId: 4,
    company: "PT Asuransi Kredit Indonesia",
    level: "BOD-2",
    rumpunJabatan: "Investasi",
    talentMobility: "No",
    education: [
      {
        level: "S2",
        institution: "Universitas Indonesia",
        major: "Manajemen Keuangan",
        graduationYear: 2013,
      },
    ],
    experience: [
      {
        position: "Analis Investasi",
        company: "PT Mandiri Sekuritas",
        startDate: "2013-08-01",
        endDate: "2017-07-31",
        description: "Melakukan analisis portofolio dan memberikan rekomendasi investasi kepada klien.",
      },
    ],
    certifications: [
      {
        name: "Chartered Financial Analyst (CFA)",
        issuer: "CFA Institute",
        year: 2016,
      },
    ],
    organizationHistory: [
      {
        name: "Asosiasi Manajer Investasi Indonesia",
        position: "Anggota Dewan Pengurus",
        startDate: "2019-01-01",
        endDate: "Sekarang",
        description: "Berkontribusi dalam pengembangan industri manajemen investasi di Indonesia.",
      },
    ],
  },
  {
    id: 5,
    name: "Eko Prasetyo",
    email: "eko.prasetyo@jasindo.co.id",
    position: "Agen Asuransi",
    department: "Penjualan",
    companyId: 5,
    company: "PT Asuransi Jasa Indonesia",
    level: "BOD-5",
    rumpunJabatan: "Penjualan",
    talentMobility: "No",
    education: [
      {
        level: "D3",
        institution: "Politeknik Negeri Jakarta",
        major: "Administrasi Bisnis",
        graduationYear: 2016,
      },
    ],
    experience: [
      {
        position: "Staf Pemasaran",
        company: "PT Asuransi Jiwa Maju Bersama",
        startDate: "2016-09-01",
        endDate: "2019-08-31",
        description: "Memasarkan produk asuransi jiwa kepada individu dan korporasi.",
      },
    ],
    certifications: [
      {
        name: "Ahli Asuransi Indonesia Umum (AAUI)",
        issuer: "Asosiasi Ahli Manajemen Asuransi Indonesia",
        year: 2018,
      },
    ],
    organizationHistory: [
      {
        name: "Asosiasi Agen Asuransi Indonesia",
        position: "Koordinator Wilayah Jakarta",
        startDate: "2020-01-01",
        endDate: "Sekarang",
        description: "Mengkoordinasikan kegiatan pengembangan profesional untuk agen asuransi di wilayah Jakarta.",
      },
    ],
  },
  {
    id: 6,
    name: "Rina Wulandari",
    email: "rina.wulandari@bpui.co.id",
    position: "HR Manager",
    department: "SDM",
    companyId: 1,
    company: "PT Bahana Pembinaan Usaha Indonesia (Persero)",
    level: "BOD-3",
    rumpunJabatan: "Sumber Daya Manusia",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Diponegoro",
        major: "Psikologi",
        graduationYear: 2011,
      },
    ],
    experience: [
      {
        position: "HR Specialist",
        company: "PT Telkom Indonesia",
        startDate: "2011-08-01",
        endDate: "2017-07-31",
        description: "Mengelola proses rekrutmen dan pengembangan karyawan.",
      },
    ],
    certifications: [
      {
        name: "Professional in Human Resources (PHR)",
        issuer: "HR Certification Institute",
        year: 2015,
      },
    ],
    organizationHistory: [
      {
        name: "Perhimpunan Manajemen Sumber Daya Manusia Indonesia",
        position: "Anggota",
        startDate: "2013-01-01",
        endDate: "Sekarang",
        description: "Aktif dalam kegiatan pengembangan praktik SDM di Indonesia.",
      },
    ],
  },
  {
    id: 7,
    name: "Fajar Nugroho",
    email: "fajar.nugroho@jasaraharja.co.id",
    position: "Financial Analyst",
    department: "Keuangan",
    companyId: 2,
    company: "PT Asuransi Kerugian Jasa Raharja",
    level: "BOD-4",
    rumpunJabatan: "Keuangan",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Brawijaya",
        major: "Akuntansi",
        graduationYear: 2014,
      },
    ],
    experience: [
      {
        position: "Junior Financial Analyst",
        company: "PT Bank Central Asia",
        startDate: "2014-09-01",
        endDate: "2018-08-31",
        description: "Melakukan analisis laporan keuangan dan proyeksi keuangan.",
      },
    ],
    certifications: [
      {
        name: "Certified Management Accountant (CMA)",
        issuer: "Institute of Management Accountants",
        year: 2017,
      },
    ],
    organizationHistory: [
      {
        name: "Ikatan Akuntan Indonesia",
        position: "Anggota",
        startDate: "2014-01-01",
        endDate: "Sekarang",
        description: "Berpartisipasi dalam seminar dan workshop pengembangan profesi akuntan.",
      },
    ],
  },
  {
    id: 8,
    name: "Lina Susanti",
    email: "lina.susanti@jamkrindo.co.id",
    position: "Marketing Specialist",
    department: "Pemasaran",
    companyId: 3,
    company: "PT Jaminan Kredit Indonesia",
    level: "BOD-4",
    rumpunJabatan: "Pemasaran",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Airlangga",
        major: "Manajemen Pemasaran",
        graduationYear: 2015,
      },
    ],
    experience: [
      {
        position: "Marketing Executive",
        company: "PT Unilever Indonesia",
        startDate: "2015-08-01",
        endDate: "2019-07-31",
        description: "Mengembangkan dan mengimplementasikan strategi pemasaran produk konsumen.",
      },
    ],
    certifications: [
      {
        name: "Digital Marketing Specialist",
        issuer: "Google",
        year: 2018,
      },
    ],
    organizationHistory: [
      {
        name: "Asosiasi Pemasaran Indonesia",
        position: "Koordinator Event",
        startDate: "2017-01-01",
        endDate: "2019-12-31",
        description: "Mengorganisir acara networking dan seminar pemasaran.",
      },
    ],
  },
  {
    id: 9,
    name: "Hendra Wijaya",
    email: "hendra.wijaya@askrindo.co.id",
    position: "Risk Manager",
    department: "Manajemen Risiko",
    companyId: 4,
    company: "PT Asuransi Kredit Indonesia",
    level: "BOD-3",
    rumpunJabatan: "Manajemen Risiko",
    talentMobility: "No",
    education: [
      {
        level: "S2",
        institution: "Universitas Indonesia",
        major: "Manajemen Risiko",
        graduationYear: 2013,
      },
    ],
    experience: [
      {
        position: "Risk Analyst",
        company: "PT Bank Mandiri",
        startDate: "2013-09-01",
        endDate: "2018-08-31",
        description: "Melakukan analisis dan mitigasi risiko operasional dan kredit.",
      },
    ],
    certifications: [
      {
        name: "Financial Risk Manager (FRM)",
        issuer: "Global Association of Risk Professionals",
        year: 2016,
      },
    ],
    organizationHistory: [
      {
        name: "Risk Management Society Indonesia Chapter",
        position: "Sekretaris",
        startDate: "2019-01-01",
        endDate: "Sekarang",
        description: "Mengelola komunikasi dan koordinasi antar anggota asosiasi.",
      },
    ],
  },
  {
    id: 10,
    name: "Maya Putri",
    email: "maya.putri@jasindo.co.id",
    position: "Customer Service Manager",
    department: "Layanan Pelanggan",
    companyId: 5,
    company: "PT Asuransi Jasa Indonesia",
    level: "BOD-4",
    rumpunJabatan: "Layanan Pelanggan",
    talentMobility: "No",
    education: [
      {
        level: "S1",
        institution: "Universitas Bina Nusantara",
        major: "Komunikasi",
        graduationYear: 2012,
      },
    ],
    experience: [
      {
        position: "Customer Service Representative",
        company: "PT Prudential Life Assurance",
        startDate: "2012-08-01",
        endDate: "2017-07-31",
        description: "Menangani pertanyaan dan keluhan nasabah terkait produk asuransi jiwa.",
      },
    ],
    certifications: [
      {
        name: "Certified Customer Service Professional",
        issuer: "International Customer Service Association",
        year: 2015,
      },
    ],
    organizationHistory: [
      {
        name: "Indonesia Customer Service Association",
        position: "Anggota Komite Pelatihan",
        startDate: "2018-01-01",
        endDate: "Sekarang",
        description: "Mengembangkan program pelatihan untuk meningkatkan standar layanan pelanggan di industri.",
      },
    ],
  },
]

export const mockJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    department: "IT",
    location: "Jakarta",
    description: "Kami mencari Software Engineer yang berpengalaman untuk bergabung dengan tim teknologi kami.",
    companyId: 1,
    postingDate: "2023-06-01",
    expirationDate: "2023-07-01",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Teknik Informatika, pengalaman 3+ tahun dalam pengembangan software",
    levelJabatan: "BOD-4",
    rumpunJabatan: "Teknologi Informasi",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Pusat",
  },
  {
    id: 2,
    title: "Underwriter",
    department: "Asuransi",
    location: "Jakarta",
    description: "Dibutuhkan Underwriter berpengalaman untuk menilai risiko asuransi.",
    companyId: 2,
    postingDate: "2023-06-05",
    expirationDate: "2023-07-05",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Aktuaria, pengalaman 2+ tahun sebagai underwriter",
    levelJabatan: "BOD-3",
    rumpunJabatan: "Asuransi",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Selatan",
  },
  {
    id: 3,
    title: "Analis Kredit",
    department: "Keuangan",
    location: "Jakarta",
    description: "Mencari Analis Kredit untuk mengevaluasi aplikasi pinjaman dan menilai risiko kredit.",
    companyId: 3,
    postingDate: "2023-06-10",
    expirationDate: "2023-07-10",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Ekonomi, pengalaman 1+ tahun dalam analisis kredit",
    levelJabatan: "BOD-4",
    rumpunJabatan: "Keuangan",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Barat",
  },
  {
    id: 4,
    title: "Manajer Investasi",
    department: "Investasi",
    location: "Jakarta",
    description: "Dibutuhkan Manajer Investasi untuk mengelola portofolio investasi perusahaan.",
    companyId: 4,
    postingDate: "2023-06-15",
    expirationDate: "2023-07-15",
    jobType: "Full-time",
    jobQualification: "Minimal S2 Keuangan, pengalaman 5+ tahun dalam manajemen investasi",
    levelJabatan: "BOD-2",
    rumpunJabatan: "Investasi",
    durationMonths: 24,
    lokasiPenempatan: "Jakarta Timur",
  },
  {
    id: 5,
    title: "Agen Asuransi",
    department: "Penjualan",
    location: "Surabaya",
    description: "Kami mencari Agen Asuransi yang energetik untuk memperluas basis klien kami di Surabaya.",
    companyId: 5,
    postingDate: "2023-06-20",
    expirationDate: "2023-07-20",
    jobType: "Part-time",
    jobQualification: "Minimal SMA, memiliki kemampuan komunikasi dan persuasi yang baik",
    levelJabatan: "BOD-5",
    rumpunJabatan: "Penjualan",
    durationMonths: 6,
    lokasiPenempatan: "Surabaya Pusat",
  },
  {
    id: 6,
    title: "HR Specialist",
    department: "SDM",
    location: "Jakarta",
    description: "Dicari HR Specialist untuk mengelola proses rekrutmen dan pengembangan karyawan.",
    companyId: 1,
    postingDate: "2023-06-25",
    expirationDate: "2023-07-25",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Psikologi atau Manajemen SDM, pengalaman 3+ tahun di bidang HR",
    levelJabatan: "BOD-4",
    rumpunJabatan: "Sumber Daya Manusia",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Selatan",
  },
  {
    id: 7,
    title: "Financial Analyst",
    department: "Keuangan",
    location: "Jakarta",
    description: "Kami mencari Financial Analyst untuk melakukan analisis keuangan dan pelaporan.",
    companyId: 2,
    postingDate: "2023-06-30",
    expirationDate: "2023-07-30",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Akuntansi atau Keuangan, pengalaman 2+ tahun sebagai financial analyst",
    levelJabatan: "BOD-4",
    rumpunJabatan: "Keuangan",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Barat",
  },
  {
    id: 8,
    title: "Marketing Manager",
    department: "Pemasaran",
    location: "Jakarta",
    description: "Dibutuhkan Marketing Manager untuk mengembangkan dan mengimplementasikan strategi pemasaran.",
    companyId: 3,
    postingDate: "2023-07-05",
    expirationDate: "2023-08-05",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Marketing, pengalaman 5+ tahun di bidang pemasaran",
    levelJabatan: "BOD-3",
    rumpunJabatan: "Pemasaran",
    durationMonths: 24,
    lokasiPenempatan: "Jakarta Pusat",
  },
  {
    id: 9,
    title: "Risk Analyst",
    department: "Manajemen Risiko",
    location: "Jakarta",
    description: "Mencari Risk Analyst untuk mengidentifikasi dan mengevaluasi risiko bisnis.",
    companyId: 4,
    postingDate: "2023-07-10",
    expirationDate: "2023-08-10",
    jobType: "Full-time",
    jobQualification: "Minimal S1 Manajemen Risiko atau bidang terkait, pengalaman 2+ tahun dalam analisis risiko",
    levelJabatan: "BOD-4",
    rumpunJabatan: "Manajemen Risiko",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Timur",
  },
  {
    id: 10,
    title: "Customer Service Representative",
    department: "Layanan Pelanggan",
    location: "Jakarta",
    description: "Kami mencari Customer Service Representative untuk memberikan layanan pelanggan yang luar biasa.",
    companyId: 5,
    postingDate: "2023-07-15",
    expirationDate: "2023-08-15",
    jobType: "Full-time",
    jobQualification: "Minimal D3, memiliki kemampuan komunikasi yang baik dan orientasi pada pelayanan",
    levelJabatan: "BOD-5",
    rumpunJabatan: "Layanan Pelanggan",
    durationMonths: 12,
    lokasiPenempatan: "Jakarta Utara",
  },
]

export const mockApplications: Application[] = [
  {
    id: 1,
    employeeId: 1,
    jobId: 2,
    status: "Dalam Review",
    appliedAt: "2023-06-01T10:00:00Z",
  },
  {
    id: 2,
    employeeId: 2,
    jobId: 3,
    status: "Interview",
    appliedAt: "2023-06-02T11:30:00Z",
  },
  {
    id: 3,
    employeeId: 3,
    jobId: 4,
    status: "Diterima",
    appliedAt: "2023-06-03T09:15:00Z",
  },
  {
    id: 4,
    employeeId: 4,
    jobId: 5,
    status: "Ditolak",
    appliedAt: "2023-06-04T14:45:00Z",
  },
  {
    id: 5,
    employeeId: 5,
    jobId: 1,
    status: "Dalam Review",
    appliedAt: "2023-06-05T16:20:00Z",
  },
  {
    id: 6,
    employeeId: 6,
    jobId: 7,
    status: "Interview",
    appliedAt: "2023-06-06T13:10:00Z",
  },
  {
    id: 7,
    employeeId: 7,
    jobId: 8,
    status: "Diterima",
    appliedAt: "2023-06-07T11:45:00Z",
  },
  {
    id: 8,
    employeeId: 8,
    jobId: 9,
    status: "Dalam Review",
    appliedAt: "2023-06-08T09:30:00Z",
  },
  {
    id: 9,
    employeeId: 9,
    jobId: 10,
    status: "Interview",
    appliedAt: "2023-06-09T15:20:00Z",
  },
  {
    id: 10,
    employeeId: 10,
    jobId: 6,
    status: "Ditolak",
    appliedAt: "2023-06-10T10:55:00Z",
  },
]

export const mockUsers: User[] = [
  {
    id: 1,
    name: "Admin BPUI",
    email: "admin@bpui.co.id",
    password: "admin123",
    companyId: 1,
    role: "superadmin",
  },
  {
    id: 2,
    name: "HRD Jasa Raharja",
    email: "hrd@jasaraharja.co.id",
    password: "hrd123",
    companyId: 2,
    role: "hrd",
  },
  {
    id: 3,
    name: "HRD Jamkrindo",
    email: "hrd@jamkrindo.co.id",
    password: "hrd234",
    companyId: 3,
    role: "hrd",
  },
  {
    id: 4,
    name: "HRD Askrindo",
    email: "hrd@askrindo.co.id",
    password: "hrd345",
    companyId: 4,
    role: "hrd",
  },
  {
    id: 5,
    name: "HRD Jasindo",
    email: "hrd@jasindo.co.id",
    password: "hrd456",
    companyId: 5,
    role: "hrd",
  },
  {
    id: 6,
    name: "HRD IFG Life",
    email: "hrd@ifglife.co.id",
    password: "hrd567",
    companyId: 6,
    role: "hrd",
  },
  {
    id: 7,
    name: "HRD Bahana TCW",
    email: "hrd@bahanatcw.co.id",
    password: "hrd678",
    companyId: 7,
    role: "hrd",
  },
  {
    id: 8,
    name: "HRD Bahana Sekuritas",
    email: "hrd@bahanasekuritas.co.id",
    password: "hrd789",
    companyId: 8,
    role: "hrd",
  },
  {
    id: 9,
    name: "HRD Bahana Artha Ventura",
    email: "hrd@bahanaartha.co.id",
    password: "hrd890",
    companyId: 9,
    role: "hrd",
  },
  {
    id: 10,
    name: "HRD Bahana Kapital Investa",
    email: "hrd@bahanakapital.co.id",
    password: "hrd901",
    companyId: 10,
    role: "hrd",
  },
  {
    id: 11,
    name: "HRD Grahaniaga Tatautama",
    email: "hrd@grahaniaga.co.id",
    password: "hrd012",
    companyId: 11,
    role: "hrd",
  },
]

