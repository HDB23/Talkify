"use server";

import db from "@/db/drizzle";
import { getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("unauthorized");
    }

    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();


    if(!currentUserProgress) {
        throw new Error("User progress non found");
    }

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    })

    if(!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress  = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractice = !!existingChallengeProgress;

    if(currentUserProgress.hearts === 0 && !isPractice && !userSubscription?.isActive) {
        return {error: "hearts"};
    }

    // Calculate streak updates
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const localDateStr = `${yyyy}-${mm}-${dd}`;

    const currentStreak = currentUserProgress.streak ?? 0;
    const lastActiveDate = currentUserProgress.lastActiveDate;
    let newStreak = currentStreak;

    if (!lastActiveDate) {
        newStreak = 1;
    } else {
        const last = new Date(lastActiveDate);
        const curr = new Date(localDateStr);
        
        const lastUtc = Date.UTC(last.getFullYear(), last.getMonth(), last.getDate());
        const currUtc = Date.UTC(curr.getFullYear(), curr.getMonth(), curr.getDate());
        
        const diffTime = currUtc - lastUtc;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak = currentStreak + 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        }
    }

    if(isPractice) {
        await db.update(challengeProgress).set({
            completed: true,
        })
        .where(
            eq(challengeProgress.id, existingChallengeProgress.id)
        );

        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 5),
            streak: newStreak,
            lastActiveDate: localDateStr,
        }).where(eq(userProgress.userId, userId));

        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonId}`);
        return;
    }

    await db.insert(challengeProgress).values({
        challengeId, 
        userId,
        completed: true,
    });

    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
        streak: newStreak,
        lastActiveDate: localDateStr,
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonId}`);
};