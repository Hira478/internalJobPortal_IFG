"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import type { Job } from "@/types";
import {
  getJobs,
  addJob,
  updateJob,
  deleteJob,
} from "@/app/actions/serverActions";

type JobContextType = {
  jobs: Job[];
  addJob: (job: Omit<Job, "id">) => Promise<void>;
  editJob: (job: Job) => Promise<void>;
  deleteJob: (jobId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
};

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const fetchedJobs = await getJobs();
        setJobs(fetchedJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const addJobContext = async (job: Omit<Job, "id">) => {
    try {
      const newJob = await addJob(job);
      setJobs((prevJobs) => [...prevJobs, newJob]);
      setError(null);
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job. Please try again.");
    }
  };

  const editJobContext = async (job: Job) => {
    try {
      const updatedJob = await updateJob(job);
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === updatedJob.id ? updatedJob : j))
      );
      setError(null);
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job. Please try again.");
    }
  };

  const deleteJobContext = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      setError(null);
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob: addJobContext,
        editJob: editJobContext,
        deleteJob: deleteJobContext,
        isLoading,
        error,
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
