import { type NextRequest, NextResponse } from "next/server"
import { getUserDeletionInfo, initializeDatabase } from "@/lib/database"

// Initialize database on first API call
let dbInitialized = false

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureDbInitialized()

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const deletionInfo = await getUserDeletionInfo(userId)

    if (!deletionInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = deletionInfo.user

    return NextResponse.json({
      deletionInfo: {
        ...deletionInfo,
        user: userWithoutPassword,
      },
    })
  } catch (error: any) {
    console.error("Get user deletion info API error:", error)
    return NextResponse.json({ error: error.message || "Failed to get user deletion info" }, { status: 500 })
  }
}
