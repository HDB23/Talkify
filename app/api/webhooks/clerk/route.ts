import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Clerk webhook handler.
 *
 * Events handled:
 *  - user.deleted  → remove the userProgress row so deleted accounts disappear
 *                    from the leaderboard immediately.
 *  - user.updated  → keep userName / userImageSrc in sync with the Clerk profile
 *                    (belt-and-suspenders alongside the getUserProgress sync).
 *
 * Setup:
 *  1. Add CLERK_WEBHOOK_SECRET to your .env (copy the "Signing Secret" from the
 *     Clerk Dashboard → Webhooks → your endpoint).
 *  2. In the Clerk Dashboard, create a webhook pointing to:
 *       <your-app-url>/api/webhooks/clerk
 *     and subscribe to the `user.deleted` and `user.updated` events.
 */
export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET is not set.");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  // Read the raw body and svix signature headers
  const body = await req.text();
  const headerPayload = await headers();

  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Missing svix headers", { status: 400 });
  }

  // Verify the webhook signature to ensure it really came from Clerk
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let event: { type: string; data: Record<string, any> };

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, any> };
  } catch (err) {
    console.error("Clerk webhook signature verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = event;

  // ── user.deleted ──────────────────────────────────────────────────────────
  if (type === "user.deleted") {
    const userId = data.id as string | undefined;

    if (!userId) {
      return new NextResponse("Missing user id in payload", { status: 400 });
    }

    try {
      await db.delete(userProgress).where(eq(userProgress.userId, userId));
      console.log(`[Clerk Webhook] Deleted userProgress for user: ${userId}`);
    } catch (err) {
      console.error(`[Clerk Webhook] Failed to delete userProgress for ${userId}:`, err);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  // ── user.updated ──────────────────────────────────────────────────────────
  if (type === "user.updated") {
    const userId = data.id as string | undefined;
    const firstName = (data.first_name as string | null) || "User";
    const imageUrl = (data.image_url as string | null) || "/mascot.svg";

    if (!userId) {
      return new NextResponse("Missing user id in payload", { status: 400 });
    }

    try {
      await db
        .update(userProgress)
        .set({ userName: firstName, userImageSrc: imageUrl })
        .where(eq(userProgress.userId, userId));

      console.log(`[Clerk Webhook] Updated userProgress for user: ${userId}`);
    } catch (err) {
      console.error(`[Clerk Webhook] Failed to update userProgress for ${userId}:`, err);
      return new NextResponse("Database error", { status: 500 });
    }
  }

  return new NextResponse("OK", { status: 200 });
}
