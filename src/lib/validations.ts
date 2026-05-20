import * as z from "zod";

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  tagline: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  country: z.string().optional(),
  foundedYear: z.coerce.number().optional(),

  description: z.string().min(10, "Description must be at least 10 characters"),
  businessModel: z.string().optional(),
  usp: z.string().optional(),
  reasonForSelling: z.string().optional(),

  revenue: z.coerce.number().min(0, "Revenue must be a positive number"),
  profit: z.coerce.number().min(0, "Profit must be a positive number"),
  price: z.coerce.number().min(0, "Price must be a positive number"),

  website: z.string().optional(),
  customerCount: z.coerce.number().optional(),
  traffic: z.string().optional(),
  assetsIncluded: z.string().optional(),
});

export type ListingInput = z.infer<typeof listingSchema>;
