import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import db from "@/db/drizzle";

import {
  userSubscription,
} from "@/db/schema";

import { eq } from "drizzle-orm";

import { razorpay } from "@/lib/razorpay";
import { revalidatePath } from "next/cache";

export async function POST() {

  try {

    const { userId } =
      await auth();

    if (!userId) {

      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const subscription =
      await db.query
        .userSubscription
        .findFirst({
          where: eq(
            userSubscription.userId,
            userId
          ),
        });

    if (!subscription) {

      return NextResponse.json(
        {
          error:
            "Subscription not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "CANCELLING:",
      subscription
        .razorpaySubscriptionId
    );

    console.log(
        "SUB ID:",
        subscription.razorpaySubscriptionId
    );

    // IMPORTANT FIX
    await razorpay
    .subscriptions
    .cancel(
      subscription
        .razorpaySubscriptionId,
      1
    );

    // UPDATE DB STATUS
    await db
      .update(userSubscription)
      .set({
        subscriptionStatus:
          "cancelled",
      })
      .where(
        eq(
          userSubscription.userId,
          userId
        )
      );

    console.log(
      "SUBSCRIPTION CANCELLED"
    );

    // Revalidate server-rendered paths
    revalidatePath("/shop");
    revalidatePath("/settings/subscription");

    return NextResponse.json({
      success: true,
    });

  } catch (error) {

    console.log(
      "CANCEL ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to cancel subscription",
      },
      {
        status: 500,
      }
    );
  }
}