"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { Job, Employee, Company, Application } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  getCompanies,
  getJobs,
  getEmployees,
  getApplications,
  addJob,
  updateJob,
  deleteJob,
  addApplication,
} from "../actions/serverActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  Plus,
  Search,
  Building2,
  MapPin,
  Briefcase,
  GraduationCap,
  CalendarPlus2Icon as CalendarIcon2,
  Clock,
  FileText,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { id } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const datePickerWrapperClass = "react-datepicker-wrapper w-full";
const datePickerInputClass = "react-datepicker__input-container";

const formatDate = (date: string | Date | undefined) => {
  if (!date) return "";
  return format(new Date(date), "d MMMM yyyy", { locale: id });
};

export default function LowonganPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: "",
    department: "",
    location: "",
    description: "",
    companyId: 1,
    postingDate: new Date().toISOString(),
    expirationDate: new Date(),
    jobType: "Full-time",
    jobQualification: "",
    levelJabatan: "",
    rumpunJabatan: "",
    durationMonths: 1,
    lokasiPenempatan: "",
  });

  const [isAddCandidateModalOpen, setIsAddCandidateModalOpen] = useState(false);
  const [selectedCompanyForCandidate, setSelectedCompanyForCandidate] =
    useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
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

  const canEditOrDeleteJob = (jobCompanyId: number) => {
    return (
      user?.role === "superadmin" ||
      (user?.role === "hrd" && user.companyId === jobCompanyId)
    );
  };

  const handleSaveJob = async () => {
    try {
      const jobData = {
        ...newJob,
        durationMonths: Number(newJob.durationMonths),
        companyId:
          user?.role === "superadmin"
            ? Number(newJob.companyId)
            : user?.companyId || 1,
        postingDate: new Date(newJob.postingDate).toISOString(),
        expirationDate: new Date(newJob.expirationDate).toISOString(),
        lokasiPenempatan: newJob.location,
      };

      let updatedJob;
      if (isEditMode && newJob.id) {
        updatedJob = await updateJob(jobData as Job);
        toast({ title: "Lowongan berhasil diperbarui" });
      } else {
        updatedJob = await addJob(jobData as Omit<Job, "id">);
        toast({ title: "Lowongan baru berhasil ditambahkan" });
      }

      setIsNewJobModalOpen(false);
      setIsEditMode(false);
      setNewJob({
        title: "",
        department: "",
        location: "",
        description: "",
        companyId: user?.role === "superadmin" ? 1 : user?.companyId || 1,
        postingDate: new Date().toISOString(),
        expirationDate: new Date(),
        jobType: "Full-time",
        jobQualification: "",
        levelJabatan: "",
        rumpunJabatan: "",
        durationMonths: 1,
        lokasiPenempatan: "",
      });

      setJobs((prevJobs) => {
        if (isEditMode) {
          return prevJobs.map((job) =>
            job.id === updatedJob.id ? updatedJob : job
          );
        } else {
          return [...prevJobs, updatedJob];
        }
      });
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Gagal menyimpan lowongan",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: number, jobCompanyId: number) => {
    if (!canEditOrDeleteJob(jobCompanyId)) {
      toast({
        title: "Peringatan",
        description:
          "Anda tidak memiliki izin untuk menghapus lowongan dari perusahaan lain.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus lowongan ini?")) {
      try {
        await deleteJob(jobId);
        toast({ title: "Lowongan berhasil dihapus" });
        fetchData();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({ title: "Gagal menghapus lowongan", variant: "destructive" });
      }
    }
  };

  const handleAddCandidate = async () => {
    if (!selectedJob || !selectedEmployee) {
      toast({
        title: "Error",
        description: "Pilih lowongan dan karyawan terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUpdating(true);
      const newApplication = {
        employeeId: Number.parseInt(selectedEmployee),
        jobId: selectedJob.id,
        status: "Dalam Review",
        appliedAt: new Date(),
      };

      console.log("Attempting to add application:", newApplication);
      const result = await addApplication(newApplication);
      console.log("Application added:", result);

      toast({
        title: "Berhasil",
        description: "Kandidat berhasil ditambahkan",
      });
      setIsAddCandidateModalOpen(false);

      setSelectedEmployee("");
      setSelectedCompanyForCandidate("");

      fetchData();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast({
        title: "Gagal menambahkan kandidat",
        description:
          error.message || "Terjadi kesalahan saat menambahkan kandidat.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCompany =
      !selectedCompany || job.companyId.toString() === selectedCompany;
    const matchesJobType = !selectedJobType || job.jobType === selectedJobType;
    const matchesDate =
      !selectedDate ||
      (new Date(job.postingDate) <= selectedDate &&
        new Date(job.expirationDate) >= selectedDate);

    return matchesSearch && matchesCompany && matchesJobType && matchesDate;
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Lowongan</h1>
        {(user?.role === "superadmin" || user?.role === "hrd") && (
          <Dialog open={isNewJobModalOpen} onOpenChange={setIsNewJobModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setIsEditMode(false);
                  setNewJob({
                    title: "",
                    department: "",
                    location: "",
                    description: "",
                    companyId:
                      user?.role === "superadmin" ? 1 : user?.companyId || 1,
                    postingDate: new Date().toISOString(),
                    expirationDate: new Date(),
                    jobType: "Full-time",
                    jobQualification: "",
                    levelJabatan: "",
                    rumpunJabatan: "",
                    durationMonths: 1,
                    lokasiPenempatan: "",
                  });
                }}
                className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Lowongan Baru
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[900px] w-full">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl font-bold">
                  {isEditMode ? "Edit Lowongan" : "Tambah Lowongan Baru"}
                </DialogTitle>
                <DialogDescription>
                  Isi detail lowongan pekerjaan di bawah ini. Pastikan semua
                  informasi terisi dengan benar.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Judul Lowongan</Label>
                      <Input
                        id="title"
                        value={newJob.title}
                        onChange={(e) =>
                          setNewJob({ ...newJob, title: e.target.value })
                        }
                        placeholder="Masukkan judul lowongan"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobType">Tipe Pekerjaan</Label>
                      <Select
                        value={newJob.jobType}
                        onValueChange={(value) =>
                          setNewJob({ ...newJob, jobType: value })
                        }
                      >
                        <SelectTrigger id="jobType">
                          <SelectValue placeholder="Pilih tipe pekerjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Project-Base">
                            Project-Base
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="department">Departemen</Label>
                      <Input
                        id="department"
                        value={newJob.department}
                        onChange={(e) =>
                          setNewJob({ ...newJob, department: e.target.value })
                        }
                        placeholder="Masukkan departemen"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Lokasi</Label>
                      <Input
                        id="location"
                        value={newJob.location}
                        onChange={(e) =>
                          setNewJob({ ...newJob, location: e.target.value })
                        }
                        placeholder="Masukkan lokasi"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="levelJabatan">Level Jabatan</Label>
                      <Select
                        value={newJob.levelJabatan}
                        onValueChange={(value) =>
                          setNewJob({ ...newJob, levelJabatan: value })
                        }
                      >
                        <SelectTrigger id="levelJabatan">
                          <SelectValue placeholder="Pilih level jabatan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BOD-1">BOD-1</SelectItem>
                          <SelectItem value="BOD-2">BOD-2</SelectItem>
                          <SelectItem value="BOD-3">BOD-3</SelectItem>
                          <SelectItem value="BOD-4">BOD-4</SelectItem>
                          <SelectItem value="BOD-5">BOD-5</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="rumpunJabatan">Rumpun Jabatan</Label>
                      <Input
                        id="rumpunJabatan"
                        value={newJob.rumpunJabatan}
                        onChange={(e) =>
                          setNewJob({
                            ...newJob,
                            rumpunJabatan: e.target.value,
                          })
                        }
                        placeholder="Masukkan rumpun jabatan"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="durationMonths">Durasi (bulan)</Label>
                      <Input
                        id="durationMonths"
                        type="number"
                        value={newJob.durationMonths}
                        onChange={(e) =>
                          setNewJob({
                            ...newJob,
                            durationMonths: Number(e.target.value),
                          })
                        }
                        placeholder="Masukkan durasi"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expirationDate">Masa Berakhir</Label>
                      <DatePicker
                        selected={newJob.expirationDate}
                        onChange={(date) =>
                          setNewJob({ ...newJob, expirationDate: date })
                        }
                        dateFormat="dd/MM/yyyy"
                        wrapperClassName={datePickerWrapperClass}
                        className={`${datePickerInputClass} w-full p-2 border rounded`}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        customInput={<Input />}
                        placeholderText="Pilih tanggal"
                      />
                    </div>
                  </div>
                  {user?.role === "superadmin" && (
                    <div>
                      <Label htmlFor="companyId">Perusahaan</Label>
                      <Select
                        value={newJob.companyId?.toString()}
                        onValueChange={(value) =>
                          setNewJob({ ...newJob, companyId: Number(value) })
                        }
                      >
                        <SelectTrigger id="companyId">
                          <SelectValue placeholder="Pilih perusahaan" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem
                              key={company.id}
                              value={company.id.toString()}
                            >
                              {company.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description">Deskripsi</Label>
                      <Textarea
                        id="description"
                        value={newJob.description}
                        onChange={(e) =>
                          setNewJob({ ...newJob, description: e.target.value })
                        }
                        placeholder="Masukkan deskripsi lowongan"
                        className="w-full h-[100px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobQualification">Kualifikasi</Label>
                      <Textarea
                        id="jobQualification"
                        value={newJob.jobQualification}
                        onChange={(e) =>
                          setNewJob({
                            ...newJob,
                            jobQualification: e.target.value,
                          })
                        }
                        placeholder="Masukkan kualifikasi pekerjaan"
                        className="w-full h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveJob}>
                  {isEditMode ? "Perbarui" : "Simpan"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Lowongan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari lowongan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger>
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
            <Select value={selectedJobType} onValueChange={setSelectedJobType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipe Pekerjaan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP", { locale: id })
                    : "Pilih tanggal"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <Card key={job.id} className="flex flex-col h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <div className="mb-4">
                <h2 className="text-xl font-bold mb-1">{job.title}</h2>
                <p className="text-sm text-gray-600">
                  {companies.find((c) => c.id === job.companyId)?.name}
                </p>
              </div>

              <div className="flex-grow">
                <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="grid grid-cols-2 gap-y-2 text-sm mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{job.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{job.jobType}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{job.durationMonths} bulan</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4 pt-2 border-t">
                <div className="flex justify-between">
                  <span>
                    <CalendarIcon className="w-3 h-3 inline mr-1" />
                    Posting: {formatDate(job.postingDate)}
                  </span>
                  <span>
                    <CalendarIcon2 className="w-3 h-3 inline mr-1" />
                    Berakhir: {formatDate(job.expirationDate)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-auto">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setSelectedJob(job)}
                    >
                      Lihat Detail
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col">
                    <DialogHeader className="pb-4 border-b">
                      <DialogTitle className="text-2xl font-bold">
                        {job.title}
                      </DialogTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>
                            {
                              companies.find((c) => c.id === job.companyId)
                                ?.name
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          <span>{job.jobType}</span>
                        </div>
                      </div>
                    </DialogHeader>

                    <div className="flex-grow overflow-y-auto py-4 flex flex-col">
                      <div className="space-y-6 flex-grow">
                        <section>
                          <h3 className="text-lg font-semibold mb-2">
                            Deskripsi Pekerjaan
                          </h3>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {job.description}
                          </p>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-2">
                            Kualifikasi Pekerjaan
                          </h3>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {job.jobQualification}
                          </p>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-3">
                            Informasi Tambahan
                          </h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-3">
                              <GraduationCap className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Level Jabatan
                                </p>
                                <p className="text-sm text-gray-600">
                                  {job.levelJabatan}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <FileText className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Rumpun Jabatan
                                </p>
                                <p className="text-sm text-gray-600">
                                  {job.rumpunJabatan}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Building2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Departemen
                                </p>
                                <p className="text-sm text-gray-600">
                                  {job.department}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Lokasi Penempatan
                                </p>
                                <p className="text-sm text-gray-600">
                                  {job.lokasiPenempatan || job.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">Durasi</p>
                                <p className="text-sm text-gray-600">
                                  {job.durationMonths} bulan
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Briefcase className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Tipe Pekerjaan
                                </p>
                                <p className="text-sm text-gray-600">
                                  {job.jobType}
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>

                        <section>
                          <h3 className="text-lg font-semibold mb-3">
                            Periode Lowongan
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <CalendarIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Tanggal Posting
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(job.postingDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <CalendarIcon2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">
                                  Tanggal Berakhir
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(job.expirationDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>

                      <DialogFooter className="mt-auto pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setIsDetailModalOpen(false)}
                        >
                          Tutup
                        </Button>
                        <Dialog
                          open={isAddCandidateModalOpen}
                          onOpenChange={setIsAddCandidateModalOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              className="bg-[#0F172A] text-white hover:bg-[#1E293B]"
                              onClick={() => setSelectedJob(job)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Tambah Kandidat
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader className="space-y-3 pb-4 border-b">
                              <DialogTitle className="text-xl font-bold">
                                Tambah Kandidat untuk {selectedJob?.title}
                              </DialogTitle>
                              <p className="text-sm text-muted-foreground">
                                Pilih karyawan yang akan diajukan sebagai
                                kandidat untuk posisi ini
                              </p>
                            </DialogHeader>

                            <div className="py-6 space-y-6">
                              <div className="space-y-4">
                                <div className="grid grid-cols-5 items-center gap-4">
                                  <Label
                                    htmlFor="company"
                                    className="text-right col-span-1"
                                  >
                                    Perusahaan
                                  </Label>
                                  <div className="col-span-4">
                                    <Select
                                      value={
                                        user?.role === "hrd"
                                          ? user.companyId.toString()
                                          : selectedCompanyForCandidate
                                      }
                                      onValueChange={
                                        setSelectedCompanyForCandidate
                                      }
                                      disabled={user?.role === "hrd"}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Semua Perusahaan" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {companies.map((company) => (
                                          <SelectItem
                                            key={company.id}
                                            value={company.id.toString()}
                                          >
                                            {company.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-5 items-center gap-4">
                                  <Label
                                    htmlFor="employee"
                                    className="text-right col-span-1"
                                  >
                                    Karyawan
                                  </Label>
                                  <div className="col-span-4">
                                    <Select
                                      value={selectedEmployee}
                                      onValueChange={setSelectedEmployee}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Pilih karyawan" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {employees
                                          .filter(
                                            (emp) =>
                                              user?.role === "superadmin" ||
                                              (user?.role === "hrd" &&
                                                emp.companyId ===
                                                  user.companyId) ||
                                              (!user?.role &&
                                                emp.companyId.toString() ===
                                                  selectedCompanyForCandidate)
                                          )
                                          .map((employee) => (
                                            <SelectItem
                                              key={employee.id}
                                              value={employee.id.toString()}
                                            >
                                              {employee.name}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <DialogFooter className="border-t pt-6">
                              <Button
                                className="bg-[#0F172A] text-white hover:bg-[#1E293B] min-w-[120px]"
                                onClick={handleAddCandidate}
                                disabled={isUpdating}
                              >
                                {isUpdating
                                  ? "Menambahkan..."
                                  : "Tambah Kandidat"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </DialogFooter>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (!canEditOrDeleteJob(job.companyId)) {
                      toast({
                        title: "Peringatan",
                        description:
                          "Anda tidak memiliki izin untuk mengedit lowongan dari perusahaan lain.",
                        variant: "destructive",
                      });
                      return;
                    }
                    setIsEditMode(true);
                    setNewJob({
                      ...job,
                      postingDate: new Date(job.postingDate),
                      expirationDate: new Date(job.expirationDate),
                      lokasiPenempatan: job.location,
                    });
                    setIsNewJobModalOpen(true);
                  }}
                  disabled={!canEditOrDeleteJob(job.companyId)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDeleteJob(job.id, job.companyId)}
                  disabled={!canEditOrDeleteJob(job.companyId)}
                >
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
