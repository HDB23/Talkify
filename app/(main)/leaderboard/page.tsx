import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { Quests } from "@/components/quests";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";
import { getTopTenUsers, getUserProgress, getUserSubscription } from "@/db/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PremiumCard } from "@/components/premium-card";
import { FeatureHighlights } from "@/components/feature-highlights";

const LeaderBoardPage = async () => {

    const userProgressData = getUserProgress();
    const userSubscriptionData = getUserSubscription();
    const leaderboardData = getTopTenUsers();

    const [
        userProgress,
        userSubscription,
        leaderboard,
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,
        leaderboardData,
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
                                src="/leaderboard.svg"
                                alt="Leaderboard"
                                height={90}
                                width={90}
                                className="relative z-10 drop-shadow-md"
                            />
                        </div>
                        <h1 className="text-center font-extrabold text-neutral-800 text-3xl my-6">
                            Leaderboard
                        </h1>
                        <p className="text-muted-foreground text-center text-lg mb-8 max-w-md">
                            See where you stand among other learners in the community.
                        </p>

                        <PremiumCard className="w-full p-2">
                            <div className="divide-y divide-slate-100">
                                {leaderboard.map((userProgress, index) => {
                                    const isTop3 = index < 3;
                                    const rankColors = [
                                        "text-amber-500 font-extrabold text-lg", // 1st Place Gold
                                        "text-slate-400 font-extrabold text-lg", // 2nd Place Silver
                                        "text-amber-700 font-extrabold text-lg", // 3rd Place Bronze
                                    ];
                                    
                                    return (
                                        <div 
                                            key={userProgress.userId} 
                                            className="flex items-center w-full py-4 px-6 rounded-2xl hover:bg-slate-50 transition-colors"
                                        >
                                            <p className={isTop3 ? rankColors[index] : "font-bold text-slate-400 mr-4 w-6 text-center"}>
                                                {index + 1}
                                            </p>
                                            <Avatar
                                                className="border border-slate-100 bg-slate-200 h-10 w-10 ml-3 mr-6 shadow-sm shrink-0"
                                            >
                                                <AvatarImage 
                                                    className="object-cover"
                                                    src={userProgress.userImageSrc}
                                                />
                                            </Avatar>
                                            <p className="font-bold text-neutral-800 flex-1 text-sm tracking-wide">
                                                {userProgress.userName}
                                            </p>
                                            <p className="font-extrabold text-[#0059e3] text-sm shrink-0">
                                                {userProgress.points} <span className="text-[10px] font-bold text-slate-400">XP</span>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
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

export default LeaderBoardPage;