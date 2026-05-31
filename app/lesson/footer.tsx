import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);

  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer
      className={cn(
        "lg:h-[140px] h-[110px] border-t-2",
        status === "correct" &&
          "border-transparent bg-blue-100",
        status === "wrong" &&
          "border-transparent bg-rose-100"
      )}
    >
      <div
        className={cn(
          "max-w-[1140px]",
          "h-full",
          "mx-auto",
          "flex",
          "items-center",
          "gap-4",
          "flex-wrap",
          "px-6",
          "lg:px-10",

          // SAFE SPACE FOR CHATBOT
          "pr-24 lg:pr-32"
        )}
      >
        {/* STATUS MESSAGE */}
        {status === "correct" && (
          <div className="text-blue-500 font-bold text-base lg:text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Nicely done!
          </div>
        )}

        {status === "wrong" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Better luck next time...
          </div>
        )}

        {/* PRACTICE AGAIN BUTTON */}
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "lg"}
            className="mt-5"
            onClick={() =>
              (window.location.href = `/lesson/${lessonId}`)
            }
          >
            Practice again
          </Button>
        )}

        {/* MAIN ACTION BUTTON */}
        <Button
          disabled={disabled}
          onClick={onCheck}
          className=""
          size={isMobile ? "sm" : "lg"}
          variant={
            status === "wrong"
              ? "danger"
              : "primary"
          }
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Next"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};