'use client';

import { useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatInterface from '@/components/chat/ChatInterface';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';

export default function ChatPage() {
  const { setReports, setChatMessages, reports, demoMode } = useStore();

  useEffect(() => {
    if (!demoMode) {
      Promise.all([
        db.reports.toArray(),
        db.chatMessages.toArray(),
      ]).then(([r, m]) => {
        if (r.length > 0 && reports.length === 0) setReports(r);
        if (m.length > 0) setChatMessages(m);
      }).catch(() => {});
    }
  }, [setReports, setChatMessages, reports.length, demoMode]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-sky-500" />
        <h1 className="text-2xl font-bold text-gray-900">AI Health Chat</h1>
      </div>
      <ChatInterface />
    </div>
  );
}
