"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface User {
  name: string
  email: string
  contactNumber: string
  creditBalance: number
  totalItemsTraded: number
  memberSince: string
  accountStatus: "active" | "pending" | "suspended"
}

interface AccountPageProps {
  user: User
  onBack: () => void
  onUpdateUser: (updatedUser: User) => void
}

export function AccountPage({ user, onBack, onUpdateUser }: AccountPageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState(user)
  const router = useRouter()

  const handleSave = () => {
    onUpdateUser(editedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUser(user)
    setIsEditing(false)
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button onClick={onBack} variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
              <Badge className={getStatusColor(user.accountStatus)}>{user.accountStatus}</Badge>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and profile information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">{user.name}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">{user.email}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contact">Contact Number</Label>
                    {isEditing ? (
                      <Input
                        id="contact"
                        type="tel"
                        value={editedUser.contactNumber}
                        onChange={(e) => setEditedUser({ ...editedUser, contactNumber: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="mt-1 p-2 bg-gray-50 rounded-md">{user.contactNumber || "Not provided"}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="memberSince">Member Since</Label>
                    <div className="mt-1 p-2 bg-gray-50 rounded-md">{user.memberSince}</div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                        Save Changes
                      </Button>
                      <Button onClick={handleCancel} variant="outline">
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
                <CardDescription>Manage your password and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Password</h4>
                    <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => router.push("/change-password")}>
                    Change Password
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-800 mb-1">Current Balance</h3>
                  <p className="text-3xl font-bold text-green-600">${user.creditBalance.toFixed(2)}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{user.totalItemsTraded}</p>
                    <p className="text-sm text-gray-600">Items Traded</p>
                  </div>

                  <div className="text-center p-3 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.floor((Date.now() - new Date(user.memberSince).getTime()) / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-sm text-gray-600">Days as Member</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-500 hover:bg-green-600">Download Statement</Button>
                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
                <Button variant="outline" className="w-full">
                  Contact Support
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Verified</span>
                    <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Verified</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ID Verification</span>
                    <Badge className="bg-green-100 text-green-800">✓ Verified</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
