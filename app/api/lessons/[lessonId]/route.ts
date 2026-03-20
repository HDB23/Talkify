import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Helper to safely extract numeric lessonId
 */
const getCourseId = async (
  paramsPromise: Promise<{ lessonId: string }>
) => {
  const { lessonId } = await paramsPromise;

  const id = Number(lessonId);

  if (!id || isNaN(id)) {
    return null;
  }

  return id;
};

/**
 * GET ONE COURSE
 */
export const GET = async (
  _req: Request,
  context: { params: Promise<{ lessonId: string }> }
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = await getCourseId(context.params);
    if (!id) {
      return new NextResponse("Invalid course ID", { status: 400 });
    }

    const data = await db.query.lessons.findFirst({
      where: eq(lessons.id, id),
    });

    if (!data) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

/**
 * UPDATE COURSE
 */
export const PUT = async (
  req: Request,
  context: { params: Promise<{ lessonId: string }> }
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = await getCourseId(context.params);
    if (!id) {
      return new NextResponse("Invalid course ID", { status: 400 });
    }

    const body = await req.json();

    const updated = await db
      .update(lessons)
      .set({ ...body })
      .where(eq(lessons.id, id))
      .returning();

    if (!updated.length) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

/**
 * DELETE COURSE
 */
export const DELETE = async (
  _req: Request,
  context: { params: Promise<{ lessonId: string }> }
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = await getCourseId(context.params);
    if (!id) {
      return new NextResponse("Invalid course ID", { status: 400 });
    }

    const deleted = await db
      .delete(lessons)
      .where(eq(lessons.id, id))
      .returning();

    if (!deleted.length) {
      return new NextResponse("Course not found", { status: 404 });
    }

    return NextResponse.json(deleted[0]);
  } catch (error) {
    console.error("DELETE COURSE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};