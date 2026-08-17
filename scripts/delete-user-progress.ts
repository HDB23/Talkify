/**
 * One-off script to manually remove a deleted user's progress from the DB.
 *
 * Usage:
 *   npx tsx scripts/delete-user-progress.ts <clerkUserId>
 *
 * Example:
 *   npx tsx scripts/delete-user-progress.ts user_abc123xyz
 *
 * You can find the Clerk user ID in:
 *   Clerk Dashboard → Users → (select user) → User ID
 *   (It also appears in the Clerk event logs when the user was deleted.)
 */

import "dotenv/config";
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm";

const userId = process.argv[2];

if (!userId) {
  console.error("❌  Please provide a Clerk user ID as the first argument.");
  console.error(
    "    Usage: npx tsx scripts/delete-user-progress.ts <clerkUserId>"
  );
  process.exit(1);
}

async function main() {
  console.log(`🔍  Looking up userProgress for: ${userId}`);

  const existing = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId),
    columns: { userId: true, userName: true, points: true },
  });

  if (!existing) {
    console.log(
      "ℹ️   No userProgress row found for this user — nothing to delete."
    );
    process.exit(0);
  }

  console.log(
    `⚠️   Found row: userName="${existing.userName}", points=${existing.points}`
  );

  await db.delete(userProgress).where(eq(userProgress.userId, userId));

  console.log(
    `✅  Successfully deleted userProgress for user: ${userId} from the leaderboard.`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌  Error:", err);
    process.exit(1);
  });
