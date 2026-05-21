import * as z from "zod";

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tagline: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  country: z.string().optional(),
  foundedYear: z.number().int().min(1900).max(new Date().getFullYear()).optional(),

  description: z.string().min(10, "Description must be at least 10 characters"),
  businessModel: z.string().optional(),
  usp: z.string().optional(),
  reasonForSelling: z.string().optional(),

  revenue: z.number().min(0, "Revenue must be a non-negative number"),
  profit: z.number().min(0, "Profit must be a non-negative number").optional(),
  price: z.number().positive("Asking price must be greater than 0"),

  website: z.string().optional(),
  customerCount: z.number().int().min(0).optional(),
  traffic: z.string().optional(),
  assetsIncluded: z.string().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
