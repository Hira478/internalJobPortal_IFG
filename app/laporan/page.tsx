"use client";

import { useState, useEffect } from "react";
import {
  getCompletedApplications,
  getCompanies,
  getAllEmployees,
  getAllJobs,
  getAllApplications,
  getAllCompletedApplications,
  getAllPendidikanKaryawan,
  getAllUsers,
  deleteCompletedApplication,
} from "../actions/serverActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomDatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function LaporanPage() {
  const [completedApplications, setCompletedApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { user } = useAuth();

  // Filter states
  const [sourceCompany, setSourceCompany] = useState("all");
  const [targetCompany, setTargetCompany] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState(null);

  useEffect(() => {
    fetchCompletedApplications();
    fetchCompanies();
  }, []);

  const fetchCompletedApplications = async () => {
    try {
      setIsLoading(true);
      const data = await getCompletedApplications(user?.companyId, user?.role);
      console.log("Fetched completed applications:", data);
      setCompletedApplications(data);
    } catch (error) {
      console.error("Error fetching completed applications:", error);
      toast({
        title: "Error",
        description: "Failed to load completed applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        title: "Error",
        description: "Failed to load companies. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredApplications = completedApplications.filter((app) => {
    const matchesSourceCompany =
      sourceCompany === "all" ||
      app.employee.company.id.toString() === sourceCompany;
    const matchesTargetCompany =
      targetCompany === "all" ||
      app.job.company.id.toString() === targetCompany;
    const appDate = new Date(app.appliedAt);
    const completeDate = new Date(app.completedAt);
    const matchesDateRange =
      (!startDate || appDate >= startDate) &&
      (!endDate || completeDate <= new Date(endDate.getTime() + 86400000));
    return matchesSourceCompany && matchesTargetCompany && matchesDateRange;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const exportToExcel = () => {
    const exportData = filteredApplications.map((app) => ({
      "Nama Kandidat": app.employee.name,
      "Posisi Asal": app.employee.position,
      "Posisi Dilamar": app.job.title,
      "Perusahaan Asal": app.employee.company.name,
      "Perusahaan Tujuan": app.job.company.name,
      "Tanggal Aplikasi": new Date(app.appliedAt).toLocaleDateString(),
      "Tanggal Selesai": new Date(app.completedAt).toLocaleDateString(),
      "Status Akhir": "Selesai",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Completed Applications");
    XLSX.writeFile(
      wb,
      `laporan-aplikasi-selesai-${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  const exportDatabase = async () => {
    try {
      setIsLoading(true);
      const [
        employees,
        jobs,
        applications,
        completedApplications,
        pendidikanKaryawan,
        companies,
        users,
      ] = await Promise.all([
        getAllEmployees(),
        getAllJobs(),
        getAllApplications(),
        getAllCompletedApplications(),
        getAllPendidikanKaryawan(),
        getCompanies(),
        getAllUsers(),
      ]);

      const workbook = XLSX.utils.book_new();

      // Companies sheet
      const companiesData = companies.map((company) => ({
        ID: company.id,
        Name: company.name,
        Description: company.description,
        IsParent: company.isParent,
      }));
      const companiesSheet = XLSX.utils.json_to_sheet(companiesData);
      XLSX.utils.book_append_sheet(workbook, companiesSheet, "Companies");

      // Employees sheet
      const employeesData = employees.map((emp) => ({
        ID: emp.id,
        Name: emp.name,
        Email: emp.email,
        Position: emp.position,
        Department: emp.department,
        CompanyID: emp.companyId,
        CompanyName: emp.company.name,
        Level: emp.level,
        RumpunJabatan: emp.rumpunJabatan,
        TalentMobility: emp.talentMobility,
        Experience: JSON.stringify(emp.experience),
        Certifications: JSON.stringify(emp.certifications),
        OrganizationHistory: JSON.stringify(emp.organizationHistory),
      }));
      const employeesSheet = XLSX.utils.json_to_sheet(employeesData);
      XLSX.utils.book_append_sheet(workbook, employeesSheet, "Employees");

      // PendidikanKaryawan sheet
      const pendidikanKaryawanData = pendidikanKaryawan.map((edu) => ({
        ID: edu.id,
        EmployeeID: edu.employeeId,
        EmployeeName: edu.employee.name,
        NamaInstitut: edu.namaInstitut,
        Jenjang: edu.jenjang,
        Jurusan: edu.jurusan,
        TahunMasuk: edu.tahunMasuk,
        TahunAkhir: edu.tahunAkhir,
      }));
      const pendidikanKaryawanSheet = XLSX.utils.json_to_sheet(
        pendidikanKaryawanData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        pendidikanKaryawanSheet,
        "PendidikanKaryawan"
      );

      // Jobs sheet
      const jobsData = jobs.map((job) => ({
        ID: job.id,
        Title: job.title,
        Department: job.department,
        Location: job.location,
        Description: job.description,
        CompanyID: job.companyId,
        CompanyName: job.company.name,
        PostingDate: format(new Date(job.postingDate), "dd/MM/yyyy"),
        ExpirationDate: format(new Date(job.expirationDate), "dd/MM/yyyy"),
        JobType: job.jobType,
        JobQualification: job.jobQualification,
        LevelJabatan: job.levelJabatan,
        RumpunJabatan: job.rumpunJabatan,
        DurationMonths: job.durationMonths,
        LokasiPenempatan: job.lokasiPenempatan,
      }));
      const jobsSheet = XLSX.utils.json_to_sheet(jobsData);
      XLSX.utils.book_append_sheet(workbook, jobsSheet, "Jobs");

      // Applications sheet
      const applicationsData = applications.map((app) => ({
        ID: app.id,
        EmployeeID: app.employeeId,
        EmployeeName: app.employee.name,
        JobID: app.jobId,
        JobTitle: app.job.title,
        Status: app.status,
        AppliedAt: format(new Date(app.appliedAt), "dd/MM/yyyy"),
        SourceCompany: app.employee.company.name,
        TargetCompany: app.job.company.name,
      }));
      const applicationsSheet = XLSX.utils.json_to_sheet(applicationsData);
      XLSX.utils.book_append_sheet(workbook, applicationsSheet, "Applications");

      // CompletedApplications sheet
      const completedApplicationsData = completedApplications.map((app) => ({
        ID: app.id,
        EmployeeID: app.employeeId,
        EmployeeName: app.employee.name,
        JobID: app.jobId,
        JobTitle: app.job.title,
        Status: app.status,
        AppliedAt: format(new Date(app.appliedAt), "dd/MM/yyyy"),
        CompletedAt: format(new Date(app.completedAt), "dd/MM/yyyy"),
        SourceCompany: app.employee.company.name,
        TargetCompany: app.job.company.name,
      }));
      const completedApplicationsSheet = XLSX.utils.json_to_sheet(
        completedApplicationsData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        completedApplicationsSheet,
        "CompletedApplications"
      );

      // Users sheet (excluding password for security reasons)
      const usersData = users.map((user) => ({
        ID: user.id,
        Name: user.name,
        Email: user.email,
        Role: user.role,
        CompanyID: user.companyId,
      }));
      const usersSheet = XLSX.utils.json_to_sheet(usersData);
      XLSX.utils.book_append_sheet(workbook, usersSheet, "Users");

      XLSX.writeFile(
        workbook,
        `database-export-${new Date().toISOString().split("T")[0]}.xlsx`
      );

      toast({
        title: "Success",
        description: "Database exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting database:", error);
      toast({
        title: "Error",
        description: "Failed to export database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (application) => {
    setApplicationToDelete(application);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!applicationToDelete) return;

    try {
      await deleteCompletedApplication(applicationToDelete.id);
      setCompletedApplications(
        completedApplications.filter((app) => app.id !== applicationToDelete.id)
      );
      toast({
        title: "Success",
        description: "Application deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting application:", error);
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setApplicationToDelete(null);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Laporan Aplikasi Selesai</h1>
        <div className="space-x-4">
          <Button onClick={exportToExcel}>Export to Excel</Button>
          {user?.role === "superadmin" && (
            <Button onClick={exportDatabase} variant="secondary">
              Export Database
            </Button>
          )}
        </div>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perusahaan Asal
              </label>
              <Select value={sourceCompany} onValueChange={setSourceCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Perusahaan Asal" />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Perusahaan Tujuan
              </label>
              <Select value={targetCompany} onValueChange={setTargetCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Perusahaan Tujuan" />
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Aplikasi Mulai
              </label>
              <CustomDatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Pilih tanggal mulai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Berakhir
              </label>
              <CustomDatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="Pilih tanggal akhir"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Aplikasi Selesai</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredApplications.length === 0 ? (
            <p>Tidak ada aplikasi yang telah selesai.</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">No.</TableHead>
                    <TableHead>Nama Kandidat</TableHead>
                    <TableHead>Posisi Asal</TableHead>
                    <TableHead>Perusahaan Asal</TableHead>
                    <TableHead>Posisi Dilamar</TableHead>
                    <TableHead>Perusahaan Tujuan</TableHead>
                    <TableHead>Tanggal Aplikasi</TableHead>
                    <TableHead>Tanggal Selesai</TableHead>
                    <TableHead>Status Akhir</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedApplications.map((app, index) => (
                    <TableRow key={app.id}>
                      <TableCell>{startIndex + index + 1}</TableCell>
                      <TableCell>{app.employee.name}</TableCell>
                      <TableCell>{app.employee.position}</TableCell>
                      <TableCell>{app.employee.company.name}</TableCell>
                      <TableCell>{app.job.title}</TableCell>
                      <TableCell>{app.job.company.name}</TableCell>
                      <TableCell>
                        {format(new Date(app.appliedAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(new Date(app.completedAt), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>Selesai</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(app)}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
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
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data aplikasi ini? Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
