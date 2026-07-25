"use client"

import { challengeOptions, challenges, userSubscription } from "@/db/schema"
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import Confetti from "react-confetti";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";
import { Badge, badgeConfigs } from "@/components/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    initialPercentage: number,
    initialHearts: number,
    initialLessonId: number,
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];

    userSubscription: typeof userSubscription.$inferSelect & {
        isActive: boolean;
    } | null;
    initialPoints: number;
};

export const Quiz = ({ 
    initialPercentage,
    initialHearts,  
    initialLessonId,
    initialLessonChallenges,
    userSubscription,
    initialPoints,
 }: Props) => {

    const { open: openHeartsModal } = useHeartsModal();
    const { open: openPracticeModal } = usePracticeModal();
    const [correctOptionId, setCorrectOptionId] = useState<number | null>(null);
    const [celebrated, setCelebrated] = useState(false);
    const [currentUnlockIndex, setCurrentUnlockIndex] = useState(0);

    useMount(() => {
        if(initialPercentage === 100) {
            openPracticeModal();
        }
    });

    const showCorrectOption = () => {
        const correctOption = options.find((option) => option.correct);
        if (correctOption) {
            setCorrectOptionId(correctOption.id);
        }
    };
    
    const { width, height } = useWindowSize();


    const router = useRouter();

    const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({ src: "/correct.mp3" });
    const [
        incorrectAudio,
        _i,
        incorrectControls,
    ] = useAudio({ src: "/incorrect.mp3" });
    const [pending, startTransition] = useTransition();

    const [lessonId] = useState(initialLessonId); 

    const [ hearts, setHearts ] = useState(initialHearts);
    const [ percentage, setPercentage ] = useState(() => {
        return initialPercentage === 100 ? 0 : initialPercentage;
    });
    const [challenges] = useState(initialLessonChallenges);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed);
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });

    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1);
    };

    const onSelect = (id: number) => {
        if(status !== "none") return;

        setSelectedOption(id);
    };

    const onContinue = () => {
        if(!selectedOption) return;

        if(status === "wrong" || status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            setCorrectOptionId(null); // 👈 add
            return;
        }

        const correctOption = options.find((option) => option.correct);

        if(!correctOption) {
            return;
        }

        if(correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id).then((response) => {
                    if(response?.error === "hearts") {
                        openHeartsModal();
                        return;
                    }

                    correctControls.play();

                    setStatus("correct");
                    setPercentage((prev) => prev + 100 / challenges.length);

                    // This is a practice
                    if(initialPercentage === 100) {
                        setHearts((prev) => Math.min(prev + 0, 5));
                    }
                })
                .catch(() => toast.error("Something went wrong. Please try again."))
            })
        }
        else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if(response?.error === "hearts") {
                            openHeartsModal();
                            return;
                        }

                        incorrectControls.play();

                        // showCorrectOption();
                        const correctOption = options.find((option) => option.correct);
                        setCorrectOptionId(correctOption?.id ?? null); 

                        setStatus("wrong");

                        if(!response?.error) {
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("Something went wrong. Please try again ..."))
            })
        }
    };
    
    if(!challenge) {
        const newlyUnlockedBadges: ("bronze" | "silver" | "gold" | "platinum" | "diamond")[] = [];
        const isPracticeSession = initialPercentage === 100;
        const newlyCompletedCount = isPracticeSession ? 0 : challenges.filter(c => !c.completed).length;
        const earnedPoints = newlyCompletedCount * 10;
        const finalPoints = initialPoints + earnedPoints;

        if (initialPoints < 20 && finalPoints >= 20) newlyUnlockedBadges.push("bronze");
        if (initialPoints < 50 && finalPoints >= 50) newlyUnlockedBadges.push("silver");
        if (initialPoints < 100 && finalPoints >= 100) newlyUnlockedBadges.push("gold");
        if (initialPoints < 500 && finalPoints >= 500) newlyUnlockedBadges.push("platinum");
        if (initialPoints < 1000 && finalPoints >= 1000) newlyUnlockedBadges.push("diamond");

        const hasUnlocked = newlyUnlockedBadges.length > 0;
        const showCelebrationModal = hasUnlocked && !celebrated;
        const currentBadge = showCelebrationModal ? newlyUnlockedBadges[currentUnlockIndex] : null;
        const badgeConfig = currentBadge ? badgeConfigs[currentBadge] : null;

        return (
            <>
                {finishAudio}
                <Confetti 
                    width={width}
                    height={height}
                    recycle={false}
                    numberOfPieces={500}
                    tweenDuration={10000}
                />

                {/* Badge Unlock Celebration Dialog */}
                {showCelebrationModal && badgeConfig && currentBadge && (
                    <Dialog open={showCelebrationModal} onOpenChange={(open) => {
                        if (!open) {
                            if (currentUnlockIndex < newlyUnlockedBadges.length - 1) {
                                setCurrentUnlockIndex(prev => prev + 1);
                            } else {
                                setCelebrated(true);
                            }
                        }
                    }}>
                        <DialogContent className="sm:max-w-md rounded-3xl p-6 border-slate-200 z-[99999]">
                            <DialogHeader className="flex flex-col items-center justify-center text-center">
                                <div className="relative my-6 flex items-center justify-center">
                                    <div className={`absolute inset-0 blur-3xl opacity-50 rounded-full bg-gradient-to-br ${badgeConfig.colorClasses}`} style={{ transform: "scale(1.5)" }} />
                                    <div className="relative animate-bounce">
                                        <Badge type={currentBadge} size="lg" locked={false} interactive={false} />
                                    </div>
                                    <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-400 animate-pulse" />
                                    <Award className="absolute -bottom-4 -left-4 h-8 w-8 text-purple-400 animate-pulse" />
                                </div>

                                <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">
                                    New Badge Unlocked! 🎉
                                </DialogTitle>
                                <DialogDescription className="text-sm text-slate-500 font-medium max-w-sm mt-2">
                                    You&apos;ve unlocked the <span className="font-extrabold text-[#0059e3]">{badgeConfig.title}</span> by reaching <span className="font-bold">{badgeConfig.xp} XP</span>!
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col gap-y-3 mt-4 items-center">
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full text-center">
                                    <span className="text-sm font-semibold text-slate-500 block uppercase tracking-wider text-[10px]">Badge Earned</span>
                                    <span className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-x-2 mt-1">
                                        {badgeConfig.emoji} {badgeConfig.title.toUpperCase()}
                                    </span>
                                </div>
                                
                                <Button 
                                    onClick={() => {
                                        if (currentUnlockIndex < newlyUnlockedBadges.length - 1) {
                                            setCurrentUnlockIndex(prev => prev + 1);
                                        } else {
                                            setCelebrated(true);
                                        }
                                    }}
                                    className="w-full rounded-2xl h-12 font-bold bg-[#0059e3] hover:bg-[#0059e3]/90 border-b-4 border-b-blue-800 active:border-b-0"
                                >
                                    Awesome!
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}

                <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                    <Image 
                        src="/finish.svg"
                        alt="Finish"
                        className="hidden lg:block"
                        height={100}
                        width={100}
                    /> 
                    <Image 
                        src="/finish.svg"
                        alt="Finish"
                        className="block lg:hidden"
                        height={50}
                        width={50}
                    /> 
                    <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                        Great job ! <br /> You&apos;ve completed the lesson.
                    </h1>
                    <div className="flex items-center gap-x-4 w-full">
                        <ResultCard 
                            variant="points"
                            value={challenges.length * 10}
                        />
                        <ResultCard 
                            variant="hearts"
                            value={hearts}
                        />
                    </div>
                </div>
                <Footer 
                    lessonId={lessonId}
                    status="completed"
                    onCheck={() => router.push("/learn")}
                />
            </>
        )
    }

    const title = challenge.type === "ASSIST" ? "Select the correct meaning" : challenge.question;

    return (
        <>
            {incorrectAudio}
            {correctAudio}
            <Header 
                hearts={hearts}
                percentage={percentage}
                hasActiveSubscription={!!userSubscription?.isActive}
            />
            <div className="flex-1">
                <div className="h-full flex items-center justify-center">
                    <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                        <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                            {title}
                        </h1>
                        <div>
                            {challenge.type === "ASSIST" && (
                                <QuestionBubble question={challenge.question}/>
                            )}
                            <Challenge 
                                options={options}
                                onSelect={onSelect}
                                status={status}
                                selectedOption={selectedOption}
                                disabled={pending} 
                                type={challenge.type}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer 
                disabled={pending || !selectedOption}
                status={status}
                onCheck={onContinue}
            />
        </>
    )
}