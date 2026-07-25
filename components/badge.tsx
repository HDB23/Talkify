"use client";

import { cn } from "@/lib/utils";
import { Lock, Shield, Star, Award, Gem, Crown } from "lucide-react";
import { motion } from "framer-motion";

export type BadgeType = "bronze" | "silver" | "gold" | "platinum" | "diamond";

type Props = {
  type: BadgeType;
  size?: "sm" | "md" | "lg" | "xl";
  locked?: boolean;
  interactive?: boolean;
};

const badgeConfigs = {
  bronze: {
    title: "Bronze Badge",
    xp: 20,
    icon: Award,
    colorClasses: "from-amber-700 via-amber-600 to-amber-800 border-amber-500 shadow-amber-900/30",
    bgClass: "bg-gradient-to-br from-amber-900/20 to-amber-700/10",
    textClass: "text-amber-600",
    glowClass: "group-hover:shadow-[0_0_20px_rgba(217,119,6,0.4)]",
    description: "Earn 20 XP to unlock this bronze token of progress.",
    emoji: "🥉"
  },
  silver: {
    title: "Silver Badge",
    xp: 50,
    icon: Shield,
    colorClasses: "from-slate-400 via-slate-300 to-slate-500 border-slate-300 shadow-slate-400/20",
    bgClass: "bg-gradient-to-br from-slate-600/15 to-slate-400/10",
    textClass: "text-slate-500",
    glowClass: "group-hover:shadow-[0_0_20px_rgba(148,163,184,0.4)]",
    description: "Earn 50 XP to unlock this silver mark of dedication.",
    emoji: "🥈"
  },
  gold: {
    title: "Gold Badge",
    xp: 100,
    icon: Star,
    colorClasses: "from-yellow-500 via-amber-400 to-yellow-600 border-yellow-300 shadow-yellow-500/30",
    bgClass: "bg-gradient-to-br from-yellow-500/20 to-amber-500/15",
    textClass: "text-yellow-600",
    glowClass: "group-hover:shadow-[0_0_25px_rgba(234,179,8,0.5)]",
    description: "Earn 100 XP to unlock this brilliant gold achievement.",
    emoji: "🥇"
  },
  platinum: {
    title: "Platinum Badge",
    xp: 500,
    icon: Gem,
    colorClasses: "from-cyan-400 via-teal-400 to-blue-500 border-cyan-200 shadow-cyan-500/30",
    bgClass: "bg-gradient-to-br from-cyan-500/20 to-blue-500/15",
    textClass: "text-cyan-500",
    glowClass: "group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]",
    description: "Earn 500 XP to unlock this rare, crystal-cut platinum gem.",
    emoji: "💎"
  },
  diamond: {
    title: "Diamond Badge",
    xp: 1000,
    icon: Crown,
    colorClasses: "from-indigo-500 via-purple-500 to-pink-500 border-purple-300 shadow-purple-500/40",
    bgClass: "bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-pink-500/15",
    textClass: "text-purple-600",
    glowClass: "group-hover:shadow-[0_0_35px_rgba(168,85,247,0.7)]",
    description: "Earn 1000 XP to stand among legends with the Diamond Crown.",
    emoji: "👑"
  }
};

export const Badge = ({
  type,
  size = "md",
  locked = false,
  interactive = true,
}: Props) => {
  const config = badgeConfigs[type];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-16 w-16 border-2",
    md: "h-24 w-24 border-3",
    lg: "h-36 w-36 border-4",
    xl: "h-48 w-48 border-4"
  };

  const iconSizes = {
    sm: "h-7 w-7",
    md: "h-11 w-11",
    lg: "h-16 w-16",
    xl: "h-22 w-22"
  };

  const badgeContent = (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center border shadow-lg transition-all duration-500 group",
        sizeClasses[size],
        locked 
          ? "bg-slate-100/70 border-slate-300 shadow-slate-300/10 grayscale opacity-45"
          : cn("bg-gradient-to-b", config.colorClasses, config.glowClass)
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Background radial glow */}
      {!locked && (
        <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      )}

      {/* Shine effect */}
      {!locked && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="absolute w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-25 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
        </div>
      )}

      {/* Badge Icon */}
      <div 
        className={cn(
          "z-10 transition-transform duration-500 group-hover:scale-110",
          locked ? "text-slate-400" : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
        )}
      >
        <Icon className={iconSizes[size]} />
      </div>

      {/* Inner circular border */}
      <div className={cn(
        "absolute inset-1.5 rounded-full border border-dashed pointer-events-none opacity-40",
        locked ? "border-slate-400" : "border-white"
      )} />

      {/* Lock Overlay */}
      {locked && (
        <div className="absolute z-20 bottom-0 right-0 bg-slate-500 border border-white text-white p-1 rounded-full shadow-md scale-90">
          <Lock className="h-3 w-3" />
        </div>
      )}
    </div>
  );

  if (!interactive || locked) {
    return badgeContent;
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.08,
        rotateY: 15,
        rotateX: -10,
        z: 50
      }}
      whileTap={{ scale: 0.95 }}
      style={{ perspective: 1000 }}
      className="cursor-pointer"
    >
      {badgeContent}
    </motion.div>
  );
};

export { badgeConfigs };
