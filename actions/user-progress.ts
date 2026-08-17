"use server";

import { POINTS_TO_REFILL } from "@/constants";
import db from "@/db/drizzle";
import { getCourseById, getUserProgress, getUserSubscription } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


export const upsertUserProgress = async (courseId: number) => {
    const { userId } = await auth();
    const user = await currentUser();

    if(!userId || !user) {
        throw new Error("Unauthorized");
    }

    const course = await getCourseById(courseId);

    if(!course) {
        throw new Error("Course not found");
    }

    if(!course.units.length || !course.units[0].lessons.length){
        throw new Error("Course is empty");
    }

    const existingUserProgress = await getUserProgress();

    if(existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/mascot.svg",
        });

        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/mascot.svg",
    });

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
};

export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscription();

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    });

    if(!challenge) {
        throw new Error("Challenge not found");
    }

    const lessonId = challenge.lessonId;

    const existingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    });

    const isPractice = !!existingChallengeProgress;

    if(isPractice) {
        return { error: "practice" };
    }

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if(userSubscription?.isActive) {
        return { error: "subscription" };
    }

    if(currentUserProgress.hearts === 0) {
        return { error: "hearts" };
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1, 0),
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop")
    revalidatePath("/learn")
    revalidatePath("/quests")
    revalidatePath("/leaderboard")
    revalidatePath(`/lesson/${lessonId}`)
}

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if(currentUserProgress.hearts === 5) {
        throw new Error("Hearts are already full");
    }

    if(currentUserProgress.points < POINTS_TO_REFILL) {
        throw new Error("Not enough points");
    }

    await db.update(userProgress).set({
        hearts: 5,
        points: currentUserProgress.points - POINTS_TO_REFILL,
    }).where(eq(userProgress.userId, currentUserProgress.userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
};

export const resetProgress = async () => {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await getUserProgress();

    if (!currentUserProgress) {
        throw new Error("User progress not found");
    }

    // Reset all stats on userProgress
    await db.update(userProgress).set({
        points: 0,
        hearts: 5,
        streak: 0,
        lastActiveDate: null,
    }).where(eq(userProgress.userId, userId));

    // Delete all challenge progress rows so lessons restart from scratch
    await db.delete(challengeProgress).where(
        eq(challengeProgress.userId, userId)
    );

    revalidatePath("/learn");
    revalidatePath("/leaderboard");
    revalidatePath("/quests");
    revalidatePath("/shop");
    revalidatePath("/courses");
};

export const updateStreakAction = async (localDateStr: string) => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("Unauthorized");
    }

    const currentUserProgress = await getUserProgress();

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

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
        } else if (diffDays === 0) {
            return { streak: currentStreak, lastActiveDate };
        }
    }

    await db.update(userProgress).set({
        streak: newStreak,
        lastActiveDate: localDateStr,
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/shop");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");

    return { streak: newStreak, lastActiveDate: localDateStr };
};