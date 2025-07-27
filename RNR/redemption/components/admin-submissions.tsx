"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Notification } from "@/components/notification"
import { approveSubmission, rejectSubmission, getUserByEmail, type RecyclingSubmission } from "@/lib/user-database"
import { getSMTPConfig, getSubmissionApprovalEmailTemplate, simulateEmailSend } from "@/lib/smtp-config"

interface AdminSubmissionsProps {
  onBack: () => void
  submissions: RecyclingSubmission[]
  onSubmissionUpdate: (submissions: RecyclingSubmission[]) => void
}

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

export function AdminSubmissions({ onBack, submissions, onSubmissionUpdate }: AdminSubmissionsProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<RecyclingSubmission | null>(null)
  const [actualCredits, setActualCredits] = useState<number>(0)
  const [reviewNotes, setReviewNotes] = useState("")
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

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
        const user = getUserByEmail(submission.userEmail)

        if (smtpConfig && smtpConfig.isEnabled && user) {
          const emailTemplate = getSubmissionApprovalEmailTemplate(user.name, submission.itemType, credits)
          const emailResult = await simulateEmailSend(submission.userEmail, emailTemplate, smtpConfig)

          if (emailResult.success) {
            console.log(`📧 APPROVAL EMAIL SENT to ${submission.userEmail}`)
            addNotification(`Submission approved and email sent to ${user.name}!`, "success")
          } else {
            console.log(`❌ APPROVAL EMAIL FAILED: ${emailResult.error}`)
            addNotification(`Submission approved but email failed to send`, "info")
          }
        } else {
          addNotification("Submission approved successfully!", "success")
        }

        // Update submissions list
        const updatedSubmissions = submissions.map((s) =>
          s.id === submission.id ? { ...s, status: "approved" as const, actualCredits: credits, reviewNotes } : s,
        )
        onSubmissionUpdate(updatedSubmissions)

        // Reset form
        setSelectedSubmission(null)
        setActualCredits(0)
        setReviewNotes("")
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
        const updatedSubmissions = submissions.map((s) =>
          s.id === submission.id ? { ...s, status: "rejected" as const, reviewNotes } : s,
        )
        onSubmissionUpdate(updatedSubmissions)

        // Reset form
        setSelectedSubmission(null)
        setReviewNotes("")
      }
    } catch (error) {
      addNotification("Failed to reject submission", "error")
    } finally {
      setIsProcessing(false)
    }
  }

  const pendingSubmissions = submissions.filter((s) => s.status === "pending")
  const approvedSubmissions = submissions.filter((s) => s.status === "approved")
  const rejectedSubmissions = submissions.filter((s) => s.status === "rejected")

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
            <h1 className="text-3xl font-bold text-gray-800">Submission Management</h1>
            <p className="text-gray-600">Review and approve recycling submissions</p>
          </div>
          <Button onClick={onBack} variant="outline">
            ← Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Badge variant="secondary">{pendingSubmissions.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Badge className="bg-green-100 text-green-800">{approvedSubmissions.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">Successfully processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <Badge className="bg-red-100 text-red-800">{rejectedSubmissions.length}</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedSubmissions.length}</div>
              <p className="text-xs text-muted-foreground">Did not meet criteria</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Submissions</CardTitle>
              <CardDescription>Items awaiting review and approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingSubmissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending submissions</p>
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
                      <p className="text-sm text-gray-600 mb-2">{submission.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>By: {submission.userName}</span>
                        <span>Est. Credits: ${submission.estimatedCredits.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Submitted: {submission.submissionDate}</p>
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
                    <h3 className="font-medium mb-2">{selectedSubmission.itemType}</h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedSubmission.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Quantity:</span> {selectedSubmission.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Condition:</span> {selectedSubmission.condition}
                      </div>
                      <div>
                        <span className="font-medium">Submitted by:</span> {selectedSubmission.userName}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span> {selectedSubmission.submissionDate}
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-medium">Estimated Credits:</span> $
                      {selectedSubmission.estimatedCredits.toFixed(2)}
                    </div>
                  </div>

                  {/* Review Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="actualCredits">Actual Credits to Award</Label>
                      <Input
                        id="actualCredits"
                        type="number"
                        step="0.01"
                        value={actualCredits}
                        onChange={(e) => setActualCredits(Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter actual credits"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to use estimated amount (${selectedSubmission.estimatedCredits.toFixed(2)})
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="reviewNotes">Review Notes</Label>
                      <Textarea
                        id="reviewNotes"
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes about your decision..."
                        rows={3}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(selectedSubmission)}
                        disabled={isProcessing}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        {isProcessing ? "Processing..." : "Approve"}
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
                  <p>Select a submission from the left to review</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Recently processed submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...approvedSubmissions, ...rejectedSubmissions]
                .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
                .slice(0, 10)
                .map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          submission.status === "approved" ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium">{submission.itemType}</p>
                        <p className="text-sm text-gray-600">
                          {submission.userName} • {submission.submissionDate}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={submission.status === "approved" ? "default" : "destructive"}
                        className={
                          submission.status === "approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {submission.status}
                      </Badge>
                      {submission.status === "approved" && (
                        <p className="text-sm text-gray-600 mt-1">
                          ${(submission.actualCredits || submission.estimatedCredits).toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
