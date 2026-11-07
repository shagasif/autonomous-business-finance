import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, ChevronDown, ChevronUp, ShieldCheck, User } from 'lucide-react';
import type { AssistantChatResponse } from '../types/finance';

let msgCounter = 1;
function generateMsgId(prefix: string) {
  return `${prefix}-${msgCounter++}`;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  reasoningSteps?: string[];
  delegatedAgents?: string[];
  actionItems?: string[];
  requiresApproval?: boolean;
  approvalAction?: string;
  taskId?: string;
  timestamp: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (prompt: string) => Promise<AssistantChatResponse>;
  onApproveTask: (taskId: string) => Promise<void>;
}

export const AssistantChatDrawer: React.FC<Props> = ({ isOpen, onClose, onSendMessage, onApproveTask }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content:
        'Hello! I am your **Autonomous AI Finance Assistant**. I coordinate our 5 specialized agents (Financial Analyst, Expense Management, Cash Flow, Budget Planning, and Financial Reporting) to monitor your enterprise finances, detect anomalies, forecast runway, and execute authorized operations.\n\nHow can I assist your finance team today?',
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  if (!isOpen) return null;

  const quickPrompts = [
    'Do we have any unusual spending anomalies or fraud?',
    'What is our cash runway and 30-day forecast?',
    'Why is Marketing over budget and how can we optimize it?',
    'Generate an audited Q3 2026 financial report',
  ];

  const handleSend = async (textToSend?: string) => {
    const prompt = textToSend || input;
    if (!prompt.trim() || isSending) return;

    const timeStr = new Date().toLocaleTimeString();
    const userMsg: Message = {
      id: generateMsgId('user'),
      sender: 'user',
      content: prompt,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      const response = await onSendMessage(prompt);
      const assistantMsg: Message = {
        id: generateMsgId('asst'),
        sender: 'assistant',
        content: response.answer,
        reasoningSteps: response.reasoningSteps,
        delegatedAgents: response.delegatedAgents,
        actionItems: response.actionItems,
        requiresApproval: response.requiresApproval,
        approvalAction: response.approvalAction,
        taskId: response.taskId,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMsg: Message = {
        id: generateMsgId('err'),
        sender: 'assistant',
        content: `Error communicating with multi-agent orchestrator: ${err instanceof Error ? err.message : 'Request failed.'}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const toggleReasoning = (msgId: string) => {
    setExpandedReasoning((prev) => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-slate-950 shadow-md">
              <Bot className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">AI Finance Assistant</h3>
              <p className="text-[11px] text-emerald-400 font-mono">Agent 6: Central Multi-Agent Coordinator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="p-3 bg-slate-950/40 border-b border-slate-800/80 overflow-x-auto flex gap-2 no-scrollbar">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              disabled={isSending}
              className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 whitespace-nowrap transition-colors cursor-pointer flex-shrink-0"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            const showReasoning = !!expandedReasoning[m.id];

            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-600 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-md'
                  }`}
                >
                  {/* Markdown-style content display */}
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Delegated Agents Badges */}
                  {!isUser && m.delegatedAgents && m.delegatedAgents.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono text-slate-500">Delegated to:</span>
                      {m.delegatedAgents.map((ag) => (
                        <span
                          key={ag}
                          className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700/80 text-[10px] font-mono text-emerald-400"
                        >
                          {ag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Inspect Reasoning Steps Toggle */}
                  {!isUser && m.reasoningSteps && m.reasoningSteps.length > 0 && (
                    <div className="mt-2.5">
                      <button
                        onClick={() => toggleReasoning(m.id)}
                        className="text-[10px] font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>{showReasoning ? 'Hide Agent Reasoning' : 'Inspect Multi-Agent Reasoning Steps'}</span>
                      </button>

                      {showReasoning && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1 font-mono text-[10px] text-slate-400">
                          {m.reasoningSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                              <span className="text-emerald-500">[{idx + 1}]</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Human Approval Required Callout */}
                  {!isUser && m.requiresApproval && m.taskId && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-amber-300 text-[11px] font-medium">
                        <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span>Action requires CFO authorization: <strong>{m.approvalAction}</strong></span>
                      </div>
                      <button
                        onClick={() => {
                          if (m.taskId) onApproveTask(m.taskId);
                        }}
                        className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-[10px] flex-shrink-0 cursor-pointer"
                      >
                        Authorize
                      </button>
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-slate-500 text-right">{m.timestamp}</div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                <span>Orchestrator coordinating specialized agents...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about burn rate, runway, anomalies, budgets, or P&L..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
