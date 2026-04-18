'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FileText, Upload, Trash2 } from 'lucide-react';
import ReportCard from '@/components/reports/ReportCard';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';

export default function ReportsPage() {
  const { reports, setReports, removeReport, demoMode } = useStore();

  useEffect(() => {
    if (!demoMode) {
      db.reports.toArray().then((r) => {
        if (r.length > 0 && reports.length === 0) setReports(r);
      }).catch(() => {});
    }
  }, [setReports, reports.length, demoMode]);

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this report from your records?')) return;
    await db.reports.delete(id).catch(() => {});
    removeReport(id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          {reports.length > 0 && (
            <span className="text-sm text-gray-400">({reports.length})</span>
          )}
        </div>
        <Link
          href="/upload"
          className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload More
        </Link>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No reports yet</h2>
          <p className="text-gray-400 mb-6">Upload your medical records to get started.</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Records
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reports
            .sort(
              (a, b) =>
                new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
            )
            .map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDelete={!demoMode ? handleDelete : undefined}
              />
            ))}
        </div>
      )}

      {reports.length > 0 && !demoMode && (
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <button
            onClick={async () => {
              if (!confirm('Delete all reports? This cannot be undone.')) return;
              await db.reports.clear();
              setReports([]);
            }}
            className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Reports
          </button>
        </div>
      )}
    </div>
  );
}
