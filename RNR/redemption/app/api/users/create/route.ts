import connection from "../../../../lib/db";
import type { ResultSetHeader } from "mysql2/promise";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password, name, role, credits, isActive, createdDate } =
    await req.json();

  const [result]: [ResultSetHeader, unknown] = await connection.query(
    "INSERT INTO user (email,password,name,role,credits,isActive,createdDate) VALUES (?,?,?,?,?,?,?)",
    [email, password, name, role, credits, isActive, createdDate]
  );
  // Use result.insertId as ResultSetHeader contains the insertId property
  const insertId = result.insertId;
  return NextResponse.json(
    { id: insertId, email, name, role, credits, isActive, createdDate },
    { status: 201 }
  );
}
