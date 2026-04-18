'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { chatWithRecords } from '@/lib/claude';
import { db } from '@/lib/db';
import { ChatMessage } from '@/types/health';

export default function ChatInterface() {
  const { apiKey, demoMode, reports, chatMessages, addChatMessage } = useStore();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    if (!apiKey && !demoMode) {
      setError('Please add your Anthropic API key in Settings.');
      return;
    }

    setError('');
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setInput('');
    addChatMessage(userMsg);
    await db.chatMessages.add(userMsg).catch(() => {});
    setLoading(true);

    try {
      let assistantText: string;
      if (demoMode && !apiKey) {
        await new Promise((r) => setTimeout(r, 1200));
        assistantText =
          "I'm running in demo mode without an API key. To get real AI responses about your health records, please add your Anthropic API key in Settings. In demo mode, I can show you how the chat interface works, but I can't analyze your actual records.";
      } else {
        assistantText = await chatWithRecords(text, reports, chatMessages, apiKey!);
      }

      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: assistantText,
        timestamp: new Date().toISOString(),
      };
      addChatMessage(assistantMsg);
      await db.chatMessages.add(assistantMsg).catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    'What are my main health concerns?',
    'What medications am I currently taking?',
    'Are any of my lab results abnormal?',
    'What should I ask my doctor?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
          <Bot className="w-4 h-4 text-sky-600" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm">Health Brain AI</p>
          <p className="text-xs text-gray-400">
            {reports.filter((r) => r.status === 'completed').length} records loaded
          </p>
        </div>
        {demoMode && (
          <span className="ml-auto text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            Demo Mode
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-10">
            <Bot className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Ask me anything about your health records</p>
            <p className="text-gray-400 text-sm mt-1">I have access to all your uploaded reports</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="text-xs bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg, i) => (
          <div
            key={msg.id ?? i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-sky-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-500 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content.split('\n').map((line, j) => (
                <span key={j}>
                  {line}
                  {j < msg.content.split('\n').length - 1 && <br />}
                </span>
              ))}
              <p
                className={`text-[10px] mt-1.5 ${
                  msg.role === 'user' ? 'text-sky-200' : 'text-gray-400'
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-sky-500 flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-7 h-7 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-sky-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-4">
        <div className="flex gap-2 items-end bg-gray-50 rounded-xl border border-gray-200 px-4 py-2.5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your health records…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 resize-none outline-none max-h-32"
            style={{ minHeight: '24px' }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          AI responses are informational only — always consult your doctor.
        </p>
      </div>
    </div>
  );
}
