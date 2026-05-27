import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { blogPostSchema } from "@/lib/validations";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
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

    // Check if the blog post exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    // Check if the slug is taken by another post
    const slugTaken = await prisma.blogPost.findFirst({
      where: {
        slug,
        id: { not: postId },
      },
    });

    if (slugTaken) {
      return NextResponse.json(
        { message: "Slug is already in use by another post" },
        { status: 400 }
      );
    }

    // Determine publishedAt date
    let publishedAt = existingPost.publishedAt;
    if (published && !existingPost.published) {
      publishedAt = new Date();
    } else if (!published) {
      publishedAt = null;
    }

    const updatedPost = await prisma.blogPost.update({
      where: { id: postId },
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
        publishedAt,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("[ADMIN_BLOG_PUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existingPost = await prisma.blogPost.findUnique({
      where: { id: postId },
    });

    if (!existingPost) {
      return NextResponse.json({ message: "Blog post not found" }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("[ADMIN_BLOG_DELETE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
