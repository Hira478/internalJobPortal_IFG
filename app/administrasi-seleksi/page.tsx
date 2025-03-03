"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getApplications,
  getCompanies,
  getEmployees,
  getJobs,
  updateApplication,
  completeApplication,
} from "../actions/serverActions";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const STATUS_OPTIONS = ["Dalam Review", "Interview", "Ditolak", "Onboarding"];

export default function AdministrasiSeleksi() {
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        fetchedApplications,
        fetchedCompanies,
        fetchedEmployees,
        fetchedJobs,
      ] = await Promise.all([
        getApplications(user?.companyId, user?.role),
        getCompanies(),
        getEmployees(user?.companyId, user?.role),
        getJobs(),
      ]);

      console.log("Fetched applications:", fetchedApplications.length);

      const processedApplications = fetchedApplications.map((app) => ({
        ...app,
        id: app.id,
        employeeName: app.employee?.name || "N/A",
        currentPosition: app.employee?.position || "N/A",
        sourceCompanyName: app.employee?.company?.name || "N/A",
        targetPosition: app.job?.title || "N/A",
        targetCompanyName: app.job?.company?.name || "N/A",
        level: app.job?.levelJabatan || "N/A",
        rumpunJabatan: app.job?.rumpunJabatan || "N/A",
        lokasiPenempatan: app.job?.location || "N/A",
      }));

      setApplications(processedApplications);
      setCompanies(fetchedCompanies);
      setEmployees(fetchedEmployees);
      setJobs(fetchedJobs);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "Gagal memuat data. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.companyId, user?.role, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateClick = (application) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setIsUpdateModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication) return;

    try {
      setIsUpdating(true);
      const updatedApplication = await updateApplication({
        ...selectedApplication,
        status: newStatus || "Dalam Review",
      });

      setApplications(
        applications.map((app) =>
          app.id === updatedApplication.id
            ? { ...app, status: updatedApplication.status }
            : app
        )
      );

      toast({
        title: "Berhasil",
        description: "Status aplikasi telah diperbarui",
      });

      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Error",
        description: "Gagal memperbarui status. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesCompany =
      selectedCompany === "all" ||
      app.sourceCompanyName === selectedCompany ||
      app.targetCompanyName === selectedCompany;
    const matchesStatus =
      selectedStatus === "all" || app.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      app.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.targetPosition.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCompany && matchesStatus && matchesSearch;
  });

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleCompleteApplication = async (applicationId: number) => {
    try {
      setIsUpdating(true);
      await completeApplication(applicationId);
      toast({
        title: "Berhasil",
        description: "Aplikasi telah diselesaikan dan dipindahkan ke Laporan",
      });
      fetchData();
    } catch (error) {
      console.error("Error completing application:", error);
      toast({
        title: "Error",
        description: "Gagal menyelesaikan aplikasi. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Administrasi Seleksi Kandidat</h1>

      <div className="flex gap-4 mb-6">
        {user?.role === "superadmin" && (
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Semua Perusahaan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Perusahaan</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.name}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Input
          placeholder="Cari kandidat atau posisi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
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
                <TableHead>Status</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedApplications.map((application, index) => (
                <TableRow key={application.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{application.employeeName}</TableCell>
                  <TableCell>{application.currentPosition}</TableCell>
                  <TableCell>{application.sourceCompanyName}</TableCell>
                  <TableCell>{application.targetPosition}</TableCell>
                  <TableCell>{application.targetCompanyName}</TableCell>
                  <TableCell>
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{application.status}</TableCell>
                  <TableCell>{application.level}</TableCell>
                  <TableCell>
                    <Button
                      variant="default"
                      className="bg-[#0F172A] hover:bg-[#1E293B]"
                      onClick={() => handleUpdateClick(application)}
                    >
                      Update Status
                    </Button>
                    {application.status === "Onboarding" && (
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() =>
                          handleCompleteApplication(application.id)
                        }
                        disabled={isUpdating}
                      >
                        Selesai
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
      </div>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Status Aplikasi</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status baru" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(false)}
              disabled={isUpdating}
            >
              Batal
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              className="bg-[#0F172A] hover:bg-[#1E293B]"
            >
              {isUpdating ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
