"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { submitRecyclingItem, type DatabaseUser } from "@/lib/user-database"

interface RecyclingSubmissionModalProps {
  isOpen: boolean
  onClose: () => void
  user: DatabaseUser
  onSubmissionSuccess: () => void
}

const recyclingCategories = [
  { type: "Plastic Bottles", creditPerItem: 0.5, description: "Clean plastic bottles (PET)" },
  { type: "Aluminum Cans", creditPerItem: 1.2, description: "Aluminum beverage cans" },
  { type: "Paper/Cardboard", creditPerItem: 0.8, description: "Clean paper and cardboard" },
  { type: "Glass Bottles", creditPerItem: 0.7, description: "Glass bottles and jars" },
  { type: "Electronics", creditPerItem: 5.0, description: "Small electronics (phones, tablets)" },
  { type: "Batteries", creditPerItem: 2.0, description: "Household batteries" },
  { type: "Textiles", creditPerItem: 1.5, description: "Clean clothing and fabrics" },
  { type: "Metal Scrap", creditPerItem: 3.0, description: "Clean metal items and scrap" },
]

const collectionCenters = [
  "Downtown Collection Center",
  "North Side Collection Center",
  "East Side Collection Center",
  "West End Collection Center",
  "South Bay Collection Center",
]

export function RecyclingSubmissionModal({
  isOpen,
  onClose,
  user,
  onSubmissionSuccess,
}: RecyclingSubmissionModalProps) {
  const [selectedType, setSelectedType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const selectedCategory = recyclingCategories.find((cat) => cat.type === selectedType)
  const estimatedCredits = selectedCategory ? selectedCategory.creditPerItem * quantity : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType || quantity < 1 || !location) return

    setIsSubmitting(true)

    try {
      const submission = submitRecyclingItem({
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        itemType: selectedType,
        quantity,
        description,
        estimatedCredits,
        location,
      })

      console.log("Recycling submission created:", submission)

      // Reset form
      setSelectedType("")
      setQuantity(1)
      setDescription("")
      setLocation("")

      onSubmissionSuccess()
      onClose()
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Submit Recycling Items
          </CardTitle>
          <CardDescription>
            Submit your recycling items for review and earn credits. Items will be verified before credits are added to
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="itemType">Item Category</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recycling item category" />
                </SelectTrigger>
                <SelectContent>
                  {recyclingCategories.map((category) => (
                    <SelectItem key={category.type} value={category.type}>
                      <div className="flex justify-between items-center w-full">
                        <span>{category.type}</span>
                        <span className="text-green-600 ml-4">${category.creditPerItem}/item</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory && <p className="text-sm text-gray-600 mt-1">{selectedCategory.description}</p>}
            </div>

            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Collection Center</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select collection center" />
                </SelectTrigger>
                <SelectContent>
                  {collectionCenters.map((center) => (
                    <SelectItem key={center} value={center}>
                      {center}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the condition and any additional details about your items..."
                rows={3}
              />
            </div>

            {selectedType && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Estimated Credits</h4>
                <p className="text-2xl font-bold text-green-600">${estimatedCredits.toFixed(2)}</p>
                <p className="text-sm text-green-700">
                  {quantity} × {selectedCategory?.type} × ${selectedCategory?.creditPerItem}/item
                </p>
                <p className="text-xs text-green-600 mt-2">
                  *Final credits may vary based on actual condition and verification
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Submission Process</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Submit your recycling request online</li>
                <li>2. Bring items to selected collection center</li>
                <li>3. Items are verified and weighed by staff</li>
                <li>4. Credits are added to your account upon approval</li>
                <li>5. Receive notification of approval/rejection</li>
              </ol>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Important Guidelines</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Items must be clean and sorted by category</li>
                <li>• Electronics should be in working or repairable condition</li>
                <li>• Hazardous materials are not accepted</li>
                <li>• Bring valid ID when dropping off items</li>
                <li>• Credits are awarded only after verification</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600"
                disabled={!selectedType || quantity < 1 || !location || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit for Review"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
