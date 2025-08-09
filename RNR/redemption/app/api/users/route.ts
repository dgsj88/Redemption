import { hashPasswordPBKDF2 } from "@/utils/auth";
import prisma from "@/lib/prisma";
import {
  sortTypes,
  userCreateReqObjSchema,
  userFilterObjSchema,
  userRoles,
  userSortObjSchema,
} from "@/lib/zod";
import z from "zod";
import { auth } from "@/auth";


//get user

//helpers
function buildFilterObject(searchParams: URLSearchParams) {
  const filterObj: z.infer<typeof userFilterObjSchema> = {};
  //id filter
  const idFilter = searchParams.get("id");

  //role filter
  const roleFilter = searchParams.get("role");

  //name filter
  const nameFilter = searchParams.get("name");

  //email filter
  const emailFilter = searchParams.get("email");

  //2FA filter
  const twoFactorAuthFilter = searchParams.get("twoFactorAuth");

  //isActiveFilter
  const isActiveFilter = searchParams.get("isActive");

  //createdAt filters
  const createdAtGteFilter = searchParams.get("createdAtGte");
  const createdAtLteFilter = searchParams.get("createdAtLte");
  const createdAtGtFilter = searchParams.get("createdAtGt");
  const createdAtLtFilter = searchParams.get("createdAtLt");
  const createdAtEqFilter = searchParams.get("createdAt");

  //credits filters
  const creditsGteFilter = searchParams.get("creditsGte");
  const creditsLteFilter = searchParams.get("creditsLte");
  const creditsGtFilter = searchParams.get("creditsGt");
  const creditsLtFilter = searchParams.get("creditsLt");
  const creditsEqFilter = searchParams.get("credits");

  const hasIdFilter = idFilter !== null;
  const hasNameFilter = nameFilter !== null;
  const hasEmailFilter = emailFilter !== null;
  const hasRoleFilter = roleFilter !== null;
  const hasTwoFactorAuthFilter = twoFactorAuthFilter !== null;
  const hasCreatedAtFilter =
    createdAtEqFilter ||
    createdAtGteFilter ||
    createdAtLteFilter ||
    createdAtGtFilter ||
    createdAtLtFilter;
  const hasCreditsFilter =
    creditsEqFilter ||
    creditsGteFilter ||
    creditsLteFilter ||
    creditsGtFilter ||
    creditsLtFilter;
  const hasIsActiveFilter = isActiveFilter !== null;

  if (hasIdFilter) filterObj.id = idFilter;
  if (hasNameFilter) filterObj.name = nameFilter;
  if (hasRoleFilter) filterObj.role = roleFilter as z.infer<typeof userRoles>;
  if (hasEmailFilter) filterObj.email = emailFilter;
  if (hasTwoFactorAuthFilter)
    filterObj.twoFactorAuth = twoFactorAuthFilter.toLowerCase() === "true";
  if (hasCreatedAtFilter) {
    filterObj.createdAt = {};
    if (createdAtGteFilter)
      filterObj.createdAt.gte = new Date(createdAtGteFilter);
    if (createdAtLteFilter)
      filterObj.createdAt.lte = new Date(createdAtLteFilter);
    if (createdAtGtFilter) filterObj.createdAt.gt = new Date(createdAtGtFilter);
    if (createdAtLtFilter) filterObj.createdAt.lt = new Date(createdAtLtFilter);
    if (createdAtEqFilter)
      filterObj.createdAt.equals = new Date(createdAtEqFilter);
  }

  if (hasCreditsFilter) {
    filterObj.credits = {};
    if (creditsGteFilter) filterObj.credits.gte = parseInt(creditsGteFilter);
    if (creditsLteFilter) filterObj.credits.lte = parseInt(creditsLteFilter);
    if (creditsGtFilter) filterObj.credits.gt = parseInt(creditsGtFilter);
    if (creditsLtFilter) filterObj.credits.lt = parseInt(creditsLtFilter);
    if (creditsEqFilter) filterObj.credits.equals = parseInt(creditsEqFilter);
  }

  if (hasIsActiveFilter)
    filterObj.isActive = isActiveFilter.toLowerCase() === "true";

  return filterObj;
}

function buildSortObject(searchParams: URLSearchParams) {
  const sortObj: z.infer<typeof userSortObjSchema> = {};
  if (searchParams.get("sortById"))
    sortObj.id = searchParams.get("sortById") as z.infer<typeof sortTypes>;

  if (searchParams.get("sortByCreatedAt"))
    sortObj.createdAt = searchParams.get("sortByCreatedAt") as z.infer<
      typeof sortTypes
    >;

  if (searchParams.get("sortByName"))
    sortObj.name = searchParams.get("sortByName") as z.infer<typeof sortTypes>;

  if (searchParams.get("sortByEmail"))
    sortObj.email = searchParams.get("sortByEmail") as z.infer<
      typeof sortTypes
    >;

  if (searchParams.get("sortByCredits"))
    sortObj.credits = searchParams.get("sortByCredits") as z.infer<
      typeof sortTypes
    >;

  if (searchParams.get("sortByRole"))
    sortObj.role = searchParams.get("sortByRole") as z.infer<typeof sortTypes>;

  if (searchParams.get("sortByTwoFactorAuth"))
    sortObj.twoFactorAuth = searchParams.get("sortByTwoFactorAuth") as z.infer<
      typeof sortTypes
    >;

  if (searchParams.get("sortByIsActive"))
    sortObj.isActive = searchParams.get("sortByIsActive") as z.infer<
      typeof sortTypes
    >;

  return sortObj;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    if (session.user.role !== "ADMIN")
      return Response.json({ error: "Unauthorized" }, { status: 403 });
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    const filterObj = buildFilterObject(searchParams);
    const sortObj = buildSortObject(searchParams);

    const parsedFilterObj = userFilterObjSchema.parse(filterObj);
    const parsedSortObj = userSortObjSchema.parse(sortObj);

    const users = await prisma.user.findMany({
      skip: (parseInt(page) - 1) * parseInt(size),
      take: parseInt(size),
      where: parsedFilterObj,
      orderBy: parsedSortObj,
      select: {
        id: true,
        createdAt: true,
        email: true,
        name: true,
        twoFactorAuth: true,
        credits: true,
        isActive: true,
        role: true,
      },
    });
    return Response.json({ users }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
