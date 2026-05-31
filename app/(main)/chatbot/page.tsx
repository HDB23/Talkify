import Script from "next/script";
import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { UserProgress } from "@/components/user-progress";

import {
  MessageCircle,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";

import {
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";

import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ChatbotLoader() {
  const userProgressData = getUserProgress();
  const userSubscriptionData =
    getUserSubscription();

  const [userProgress, userSubscription] =
    await Promise.all([
      userProgressData,
      userSubscriptionData,
    ]);

  if (
    !userProgress ||
    !userProgress.activeCourse
  ) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  const chatbotFeatures = [
    {
      icon: MessageCircle,
      title: "Instant Support",
      description:
        "Get immediate answers about Talkify, lessons, subscriptions, and billing.",
    },
    {
      icon: Sparkles,
      title: "AI Assistance",
      description:
        "Powered by AI to provide smarter and faster responses anytime.",
    },
    {
      icon: ShieldCheck,
      title: "Secure Experience",
      description:
        "Your conversations stay safe with modern platform security.",
    },
    {
      icon: Zap,
      title: "Fast Responses",
      description:
        "Quick support without waiting for manual assistance.",
    },
  ];

  return (
    <>
      <div className="flex flex-row-reverse gap-[48px] px-6">

        {/* SIDEBAR */}
        <StickyWrapper>
          <UserProgress
            activeCourse={userProgress.activeCourse}
            hearts={userProgress.hearts}
            points={userProgress.points}
            hasActiveSubscription={isPro}
          />

          {!isPro && <Promo />}
        </StickyWrapper>

        {/* MAIN CONTENT */}
        <FeedWrapper>
          <div className="w-full flex flex-col items-center">

            {/* HEADER */}
            <div className="flex flex-col items-center text-center">

              <div className="relative">
                <div className="absolute inset-0 bg-cyan-200/30 blur-3xl rounded-full" />

                <Image
                  src="/chatbot.png"
                  alt="Talkify Chatbot"
                  height={110}
                  width={110}
                  className="relative z-10"
                />
              </div>

              <h1 className="text-center font-extrabold text-neutral-800 text-3xl my-6">
                Talkify Chatbot
              </h1>

              <p className="text-muted-foreground text-center text-lg mb-6 max-w-2xl leading-relaxed">
                Your Talkify Assistant is
                here. Ask questions about
                subscriptions, lessons, billing,
                account support, and platform
                features instantly.
              </p>

              {/* ONLINE STATUS */}
              <div className="flex items-center gap-2 bg-white border rounded-full px-4 py-2 shadow-sm mb-8">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />

                <span className="text-sm font-medium text-neutral-700">
                  Talkify Assistant
                </span>
              </div>
            </div>

            {/* FEATURES */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">

              {chatbotFeatures.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="
                      border-2
                      rounded-2xl
                      p-5
                      bg-white
                      hover:shadow-md
                      transition-all
                    "
                  >
                    <div className="flex items-start gap-4">

                      <div className="
                        bg-cyan-100
                        rounded-xl
                        p-3
                      ">
                        <Icon className="h-6 w-6 text-cyan-700" />
                      </div>

                      <div>
                        <h3 className="font-bold text-lg text-neutral-800 mb-2">
                          {feature.title}
                        </h3>

                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* HELP SECTION */}
            <div className="w-full border-2 rounded-2xl p-6 bg-white mb-8">

              <h2 className="text-2xl font-bold text-neutral-800 mb-4">
                What can the chatbot help with?
              </h2>

              <Separator className="mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="rounded-xl border bg-neutral-50 p-4 text-neutral-700">
                  • Subscription & billing support
                </div>

                <div className="rounded-xl border bg-neutral-50 p-4 text-neutral-700">
                  • Lesson & course guidance
                </div>

                <div className="rounded-xl border bg-neutral-50 p-4 text-neutral-700">
                  • Login & account issues
                </div>

                <div className="rounded-xl border bg-neutral-50 p-4 text-neutral-700">
                  • General Talkify assistance
                </div>
              </div>
            </div>

            {/* SAFE SPACE FOR CHATBOT */}
            <div className="h-28" />
          </div>
        </FeedWrapper>
      </div>

      {/* CHATBASE SCRIPT */}
      <Script
        id="chatbase-script"
        strategy="afterInteractive"
      >
        {`
          (function(){
            if(!window.chatbase || window.chatbase("getState") !== "initialized") {

              window.chatbase = (...arguments) => {
                if(!window.chatbase.q) {
                  window.chatbase.q = [];
                }

                window.chatbase.q.push(arguments);
              };

              const script = document.createElement("script");

              script.src = "https://www.chatbase.co/embed.min.js";

              script.setAttribute(
                "chatbotId",
                "yC5JLF-9LlYSKVpbAM4lA"
              );

              script.setAttribute(
                "domain",
                "www.chatbase.co"
              );

              document.body.appendChild(script);
            }
          })();
        `}
      </Script>
    </>
  );
}