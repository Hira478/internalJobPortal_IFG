"use client";

import { useState, useEffect } from "react";
import {
  getEmployeesWithTalentMobility,
  getApplicationsForCompany,
  getAllEmployees,
  getAllApplications,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TalentMobilityPage() {
  const [employees, setEmployees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (user?.role === "hrd" && user?.companyId) {
          const [employeesData, applicationsData] = await Promise.all([
            getEmployeesWithTalentMobility(user.companyId, user.role),
            getApplicationsForCompany(user.companyId),
          ]);
          console.log("Fetched talent mobility data:", employeesData);
          console.log("Fetched applications data:", applicationsData);
          setEmployees(employeesData);
          setApplications(applicationsData);
        } else if (user?.role === "superadmin") {
          const [employeesData, applicationsData] = await Promise.all([
            getAllEmployees(),
            getAllApplications(),
          ]);
          setEmployees(employeesData);
          setApplications(applicationsData);
        } else {
          setError("Unauthorized access or missing company information");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to load employee data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user?.companyId, user?.role, toast]);

  const getRelevantApplications = (employeeId) => {
    return applications.filter((app) => app.employeeId === employeeId);
  };

  if (isLoading) {
    return <div className="p-8">Loading talent mobility data...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Talent Mobility Tracking</h1>
      <Card>
        <CardHeader>
          <CardTitle>Karyawan dengan Talent Mobility</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Posisi Saat Ini</TableHead>
                <TableHead>Perusahaan Saat Ini</TableHead>
                <TableHead>Jumlah Aplikasi</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => {
                const relevantApplications = getRelevantApplications(
                  employee.id
                );
                return (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.company?.name || "N/A"}</TableCell>
                    <TableCell>{relevantApplications.length}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">Lihat Detail</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle>
                              Detail Aplikasi - {employee.name}
                            </DialogTitle>
                          </DialogHeader>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Posisi Dilamar</TableHead>
                                <TableHead>Perusahaan Tujuan</TableHead>
                                <TableHead>Tanggal Aplikasi</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {relevantApplications.map((application) => (
                                <TableRow key={application.id}>
                                  <TableCell>
                                    {application.job?.title || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {application.job?.company?.name || "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    {new Date(
                                      application.appliedAt
                                    ).toLocaleDateString()}
                                  </TableCell>
                                  <TableCell>{application.status}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
