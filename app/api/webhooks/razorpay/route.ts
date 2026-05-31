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

// import db from "@/db/drizzle";
// import { userSubscription, userProgress } from "@/db/schema"; // ✅ add userProgress
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

//     const userId = payment.notes.userId;

//     // ✅ subscription (same as before)
//     await db.insert(userSubscription)
//       .values({
//         userId,
//         razorpayCustomerId: payment.email || payment.contact,
//         razorpaySubscriptionId: payment.id,
//         razorpayOrderId: payment.order_id,
//         razorpayCurrentPeriodEnd: new Date(
//           Date.now() + 30 * 24 * 60 * 60 * 1000
//         ),
//       })
//       .onConflictDoUpdate({
//         target: userSubscription.userId,
//         set: {
//           razorpayCustomerId: payment.email || payment.contact,
//           razorpaySubscriptionId: payment.id,
//           razorpayOrderId: payment.order_id,
//           razorpayCurrentPeriodEnd: new Date(
//             Date.now() + 30 * 24 * 60 * 60 * 1000
//           ),
//         },
//       });

//     // 🔥 IMPORTANT: make hearts "infinite"
//     await db.update(userProgress)
//       .set({
//         hearts: 9999, // acts as infinity
//       })
//       .where(eq(userProgress.userId, userId));
//   }

//   return new NextResponse(null, { status: 200 });
// }

import db from "@/db/drizzle";

import {
  userSubscription,
  userProgress,
} from "@/db/schema";

import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(
  req: Request
) {

  try {

    console.log(
      "WEBHOOK HIT"
    );

    const body =
      await req.text();

    const signature =
      req.headers.get(
        "x-razorpay-signature"
      ) as string;

    if (!signature) {
      console.log("No signature found");
      return new NextResponse(
        "No signature",
        {
          status: 400,
        }
      );
    }

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          process.env.RAZORPAY_TEST_WEBHOOK_SECRET || "fallback_secret"
        )
        .update(body)
        .digest("hex");

    console.log("[Webhook Debug] Signature verification details:", {
      received: signature,
      expected: expectedSignature,
      secretConfigured: !!process.env.RAZORPAY_TEST_WEBHOOK_SECRET
    });

    if (
      expectedSignature !== signature &&
      process.env.RAZORPAY_TEST_WEBHOOK_SECRET
    ) {
      console.log("Invalid signature");
      return new NextResponse(
        "Invalid signature",
        {
          status: 400,
        }
      );
    }

    const event =
      JSON.parse(body);

    console.log(
      "EVENT:",
      event.event
    );

    let userId: string | undefined;
    let plan: string = "1month";
    let subscriptionId: string | undefined;
    let orderId: string | undefined;
    let subscriptionStatus = "active";

    if (event.event === "subscription.charged") {
      console.log("SUBSCRIPTION EVENT RECEIVED");
      const payment = event.payload?.payment?.entity;
      const subscription = event.payload?.subscription?.entity;

      userId = subscription?.notes?.userId;
      plan = subscription?.notes?.plan || "1month";
      subscriptionId = subscription?.id;
      orderId = payment?.order_id;
      subscriptionStatus = subscription?.status || "active";
    } else if (event.event === "payment.captured") {
      console.log("PAYMENT CAPTURED EVENT RECEIVED");
      const payment = event.payload?.payment?.entity;
      
      userId = payment?.notes?.userId;
      plan = payment?.notes?.plan || "1month";
      subscriptionId = payment?.id;
      orderId = payment?.order_id;
      subscriptionStatus = "active";
    }

    if (event.event === "subscription.charged" || event.event === "payment.captured") {
      console.log("[Webhook] Processing activation for userId:", userId, "plan:", plan);

      if (!userId) {
        console.log("UserId missing");
        return new NextResponse("No userId", { status: 400 });
      }

      if (!subscriptionId) {
        console.log("SubscriptionId missing");
        return new NextResponse("No subscriptionId", { status: 400 });
      }

      // =====================================
      // PLAN LOGIC
      // =====================================
      let days = 30;
      if (plan === "2month") {
        days = 60;
      } else if (plan === "3month") {
        days = 90;
      }

      const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      // =====================================
      // SAVE SUBSCRIPTION
      // =====================================
      console.log("[Webhook Debug] Attempting database insert/update into userSubscription table:", {
        userId,
        razorpayCustomerId: userId,
        razorpaySubscriptionId: subscriptionId,
        razorpayOrderId: orderId || subscriptionId,
        planType: plan,
        razorpayCurrentPeriodEnd: expiryDate.toISOString(),
        subscriptionStatus: subscriptionStatus,
      });

      try {
        const insertResult = await db
          .insert(userSubscription)
          .values({
            userId,
            razorpayCustomerId: userId,
            razorpaySubscriptionId: subscriptionId,
            razorpayOrderId: orderId || subscriptionId,
            planType: plan,
            razorpayCurrentPeriodEnd: expiryDate,
            subscriptionStatus: subscriptionStatus,
          })
          .onConflictDoUpdate({
            target: userSubscription.userId,
            set: {
              razorpaySubscriptionId: subscriptionId,
              razorpayOrderId: orderId || subscriptionId,
              planType: plan,
              razorpayCurrentPeriodEnd: expiryDate,
              subscriptionStatus: subscriptionStatus,
            },
          });

        console.log("[Webhook Debug] Insert/Update query executed successfully. Result:", insertResult);
      } catch (insertError: any) {
        console.error("[Webhook Debug] CRITICAL INSERT EXCEPTION CAUGHT:", insertError);
        throw insertError;
      }

      // =====================================
      // ACTIVATION: set hearts to 9999 (infinite)
      // =====================================
      await db
        .update(userProgress)
        .set({
          hearts: 9999, // acts as infinity
        })
        .where(eq(userProgress.userId, userId));

      console.log("[Webhook] Hearts set to 9999 in userProgress table for:", userId);
    }

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(
      "WEBHOOK ERROR:",
      error
    );

    return new NextResponse(
      "Webhook Error",
      {
        status: 500,
      }
    );
  }
}