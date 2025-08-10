import prisma from "@/lib/prisma";
import { transactionCreateReqSchema, postFilterObjSchema, postTypes, postSortObjSchema, sortTypes } from "@/lib/zod";
import { prismaErrorHandler } from "@/utils/prisma-error-handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
export async function GET() {

}

export async function POST(req: Request) {
  try {
    const reqObj = await req.json();
    const parsedReqObj = transactionCreateReqSchema.parse(reqObj);
    if (parsedReqObj.buyerId === parsedReqObj.sellerId)
      return Response.json(
        { error: "buyerId cannot be equal to sellerId" },
        { status: 400 }
      );
    await prisma.transaction.create({
      data: {
        postId: parsedReqObj.postId,
        buyer: { connect: { id: parsedReqObj.buyerId } },
        seller: { connect: { id: parsedReqObj.sellerId } }
      },
    });
    return Response.json({}, { status: 204 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      const { error: errMsg, status } = prismaErrorHandler(error);
      return Response.json({ error: errMsg }, { status });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
