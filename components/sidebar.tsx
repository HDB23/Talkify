import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-items";
import { ClerkLoaded, ClerkLoading, UserButton, UserProfile } from "@clerk/nextjs";
import { Loader } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";
// import { useRouter } from "next/navigation";

type Props = {
  className?: String;
};

export const SideBar = ({ className }: Props) => {

  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r border-slate-200/50 bg-white/90 backdrop-blur-md flex-col z-[40] shadow-[1px_0_10px_rgba(224,236,255,0.2)]",
        className,
      )}
    >
    <Link href="/">
      <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
        <Image src="/mascot.svg" height={45} width={45} alt="Talkify" />
        <h1 className="text-2xl font-black text-[#0059e3] tracking-wide font-sans">
          Talkify
        </h1>
      </div>
    </Link>
    <div className="flex flex-col gap-y-2 flex-1 pt-2">
      <SidebarItem label="learn" href="/learn" iconSrc="/learn.svg"/>
      <SidebarItem label="leaderboard" href="/leaderboard" iconSrc="/leaderboard.svg"/>
      <SidebarItem label="quests" href="/quests" iconSrc="/quests.svg"/>
      <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg"/>
      <SidebarItem label="Chatbot" href="/chatbot" iconSrc="/chatbot.png"/>
    </div>
    <div className="p-4 border-t border-slate-100 flex items-center gap-3">
      <ClerkLoading>
        <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton 
          afterSwitchSessionUrl="/"
          appearance={{
            elements: {
              userButtonAvatarBox: "h-10 w-10 border border-slate-200 shadow-sm"
            }
          }}
        />
        <div className="flex flex-col text-left overflow-hidden">
          <p className="text-xs font-bold text-slate-800 truncate">Account Settings</p>
          <p className="text-[10px] text-slate-400 truncate">Manage your profile</p>
        </div>
      </ClerkLoaded>
    </div>
    </div>
  );
};
