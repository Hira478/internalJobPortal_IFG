"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  getJobs,
  getCompanies,
  getEmployees,
  getApplications,
} from "../actions/serverActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { useAuth } from "@/contexts/AuthContext";

const ApplicantStatsChart = dynamic(
  () => import("../../components/ApplicantStatsChart"),
  { ssr: false }
);

function exportToExcel(data: any[], fileName: string) {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Candidates");
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

function translateStatus(status: string): string {
  const statusMap = {
    accepted: "Diterima",
    rejected: "Ditolak",
    "in review": "Dalam Review",
    interview: "Interview",
    onboarding: "Onboarding",
  };
  return statusMap[status.toLowerCase()] || status;
}

function DashboardContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeTab, setActiveTab] = useState("semua");
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [selectedCompany, setSelectedCompany] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching data for user:", user?.role, user?.companyId);
        const [
          fetchedJobs,
          fetchedCompanies,
          fetchedEmployees,
          fetchedApplications,
        ] = await Promise.all([
          getJobs(),
          getCompanies(),
          getEmployees(user?.companyId, user?.role),
          getApplications(user?.companyId, user?.role),
        ]);

        console.log("Fetched applications:", fetchedApplications.length);

        setJobs(fetchedJobs);
        setCompanies(fetchedCompanies);
        setEmployees(fetchedEmployees);
        setApplications(fetchedApplications);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.companyId, user?.role]);

  const filteredData = (data) => {
    if (user?.role === "superadmin") {
      return selectedCompany === "all"
        ? data
        : data.filter(
            (item) => item.job?.companyId === Number(selectedCompany)
          );
    }
    return data.filter((item) => item.job?.companyId === user?.companyId);
  };

  const activeJobs = filteredData(jobs).filter((job) => {
    const expirationDate = new Date(job.expirationDate);
    const now = new Date();
    expirationDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    return expirationDate >= now;
  }).length;
  const totalApplicants = filteredData(applications).length;
  const onboardingApplicants = filteredData(applications).filter(
    (app) => app.status === "Onboarding"
  ).length;

  const applicationStats = [
    {
      name: "Dalam Review",
      value: filteredData(applications).filter(
        (app) => app.status === "Dalam Review"
      ).length,
    },
    {
      name: "Ditolak",
      value: filteredData(applications).filter(
        (app) => app.status === "Ditolak"
      ).length,
    },
    {
      name: "Interview",
      value: filteredData(applications).filter(
        (app) => app.status === "Interview"
      ).length,
    },
    {
      name: "Onboarding",
      value: filteredData(applications).filter(
        (app) => app.status === "Onboarding"
      ).length,
    },
  ];

  const newestJobs = filteredData(jobs)
    .sort(
      (a, b) =>
        new Date(b.postingDate).getTime() - new Date(a.postingDate).getTime()
    )
    .slice(0, 5);

  const statusMap = {
    "dalam-review": "Dalam Review",
    ditolak: "Ditolak",
    interview: "Interview",
    onboarding: "Onboarding",
  };

  const filteredApplications = filteredData(applications).filter((app) => {
    if (activeTab === "semua") return true;
    return app.status === statusMap[activeTab];
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handleExport = () => {
    const exportData = filteredApplications.map((app) => ({
      "Nama Kandidat": app.employee?.name,
      "Posisi Asal": app.employee?.position,
      "Posisi Dilamar": app.job?.title,
      "Perusahaan Asal": app.employee?.company?.name,
      "Perusahaan Dilamar": app.job?.company?.name,
      "Level Jabatan": app.job?.levelJabatan,
      "Rumpun Jabatan": app.job?.rumpunJabatan,
      "Lokasi Penempatan": app.job?.location,
      Status: app.status,
    }));
    exportToExcel(
      exportData,
      `rekap-kandidat-${activeTab}-${new Date().toISOString().split("T")[0]}`
    );
  };

  if (isLoading) {
    return <div className="p-8">Loading dashboard data...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      {user?.role === "superadmin" && (
        <div className="mb-4">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Pilih Perusahaan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Perusahaan</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Lowongan Aktif
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelamar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplicants}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardingApplicants}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ApplicantStatsChart data={applicationStats} />
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lowongan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Posisi</TableHead>
                  <TableHead>Tanggal Posting</TableHead>
                  {user?.role === "superadmin" && (
                    <TableHead>Perusahaan</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {newestJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>
                      {new Date(job.postingDate).toLocaleDateString()}
                    </TableCell>
                    {user?.role === "superadmin" && (
                      <TableCell>{job.company?.name}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rekap Kandidat</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
            className="mb-4"
          >
            <TabsList>
              <TabsTrigger value="semua">Semua</TabsTrigger>
              <TabsTrigger value="dalam-review">Dalam Review</TabsTrigger>
              <TabsTrigger value="ditolak">Ditolak</TabsTrigger>
              <TabsTrigger value="interview">Interview</TabsTrigger>
              <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No.</TableHead>
                  <TableHead>Nama Kandidat</TableHead>
                  <TableHead>Posisi Asal</TableHead>
                  <TableHead>Posisi Dilamar</TableHead>
                  <TableHead>Perusahaan Asal</TableHead>
                  <TableHead>Perusahaan Dilamar</TableHead>
                  <TableHead>Level Jabatan</TableHead>
                  <TableHead>Rumpun Jabatan</TableHead>
                  <TableHead>Lokasi Penempatan</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-4">
                      Tidak ada data kandidat
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedApplications.map((application, index) => (
                    <TableRow key={application.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{application.employee?.name}</TableCell>
                      <TableCell>{application.employee?.position}</TableCell>
                      <TableCell>{application.job?.title}</TableCell>
                      <TableCell>
                        {application.employee?.company?.name}
                      </TableCell>
                      <TableCell>{application.job?.company?.name}</TableCell>
                      <TableCell>{application.job?.levelJabatan}</TableCell>
                      <TableCell>{application.job?.rumpunJabatan}</TableCell>
                      <TableCell>{application.job?.location}</TableCell>
                      <TableCell>{application.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages || 1}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
            <Button variant="outline" onClick={handleExport}>
              Export to Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
