import { redirect } from "next/navigation";
import { getUserSubscription } from "@/db/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PremiumCard } from "@/components/premium-card";
import { AppBackground } from "@/components/app-background";

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
    <AppBackground>
      <div className="max-w-2xl mx-auto px-6 py-16 min-h-screen flex flex-col justify-center">

        <h1 className="text-3xl font-extrabold text-neutral-800 mb-8 tracking-tight text-center sm:text-left">
          Subscription Settings
        </h1>

        <PremiumCard className="p-8">

          {/* SUCCESS MESSAGE */}
          {searchParams.cancelled && (
            <div className="mb-6 rounded-2xl bg-yellow-50 text-yellow-800 border border-yellow-100 px-4 py-3 font-medium text-sm">
              Autopay cancelled successfully.
              Your premium access remains active until expiry.
            </div>
          )}

          <div className="space-y-6">

            <div className="border-b border-slate-100 pb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Current Plan
              </p>
              <h2 className="text-2xl font-black text-neutral-800">
                {subscription.planType === "1month"
                  ? "1 Month Plan"
                  : subscription.planType === "2month"
                  ? "2 Months Plan"
                  : "3 Months Plan"}
              </h2>
            </div>

            <div className="border-b border-slate-100 pb-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Valid Until
              </p>
              <h2 className="text-xl font-extrabold text-neutral-800">
                {expiryDate}
              </h2>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Status
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-base font-extrabold text-emerald-600">Active</span>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">

            <Link href="/shop" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto px-8 py-5 text-xs font-extrabold">
                Back to Shop
              </Button>
            </Link>

            <div className="w-full sm:flex-1 rounded-2xl bg-blue-50 text-blue-700 border border-blue-100/50 px-4 py-3.5 font-semibold text-xs leading-relaxed text-center sm:text-left">
              This subscription ends automatically on{" "}
              <span className="font-extrabold">{expiryDate}</span>. No further action is required.
            </div>

          </div>
        </PremiumCard>
      </div>
    </AppBackground>
  );
};

export default SubscriptionPage;