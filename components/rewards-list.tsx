"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge, BadgeType, badgeConfigs } from "./badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Award, CheckCircle2, Lock, Sparkles, Volume2 } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

type Props = {
  points: number;
};

export const RewardsList = ({ points }: Props) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const { width, height } = useWindowSize();

  const badges: BadgeType[] = ["bronze", "silver", "gold", "platinum", "diamond"];

  const handleBadgeClick = (type: BadgeType) => {
    const config = badgeConfigs[type];
    const isUnlocked = points >= config.xp;

    if (isUnlocked) {
      setSelectedBadge(type);
      setShowCelebrate(true);
      
      // Play a quick celebration audio sound if available
      try {
        const audio = new Audio("/correct.mp3");
        audio.volume = 0.5;
        audio.play();
      } catch (e) {
        console.log("Audio play error", e);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-6">
      {/* Celebration Confetti Overlay when viewing unlocked badge detail */}
      {showCelebrate && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={200}
          gravity={0.15}
          style={{ position: "fixed", zIndex: 100000, pointerEvents: "none" }}
        />
      )}

      {/* Badges Stack */}
      <div className="flex flex-col gap-y-4 w-full">
        {badges.map((type) => {
          const config = badgeConfigs[type];
          const isUnlocked = points >= config.xp;
          const progress = Math.min((points / config.xp) * 100, 100);

          return (
            <div
              key={type}
              onClick={() => handleBadgeClick(type)}
              className={`p-5 rounded-3xl border-2 flex items-center gap-x-5 transition-all duration-300 group relative overflow-hidden bg-white ${
                isUnlocked
                  ? "border-slate-200 hover:border-[#0059e3] hover:shadow-[0_8px_30px_rgb(0,89,227,0.06)] cursor-pointer"
                  : "border-slate-100 opacity-90"
              }`}
            >
              {/* Premium Background Accent for Unlocked Cards */}
              {isUnlocked && (
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${config.colorClasses}`} />
              )}

              {/* Badge Visual */}
              <div className="shrink-0 flex items-center justify-center">
                <Badge type={type} size="md" locked={!isUnlocked} interactive={isUnlocked} />
              </div>

              {/* Badge Details */}
              <div className="flex flex-col flex-1 min-w-0 gap-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 w-full">
                  <h3 className={`font-extrabold text-lg tracking-wide whitespace-normal ${isUnlocked ? "text-slate-800" : "text-slate-400"}`}>
                    {config.title}
                  </h3>
                  <div className="shrink-0 flex items-center">
                    {isUnlocked ? (
                      <span className="inline-flex items-center text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Unlocked
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-200/50">
                        <Lock className="h-3 w-3 mr-1" /> Locked
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed whitespace-normal break-words">
                  {config.description}
                </p>

                {/* Progress Bar towards Unlock */}
                <div className="flex flex-col gap-y-1.5 mt-1 w-full">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 w-full">
                    <span>Progress</span>
                    <span className="tabular-nums shrink-0 whitespace-nowrap">{Math.min(points, config.xp)} / {config.xp} XP</span>
                  </div>
                  <Progress value={progress} className="h-2.5 w-full" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Celebration Modal Dialog */}
      {selectedBadge && (
        <Dialog open={showCelebrate} onOpenChange={(open) => {
          setShowCelebrate(open);
          if (!open) setSelectedBadge(null);
        }}>
          <DialogContent className="sm:max-w-md rounded-3xl p-6 border-slate-200">
            <DialogHeader className="flex flex-col items-center justify-center text-center">
              <div className="relative my-6 flex items-center justify-center">
                {/* Radial Glow */}
                <div className={`absolute inset-0 blur-3xl opacity-50 rounded-full bg-gradient-to-br ${badgeConfigs[selectedBadge].colorClasses}`} style={{ transform: "scale(1.5)" }} />
                
                {/* Animated Badge */}
                <div className="relative animate-bounce">
                  <Badge type={selectedBadge} size="lg" locked={false} interactive={false} />
                </div>
                
                {/* Sparkles */}
                <Sparkles className="absolute -top-4 -right-4 h-8 w-8 text-yellow-400 animate-pulse" />
                <Award className="absolute -bottom-4 -left-4 h-8 w-8 text-purple-400 animate-pulse" />
              </div>

              <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-x-2">
                Congratulations! 🎉
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-500 font-medium max-w-sm mt-2">
                You have unlocked the prestigious <span className="font-extrabold text-[#0059e3]">{badgeConfigs[selectedBadge].title}</span> by earning over <span className="font-bold">{badgeConfigs[selectedBadge].xp} XP</span>!
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-y-3 mt-4 items-center">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 w-full text-center">
                <span className="text-sm font-semibold text-slate-500 block uppercase tracking-wider text-[10px]">Badge Status</span>
                <span className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-x-2 mt-1">
                  {badgeConfigs[selectedBadge].emoji} CLAIMED
                </span>
              </div>
              
              <Button 
                onClick={() => {
                  setShowCelebrate(false);
                  setSelectedBadge(null);
                }}
                className="w-full rounded-2xl h-12 font-bold bg-[#0059e3] hover:bg-[#0059e3]/90 border-b-4 border-b-blue-800 active:border-b-0"
              >
                Awesome!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
