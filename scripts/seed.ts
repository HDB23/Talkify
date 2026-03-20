import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database ⚠️");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.userSubscription);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "English",
                imageSrc: "/uk.svg",
            },
            {
                id: 2,
                title: "Hindi",
                imageSrc: "/hi.svg",
            },
            {
                id: 3,
                title: "Marathi",
                imageSrc: "/hi.svg",
            },
            {
                id: 4,
                title: "Gujarati",
                imageSrc: "/hi.svg",
            },
        ]);

        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1,
                title: "Unit 1",
                description: "Learn the basics of English",
                order: 1,
            }
        ]);
        await db.insert(schema.units).values([
            {
                id: 2,
                courseId: 1,
                title: "Unit 2",
                description: "Learn the intermediate English",
                order: 2,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1,
                order: 1,
                title: "Nouns",
            },
            {
                id: 2,
                unitId: 1,
                order: 2,
                title: "Verbs",
            },
            {
                id: 3,
                unitId: 1,
                order: 3,
                title: "Verbs",
            },
            {
                id: 4,
                unitId: 1,
                order: 4,
                title: "Verbs",
            },
            {
                id: 5,
                unitId: 1,
                order: 5,
                title: "Verbs",
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonId: 1,
                type: "SELECT",
                order: 1,
                question: 'Which one of these is the "The man" ?',
            },
            {
                id: 2,
                lessonId: 1,
                type: "ASSIST",
                order: 2,
                question: '"The man" ?',
            },
            {
                id: 3,
                lessonId: 1,
                type: "SELECT",
                order: 3,
                question: 'Which one of these is the "The robot" ?',
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1,
                imageSrc: "/man.svg",
                correct: true,
                text: "A man",
                audioSrc: "/uk_man.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/woman.svg",
                correct: false,
                text: "A woman",
                audioSrc: "/uk_woman.mp3",
            },
            {
                challengeId: 1,
                imageSrc: "/robot.svg",
                correct: false,
                text: "A Robot",
                audioSrc: "/uk_robot.mp3",
            },
        ])
        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2,
                correct: true,
                text: "A man",
                audioSrc: "/uk_man.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "A woman",
                audioSrc: "/uk_woman.mp3",
            },
            {
                challengeId: 2,
                correct: false,
                text: "A Robot",
                audioSrc: "/uk_robot.mp3",
            },
        ])
        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3,
                imageSrc: "/man.svg",
                correct: false,
                text: "A man",
                audioSrc: "/uk_man.mp3",
            },
            {
                challengeId: 3,
                imageSrc: "/woman.svg",
                correct: false,
                text: "A woman",
                audioSrc: "/uk_woman.mp3",
            },
            {
                challengeId: 3,
                imageSrc: "/robot.svg",
                correct: true,
                text: "A Robot",
                audioSrc: "/uk_robot.mp3",
            },
        ])

        await db.insert(schema.challenges).values([
        {
            id: 4,
            lessonId: 2,
            type: "SELECT",
            order: 1,
            question: 'Which one of these is the "The man" ?',
        },
        {
            id: 5,
            lessonId: 2,
            type: "ASSIST",
            order: 2,
            question: '"The man" ?',
        },
        {
            id: 6,
            lessonId: 2,
            type: "SELECT",
            order: 3,
            question: 'Which one of these is the "The robot" ?',
        },
    ]);

    console.log("Seeding finished ✅")
    }catch(error){
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();