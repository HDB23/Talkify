import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Helper to safely extract numeric unitId
 */
const getCourseId = async (
  paramsPromise: Promise<{ unitId: string }>
) => {
  const { unitId } = await paramsPromise;

  const id = Number(unitId);

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
  context: { params: Promise<{ unitId: string }> }
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

    const data = await db.query.units.findFirst({
      where: eq(units.id, id),
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
  context: { params: Promise<{ unitId: string }> }
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
      .update(units)
      .set({ ...body })
      .where(eq(units.id, id))
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
  context: { params: Promise<{ unitId: string }> }
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
      .delete(units)
      .where(eq(units.id, id))
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