"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getJobById,
  getEmployees,
  addApplication,
} from "../../actions/serverActions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function JobDetails({ params }: { params: { id: string } }) {
  const [job, setJob] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const [jobData, employeesData] = await Promise.all([
          getJobById(Number.parseInt(params.id)),
          getEmployees(),
        ]);
        setJob(jobData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) return;

    setIsSubmitting(true);
    try {
      await addApplication({
        employeeId: Number.parseInt(selectedEmployee),
        jobId: Number.parseInt(params.id),
        status: "Dalam Review",
        appliedAt: new Date(),
      });
      toast({
        title: "Success",
        description: "Application submitted successfully.",
      });
      router.push("/administrasi-seleksi");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!job) return <div>Job not found</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{job.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="employee"
            className="block text-sm font-medium text-gray-700"
          >
            Select Candidate
          </label>
          <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
            <SelectTrigger id="employee">
              <SelectValue placeholder="Select a candidate" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  );
}
