import z from "zod";
export const sortTypes = z.enum(["asc", "desc"]);

// user schemas
export const userRoles = z.enum(["USER", "ADMIN"]);

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
  role: userRoles.default("USER").optional(),
  credits: z.int().default(0).optional(),
  isActive: z.boolean().default(true).optional(),
});

export const userIdSchema = z.cuid().trim();

export const userLoginReqObjSchema = z.object({
  email: z.email().trim().min(5).max(255),
  password: z.string().trim().min(5).max(255),
});

export const userLoginFormSchema = userLoginReqObjSchema;

export const userFilterObjSchema = z.object({
  id: userIdSchema.optional(),
  twoFactorAuth: z.boolean().optional(),
  createdAt: z
    .object({
      gte: z.date().optional(),
      lte: z.date().optional(),
      gt: z.date().optional(),
      lt: z.date().optional(),
      equals: z.date().optional(),
    })
    .optional(),
  email: z.email().trim().optional(),
  name: z.string().trim().optional(),
  credits: z
    .object({
      gte: z.int().positive().optional(),
      lte: z.int().positive().optional(),
      gt: z.int().positive().optional(),
      lt: z.int().positive().optional(),
      equals: z.int().positive().optional(),
    })
    .optional(),
  role: userRoles.optional(),
  isActive: z.boolean().optional()
});

export const userSortObjSchema = z.object({
  id: sortTypes.optional(),
  createdAt: sortTypes.optional(),
  email: sortTypes.optional(),
  name: sortTypes.optional(),
  twoFactorAuth: sortTypes.optional(),
  credits: sortTypes.optional(),
  isActive: sortTypes.optional(),
  role: sortTypes.optional(),
});

//post schemas
export const postIdSchema = z.cuid();

export const postTypes = z.enum([
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
  id: postIdSchema.optional(),
  authorId: userIdSchema.optional(),
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
      gte: z.int().positive().optional(),
      lte: z.int().positive().optional(),
      gt: z.int().positive().optional(),
      lt: z.int().positive().optional(),
      equals: z.int().positive().optional(),
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


export const postUpdateObjSchema = z.object({
  type: postTypes.optional(),
  desc: z.string().trim().optional(),
  credits: z.int().optional(),
  isApproved: z.boolean().optional(),
});

export const postCreateSchema = z.object({
  type: postTypes,
  desc: z.string().optional(),
  credits: z.int().positive(),
  authorId: userIdSchema,
});

//otp schemas

export const otpReqSchema = z.object({
  otp: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});
