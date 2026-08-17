import { getUserProgress, getUserSubscription } from "@/db/queries";
import { redirect } from "next/navigation";
import { SimulationClient } from "./simulation-client";

interface PageProps {
  params: Promise<{
    agentId: string;
  }>;
}

const AGENT_META: Record<string, { title: string; character: string; mascotSrc: string }> = {
  "coffee-shop": {
    title: "Coffee Shop Barista",
    character: "Sarah",
    mascotSrc: "/woman.svg",
  },
  "airport": {
    title: "Airport Customs Control",
    character: "Officer Davis",
    mascotSrc: "/man.svg",
  },
  "doctor": {
    title: "Doctor's Appointment",
    character: "Dr. Watson",
    mascotSrc: "/boy.svg",
  },
  "college-presentation": {
    title: "College Presentation Jury",
    character: "Professor Reynolds",
    mascotSrc: "/robot.svg",
  },
  "job-interview": {
    title: "Job Interview Practice",
    character: "Sophia (Recruiter)",
    mascotSrc: "/girl.svg",
  },
};

export default async function AgentDetailPage({ params }: PageProps) {
  const { agentId } = await params;
  const meta = AGENT_META[agentId];

  if (!meta) {
    redirect("/agents");
  }

  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
  ]);

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }

  const isPro = !!userSubscription?.isActive;

  return (
    <SimulationClient
      agentId={agentId}
      agentTitle={meta.title}
      characterName={meta.character}
      mascotSrc={meta.mascotSrc}
      userProgress={userProgress}
      isPro={isPro}
    />
  );
}
