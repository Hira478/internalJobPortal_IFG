import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const APPLICATION_STATUS = {
  ACCEPTED: "Diterima",
  REJECTED: "Ditolak",
  IN_REVIEW: "Dalam Review",
  INTERVIEW: "Interview",
  ONBOARDING: "Onboarding",
} as const;

// Updated to match database values (Indonesian)
export const STATUS_MAPPING = {
  diterima: "Diterima",
  ditolak: "Ditolak",
  "dalam-review": "Dalam Review",
  interview: "Interview",
  onboarding: "Onboarding",
} as const;

export function normalizeStatus(status: string): string {
  return status.toLowerCase().replace("-", " ");
}

export function translateApplicationStatus(status: string): string {
  const normalizedStatus = normalizeStatus(status);
  return STATUS_MAPPING[normalizedStatus] || status;
}
export const formatDate = (date: Date | string | undefined) => {
  if (!date) return "";
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return date;
};
