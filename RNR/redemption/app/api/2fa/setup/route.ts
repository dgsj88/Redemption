import { auth } from "@/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateTwoFactorSecret, generateQRCode } from "@/utils/auth";

export async function POST() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { secret, otpAuthUrl } = generateTwoFactorSecret(user.email);
    const qrCodeDataUrl = await generateQRCode(otpAuthUrl);

    await prisma.user.update({
        where: {
            id: session.user.id,
        },
        data: {
            twoFactorSecret: secret,
            twoFactorAuth: true,
        }
    });

    return NextResponse.json({
      success: true,
      qrCodeDataUrl,
    });
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    return NextResponse.json(
      { error: "Failed to set up 2FA" },
      { status: 500 }
    );
  }
}