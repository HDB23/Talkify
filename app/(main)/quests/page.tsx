import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import { quests } from "@/constants";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/premium-card";
import { FeatureHighlights } from "@/components/feature-highlights";

const QuestsPage = async () => {

    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();

    const [
        userProgress,
        userSubscription,
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
                        hasActiveSubscription={isPro}
                    />
                    {!isPro && (
                        <Promo />
                    )}
                </StickyWrapper>
                <FeedWrapper>
                    <div className="w-full flex flex-col items-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-200/20 blur-3xl rounded-full" />
                            <Image 
                                src="/quests.svg"
                                alt="Quests"
                                height={90}
                                width={90}
                                className="relative z-10 drop-shadow-md"
                            />
                        </div>
                        <h1 className="text-center font-extrabold text-neutral-800 text-3xl my-6">
                            Quests
                        </h1>
                        <p className="text-muted-foreground text-center text-lg mb-8 max-w-md">
                            Complete quests by earning points.
                        </p>

                        <PremiumCard className="w-full p-4">
                            <ul className="w-full divide-y divide-slate-100">
                                {quests.map((quest) => {
                                    const progress = (userProgress.points / quest.value) * 100;

                                    return (
                                        <div
                                            className="flex items-center w-full py-6 px-4 gap-x-4 transition-colors hover:bg-slate-50 rounded-2xl"
                                            key={quest.title}
                                        >
                                            <Image 
                                                src="/points.svg"
                                                alt="Points"
                                                width={50}
                                                height={50}
                                                className="shrink-0 drop-shadow-sm"
                                            />
                                            <div className="flex flex-col gap-y-2.5 w-full">
                                                <div className="flex justify-between items-center w-full">
                                                    <p 
                                                        className="text-neutral-800 text-base font-bold tracking-wide whitespace-normal"
                                                        style={{ wordBreak: "normal", overflowWrap: "break-word" }}
                                                    >
                                                        {quest.title}
                                                    </p>
                                                    <span className="text-xs font-bold text-slate-400">
                                                        {Math.min(userProgress.points, quest.value)} / {quest.value} XP
                                                    </span>
                                                </div>
                                                <Progress value={progress} className="h-3 bg-slate-100" />
                                            </div>          
                                        </div>
                                    )
                                })}
                            </ul>
                        </PremiumCard>
                    </div>
                </FeedWrapper>
            </div>
            <div className="px-6 w-full">
                <FeatureHighlights />
            </div>
        </div>
    );   
};

export default QuestsPage;