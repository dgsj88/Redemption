"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Notification } from "@/components/notification"
import {
  getAllSubmissions,
  approveSubmission,
  rejectSubmission,
  getUserByEmail,
  type RecyclingSubmission,
  type DatabaseUser,
} from "@/lib/user-database"
import { getSMTPConfig, getSubmissionApprovalEmailTemplate, simulateEmailSend } from "@/lib/smtp-config"

interface ApproverDashboardProps {
  user: DatabaseUser
  onLogout: () => void
}

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

export function ApproverDashboard({ user, onLogout }: ApproverDashboardProps) {
  const [submissions, setSubmissions] = useState<RecyclingSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<RecyclingSubmission | null>(null)
  const [actualCredits, setActualCredits] = useState<number>(0)
  const [reviewNotes, setReviewNotes] = useState("")
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Load submissions
    setSubmissions(getAllSubmissions())
  }, [])

  const addNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleApprove = async (submission: RecyclingSubmission) => {
    setIsProcessing(true)
    try {
      const credits = actualCredits || submission.estimatedCredits
      const approved = approveSubmission(submission.id, credits, reviewNotes)

      if (approved) {
        // Send approval email
        const smtpConfig = getSMTPConfig()
        const submissionUser = getUserByEmail(submission.userEmail)

        if (smtpConfig && smtpConfig.isEnabled && submissionUser) {
          const emailTemplate = getSubmissionApprovalEmailTemplate(submissionUser.name, submission.itemType, credits)
          const emailResult = await simulateEmailSend(submission.userEmail, emailTemplate, smtpConfig)

          if (emailResult.success) {
            console.log(`📧 APPROVAL EMAIL SENT to ${submission.userEmail} by approver ${user.name}`)
            addNotification(`Submission approved and email sent to ${submissionUser.name}!`, "success")
          } else {
            console.log(`❌ APPROVAL EMAIL FAILED: ${emailResult.error}`)
            addNotification(`Submission approved but email failed to send`, "info")
          }
        } else {
          addNotification("Submission approved successfully!", "success")
        }

        // Update submissions list
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submission.id ? { ...s, status: "approved" as const, actualCredits: credits, reviewNotes } : s,
          ),
        )

        // Reset form
        setSelectedSubmission(null)
        setActualCredits(0)
        setReviewNotes("")

        console.log(`✅ SUBMISSION APPROVED by ${user.name}: ${submission.itemType} for $${credits.toFixed(2)}`)
      }
    } catch (error) {
      addNotification("Failed to approve submission", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReject = async (submission: RecyclingSubmission) => {
    setIsProcessing(true)
    try {
      const rejected = rejectSubmission(submission.id, reviewNotes)

      if (rejected) {
        addNotification("Submission rejected", "info")

        // Update submissions list
        setSubmissions((prev) =>
          prev.map((s) => (s.id === submission.id ? { ...s, status: "rejected" as const, reviewNotes } : s)),
        )

        // Reset form
        setSelectedSubmission(null)
        setReviewNotes("")

        console.log(`❌ SUBMISSION REJECTED by ${user.name}: ${submission.itemType}`)
      }
    } catch (error) {
      addNotification("Failed to reject submission", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const filteredSubmissions = submissions.filter(
    (submission) =>
      submission.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingSubmissions = filteredSubmissions.filter((s) => s.status === "pending")
  const myApprovals = submissions.filter((s) => s.status === "approved" && s.reviewNotes?.includes(user.name))
  const totalApprovals = submissions.filter((s) => s.status === "approved").length

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
            <h1 className="text-3xl font-bold text-gray-800">Approver Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.name}! Review and approve recycling submissions.</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Badge variant="secondary">{pendingSubmissions.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Approvals</CardTitle>
              <Badge className="bg-green-100 text-green-800">{myApprovals.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myApprovals.length}</div>
              <p className="text-xs text-muted-foreground">Approved by you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Approved</CardTitle>
              <Badge className="bg-blue-100 text-blue-800">{totalApprovals}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalApprovals}</div>
              <p className="text-xs text-muted-foreground">System-wide approvals</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Search submissions by item type, user, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submissions List */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions</CardTitle>
              <CardDescription>
                {pendingSubmissions.length} submission{pendingSubmissions.length !== 1 ? "s" : ""} awaiting review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {pendingSubmissions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p>No pending submissions found</p>
                    {searchTerm && <p className="text-sm">Try adjusting your search terms</p>}
                  </div>
                ) : (
                  pendingSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setActualCredits(submission.estimatedCredits)
                        setReviewNotes("")
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{submission.itemType}</h3>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{submission.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>By: {submission.userName}</span>
                        <span className="font-medium">${submission.estimatedCredits.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Qty: {submission.quantity}</span>
                        <span>{submission.submissionDate}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Review Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Review Submission</CardTitle>
              <CardDescription>
                {selectedSubmission
                  ? "Review and approve/reject the selected submission"
                  : "Select a submission to review"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSubmission ? (
                <div className="space-y-4">
                  {/* Submission Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-lg">{selectedSubmission.itemType}</h3>
                      <Badge variant="secondary">ID: {selectedSubmission.id.slice(-6)}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{selectedSubmission.description}</p>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Quantity:</span> {selectedSubmission.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Condition:</span> {selectedSubmission.condition}
                        </div>
                        <div>
                          <span className="font-medium">Location:</span>{" "}
                          {selectedSubmission.location || "Not specified"}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div>
                          <span className="font-medium">Submitted by:</span> {selectedSubmission.userName}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {selectedSubmission.userEmail}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {selectedSubmission.submissionDate}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Estimated Credits:</span>
                        <span className="text-lg font-bold text-green-600">
                          ${selectedSubmission.estimatedCredits.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Review Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="actualCredits">Credits to Award</Label>
                      <Input
                        id="actualCredits"
                        type="number"
                        step="0.01"
                        min="0"
                        value={actualCredits}
                        onChange={(e) => setActualCredits(Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter actual credits"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated: ${selectedSubmission.estimatedCredits.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="reviewNotes">Review Notes</Label>
                      <Textarea
                        id="reviewNotes"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about your decision (optional)..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(selectedSubmission)}
                        disabled={isProcessing || actualCredits < 0}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        {isProcessing ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          `Approve ($${actualCredits.toFixed(2)})`
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(selectedSubmission)}
                        disabled={isProcessing}
                        variant="destructive"
                        className="flex-1"
                      >
                        {isProcessing ? "Processing..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  <p className="text-lg font-medium mb-2">Select a Submission</p>
                  <p>Choose a submission from the left panel to begin your review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Recent Activity</CardTitle>
            <CardDescription>Submissions you've recently reviewed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myApprovals.slice(0, 5).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">{submission.itemType}</p>
                      <p className="text-sm text-gray-600">
                        {submission.userName} • {submission.submissionDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">Approved</Badge>
                    <p className="text-sm text-gray-600 mt-1">
                      ${(submission.actualCredits || submission.estimatedCredits).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              {myApprovals.length === 0 && (
                <p className="text-center text-gray-500 py-4">No approvals yet. Start reviewing submissions above!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
