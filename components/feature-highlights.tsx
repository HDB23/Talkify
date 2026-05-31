import React from "react";
import { Heart, Rocket, Ban, Headphones } from "lucide-react";
import { PremiumCard } from "./premium-card";

export const FeatureHighlights = () => {
  const highlights = [
    {
      title: "Unlimited Hearts",
      description: "Learn without limits and keep growing.",
      icon: Heart,
      iconColor: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      title: "Faster Progress",
      description: "Level up quickly and achieve more.",
      icon: Rocket,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "No Ads",
      description: "Enjoy a clean and distraction-free experience.",
      icon: Ban,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Premium Support",
      description: "Get priority support whenever you need it.",
      icon: Headphones,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-12 items-stretch justify-items-stretch mb-10">
      {highlights.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <PremiumCard 
            key={index} 
            className="p-5 flex flex-row items-center gap-x-4 w-full h-full min-h-[90px] border border-slate-200/50 shadow-sm rounded-3xl"
          >
            <div className={`p-3.5 rounded-2xl ${item.bgColor} shrink-0 shadow-sm flex items-center justify-center`}>
              <IconComponent className={`h-6 w-6 ${item.iconColor}`} />
            </div>
            <div className="flex flex-col text-left min-w-0 flex-1 justify-center">
              <h4 
                className="font-extrabold text-neutral-800 text-xs sm:text-sm tracking-wider uppercase leading-snug whitespace-normal"
                style={{ wordBreak: "normal", overflowWrap: "break-word" }}
              >
                {item.title}
              </h4>
              <p 
                className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-normal font-semibold whitespace-normal"
                style={{ wordBreak: "normal", overflowWrap: "break-word" }}
              >
                {item.description}
              </p>
            </div>
          </PremiumCard>
        );
      })}
    </div>
  );
};
