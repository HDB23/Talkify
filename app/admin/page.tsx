// app/admin/page.tsx
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import AdminClient from "./admin-client";

export default async function AdminPage() {

    const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  return <AdminClient />;
}