// import db from "@/db/drizzle";
// import { userSubscription } from "@/db/schema";
// import { eq } from "drizzle-orm";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";
// import crypto from "crypto";

// export async function POST(req: Request) {

//   const body = await req.text();

//   const signature = (await headers()).get(
//     "x-razorpay-signature"
//   ) as string;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_TEST_WEBHOOK_SECRET!)
//     .update(body)
//     .digest("hex");

//   if (expectedSignature !== signature) {
//     return new NextResponse("Invalid signature", { status: 400 });
//   }

//   const event = JSON.parse(body);

//   const payment = event.payload?.payment?.entity;

//   if (event.event === "payment.captured") {

//     if (!payment?.notes?.userId) {
//       return new NextResponse("User ID missing", { status: 400 });
//     }

//     await db.insert(userSubscription).values({
//       userId: payment.notes.userId,
//       razorpayCustomerId: payment.email || payment.contact,
//       razorpaySubscriptionId: payment.id,
//       razorpayOrderId: payment.order_id,
//       razorpayCurrentPeriodEnd: new Date(
//         Date.now() + 30 * 24 * 60 * 60 * 1000
//       ),
//     });
//   }

//   if (event.event === "payment.authorized") {

//     await db.update(userSubscription)
//       .set({
//         razorpayOrderId: payment.order_id,
//         razorpayCurrentPeriodEnd: new Date(
//           Date.now() + 30 * 24 * 60 * 60 * 1000
//         ),
//       })
//       .where(eq(userSubscription.razorpaySubscriptionId, payment.id));
//   }

//   return new NextResponse(null, { status: 200 });
// }

import db from "@/db/drizzle";
import { userSubscription, userProgress } from "@/db/schema"; // ✅ add userProgress
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {

  const body = await req.text();

  const signature = (await headers()).get(
    "x-razorpay-signature"
  ) as string;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_TEST_WEBHOOK_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const payment = event.payload?.payment?.entity;

  if (event.event === "payment.captured") {

    if (!payment?.notes?.userId) {
      return new NextResponse("User ID missing", { status: 400 });
    }

    const userId = payment.notes.userId;

    // ✅ subscription (same as before)
    await db.insert(userSubscription)
      .values({
        userId,
        razorpayCustomerId: payment.email || payment.contact,
        razorpaySubscriptionId: payment.id,
        razorpayOrderId: payment.order_id,
        razorpayCurrentPeriodEnd: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ),
      })
      .onConflictDoUpdate({
        target: userSubscription.userId,
        set: {
          razorpayCustomerId: payment.email || payment.contact,
          razorpaySubscriptionId: payment.id,
          razorpayOrderId: payment.order_id,
          razorpayCurrentPeriodEnd: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ),
        },
      });

    // 🔥 IMPORTANT: make hearts "infinite"
    await db.update(userProgress)
      .set({
        hearts: 9999, // acts as infinity
      })
      .where(eq(userProgress.userId, userId));
  }

  return new NextResponse(null, { status: 200 });
}