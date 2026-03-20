"use server";

import { razorpay } from "@/lib/razorpay";
import { absoluteUrl } from "@/lib/utils";
import { getUserSubscription } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";

const returnUrl = absoluteUrl("/shop");

// export const createRazorpayOrder = async () => {

//   const { userId } = await auth();
//   const user = await currentUser();

//   if (!userId || !user) {
//     throw new Error("Unauthorized");
//   }

//   const userSubscription = await getUserSubscription();

//   if (userSubscription && userSubscription.razorpayCustomerId) {
//     return { data: returnUrl };
//   }

//   const razorpayOrder = await razorpay.orders.create({
//     amount: 2000, 
//     currency: "INR",
//     receipt: `test_receipt_${userId}`,
//     notes: {
//       userId,
//       email: user.emailAddresses[0].emailAddress,
//     },
//   });

//   return { data: razorpayOrder.id };
// };

// export const createRazorpayOrder = async () => {
//   try {
//     const { userId } = await auth();
//     const user = await currentUser();

//     if (!userId || !user) {
//       throw new Error("Unauthorized");
//     }

//     const razorpayOrder = await razorpay.orders.create({
//       amount: 2000,
//       currency: "INR",
//       receipt: `receipt_${userId}`,
//       notes: {
//         userId,
//         email: user.emailAddresses[0].emailAddress,
//       },
//     });

//     console.log("Order created:", razorpayOrder);

//     return { data: razorpayOrder.id };

//   } catch (error) {
//     console.error("RAZORPAY ERROR:", error);
//     throw error;
//   }
// };

export const createRazorpayOrder = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      throw new Error("Unauthorized");
    }

    const userSubscription = await getUserSubscription();

    if (userSubscription?.isActive) {
      return { data: null };
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: 2000,
      currency: "INR",
      receipt: `receipt_${userId}`,
      notes: {
        userId,
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });

    return { data: razorpayOrder.id };

  } catch (error) {
    console.error("RAZORPAY ERROR:", error);
    throw error;
  }
};