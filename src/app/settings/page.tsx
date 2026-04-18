'use client';

import { useState } from 'react';
import { Settings, KeyRound, Eye, EyeOff, Trash2, ExternalLink, Shield, FlaskConical, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { useRouter } from 'next/navigation';
import { demoReports, demoChatMessages } from '@/lib/demo-data';

export default function SettingsPage() {
  const { apiKey, setApiKey, clearApiKey, clearAllData, demoMode, setDemoMode, setReports, setChatMessages } = useStore();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [keyError, setKeyError] = useState('');
  const router = useRouter();

  const handleSaveKey = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed) {
      clearApiKey();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    if (!trimmed.startsWith('sk-ant-')) {
      setKeyError('API key should start with "sk-ant-"');
      return;
    }
    setSaving(true);
    setKeyError('');
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Api-Key': trimmed },
        body: JSON.stringify({
          model: 'claude-opus-4-5',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'hi' }],
        }),
      });
      if (res.status === 401) {
        setKeyError('Invalid API key. Please check and try again.');
        return;
      }
    } catch {
      // Network error — accept it
    }
    setApiKey(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    setSaving(false);
  };

  const handleClearAll = async () => {
    if (!confirm('This will delete all your stored reports and chat history. Are you sure?')) return;
    await db.reports.clear().catch(() => {});
    await db.chatMessages.clear().catch(() => {});
    clearAllData();
    router.push('/');
  };

  const handleDemoToggle = () => {
    if (demoMode) {
      setDemoMode(false);
      setReports([]);
      setChatMessages([]);
    } else {
      setReports(demoReports);
      setChatMessages(demoChatMessages);
      setDemoMode(true);
    }
  };

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 12)}${'•'.repeat(20)}${apiKey.slice(-4)}`
    : '';

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Settings className="w-5 h-5 text-sky-500" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* API Key Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-4 h-4 text-sky-500" />
          <h2 className="font-semibold text-gray-900">Anthropic API Key</h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Health Brain uses Claude AI to analyze your medical records. You need your own API key from Anthropic.
        </p>

        {apiKey && !showKey && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-gray-600 mb-3 flex items-center justify-between">
            <span>{maskedKey}</span>
            <span className="text-xs text-green-600 font-sans font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Active
            </span>
          </div>
        )}

        <div className="relative mb-2">
          <input
            type={showKey ? 'text' : 'password'}
            value={inputKey}
            onChange={(e) => { setInputKey(e.target.value); setKeyError(''); }}
            placeholder="sk-ant-..."
            className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {keyError && <p className="text-xs text-red-500 mb-2">{keyError}</p>}

        <div className="flex items-center justify-between mt-4">
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-sky-600 hover:underline"
          >
            Get API key from Anthropic Console <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={handleSaveKey}
            disabled={saving}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-sky-500 hover:bg-sky-600 text-white disabled:bg-gray-200 disabled:text-gray-400'
            }`}
          >
            {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Key'}
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-green-500" />
          <h2 className="font-semibold text-gray-900">Privacy & Data</h2>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            Your API key is stored in <code className="bg-gray-100 px-1 rounded text-xs">localStorage</code> — only in your browser
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            Medical reports are stored in IndexedDB (browser&apos;s local database)
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            Report text goes directly to Anthropic&apos;s API — no intermediate storage
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">✓</span>
            Nothing is stored on Health Brain&apos;s servers
          </li>
        </ul>
      </div>

      {/* Demo Mode */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-amber-500" />
            <div>
              <h2 className="font-semibold text-gray-900">Demo Mode</h2>
              <p className="text-xs text-gray-400 mt-0.5">Load sample health records to explore features</p>
            </div>
          </div>
          <button
            onClick={handleDemoToggle}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              demoMode ? 'bg-amber-400' : 'bg-gray-200'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                demoMode ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
        {demoMode && (
          <p className="mt-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            Demo mode is active. Sample patient data (John Doe) is loaded. Your real data is not affected.
          </p>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-semibold text-red-700 mb-3">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Clear all data stored in your browser — this includes all uploaded reports, chat history, and your API key.
          This action cannot be undone.
        </p>
        <button
          onClick={handleClearAll}
          className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Clear All Data
        </button>
      </div>
    </div>
  );
}
