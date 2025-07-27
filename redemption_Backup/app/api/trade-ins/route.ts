import { type NextRequest, NextResponse } from "next/server"
import { createTradeIn, updateUser, getUserById, initializeDatabase } from "@/lib/database"

// Initialize database on first API call
let dbInitialized = false

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const { userId, itemType, quantity, credits, description } = await request.json()

    // Create trade-in record
    await createTradeIn(userId, itemType, quantity, credits, description)

    // Update user's credit balance and items traded
    const user = await getUserById(userId)
    if (user) {
      await updateUser(userId, {
        creditBalance: user.creditBalance + credits,
        totalItemsTraded: user.totalItemsTraded + quantity,
        totalCreditsEarned: user.totalCreditsEarned + credits,
      })

      // Get updated user
      const updatedUser = await getUserById(userId)
      if (updatedUser) {
        const { password: _, ...userWithoutPassword } = updatedUser
        return NextResponse.json({ user: userWithoutPassword })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Trade-in API error:", error)
    return NextResponse.json({ error: error.message || "Failed to process trade-in" }, { status: 500 })
  }
}
