"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SUGGESTED_PROMPTS = [
  "Plan a 5-day Bali trip for a couple",
  "Find budget-friendly hotels in Manali",
  "Create a romantic Paris itinerary",
  "Suggest adventure activities in Leh-Ladakh",
];

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

function generateId() {
  return Math.random().toString(36).slice(2, 9);
}

export default function FloatingAIAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "ai", text: "Hi! I'm WanderAI. Ask me anything about trip planning, destinations, or itineraries." },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  function handleSend(text?: string) {
    const msg = (text || input).trim();
    if (!msg) return;

    setMessages((prev) => [...prev, { id: generateId(), role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        "Great choice! I'll draft an itinerary for that destination with personalized recommendations.",
        "I've found some amazing options. Here's what I suggest for your trip based on your preferences.",
        "Based on current weather and crowd data, I recommend visiting during the shoulder season for the best experience.",
        "I've updated your itinerary with some hidden gems that most tourists miss. Check it out!",
      ];
      setMessages((prev) => [...prev, { id: generateId(), role: "ai", text: responses[Math.floor(Math.random() * responses.length)] }]);
      setIsTyping(false);
    }, 1500);
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-[#E85D04] to-[#FF8C42] text-white font-semibold rounded-2xl shadow-lg cursor-pointer"
        style={{ animation: "ai-orb-pulse 4s ease-in-out infinite" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
      >
        <span className="text-lg">✨</span>
        <span className="hidden sm:inline text-sm">Ask WanderAI</span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ height: 520 }}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F]">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">✨</div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#1B4332]" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">WanderAI</h3>
                <p className="text-xs text-white/70">Always ready to plan</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E85D04] to-[#FF8C42] flex items-center justify-center text-xs text-white shrink-0 mr-2 mt-0.5">✨</div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#1B4332] text-white rounded-br-md"
                      : "bg-gray-100 text-[#2D3436] rounded-bl-md"
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#E85D04] to-[#FF8C42] flex items-center justify-center text-xs text-white shrink-0 mr-2 mt-0.5">✨</div>
                  <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: "glow-pulse 1s ease-in-out infinite" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: "glow-pulse 1s ease-in-out infinite 0.2s" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full" style={{ animation: "glow-pulse 1s ease-in-out infinite 0.4s" }} />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Suggested prompts */}
            {messages.length <= 1 && (
              <div className="px-5 pb-3">
                <p className="text-xs text-gray-400 mb-2">Suggested:</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-[#E85D04] hover:text-[#E85D04] transition-all duration-200 cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Ask about any trip..."
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-[#2D3436] outline-none transition-all duration-200 focus:border-[#E85D04] focus:ring-2 focus:ring-[#E85D04]/10 focus:bg-white placeholder:text-gray-400"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="w-10 h-10 rounded-xl bg-[#E85D04] text-white flex items-center justify-center transition-all duration-200 hover:bg-[#D4540A] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m-7-7l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
