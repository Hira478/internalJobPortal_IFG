"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getEmployees,
  deleteEmployee,
  getCompanies,
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
import type { Employee, Company } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const LEVEL_OPTIONS = ["BOD-1", "BOD-2", "BOD-3", "BOD-4", "BOD-5"];
const TALENT_MOBILITY_OPTIONS = ["Yes", "No"];

export default function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter states
  const [selectedCompany, setSelectedCompany] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTalentMobility, setSelectedTalentMobility] = useState("all");

  useEffect(() => {
    console.log("Current user:", user);
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log(
        "Fetching employees for companyId:",
        user?.companyId,
        "userRole:",
        user?.role
      );
      const employeesData = await getEmployees(user?.companyId, user?.role);
      console.log("Fetched employees:", employeesData.length);
      setEmployees(employeesData);

      const companiesData = await getCompanies();
      setCompanies(companiesData);

      // Set the selected company for HRD users
      if (user?.role === "hrd" && user?.companyId) {
        setSelectedCompany(user.companyId.toString());
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Gagal memuat data. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    const employee = employees.find((emp) => emp.id === id);

    if (
      user?.role !== "superadmin" &&
      employee?.companyId !== user?.companyId
    ) {
      toast({
        title: "Peringatan",
        description:
          "Anda tidak memiliki izin untuk menghapus karyawan dari perusahaan lain.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
      try {
        await deleteEmployee(id);
        toast({ title: "Karyawan berhasil dihapus" });
        fetchData();
      } catch (error) {
        console.error("Error deleting employee:", error);
        toast({ title: "Gagal menghapus karyawan", variant: "destructive" });
      }
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesCompany =
      user?.role === "superadmin"
        ? selectedCompany === "all" ||
          employee.companyId.toString() === selectedCompany
        : employee.companyId === user?.companyId;
    const matchesLevel =
      selectedLevel === "all" || employee.level === selectedLevel;
    const matchesTalentMobility =
      selectedTalentMobility === "all" ||
      employee.talentMobility === selectedTalentMobility;
    return matchesCompany && matchesLevel && matchesTalentMobility;
  });

  if (isLoading) {
    return <div className="p-8">Memuat data karyawan...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">{error}</div>;
  }

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Database Karyawan</h1>
        <Link href="/karyawan/baru">
          <Button>Tambah Karyawan</Button>
        </Link>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {user?.role === "superadmin" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perusahaan
                </label>
                <Select
                  value={selectedCompany}
                  onValueChange={setSelectedCompany}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Perusahaan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Perusahaan</SelectItem>
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
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perusahaan
                </label>
                <Input
                  value={
                    companies.find((c) => c.id === user?.companyId)?.name || ""
                  }
                  disabled
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Level
              </label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Level</SelectItem>
                  {LEVEL_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Talent Mobility
              </label>
              <Select
                value={selectedTalentMobility}
                onValueChange={setSelectedTalentMobility}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Talent Mobility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  {TALENT_MOBILITY_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Karyawan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Posisi</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Perusahaan</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Rumpun Jabatan</TableHead>
                <TableHead>Talent Mobility</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEmployees.map((employee: any, index: number) => (
                <TableRow key={employee.id}>
                  <TableCell>{startIndex + index + 1}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.company?.name}</TableCell>
                  <TableCell>{employee.level}</TableCell>
                  <TableCell>{employee.rumpunJabatan}</TableCell>
                  <TableCell>{employee.talentMobility || "-"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/karyawan/${employee.id}`}>
                        <Button variant="outline" size="sm">
                          Detail
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/karyawan/baru?id=${employee.id}`)
                        }
                        disabled={
                          user?.role !== "superadmin" &&
                          employee?.companyId !== user?.companyId
                        }
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        disabled={
                          user?.role !== "superadmin" &&
                          employee?.companyId !== user?.companyId
                        }
                      >
                        Hapus
                      </Button>
                    </div>
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
    </div>
  );
}
