import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    // Get session for authentication
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password, id } = await req.json();
    const email = session.user.email;

    // Validate input
    if (!email || !password || !id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check id and email match
    const user = await prisma.user.findFirst({
      where: {
        email,
        id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid referral code or email" },
        { status: 404 }
      );
    }

    // Update password (consider hashing in production)
    await prisma.user.update({
      where: { id: user.id },
      data: { password },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
