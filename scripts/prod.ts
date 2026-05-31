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
        // Unit 1 (Chapter 1) Lessons
        { unitId: unit1Id, order: 1, title: "Nouns" },
        { unitId: unit1Id, order: 2, title: "Verbs" },
        { unitId: unit1Id, order: 3, title: "Adjectives" },
        { unitId: unit1Id, order: 4, title: "Phrases" },
        { unitId: unit1Id, order: 5, title: "Sentences" },
        // Unit 2 (Chapter 2) Lessons
        { unitId: unit2Id, order: 1, title: "Adverbs" },
        { unitId: unit2Id, order: 2, title: "Prepositions" },
        { unitId: unit2Id, order: 3, title: "Pronouns" },
        { unitId: unit2Id, order: 4, title: "Conjunctions" },
      ])
      .returning();

    const lesson1Id = insertedLessons[0].id;
    const lesson2Id = insertedLessons[1].id;
    const lesson6Id = insertedLessons[5].id; // Adverbs
    const lesson7Id = insertedLessons[6].id; // Prepositions

    // ------------------ CHALLENGES ------------------
    const insertedChallenges = await db
      .insert(schema.challenges)
      .values([
        // Unit 1 - Lesson 1 (Nouns)
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
        // Unit 1 - Lesson 2 (Verbs)
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
        // Unit 2 (Chapter 2) - Lesson 1 (Adverbs)
        {
          lessonId: lesson6Id,
          type: "SELECT",
          question: 'Which of these is "Fast"?',
          order: 9,
        },
        {
          lessonId: lesson6Id,
          type: "ASSIST",
          question: "Slowly",
          order: 10,
        },
        // Unit 2 (Chapter 2) - Lesson 2 (Prepositions)
        {
          lessonId: lesson7Id,
          type: "SELECT",
          question: 'Which of these is "On the table"?',
          order: 11,
        },
        {
          lessonId: lesson7Id,
          type: "ASSIST",
          question: "Under the box",
          order: 12,
        },
      ])
      .returning();

    // ------------------ CHALLENGE OPTIONS ------------------
    for (let i = 0; i < insertedChallenges.length; i++) {
      const challengeId = insertedChallenges[i].id;

      const optionsMap = [
        // 1
        [
          { imageSrc: "/man.svg", correct: true, text: "A man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "A woman", audioSrc: "/uk_woman.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        // 2
        [
          { imageSrc: "/man.svg", correct: false, text: "A man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: true, text: "A woman", audioSrc: "/uk_woman.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        // 3
        [
          { imageSrc: "/girl.svg", correct: false, text: "A Girl", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/boy.svg", correct: true, text: "A Boy", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        // 4
        [
          { imageSrc: "/man.svg", correct: true, text: "A Man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "A Woman", audioSrc: "/uk_woman.mp3" },
          { imageSrc: "/robot.svg", correct: false, text: "A Robot", audioSrc: "/uk_robot.mp3" },
        ],
        // 5
        [
          { imageSrc: "/man.svg", correct: false, text: "A Man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/zombie.svg", correct: true, text: "A Zombie", audioSrc: "/uk_zombie.mp3" },
          { imageSrc: "/man.svg", correct: false, text: "A Girl", audioSrc: "/uk_girl.mp3" },
        ],
        // 6
        [
          { imageSrc: "/man.svg", correct: false, text: "A Man", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/robot.svg", correct: true, text: "A Robot", audioSrc: "/uk_robot.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "A Woman", audioSrc: "/uk_woman.mp3" },
        ],
        // 7
        [
          { imageSrc: "/boy.svg", correct: false, text: "A Boy", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/girl.svg", correct: true, text: "A Girl", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/zombie.svg", correct: false, text: "A Zombie", audioSrc: "/uk_zombie.mp3" },
        ],
        // 8
        [
          { imageSrc: "/boy.svg", correct: false, text: "A Boy", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/girl.svg", correct: false, text: "A Girl", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/zombie.svg", correct: true, text: "A Zombie", audioSrc: "/uk_zombie.mp3" },
        ],
        // 9 (Unit 2, Adverbs SELECT Fast)
        [
          { imageSrc: "/robot.svg", correct: true, text: "Fast", audioSrc: "/uk_robot.mp3" },
          { imageSrc: "/man.svg", correct: false, text: "Slow", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/woman.svg", correct: false, text: "Quiet", audioSrc: "/uk_woman.mp3" },
        ],
        // 10 (Unit 2, Adverbs ASSIST Slowly)
        [
          { imageSrc: "/man.svg", correct: true, text: "Slowly", audioSrc: "/uk_man.mp3" },
          { imageSrc: "/zombie.svg", correct: false, text: "Quickly", audioSrc: "/uk_zombie.mp3" },
          { imageSrc: "/boy.svg", correct: false, text: "Loudly", audioSrc: "/uk_boy.mp3" },
        ],
        // 11 (Unit 2, Prepositions SELECT On the table)
        [
          { imageSrc: "/robot.svg", correct: true, text: "On the table", audioSrc: "/uk_robot.mp3" },
          { imageSrc: "/girl.svg", correct: false, text: "In the box", audioSrc: "/uk_girl.mp3" },
          { imageSrc: "/boy.svg", correct: false, text: "Under the chair", audioSrc: "/uk_boy.mp3" },
        ],
        // 12 (Unit 2, Prepositions ASSIST Under the box)
        [
          { imageSrc: "/boy.svg", correct: true, text: "Under the box", audioSrc: "/uk_boy.mp3" },
          { imageSrc: "/zombie.svg", correct: false, text: "Above the clouds", audioSrc: "/uk_zombie.mp3" },
          { imageSrc: "/man.svg", correct: false, text: "Behind the door", audioSrc: "/uk_man.mp3" },
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