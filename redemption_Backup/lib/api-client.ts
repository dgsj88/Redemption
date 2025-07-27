// Client-side API functions
export interface User {
  id: string
  name: string
  email: string
  contactNumber: string
  creditBalance: number
  totalItemsTraded: number
  memberSince: string
  accountStatus: "active" | "pending" | "suspended"
  lastLogin: string
  totalCreditsEarned: number
}

export async function loginUser(email: string, password: string): Promise<User> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "login",
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Login failed")
  }

  return data.user
}

export async function registerUser(name: string, email: string, password: string): Promise<User> {
  const response = await fetch("/api/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "register",
      name,
      email,
      password,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Registration failed")
  }

  return data.user
}

export async function getAllUsers(): Promise<User[]> {
  const response = await fetch("/api/users")
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch users")
  }

  return data.users
}

export async function updateUserStatus(userId: string, accountStatus: string): Promise<boolean> {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "updateStatus",
      userId,
      updates: { accountStatus },
    }),
  })

  const data = await response.json()
  return data.success
}

export async function updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
  const response = await fetch("/api/users", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "updateProfile",
      userId,
      updates,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to update profile")
  }

  return data.user
}

export async function submitTradeIn(
  userId: string,
  itemType: string,
  quantity: number,
  credits: number,
  description?: string,
): Promise<User> {
  const response = await fetch("/api/trade-ins", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      itemType,
      quantity,
      credits,
      description,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to submit trade-in")
  }

  return data.user
}

export async function deleteUserAccount(userId: string): Promise<boolean> {
  const response = await fetch("/api/users", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to delete user")
  }

  return data.success
}

export async function getUserDeletionInfo(userId: string): Promise<{
  user: User
  tradeInsCount: number
  totalCredits: number
} | null> {
  const response = await fetch(`/api/users/deletion-info?userId=${userId}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to get user deletion info")
  }

  return data.deletionInfo
}
