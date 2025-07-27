import mysql from "mysql2/promise"

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "redemption_db",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

// Create connection pool for better performance
export const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// Database user interface
export interface DatabaseUser {
  id: string
  name: string
  email: string
  password: string
  contactNumber: string
  creditBalance: number
  totalItemsTraded: number
  memberSince: string
  accountStatus: "active" | "pending" | "suspended"
  lastLogin: string
  totalCreditsEarned: number
  createdAt: Date
  updatedAt: Date
}

// Initialize database tables
export async function initializeDatabase() {
  try {
    const connection = await pool.getConnection()

    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        contactNumber VARCHAR(50) DEFAULT '',
        creditBalance DECIMAL(10, 2) DEFAULT 0.00,
        totalItemsTraded INT DEFAULT 0,
        memberSince VARCHAR(50) NOT NULL,
        accountStatus ENUM('active', 'pending', 'suspended') DEFAULT 'active',
        lastLogin DATE,
        totalCreditsEarned DECIMAL(10, 2) DEFAULT 0.00,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (accountStatus)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Create trade_ins table for tracking user trade-ins
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS trade_ins (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        userId VARCHAR(36) NOT NULL,
        itemType VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        credits DECIMAL(10, 2) NOT NULL,
        description TEXT,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (userId),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    // Create registration_logs table for tracking user registrations
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS registration_logs (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        userId VARCHAR(36) NOT NULL,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        registrationSource VARCHAR(100) DEFAULT 'website',
        ipAddress VARCHAR(45),
        userAgent TEXT,
        referralSource VARCHAR(255),
        marketingConsent BOOLEAN DEFAULT FALSE,
        registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_registration_date (registrationDate),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log("Registration logs table created/verified")

    // Insert sample data if users table is empty
    const [rows] = await connection.execute("SELECT COUNT(*) as count FROM users")
    const count = (rows as any)[0].count

    if (count === 0) {
      await insertSampleData(connection)
    }

    connection.release()
    console.log("Database initialized successfully")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

// Insert sample data
async function insertSampleData(connection: mysql.PoolConnection) {
  const sampleUsers = [
    {
      name: "John Smith",
      email: "john.smith@email.com",
      password: "password123",
      contactNumber: "+1-555-0123",
      creditBalance: 45.75,
      totalItemsTraded: 127,
      memberSince: "January 2024",
      accountStatus: "active",
      lastLogin: "2024-01-25",
      totalCreditsEarned: 234.5,
    },
    {
      name: "Sarah Johnson",
      email: "sarah.j@gmail.com",
      password: "mypassword",
      contactNumber: "+1-555-0456",
      creditBalance: 78.2,
      totalItemsTraded: 203,
      memberSince: "December 2023",
      accountStatus: "active",
      lastLogin: "2024-01-24",
      totalCreditsEarned: 456.8,
    },
    {
      name: "Mike Wilson",
      email: "mike.wilson@yahoo.com",
      password: "wilson2024",
      contactNumber: "",
      creditBalance: 12.3,
      totalItemsTraded: 45,
      memberSince: "January 2024",
      accountStatus: "pending",
      lastLogin: "2024-01-20",
      totalCreditsEarned: 89.6,
    },
    {
      name: "Emily Davis",
      email: "emily.davis@outlook.com",
      password: "emily123",
      contactNumber: "+1-555-0789",
      creditBalance: 156.9,
      totalItemsTraded: 312,
      memberSince: "November 2023",
      accountStatus: "active",
      lastLogin: "2024-01-25",
      totalCreditsEarned: 678.4,
    },
    {
      name: "Robert Brown",
      email: "r.brown@email.com",
      password: "robert456",
      contactNumber: "+1-555-0321",
      creditBalance: 0.0,
      totalItemsTraded: 8,
      memberSince: "January 2024",
      accountStatus: "suspended",
      lastLogin: "2024-01-15",
      totalCreditsEarned: 23.5,
    },
  ]

  for (const user of sampleUsers) {
    await connection.execute(
      `INSERT INTO users (name, email, password, contactNumber, creditBalance, totalItemsTraded, 
       memberSince, accountStatus, lastLogin, totalCreditsEarned) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.name,
        user.email,
        user.password,
        user.contactNumber,
        user.creditBalance,
        user.totalItemsTraded,
        user.memberSince,
        user.accountStatus,
        user.lastLogin,
        user.totalCreditsEarned,
      ],
    )
  }

  console.log("Sample data inserted successfully")
}

// Authentication functions
export async function authenticateUser(email: string, password: string): Promise<DatabaseUser | null> {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ? AND password = ?", [email, password])

    const users = rows as DatabaseUser[]
    if (users.length === 0) {
      return null // User not found or invalid password
    }

    const user = users[0]

    if (user.accountStatus === "suspended") {
      throw new Error("Account suspended. Please contact support.")
    }

    // Update last login
    await pool.execute("UPDATE users SET lastLogin = CURDATE() WHERE id = ?", [user.id])

    return user
  } catch (error) {
    console.error("Authentication error:", error)
    throw error
  }
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  additionalInfo?: {
    contactNumber?: string
    referralSource?: string
    marketingConsent?: boolean
  },
): Promise<DatabaseUser> {
  try {
    // Check if user already exists
    const [existingUsers] = await pool.execute("SELECT id FROM users WHERE email = ?", [email])

    if ((existingUsers as any[]).length > 0) {
      throw new Error("An account with this email already exists")
    }

    // Create new user with detailed information
    const memberSince = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })
    const currentDate = new Date().toISOString().split("T")[0]

    const [result] = await pool.execute(
      `INSERT INTO users (name, email, password, contactNumber, memberSince, lastLogin, accountStatus, 
       creditBalance, totalItemsTraded, totalCreditsEarned) 
       VALUES (?, ?, ?, ?, ?, ?, 'active', 0.00, 0, 0.00)`,
      [
        name.trim(),
        email.toLowerCase().trim(),
        password, // In production, this should be hashed
        additionalInfo?.contactNumber || "",
        memberSince,
        currentDate,
      ],
    )

    // Log the registration
    console.log(`New user registered: ${email} (${name}) at ${new Date().toISOString()}`)

    // Fetch the newly created user with all details
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()])
    const newUser = (rows as DatabaseUser[])[0]

    if (!newUser) {
      throw new Error("Failed to retrieve newly created user")
    }

    // Log successful registration with user ID
    console.log(`User registration completed - ID: ${newUser.id}, Email: ${newUser.email}`)

    await logUserRegistration(newUser.id, newUser.email, newUser.name, additionalInfo)

    return newUser
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function updateUser(userId: string, updates: Partial<DatabaseUser>): Promise<DatabaseUser | null> {
  try {
    const updateFields = []
    const updateValues = []

    // Build dynamic update query
    for (const [key, value] of Object.entries(updates)) {
      if (key !== "id" && key !== "createdAt" && key !== "updatedAt") {
        updateFields.push(`${key} = ?`)
        updateValues.push(value)
      }
    }

    if (updateFields.length === 0) {
      return null
    }

    updateValues.push(userId)

    await pool.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    // Fetch updated user
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId])

    return (rows as DatabaseUser[])[0] || null
  } catch (error) {
    console.error("Update user error:", error)
    throw error
  }
}

export async function getAllUsers(): Promise<DatabaseUser[]> {
  try {
    const [rows] = await pool.execute("SELECT * FROM users ORDER BY createdAt DESC")
    return rows as DatabaseUser[]
  } catch (error) {
    console.error("Get all users error:", error)
    throw error
  }
}

export async function updateUserStatus(userId: string, status: "active" | "pending" | "suspended"): Promise<boolean> {
  try {
    const [result] = await pool.execute("UPDATE users SET accountStatus = ? WHERE id = ?", [status, userId])

    return (result as any).affectedRows > 0
  } catch (error) {
    console.error("Update user status error:", error)
    return false
  }
}

export async function deleteUser(userId: string): Promise<boolean> {
  try {
    // Start a transaction to ensure data consistency
    const connection = await pool.getConnection()
    await connection.beginTransaction()

    try {
      // First, delete all related trade-ins (foreign key constraint will handle this automatically due to CASCADE)
      await connection.execute("DELETE FROM trade_ins WHERE userId = ?", [userId])

      // Delete registration logs
      await connection.execute("DELETE FROM registration_logs WHERE userId = ?", [userId])

      // Finally, delete the user
      const [result] = await connection.execute("DELETE FROM users WHERE id = ?", [userId])

      await connection.commit()
      connection.release()

      const affectedRows = (result as any).affectedRows
      console.log(`User deleted: ID ${userId}, affected rows: ${affectedRows}`)

      return affectedRows > 0
    } catch (error) {
      await connection.rollback()
      connection.release()
      throw error
    }
  } catch (error) {
    console.error("Delete user error:", error)
    throw error
  }
}

export async function getUserDeletionInfo(userId: string): Promise<{
  user: DatabaseUser | null
  tradeInsCount: number
  totalCredits: number
} | null> {
  try {
    // Get user info
    const [userRows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId])
    const user = (userRows as DatabaseUser[])[0] || null

    if (!user) {
      return null
    }

    // Get trade-ins count
    const [tradeInsRows] = await pool.execute("SELECT COUNT(*) as count FROM trade_ins WHERE userId = ?", [userId])
    const tradeInsCount = (tradeInsRows as any)[0].count

    return {
      user,
      tradeInsCount,
      totalCredits: user.creditBalance,
    }
  } catch (error) {
    console.error("Get user deletion info error:", error)
    return null
  }
}

export async function getUserById(userId: string): Promise<DatabaseUser | null> {
  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [userId])

    const users = rows as DatabaseUser[]
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Get user by ID error:", error)
    return null
  }
}

// Trade-in functions
export async function createTradeIn(
  userId: string,
  itemType: string,
  quantity: number,
  credits: number,
  description?: string,
) {
  try {
    const [result] = await pool.execute(
      "INSERT INTO trade_ins (userId, itemType, quantity, credits, description) VALUES (?, ?, ?, ?, ?)",
      [userId, itemType, quantity, credits, description || ""],
    )

    return (result as any).insertId
  } catch (error) {
    console.error("Create trade-in error:", error)
    throw error
  }
}

export async function getUserTradeIns(userId: string) {
  try {
    const [rows] = await pool.execute("SELECT * FROM trade_ins WHERE userId = ? ORDER BY createdAt DESC LIMIT 10", [
      userId,
    ])
    return rows
  } catch (error) {
    console.error("Get user trade-ins error:", error)
    return []
  }
}

export async function logUserRegistration(
  userId: string,
  email: string,
  name: string,
  additionalInfo?: {
    ipAddress?: string
    userAgent?: string
    referralSource?: string
    marketingConsent?: boolean
  },
) {
  try {
    await pool.execute(
      `INSERT INTO registration_logs (userId, email, name, registrationSource, ipAddress, userAgent, referralSource, marketingConsent) 
       VALUES (?, ?, ?, 'website', ?, ?, ?, ?)`,
      [
        userId,
        email,
        name,
        additionalInfo?.ipAddress || null,
        additionalInfo?.userAgent || null,
        additionalInfo?.referralSource || "direct",
        additionalInfo?.marketingConsent || false,
      ],
    )

    console.log(`Registration logged for user: ${email} (ID: ${userId})`)
  } catch (error) {
    console.error("Failed to log registration:", error)
    // Don't throw error as this is just logging
  }
}
