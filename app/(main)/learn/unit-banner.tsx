import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotebookText } from "lucide-react";
import Link from "next/link";

type Props = {
  title: string;
  description: string;
  active?: boolean;
};

export const UnitBanner = ({ title, description, active }: Props) => {
  return (
    <div
      className={cn(
        "transition-all duration-500 ease-in-out rounded-2xl pr-1.5 pb-1.5",
        active
          ? "bg-[#0047b3] text-white shadow-xl"
          : "bg-white text-neutral-800 border border-slate-200/50",
      )}
    >
      <div className="w-full rounded-2xl bg-gradient-to-r from-[#1a85ff] to-[#0059e3] p-6 text-white flex items-center justify-between shadow-[0_4px_14px_rgba(0,89,227,0.15)]">
        <div className="space-y-2.5 flex items-center justify-between w-full">
          <div>
            <h3 className="text-2xl font-black tracking-wide font-sans">{title}</h3>
            <p className="text-base font-semibold opacity-90 mt-1">{description}</p>
          </div>
          <div>
            <Link href="/lesson">
              <Button
                size="lg"
                variant="primaryOutline"
                className="hidden xl:flex border-0 bg-white text-[#0059e3] hover:bg-[#eaf3ff] shadow-sm font-bold uppercase tracking-wider rounded-xl py-5"
              >
                <NotebookText className="mr-2 h-4 w-4" />
                Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
