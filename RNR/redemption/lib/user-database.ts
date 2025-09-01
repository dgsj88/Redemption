export interface DatabaseUser {
  id: string;
  email: string;
  password: string;
  name: string;
  credits: number;
  isActive: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
  lastLogin?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
}

export interface Post{
  id: string;
  desc: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  isApproved: boolean;
  itemCredits: number;
  isAvailable: boolean;
  quantity: number;
  imagePath: string;
  location: string;
}

export interface Transaction {
  id: string;
  createdAt: string;
  postId: string;
  buyerId: string;
  sellerId: string;
  agreedCredits: number;
  isCompleted: boolean;
  buyerAgreed: boolean;
  sellerAgreed: boolean;
}

export interface Submission {
  id: string;
  type: string;
  author: string;
  createdAt: string;
  isApproved: boolean;
  itemCredits: number;
  quantity: number;
  location: string;
}

export interface RecyclingSubmission {
  id: string
  authorId: string
  type: string
  desc: string
  imageUrl: string
  status: "pending" | "approved" | "rejected"
  creditsAwarded?: number
  reviewNotes?: string
  submissionDate: string
  reviewDate: string
  reviewedBy: string
  quantity: number
  location: string
  actualCredits: number
  estimatedCredits: number
  imagePath: string
  isApproved: boolean
  isAvailable: boolean
}

export interface MarketplaceItem {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category: string
  isAvailable: boolean
  stock: number
  createdAt: string
  addedBy: string
}

export interface CreditTransaction {
  id: string
  userId: string
  type: "earned" | "spent" | "refund"
  amount: number
  description: string
  relatedSubmissionId?: string
  relatedPurchaseId?: string
  date: string
}

export interface Purchase {
  id: string
  userId: string
  itemId: string
  quantity: number
  totalCredits: number
  status: "pending" | "completed" | "cancelled"
  purchaseDate: string
  deliveryAddress?: string
  trackingNumber?: string
}

export interface RecyclingSubmission {
  id: string
  type: string
  quantity: number
  estimatedCredits: number
  actualCredits: number
  submissionDate: string
  location: string
  status: "pending" | "approved" | "rejected"
  reviewNotes?: string
}

// In-memory storage (in real app, this would be a database)

// User storage
const users: DatabaseUser[] = []

const recyclingSubmissions: RecyclingSubmission[] = [
  // {
  //   id: "sub_1",
  //   userId: "user_1",
  //   itemType: "Plastic Bottles",
  //   description: "5 plastic water bottles, clean and labels removed",
  //   imageUrl: "/placeholder.svg?height=200&width=300&text=Plastic+Bottles",
  //   status: "pending",
  //   submissionDate: "2024-01-15",
  // },
  // {
  //   id: "sub_2",
  //   userId: "user_1",
  //   itemType: "Aluminum Cans",
  //   description: "10 aluminum soda cans, crushed for space efficiency",
  //   imageUrl: "/placeholder.svg?height=200&width=300&text=Aluminum+Cans",
  //   status: "approved",
  //   creditsAwarded: 50,
  //   reviewNotes: "Great submission! Items are clean and properly prepared.",
  //   submissionDate: "2024-01-10",
  //   reviewDate: "2024-01-12",
  //   reviewedBy: "approver_1",
  // },
 ]

const marketplaceItems: MarketplaceItem[] = [
  // {
  //   id: "item_1",
  //   name: "Eco-Friendly Water Bottle",
  //   description: "Reusable stainless steel water bottle with insulation",
  //   price: 75,
  //   imageUrl: "/placeholder.svg?height=200&width=300&text=Water+Bottle",
  //   category: "Drinkware",
  //   isAvailable: true,
  //   stock: 25,
  //   createdDate: "2024-01-01",
  //   addedBy: "admin_1",
  // },
  // {
  //   id: "item_2",
  //   name: "Bamboo Utensil Set",
  //   description: "Portable bamboo fork, knife, and spoon with carrying case",
  //   price: 45,
  //   imageUrl: "/placeholder.svg?height=200&width=300&text=Bamboo+Utensils",
  //   category: "Kitchenware",
  //   isAvailable: true,
  //   stock: 50,
  //   createdDate: "2024-01-01",
  //   addedBy: "admin_1",
  // },
  // {
  //   id: "item_3",
  //   name: "Organic Cotton Tote Bag",
  //   description: "Durable organic cotton shopping bag with reinforced handles",
  //   price: 30,
  //   imageUrl: "/placeholder.svg?height=200&width=300&text=Tote+Bag",
  //   category: "Bags",
  //   isAvailable: true,
  //   stock: 100,
  //   createdDate: "2024-01-01",
  //   addedBy: "admin_1",
  // },
]

const creditTransactions: CreditTransaction[] = [
  // {
  //   id: "trans_1",
  //   userId: "user_1",
  //   type: "earned",
  //   amount: 50,
  //   description: "Credits earned from aluminum cans submission",
  //   relatedSubmissionId: "sub_2",
  //   date: "2024-01-12",
  // },
]

const purchases: Purchase[] = []

// User Management Functions
export function createUser(userData: Omit<DatabaseUser, "id" | "createdAt">): DatabaseUser {
  const newUser: DatabaseUser = {
    id: `user_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    ...userData,
  }
  users.push(newUser)
  console.log(`👤 USER CREATED: ${newUser.email} (${newUser.role})`)
  return { ...newUser }
}

export function registerUser(userData: {
  email: string
  password: string
  name: string
}): { success: boolean; user?: DatabaseUser; error?: string } {
  // Check if user already exists
  const existingUser = getUserByEmail(userData.email)
  if (existingUser) {
    console.log(`🚫 REGISTRATION FAILED: Email already exists - ${userData.email}`)
    return { success: false, error: "Email already exists" }
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userData.email)) {
    console.log(`🚫 REGISTRATION FAILED: Invalid email format - ${userData.email}`)
    return { success: false, error: "Invalid email format" }
  }

  // Validate password length
  if (userData.password.length < 6) {
    console.log(`🚫 REGISTRATION FAILED: Password too short - ${userData.email}`)
    return { success: false, error: "Password must be at least 6 characters long" }
  }

  // Validate name
  if (!userData.name.trim()) {
    console.log(`🚫 REGISTRATION FAILED: Name is required - ${userData.email}`)
    return { success: false, error: "Name is required" }
  }

  try {
    // Create new user with default role and credits
    const newUser = createUser({
      email: userData.email.toLowerCase().trim(),
      password: userData.password, // In real app, this would be hashed
      name: userData.name.trim(),
      role: "USER",
      credits: 0, // New users start with 0 credits
      isActive: true,
      // createdAt: new Date().toISOString(),
    })

    console.log(`✅ USER REGISTERED: ${newUser.email}`)
    return { success: true, user: newUser }
  } catch {
    console.log(`🚫 REGISTRATION FAILED: System error - ${userData.email}`)
    return { success: false, error: "Registration failed due to system error" }
  }
}

// Current user session management (in real app, this would use proper session management)
let currentUser: DatabaseUser | null = null

export function setCurrentUser(user: DatabaseUser | null): void {
  currentUser = user
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("currentUserId", user.id)
      console.log(`🔐 CURRENT USER SET: ${user.email}`)
    } else {
      localStorage.removeItem("currentUserId")
      console.log(`🔐 CURRENT USER CLEARED`)
    }
  }
}

export function getCurrentUser(): DatabaseUser | null {
  if (currentUser) {
    return { ...currentUser }
  }

  // Try to restore from localStorage
  if (typeof window !== "undefined") {
    const userId = localStorage.getItem("currentUserId")
    if (userId) {
      const user = getUserById(userId)
      if (user) {
        currentUser = user
        return { ...user }
      }
    }
  }

  return null
}

export function clearCurrentUser(): void {
  setCurrentUser(null)
}

export function getUserByEmail(email: string): DatabaseUser | null {
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  return user ? { ...user } : null
}

export function getUserById(id: string): DatabaseUser | null {
  const user = users.find((u) => u.id === id)
  return user ? { ...user } : null
}

export function getAllUsers(): DatabaseUser[] {
  return users.map((user) => ({ ...user }))
}

export function updateUser(id: string, updates: Partial<DatabaseUser>): DatabaseUser | null {
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return null

  users[userIndex] = { ...users[userIndex], ...updates }
  console.log(`👤 USER UPDATED: ${users[userIndex].email}`)
  return { ...users[userIndex] }
}

export function deleteUser(id: string): boolean {
  const userIndex = users.findIndex((u) => u.id === id)
  if (userIndex === -1) return false

  const deletedUser = users.splice(userIndex, 1)[0]
  console.log(`👤 USER DELETED: ${deletedUser.email}`)
  return true
}

export function validateUserCredentials(email: string, password: string): DatabaseUser | null {
  const user = getUserByEmail(email)
  if (!user || !user.isActive) return null

  // In a real app, you'd hash and compare passwords
  if (user.password === password) {
    // Update last login
    updateUser(user.id, { lastLogin: new Date().toISOString() })
    return user
  }

  return null
}

export function authenticateUser(email: string, password: string): DatabaseUser | null {
  const user = getUserByEmail(email)
  if (!user || !user.isActive) return null

  // In a real app, you'd hash and compare passwords
  if (user.password === password) {
    // Update last login
    updateUser(user.id, { lastLogin: new Date().toISOString() })
    console.log(`🔐 USER AUTHENTICATED: ${user.email}`)
    return user
  }

  console.log(`🔐 AUTHENTICATION FAILED: ${email}`)
  return null
}

export function generatePasswordResetToken(email: string): { success: boolean; token?: string; user?: DatabaseUser } {
  const user = getUserByEmail(email)
  if (!user || !user.isActive) {
    return { success: false }
  }

  const resetToken = `reset_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

  updateUser(user.id, { resetToken, resetTokenExpiry })

  console.log(`🔑 PASSWORD RESET TOKEN GENERATED: ${user.email}`)
  return { success: true, token: resetToken, user }
}

export function validatePasswordResetToken(token: string): DatabaseUser | null {
  const user = users.find((u) => u.resetToken === token)
  if (!user || !user.resetTokenExpiry) return null

  const now = new Date()
  const expiry = new Date(user.resetTokenExpiry)

  if (now > expiry) {
    // Token expired, clear it
    updateUser(user.id, { resetToken: undefined, resetTokenExpiry: undefined })
    return null
  }

  return { ...user }
}

export function resetPassword(token: string, newPassword: string): boolean {
  const user = validatePasswordResetToken(token)
  if (!user) return false

  updateUser(user.id, {
    password: newPassword,
    resetToken: undefined,
    resetTokenExpiry: undefined,
  })

  console.log(`🔑 PASSWORD RESET: ${user.email}`)
  return true
}

// Role-based Access Control
export function isUserAdmin(userId: string): boolean {
  const DatabaseUser = getUserById(userId)
  return DatabaseUser?.role === "ADMIN" || false
}

export function isUserApprover(userId: string): boolean {
  const DatabaseUser = getUserById(userId)
  return DatabaseUser?.role === "ADMIN" || false
}

export function getUsersByRole(role: DatabaseUser["role"]): DatabaseUser[] {
  return users.filter((u) => u.role === role).map((user) => ({ ...user }))
}

export function promoteUser(userId: string, newRole: DatabaseUser["role"]): boolean {
  const user = getUserById(userId)
  if (!user) return false

  updateUser(userId, { role: newRole })
  console.log(`👤 USER PROMOTED: ${user.email} to ${newRole}`)
  return true
}

// Credit Management Functions
export function getUserCredits(userId: string): number {
  const user = getUserById(userId)
  return user?.credits || 0
}

export function addCreditsToUser(
  userId: string,
  amount: number,
  description: string,
  relatedSubmissionId?: string,
): boolean {
  const user = getUserById(userId)
  if (!user) return false

  const newCredits = user.credits + amount
  updateUser(userId, { credits: newCredits })

  // Record transaction
  const transaction: CreditTransaction = {
    id: `trans_${Date.now()}`,
    userId,
    type: "earned",
    amount,
    description,
    relatedSubmissionId,
    date: new Date().toISOString(),
  }
  creditTransactions.push(transaction)

  console.log(`💰 CREDITS ADDED: ${amount} to ${user.email} (Total: ${newCredits})`)
  return true
}

export function deductCreditsFromUser(
  userId: string,
  amount: number,
  description: string,
  relatedPurchaseId?: string,
): boolean {
  const user = getUserById(userId)
  if (!user || user.credits < amount) return false

  const newCredits = user.credits - amount
  updateUser(userId, { credits: newCredits })

  // Record transaction
  const transaction: CreditTransaction = {
    id: `trans_${Date.now()}`,
    userId,
    type: "spent",
    amount,
    description,
    relatedPurchaseId,
    date: new Date().toISOString(),
  }
  creditTransactions.push(transaction)

  console.log(`💰 CREDITS DEDUCTED: ${amount} from ${user.email} (Total: ${newCredits})`)
  return true
}

export function getCreditTransactions(userId: string): CreditTransaction[] {
  return creditTransactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((transaction) => ({ ...transaction }))
}

export function getCreditTransactionsByUser(userId: string): CreditTransaction[] {
  return creditTransactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((transaction) => ({ ...transaction }))
}

export function getAllCreditTransactions(): CreditTransaction[] {
  return creditTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((transaction) => ({ ...transaction }))
}

// Recycling Submission Functions
export function submitRecyclingItem(submissionData: {
  authorId: string
  //userName: string
  //userEmail: string
  type: string
  quantity: number
  desc: string
  itemCredits: number
  location: string
  imagePath: string
  isAvailable: boolean
  isApproved: boolean
}): RecyclingSubmission {
  const newSubmission: RecyclingSubmission = {
    id: `sub_${Date.now()}`,
    authorId: submissionData.authorId,
    type: submissionData.type,
    desc: submissionData.desc,
    imageUrl: `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(submissionData.type)}`,
    imagePath: submissionData.imagePath,
    status: "pending",
    submissionDate: new Date().toISOString().split("T")[0],
    quantity: submissionData.quantity,
    location: submissionData.location,
    actualCredits: 0,
    estimatedCredits: submissionData.itemCredits,
    reviewNotes: "",
    reviewDate: "",
    reviewedBy: "",
    isApproved: false,
    isAvailable: true,
  }
// Declare variables with placeholder values or get them from your form/context
// const authorId = "";
// //const userName = "";
// //const userEmail = "";
// const type = "";
// const quantity = 0;
// const description = "";
// const itemCredits = 0;
// const location = "";
//const imagePath = "";

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   try {
//     const res = await fetch("/api/posts", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         userId,
//         type,
//         quantity,
//         description,
//         itemCredits,
//         location,
//         //imagePath,
//       }),
//     });
//     //if (!res.ok) throw new Error("Failed to submit");
//     // Optionally handle response
//     await res.json();
//     // Reset form or show success message
//   } catch (error) {
//     console.error("Submission error:", error);
//     // Show error message
//   } finally {
//     //setIsSubmitting(false);
//   };

  recyclingSubmissions.push(newSubmission)
  console.log(`♻️ RECYCLING SUBMISSION CREATED: ${newSubmission.type} by ${submissionData.authorId}`)
  return { ...newSubmission }
}

export function getRecyclingSubmissionById(id: string): RecyclingSubmission | null {
  const submission = recyclingSubmissions.find((s) => s.id === id)
  return submission ? { ...submission } : null
}

export function getRecyclingSubmissionsByUser(userId: string): RecyclingSubmission[] {
  return recyclingSubmissions
    .filter((s) => s.authorId === userId)
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .map((submission) => ({ ...submission }))
}

export function getAllRecyclingSubmissions(): RecyclingSubmission[] {
  return recyclingSubmissions
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .map((submission) => ({ ...submission }))
}

export function getPendingRecyclingSubmissions(): RecyclingSubmission[] {
  return recyclingSubmissions
    .filter((s) => s.status === "pending")
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .map((submission) => ({ ...submission }))
}

export function approveRecyclingSubmission(
  submissionId: string,
  creditsAwarded: number,
  reviewNotes: string,
  reviewedBy: string,
): boolean {
  const submissionIndex = recyclingSubmissions.findIndex((s) => s.id === submissionId)
  if (submissionIndex === -1) return false

  const submission = recyclingSubmissions[submissionIndex]

  // Update submission
  recyclingSubmissions[submissionIndex] = {
    ...submission,
    status: "approved",
    creditsAwarded,
    reviewNotes,
    reviewDate: new Date().toISOString().split("T")[0],
    reviewedBy,
  }

  // Add credits to user
  addCreditsToUser(
    submission.authorId,
    creditsAwarded,
    `Credits earned from ${submission.type} submission`,
    submissionId,
  )

  console.log(`✅ SUBMISSION APPROVED: ${submissionId} - ${creditsAwarded} credits awarded`)
  return true
}

export function rejectRecyclingSubmission(submissionId: string, reviewNotes: string, reviewedBy: string): boolean {
  const submissionIndex = recyclingSubmissions.findIndex((s) => s.id === submissionId)
  if (submissionIndex === -1) return false

  const submission = recyclingSubmissions[submissionIndex]

  recyclingSubmissions[submissionIndex] = {
    ...submission,
    status: "rejected",
    reviewNotes,
    reviewDate: new Date().toISOString().split("T")[0],
    reviewedBy,
  }

  console.log(`❌ SUBMISSION REJECTED: ${submissionId}`)
  return true
}

export function updateRecyclingSubmission(
  id: string,
  updates: Partial<RecyclingSubmission>,
): RecyclingSubmission | null {
  const submissionIndex = recyclingSubmissions.findIndex((s) => s.id === id)
  if (submissionIndex === -1) return null

  recyclingSubmissions[submissionIndex] = { ...recyclingSubmissions[submissionIndex], ...updates }
  console.log(`♻️ SUBMISSION UPDATED: ${id}`)
  return { ...recyclingSubmissions[submissionIndex] }
}

export function deleteRecyclingSubmission(id: string): boolean {
  const submissionIndex = recyclingSubmissions.findIndex((s) => s.id === id)
  if (submissionIndex === -1) return false

  const deletedSubmission = recyclingSubmissions.splice(submissionIndex, 1)[0]
  console.log(`♻️ SUBMISSION DELETED: ${deletedSubmission.id}`)
  return true
}

// Marketplace Functions
export function createMarketplaceItem(itemData: Omit<MarketplaceItem, "id" | "createdAt">): MarketplaceItem {
  const newItem: MarketplaceItem = {
    id: `item_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    ...itemData,
  }

  marketplaceItems.push(newItem)
  console.log(`🛍️ MARKETPLACE ITEM CREATED: ${newItem.name}`)
  return { ...newItem }
}

export function getAllMarketplaceItems(): MarketplaceItem[] {
  return marketplaceItems.map((item) => ({ ...item }))
}

export function getAvailableMarketplaceItems(): MarketplaceItem[] {
  return marketplaceItems.filter((item) => item.isAvailable && item.stock > 0).map((item) => ({ ...item }))
}

export function getMarketplaceItemById(id: string): MarketplaceItem | null {
  const item = marketplaceItems.find((i) => i.id === id)
  return item ? { ...item } : null
}

export function getMarketplaceItemsByCategory(category: string): MarketplaceItem[] {
  return marketplaceItems
    .filter((item) => item.category.toLowerCase() === category.toLowerCase() && item.isAvailable)
    .map((item) => ({ ...item }))
}

export function updateMarketplaceItem(id: string, updates: Partial<MarketplaceItem>): MarketplaceItem | null {
  const itemIndex = marketplaceItems.findIndex((i) => i.id === id)
  if (itemIndex === -1) return null

  marketplaceItems[itemIndex] = { ...marketplaceItems[itemIndex], ...updates }
  console.log(`🛍️ MARKETPLACE ITEM UPDATED: ${marketplaceItems[itemIndex].name}`)
  return { ...marketplaceItems[itemIndex] }
}

export function deleteMarketplaceItem(id: string): boolean {
  const itemIndex = marketplaceItems.findIndex((i) => i.id === id)
  if (itemIndex === -1) return false

  const deletedItem = marketplaceItems.splice(itemIndex, 1)[0]
  console.log(`🛍️ MARKETPLACE ITEM DELETED: ${deletedItem.name}`)
  return true
}

export function purchaseMarketplaceItem(itemId: string, userId: string): boolean {
  const item = getMarketplaceItemById(itemId)
  const user = getUserById(userId)

  if (!item || !user || !item.isAvailable || item.stock < 1) {
    return false
  }

  if (user.credits < item.price) {
    return false
  }

  // Create purchase
  const selectedItem = getMarketplaceItemById(itemId)
  const totalCredits = selectedItem ? selectedItem.price * 1 : 0
  const purchase = createPurchase({
    userId: userId,
    itemId: itemId,
    quantity: 1,
    totalCredits: totalCredits,
    deliveryAddress: "Pickup at collection center",
  })

  return purchase !== null
}

// Purchase Functions
export function createPurchase(purchaseData: Omit<Purchase, "id" | "purchaseDate" | "status">): Purchase | null {
  const user = getUserById(purchaseData.userId)
  const item = getMarketplaceItemById(purchaseData.itemId)

  if (!user || !item) return null
  if (!item.isAvailable || item.stock < purchaseData.quantity) return null

  const calculatedTotalCredits = item.price * purchaseData.quantity
  if (user.credits < calculatedTotalCredits) return null

  const { totalCredits, ...purchaseDataWithoutTotalCredits } = purchaseData
  const newPurchase: Purchase = {
    id: `purchase_${Date.now()}`,
    status: "pending",
    purchaseDate: new Date().toISOString(),
    totalCredits: calculatedTotalCredits,
    ...purchaseDataWithoutTotalCredits,
  }

  purchases.push(newPurchase)

  // Deduct credits from user
  deductCreditsFromUser(
    purchaseData.userId,
    totalCredits,
    `Purchase: ${item.name} (x${purchaseData.quantity})`,
    newPurchase.id,
  )

  // Update item stock
  updateMarketplaceItem(purchaseData.itemId, { stock: item.stock - purchaseData.quantity })

  console.log(`🛒 PURCHASE CREATED: ${newPurchase.id} - ${totalCredits} credits`)
  return { ...newPurchase }
}

export function getPurchasesByUser(userId: string): Purchase[] {
  return purchases
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .map((purchase) => ({ ...purchase }))
}

export function getAllPurchases(): Purchase[] {
  return purchases
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .map((purchase) => ({ ...purchase }))
}

export function getPurchaseById(id: string): Purchase | null {
  const purchase = purchases.find((p) => p.id === id)
  return purchase ? { ...purchase } : null
}

export function updatePurchaseStatus(id: string, status: Purchase["status"], trackingNumber?: string): boolean {
  const purchaseIndex = purchases.findIndex((p) => p.id === id)
  if (purchaseIndex === -1) return false

  const updates: Partial<Purchase> = { status }
  if (trackingNumber) updates.trackingNumber = trackingNumber

  purchases[purchaseIndex] = { ...purchases[purchaseIndex], ...updates }
  console.log(`🛒 PURCHASE STATUS UPDATED: ${id} - ${status}`)
  return true
}

// Statistics Functions
export function getUserCount(): number {
  return users.length
}

export function getActiveUserCount(): number {
  return users.filter((u) => u.isActive).length
}

export function getTotalSubmissions(): number {
  return recyclingSubmissions.length
}

export function getPendingSubmissionsCount(): number {
  return recyclingSubmissions.filter((s) => s.status === "pending").length
}

export function getApprovedSubmissionsCount(): number {
  return recyclingSubmissions.filter((s) => s.status === "approved").length
}

export function getTotalCreditsInCirculation(): number {
  return users.reduce((total, user) => total + user.credits, 0)
}

export function getTotalCreditsEarned(): number {
  return creditTransactions
    .filter((t) => t.type === "earned")
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export function getTotalCreditsSpent(): number {
  return creditTransactions
    .filter((t) => t.type === "spent")
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export function getMarketplaceItemCount(): number {
  return marketplaceItems.length
}

export function getAvailableMarketplaceItemCount(): number {
  return marketplaceItems.filter((item) => item.isAvailable && item.stock > 0).length
}

export function getTotalPurchases(): number {
  return purchases.length
}

export function getCompletedPurchasesCount(): number {
  return purchases.filter((p) => p.status === "completed").length
}

export function getUserStats(userId: string) {
  const user = getUserById(userId)
  if (!user) return null

  const userSubmissions = getRecyclingSubmissionsByUser(userId)
  const userTransactions = getCreditTransactions(userId)
  const userPurchases = getPurchasesByUser(userId)

  return {
    user: { ...user },
    totalSubmissions: userSubmissions.length,
    approvedSubmissions: userSubmissions.filter((s) => s.status === "approved").length,
    pendingSubmissions: userSubmissions.filter((s) => s.status === "pending").length,
    rejectedSubmissions: userSubmissions.filter((s) => s.status === "rejected").length,
    totalCreditsEarned: userTransactions.filter((t) => t.type === "earned").reduce((sum, t) => sum + t.amount, 0),
    totalCreditsSpent: userTransactions.filter((t) => t.type === "spent").reduce((sum, t) => sum + t.amount, 0),
    currentCredits: user.credits,
    totalPurchases: userPurchases.length,
    completedPurchases: userPurchases.filter((p) => p.status === "completed").length,
  }
}

export function getSystemStats() {
  return {
    users: {
      total: getUserCount(),
      active: getActiveUserCount(),
      admins: getUsersByRole("ADMIN").length,
      // approvers: getUsersByRole("approver").length,
      regularUsers: getUsersByRole("USER").length,
    },
    submissions: {
      total: getTotalSubmissions(),
      pending: getPendingSubmissionsCount(),
      approved: getApprovedSubmissionsCount(),
      rejected: recyclingSubmissions.filter((s) => s.status === "rejected").length,
    },
    credits: {
      totalInCirculation: getTotalCreditsInCirculation(),
      totalEarned: getTotalCreditsEarned(),
      totalSpent: getTotalCreditsSpent(),
      averagePerUser: Math.round(getTotalCreditsInCirculation() / getUserCount()),
    },
    marketplace: {
      totalItems: getMarketplaceItemCount(),
      availableItems: getAvailableMarketplaceItemCount(),
      totalStock: marketplaceItems.reduce((sum, item) => sum + item.stock, 0),
    },
    purchases: {
      total: getTotalPurchases(),
      completed: getCompletedPurchasesCount(),
      pending: purchases.filter((p) => p.status === "pending").length,
      cancelled: purchases.filter((p) => p.status === "cancelled").length,
    },
  }
}

// Utility Functions
export function searchUsers(query: string): DatabaseUser[] {
  const lowercaseQuery = query.toLowerCase()
  return users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.role.toLowerCase().includes(lowercaseQuery),
    )
    .map((user) => ({ ...user }))
}

export function searchSubmissions(query: string): RecyclingSubmission[] {
  const lowercaseQuery = query.toLowerCase()
  return recyclingSubmissions
    .filter(
      (submission) =>
        submission.type.toLowerCase().includes(lowercaseQuery) ||
        submission.desc.toLowerCase().includes(lowercaseQuery) ||
        submission.status.toLowerCase().includes(lowercaseQuery),
    )
    .map((submission) => ({ ...submission }))
}

export function searchMarketplaceItems(query: string): MarketplaceItem[] {
  const lowercaseQuery = query.toLowerCase()
  return marketplaceItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.description.toLowerCase().includes(lowercaseQuery) ||
        item.category.toLowerCase().includes(lowercaseQuery),
    )
    .map((item) => ({ ...item }))
}

export function getRecentActivity(limit = 10) {
  const activities: Array<{
    id: string
    type: "submission" | "purchase" | "user_registration" | "approval"
    description: string
    date: string
    userId?: string
    userName?: string
  }> = []

  // Add recent submissions
  recyclingSubmissions
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 5)
    .forEach((submission) => {
      const user = getUserById(submission.authorId)
      activities.push({
        id: submission.id,
        type: "submission",
        description: `${user?.name || "Unknown User"} submitted ${submission.type}`,
        date: submission.submissionDate,
        userId: submission.authorId,
        userName: user?.name,
      })
    })

  // Add recent purchases
  purchases
    .sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
    .slice(0, 5)
    .forEach((purchase) => {
      const user = getUserById(purchase.userId)
      const item = getMarketplaceItemById(purchase.itemId)
      activities.push({
        id: purchase.id,
        type: "purchase",
        description: `${user?.name || "Unknown User"} purchased ${item?.name || "Unknown Item"}`,
        date: purchase.purchaseDate,
        userId: purchase.userId,
        userName: user?.name,
      })
    })

  // Add recent user registrations
  users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .forEach((user) => {
      activities.push({
        id: user.id,
        type: "user_registration",
        description: `${user.name} joined the platform`,
        date: user.createdAt,
        userId: user.id,
        userName: user.name,
      })
    })

  return activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit)
}

// Export aliases for backward compatibility
export const approveSubmission = approveRecyclingSubmission
export const rejectSubmission = rejectRecyclingSubmission
export const getSubmissions = getAllRecyclingSubmissions
export const getAllSubmissions = getAllRecyclingSubmissions
export const getSubmissionsByUser = getRecyclingSubmissionsByUser
export const getSubmissionById = getRecyclingSubmissionById


// function setIsSubmitting(arg0: boolean) {
//   throw new Error("Function not implemented.");
// }

// Simple state setter for submission status (for use in React or similar UI context)
// let isSubmitting = false;

// function setIsSubmitting(value: boolean) {
//   isSubmitting = value;
// }