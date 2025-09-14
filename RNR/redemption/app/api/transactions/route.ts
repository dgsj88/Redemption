import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  postFilterObjSchema,
  postSortObjSchema,
  postTypes,
  sortTypes,
  transactionCreateReqSchema,
  transactionFilterObjSchema,
  transactionSortObjectSchema,
} from "@/lib/zod";
import { prismaErrorHandler } from "@/utils/prisma-error-handler";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import z from "zod";

//some helpers
function buildFilterObject(searchParams: URLSearchParams) {
  const filterObj: z.infer<typeof transactionFilterObjSchema> = {};
  //id filter
  const idFilter = searchParams.get("id");

  //buyerId filter
  const buyerIdFilter = searchParams.get("buyerId");

  //sellerId filter
  const sellerIdFilter = searchParams.get("sellerId");

  //createdAt filters
  const createdAtGteFilter = searchParams.get("createdAtGte");
  const createdAtLteFilter = searchParams.get("createdAtLte");
  const createdAtGtFilter = searchParams.get("createdAtGt");
  const createdAtLtFilter = searchParams.get("createdAtLt");
  const createdAtEqFilter = searchParams.get("createdAt");

  //post filters
  //postId filter
  const postIdFilter = searchParams.get("postId");

  //authorId filter
  const postAuthorIdFilter = searchParams.get("postAuthorId");

  //type filter
  const postTypeFilter = searchParams.get("postType");

  //isApproved filter
  const postIsApprovedFilter = searchParams.get("postIsApproved");

  //createdAt filters
  const postCreatedAtGteFilter = searchParams.get("postCreatedAtGte");
  const postCreatedAtLteFilter = searchParams.get("postCreatedAtLte");
  const postCreatedAtGtFilter = searchParams.get("postCreatedAtGt");
  const postCreatedAtLtFilter = searchParams.get("postCreatedAtLt");
  const postCreatedAtEqFilter = searchParams.get("postCreatedAt");

  //updatedAt filters
  const postUpdatedAtGteFilter = searchParams.get("postUpdatedAtGte");
  const postUpdatedAtLteFilter = searchParams.get("postUpdatedAtLte");
  const postUpdatedAtGtFilter = searchParams.get("postUpdatedAtGt");
  const postUpdatedAtLtFilter = searchParams.get("postUpdatedAtLt");
  const postUpdatedAtEqFilter = searchParams.get("postUpdatedAt");

  //credits filters
  const postCreditsGteFilter = searchParams.get("postCreditsGte");
  const postCreditsLteFilter = searchParams.get("postCreditsLte");
  const postCreditsGtFilter = searchParams.get("postCreditsGt");
  const postCreditsLtFilter = searchParams.get("postCreditsLt");
  const postCreditsEqFilter = searchParams.get("postCredits");

  const hasIdFilter = idFilter !== null;
  const hasBuyerIdFilter = buyerIdFilter !== null;
  const hasSellerIdFilter = sellerIdFilter !== null;
  const hasCreatedAtFilter =
    createdAtEqFilter ||
    createdAtGteFilter ||
    createdAtLteFilter ||
    createdAtGtFilter ||
    createdAtLtFilter;

  //post filter predicates
  const hasPostIdFilter = postIdFilter !== null;
  const hasPostAuthorIdFilter = postAuthorIdFilter !== null;
  const hasPostTypeFilter = postTypeFilter !== null;
  const hasPostIsApprovedFilter = postIsApprovedFilter !== null;
  const hasPostCreatedAtFilter =
    postCreatedAtEqFilter ||
    postCreatedAtGteFilter ||
    postCreatedAtLteFilter ||
    postCreatedAtGtFilter ||
    postCreatedAtLtFilter;
  const hasPostUpdatedAtFilter =
    postUpdatedAtEqFilter ||
    postUpdatedAtGteFilter ||
    postUpdatedAtLteFilter ||
    postUpdatedAtGtFilter ||
    postUpdatedAtLtFilter;
  const hasPostCreditsFilter =
    postCreditsEqFilter ||
    postCreditsGteFilter ||
    postCreditsLteFilter ||
    postCreditsGtFilter ||
    postCreditsLtFilter;

  const hasPostFilter =
    hasPostIdFilter ||
    hasPostAuthorIdFilter ||
    hasPostTypeFilter ||
    hasPostIsApprovedFilter ||
    hasPostCreatedAtFilter ||
    hasPostUpdatedAtFilter ||
    hasPostCreditsFilter;

  if (hasIdFilter) filterObj.id = idFilter;
  if (hasBuyerIdFilter) filterObj.buyerId = buyerIdFilter;
  if (hasSellerIdFilter) filterObj.sellerId = sellerIdFilter;
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
  if (hasPostIdFilter) filterObj.id = postIdFilter;

  if (hasPostFilter) {
    const postFilterObj: z.infer<typeof postFilterObjSchema> = {};
    if (hasPostAuthorIdFilter) postFilterObj.authorId = postAuthorIdFilter;
    if (hasPostTypeFilter)
      postFilterObj.type = postTypeFilter as z.infer<typeof postTypes>;
    if (hasPostIsApprovedFilter)
      postFilterObj.isApproved = postIsApprovedFilter.toLowerCase() === "true";
    if (hasPostCreatedAtFilter) {
      postFilterObj.createdAt = {};
      if (postCreatedAtGteFilter)
        postFilterObj.createdAt.gte = new Date(postCreatedAtGteFilter);
      if (postCreatedAtLteFilter)
        postFilterObj.createdAt.lte = new Date(postCreatedAtLteFilter);
      if (postCreatedAtGtFilter)
        postFilterObj.createdAt.gt = new Date(postCreatedAtGtFilter);
      if (postCreatedAtLtFilter)
        postFilterObj.createdAt.lt = new Date(postCreatedAtLtFilter);
      if (postCreatedAtEqFilter)
        postFilterObj.createdAt.equals = new Date(postCreatedAtEqFilter);
    }
    if (hasPostUpdatedAtFilter) {
      postFilterObj.updatedAt = {};
      if (postUpdatedAtGteFilter)
        postFilterObj.updatedAt.gte = new Date(postUpdatedAtGteFilter);
      if (postUpdatedAtLteFilter)
        postFilterObj.updatedAt.lte = new Date(postUpdatedAtLteFilter);
      if (postUpdatedAtGtFilter)
        postFilterObj.updatedAt.gt = new Date(postUpdatedAtGtFilter);
      if (postUpdatedAtLtFilter)
        postFilterObj.updatedAt.lt = new Date(postUpdatedAtLtFilter);
      if (postUpdatedAtEqFilter)
        postFilterObj.updatedAt.equals = new Date(postUpdatedAtEqFilter);
    }
    if (hasPostCreditsFilter) {
      postFilterObj.itemCredits = {};
      if (postCreditsGteFilter)
        postFilterObj.itemCredits.gte = parseInt(postCreditsGteFilter);
      if (postCreditsLteFilter)
        postFilterObj.itemCredits.lte = parseInt(postCreditsLteFilter);
      if (postCreditsGtFilter)
        postFilterObj.itemCredits.gt = parseInt(postCreditsGtFilter);
      if (postCreditsLtFilter)
        postFilterObj.itemCredits.lt = parseInt(postCreditsLtFilter);
      if (postCreditsEqFilter)
        postFilterObj.itemCredits.equals = parseInt(postCreditsEqFilter);
    }
    filterObj.post = postFilterObj;
  }

  return filterObj;
}

function buildSortObject(searchParams: URLSearchParams) {
  const sortObj: z.infer<typeof transactionSortObjectSchema> = {};
  const postIdSort = searchParams.get("sortByPostId");
  const postCreatedAtSort = searchParams.get("sortByPostCreatedAt");
  const postUpdatedAtSort = searchParams.get("sortByPostUpdatedAt");
  const postTypeSort = searchParams.get("sortByPostType");
  const postCreditSort = searchParams.get("sortByCredits");
  const postIsApprovedSort = searchParams.get("sortByIsApproved");
  const postAuthorIdSort = searchParams.get("sortByAuthorId");
  const hasPostSort =
    postIdSort ||
    postCreatedAtSort ||
    postUpdatedAtSort ||
    postCreditSort ||
    postTypeSort ||
    postIsApprovedSort ||
    postAuthorIdSort;
  if (hasPostSort) {
    const postSortObj: z.infer<typeof postSortObjSchema> = {};
    if (postIdSort) postSortObj.id = postIdSort as z.infer<typeof sortTypes>;
    if (postCreatedAtSort)
      postSortObj.createdAt = postCreatedAtSort as z.infer<typeof sortTypes>;
    if (postUpdatedAtSort)
      postSortObj.updatedAt = postUpdatedAtSort as z.infer<typeof sortTypes>;
    if (postTypeSort)
      postSortObj.type = postTypeSort as z.infer<typeof sortTypes>;
    if (postCreditSort)
      postSortObj.itemCredits = postCreditSort as z.infer<typeof sortTypes>;
    if (postIsApprovedSort)
      postSortObj.isApproved = postIsApprovedSort as z.infer<typeof sortTypes>;
    if (postAuthorIdSort)
      postSortObj.authorId = postAuthorIdSort as z.infer<typeof sortTypes>;
    sortObj.post = postSortObj;
  }

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

    const transactions = await prisma.post.findMany({
      skip: (parseInt(page) - 1) * parseInt(size),
      take: parseInt(size),
      where: parsedFilterObj,
      orderBy: parsedSortObj,
    });
    return Response.json({ transactions }, { status: 200 });
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

export async function POST(req: Request) {
  try {
    const reqObj = await req.json();
    const { buyerId, sellerId,status, postId } = reqObj;
    // const session = await auth();
    const parsedReqObj = transactionCreateReqSchema.parse(reqObj);
    if (parsedReqObj.buyerId === parsedReqObj.sellerId)
      return Response.json(
        { error: "buyerId cannot be equal to sellerId" },
        { status: 400 }
      );
    const transaction = await prisma.transaction.create({
      data: {
        buyerId: buyerId,
        sellerId: sellerId,
        postId: postId,
        status: status,
      },
    });
    await prisma.post.update({
      where: { id: postId },
      data: { isAvailable: false },
    });

    return Response.json({ success: status, transaction }, {});
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
