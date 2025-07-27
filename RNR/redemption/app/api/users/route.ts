import connection from "../../../lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const db = connection;
  const [rows] = await db.query("SELECT * FROM user");
  return NextResponse.json(rows, { status: 200 });
}
