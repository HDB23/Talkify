"use server";

import { razorpay } from "@/lib/razorpay";

import {
  auth,
  currentUser,
} from "@clerk/nextjs/server";

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