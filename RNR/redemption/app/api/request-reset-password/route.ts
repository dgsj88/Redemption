import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendMail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  // Find user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Generate token
  const token = Math.random().toString(36).substring(2) + Date.now();
  await prisma.user.update({
    where: { email },
    data: { resetToken: token },
  });

  // Send email with reset link
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  await sendMail({
    to: email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetLink}`,
  });

  return NextResponse.json({ success: true });
}
