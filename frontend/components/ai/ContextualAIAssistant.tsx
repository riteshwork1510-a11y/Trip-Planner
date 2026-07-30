"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/Toast";

interface ContextualAIAssistantProps {
  hasItinerary: boolean;
  onModify: (command: string) => void;
}

const COMMAND_CHIPS = [
  "Replace Day 2",
  "Add one day",
  "Change hotel",
  "Reduce budget",
  "Increase budget",
  "Add shopping",
  "Remove museums",
  "Replace restaurants",
  "Add adventure activities",
];

export default function ContextualAIAssistant({ hasItinerary, onModify }: ContextualAIAssistantProps) {
  const { addToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCommand, setActiveCommand] = useState("");
  const [history, setHistory] = useState<{ role: "user" | "ai"; text: string }[]>([]);

  // STRICT CONSTRAINT: Appear ONLY after an itinerary has been generated or viewed
  if (!hasItinerary) return null;

  const handleExecuteCommand = (cmd: string) => {
    setActiveCommand(cmd);
    setHistory((prev) => [
      ...prev,
      { role: "user", text: cmd },
      { role: "ai", text: `Modifying itinerary... Executed "${cmd}". Affected section updated successfully!` },
    ]);

    onModify(cmd);
    addToast(`AI updated itinerary: "${cmd}"`, "success");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Floating Trigger Orb */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#E85D04] to-[#F37216] text-white font-extrabold text-sm shadow-2xl shadow-[#E85D04]/40 hover:scale-105 transition-all cursor-pointer"
        >
          <span className="text-lg">🤖</span>
          <span>Modify Itinerary with AI</span>
        </motion.button>
      )}

      {/* Assistant Modal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[360px] sm:w-[400px] bg-white dark:bg-[#161F2E] rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col justify-between"
          >
            {/* Top Bar */}
            <div className="p-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <div>
                  <h4 className="text-sm font-extrabold">Contextual AI Assistant</h4>
                  <p className="text-[10px] text-white/80">Refining active itinerary without re-prompts</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat History & Updates */}
            <div className="p-4 h-64 overflow-y-auto space-y-3 bg-gray-50 dark:bg-black/20 text-xs">
              {history.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Tap any command below to dynamically update specific parts of your itinerary.
                </div>
              ) : (
                history.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-[#E85D04] text-white rounded-br-none"
                          : "bg-white dark:bg-white/10 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-white/10"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Command Chips */}
            <div className="p-4 border-t border-gray-100 dark:border-white/10 bg-white dark:bg-[#161F2E] space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Quick Action Commands
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto">
                {COMMAND_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleExecuteCommand(chip)}
                    className="px-2.5 py-1.5 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-[#1B4332] hover:text-white text-gray-700 dark:text-gray-200 text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    ⚡ {chip}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
