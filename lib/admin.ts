// lib/admin.ts
import { auth } from "@clerk/nextjs/server";

const adminIds = new Set([
  process.env.ADMIN_ID_1,
]);

export const isAdmin = async () =>  {
  const { userId } = await auth();

    if (!userId) {
        return false;
    }

  return adminIds.has(userId);
}