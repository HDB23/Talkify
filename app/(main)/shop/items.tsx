"use client";

import { createRazorpaySubscription, checkSubscriptionStatus, activateSubscription } from "@/actions/user-subscription";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTransition } from "react";
import { toast } from "sonner";
import { Crown, Check, Leaf, Star, BookOpen } from "lucide-react";
import { PremiumCard } from "@/components/premium-card";
import { cn } from "@/lib/utils";

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
    price: "₹29",
    popular: false,
  },

  {
    id: "2month",
    title: "2 Months",
    duration: "2 months",
    price: "₹39",
    popular: true,
  },

  {
    id: "3month",
    title: "3 Months",
    duration: "3 months",
    price: "₹49",
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
            color: "#0059e3",
          },

          handler: async function (response: any) {
            const toastId = toast.loading("Payment successful! Activating subscription...");
            
            try {
              console.log("[Client Razorpay Handler] Initiating direct subscription activation for plan:", planId);
              await activateSubscription(
                response.razorpay_subscription_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
                planId as any
              );
              toast.dismiss(toastId);
              toast.success("Subscription activated successfully!");
              window.location.reload();
            } catch (error) {
              console.error("[Client Razorpay Handler] Direct activation failed, polling webhook fallback...", error);
              toast.dismiss(toastId);
              toast.loading("Syncing active subscription state...");
              
              // Fallback to webhook database polling
              let checksCount = 0;
              const maxPollingChecks = 8;
              
              const subscriptionPoll = setInterval(async () => {
                checksCount++;
                console.log("[Client Razorpay Handler] Polling subscription database status. Check count:", checksCount);
                
                try {
                  const status = await checkSubscriptionStatus();
                  if (status.isActive || checksCount >= maxPollingChecks) {
                    clearInterval(subscriptionPoll);
                    console.log("[Client Razorpay Handler] Status sync complete. Reloading window...");
                    window.location.reload();
                  }
                } catch (pollError) {
                  console.error("[Client Razorpay Handler] Failed checking subscription status:", pollError);
                  if (checksCount >= maxPollingChecks) {
                    clearInterval(subscriptionPoll);
                    window.location.reload();
                  }
                }
              }, 1200);
            }
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
    <div className="grid md:grid-cols-3 gap-8 w-full mt-6">
      {plans.map((plan) => {
        // Dynamic icons and colors to match the reference design mockup exactly
        let IconComponent = Crown;
        let iconBg = "bg-yellow-50";
        let iconColor = "text-yellow-600";
        let priceColor = "text-neutral-800";
        let cardBorderActiveColor = "border-blue-500";
        let btnVariant: "default" | "primary" | "secondary" | "secondaryOutline" | "primaryOutline" | "super" | "superOutline" = "default";
        let btnStyle = "";

        const activePlanId = currentPlan || (hasActiveSubscription ? "1month" : null);
        const isCurrentPlan = activePlanId === plan.id;
        const isUpgrade = hasActiveSubscription && !isCurrentPlan;

        if (plan.id === "1month") {
          IconComponent = Leaf;
          iconBg = "bg-emerald-50 border border-emerald-100";
          iconColor = "text-emerald-500";
          priceColor = "text-emerald-600";
          btnVariant = isCurrentPlan ? "secondaryOutline" : "primaryOutline";
          btnStyle = isCurrentPlan
            ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50/50"
            : "border-slate-200 text-slate-500 hover:bg-slate-50";
        } else if (plan.id === "2month") {
          IconComponent = Star;
          iconBg = "bg-blue-50 border border-blue-100";
          iconColor = "text-blue-500";
          priceColor = "text-blue-600";
          cardBorderActiveColor = "border-blue-500 shadow-[0_12px_32px_rgba(0,89,227,0.15)]";
          btnVariant = isCurrentPlan ? "primaryOutline" : "primary";
          btnStyle = isCurrentPlan
            ? "border-blue-500 text-blue-600 hover:bg-blue-50/50"
            : "";
        } else if (plan.id === "3month") {
          IconComponent = BookOpen;
          iconBg = "bg-orange-50 border border-orange-100";
          iconColor = "text-orange-500";
          priceColor = "text-orange-600";
          btnVariant = "primaryOutline";
          btnStyle = isCurrentPlan
            ? "border-orange-500 text-orange-600 hover:bg-orange-50/50"
            : "border-orange-300 text-orange-500 hover:bg-orange-50/30 active:border-b-2";
        }

        return (
          <PremiumCard
            key={plan.id}
            active={plan.popular}
            activeBorderColor={cardBorderActiveColor}
            className={cn(
              "relative flex flex-col justify-between items-stretch w-full",
              plan.popular ? "scale-[1.03] lg:scale-[1.05]" : ""
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-md">
                POPULAR
              </div>
            )}

            <div className="flex flex-col items-stretch w-full">
              {/* Card Header (Icon & Title) */}
              <div className="flex flex-col items-center mb-6">
                <div className={`p-4 rounded-full ${iconBg} mb-3 shadow-inner`}>
                  <IconComponent className={`h-8 w-8 ${iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-neutral-800">
                  {plan.title}
                </h3>
              </div>

              {/* Price Container */}
              <div className="text-center mb-6">
                <span className={`text-4xl font-extrabold tracking-tight ${priceColor}`}>
                  {plan.price}
                </span>
                <span className="text-slate-400 text-sm ml-1">
                  /{plan.duration}
                </span>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-4 mb-8">
                {[
                  "Unlimited Hearts",
                  "No Ads",
                  "Faster Progress",
                  "Premium Support",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-x-3">
                    <div className="bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                    <span className="text-slate-600 font-medium text-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <Button
              variant={btnVariant}
              className={cn(
                "w-full h-14 text-xs sm:text-sm font-extrabold rounded-2xl uppercase tracking-wider px-4 shrink-0 transition-all flex items-center justify-center shadow-sm",
                btnStyle
              )}
              style={{
                width: "100%",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxSizing: "border-box"
              }}
              disabled={
                pending ||
                (hasActiveSubscription &&
                  PLAN_RANK[activePlanId as keyof typeof PLAN_RANK] >
                    PLAN_RANK[plan.id as keyof typeof PLAN_RANK])
              }
              onClick={() => {
                if (isCurrentPlan) {
                  window.location.href = "/settings/subscription";
                  return;
                }
                onUpgrade(plan.id);
              }}
            >
              {isCurrentPlan
                ? "Current Plan"
                : hasActiveSubscription &&
                  PLAN_RANK[activePlanId as keyof typeof PLAN_RANK] >
                    PLAN_RANK[plan.id as keyof typeof PLAN_RANK]
                ? "Lower Plan"
                : hasActiveSubscription
                ? "Upgrade"
                : "Choose Plan"}
            </Button>
          </PremiumCard>
        );
      })}
    </div>
  );
};