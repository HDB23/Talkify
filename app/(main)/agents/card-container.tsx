"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentItem {
  id: string;
  title: string;
  character: string;
  difficulty: string;
  difficultyColor: string;
  mascotSrc: string;
  description: string;
  themeClass: string;
  accentColor: string;
}

interface CardContainerProps {
  items: AgentItem[];
}

export const CardContainer = ({ items }: CardContainerProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } },
  } as const;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={cardVariants}
          whileHover={{ y: -6, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className={`flex flex-col h-full rounded-3xl border-2 p-6 bg-gradient-to-br ${item.themeClass} relative overflow-hidden transition-all duration-300 group shadow-sm`}
        >
          <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-4.5 w-4.5 text-blue-500/60 animate-pulse" />
          </div>

          <div className="flex gap-x-4 items-start flex-1">
            <div className="relative p-2 rounded-2xl bg-white border border-slate-100/60 shadow-sm shrink-0">
              <Image
                src={item.mascotSrc}
                alt={item.character}
                width={65}
                height={65}
                className="object-contain"
              />
            </div>

            <div className="flex flex-col gap-y-1">
              <div className="flex items-center gap-x-2 flex-wrap gap-y-1">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.difficultyColor}`}>
                  {item.difficulty}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  With {item.character}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-800 leading-snug group-hover:text-[#0059e3] transition-colors duration-200">
                {item.title}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-600 font-medium leading-relaxed mt-4 flex-1">
            {item.description}
          </p>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <Link href={`/agents/${item.id}`} className="w-full block">
              <Button
                variant="primary"
                className="w-full flex items-center justify-center gap-2 rounded-2xl group-hover:brightness-105"
              >
                Start Practice
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
