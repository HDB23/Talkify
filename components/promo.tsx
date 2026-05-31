import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { PremiumCard } from "./premium-card";

export const Promo = () => {
    return (
        <PremiumCard className="p-5 space-y-4 border-slate-200/60 shadow-sm">
            <div className="space-y-2">
                <div className="flex items-center gap-x-2">
                    <Image 
                        src="/premium.svg"
                        alt="Premium"
                        height={26}
                        width={26}
                        className="drop-shadow-sm"
                    />
                    <h3 className="font-extrabold text-lg text-neutral-800">Upgrade to Pro</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                    Purchase unlimited hearts, remove ads, and learn faster!
                </p>
            </div>
            <Button
                asChild
                variant="primary"
                className="w-full h-11 text-xs font-extrabold rounded-2xl uppercase tracking-wider"
            >
                <Link href="/shop">
                    Upgrade today
                </Link>
            </Button>
        </PremiumCard>
    );
};