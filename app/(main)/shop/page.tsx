import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Items } from "./items";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { FeatureHighlights } from "@/components/feature-highlights";

const ShopPage = async () => {

    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        userSubscription
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,
    ]);

    if(!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    const isPro = !!userSubscription?.isActive;

    return (
        <div className="flex flex-col gap-y-6 w-full">
            <div className="flex flex-row-reverse gap-[48px] px-6 w-full items-stretch">
                <StickyWrapper>
                    <UserProgress 
                        activeCourse={userProgress.activeCourse}
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        streak={userProgress.streak}
                        hasActiveSubscription={isPro}
                    />
                    {!isPro && (
                        <Promo />
                    )}
                    <Quests 
                        points={userProgress.points}
                    />
                </StickyWrapper>
                <FeedWrapper>
                    <div className="w-full flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-200/20 blur-3xl rounded-full" />
                            <Image 
                                src="/shop.svg"
                                alt="Shop"
                                height={90}
                                width={90}
                                className="relative z-10 drop-shadow-md"
                            />
                        </div>
                        <h1 className="text-center font-extrabold text-neutral-800 text-3xl my-6">
                            Shop
                        </h1>
                        <p className="text-muted-foreground text-center text-lg mb-8 max-w-md">
                            Unlock premium features and enjoy <span className="text-[#0059e3] font-bold">unlimited hearts</span>.
                        </p>
                        <Items
                            hearts={userProgress.hearts}
                            points={userProgress.points}
                            hasActiveSubscription={isPro}
                            currentPlan={
                                userSubscription?.planType || null
                            }
                        />
                    </div>
                </FeedWrapper>
            </div>
            <div className="px-6 w-full">
                <FeatureHighlights />
            </div>
        </div>
    );   
};

export default ShopPage;