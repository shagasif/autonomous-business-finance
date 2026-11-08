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
    const userMsg: Message = { id: generateMsgId('user'), sender: 'user', content: prompt, timestamp: timeStr };
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
    <div
      className="fixed inset-0 z-50 overflow-hidden backdrop-blur-sm flex justify-end"
      style={{ backgroundColor: 'var(--bg-overlay)' }}
    >
      <div
        className="w-full max-w-xl h-full flex flex-col shadow-2xl border-l"
        style={{ backgroundColor: 'var(--bg-modal)', borderColor: 'var(--border)' }}
      >
        {/* Header */}
        <div
          className="p-4 border-b flex items-center justify-between"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
            >
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                AI Finance Assistant
              </h3>
              <p className="text-[11px] font-mono" style={{ color: 'var(--accent)' }}>
                Agent 6: Central Multi-Agent Coordinator
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-[var(--bg-hover)]"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div
          className="p-3 border-b overflow-x-auto flex gap-2 no-scrollbar"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSend(qp)}
              disabled={isSending}
              className="text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer flex-shrink-0 border hover:bg-[var(--bg-hover)]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border)',
                color: 'var(--text-secondary)',
              }}
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
                  <div
                    className="w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 mt-1"
                    style={{
                      backgroundColor: 'var(--accent-muted)',
                      borderColor: 'var(--accent-border)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser ? 'rounded-tr-none' : 'rounded-tl-none shadow-sm'
                  }`}
                  style={
                    isUser
                      ? { background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }
                      : {
                          backgroundColor: 'var(--bg-secondary)',
                          borderColor: 'var(--border)',
                          border: '1px solid var(--border)',
                          color: 'var(--text-secondary)',
                        }
                  }
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Delegated Agents Badges */}
                  {!isUser && m.delegatedAgents && m.delegatedAgents.length > 0 && (
                    <div
                      className="mt-3 pt-3 border-t flex flex-wrap items-center gap-1.5"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        Delegated to:
                      </span>
                      {m.delegatedAgents.map((ag) => (
                        <span
                          key={ag}
                          className="px-2 py-0.5 rounded-full border text-[10px] font-mono"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border)',
                            color: 'var(--accent)',
                          }}
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
                        className="text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        {showReasoning ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>{showReasoning ? 'Hide Agent Reasoning' : 'Inspect Multi-Agent Reasoning Steps'}</span>
                      </button>

                      {showReasoning && (
                        <div
                          className="mt-2 p-2.5 rounded-lg border space-y-1 font-mono text-[10px]"
                          style={{
                            backgroundColor: 'var(--bg-card)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-muted)',
                          }}
                        >
                          {m.reasoningSteps.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                              <span style={{ color: 'var(--accent)' }}>[{idx + 1}]</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Human Approval Required Callout */}
                  {!isUser && m.requiresApproval && m.taskId && (
                    <div className="mt-3 p-3 rounded-xl bg-warning/10 border border-warning/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-warning text-[11px] font-medium">
                        <ShieldCheck className="w-4 h-4 text-warning flex-shrink-0" />
                        <span>
                          Action requires CFO authorization: <strong>{m.approvalAction}</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => { if (m.taskId) onApproveTask(m.taskId); }}
                        className="px-2.5 py-1 rounded-md font-bold text-[10px] flex-shrink-0 cursor-pointer"
                        style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
                      >
                        Authorize
                      </button>
                    </div>
                  )}

                  <div className="mt-2 text-[10px] text-right" style={{ color: isUser ? 'var(--btn-primary-text)' : 'var(--text-muted)', opacity: isUser ? 0.75 : 1 }}>
                    {m.timestamp}
                  </div>
                </div>

                {isUser && (
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  >
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-lg border flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--accent-muted)',
                  borderColor: 'var(--accent-border)',
                  color: 'var(--accent)',
                }}
              >
                <Bot className="w-4 h-4" />
              </div>
              <div
                className="p-3 rounded-2xl border text-xs flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ color: 'var(--accent)' }} />
                <span>Orchestrator coordinating specialized agents...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div
          className="p-4 border-t"
          style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
        >
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about burn rate, runway, anomalies, budgets, or P&L..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 rounded-xl px-4 py-2.5 text-xs border focus:outline-none"
              style={{
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-2.5 rounded-xl font-semibold transition-all disabled:opacity-40 cursor-pointer"
              style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
