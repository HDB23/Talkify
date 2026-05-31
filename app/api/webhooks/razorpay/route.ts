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
} from "@/db/schema";

import { NextResponse } from "next/server";

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

      console.log(
        "No signature found"
      );

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

          process.env
            .RAZORPAY_TEST_WEBHOOK_SECRET!
        )

        .update(body)

        .digest("hex");

    if (
      expectedSignature !==
      signature
    ) {

      console.log(
        "Invalid signature"
      );

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

    // =====================================
    // HANDLE SUBSCRIPTION PAYMENT
    // =====================================

    if (
      event.event ===
      "subscription.charged"
    ) {

      console.log(
        "SUBSCRIPTION EVENT RECEIVED"
      );

      console.log(
        event.payload
      );

      const payment =
        event.payload
          .payment.entity;

      const subscription =
        event.payload
          .subscription.entity;

      console.log(
        "PAYMENT:",
        payment
      );

      console.log(
        "SUBSCRIPTION:",
        subscription
      );

      const userId =
        subscription
          .notes?.userId;

      if (!userId) {

        console.log(
          "UserId missing"
        );

        return new NextResponse(
          "No userId",
          {
            status: 400,
          }
        );
      }

      // =====================================
      // PLAN LOGIC
      // =====================================

      const plan =
        subscription
          .notes?.plan;

      let days = 30;

      if (
        plan === "2month"
      ) {
        days = 60;
      }

      if (
        plan === "3month"
      ) {
        days = 90;
      }

      const expiryDate =
        new Date(
          Date.now() +

          days *
            24 *
            60 *
            60 *
            1000
        );

      // =====================================
      // SAVE SUBSCRIPTION
      // =====================================

      await db

        .insert(
          userSubscription
        )

        .values({

          userId,

          razorpayCustomerId:
            userId,

          razorpaySubscriptionId:
            subscription.id,

          razorpayOrderId:
            payment.order_id,

          planType:
            plan,

          razorpayCurrentPeriodEnd:
            expiryDate,

          subscriptionStatus:
          subscription.status,
        })

        .onConflictDoUpdate({

          target:
            userSubscription.userId,

          set: {

            razorpaySubscriptionId:
              subscription.id,

            razorpayOrderId:
              payment.order_id,

            planType:
              plan,

            razorpayCurrentPeriodEnd:
              expiryDate,

            subscriptionStatus:
              subscription.status,
          },
        });

      console.log(
        "DATABASE UPDATED"
      );
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