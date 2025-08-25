"use client"
import { signOut } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RecyclingSubmissionModal } from "@/components/recycling-submission-modal"
import { Marketplace } from "@/components/marketplace"
// import { getRecyclingSubmissionsByUser, type RecyclingSubmission } from "@/lib/user-database"
import { DatabaseUser, RecyclingSubmission } from "@/lib/user-database"
//import { User } from "lucide-react"
// import { Post } from "@/lib/user-database"


interface User extends DatabaseUser {
  totalItemsTraded: number
  createdAt: string;
  credits: number;
}

interface UserDashboardProps {
  user: User

  // onLogout: (signOut: () => void) => void

  onTradeIn: () => void
  onViewAccount: () => void
  onUpdate: (user: DatabaseUser) => void
}

export function UserDashboard({ user, onViewAccount, onUpdate }: UserDashboardProps) {

  useEffect(() => {
      fetch(`/api/users/${user.id}`)
        .then(res => res.json())
        .then(data => {setUserData(data) });
    }, [user, user.id]);

    console.log("user in dashboard:", user);

  useEffect(() => {
    fetch("/api/posts/count")
      .then(res => res.json())
      .then(data => setPostCount(data.count ?? 0))
      .catch(() => setPostCount(0));
  }, [user.id]);

  // Add new state variables
  const [showRecyclingModal, setShowRecyclingModal] = useState(false)
  const [showMarketplace, setShowMarketplace] = useState(false)
  const [userSubmissions, setUserSubmissions] = useState<RecyclingSubmission[]>([])
  const [userData, setUserData] = useState(null);
  const [postCount, setPostCount] = useState<number>(0);

  const getRecyclingSubmissionsByUser = async (id: string) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'GET',
        headers: { "content-type": "application/json" },
      })
      const data = await response.json()
      return data
    }

  // Add new handler functions
  const handleRecyclingSubmission = () => {
    setShowRecyclingModal(true)
  }

  const handleSubmissionSuccess = () => {
    // Reload submissions after successful submission
    getRecyclingSubmissionsByUser(user.id).then((submissions) => {
      setUserSubmissions(submissions)
    })
  }

  const handleViewMarketplace = () => {
    setShowMarketplace(true)
  }

  const handleBackFromMarketplace = () => {
    setShowMarketplace(false)
  }


  // If showing marketplace, render it instead of dashboard
  if (showMarketplace) {
    return <Marketplace user={user} onBack={handleBackFromMarketplace} onUserUpdate={onUpdate} />
  }

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.email}!</h1>
              <p className="text-gray-600">Member since {userData?.createdAt || "Not Specified"}</p>
             {/* <p className="text-gray-600">Member since {(userData?.createdAt).toLocaleDateString("en-GB",{
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}</p> */}

          </div>
          <div className="flex gap-3">
            <Button onClick={onViewAccount} variant="outline">
              Account Settings
            </Button>
            <Button onClick={() => signOut()} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credit Balance</CardDescription>
              <CardTitle className="text-3xl text-green-600">${userData?.credits || 0}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Available for redemption</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Items Traded</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{postCount}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Total recycled items</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Environmental Impact</CardDescription>
              <CardTitle className="text-3xl text-purple-600">2.4 lbs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">CO₂ saved this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-6 mb-8">
          <Button onClick={handleRecyclingSubmission} className="bg-green-500 hover:bg-green-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Submit Recycling Items
          </Button>
          <Button onClick={handleViewMarketplace} variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Browse Marketplace
          </Button>
          {/* <Button onClick={onTradeIn} variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Trade In Items (Legacy)
          </Button> */}
          {/* <Button variant="outline">View Rewards</Button> */}
        </div>

        {/* Recent Submissions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recent Recycling Submissions</CardTitle>
            <CardDescription>Your latest recycling submissions and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(userSubmissions) && userSubmissions.slice(0, 5).map((submission) => (
                <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{submission.itemType}</h4>
                    <p className="text-sm text-gray-600">Quantity: {submission.quantity} items</p>
                    <p className="text-sm text-gray-500">{submission.submissionDate}</p>
                    <p className="text-xs text-gray-500">{submission.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      ${(submission.actualCredits ?? submission.estimatedCredits)?.toFixed(2) ?? "0.00"}
                    </p>
                    <Badge className={getStatusColor(submission.status)}>{submission.status}</Badge>
                    {submission.status === "approved" && submission.reviewNotes && (
                      <p className="text-xs text-gray-500 mt-1">{submission.reviewNotes}</p>
                    )}
                  </div>
                </div>
              ))}
              {userSubmissions.length === 0 && (
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
                  <p>No recycling submissions yet</p>
                  <p className="text-sm">Click &quot;Submit Recycling Items&quot; to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recycling Submission Modal */}
        <RecyclingSubmissionModal
          isOpen={showRecyclingModal}
          onClose={() => setShowRecyclingModal(false)}
          user={user}
          onSubmissionSuccess={handleSubmissionSuccess}
        />
      </div>
    </div>
  )
}

