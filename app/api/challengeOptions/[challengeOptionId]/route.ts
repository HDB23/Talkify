import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * Helper to safely extract numeric challengeOptionId
 */
const getCourseId = async (
  paramsPromise: Promise<{ challengeOptionId: string }>
) => {
  const { challengeOptionId } = await paramsPromise;

  const id = Number(challengeOptionId);

  if (isNaN(id)) {
    return null;
  }

  return id;
};

/**
 * GET ONE
 */
export const GET = async (
  _req: Request,
  context: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = await getCourseId(context.params);
    if (id === null) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const data = await db.query.challengeOptions.findFirst({
      where: eq(challengeOptions.id, id),
    });

    if (!data) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

/**
 * UPDATE
 */
export const PUT = async (
  req: Request,
  context: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = await getCourseId(context.params);
    if (id === null) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const body = await req.json();

    const updated = await db
      .update(challengeOptions)
      .set({ ...body })
      .where(eq(challengeOptions.id, id))
      .returning();

    if (!updated.length) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

/**
 * DELETE
 */
export const DELETE = async (
  _req: Request,
  context: { params: Promise<{ challengeOptionId: string }> }
) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const id = await getCourseId(context.params);
    if (id === null) {
      return new NextResponse("Invalid ID", { status: 400 });
    }

    const deleted = await db
      .delete(challengeOptions)
      .where(eq(challengeOptions.id, id))
      .returning();

    if (!deleted.length) {
      return new NextResponse("Not found", { status: 404 });
    }

    return NextResponse.json(deleted[0]);
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};