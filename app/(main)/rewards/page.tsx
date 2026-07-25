import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { RewardsList } from "@/components/rewards-list";

const RewardsPage = async () => {
    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        userSubscription,
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,
    ]);

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }

    const isPro = !!userSubscription?.isActive;

    return (
        <div className="flex flex-col gap-y-6 w-full">
            <div className="flex flex-row-reverse gap-[48px] px-6 w-full items-stretch">
                {/* Desktop Sticky Sidebar Progress */}
                <StickyWrapper>
                    <UserProgress 
                        activeCourse={userProgress.activeCourse}
                        hearts={userProgress.hearts}
                        points={userProgress.points}
                        hasActiveSubscription={isPro}
                    />
                    {!isPro && (
                        <Promo />
                    )}
                </StickyWrapper>

                {/* Main Content Area */}
                <FeedWrapper>
                    <div className="w-full flex flex-col items-center">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-200/20 blur-3xl rounded-full" />
                            <Image 
                                src="/certificate.svg"
                                alt="Rewards"
                                height={90}
                                width={90}
                                className="relative z-10 drop-shadow-md"
                            />
                        </div>
                        <h1 className="text-center font-extrabold text-neutral-800 text-3xl mb-3">
                            Milestone Rewards
                        </h1>
                        <p className="text-muted-foreground text-center text-base mb-8 max-w-md">
                            Earn points (XP) to unlock beautiful badges celebrating your language learning milestones!
                        </p>

                        <RewardsList points={userProgress.points} />
                    </div>
                </FeedWrapper>
            </div>
        </div>
    );
};

export default RewardsPage;
