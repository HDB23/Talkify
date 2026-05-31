"use server";

import { razorpay } from "@/lib/razorpay";

import db from "@/db/drizzle";

import {
  userSubscription,
} from "@/db/schema";

import { auth } from "@clerk/nextjs/server";

import { eq } from "drizzle-orm";

export const cancelSubscription =
  async () => {

    const { userId } =
      await auth();

    if (!userId) {
      throw new Error(
        "Unauthorized"
      );
    }

    const subscription =
      await db.query.userSubscription.findFirst({
        where: eq(
          userSubscription.userId,
          userId
        ),
      });

    if (!subscription) {
      throw new Error(
        "No subscription found"
      );
    }

    await razorpay.subscriptions.cancel(
      subscription
        .razorpaySubscriptionId,
      true
    );

    return true;
  };