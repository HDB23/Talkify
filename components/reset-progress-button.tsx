"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResetProgressModal } from "@/store/use-reset-progress-modal";

export const ResetProgressButton = () => {
    const { open } = useResetProgressModal();

    return (
        <Button
            id="reset-progress-btn"
            variant="dangerOutline"
            size="sm"
            className="w-full gap-2 mt-2"
            onClick={open}
        >
            <RotateCcw className="h-4 w-4" />
            Reset Progress
        </Button>
    );
};
