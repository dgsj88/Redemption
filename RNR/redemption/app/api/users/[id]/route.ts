import { hashPasswordPBKDF2 } from "@/utils/auth";
import prisma from "@/lib/prisma";
import { userIdSchema, userUpdateReqObjSchema } from "@/lib/zod";
import z from "zod";

// update user func
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const userId = userIdSchema.parse((await params).id);
    const reqObj = await req.json();
    const parsedReqObj = userUpdateReqObjSchema.parse(reqObj);
    // if (parsedReqObj.password) {
    //   const { hash, salt } = await hashPasswordPBKDF2(parsedReqObj.password);
    //   parsedReqObj.password = hash; // update password with hashed value
    //   parsedReqObj.salt = salt; // update salt with generated salt
    // }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: parsedReqObj.name,
        email: parsedReqObj.email,
        role: parsedReqObj.role,
        credits: parsedReqObj.credits,
        isActive: parsedReqObj.isActive,
      },
    });
    return Response.json({}, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const userId = userIdSchema.parse((await params).id);
    const targetUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        role: true,
        credits: true,
        isActive: true,
      },
    });
    return Response.json(targetUser, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const userId = userIdSchema.parse((await params).id);
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return Response.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error }, { status: 500 });
  }
}
