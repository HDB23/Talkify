"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function QuizRefreshFix() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/quiz")) {

      // REMOVE IFRAMES
      document
        .querySelectorAll('iframe')
        .forEach((el) => {
          if (
            el.src.includes("chatbase") ||
            el.src.includes("embed")
          ) {
            el.remove();
          }
        });

      // REMOVE CHATBASE DIVS
      document
        .querySelectorAll('[id*="chatbase"]')
        .forEach((el) => el.remove());

      document
        .querySelectorAll('[class*="chatbase"]')
        .forEach((el) => el.remove());

      // REMOVE SCRIPTS
      document
        .querySelectorAll('script[src*="chatbase"]')
        .forEach((el) => el.remove());

      // DESTROY GLOBAL
      // @ts-ignore
      window.chatbase = undefined;

      // OPTIONAL:
      document.body.style.overflow = "auto";
    }
  }, [pathname]);

  return null;
}