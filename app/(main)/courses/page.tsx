import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";

const CoursesPage = async() => {

    const coursesData = getCourses();
    const userProgressData = getUserProgress();

    const [
        courses,
        userProgress,
    ] = await Promise.all([
        coursesData,
        userProgressData,
    ])

    return (
        <div className="h-full max-w-[912px] px-6 mx-auto pt-6 pb-12">
            <h1 className="text-3xl font-extrabold text-neutral-800 tracking-tight">
                Language Courses
            </h1>
            <p className="text-muted-foreground mt-2 mb-6 text-base">
                Choose a language to start your journey to effortless speaking.
            </p>
            <List
                courses={courses}
                activeCourseId={userProgress?.activeCourseId}
            />
        </div>
    )
}

export default CoursesPage;