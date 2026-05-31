import { redirect } from "next/navigation";

import {
  getUserSubscription,
} from "@/db/queries";

import { Button } from "@/components/ui/button";

import Link from "next/link";

type Props = {
  searchParams: {
    cancelled?: string;
  };
};

const SubscriptionPage = async ({
  searchParams,
}: Props) => {

  const subscription =
    await getUserSubscription();

  if (!subscription) {
    redirect("/shop");
  }

  const expiryDate =
    new Date(
      subscription
        .razorpayCurrentPeriodEnd
    ).toLocaleDateString();

  const isCancelled =
    subscription.subscriptionStatus ===
    "cancelled";

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">

      <h1 className="text-3xl font-bold mb-8">
        Subscription
      </h1>

      <div className="rounded-3xl border p-6 bg-white shadow-sm">

        {/* SUCCESS MESSAGE */}

        {searchParams.cancelled && (
          <div className="mb-6 rounded-2xl bg-yellow-100 text-yellow-800 px-4 py-3 font-medium">
            Autopay cancelled successfully.
            Your premium access remains active until expiry.
          </div>
        )}

        <div className="space-y-4">

          <div>
            <p className="text-sm text-muted-foreground">
              Current Plan
            </p>

        <h2 className="text-2xl font-bold">
        {subscription.planType === "1month"
            ? "1 Month Plan"
            : subscription.planType === "2month"
            ? "2 Months Plan"
            : "3 Months Plan"}
        </h2>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Valid Until
            </p>

            <h2 className="text-xl font-semibold">
              {expiryDate}
            </h2>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Status
            </p>

            <h2 className="text-xl font-semibold">
                Active
            </h2>
          </div>

        </div>

        <div className="flex flex-wrap gap-4 mt-8">

          <Link href="/shop">
            <Button>
              Back to Shop
            </Button>
          </Link>

        <div className="rounded-2xl bg-blue-50 text-blue-700 px-4 py-3 font-medium">
            This subscription ends automatically on{" "}
            {expiryDate}. No further action is required.
        </div>

        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;