"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TradeInModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (item: TradeInSubmission) => void
}

interface TradeInSubmission {
  type: string
  quantity: number
  description: string
  estimatedCredits: number
}

const recyclingItems = [
  { type: "Plastic Bottles", creditPerItem: 0.5, description: "Clean plastic bottles (PET)" },
  { type: "Aluminum Cans", creditPerItem: 1.2, description: "Aluminum beverage cans" },
  { type: "Paper/Cardboard", creditPerItem: 0.8, description: "Clean paper and cardboard" },
  { type: "Glass Bottles", creditPerItem: 0.7, description: "Glass bottles and jars" },
  { type: "Electronics", creditPerItem: 5.0, description: "Small electronics (phones, tablets)" },
  { type: "Batteries", creditPerItem: 2.0, description: "Household batteries" },
]

export function TradeInModal({ isOpen, onClose, onSubmit }: TradeInModalProps) {
  const [selectedType, setSelectedType] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [description, setDescription] = useState("")

  if (!isOpen) return null

  const selectedItem = recyclingItems.find((item) => item.type === selectedType)
  const estimatedCredits = selectedItem ? selectedItem.creditPerItem * quantity : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedType && quantity > 0) {
      onSubmit({
        type: selectedType,
        quantity,
        description,
        estimatedCredits,
      })
      onClose()
      // Reset form
      setSelectedType("")
      setQuantity(1)
      setDescription("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Trade In Recycled Items</CardTitle>
          <CardDescription>
            Submit your recycled items to earn credits. Items will be reviewed and credits added to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="itemType">Item Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recycling item type" />
                </SelectTrigger>
                <SelectContent>
                  {recyclingItems.map((item) => (
                    <SelectItem key={item.type} value={item.type}>
                      <div className="flex justify-between items-center w-full">
                        <span>{item.type}</span>
                        <span className="text-green-600 ml-4">${item.creditPerItem}/item</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedItem && <p className="text-sm text-gray-600 mt-1">{selectedItem.description}</p>}
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
              <Label htmlFor="description">Additional Description (Optional)</Label>
              <Input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any additional details about the items..."
              />
            </div>

            {selectedType && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Estimated Credits</h4>
                <p className="text-2xl font-bold text-green-600">${estimatedCredits.toFixed(2)}</p>
                <p className="text-sm text-green-700">
                  {quantity} × {selectedItem?.type} × ${selectedItem?.creditPerItem}/item
                </p>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Trade-In Process</h4>
              <ol className="text-sm text-blue-700 space-y-1">
                <li>1. Submit your trade-in request</li>
                <li>2. Bring items to our collection center</li>
                <li>3. Items are verified and weighed</li>
                <li>4. Credits are added to your account</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600"
                disabled={!selectedType || quantity < 1}
              >
                Submit Trade-In Request
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
