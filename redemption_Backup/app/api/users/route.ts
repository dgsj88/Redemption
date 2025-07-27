import { type NextRequest, NextResponse } from "next/server"
import {
  getAllUsers,
  updateUser,
  updateUserStatus,
  deleteUser,
  getUserDeletionInfo,
  initializeDatabase,
} from "@/lib/database"

// Initialize database on first API call
let dbInitialized = false

async function ensureDbInitialized() {
  if (!dbInitialized) {
    await initializeDatabase()
    dbInitialized = true
  }
}

export async function GET() {
  try {
    await ensureDbInitialized()
    const users = await getAllUsers()

    // Remove passwords from response
    const usersWithoutPasswords = users.map(({ password, ...user }) => user)

    return NextResponse.json({ users: usersWithoutPasswords })
  } catch (error: any) {
    console.error("Get users API error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch users" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const { userId, updates, action } = await request.json()

    if (action === "updateStatus") {
      const success = await updateUserStatus(userId, updates.accountStatus)
      return NextResponse.json({ success })
    }

    if (action === "updateProfile") {
      const updatedUser = await updateUser(userId, updates)
      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = updatedUser
      return NextResponse.json({ user: userWithoutPassword })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Update user API error:", error)
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await ensureDbInitialized()
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Get user info before deletion for logging
    const deletionInfo = await getUserDeletionInfo(userId)

    if (!deletionInfo) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Delete the user
    const success = await deleteUser(userId)

    if (success) {
      console.log(`Admin deleted user: ${deletionInfo.user.email} (${deletionInfo.user.name}) - ID: ${userId}`)
      console.log(
        `Deleted user had ${deletionInfo.tradeInsCount} trade-ins and $${deletionInfo.totalCredits} in credits`,
      )

      return NextResponse.json({
        success: true,
        message: `User ${deletionInfo.user.name} has been successfully deleted`,
      })
    } else {
      return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Delete user API error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 })
  }
}
