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


