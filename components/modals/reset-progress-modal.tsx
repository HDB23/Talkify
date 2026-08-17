"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useResetProgressModal } from "@/store/use-reset-progress-modal";
import { resetProgress } from "@/actions/user-progress";

export const ResetProgressModal = () => {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { isOpen, close } = useResetProgressModal();

    useEffect(() => setIsClient(true), []);

    if (!isClient) return null;

    const onConfirm = () => {
        startTransition(async () => {
            try {
                await resetProgress();
                toast.success("Progress reset! Starting fresh 🔄");
                close();
                router.refresh();
            } catch {
                toast.error("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={close}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    {/* Warning icon */}
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-200 blur-2xl rounded-full opacity-60" />
                            <div className="relative bg-red-100 border-2 border-red-300 rounded-full p-4">
                                <AlertTriangle className="h-10 w-10 text-red-500" />
                            </div>
                        </div>
                    </div>

                    <DialogTitle className="text-center font-extrabold text-2xl text-neutral-800">
                        Reset All Progress?
                    </DialogTitle>

                    <DialogDescription asChild>
                        <div className="text-center space-y-3 mt-2">
                            <p className="text-base text-muted-foreground">
                                This will permanently erase all your XP, streak, hearts, and lesson progress.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mt-3">
                                <p className="text-sm font-semibold text-red-600 flex items-center justify-center gap-2">
                                    <AlertTriangle className="h-4 w-4 shrink-0" />
                                    This action cannot be undone.
                                </p>
                                <p className="text-xs text-red-500 mt-1">
                                    All progress will be reset and removed from the leaderboard.
                                </p>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="mt-4">
                    <div className="flex flex-col gap-y-3 w-full">
                        {/* Cancel — primary action (safe) */}
                        <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={close}
                            disabled={isPending}
                        >
                            Keep my progress
                        </Button>

                        {/* Confirm reset — destructive */}
                        <Button
                            variant="danger"
                            className="w-full gap-2"
                            size="lg"
                            onClick={onConfirm}
                            disabled={isPending}
                        >
                            <RotateCcw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
                            {isPending ? "Resetting…" : "Yes, reset everything"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
