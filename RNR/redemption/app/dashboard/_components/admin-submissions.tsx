"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Notification } from "@/components/notification"

// import { getAllRecyclingSubmissions, approveRecyclingSubmission, rejectRecyclingSubmission } from "../../api/transactions/route"

// Define the RecyclingSubmission
export type RecyclingSubmission = {
  id: string
  name: string
  userEmail: string
  userName?: string
  itemType: string
  itemQuantity: number
location: string
  submittedDate: string
  estimatedCredits: number
  actualCredits: number
  description?: string
  isApproved: boolean
  reviewedBy?: string
  reviewedDate?: string
  reviewNotes?: string
  status: "pending" | "approved" | "rejected"
}

interface AdminSubmissionsProps {
  onBack: () => void
}

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

export function AdminSubmissions({ onBack }: AdminSubmissionsProps) {
  const [submissions, setSubmissions] = useState<RecyclingSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<RecyclingSubmission | null>(null)
  const [reviewNotes, setReviewNotes] = useState("")
  const [actualCredits, setActualCredits] = useState(0)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [showMarketplaceForm, setShowMarketplaceForm] = useState(false)
  const [marketplaceFormData, setMarketplaceFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "excellent" as "excellent" | "good" | "fair" | "poor",
    creditPrice: 0,
    specifications: {} as Record<string, string>,
    tags: [] as string[],
  })

  // Add currentView state
  const [currentView, setCurrentView] = useState("submissions")

  useEffect(() => {
    if (currentView === "post") {
      fetch("/api/posts?isApproved=true&sortByCreatedAt=desc")
        .then((res) => res.json())
        .then((data) => setPosts(data.posts))
        .catch((err) => console.error("Failed to fetch posts:", err));
    }
  }, [currentView]);    

  const loadSubmissions = () => {
    const allSubmissions = getAllRecyclingSubmissions()
    setSubmissions(allSubmissions)
  }

  const addNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleApprove = () => {
    if (!selectedSubmission || actualCredits <= 0) return

    const success = approveRecyclingSubmission(selectedSubmission.id, actualCredits, reviewNotes, "Admin User")

    if (success) {
      addNotification(
        `Submission approved! ${actualCredits} credits awarded to ${selectedSubmission.name}`,
        "success",
      )
      loadSubmissions()
      setSelectedSubmission(null)
      setReviewNotes("")
      setActualCredits(0)
    }
  }

  const handleReject = () => {
    if (!selectedSubmission || !reviewNotes.trim()) return

    const success = rejectRecyclingSubmission(selectedSubmission.id, reviewNotes, "Admin User")

    if (success) {
      addNotification(`Submission rejected for ${selectedSubmission.userName}`, "info")
      loadSubmissions()
      setSelectedSubmission(null)
      setReviewNotes("")
      setActualCredits(0)
    }
  }

  const handleAddToMarketplace = () => {
    if (!marketplaceFormData.title || !marketplaceFormData.description || marketplaceFormData.creditPrice <= 0) {
      addNotification("Please fill in all required fields", "error")
      return
    }

    // TODO: Implement marketplace item addition logic here, e.g. call an API or use the correct function from user-database.
    addNotification(`Item "${marketplaceFormData.title}" added to marketplace for ${marketplaceFormData.creditPrice} credits`, "success")
    setShowMarketplaceForm(false)
    setMarketplaceFormData({
      title: "",
      description: "",
      category: "",
      condition: "excellent",
      creditPrice: 0,
      specifications: {},
      tags: [],
    })
  }

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    const matchesSearch =
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length
  const approvedCount = submissions.filter((s) => s.status === "approved").length
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length

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
            <Button onClick={onBack} variant="outline" size="sm" className="mb-4">
              ← Back to Admin Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Recycling Submissions</h1>
            <p className="text-gray-600">Review and manage user recycling submissions</p>
          </div>
          <Button onClick={() => setShowMarketplaceForm(true)} className="bg-blue-500 hover:bg-blue-600">
            Add Item to Marketplace
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Submissions</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{submissions.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending Review</CardDescription>
              <CardTitle className="text-3xl text-yellow-600">{pendingCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Approved</CardDescription>
              <CardTitle className="text-3xl text-green-600">{approvedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Credits awarded</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl text-red-600">{rejectedCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Not approved</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submissions List</CardTitle>
                <CardDescription>Click on a submission to review and approve/reject</CardDescription>

                {/* Filters */}
                <div className="flex gap-4 mt-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by user name, email, or item type..."
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
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredSubmissions.map((submission) => (
                    <div
                      key={submission.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedSubmission?.id === submission.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => {
                        setSelectedSubmission(submission)
                        setActualCredits(submission.actualCredits || submission.estimatedCredits)
                        setReviewNotes(submission.reviewNotes || "")
                      }}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold">{submission.name}</h4>
                          <p className="text-sm text-gray-600">{submission.userEmail}</p>
                        </div>
                        <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Item:</span> {submission.itemType}
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {submission.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Estimated:</span> ${submission.estimatedCredits}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {submission.submittedDate}
                        </div>
                      </div>
                      {submission.location && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Location:</span> {submission.location}
                        </p>
                      )}
                    </div>
                  ))}

                  {filteredSubmissions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No submissions found matching your criteria.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div>
            {selectedSubmission ? (
              <Card>
                <CardHeader>
                  <CardTitle>Review Submission</CardTitle>
                  <CardDescription>Review and approve/reject the selected submission</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Submission Details</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">User:</span> {selectedSubmission.name}
                      </div>
                      <div>
                        <span className="font-medium">Email:</span> {selectedSubmission.userEmail}
                      </div>
                      <div>
                        <span className="font-medium">Item:</span> {selectedSubmission.itemType}
                      </div>
                      <div>
                        <span className="font-medium">Quantity:</span> {selectedSubmission.quantity}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {selectedSubmission.location}
                      </div>
                      <div>
                        <span className="font-medium">Submitted:</span> {selectedSubmission.submittedDate}
                      </div>
                      <div>
                        <span className="font-medium">Estimated Credits:</span> ${selectedSubmission.estimatedCredits}
                      </div>
                    </div>
                    {selectedSubmission.description && (
                      <div className="mt-2">
                        <span className="font-medium">Description:</span>
                        <p className="text-sm text-gray-600 mt-1">{selectedSubmission.description}</p>
                      </div>
                    )}
                  </div>

                  {selectedSubmission.status === "pending" && (
                    <>
                      <div>
                        <Label htmlFor="actualCredits">Actual Credits to Award</Label>
                        <Input
                          id="actualCredits"
                          type="number"
                          step="0.1"
                          min="0"
                          value={actualCredits}
                          onChange={(e) => setActualCredits(Number.parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="reviewNotes">Review Notes</Label>
                        <Textarea
                          id="reviewNotes"
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add notes about the review decision..."
                          rows={3}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleApprove}
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          disabled={actualCredits <= 0}
                        >
                          Approve & Award Credits
                        </Button>
                        <Button
                          onClick={handleReject}
                          variant="outline"
                          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                          disabled={!reviewNotes.trim()}
                        >
                          Reject
                        </Button>
                      </div>
                    </>
                  )}

                  {selectedSubmission.status !== "pending" && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Review Complete</h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>
                          <span className="font-medium">Status:</span> {selectedSubmission.status}
                        </div>
                        <div>
                          <span className="font-medium">Reviewed by:</span> {selectedSubmission.reviewedBy}
                        </div>
                        <div>
                          <span className="font-medium">Review date:</span> {selectedSubmission.reviewedDate}
                        </div>
                        {selectedSubmission.actualCredits && (
                          <div>
                            <span className="font-medium">Credits awarded:</span> ${selectedSubmission.actualCredits}
                          </div>
                        )}
                        {selectedSubmission.reviewNotes && (
                          <div>
                            <span className="font-medium">Notes:</span>
                            <p className="mt-1">{selectedSubmission.reviewNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Select a Submission</h3>
                  <p className="text-gray-600 text-sm">
                    Click on a submission from the list to review and approve/reject it.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Marketplace Form Modal */}
        {showMarketplaceForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add Item to Marketplace</CardTitle>
                <CardDescription>Create a new item for users to purchase with their credits</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Item Title</Label>
                  <Input
                    id="title"
                    value={marketplaceFormData.title}
                    onChange={(e) => setMarketplaceFormData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter item title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={marketplaceFormData.description}
                    onChange={(e) => setMarketplaceFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the item..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={marketplaceFormData.category}
                      onValueChange={(value) => setMarketplaceFormData((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Furniture">Furniture</SelectItem>
                        <SelectItem value="Clothing">Clothing</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={marketplaceFormData.condition}
                      onValueChange={(value: "excellent" | "good" | "fair" | "poor") =>
                        setMarketplaceFormData((prev) => ({ ...prev, condition: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="creditPrice">Credit Price</Label>
                  <Input
                    id="creditPrice"
                    type="number"
                    step="0.1"
                    min="0"
                    value={marketplaceFormData.creditPrice}
                    onChange={(e) =>
                      setMarketplaceFormData((prev) => ({
                        ...prev,
                        creditPrice: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="Enter credit price"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToMarketplace}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    disabled={
                      !marketplaceFormData.title ||
                      !marketplaceFormData.description ||
                      marketplaceFormData.creditPrice <= 0
                    }
                  >
                    Add to Marketplace
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowMarketplaceForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
function setPosts(posts: any): any {
  throw new Error("Function not implemented.")
}

function getAllRecyclingSubmissions(): RecyclingSubmission[] {
  // TODO: Replace with actual implementation to fetch submissions
  return []
}
function approveRecyclingSubmission(
  id: string,
  actualCredits: number,
  reviewNotes: string,
  reviewedBy: string
): boolean {
  // Simulate updating the submission in a database
  // In a real app, this would be an API call
  const submissions = getAllRecyclingSubmissions()
  const index = submissions.findIndex((s) => s.id === id)
  if (index === -1) return false

  submissions[index] = {
    ...submissions[index],
    isApproved: true,
    status: "approved",
    actualCredits,
    reviewNotes,
    reviewedBy,
    reviewedDate: new Date().toISOString(),
  }
  // Simulate saving to database
  // e.g. localStorage.setItem("submissions", JSON.stringify(submissions))
  return true
}

// Add rejectRecyclingSubmission implementation
function rejectRecyclingSubmission(
  id: string,
  reviewNotes: string,
  reviewedBy: string
): boolean {
  // Simulate updating the submission in a database
  // In a real app, this would be an API call
  const submissions = getAllRecyclingSubmissions()
  const index = submissions.findIndex((s) => s.id === id)
  if (index === -1) return false

  submissions[index] = {
    ...submissions[index],
    isApproved: false,
    status: "rejected",
    reviewNotes,
    reviewedBy,
    reviewedDate: new Date().toISOString(),
  }
  // Simulate saving to database
  // e.g. localStorage.setItem("submissions", JSON.stringify(submissions))
  return true
}

