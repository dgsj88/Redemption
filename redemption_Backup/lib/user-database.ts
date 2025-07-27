// Simulated user database - in real app, this would be a proper database
export interface DatabaseUser {
  id: string
  name: string
  email: string
  password: string // In real app, this would be hashed
  contactNumber: string
  creditBalance: number
  totalItemsTraded: number
  memberSince: string
  accountStatus: "active" | "pending" | "suspended"
  lastLogin: string
  totalCreditsEarned: number
}

// Simulated user database
export const userDatabase: DatabaseUser[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    password: "password123", // In real app, this would be hashed
    contactNumber: "+1-555-0123",
    creditBalance: 45.75,
    totalItemsTraded: 127,
    memberSince: "January 2024",
    accountStatus: "active",
    lastLogin: "2024-01-25",
    totalCreditsEarned: 234.5,
  },
  {
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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

// Authentication functions
export function authenticateUser(email: string, password: string): DatabaseUser | null {
  const user = userDatabase.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return null // User not found
  }

  // In real app, you would compare hashed passwords
  if (user.password !== password) {
    return null // Invalid password
  }

  if (user.accountStatus === "suspended") {
    throw new Error("Account suspended. Please contact support.")
  }

  // Update last login
  user.lastLogin = new Date().toISOString().split("T")[0]

  return user
}

export function registerUser(name: string, email: string, password: string): DatabaseUser {
  // Check if user already exists
  const existingUser = userDatabase.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    throw new Error("An account with this email already exists")
  }

  // Create new user
  const newUser: DatabaseUser = {
    id: (userDatabase.length + 1).toString(),
    name,
    email,
    password, // In real app, this would be hashed
    contactNumber: "",
    creditBalance: 0,
    totalItemsTraded: 0,
    memberSince: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    accountStatus: "active",
    lastLogin: new Date().toISOString().split("T")[0],
    totalCreditsEarned: 0,
  }

  userDatabase.push(newUser)
  return newUser
}

export function updateUser(userId: string, updates: Partial<DatabaseUser>): DatabaseUser | null {
  const userIndex = userDatabase.findIndex((u) => u.id === userId)
  if (userIndex === -1) {
    return null
  }

  userDatabase[userIndex] = { ...userDatabase[userIndex], ...updates }
  return userDatabase[userIndex]
}

export function getAllUsers(): DatabaseUser[] {
  return userDatabase
}

export function updateUserStatus(userId: string, status: "active" | "pending" | "suspended"): boolean {
  const user = userDatabase.find((u) => u.id === userId)
  if (user) {
    user.accountStatus = status
    return true
  }
  return false
}
