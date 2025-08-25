import prisma from "@/lib/prisma";
import { userIdSchema, userUpdateReqObjSchema } from "@/lib/zod";
import z from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prismaErrorHandler } from "@/utils/prisma-error-handler";

// update user func
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const userId = userIdSchema.parse((await params).id);
    const reqObj = await req.json();
    const parsedReqObj = userUpdateReqObjSchema.parse(reqObj);
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
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
    }
    return Response.json({ error }, { status: 500 });
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
        createdAt: true,
      },
    });
    return Response.json(targetUser, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
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
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
    }
    return Response.json({ error }, { status: 500 });
  }
}
