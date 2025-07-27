"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Trash2, X } from "lucide-react"
import type { User } from "@/lib/api-client"

interface DeleteUserDialogProps {
  isOpen: boolean
  user: User | null
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
  deletionInfo?: {
    tradeInsCount: number
    totalCredits: number
  }
}

export function DeleteUserDialog({
  isOpen,
  user,
  onClose,
  onConfirm,
  isDeleting,
  deletionInfo,
}: DeleteUserDialogProps) {
  const [confirmText, setConfirmText] = useState("")

  if (!isOpen || !user) return null

  const isConfirmValid = confirmText.toLowerCase() === "delete"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <CardTitle className="text-red-600">Delete User Account</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            This action cannot be undone. This will permanently delete the user account and all associated data.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* User Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">User Details</h4>
            <div className="space-y-1 text-sm">
              <div>
                <strong>Name:</strong> {user.name}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>Member Since:</strong> {user.memberSince}
              </div>
              <div className="flex items-center space-x-2">
                <strong>Status:</strong>
                <Badge
                  className={
                    user.accountStatus === "active"
                      ? "bg-green-100 text-green-800"
                      : user.accountStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {user.accountStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Impact Information */}
          {deletionInfo && (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Data to be Deleted</h4>
              <div className="space-y-1 text-sm text-red-700">
                <div>• User profile and account information</div>
                <div>• {deletionInfo.tradeInsCount} trade-in record(s)</div>
                <div>• ${deletionInfo.totalCredits.toFixed(2)} in credit balance</div>
                <div>• All registration and activity logs</div>
              </div>
            </div>
          )}

          {/* Confirmation Input */}
          <div>
            <label htmlFor="confirmDelete" className="block text-sm font-medium text-gray-700 mb-2">
              Type <strong>DELETE</strong> to confirm:
            </label>
            <input
              id="confirmDelete"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Type DELETE to confirm"
              disabled={isDeleting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={onConfirm}
              disabled={!isConfirmValid || isDeleting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </Button>
            <Button onClick={onClose} variant="outline" disabled={isDeleting} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
