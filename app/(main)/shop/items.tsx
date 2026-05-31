"use client";

import { createRazorpaySubscription } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { Crown, Check } from "lucide-react";

type Props = {
  hearts: number;
  points: number;
  hasActiveSubscription: boolean;
  currentPlan: string | null;
};

const plans = [
  {
    id: "1month",
    title: "1 Month",
    duration: "month",
    price: "₹199",
    popular: false,
  },

  {
    id: "2month",
    title: "2 Months",
    duration: "2 months",
    price: "₹349",
    popular: true,
  },

  {
    id: "3month",
    title: "3 Months",
    duration: "3 months",
    price: "₹499",
    popular: false,
  },
];

export const Items = ({
  hasActiveSubscription,
  currentPlan,
}: Props) => {

  const [pending, startTransition] =
    useTransition();

  const onUpgrade = async (
    planId: string
  ) => {
    try {

      const res =
        await createRazorpaySubscription(
          planId as any
        );

      if (!res?.id) {
  toast.error(
    "Something went wrong!"
  );
  return;
}

      const rzp = new (window as any)
        .Razorpay({
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_API_KEY,

          subscription_id: res.id,

          currency: "INR",

          name: "Talkify Premium",

          description:
            "Unlock unlimited hearts",

          theme: {
            color: "#58CC02",
          },

          handler: function () {
            toast.success(
              "Payment successful!"
            );

            setTimeout(() => {
                window.location.reload();
            }, 3000);
          },
        });

      rzp.open();

    } catch {
      toast.error(
        "Something went wrong!"
      );
    }
  };

  const PLAN_RANK = {
  "1month": 1,
  "2month": 2,
  "3month": 3,
};

  return (
    <div className="grid md:grid-cols-3 gap-6 w-full">

      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-3xl border-2 p-6 bg-white shadow-sm transition-all
          ${
            plan.popular
              ? "border-green-500 scale-105"
              : "border-neutral-200"
          }`}
        >

          {plan.popular && (
            <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
              POPULAR
            </div>
          )}

          <div className="flex items-center gap-2 mb-4">
            <Crown className="text-yellow-500" />
            <h2 className="text-2xl font-bold text-neutral-800">
              {plan.title}
            </h2>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold">
              {plan.price}
            </span>

            <span className="text-muted-foreground">
              /{plan.duration}
            </span>
          </div>

          <div className="space-y-3 mb-8">

            {[
              "Unlimited Hearts",
              "No Ads",
              "Faster Progress",
              "Premium Support",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2"
              >
                <Check className="h-5 w-5 text-green-500" />

                <span className="text-neutral-700">
                  {feature}
                </span>
              </div>
            ))}

          </div>

          <Button
            className="w-full h-12 text-base font-bold rounded-2xl whitespace-normal py-7"
            disabled={
                pending ||

                (
                    hasActiveSubscription &&

                    PLAN_RANK[
                    currentPlan as keyof typeof PLAN_RANK
                    ] >

                    PLAN_RANK[
                    plan.id as keyof typeof PLAN_RANK
                    ]
                )
            }
            onClick={() => {

                if (currentPlan === plan.id) {
                    window.location.href =
                    "/settings/subscription";

                    return;
                }

                onUpgrade(plan.id);
            }}
          >
            {currentPlan === plan.id
                ? "Current Plan"

                : hasActiveSubscription &&
                    PLAN_RANK[
                    currentPlan as keyof typeof PLAN_RANK
                    ] >
                    PLAN_RANK[
                    plan.id as keyof typeof PLAN_RANK
                    ]

                ? "Lower Plan"

                : hasActiveSubscription

                ? "Upgrade"

                : "Choose Plan"
            }
          </Button>

        </div>
      ))}
    </div>
  );
};