"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mic, MicOff, Send, Volume2, VolumeX, 
  Flame, CheckCircle2, AlertCircle, Loader2, Play, Sparkles, BookOpen, Award, Download, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  chatWithAgentAction, 
  evaluateSessionAction, 
  getWelcomeMessageAction,
  ChatMessage 
} from "@/actions/agents";
import { cn } from "@/lib/utils";

interface SimulationClientProps {
  agentId: string;
  agentTitle: string;
  characterName: string;
  mascotSrc: string;
  userProgress: {
    points: number;
    hearts: number;
    streak: number;
  };
  isPro: boolean;
}

export const SimulationClient = ({
  agentId,
  agentTitle,
  characterName,
  mascotSrc,
  userProgress,
  isPro,
}: SimulationClientProps) => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "listening" | "speaking" | "thinking" | "evaluating">("idle");
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<any | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  // Web Speech API instances
  const [recognition, setRecognition] = useState<any>(null);

  // Load welcome message on mount
  useEffect(() => {
    const initWelcome = async () => {
      const welcome = await getWelcomeMessageAction(agentId);
      setMessages([{ role: "assistant", content: welcome }]);
      
      // Let voices load before speaking welcome
      setTimeout(() => {
        speakText(welcome);
      }, 800);
    };
    initWelcome();

    // Init Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = true;
        rec.lang = "en-US";
        setRecognition(rec);
      }
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [agentId]);

  // Autoscroll chat history
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Configure speech recognition event listeners
  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join("");
      setInputMessage(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
      setStatus("idle");
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      setStatus("idle");
    };
  }, [recognition]);

  const toggleMic = () => {
    if (!recognition) {
      alert("Browser speech recognition is not supported in this browser. Try Chrome, Safari, or Edge.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      setStatus("idle");
    } else {
      setInputMessage("");
      setStatus("listening");
      setIsRecording(true);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop talking before user speaks
      }
      recognition.start();
    }
  };

  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    // Set voice options
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en-US") && v.name.toLowerCase().includes("natural")
    ) || voices.find((v) => v.lang.startsWith("en-"));
    
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setStatus("speaking");
    };

    utterance.onend = () => {
      setStatus("idle");
    };

    utterance.onerror = () => {
      setStatus("idle");
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || status === "thinking" || status === "evaluating") return;

    // Cancel recording if active
    if (isRecording && recognition) {
      recognition.stop();
    }

    const userText = inputMessage.trim();
    setInputMessage("");

    const updatedMessages = [...messages, { role: "user" as const, content: userText }];
    setMessages(updatedMessages);
    setStatus("thinking");

    const result = await chatWithAgentAction(updatedMessages, agentId);

    if (result.error) {
      if (result.error === "NO_API_KEY") {
        setApiError("NO_API_KEY");
      } else {
        setApiError(result.error);
      }
      setStatus("idle");
      return;
    }

    const aiResponse = result.content || "";
    setMessages([...updatedMessages, { role: "assistant" as const, content: aiResponse }]);
    setStatus("idle");
    
    // Play AI response voice
    setTimeout(() => {
      speakText(aiResponse);
    }, 200);
  };

  const handleFinishSession = async () => {
    // We require at least one exchange from user
    if (messages.filter(m => m.role === "user").length === 0) {
      alert("Please speak or type a few lines first before finishing!");
      return;
    }

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    setStatus("evaluating");
    const result = await evaluateSessionAction(messages, agentId);

    if (result.error) {
      if (result.error === "NO_API_KEY") {
        setApiError("NO_API_KEY");
      } else {
        alert(`Evaluation error: ${result.error}`);
      }
      setStatus("idle");
      return;
    }

    setEvaluationResult(result.evaluation);
    setShowConfetti(true);
    setStatus("idle");
  };

  const handleDownloadPdf = async () => {
    if (!evaluationResult) return;
    setIsDownloadingPdf(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 20;

      // Header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(0, 89, 227);
      doc.text("Talkify", margin, y);

      doc.setFontSize(14);
      doc.setTextColor(51, 65, 85);
      doc.text("ESL Assessment Report", pageWidth - margin, y, { align: "right" });

      y += 8;
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);

      y += 10;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Scenario: ${agentTitle} (${characterName})`, margin, y);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin, y, { align: "right" });

      y += 12;

      // Metrics Summary
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(margin, y, contentWidth, 24, 3, 3, "F");

      const colW = contentWidth / 4;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(0, 89, 227);
      doc.text(`${evaluationResult.overallScore ?? 0}/100`, margin + colW * 0.5, y + 12, { align: "center" });
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("OVERALL SCORE", margin + colW * 0.5, y + 18, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(37, 99, 235);
      doc.text(`${evaluationResult.grammarScore ?? 0}/100`, margin + colW * 1.5, y + 12, { align: "center" });
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("GRAMMAR", margin + colW * 1.5, y + 18, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(5, 150, 105);
      doc.text(`${evaluationResult.vocabularyScore ?? 0}/100`, margin + colW * 2.5, y + 12, { align: "center" });
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("VOCABULARY", margin + colW * 2.5, y + 18, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(147, 51, 234);
      doc.text(`${evaluationResult.fluencyScore ?? 0}/100`, margin + colW * 3.5, y + 12, { align: "center" });
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("FLUENCY", margin + colW * 3.5, y + 18, { align: "center" });

      y += 32;

      const checkPageBreak = (neededHeight: number) => {
        if (y + neededHeight > 275) {
          doc.addPage();
          y = 20;
        }
      };

      // Assessor Feedback
      if (evaluationResult.feedback && evaluationResult.feedback.length > 0) {
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("Assessor Feedback", margin, y);
        y += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);

        for (const item of evaluationResult.feedback) {
          const lines = doc.splitTextToSize(`•  ${item}`, contentWidth);
          checkPageBreak(lines.length * 5 + 3);
          doc.text(lines, margin, y);
          y += lines.length * 5 + 2;
        }
        y += 6;
      }

      // Recommended Corrections
      if (evaluationResult.corrections && evaluationResult.corrections.length > 0) {
        checkPageBreak(20);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("Recommended Corrections", margin, y);
        y += 6;

        for (const corr of evaluationResult.corrections) {
          const origLines = doc.splitTextToSize(`Original: "${corr.original}"`, contentWidth - 6);
          const corrLines = doc.splitTextToSize(`Better: "${corr.corrected}"`, contentWidth - 6);
          const expLines = doc.splitTextToSize(`Reason: ${corr.explanation}`, contentWidth - 6);
          
          const boxHeight = (origLines.length + corrLines.length + expLines.length) * 4.5 + 8;
          checkPageBreak(boxHeight + 4);

          doc.setFillColor(240, 253, 244);
          doc.setDrawColor(220, 252, 231);
          doc.roundedRect(margin, y, contentWidth, boxHeight, 2, 2, "FD");

          let innerY = y + 5;
          doc.setFont("helvetica", "bold");
          doc.setFontSize(9);
          doc.setTextColor(225, 29, 72);
          doc.text(origLines, margin + 4, innerY);
          innerY += origLines.length * 4.5;

          doc.setTextColor(21, 128, 61);
          doc.text(corrLines, margin + 4, innerY);
          innerY += corrLines.length * 4.5;

          doc.setFont("helvetica", "italic");
          doc.setFontSize(8.5);
          doc.setTextColor(100, 116, 139);
          doc.text(expLines, margin + 4, innerY);

          y += boxHeight + 4;
        }
        y += 6;
      }

      // Full Conversation Transcript
      checkPageBreak(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(30, 41, 59);
      doc.text("Full Conversation Transcript", margin, y);
      y += 6;

      for (const m of messages) {
        const speaker = m.role === "user" ? "You" : characterName;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(m.role === "user" ? 0 : 71, m.role === "user" ? 89 : 85, m.role === "user" ? 227 : 105);
        
        const speakerText = `${speaker}:`;
        const bodyLines = doc.splitTextToSize(m.content, contentWidth - 25);
        const entryHeight = Math.max(5, bodyLines.length * 4.5 + 4);

        checkPageBreak(entryHeight);

        doc.text(speakerText, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 41, 59);
        doc.text(bodyLines, margin + 25, y);

        y += entryHeight;
      }

      const cleanTitle = agentTitle.replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`Talkify_Assessment_Report_${cleanTitle}.pdf`);
    } catch (error) {
      console.warn("jsPDF generation notice:", error);
      if (typeof window !== "undefined") {
        window.print();
      }
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Mascot animation helper based on state
  const mascotWiggle = status === "speaking" ? {
    y: [0, -4, 0, -4, 0],
    rotate: [0, -1, 1, -1, 0],
    transition: { repeat: Infinity, duration: 0.6 }
  } : status === "listening" ? {
    scale: [1, 1.03, 1],
    transition: { repeat: Infinity, duration: 1.5 }
  } : { y: 0, rotate: 0, scale: 1 };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-4 relative">
      {showConfetti && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={350} />}

      {/* ERROR MODAL INSTRUCTION FOR MISSING GEMINI KEY */}
      {/* ERROR MODAL INSTRUCTION */}
      <AnimatePresence>
        {apiError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-lg w-full border border-rose-100 shadow-2xl relative"
            >
              <div className="w-14 h-14 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mb-5 text-rose-500 animate-pulse">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">
                {apiError === "NO_API_KEY" ? "Gemini API Key Required" : "AI Simulation Error"}
              </h2>
              <div className="text-slate-600 text-sm font-medium mb-5 leading-relaxed">
                {apiError === "NO_API_KEY" ? (
                  <p>
                    We use the Google Gemini AI model to generate conversation responses and evaluate communication fluency. 
                    Please set up your API Key inside the project's <code className="bg-slate-100 px-1.5 py-0.5 rounded text-rose-600 font-bold font-mono">.env</code> file:
                  </p>
                ) : (
                  <p>
                    An error occurred while communicating with the AI agent. Details: 
                    <span className="block mt-2.5 text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl font-bold font-mono text-xs overflow-x-auto">
                      {apiError}
                    </span>
                  </p>
                )}
              </div>
              {apiError === "NO_API_KEY" && (
                <pre className="bg-slate-900 text-slate-200 p-4 rounded-xl text-xs font-mono font-bold select-all mb-6">
                  GEMINI_API_KEY=your_gemini_api_key_here
                </pre>
              )}
              <div className="flex flex-col gap-2">
                <Button 
                  variant="danger" 
                  onClick={() => setApiError(null)} 
                  className="w-full rounded-2xl animate-pulse"
                >
                  Close & Retry
                </Button>
                <Link href="/agents" className="w-full">
                  <Button variant="default" className="w-full rounded-2xl border-slate-200 border-2">
                    Back to AI Agents Dashboard
                  </Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EVALUATION REPORT REPORT CARD */}
      <AnimatePresence>
        {evaluationResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md overflow-y-auto px-4 py-8 flex justify-center items-start"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white border rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative mb-12 border-slate-200/50"
            >
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    ESL ASSESSMENT REPORT
                  </span>
                  <h2 className="text-2xl font-black text-slate-800 mt-1.5 flex items-center gap-2">
                    <Sparkles className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-pulse" />
                    Fluency Evaluation Complete
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5">
                    <Flame className="h-5 w-5 fill-orange-500 text-orange-500 animate-bounce" />
                    <span className="text-sm font-extrabold text-orange-600">+1 Day Streak!</span>
                  </div>
                  <button 
                    onClick={() => setEvaluationResult(null)}
                    className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors shrink-0"
                    title="Close Report"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* OVERALL GRID SCORES */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                
                {/* CIRCULAR OVERALL SCORE */}
                <div className="bg-slate-50 border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wide mb-3">Overall Score</span>
                  <div className="relative flex items-center justify-center">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                      <circle 
                        cx="48" cy="48" r="40" 
                        stroke="#0059e3" strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={251.2} 
                        strokeDashoffset={251.2 - (251.2 * evaluationResult.overallScore) / 100} 
                        strokeLinecap="round" 
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <span className="absolute text-2xl font-black text-slate-800">{evaluationResult.overallScore}</span>
                  </div>
                </div>

                {/* SLIDER SCORES */}
                <div className="md:col-span-3 bg-slate-50 border rounded-2xl p-5 flex flex-col gap-4 justify-center">
                  
                  {/* GRAMMAR */}
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                      <span>Grammar & Accuracy</span>
                      <span className="text-blue-600">{evaluationResult.grammarScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${evaluationResult.grammarScore}%` }} />
                    </div>
                  </div>

                  {/* VOCABULARY */}
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                      <span>Vocabulary Variety</span>
                      <span className="text-emerald-600">{evaluationResult.vocabularyScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${evaluationResult.vocabularyScore}%` }} />
                    </div>
                  </div>

                  {/* FLUENCY */}
                  <div>
                    <div className="flex justify-between text-xs font-extrabold text-slate-700 mb-1">
                      <span>Fluency & Pacing</span>
                      <span className="text-purple-600">{evaluationResult.fluencyScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${evaluationResult.fluencyScore}%` }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* REWARD POINTS */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between mb-8 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                    <Award className="h-6 w-6 text-yellow-300 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-black">Simulation XP Earned!</p>
                    <p className="text-xs text-blue-100 font-medium">Fluency practice awards speaking points</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-yellow-300">+15 XP</span>
                </div>
              </div>

              {/* CRITIQUE & FEEDBACK */}
              <div className="mb-8">
                <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#0059e3]" />
                  ESL Assessor Feedback
                </h3>
                <ul className="space-y-2">
                  {evaluationResult.feedback?.map((item: string, idx: number) => (
                    <li key={idx} className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-3 flex gap-2">
                      <span className="text-blue-500 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* GRAMMAR CORRECTIONS */}
              {evaluationResult.corrections && evaluationResult.corrections.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-base font-black text-slate-800 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    Recommended Corrections
                  </h3>
                  <div className="space-y-4">
                    {evaluationResult.corrections.map((corr: any, idx: number) => (
                      <div key={idx} className="border border-slate-100 bg-emerald-50/20 rounded-2xl p-4 flex flex-col gap-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase tracking-wider block mb-1">What you said:</span>
                            <span className="text-rose-600 font-bold bg-rose-50 border border-rose-100/60 px-2.5 py-1.5 rounded-lg block">
                              "{corr.original}"
                            </span>
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Better way to say it:</span>
                            <span className="text-emerald-700 font-bold bg-emerald-50 border border-emerald-100/60 px-2.5 py-1.5 rounded-lg block">
                              "{corr.corrected}"
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold italic mt-1 pl-1">
                          Reason: {corr.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ACTION BTN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-6">
                <Button 
                  variant="secondary" 
                  className="w-full rounded-2xl h-12 text-sm font-extrabold uppercase gap-2"
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                >
                  {isDownloadingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Download PDF Report
                </Button>
                <Button 
                  variant="primary" 
                  className="w-full rounded-2xl h-12 text-sm font-extrabold uppercase"
                  onClick={() => {
                    setEvaluationResult(null);
                    router.push("/agents");
                  }}
                >
                  Return to Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto px-4 h-full flex flex-col">
        
        {/* BACK / NAV HEADER */}
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <div className="flex items-center gap-4">
            <Link href="/agents">
              <Button variant="ghost" className="h-10 w-10 p-0 rounded-full border border-slate-200 bg-white">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </Button>
            </Link>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Simulation Studio</span>
              <h1 className="text-lg font-black text-slate-800 leading-none mt-0.5">{agentTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-x-2">
            {/* SPEECH SYNTHESIS SETTING */}
            <Button 
              variant="ghost" 
              onClick={() => setTtsEnabled(!ttsEnabled)} 
              className={cn(
                "h-10 w-10 p-0 rounded-full border bg-white text-slate-600 transition-colors",
                ttsEnabled ? "text-blue-500 border-blue-200" : "text-slate-400 border-slate-200"
              )}
              title={ttsEnabled ? "Text-to-Speech active" : "Text-to-Speech muted"}
            >
              {ttsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            
            {/* FINISH SESSION BTN */}
            <Button 
              variant="secondary" 
              onClick={handleFinishSession}
              disabled={messages.filter(m => m.role === "user").length === 0 || status === "evaluating"}
              className="rounded-2xl shadow-sm text-xs"
            >
              Finish & Evaluate
            </Button>
          </div>
        </div>

        {/* WORKSPACE CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          
          {/* MASCOT/AVATAR COLUMN */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white border rounded-3xl p-6 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-50/30 blur-2xl rounded-full" />
              
              <motion.div 
                animate={mascotWiggle}
                className="relative z-10 w-24 h-24 mb-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center p-2"
              >
                <Image 
                  src={mascotSrc} 
                  alt={characterName} 
                  width={80} 
                  height={80} 
                  className="object-contain"
                />
              </motion.div>

              <h2 className="text-lg font-black text-slate-800 z-10">{characterName}</h2>
              <p className="text-xs font-bold text-slate-400 tracking-wide uppercase mt-0.5 z-10">Roleplay Partner</p>

              {/* AGENT STATE DOT */}
              <div className="mt-4 flex items-center gap-2 bg-slate-50 border rounded-full px-4 py-1.5 z-10 text-xs font-bold">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  status === "speaking" ? "bg-blue-500 animate-pulse" :
                  status === "listening" ? "bg-red-500 animate-ping" :
                  status === "thinking" ? "bg-orange-400 animate-bounce" : "bg-emerald-500"
                )} />
                <span className="text-slate-600">
                  {status === "speaking" ? "Speaking..." :
                   status === "listening" ? "Listening to you..." :
                   status === "thinking" ? "Thinking..." :
                   status === "evaluating" ? "Evaluating..." : "Connected"}
                </span>
              </div>

              {/* PULSING RECORDING AUDIO WAVE */}
              {isRecording && (
                <div className="flex items-center justify-center gap-1.5 mt-5">
                  <span className="h-5 w-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="h-8 w-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  <span className="h-10 w-1 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                  <span className="h-8 w-1 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  <span className="h-5 w-1 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                </div>
              )}
            </div>

            {/* TIP CARD */}
            <div className="bg-white border rounded-3xl p-5 shadow-sm text-xs font-medium text-slate-500 leading-relaxed">
              <span className="font-extrabold text-[#0059e3] uppercase block mb-1">speaking tips</span>
              Click the microphone button to respond. Speak clearly at a moderate pace. 
              Gemini will grade grammar, vocabulary size, and formatting structure once you click "Finish & Evaluate".
            </div>
          </div>

          {/* CHAT MESSAGES WINDOW */}
          <div className="lg:col-span-8 flex flex-col h-[550px] bg-white border rounded-3xl overflow-hidden shadow-sm">
            
            {/* MESSAGE CONTAINER */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "flex gap-x-3 max-w-[80%]",
                    m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  {m.role === "assistant" && (
                    <div className="h-9 w-9 rounded-xl bg-slate-100 border flex items-center justify-center p-1 shrink-0">
                      <Image src={mascotSrc} alt="Partner" width={26} height={26} className="object-contain" />
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div 
                      className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm font-semibold leading-relaxed shadow-sm",
                        m.role === "user" 
                          ? "bg-[#0059e3] text-white rounded-tr-none" 
                          : "bg-slate-100 text-slate-800 border rounded-tl-none"
                      )}
                    >
                      {m.content}
                    </div>
                    {m.role === "assistant" && (
                      <button 
                        onClick={() => speakText(m.content)}
                        className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 pl-1 flex items-center gap-1 hover:text-slate-600 transition-colors w-fit"
                      >
                        <Play className="h-2.5 w-2.5 fill-slate-400" /> Listen Voice
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {status === "thinking" && (
                <div className="flex gap-x-3 mr-auto max-w-[80%]">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 border flex items-center justify-center p-1 shrink-0 animate-pulse">
                    <Image src={mascotSrc} alt="Partner" width={26} height={26} className="object-contain" />
                  </div>
                  <div className="bg-slate-100 border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5 shadow-sm">
                    <span className="h-2.5 w-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <span className="h-2.5 w-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="h-2.5 w-2.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.5s" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE INPUT FORM */}
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2 items-center bg-slate-50/50">
              
              {/* MIC TOGGLE BTN */}
              <Button 
                type="button" 
                variant="ghost" 
                onClick={toggleMic}
                className={cn(
                  "h-12 w-12 p-0 rounded-2xl border text-white transition-all shadow-sm",
                  isRecording 
                    ? "bg-red-500 hover:bg-red-600 border-red-400" 
                    : "bg-slate-800 hover:bg-slate-900 border-slate-700"
                )}
                title={isRecording ? "Stop voice listening" : "Start speaking"}
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5 animate-pulse" />}
              </Button>

              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={isRecording ? "Listening to your voice..." : "Type your message or click Mic to speak..."}
                disabled={status === "thinking" || status === "evaluating"}
                className="flex-1 h-12 bg-white border border-slate-200 rounded-2xl px-4 text-sm font-semibold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors shadow-sm disabled:opacity-50"
              />

              {/* SEND BTN */}
              <Button 
                type="submit" 
                disabled={!inputMessage.trim() || status === "thinking"}
                className="h-12 w-12 p-0 rounded-2xl bg-blue-600 hover:bg-blue-700 border border-blue-500 text-white shadow-sm flex items-center justify-center disabled:opacity-40"
              >
                <Send className="h-4.5 w-4.5" />
              </Button>
            </form>

          </div>

        </div>

      </div>

      {/* HIDDEN OFF-SCREEN PDF TEMPLATE */}
      <div className="fixed left-[-9999px] top-[-9999px] pointer-events-none z-[-1]">
        <style>{`
          @media print {
            body * {
              visibility: hidden !important;
            }
            #pdf-printable-template, #pdf-printable-template * {
              visibility: visible !important;
            }
            #pdf-printable-template {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              display: block !important;
              background: white !important;
              color: black !important;
              padding: 20px !important;
            }
          }
        `}</style>
        <div id="pdf-printable-template" ref={pdfTemplateRef} className="p-8 bg-white text-slate-800 w-[800px] max-w-full font-sans">
          <div className="text-center mb-8 border-b pb-6">
            <h1 className="text-3xl font-black text-[#0059e3] mb-2">Talkify</h1>
            <h2 className="text-xl font-bold text-slate-700">ESL Assessment Report</h2>
            <p className="text-sm text-slate-500 mt-2">Simulation: {agentTitle} ({characterName})</p>
          </div>

          {evaluationResult && (
            <div className="mb-10">
              <h3 className="text-lg font-black bg-slate-100 p-2 rounded-lg mb-4">Performance Metrics</h3>
              <div className="flex justify-between items-center bg-slate-50 border p-4 rounded-xl mb-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">Overall Score</p>
                  <p className="text-3xl font-black text-[#0059e3]">{evaluationResult.overallScore}/100</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">Grammar</p>
                  <p className="text-xl font-bold text-blue-600">{evaluationResult.grammarScore}/100</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">Vocabulary</p>
                  <p className="text-xl font-bold text-emerald-600">{evaluationResult.vocabularyScore}/100</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-500">Fluency</p>
                  <p className="text-xl font-bold text-purple-600">{evaluationResult.fluencyScore}/100</p>
                </div>
              </div>

              <h3 className="text-lg font-black bg-slate-100 p-2 rounded-lg mb-4 mt-6">Assessor Feedback</h3>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-sm text-slate-700">
                {evaluationResult.feedback?.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>

              {evaluationResult.corrections && evaluationResult.corrections.length > 0 && (
                <>
                  <h3 className="text-lg font-black bg-slate-100 p-2 rounded-lg mb-4 mt-6">Recommended Corrections</h3>
                  <div className="space-y-4 mb-8">
                    {evaluationResult.corrections.map((corr: any, idx: number) => (
                      <div key={idx} className="border p-3 rounded-lg bg-emerald-50/30 text-sm">
                        <p className="mb-1"><span className="font-bold text-rose-600">You said:</span> "{corr.original}"</p>
                        <p className="mb-1"><span className="font-bold text-emerald-700">Better:</span> "{corr.corrected}"</p>
                        <p className="text-slate-500 italic mt-1">Reason: {corr.explanation}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <h3 className="text-lg font-black bg-slate-100 p-2 rounded-lg mb-4">Conversation Transcript</h3>
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className="text-sm border-b pb-2 last:border-0">
                <p className="font-bold text-slate-500 mb-1">
                  {m.role === "user" ? "You" : characterName}:
                </p>
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
