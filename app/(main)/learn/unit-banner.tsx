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
        "transition-all duration-500 ease-in-out rounded-xl pr-1.5 pb-1.5",
        active
          ? "bg-green-600 text-white shadow-xl"
          : "bg-white text-neutral-800",
      )}
    >
      <div className="w-full rounded-xl bg-green-500 p-5 text-white flex items-center justify-between">
        <div className="space-y-2.5 flex items-center justify-between w-full">
          <div>
            <h3 className="text-2xl font-bold">{title}</h3>
            <p className="text-lg">{description}</p>
          </div>
          <div>
            <Link href="/lesson">
              <Button
                size="lg"
                variant="secondary"
                className="hidden xl:flex border-2 border-b-4 active:border-b-2"
              >
                <NotebookText className="mr-2" />
                Continue
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
