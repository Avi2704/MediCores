'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Upload,
  MessageCircle,
  Clock,
  FileText,
  Shield,
  Zap,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { demoReports, demoChatMessages } from '@/lib/demo-data';

const features = [
  {
    icon: Upload,
    title: 'Upload Any Medical File',
    description: 'PDFs, images, text — we extract structured data from all your reports automatically.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Claude AI reads your records and translates medical jargon into plain English.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: MessageCircle,
    title: 'Ask Your Records Anything',
    description: 'Chat with your entire health history. Ask about trends, medications, or test results.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: Clock,
    title: 'Visual Health Timeline',
    description: 'See your full medical history in a beautiful chronological view.',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Shield,
    title: '100% Private',
    description: 'All data stays on your device. Nothing is stored on our servers.',
    color: 'bg-red-100 text-red-600',
  },
  {
    icon: Zap,
    title: 'Instant Insights',
    description: 'Get a personalized health summary and alerts for abnormal values immediately.',
    color: 'bg-indigo-100 text-indigo-600',
  },
];

const steps = [
  { number: '01', title: 'Add your API key', description: 'Enter your Anthropic Claude API key in Settings. It stays in your browser.' },
  { number: '02', title: 'Upload your reports', description: 'Drag and drop PDFs, images, or text files of your medical records.' },
  { number: '03', title: 'Get AI insights', description: 'Claude analyzes your records and gives you a clear, plain-English summary.' },
  { number: '04', title: 'Ask anything', description: 'Chat with your records to understand your health history better.' },
];

export default function HomePage() {
  const router = useRouter();
  const { setDemoMode, setReports, setChatMessages } = useStore();

  const handleTryDemo = () => {
    setReports(demoReports);
    setChatMessages(demoChatMessages);
    setDemoMode(true);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 border border-sky-200 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <Brain className="w-4 h-4" />
          Powered by Claude AI
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-gray-900 leading-tight mb-6">
          Your AI Health<br />
          <span className="text-sky-500">Companion</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your medical reports and let AI translate them into plain English. 
          Understand your health history, track trends, and chat with your records.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-colors"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleTryDemo}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-7 py-3.5 rounded-xl text-base border border-gray-200 transition-colors"
          >
            <FlaskConical className="w-4 h-4 text-amber-500" />
            Try Demo — No Setup
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Free to use · Your data stays on your device · No account needed</p>
      </section>

      {/* Feature Grid */}
      <section className="bg-white border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Everything you need to understand your health
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Health Brain brings your scattered medical records together and makes them easy to understand.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How it works</h2>
        <p className="text-gray-500 text-center mb-12">Up and running in 2 minutes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.number} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gray-100 z-0 -translate-x-4" />
              )}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 relative z-10">
                <span className="text-2xl font-bold text-sky-500 font-serif">{step.number}</span>
                <h3 className="font-semibold text-gray-900 mt-3 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Shield className="w-10 h-10 text-sky-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Your privacy is non-negotiable</h2>
          <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
            Health Brain stores all your data in your browser&apos;s IndexedDB — a local database that never touches our servers. 
            Your API key is kept in localStorage. Medical data goes only between your browser and Anthropic&apos;s API directly.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to understand your health?</h2>
        <p className="text-gray-500 mb-8">Start for free. No account. No server. Just you and your health data.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/settings"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={handleTryDemo}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold px-7 py-3.5 rounded-xl transition-colors"
          >
            <FlaskConical className="w-4 h-4 text-amber-500" />
            Try Demo First
          </button>
        </div>
      </section>
    </div>
  );
}
