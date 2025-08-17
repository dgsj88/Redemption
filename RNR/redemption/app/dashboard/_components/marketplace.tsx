"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Notification } from "@/components/notification"
import {
  getAllMarketplaceItems,
  purchaseMarketplaceItem,
  getCreditTransactionsByUser,
  type MarketplaceItem,
  type DatabaseUser,
  type CreditTransaction,
} from "@/lib/user-database"
import Image from "next/image"

interface MarketplaceProps {
  user: DatabaseUser
  onBack: () => void
  onUserUpdate: (user: DatabaseUser) => void
}

interface NotificationState {
  message: string
  type: "success" | "error" | "info"
  id: number
}

export function Marketplace({ user, onBack, onUserUpdate }: MarketplaceProps) {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [notifications, setNotifications] = useState<NotificationState[]>([])
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [showTransactions, setShowTransactions] = useState(false)

  useEffect(() => {
    loadItems()
    loadTransactions()
  }, [])

  const loadItems = () => {
    const allItems = getAllMarketplaceItems()
    setItems(allItems)
  }

  const loadTransactions = () => {
    const userTransactions = getCreditTransactionsByUser(user.id)
    setTransactions(userTransactions)
  }

  const addNotification = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { message, type, id }])
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handlePurchase = (itemId: string) => {
    const success = purchaseMarketplaceItem(itemId, user.id)

    if (success) {
      const item = items.find((i) => i.id === itemId)
      addNotification(`Successfully purchased ${item?.title}!`, "success")

      // Update user data and reload items
      const updatedUser = { ...user, creditBalance: user.creditBalance - (item?.creditPrice || 0) }
      onUserUpdate(updatedUser)
      loadItems()
      loadTransactions()
      setSelectedItem(null)
    } else {
      addNotification("Purchase failed. Insufficient credits or item unavailable.", "error")
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && item.creditPrice <= 20) ||
      (priceFilter === "medium" && item.creditPrice > 20 && item.creditPrice <= 50) ||
      (priceFilter === "high" && item.creditPrice > 50)

    return matchesSearch && matchesCategory && matchesPrice
  })

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-green-100 text-green-800"
      case "good":
        return "bg-blue-100 text-blue-800"
      case "fair":
        return "bg-yellow-100 text-yellow-800"
      case "poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const categories = [...new Set(items.map((item) => item.category))]

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
              ← Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">Marketplace</h1>
            <p className="text-gray-600">Use your credits to purchase eco-friendly items</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">${user.credits.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Available Credits</div>
            <Button onClick={() => setShowTransactions(!showTransactions)} variant="outline" size="sm" className="mt-2">
              {showTransactions ? "Hide" : "View"} Transactions
            </Button>
          </div>
        </div>

        {/* Credit Transactions */}
        {showTransactions && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your credit earning and spending history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{transaction.date}</p>
                    </div>
                    <div className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && <p className="text-center text-gray-500 py-4">No transactions yet</p>}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="low">Under 20 credits</SelectItem>
                      <SelectItem value="medium">20-50 credits</SelectItem>
                      <SelectItem value="high">Over 50 credits</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Stats</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Available Items: {items.length}</div>
                    <div>Your Credits: ${user.creditBalance.toFixed(2)}</div>
                    <div>
                      Items You Can Afford: {items.filter((item) => item.creditPrice <= user.creditBalance).length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Items Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedItem?.id === item.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-lg font-bold text-green-600">${item.creditPrice} credits</div>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">No Items Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Item Details */}
          <div className="lg:col-span-1">
            {selectedItem ? (
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{selectedItem.title}</CardTitle>
                  <CardDescription>{selectedItem.category}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-square relative">
                    <Image
                      src={selectedItem.images[0] || "/placeholder.svg"}
                      alt={selectedItem.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedItem.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Condition:</span>
                        <Badge className={getConditionColor(selectedItem.condition)}>{selectedItem.condition}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Seller:</span>
                        <span>{selectedItem.sellerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Listed:</span>
                        <span>{selectedItem.createdDate}</span>
                      </div>
                    </div>
                  </div>

                  {selectedItem.specifications && Object.keys(selectedItem.specifications).length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Specifications</h4>
                      <div className="space-y-1 text-sm">
                        {Object.entries(selectedItem.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span>{key}:</span>
                            <span className="text-gray-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="text-2xl font-bold text-green-600 mb-4">${selectedItem.creditPrice} credits</div>

                    {user.creditBalance >= selectedItem.creditPrice ? (
                      <Button
                        onClick={() => handlePurchase(selectedItem.id)}
                        className="w-full bg-green-500 hover:bg-green-600"
                      >
                        Purchase with Credits
                      </Button>
                    ) : (
                      <div>
                        <Button disabled className="w-full mb-2">
                          Insufficient Credits
                        </Button>
                        <p className="text-sm text-red-600 text-center">
                          You need ${(selectedItem.creditPrice - user.creditBalance).toFixed(2)} more credits
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-1">Purchase Process</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Credits are deducted immediately</li>
                      <li>• Item will be reserved for pickup</li>
                      <li>• You'll receive pickup instructions</li>
                      <li>• Bring ID when collecting item</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-8">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Select an Item</h3>
                  <p className="text-gray-600 text-sm">Click on an item to view details and purchase options.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
