"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ChatbotVisibility() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/quiz")) {
      document.body.classList.add("hide-chatbot");
    } else {
      document.body.classList.remove("hide-chatbot");
    }
  }, [pathname]);

  return null;
}