import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { quests } from "@/constants";
import { Progress } from "./ui/progress";
import { PremiumCard } from "./premium-card";

type Props = {
    points: number;
}

export const Quests = ({ points }: Props) => {
    return (
        <PremiumCard className="p-5 space-y-4 shadow-sm border-slate-200/60 mt-10">
            <div className="flex items-center justify-between w-full">
                <h3 className="font-extrabold text-lg text-neutral-800">
                    Quests
                </h3>
                <Link href="/quests">
                    <Button 
                        size="sm"
                        variant="primaryOutline"
                        className="text-xs px-3 h-8 border-[#0059e3]/20 text-[#0059e3] hover:bg-[#eaf3ff] rounded-xl font-bold uppercase tracking-wider"
                    >
                        View All
                    </Button>
                </Link>
            </div>
            <ul className="w-full space-y-10">
                {quests.map((quest) => {
                    const progress = (points / quest.value) * 100;

                        return (
                            <div
                                className="flex items-center w-full gap-x-3"
                                key={quest.title}
                            >
                                <Image 
                                    src="/points.svg"
                                    alt="Points"
                                    width={32}
                                    height={32}
                                    className="shrink-0"
                                />
                                <div className="flex flex-col gap-y-1.5 w-full">
                                    <div className="flex justify-between items-center w-full">
                                        <p 
                                            className="text-neutral-700 text-xs font-extrabold tracking-wide whitespace-normal"
                                            style={{ wordBreak: "normal", overflowWrap: "break-word" }}
                                        >
                                            {quest.title}
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-400">
                                            {Math.min(points, quest.value)}/{quest.value}
                                        </span>
                                    </div>
                                    <Progress value={progress} className="h-2 bg-slate-100" />
                                </div>          
                            </div>
                        )
                })}
            </ul>
        </PremiumCard>
    );
};