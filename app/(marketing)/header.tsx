import { Button } from "@/components/ui/button";
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Ghost, Loader } from "lucide-react";
import Image from "next/image";

export const Header = () => {
    return (
        <header className="h-24 w-full border-b-2 border-slate-200 px-4">
            <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full">
                <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
                    <Image src="/mascot.svg" height={45} width={45} alt="Talkify"/>
                    <h1 className="text-2xl font-black text-[#0059e3] tracking-wide font-sans">
                        Talkify
                    </h1>
                </div>
                <ClerkLoading>
                    <Loader className="h-5 w-5 text-muted-foreground animate-spin"/>
                </ClerkLoading>
                <ClerkLoaded>
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                        />
                    </SignedIn>
                    <SignedOut>
                        <SignInButton
                            mode="modal"
                            forceRedirectUrl="/learn"
                            fallbackRedirectUrl="/learn"
                        >
                            <Button size="sm" variant="primaryOutline" className="px-5 font-extrabold text-xs h-9 uppercase tracking-wider rounded-xl shadow-sm">
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>
                </ClerkLoaded>
            </div>
        </header>
    );
};