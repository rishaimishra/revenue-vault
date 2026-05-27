import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { crmTaskSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { userId, title, description, dueDate } = body;

    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    const validation = crmTaskSchema.safeParse({ title, description, dueDate });

    if (!validation.success) {
      return NextResponse.json(
        { message: "Validation error", errors: validation.error.format() },
        { status: 400 }
      );
    }

    // Verify contact user exists
    const contactUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!contactUser) {
      return NextResponse.json({ message: "Contact user not found" }, { status: 404 });
    }

    const newTask = await prisma.crmTask.create({
      data: {
        userId,
        adminId: (session.user as any).id,
        title: validation.data.title,
        description: validation.data.description || null,
        dueDate: validation.data.dueDate || null,
        status: "PENDING",
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_CRM_TASKS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { taskId, status } = body;

    if (!taskId) {
      return NextResponse.json({ message: "taskId is required" }, { status: 400 });
    }

    const task = await prisma.crmTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    // Toggle status if not provided, otherwise use provided
    const nextStatus = status || (task.status === "PENDING" ? "COMPLETED" : "PENDING");

    const updatedTask = await prisma.crmTask.update({
      where: { id: taskId },
      data: {
        status: nextStatus,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("[ADMIN_CRM_TASKS_PUT]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ message: "taskId is required as a query parameter" }, { status: 400 });
    }

    const task = await prisma.crmTask.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    await prisma.crmTask.delete({
      where: { id: taskId },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("[ADMIN_CRM_TASKS_DELETE]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
