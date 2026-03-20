import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
  try {
    console.log("Seeding database ⚠️");

    // Delete in correct dependency order
    await db.delete(schema.challengeProgress);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challenges);
    await db.delete(schema.lessons);
    await db.delete(schema.units);
    await db.delete(schema.userProgress);
    await db.delete(schema.userSubscription);
    await db.delete(schema.courses);

    // ------------------ COURSES ------------------
    const insertedCourses = await db
      .insert(schema.courses)
      .values([
        { title: "English", imageSrc: "/uk.svg" },
        { title: "Hindi", imageSrc: "/hi.svg" },
        { title: "Marathi", imageSrc: "/hi.svg" },
        { title: "Gujarati", imageSrc: "/hi.svg" },
      ])
      .returning();

    const englishCourseId = insertedCourses[0].id;

    // ------------------ UNITS ------------------
    const insertedUnits = await db
      .insert(schema.units)
      .values([
        {
          courseId: englishCourseId,
          title: "Unit 1",
          description: "Learn the basics of English",
          order: 1,
        },
        {
          courseId: englishCourseId,
          title: "Unit 2",
          description: "Learn the intermediate English",
          order: 2,
        },
      ])
      .returning();

    const unit1Id = insertedUnits[0].id;
    const unit2Id = insertedUnits[1].id;

    // ------------------ LESSONS ------------------
    const insertedLessons = await db
      .insert(schema.lessons)
      .values([
        { unitId: unit1Id, order: 1, title: "Nouns" },
        { unitId: unit1Id, order: 2, title: "Verbs" },
        { unitId: unit1Id, order: 3, title: "Adjectives" },
        { unitId: unit1Id, order: 4, title: "Phrases" },
        { unitId: unit1Id, order: 5, title: "Sentences" },
      ])
      .returning();

    const lesson1Id = insertedLessons[0].id;
    const lesson2Id = insertedLessons[1].id;

    // ------------------ CHALLENGES ------------------
    const insertedChallenges = await db
      .insert(schema.challenges)
      .values([
        {
          lessonId: lesson1Id,
          type: "SELECT",
          order: 1,
          question: 'Which one of these is the "The man" ?',
        },
        {
          lessonId: lesson1Id,
          type: "SELECT",
          order: 2,
          question: 'Which one of these is "The woman"?',
        },
        {
          lessonId: lesson1Id,
          type: "SELECT",
          order: 3,
          question: 'Which one of these is "The boy"?',
        },
        {
          lessonId: lesson1Id,
          type: "ASSIST",
          question: "A man",
          order: 4,
        },
        {
          lessonId: lesson2Id,
          type: "SELECT",
          question: 'Which of these is "A zombie"?',
          order: 5,
        },
        {
          lessonId: lesson2Id,
          type: "SELECT",
          question: 'Which of these is "A robot"?',
          order: 6,
        },
        {
          lessonId: lesson2Id,
          type: "SELECT",
          question: 'Which of these is "A girl"?',
          order: 7,
        },
        {
          lessonId: lesson2Id,
          type: "SELECT",
          question: "A Zombie",
          order: 8,
        },
      ])
      .returning();

    // ------------------ CHALLENGE OPTIONS ------------------
    for (let i = 0; i < insertedChallenges.length; i++) {
      const challengeId = insertedChallenges[i].id;

      const optionsMap = [
        [
          { imageSrc: "/man.svg", correct: true, text: "A man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "A woman", audioSrc: "/uk_woman.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        [
          { imageSrc: "/man.svg", correct: false, text: "A man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: true, text: "A woman", audioSrc: "/uk_woman.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        [
          { imageSrc: "/girl.svg", correct: false, text: "A Girl", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/boy.svg", correct: true, text: "A Boy", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        [
          { imageSrc: "/man.svg", correct: true, text: "A Man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "A Woman", audioSrc: "/uk_woman.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        [
          { imageSrc: "/man.svg", correct: false, text: "A Man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/zombie.svg", correct: true, text: "A Zombie", audioSrc: "/uk_zombie.mp3" },
          { imageSrc: "/man.svg", correct: false, text: "A Girl", audioSrc: "/uk_girl.mp3" },
        ],
        [
          { imageSrc: "/man.svg", correct: false, text: "A Man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/robot.svg", correct: true, text: "A Robot", audioSrc: "/uk_robot.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "A Woman", audioSrc: "/uk_woman.mp3" },
        ],
        [
          { imageSrc: "/boy.svg", correct: false, text: "A Boy", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/girl.svg", correct: true, text: "A Girl", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/zombie.svg", correct: false, text: "A Zombie", audioSrc: "/uk_zombie.mp3" },
        ],
        [
          { imageSrc: "/boy.svg", correct: false, text: "A Boy", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/girl.svg", correct: false, text: "A Girl", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/zombie.svg", correct: true, text: "A Zombie", audioSrc: "/uk_zombie.mp3" },
        ],
      ];

      await db.insert(schema.challengeOptions).values(
        optionsMap[i].map((option) => ({
          challengeId,
          ...option,
        }))
      );
    }

    console.log("Seeding finished ✅");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the database");
  }
};

main();