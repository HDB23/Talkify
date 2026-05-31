import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
    title: string;
};

export const Header = ({ title }: Props) => {
    return (
        <div className="sticky top-0 bg-gradient-to-b from-[#eef6ff] via-[#eef6ff]/90 to-[#eef6ff]/80 backdrop-blur-md pb-4 pt-4 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b border-slate-200/40 mb-6 text-slate-500 lg:z-[45]">
            <Link href="/courses">
                <Button size="sm" variant="ghost" className="hover:bg-slate-200/50">
                    <ArrowLeft className="h-5 w-5 stroke-2 text-slate-400 hover:text-slate-600"/>
                </Button>
            </Link>
            <h1 className="font-extrabold text-xl text-neutral-800 tracking-wide mr-[35px]">
                {title}
            </h1>
            <div />
        </div>
    );
};