import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  postCreateSchema,
  postFilterObjSchema,
  postSortObjSchema,
  postTypes,
  sortTypes,
} from "@/lib/zod";
import z from "zod";

//some helpers
function buildFilterObject(searchParams: URLSearchParams) {
  const filterObj: z.infer<typeof postFilterObjSchema> = {};
  //id filter
  const idFilter = searchParams.get("id");

  //authorId filter
  const authorIdFilter = searchParams.get("authorId");

  //type filter
  const typeFilter = searchParams.get("type");

  //isApproved filter
  const isApprovedFilter = searchParams.get("isApproved");

  //createdAt filters
  const createdAtGteFilter = searchParams.get("createdAtGte");
  const createdAtLteFilter = searchParams.get("createdAtLte");
  const createdAtGtFilter = searchParams.get("createdAtGt");
  const createdAtLtFilter = searchParams.get("createdAtLt");
  const createdAtEqFilter = searchParams.get("createdAt");

  //updatedAt filters
  const updatedAtGteFilter = searchParams.get("updatedAtGte");
  const updatedAtLteFilter = searchParams.get("updatedAtLte");
  const updatedAtGtFilter = searchParams.get("updatedAtGt");
  const updatedAtLtFilter = searchParams.get("updatedAtLt");
  const updatedAtEqFilter = searchParams.get("updatedAt");

  //credits filters
  const creditsGteFilter = searchParams.get("creditsGte");
  const creditsLteFilter = searchParams.get("creditsLte");
  const creditsGtFilter = searchParams.get("creditsGt");
  const creditsLtFilter = searchParams.get("creditsLt");
  const creditsEqFilter = searchParams.get("credits");

  const hasIdFilter = idFilter !== null;
  const hasAuthorIdFilter = authorIdFilter !== null;
  const hasTypeFilter = typeFilter !== null;
  const hasIsApprovedFilter = isApprovedFilter !== null;
  const hasCreatedAtFilter =
    createdAtEqFilter ||
    createdAtGteFilter ||
    createdAtLteFilter ||
    createdAtGtFilter ||
    createdAtLtFilter;
  const hasUpdatedAtFilter =
    updatedAtEqFilter ||
    updatedAtGteFilter ||
    updatedAtLteFilter ||
    updatedAtGtFilter ||
    updatedAtLtFilter;
  const hasCreditsFilter =
    creditsEqFilter ||
    creditsGteFilter ||
    creditsLteFilter ||
    creditsGtFilter ||
    creditsLtFilter;

  if (hasIdFilter) filterObj.id = idFilter;
  if (hasAuthorIdFilter) filterObj.authorId = authorIdFilter;
  if (hasTypeFilter) filterObj.type = typeFilter as z.infer<typeof postTypes>;
  if (hasIsApprovedFilter) filterObj.isApproved = isApprovedFilter.toLowerCase() === "true";
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
  if (hasUpdatedAtFilter) {
    filterObj.updatedAt = {};
    if (updatedAtGteFilter)
      filterObj.updatedAt.gte = new Date(updatedAtGteFilter);
    if (updatedAtLteFilter)
      filterObj.updatedAt.lte = new Date(updatedAtLteFilter);
    if (updatedAtGtFilter) filterObj.updatedAt.gt = new Date(updatedAtGtFilter);
    if (updatedAtLtFilter) filterObj.updatedAt.lt = new Date(updatedAtLtFilter);
    if (updatedAtEqFilter)
      filterObj.updatedAt.equals = new Date(updatedAtEqFilter);
  }
  if (hasCreditsFilter) {
    filterObj.credits = {};
    if (creditsGteFilter) filterObj.credits.gte = parseInt(creditsGteFilter);
    if (creditsLteFilter) filterObj.credits.lte = parseInt(creditsLteFilter);
    if (creditsGtFilter) filterObj.credits.gt = parseInt(creditsGtFilter);
    if (creditsLtFilter) filterObj.credits.lt = parseInt(creditsLtFilter);
    if (creditsEqFilter) filterObj.credits.equals = parseInt(creditsEqFilter);
  }

  return filterObj;
}

function buildSortObject(searchParams: URLSearchParams) {
  const sortObj: z.infer<typeof postSortObjSchema> = {};
  if (searchParams.get("sortById")) sortObj.id = searchParams.get("sortById") as z.infer<typeof sortTypes>;
  if (searchParams.get("sortByCreatedAt"))
    sortObj.createdAt = searchParams.get("sortByCreatedAt") as z.infer<typeof sortTypes>;
  if (searchParams.get("sortByUpdatedAt"))
    sortObj.updatedAt = searchParams.get("sortByUpdatedAt") as z.infer<typeof sortTypes>;
  if (searchParams.get("sortBytype"))
    sortObj.type = searchParams.get("sortBytype") as z.infer<typeof sortTypes>;
  if (searchParams.get("sortByCredits"))
    sortObj.credits = searchParams.get("sortByCredits") as z.infer<typeof sortTypes>;
  if (searchParams.get("sortByIsApproved"))
    sortObj.isApproved = searchParams.get("sortByIsApproved") as z.infer<typeof sortTypes>;
  if (searchParams.get("sortByAuthorId"))
    sortObj.authorId = searchParams.get("sortByAuthorId") as z.infer<typeof sortTypes>;

  return sortObj;
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return Response.json({ error: "Unauthenticated" }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";
    const size = searchParams.get("size") || "10";
    const filterObj = buildFilterObject(searchParams);
    const sortObj = buildSortObject(searchParams);

    const parsedFilterObj = postFilterObjSchema.parse(filterObj);
    const parsedSortObj = postSortObjSchema.parse(sortObj);

    const posts = await prisma.post.findMany({
      skip: (parseInt(page) - 1) * parseInt(size),
      take: parseInt(size),
      where: parsedFilterObj,
      orderBy: parsedSortObj,
    });
    return Response.json({ posts }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user)
      return Response.json({ error: "Unauthenticated" }, { status: 401 });

    const reqObj = await req.json();
    const parsedReqObj = postCreateSchema.parse(reqObj);
    await prisma.post.create({
      data: parsedReqObj,
    });
    return Response.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
