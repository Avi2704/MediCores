'use client';

import { useEffect } from 'react';
import { Clock, Upload } from 'lucide-react';
import Link from 'next/link';
import HealthTimeline from '@/components/timeline/HealthTimeline';
import ExportButton from '@/components/export/ExportButton';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';

export default function TimelinePage() {
  const { reports, setReports, demoMode } = useStore();

  useEffect(() => {
    if (!demoMode) {
      db.reports.toArray().then((r) => {
        if (r.length > 0 && reports.length === 0) setReports(r);
      }).catch(() => {});
    }
  }, [setReports, reports.length, demoMode]);

  const completedCount = reports.filter((r) => r.status === 'completed').length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Health Timeline</h1>
          {completedCount > 0 && (
            <span className="text-sm text-gray-400">({completedCount} events)</span>
          )}
        </div>
        {completedCount > 0 && (
          <ExportButton targetId="timeline-content" fileName="health-timeline.pdf" label="Export Timeline" />
        )}
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Clock className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No health events yet</h2>
          <p className="text-gray-400 mb-6">Upload your medical records to build your health timeline.</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Records
          </Link>
        </div>
      ) : (
        <div id="timeline-content">
          <HealthTimeline reports={reports} />
        </div>
      )}
    </div>
  );
}
