import z from "zod";
const sortTypes = z.enum(["asc", "desc"]);

// user schemas
const userRoles = z.enum(["USER", "ADMIN"]);

export const userCreateReqObjSchema = z.object({
  name: z.string().trim().min(5).max(255).optional(),
  email: z.email().trim().min(5).max(255),
  password: z.string().trim().min(5).max(255),
  salt: z.string().trim().min(16).max(16).optional(), // 16-byte salt
  role: userRoles.default("USER").optional(),
  credits: z.int().default(0).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const userUpdateReqObjSchema = z.object({
  name: z.string().trim().min(5).max(255).optional(),
  email: z.email().trim().min(5).max(255).optional(),
  password: z.string().trim().min(5).max(255).optional(),
  salt: z.string().trim().min(16).max(16).optional(), // 16-byte salt
  role: userRoles.default("USER").optional(),
  credits: z.int().default(0).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const userIdSchema = z.cuid();

export const userLoginReqObjSchema = z.object({
  email: z.email().trim().min(5).max(255),
  password: z.string().trim().min(5).max(255),
});

export const userLoginFormSchema = userLoginReqObjSchema;

//post schemas

const postTypes = z.enum([
  "Plastic_Bottles",
  "Aluminum_Cans",
  "Paper",
  "Glass_Bottles",
  "Electronics",
  "Textiles",
  "Batteries",
  "Metal_Scrap",
]);

export const postFilterObjSchema = z.object({
  id: z.cuid().optional(),
  authorId: z.cuid().optional(),
  type: postTypes.optional(),
  isApproved: z.boolean().optional(),
  createdAt: z
    .object({
      gte: z.date().optional(),
      lte: z.date().optional(),
      gt: z.date().optional(),
      lt: z.date().optional(),
      equals: z.date().optional(),
    })
    .optional(),
  updatedAt: z
    .object({
      gte: z.date().optional(),
      lte: z.date().optional(),
      gt: z.date().optional(),
      lt: z.date().optional(),
      equals: z.date().optional(),
    })
    .optional(),
  credits: z
    .object({
      gte: z.number().int().optional(),
      lte: z.number().int().optional(),
      gt: z.number().int().optional(),
      lt: z.number().int().optional(),
      equals: z.number().int().optional(),
    })
    .optional(),
});

export const postSortObjSchema = z.object({
  id: sortTypes.optional(),
  createdAt: sortTypes.optional(),
  updatedAt: sortTypes.optional(),
  type: sortTypes.optional(),
  credits: sortTypes.optional(),
  isApproved: sortTypes.optional(),
  authorId: sortTypes.optional(),
});