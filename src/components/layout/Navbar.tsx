'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Brain,
  Upload,
  LayoutDashboard,
  MessageCircle,
  Clock,
  FileText,
  Settings,
  Menu,
  X,
  FlaskConical,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { demoReports, demoChatMessages } from '@/lib/demo-data';
import { db } from '@/lib/db';

const navLinks = [
  { href: '/upload', label: 'Upload', icon: Upload },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'AI Chat', icon: MessageCircle },
  { href: '/timeline', label: 'Timeline', icon: Clock },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const { demoMode, setDemoMode, setReports, setChatMessages, clearAllData } = useStore();

  const handleDemoToggle = async () => {
    if (demoMode) {
      clearAllData();
      try {
        await db.reports.clear();
        await db.chatMessages.clear();
      } catch {}
      setDemoMode(false);
      router.push('/');
    } else {
      setReports(demoReports);
      setChatMessages(demoChatMessages);
      setDemoMode(true);
      router.push('/dashboard');
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Brain className="w-7 h-7 text-sky-500" />
            <span className="font-bold text-xl text-gray-900">Health Brain</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-sky-50 text-sky-600'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Demo Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDemoToggle}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                demoMode
                  ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                  : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              {demoMode ? 'Exit Demo' : 'Try Demo'}
            </button>

            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-2 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-sky-50 text-sky-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              setMenuOpen(false);
              handleDemoToggle();
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              demoMode
                ? 'bg-amber-50 border-amber-300 text-amber-700'
                : 'bg-gray-50 border-gray-300 text-gray-600'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            {demoMode ? 'Exit Demo Mode' : 'Try Demo Mode'}
          </button>
        </div>
      )}
    </nav>
  );
}
