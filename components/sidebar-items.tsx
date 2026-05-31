"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Props = {
    label: string;
    iconSrc: string;
    href: string;
};

export const SidebarItem = ({
    label,
    iconSrc,
    href
}: Props) => {
    const pathname = usePathname();
    const active = pathname === href;

    return (
        <Button
            variant={active ? "sidebarOutline" : "sidebar"}
            className="justify-start h-[52px] w-full px-4 rounded-2xl font-bold transition-all uppercase tracking-wider text-sm"
            asChild
        >
            <Link href={ href } className="flex items-center w-full">
                <Image 
                    src={iconSrc}
                    alt={label}
                    className="mr-5 shrink-0"
                    height={28}
                    width={28}
                />
                <span className="truncate">{label}</span>
            </Link>
        </Button>
    );
};