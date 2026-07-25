import { MobileSidebar } from "./mobile-sidebar";
import { courses } from "@/db/schema";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { InfinityIcon } from "lucide-react";

type Props = {
    userProgress: {
        activeCourse?: {
            id: number;
            title: string;
            imageSrc: string;
        } | null;
        hearts: number;
        points: number;
    } | null | undefined;
    userSubscription?: {
        isActive: boolean;
    } | null;
};

export const MobileHeader = ({ userProgress, userSubscription }: Props) => {
    const isPro = !!userSubscription?.isActive;

    return(
        <nav className="lg:hidden px-6 h-[50px] flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-200/40 fixed top-0 w-full z-50 shadow-sm">
            <MobileSidebar />
            {userProgress && userProgress.activeCourse && (
                <div className="flex items-center gap-x-2">
                    <Link href="/quests">
                        <Button variant="ghost" size="sm" className="text-orange-500 font-bold">
                            <Image src="/points.svg" height={24} width={24} alt="points" className="mr-1.5"/>
                            {userProgress.points}
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="ghost" size="sm" className="text-rose-500 font-bold">
                            <Image src="/hearts.svg" height={18} width={18} alt="hearts" className="mr-1.5"/>
                            {isPro ? <InfinityIcon className="h-4 w-4 stroke-[3]"/> : userProgress.hearts}
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
};