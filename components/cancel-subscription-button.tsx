"use client";

import { Button } from "@/components/ui/button";

// import { useRouter } from "next/navigation";

import { toast } from "sonner";

export const CancelSubscriptionButton =
  () => {

    // const router =
    //   useRouter();

    const onCancel =
      async () => {

        try {

          const res =
            await fetch(
              "/api/razorpay/cancel",
              {
                method: "POST",
              }
            );

          if (!res.ok) {

            toast.error(
              "Failed to cancel subscription"
            );

            return;
          }

          toast.success(
            "Autopay cancelled"
          );

          window.location.href =
            "/settings/subscription?cancelled=true";

        } catch {

          toast.error(
            "Something went wrong"
          );
        }
      };

    return (
      <Button
        variant="danger"
        onClick={onCancel}
      >
        Cancel Autopay
      </Button>
    );
};