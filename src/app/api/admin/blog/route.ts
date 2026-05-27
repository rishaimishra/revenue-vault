import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validation = blogPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.format() },
        { status: 400 }
      );
    }

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      metaTitle,
      metaDescription,
      metaKeywords,
      published,
    } = validation.data;

    // Check if slug is already taken
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existingPost) {
      return NextResponse.json(
        { message: "Slug is already in use by another post" },
        { status: 400 }
      );
    }

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        coverImage: coverImage || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        metaKeywords: metaKeywords || null,
        published,
        publishedAt: published ? new Date() : null,
        authorId: (session.user as any).id,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_BLOG_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
