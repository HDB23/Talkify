"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ChatbotVisibility() {
  const pathname = usePathname();

  useEffect(() => {
    // Only show chatbot on the /chatbot page
    if (pathname === "/chatbot") {
      document.body.classList.remove("hide-chatbot");
    } else {
      document.body.classList.add("hide-chatbot");
    }
  }, [pathname]);

  return null;
}