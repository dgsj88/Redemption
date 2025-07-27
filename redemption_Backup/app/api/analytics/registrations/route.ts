import { NextResponse } from "next/server"
import { pool, initializeDatabase } from "@/lib/database"

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

    // Get registration statistics
    const [registrationStats] = await pool.execute(`
      SELECT 
        DATE(createdAt) as registration_date,
        COUNT(*) as daily_registrations,
        COUNT(CASE WHEN accountStatus = 'active' THEN 1 END) as active_users,
        COUNT(CASE WHEN contactNumber != '' THEN 1 END) as users_with_phone
      FROM users 
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAYS)
      GROUP BY DATE(createdAt)
      ORDER BY registration_date DESC
    `)

    // Get total registration count
    const [totalCount] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAYS) THEN 1 END) as weekly_registrations,
        COUNT(CASE WHEN createdAt >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN 1 END) as daily_registrations
      FROM users
    `)

    return NextResponse.json({
      registrationStats,
      summary: (totalCount as any)[0],
    })
  } catch (error: any) {
    console.error("Registration analytics error:", error)
    return NextResponse.json({ error: "Failed to fetch registration analytics" }, { status: 500 })
  }
}
