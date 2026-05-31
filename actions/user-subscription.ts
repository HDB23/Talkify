"use server";

import { razorpay } from "@/lib/razorpay";

import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

import { getUserSubscription } from "@/db/queries";
import { revalidatePath } from "next/cache";

import db from "@/db/drizzle";
import { userSubscription, userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

export const checkSubscriptionStatus = async () => {
  const subscription = await getUserSubscription();
  
  // Force revalidation of cached server component paths
  revalidatePath("/shop");
  revalidatePath("/settings/subscription");
  
  return {
    isActive: !!subscription?.isActive,
  };
};

type PlanType =
  | "1month"
  | "2month"
  | "3month";

const PLAN_IDS = {
  "1month":
    process.env
      .RAZORPAY_PLAN_1MONTH!,

  "2month":
    process.env
      .RAZORPAY_PLAN_2MONTH!,

  "3month":
    process.env
      .RAZORPAY_PLAN_3MONTH!,
};

export const createRazorpaySubscription =
  async (
    plan: PlanType
  ) => {

    const { userId } =
      await auth();

    const user =
      await currentUser();

    if (!userId || !user) {
      throw new Error(
        "Unauthorized"
      );
    }

    const subscription =
      await razorpay.subscriptions.create({
        plan_id:
          PLAN_IDS[plan],

        customer_notify: 1,

        total_count:
          plan === "1month"
            ? 1
            : plan === "2month"
            ? 2
            : 3,

        notes: {
          userId,
          plan,
        },
      });

    return subscription;
  };

export const activateSubscription = async (
  razorpaySubscriptionId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
  plan: "1month" | "2month" | "3month"
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log("[activateSubscription] Received client activation call:", {
    userId,
    razorpaySubscriptionId,
    razorpayPaymentId,
    plan,
  });

  // Verify the signature if secret is configured (in production)
  if (process.env.RAZORPAY_API_SECRET) {
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(razorpayPaymentId + "|" + razorpaySubscriptionId)
      .digest("hex");
    
    if (expectedSignature !== razorpaySignature) {
      console.error("[activateSubscription] Signature verification failed!");
      throw new Error("Invalid signature");
    }
  }

  // Determine billing expiration date based on the plan type
  let days = 30;
  if (plan === "2month") {
    days = 60;
  } else if (plan === "3month") {
    days = 90;
  }
  const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  // Insert/Update userSubscription in the database
  await db
    .insert(userSubscription)
    .values({
      userId,
      razorpayCustomerId: userId,
      razorpaySubscriptionId,
      razorpayOrderId: razorpayPaymentId,
      planType: plan,
      razorpayCurrentPeriodEnd: expiryDate,
      subscriptionStatus: "active",
    })
    .onConflictDoUpdate({
      target: userSubscription.userId,
      set: {
        razorpaySubscriptionId,
        razorpayOrderId: razorpayPaymentId,
        planType: plan,
        razorpayCurrentPeriodEnd: expiryDate,
        subscriptionStatus: "active",
      },
    });

  console.log("[activateSubscription] Persisted subscription record in db");

  // Set hearts in userProgress to 9999 (infinite)
  await db
    .update(userProgress)
    .set({
      hearts: 9999,
    })
    .where(eq(userProgress.userId, userId));

  console.log("[activateSubscription] Activated infinite hearts (9999) for:", userId);

  // Force revalidation of cached paths
  revalidatePath("/shop");
  revalidatePath("/settings/subscription");

  return { success: true };
};