import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import { PremiumCard } from "@/components/premium-card";

type Props = {
    title: string;
    id: number;
    imageSrc: string;
    onClick: (id: number) => void;
    disabled?: boolean;
    active?: boolean;
};

export const Card = ({
    title,
    id,
    imageSrc,
    disabled,
    onClick,
    active,
}: Props) => {
    return (
        <PremiumCard 
            onClick={() => onClick(id)}
            active={active}
            activeBorderColor="border-blue-500 shadow-[0_12px_28px_rgba(0,89,227,0.12)] scale-[1.03]"
            className={cn(
                "h-full flex flex-col items-center justify-between p-4 pb-6 min-h-[210px] cursor-pointer active:scale-[0.98] select-none hover:border-blue-300",
                disabled && "pointer-events-none opacity-50"
            )}
        >
            <div className="min-[24px] w-full flex items-center justify-end h-6">
                {active && (
                    <div className="rounded-full bg-blue-500 flex items-center justify-center p-1 shadow-sm">
                        <Check className="text-white stroke-[4] h-3.5 w-3.5"/>
                    </div>
                )}
            </div>
            <Image 
                src={imageSrc}
                alt={title}
                height={80} 
                width={106.66}
                className="rounded-2xl drop-shadow-md border border-slate-100 object-cover"
            />
            <p className="text-neutral-700 text-center font-bold mt-4 tracking-wide text-sm">
                {title}
            </p>
        </PremiumCard>
    );
};