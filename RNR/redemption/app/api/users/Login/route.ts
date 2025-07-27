import connection from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// This route handles user login by checking the email and password
export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const db = connection;
  const [rows] = await db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [email, password]
  );
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }
  return NextResponse.json(rows[0], { status: 200 });
}
