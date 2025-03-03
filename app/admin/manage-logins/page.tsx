"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getUsers, updateUserPassword, registerUser } from "@/lib/db"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

export default function ManageLoginsPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "hrd" })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers()
        console.log("Fetched users:", fetchedUsers) // Logging untuk debug
        setUsers(fetchedUsers)
      } catch (err) {
        console.error("Error fetching users:", err)
        setError("Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleResetPassword = async (userId: number) => {
    try {
      const newPassword = Math.random().toString(36).slice(-8) // Generate a random 8-character password
      await updateUserPassword(userId, newPassword)
      toast({
        title: "Password Reset Successful",
        description: `New password: ${newPassword}`,
      })
    } catch (err) {
      console.error("Error resetting password:", err)
      toast({
        title: "Password Reset Failed",
        description: "An error occurred while resetting the password.",
        variant: "destructive",
      })
    }
  }

  const handleAddUser = async () => {
    try {
      await registerUser(newUser)
      toast({
        title: "User Added Successfully",
        description: "The new user has been added to the system.",
      })
      setIsAddUserDialogOpen(false)
      // Refresh user list
      const updatedUsers = await getUsers()
      setUsers(updatedUsers)
    } catch (err) {
      console.error("Error adding new user:", err)
      toast({
        title: "Failed to Add User",
        description: "An error occurred while adding the new user.",
        variant: "destructive",
      })
    }
  }

  if (!user || user.role !== "superadmin") {
    return <div className="container mx-auto p-6">Access Denied. Only superadmin can view this page.</div>
  }

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto p-6">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Company Logins</CardTitle>
          <Button onClick={() => setIsAddUserDialogOpen(true)}>Add New User</Button>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <p>No user data found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleResetPassword(user.id)}>Reset Password</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Company Name
              </Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddUser}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

