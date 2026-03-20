"use client";

import dynamic from "next/dynamic";

// React Admin must run client-side only
const ReactAdminApp = dynamic(() => import("./app"), {
  ssr: false,
});

export default function AdminClient() {
  return <ReactAdminApp />;
}