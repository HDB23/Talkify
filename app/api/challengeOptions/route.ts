import { NextResponse } from "next/server";
import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { isAdmin } from "@/lib/admin";

/**
 * GET ALL
 */
export const GET = async () => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const data = await db.query.challengeOptions.findMany();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET ALL ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

/**
 * CREATE
 */
export const POST = async (req: Request) => {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();

    const data = await db
      .insert(challengeOptions)
      .values({ ...body })
      .returning();

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error("CREATE ERROR:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};