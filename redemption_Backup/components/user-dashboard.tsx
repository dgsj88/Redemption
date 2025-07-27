"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface User {
  name: string
  email: string
  contactNumber: string
  creditBalance: number
  totalItemsTraded: number
  memberSince: string
  accountStatus: "active" | "pending" | "suspended"
}

interface TradeInItem {
  id: string
  type: string
  quantity: number
  credits: number
  date: string
  status: "pending" | "approved" | "rejected"
}

interface UserDashboardProps {
  user: User
  onLogout: () => void
  onTradeIn: () => void
  onViewAccount: () => void
}

export function UserDashboard({ user, onLogout, onTradeIn, onViewAccount }: UserDashboardProps) {
  const [recentTrades] = useState<TradeInItem[]>([
    {
      id: "1",
      type: "Plastic Bottles",
      quantity: 25,
      credits: 12.5,
      date: "2024-01-20",
      status: "approved",
    },
    {
      id: "2",
      type: "Aluminum Cans",
      quantity: 15,
      credits: 18.0,
      date: "2024-01-18",
      status: "approved",
    },
    {
      id: "3",
      type: "Paper/Cardboard",
      quantity: 10,
      credits: 8.5,
      date: "2024-01-15",
      status: "pending",
    },
  ])

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
            <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
            <p className="text-gray-600">Member since {user.memberSince}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onViewAccount} variant="outline">
              Account Settings
            </Button>
            <Button onClick={onLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Credit Balance</CardDescription>
              <CardTitle className="text-3xl text-green-600">${user.creditBalance.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Available for redemption</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Items Traded</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{user.totalItemsTraded}</CardTitle>
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
        <div className="flex gap-4 mb-8">
          <Button onClick={onTradeIn} className="bg-green-500 hover:bg-green-600">
            Trade In Items
          </Button>
          <Button variant="outline">Redeem Credits</Button>
          <Button variant="outline">View Rewards</Button>
        </div>

        {/* Recent Trades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Trade-Ins</CardTitle>
            <CardDescription>Your latest recycling activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{trade.type}</h4>
                    <p className="text-sm text-gray-600">Quantity: {trade.quantity} items</p>
                    <p className="text-sm text-gray-500">{trade.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">+${trade.credits.toFixed(2)}</p>
                    <Badge className={getStatusColor(trade.status)}>{trade.status}</Badge>
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
