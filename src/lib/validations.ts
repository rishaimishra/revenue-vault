import * as z from "zod";

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tagline: z.string().optional().nullable(),
  category: z.string().min(1, "Category is required"),
  country: z.string().optional().nullable(),
  foundedYear: z.union([
    z.number().int().min(1900).max(new Date().getFullYear()),
    z.nan(),
    z.null(),
    z.undefined()
  ]).transform((val) => (val === null || val === undefined || Number.isNaN(val) ? null : val)).optional(),

  description: z.string().min(10, "Description must be at least 10 characters"),
  businessModel: z.string().optional().nullable(),
  usp: z.string().optional().nullable(),
  reasonForSelling: z.string().optional().nullable(),

  revenue: z.union([
    z.number({ message: "Revenue is required" }).min(0, "Revenue must be a non-negative number"),
    z.nan()
  ]).refine((val) => !Number.isNaN(val), { message: "Revenue is required and must be a number" }),
  
  profit: z.union([
    z.number().min(0, "Profit must be a non-negative number"),
    z.nan(),
    z.null(),
    z.undefined()
  ]).transform((val) => (val === null || val === undefined || Number.isNaN(val) ? null : val)).optional(),

  price: z.union([
    z.number({ message: "Asking price is required" }).positive("Asking price must be greater than 0"),
    z.nan()
  ]).refine((val) => !Number.isNaN(val), { message: "Asking price is required and must be a number" }),

  website: z.string().optional().nullable(),
  customerCount: z.union([
    z.number().int().min(0, "Customer count must be a non-negative integer"),
    z.nan(),
    z.null(),
    z.undefined()
  ]).transform((val) => (val === null || val === undefined || Number.isNaN(val) ? null : val)).optional(),

  traffic: z.string().optional().nullable(),
  assetsIncluded: z.string().optional().nullable(),
});

export type ListingInput = z.infer<typeof listingSchema>;

export const blogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().url("Invalid image URL").or(z.string().length(0)).optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),
  published: z.boolean(),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;

export const crmNoteSchema = z.object({
  content: z.string().min(2, "Note content must be at least 2 characters"),
});

export type CrmNoteInput = z.infer<typeof crmNoteSchema>;

export const crmTaskSchema = z.object({
  title: z.string().min(3, "Task title must be at least 3 characters"),
  description: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable().transform((val) => (val ? new Date(val) : null)),
});

export type CrmTaskInput = z.infer<typeof crmTaskSchema>;



