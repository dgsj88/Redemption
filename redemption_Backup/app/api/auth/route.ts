import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, registerUser, initializeDatabase, logUserRegistration } from "@/lib/database"

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

    const { action, email, password, name, contactNumber, referralSource, marketingConsent } = await request.json()

    if (action === "login") {
      const user = await authenticateUser(email, password)

      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // Log successful login
      console.log(`User login: ${user.email} (${user.name}) at ${new Date().toISOString()}`)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({ user: userWithoutPassword })
    }

    if (action === "register") {
      // Enhanced validation for registration
      if (!name || name.trim().length < 2) {
        return NextResponse.json({ error: "Name must be at least 2 characters long" }, { status: 400 })
      }

      if (!email || !email.includes("@")) {
        return NextResponse.json({ error: "Valid email address is required" }, { status: 400 })
      }

      if (!password || password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      }

      // Register user with additional information
      const user = await registerUser(name, email, password, {
        contactNumber: contactNumber || "",
        referralSource: referralSource || "website",
        marketingConsent: marketingConsent || false,
      })

      // Log the registration for analytics
      await logUserRegistration(user.id, user.email, user.name, {
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
        referralSource: referralSource || "direct",
        marketingConsent: marketingConsent || false,
      })

      // Log successful registration
      console.log(`New user registration completed: ${user.email} (${user.name}) - ID: ${user.id}`)

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        user: userWithoutPassword,
        message: "Registration successful! Welcome to Redemption!",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Auth API error:", error)

    // Provide specific error messages for common issues
    if (error.message.includes("already exists")) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}
