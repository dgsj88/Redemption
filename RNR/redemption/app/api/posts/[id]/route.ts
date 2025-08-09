import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { postIdSchema, postUpdateObjSchema } from "@/lib/zod";
import { prismaErrorHandler } from "@/utils/prisma-error-handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";

export async function GET({ params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const parsedId = postIdSchema.parse(id);
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const target = await prisma.post.findUnique({
      where: {
        id: parsedId,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
    if (!target)
      return Response.json({ error: "Post not found" }, { status: 404 });
    return Response.json(target, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
    }
    return Response.json({ error }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const parsedId = postIdSchema.parse(id);
    const parsedReq = postUpdateObjSchema.parse(await req.json());
    if (Object.keys(parsedReq).length === 0)
      return Response.json({ error: "No fields to update" }, { status: 400 });
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const target = await prisma.post.findUnique({
      where: {
        id: parsedId,
      },
      select: {
        authorId: true,
      },
    });
    if (!target)
      return Response.json({ error: "Post not found" }, { status: 404 });
    if (session.user.role !== "ADMIN" || session.user.id !== target?.authorId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    await prisma.post.update({
      where: {
        id: parsedId,
      },
      data: parsedReq,
    });
    return Response.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
    }
    return Response.json({ error }, { status: 500 });
  }
}

export async function DELETE({ params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const parsedId = postIdSchema.parse(id);
    const session = await auth();
    if (!session || !session.user) {
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    }
    const target = await prisma.post.findUnique({
      where: {
        id: parsedId,
      },
      select: {
        authorId: true,
      },
    });
    if (!target)
      return Response.json({ error: "Post not found" }, { status: 404 });
    if (session.user.role !== "ADMIN" || session.user.id !== target?.authorId) {
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    }
    await prisma.post.delete({
      where: {
        id: parsedId,
      },
    });
    return Response.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
    }
    return Response.json({ error }, { status: 500 });
  }
}
