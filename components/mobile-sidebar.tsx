import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { SideBar } from "./sidebar"

export const MobileSidebar = () => {
    return (
        <Sheet modal={false}>
            <SheetTrigger>
                <Menu className="text-white"/>
            </SheetTrigger>
            <SheetContent className="p-0 z-[100]" side="left">
                <SideBar />
            </SheetContent>
        </Sheet>
    )
}
