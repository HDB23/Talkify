import { MobileHeader } from "@/components/mobile-header";
import { SideBar } from "@/components/sidebar";
import { AppBackground } from "@/components/app-background";

type Props = {
    children: React.ReactNode;
};

const MainLayout = ({
    children
}: Props) => {
    return(
        <AppBackground>
            <MobileHeader />
            <SideBar className="hidden lg:flex"/>
            <main className="lg:pl-[256px] min-h-screen pt-[50px] lg:pt-0">
                <div className="max-w-[1056px] mx-auto pt-6 px-4 md:px-6 h-full">
                    { children }
                </div>
            </main>
        </AppBackground>
    );
};

export default MainLayout;