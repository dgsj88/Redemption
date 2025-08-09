import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/utils/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        twoFactorAuth: true,
        twoFactorSecret: true
      }
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA setup not initiated" },
        { status: 400 }
      );
    }

    if(user.twoFactorAuth){
        return NextResponse.json(
            {error: "2FA is already setup"},
            {status: 400}
        )
    }

    const isValid = verifyToken(token, user.twoFactorSecret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // Enable 2FA for the user
    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            twoFactorAuth: true
        }
    })

    return NextResponse.json({
      success: true,
      message: "2FA enabled",
    });
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}
