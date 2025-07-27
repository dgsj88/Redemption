"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"
import { getAllUsers, updateUserStatus, deleteUserAccount, getUserDeletionInfo, type User } from "@/lib/api-client"
import { DeleteUserDialog } from "./delete-user-dialog"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletionInfo, setDeletionInfo] = useState<any>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const fetchedUsers = await getAllUsers()
      setUsers(fetchedUsers)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateUserStatus = async (userId: string, newStatus: "active" | "pending" | "suspended") => {
    try {
      const success = await updateUserStatus(userId, newStatus)
      if (success) {
        await loadUsers() // Refresh the users list
      }
    } catch (err: any) {
      setError(err.message || "Failed to update user status")
    }
  }

  const handleDeleteUser = async (user: User) => {
    try {
      // Get deletion info first
      const info = await getUserDeletionInfo(user.id)
      setDeletionInfo(info)
      setUserToDelete(user)
      setDeleteDialogOpen(true)
    } catch (err: any) {
      setError(err.message || "Failed to get user deletion info")
    }
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      setIsDeleting(true)
      const success = await deleteUserAccount(userToDelete.id)

      if (success) {
        setDeleteDialogOpen(false)
        setUserToDelete(null)
        setDeletionInfo(null)
        await loadUsers() // Refresh the users list
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete user")
    } finally {
      setIsDeleting(false)
    }
  }

  const closeDeleteDialog = () => {
    if (!isDeleting) {
      setDeleteDialogOpen(false)
      setUserToDelete(null)
      setDeletionInfo(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.accountStatus === "active").length
  const totalCreditsInSystem = users.reduce((sum, user) => sum + user.creditBalance, 0)
  const totalItemsTraded = users.reduce((sum, user) => sum + user.totalItemsTraded, 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">MySQL User Database Management</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
            Admin Logout
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => setError("")} variant="outline" size="sm" className="mt-2">
              Dismiss
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Users</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{totalUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Registered accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Users</CardDescription>
              <CardTitle className="text-3xl text-green-600">{activeUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Credits</CardDescription>
              <CardTitle className="text-3xl text-purple-600">${totalCreditsInSystem.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">In user accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Items Traded</CardDescription>
              <CardTitle className="text-3xl text-orange-600">{totalItemsTraded.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Total recycled</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Database</CardTitle>
            <CardDescription>Search and manage registered users from MySQL database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={loadUsers} variant="outline">
                Refresh
              </Button>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-semibold">User</th>
                    <th className="text-left p-3 font-semibold">Contact</th>
                    <th className="text-left p-3 font-semibold">Credits</th>
                    <th className="text-left p-3 font-semibold">Activity</th>
                    <th className="text-left p-3 font-semibold">Status</th>
                    <th className="text-left p-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">{user.email}</div>
                          <div className="text-xs text-gray-500">Member since {user.memberSince}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-sm">
                          {user.contactNumber || <span className="text-gray-400 italic">Not provided</span>}
                        </div>
                        <div className="text-xs text-gray-500">Last login: {user.lastLogin}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium text-green-600">${user.creditBalance.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">Total earned: ${user.totalCreditsEarned.toFixed(2)}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{user.totalItemsTraded}</div>
                        <div className="text-xs text-gray-500">items traded</div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(user.accountStatus)}>{user.accountStatus}</Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          {user.accountStatus !== "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleUpdateUserStatus(user.id, "active")}
                            >
                              Activate
                            </Button>
                          )}
                          {user.accountStatus !== "suspended" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => handleUpdateUserStatus(user.id, "suspended")}
                            >
                              Suspend
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">No users found matching your search criteria.</div>
            )}
          </CardContent>
        </Card>
        {/* Delete User Dialog */}
        <DeleteUserDialog
          isOpen={deleteDialogOpen}
          user={userToDelete}
          onClose={closeDeleteDialog}
          onConfirm={confirmDeleteUser}
          isDeleting={isDeleting}
          deletionInfo={deletionInfo}
        />
      </div>
    </div>
  )
}
