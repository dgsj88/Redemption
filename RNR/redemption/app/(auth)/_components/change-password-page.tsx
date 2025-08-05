"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Notification } from "@/components/notification"
import { changeUserPassword, getCurrentUser, type DatabaseUser } from "@/lib/user-database"

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

export function ChangePasswordPage() {
  const router = useRouter()
  const [user, setUser] = useState<DatabaseUser | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState<NotificationState[]>([])

  useEffect(() => {
    // Get current user from localStorage or session
    const currentUser = getCurrentUser()
    if (!currentUser) {
      // Redirect to login if no user is found
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  const addNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validation
      if (!currentPassword) {
        setError("Current password is required")
        return
      }

      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long")
        return
      }

      if (newPassword !== confirmPassword) {
        setError("New passwords do not match")
        return
      }

      if (currentPassword === newPassword) {
        setError("New password must be different from current password")
        return
      }

      if (!user) {
        setError("User not found. Please log in again.")
        return
      }

      // Change password
      const success = changeUserPassword(user.id, currentPassword, newPassword)

      if (success) {
        console.log(`✅ PASSWORD CHANGE SUCCESS: Password updated for ${user.name}`)

        // Clear form
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Show success notification
        addNotification("Password is saved.", "success")

        // Redirect back to account detail page after 2 seconds
        setTimeout(() => {
          // Set a flag to show account page when returning to main page
          if (typeof window !== "undefined") {
            localStorage.setItem("showAccountPage", "true")
          }
          router.push("/components/account-page")
        }, 2000)
      } else {
        setError("Current password is incorrect")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while changing your password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Set flag to show account page when returning
    if (typeof window !== "undefined") {
      localStorage.setItem("showAccountPage", "true")
    }
    router.push("/components/account-page")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading user information...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-6">
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
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button onClick={handleCancel} variant="outline" size="sm">
              ← Back to Account
            </Button>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Change Password</h1>
            <p className="text-gray-600 mt-1">
              Update your password for <strong>{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Update Your Password</CardTitle>
            <CardDescription>
              Enter your current password and choose a new secure password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  disabled={isLoading}
                  minLength={6}
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">{error}</div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Password Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Must be different from your current password</li>
                  <li>• New password and confirmation must match</li>
                  <li>• Choose something secure and memorable</li>
                </ul>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Security Tips</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Use a combination of letters, numbers, and symbols</li>
                  <li>• Avoid using personal information like birthdays</li>
                  <li>• Don't reuse passwords from other accounts</li>
                  <li>• Consider using a password manager</li>
                </ul>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600" disabled={isLoading}>
                  {isLoading ? "Updating Password..." : "Update Password"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Additional Security Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Account Security</CardTitle>
            <CardDescription>Keep your account secure with these best practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Regular Updates</h4>
                <p className="text-gray-600 text-sm">
                  Change your password regularly, especially if you suspect it may have been compromised.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Secure Devices</h4>
                <p className="text-gray-600 text-sm">
                  Always log out from shared or public devices and keep your devices secure.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Monitor Activity</h4>
                <p className="text-gray-600 text-sm">
                  Review your account activity regularly and report any suspicious behavior immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
