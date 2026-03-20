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
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className,
      )}
    >
    <Link href="/">
      <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
        <Image src="/mascot.svg" height={60} width={60} alt="Talkify" />
        <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
          Talkify
        </h1>
      </div>
    </Link>
    <div className="flex flex-col gap-y-2 flex-1">
      <SidebarItem label="learn" href="/learn" iconSrc="/learn.svg"/>
      <SidebarItem label="leaderboard" href="/leaderboard" iconSrc="/leaderboard.svg"/>
      <SidebarItem label="quests" href="/quests" iconSrc="/quests.svg"/>
      <SidebarItem label="shop" href="/shop" iconSrc="/shop.svg"/>
      <SidebarItem label="certificate" href="/certificate" iconSrc="/certificate.svg"/>
    </div>
    <div className="p-4">
      <ClerkLoading>
        <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
      </ClerkLoading>
      <ClerkLoaded>
        <UserButton afterSwitchSessionUrl="/"/>
      </ClerkLoaded>
    </div>
    </div>
  );
};
