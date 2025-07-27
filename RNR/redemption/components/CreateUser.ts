import connection from "@/lib/db";

// Register a single user
export async function registerUser(user: {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  credits: number;
  isActive: boolean;
  createdDate: string;
}) {
  try {
    const [result] = await connection.execute(
      `INSERT INTO users (id, email, password, name, role, credits, isActive, createdDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email,
        user.password,
        user.name,
        user.role,
        user.credits,
        user.isActive,
        user.createdDate,
      ]
    );
    console.log("User registered successfully!");
    return result;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}
