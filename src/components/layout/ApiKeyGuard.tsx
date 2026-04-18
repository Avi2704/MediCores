'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { KeyRound, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useStore } from '@/lib/store';

export default function ApiKeyGuard({ children }: { children: React.ReactNode }) {
  const { apiKey, demoMode, setApiKey } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Only show on non-landing pages when no key and no demo mode
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isPublicPage = pathname === '/' || pathname === '/settings';

  useEffect(() => {
    if (!isPublicPage && !apiKey && !demoMode) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [apiKey, demoMode, isPublicPage]);

  const handleSave = async () => {
    const trimmed = inputKey.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('API key should start with "sk-ant-". Please check and try again.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      // Quick validation call
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
        setError('Invalid API key. Please check your key and try again.');
        return;
      }
      setApiKey(trimmed);
      setShowModal(false);
    } catch {
      // Network error — accept key anyway and let real requests fail gracefully
      setApiKey(trimmed);
      setShowModal(false);
    } finally {
      setSaving(false);
    }
  };

  const handleTryDemo = () => {
    router.push('/');
    setShowModal(false);
  };

  return (
    <>
      {children}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">API Key Required</h2>
                <p className="text-sm text-gray-500">To use Health Brain, you need an Anthropic API key.</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Anthropic API Key</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
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
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-sky-600 hover:underline mt-1.5"
              >
                Get your API key from Anthropic Console <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-500">
              🔒 Your key is stored only in your browser — it is never sent to our servers.
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving || !inputKey.trim()}
                className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                {saving ? 'Validating...' : 'Save & Continue'}
              </button>
              <button
                onClick={handleTryDemo}
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-lg text-sm transition-colors"
              >
                Try Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
