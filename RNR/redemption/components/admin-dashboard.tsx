"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Notification } from "@/components/notification"
import { AdminSubmissions } from "@/components/admin-submissions"
import { SMTPConfigPage } from "@/components/smtp-config-page"
import {
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  sendPasswordResetEmail,
  type DatabaseUser,
  getAllRecyclingSubmissions,
} from "@/lib/user-database"

interface AdminDashboardProps {
  onLogout: () => void
}

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [showSubmissions, setShowSubmissions] = useState(false) // Add this line
  const [showSMTPConfig, setShowSMTPConfig] = useState(false)

  useEffect(() => {
    // Load users from database
    setUsers(getAllUsers())
  }, [])

  const addNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.accountStatus === statusFilter
    const matchesRole = roleFilter === "all" || user.userRole === roleFilter
    return matchesSearch && matchesStatus && matchesRole
  })

  const handleUpdateUserStatus = (userId: string, newStatus: "active" | "pending" | "suspended") => {
    const user = users.find((u) => u.id === userId)
    const oldStatus = user?.accountStatus

    const success = updateUserStatus(userId, newStatus)
    if (success) {
      console.log(`🔄 STATUS UPDATE: ${user?.name} (${user?.email})`)
      console.log(`   Previous Status: ${oldStatus}`)
      console.log(`   New Status: ${newStatus}`)

      if (newStatus === "suspended") {
        console.log(`🚫 LOGIN BLOCKED: ${user?.name} can NO LONGER login`)
        console.log(`   ❌ Authentication will be denied for this user`)
        addNotification(`${user?.name} has been suspended and can no longer log in`, "info")
      } else if (newStatus === "active" && oldStatus === "suspended") {
        console.log(`✅ LOGIN RESTORED: ${user?.name} can now login again`)
        console.log(`   ✓ Authentication will be allowed for this user`)
        addNotification(`${user?.name} has been activated and can now log in`, "success")
      } else if (newStatus === "active" && oldStatus === "pending") {
        console.log(`✅ ACCOUNT APPROVED: ${user?.name} can now login`)
        console.log(`   ✓ User account has been activated`)
        addNotification(`${user?.name}'s account has been approved and activated`, "success")
      }

      // Force immediate state update to ensure UI reflects the change
      const updatedUsers = getAllUsers()
      setUsers([...updatedUsers]) // Use spread operator to force re-render

      console.log(`✅ UI UPDATED: Status displayed as "${newStatus}" for ${user?.name}`)
    }
  }

  const handleUpdateUserRole = (userId: string, newRole: "admin" | "user" | "approver") => {
    const user = users.find((u) => u.id === userId)
    const oldRole = user?.userRole

    const success = updateUserRole(userId, newRole)
    if (success) {
      console.log(`👤 ROLE UPDATE: ${user?.name} (${user?.email})`)
      console.log(`   Previous Role: ${oldRole}`)
      console.log(`   New Role: ${newRole}`)

      if (newRole === "admin") {
        console.log(`🛡️ ADMIN ACCESS: ${user?.name} now has administrative privileges`)
        addNotification(`${user?.name} has been granted admin privileges`, "success")
      } else {
        console.log(`👥 USER ACCESS: ${user?.name} now has standard user privileges`)
        addNotification(`${user?.name} role changed to standard user`, "info")
      }

      // Force immediate state update to ensure UI reflects the role change
      const updatedUsers = getAllUsers()
      setUsers([...updatedUsers]) // Use spread operator to force re-render

      console.log(`✅ UI UPDATED: Role displayed as "${newRole}" for ${user?.name}`)
      console.log(`✅ DROPDOWN UPDATED: Dropdown now highlights "${newRole}" option`)
    }
  }

  const handlePasswordReset = (userId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    const result = sendPasswordResetEmail(userId)
    if (result.success && result.user) {
      console.log(`📧 PASSWORD RESET EMAIL: Sent to ${result.user.name} (${result.user.email})`)
      console.log(`📧 Reset URL: ${result.resetUrl}`)

      addNotification(
        `Password reset email sent to ${result.user.email}. The user can click the link in the email to reset their password.`,
        "success",
      )
    } else {
      addNotification(`Failed to send password reset email to ${user.email}`, "error")
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "approver":
        return "bg-green-100 text-green-800"
      case "user":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.accountStatus === "active").length
  const adminUsers = users.filter((u) => u.userRole === "admin").length
  const totalCreditsInSystem = users.reduce((sum, user) => sum + user.creditBalance, 0)
  const totalItemsTraded = users.reduce((sum, user) => sum + user.totalItemsTraded, 0)

  // Add handler for submissions
  const handleViewSubmissions = () => {
    setShowSubmissions(true)
  }

  const handleBackFromSubmissions = () => {
    setShowSubmissions(false)
  }

  const handleViewSMTPConfig = () => {
    setShowSMTPConfig(true)
  }

  const handleBackFromSMTPConfig = () => {
    setShowSMTPConfig(false)
  }

  // If showing submissions, render the submissions component
  if (showSubmissions) {
    return <AdminSubmissions onBack={handleBackFromSubmissions} />
  }

  // If showing SMTP config, render the SMTP config component
  if (showSMTPConfig) {
    return <SMTPConfigPage onBack={handleBackFromSMTPConfig} />
  }

  const totalSubmissions = getAllRecyclingSubmissions().length
  const pendingSubmissions = getAllRecyclingSubmissions().filter((s) => s.status === "pending").length

  const approverUsers = users.filter((u) => u.userRole === "approver").length

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Notifications */}
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={5000}
            onClose={() => removeNotification(notification.id)}
          />
        ))}

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">User Database Management</p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
          >
            Admin Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
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
              <CardDescription>Admin Users</CardDescription>
              <CardTitle className="text-3xl text-purple-600">{adminUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Administrator accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approver Users</CardDescription>
              <CardTitle className="text-3xl text-green-600">{approverUsers}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Submission reviewers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Credits</CardDescription>
              <CardTitle className="text-3xl text-orange-600">${totalCreditsInSystem.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">In user accounts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Items Traded</CardDescription>
              <CardTitle className="text-3xl text-teal-600">{totalItemsTraded.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Total recycled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Reviews</CardDescription>
              <CardTitle className="text-3xl text-red-600">{pendingSubmissions}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Need approval</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <Button onClick={handleViewSubmissions} className="bg-blue-500 hover:bg-blue-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            Manage Submissions ({pendingSubmissions} pending)
          </Button>
          <Button onClick={handleViewSMTPConfig} variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Email Configuration
          </Button>
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Manage Marketplace
          </Button>
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            View Reports
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>User Database</CardTitle>
            <CardDescription>Search and manage registered users</CardDescription>
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="approver">Approver</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
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
                    <th className="text-left p-3 font-semibold">Role</th>
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
                        <div className="flex flex-col gap-2">
                          <Badge className={getRoleColor(user.userRole)}>{user.userRole}</Badge>
                          <Select
                            value={user.userRole}
                            onValueChange={(newRole: "admin" | "user" | "approver") =>
                              handleUpdateUserRole(user.id, newRole)
                            }
                          >
                            <SelectTrigger className="w-28 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  User
                                </div>
                              </SelectItem>
                              <SelectItem value="approver">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  Approver
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                  Admin
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 flex-wrap">
                          {user.accountStatus === "suspended" ? (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                              onClick={() => handleUpdateUserStatus(user.id, "active")}
                              title={`Restore login access for ${user.name}`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              Activate
                            </Button>
                          ) : user.accountStatus === "active" ? (
                            <Button
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                              onClick={() => handleUpdateUserStatus(user.id, "suspended")}
                              title={`Block login access for ${user.name}`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636"
                                />
                              </svg>
                              Suspend
                            </Button>
                          ) : null}

                          {user.accountStatus === "pending" && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                              onClick={() => handleUpdateUserStatus(user.id, "active")}
                              title={`Approve account and allow login for ${user.name}`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </Button>
                          )}

                          {/* Password Reset Button */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-orange-600 border-orange-600 hover:bg-orange-50 flex items-center gap-1 bg-transparent"
                            onClick={() => handlePasswordReset(user.id)}
                            title={`Send password reset email to ${user.name}`}
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                              />
                            </svg>
                            Reset Password
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
      </div>
    </div>
  )
}
