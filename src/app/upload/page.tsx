'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Upload, ArrowRight, Info } from 'lucide-react';
import DropZone from '@/components/upload/DropZone';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';

export default function UploadPage() {
  const { setReports, demoMode } = useStore();

  // Load existing reports from IndexedDB on mount
  useEffect(() => {
    db.reports.toArray().then((reports) => {
      if (reports.length > 0) setReports(reports);
    }).catch(() => {});
  }, [setReports]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Upload className="w-5 h-5 text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Upload Medical Records</h1>
        </div>
        <p className="text-gray-500">
          Upload your medical reports and let AI extract and analyze the key information.
        </p>
      </div>

      {demoMode && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-700">
            You&apos;re in demo mode. You can upload files, but AI extraction requires an API key. 
            <Link href="/settings" className="font-medium underline ml-1">Add your key in Settings</Link>.
          </p>
        </div>
      )}

      <DropZone />

      <div className="mt-8 bg-sky-50 border border-sky-200 rounded-xl p-5">
        <h3 className="font-semibold text-sky-800 text-sm mb-2">What happens when you upload?</h3>
        <ol className="space-y-1.5 text-sm text-sky-700">
          <li>1. Your file is sent to our server for text extraction (PDF/image → text)</li>
          <li>2. The extracted text goes directly to Claude AI for analysis</li>
          <li>3. Structured data (test results, diagnoses, medications) is saved to your browser</li>
          <li>4. Your original file is never permanently stored on any server</li>
        </ol>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium text-sm"
        >
          View your dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
