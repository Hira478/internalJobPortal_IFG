"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, updateUserPassword } from "@/app/actions/userActions";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ResetPasswordModal } from "./reset-password-modal";
import { useAuth } from "@/contexts/AuthContext";
import { PasswordField } from "./password-field";
import type { User } from "@/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";

// Tambahkan interface untuk menyimpan password plaintext
interface UserWithPlaintextPassword extends User {
  plaintextPassword?: string;
}

export default function ManageLoginsPage() {
  const [users, setUsers] = useState<UserWithPlaintextPassword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] =
    useState<UserWithPlaintextPassword | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "superadmin") {
      toast({
        title: "Akses Ditolak",
        description: "Anda tidak memiliki izin untuk mengakses halaman ini.",
        variant: "destructive",
      });
      router.push("/dashboard");
      return;
    }

    fetchUsers();
  }, [currentUser, router, toast]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllUsers();

      // Cek apakah ada password plaintext yang disimpan di localStorage
      const usersWithSavedPasswords = data.map((user) => {
        const savedPassword = localStorage.getItem(`user_${user.id}_password`);
        return {
          ...user,
          plaintextPassword: savedPassword || undefined,
        };
      });

      setUsers(usersWithSavedPasswords);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.message || "Gagal memuat data pengguna.");
      toast({
        title: "Error",
        description: error.message || "Gagal memuat data pengguna.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = (user: UserWithPlaintextPassword) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePasswordReset = async (userId: number, newPassword: string) => {
    try {
      const result = await updateUserPassword(userId, newPassword);

      // Simpan password plaintext di localStorage
      localStorage.setItem(`user_${userId}_password`, newPassword);

      // Update the user's password in the local state
      setUsers(
        users.map((user) =>
          user.id === userId
            ? { ...user, password: "Updated", plaintextPassword: newPassword }
            : user
        )
      );

      toast({
        title: "Sukses",
        description: "Password berhasil diubah.",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengubah password.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8">Memuat data pengguna...</div>;
  }

  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Manajemen Login Pengguna</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchUsers}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  Kemungkinan penyebab:
                </p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  <li>Koneksi database terputus</li>
                  <li>
                    Tabel User belum dibuat atau tidak sesuai dengan skema
                  </li>
                  <li>Izin akses database tidak cukup</li>
                </ul>
                <p className="text-sm text-gray-600 mt-2">
                  Pastikan database sudah diatur dengan benar dan tabel User
                  sudah dibuat.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Input
                  placeholder="Cari berdasarkan nama atau email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
              <div className="mb-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Informasi Password</AlertTitle>
                  <AlertDescription>
                    Password yang sudah ada sebelumnya tidak dapat ditampilkan
                    karena disimpan dalam bentuk terenkripsi. Hanya password
                    yang baru di-reset yang dapat ditampilkan.
                  </AlertDescription>
                </Alert>
              </div>
              {users.length === 0 ? (
                <p>Tidak ada data pengguna yang ditemukan.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nama</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Password</TableHead>
                      <TableHead>Peran</TableHead>
                      <TableHead>Perusahaan</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.plaintextPassword ? (
                            <PasswordField
                              password={user.plaintextPassword}
                              isPlaintext={true}
                            />
                          ) : (
                            <PasswordField
                              password={user.password || ""}
                              isPlaintext={false}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {user.role === "superadmin" ? "Super Admin" : "HRD"}
                        </TableCell>
                        <TableCell>{user.company?.name || `-`}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetPassword(user)}
                          >
                            Reset Password
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordReset}
        user={selectedUser}
      />
    </div>
  );
}
