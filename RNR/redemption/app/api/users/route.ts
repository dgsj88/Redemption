import { hashPasswordPBKDF2 } from "@/utils/auth";
import prisma from "@/lib/prisma";
import { userCreateReqObjSchema } from "@/lib/zod";
import z from "zod";

//create user
export async function POST(req: Request) {
  try {
    const reqObj = await req.json();
    const parsedReqObj = userCreateReqObjSchema.parse(reqObj);
    const { hash, salt } = await hashPasswordPBKDF2(parsedReqObj.password);

    const createdUser = await prisma.user.create({
      data: { ...parsedReqObj, password: hash, salt },
    });
    return Response.json({ id: createdUser.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error }, { status: 500 });
  }
}
