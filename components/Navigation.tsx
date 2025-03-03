"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Building,
  ChevronDown,
  Database,
  Users,
  Upload,
  ClipboardList,
  Key,
  UserCircle,
  FileText,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCompanies } from "@/app/actions/serverActions";
import type { Company } from "@/types";

export function Navigation() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await getCompanies();
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  const getCompanyName = (companyId: number) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "Perusahaan tidak diketahui";
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const managementOptions = [
    {
      name: "Data Karyawan",
      icon: <Users className="w-4 h-4 mr-2" />,
      href: "/karyawan",
    },
    {
      name: "Upload Data Karyawan",
      icon: <Upload className="w-4 h-4 mr-2" />,
      href: "/upload-karyawan",
    },
    {
      name: "Administrasi Seleksi",
      icon: <ClipboardList className="w-4 h-4 mr-2" />,
      href: "/administrasi-seleksi",
    },
    {
      name: "Laporan",
      icon: <FileText className="w-4 h-4 mr-2" />,
      href: "/laporan",
    },
    {
      name: "Talent Mobility",
      icon: <Users className="w-4 h-4 mr-2" />,
      href: "/talent-mobility",
    },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-gray-800">
            IFG Rekrutmen
          </Link>
          <nav className="flex-1 mx-6">
            <ul className="flex space-x-8">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                    <Building className="w-4 h-4 inline-block mr-2" />
                    Perusahaan
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {companies.map((company) => (
                      <DropdownMenuItem key={company.id}>
                        <Link href={`/biodata-perusahaan/${company.id}`}>
                          {company.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
              {user && (
                <li>
                  <Link
                    href="/lowongan"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Lowongan
                  </Link>
                </li>
              )}
              {user && (
                <>
                  {(user.role === "hrd" || user.role === "superadmin") && (
                    <li>
                      <Link
                        href="/dashboard"
                        className="text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                  {(user?.role === "hrd" || user?.role === "superadmin") && (
                    <li>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                          <Database className="w-4 h-4 inline-block mr-2" />
                          Manajemen Data
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {managementOptions.map((option) => (
                            <DropdownMenuItem key={option.name}>
                              <Link
                                href={option.href}
                                className="flex items-center"
                              >
                                {option.icon}
                                {option.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </li>
                  )}
                </>
              )}
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{user.name}</span>
                  <span className="block text-xs">
                    {getCompanyName(user.companyId)}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                    <UserCircle className="w-5 h-5 inline-block mr-2" />
                    Account
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {user.role === "superadmin" && (
                      <DropdownMenuItem>
                        <Link
                          href="/admin/manage-logins"
                          className="flex items-center"
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Account Management
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={handleLogout}>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        Logout
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button asChild variant="default" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
