import { useState, useRef, useEffect } from 'react';
import { useStudyStore } from '../../store/useStudyStore';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';
import PromptChips from './PromptChips';
import { generateChatReply } from '../../lib/gemini';
import { saveToStorage } from '../../lib/storage';
import { Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatHistory = useStudyStore((s) => s.chatHistory);
  const addChatMessage = useStudyStore((s) => s.addChatMessage);
  const analysis = useStudyStore((s) => s.analysis);
  const isMockMode = useStudyStore((s) => s.isMockMode);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = async (messageText) => {
    const text = messageText || input.trim();
    if (!text) return;
    setInput('');
    // Add user message
    const userMsg = { role: 'user', content: text };
    addChatMessage(userMsg);
    saveToStorage('chatHistory', [...chatHistory, userMsg]);

    setIsLoading(true);
    try {
      const context = analysis ? `Subject: ${analysis.subject}, Grade: ${analysis.gradeLevel}\nSummary: ${analysis.summaryBullets.join(' ')}` : 'General study help.';
      const result = await generateChatReply(text, context);
      const botMsg = { role: 'assistant', content: result.reply };
      addChatMessage(botMsg);
      saveToStorage('chatHistory', [...chatHistory, userMsg, botMsg]);
      if (result.mock) {
        // set mock mode if not already
        useStudyStore.getState().setMockMode(true);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      addChatMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (chipText) => {
    handleSend(chipText);
  };

  return (
    <div className="space-y-4">
      {isMockMode && (
        <div className="text-center text-xs text-accent-cyan/80 bg-white/5 rounded-full py-1 px-4 w-fit mx-auto">
          ⚡ Demo Mode (mock chat)
        </div>
      )}
      <GlassCard className="h-[60vh] flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/30 text-sm">
              Start a conversation about your study material.
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-accent-violet to-accent-cyan text-white'
                      : 'bg-white/10 text-white/90'
                  }`}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-2 rounded-2xl text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white/40 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/10 p-3">
          <PromptChips onChipClick={handleChipClick} />
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question..."
              className="flex-1 bg-white/10 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-accent-violet/50 text-white placeholder-white/30"
            />
            <GradientButton
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 rounded-full"
            >
              <Send className="w-4 h-4" />
            </GradientButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
