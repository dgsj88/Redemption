"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSubmissions } from "@/components/admin-submissions"
import { SMTPConfigPage } from "@/components/smtp-config-page"
import { postTypes } from "@/lib/zod"
import z from "zod"
// import { RecyclingSubmission } from "@/lib/user-database"

// Define the Submission type
type Submission = {
  id: string
  type: string
  author: string
  createdAt: string
  isApproved: "true" | "false"
  credits: number
}

// DatabaseUser type definition
type DatabaseUser = {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  isActive: "true" | "false"
  credits: number
  createdAt: string
}


function updateUser(users: DatabaseUser[], userId: string, updates: Partial<DatabaseUser>) {
  // Find the user and update properties (mock logic)
  const user = users.find((u) => u.id === userId)
  if (!user) return null
  return { ...user, ...updates }
}

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<"dashboard" | "submissions" | "users" | "marketplace" | "smtp">(
    "dashboard",
  )
  const [users, setUsers] = useState<DatabaseUser[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  // const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>([])
  // const [selectedUser, setSelectedUser] = useState<DatabaseUser | null>(null)

  useEffect(() => {
    // Load data
    // setUsers(getAllUsers())
    // setSubmissions(getAllSubmissions())
    // setMarketplaceItems(getAllMarketplaceItems())
  }, [])

  const handleUserRoleChange = (userId: string, newRole: "user" | "admin") => {
    const updatedUser = updateUser(users, userId, { role: newRole })
    if (updatedUser) {
      setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)))
      console.log(`👤 USER ROLE UPDATED: ${updatedUser.name} is now ${newRole}`)
    }
  }

  const handleUserStatusChange = (userId: string, newStatus: "true" | "false") => {
    const updatedUser = updateUser(users, userId, { isActive: newStatus })
    if (updatedUser) {
      setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)))
      console.log(`👤 USER STATUS UPDATED: ${updatedUser.name} is now ${newStatus}`)
    }
  }

  const getStats = () => {
    const totalUsers = users.length
    const adminUsers = users.filter((u) => u.role === "admin").length
    // const approverUsers = users.filter((u) => u.userRole === "approver").length
    const activeUsers = users.filter((u) => u.isActive === "true").length
    const pendingSubmissions = submissions.filter((s) => s.isApproved === "false").length
    const approvedSubmissions = submissions.filter((s) => s.isApproved === "true").length
    const totalCreditsAwarded = submissions
      .filter((s) => s.isApproved === "true")
      .reduce((sum, s) => sum + (s.credits), 0)
    // const marketplaceItemsCount = marketplaceItems.length

    return {
      totalUsers,
      adminUsers,
      // approverUsers,
      activeUsers,
      pendingSubmissions,
      approvedSubmissions,
      // totalCreditsAwarded,
      // marketplaceItemsCount,
    }
  }

  const stats = getStats()

  if (currentView === "smtp") {
    return <SMTPConfigPage onBack={() => setCurrentView("dashboard")} />
  }

  if (currentView === "submissions") {
    return (
      <AdminSubmissions
        onBack={() => setCurrentView("dashboard")}
        submissions={submissions}
        onSubmissionUpdate={(updatedSubmissions) => setSubmissions(updatedSubmissions)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, submissions, and system settings</p>
          </div>
          <div className="flex gap-2">
            {/* <Button
              onClick={}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
            > */}
              {/* Logout
            </Button> */}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            onClick={() => setCurrentView("dashboard")}
            variant={currentView === "dashboard" ? "default" : "outline"}
          >
            Dashboard
          </Button>
          <Button
            onClick={() => setCurrentView("submissions")}
            variant={currentView === "submissions" ? "default" : "outline"}
          >
            Submissions ({stats.pendingSubmissions})
          </Button>
          <Button onClick={() => setCurrentView("users")} variant={currentView === "users" ? "default" : "outline"}>
            Users
          </Button>
          <Button
            onClick={() => setCurrentView("marketplace")}
            variant={currentView === "marketplace" ? "default" : "outline"}
          >
            Marketplace
          </Button>
          <Button onClick={() => setCurrentView("smtp")} variant={currentView === "smtp" ? "default" : "outline"}>
            Email Config
          </Button>
        </div>

        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeUsers} active, {stats.adminUsers} admins, {stats.approverUsers} approvers
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
                  <p className="text-xs text-muted-foreground">{stats.approvedSubmissions} approved total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Credits Awarded</CardTitle>
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalCreditsAwarded.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Total credits distributed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Marketplace Items</CardTitle>
                  <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.marketplaceItemsCount}</div>
                  <p className="text-xs text-muted-foreground">Available for purchase</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setCurrentView("submissions")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                    <span className="text-sm">Review Submissions</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("users")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    <span className="text-sm">Manage Users</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("marketplace")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                    <span className="text-sm">Marketplace</span>
                  </Button>

                  <Button
                    onClick={() => setCurrentView("smtp")}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm">Email Configuration</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system activity and submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">{submission.itemType}</p>
                          <p className="text-sm text-gray-600">
                            Submitted by {submission.userName} • {submission.submissionDate}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          submission.status === "approved"
                            ? "default"
                            : submission.status === "rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {submission.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users View */}
        {currentView === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500">
                          Credits: ${user.creditBalance.toFixed(2)} • Joined: {user.registrationDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={user.userRole}
                        onChange={(e) => handleUserRoleChange(user.id, e.target.value as "user" | "admin" | "approver")}
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="user">User</option>
                        <option value="approver">Approver</option>
                        <option value="admin">Admin</option>
                      </select>
                      <select
                        value={user.accountStatus}
                        onChange={(e) =>
                          handleUserStatusChange(user.id, e.target.value as "active" | "suspended" | "pending")
                        }
                        className="px-3 py-1 border rounded text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                      <Badge
                        variant={
                          user.userRole === "admin"
                            ? "destructive"
                            : user.userRole === "approver"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {user.userRole}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Marketplace View */}
        {currentView === "marketplace" && (
          <Card>
            <CardHeader>
              <CardTitle>Marketplace Management</CardTitle>
              <CardDescription>Manage marketplace items and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketplaceItems.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">${item.price.toFixed(2)}</span>
                      <Badge variant={item.available ? "default" : "secondary"}>
                        {item.available ? "Available" : "Sold Out"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Added: {item.dateAdded}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
