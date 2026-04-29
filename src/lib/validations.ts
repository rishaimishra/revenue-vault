import * as z from "zod";

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  revenue: z.coerce.number().min(0, "Revenue must be a positive number"),
  profit: z.coerce.number().min(0, "Profit must be a positive number"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
});

export type ListingInput = z.infer<typeof listingSchema>;
