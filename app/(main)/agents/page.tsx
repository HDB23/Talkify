import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { UserProgress } from "@/components/user-progress";
import { Promo } from "@/components/promo";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Flame, Compass, MessageSquare, Mic, ArrowRight } from "lucide-react";
import { CardContainer } from "./card-container";

const AGENT_LIST = [
  {
    id: "coffee-shop",
    title: "Coffee Shop Barista",
    character: "Sarah",
    difficulty: "Easy",
    difficultyColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    mascotSrc: "/woman.svg",
    description: "Order your favorite drink, customize it with milk/sizes, pay the bill, and chat with friendly barista Sarah.",
    themeClass: "from-amber-50 to-orange-50/30 border-amber-200/60 hover:shadow-amber-100/50",
    accentColor: "text-amber-600 border-amber-200",
  },
  {
    id: "airport",
    title: "Airport Customs Control",
    character: "Officer Davis",
    difficulty: "Medium",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-100",
    mascotSrc: "/man.svg",
    description: "Navigate through customs and immigration, answer security questions about your journey, and explain declarations.",
    themeClass: "from-blue-50 to-cyan-50/30 border-blue-200/60 hover:shadow-blue-100/50",
    accentColor: "text-blue-600 border-blue-200",
  },
  {
    id: "doctor",
    title: "Doctor's Appointment",
    character: "Dr. Watson",
    difficulty: "Medium",
    difficultyColor: "text-amber-600 bg-amber-50 border-amber-100",
    mascotSrc: "/boy.svg",
    description: "Explain your illness symptoms, discuss your medical history, schedule follow-ups, and receive care instructions.",
    themeClass: "from-emerald-50 to-teal-50/30 border-emerald-200/60 hover:shadow-emerald-100/50",
    accentColor: "text-emerald-600 border-emerald-200",
  },
  {
    id: "college-presentation",
    title: "College Presentation Jury",
    character: "Professor Reynolds",
    difficulty: "Hard",
    difficultyColor: "text-rose-600 bg-rose-50 border-rose-100",
    mascotSrc: "/robot.svg",
    description: "Defend your final thesis project against tricky questions about research methodology, results, and sources.",
    themeClass: "from-purple-50 to-pink-50/30 border-purple-200/60 hover:shadow-purple-100/50",
    accentColor: "text-purple-600 border-purple-200",
  },
  {
    id: "job-interview",
    title: "Job Interview Practice",
    character: " Sophia (Recruiter)",
    difficulty: "Hard",
    difficultyColor: "text-rose-600 bg-rose-50 border-rose-100",
    mascotSrc: "/girl.svg",
    description: "Practice answering behavioral and technical questions, showcase your background, and answer under pressure.",
    themeClass: "from-indigo-50 to-violet-50/30 border-indigo-200/60 hover:shadow-indigo-100/50",
    accentColor: "text-indigo-600 border-indigo-200",
  },
];

export default async function AgentsPage() {
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <div className="flex flex-row-reverse gap-[48px] px-6">
      {/* SIDEBAR STATUS */}
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          streak={userProgress.streak}
          hasActiveSubscription={isPro}
        />
        {!isPro && <Promo />}
      </StickyWrapper>

      {/* CORE CONTENT */}
      <FeedWrapper>
        <div className="w-full flex flex-col pb-10">
          
          {/* HEADER HERO */}
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white shadow-xl shadow-blue-500/10">
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-10 translate-y-10">
              <Image src="/robot.svg" alt="AI Agent Mascot" width={220} height={220} />
            </div>
            
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold w-fit mb-4 border border-white/20 uppercase tracking-wider">
                <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: "12s" }} />
                English Fluency Simulator
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                Speak with AI Agents
              </h1>
              <p className="text-sm md:text-base text-blue-50 leading-relaxed font-medium">
                Choose a simulated real-world environment, use your voice to reply, and get instant score evaluation on your fluency, grammar, and vocabulary powered by Gemini AI!
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Interactive Scenarios
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Start voice simulations to earn points (+15 XP) and increase your daily learning streak!
            </p>
          </div>

          {/* LIST OF CARDS */}
          <CardContainer items={AGENT_LIST} />

        </div>
      </FeedWrapper>
    </div>
  );
}
