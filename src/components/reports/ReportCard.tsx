'use client';

import { useState } from 'react';
import {
  FileText,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { MedicalReport, Severity, ReportType } from '@/types/health';

interface Props {
  report: MedicalReport;
  onDelete?: (id: number) => void;
}

const reportTypeLabels: Record<ReportType, string> = {
  [ReportType.BLOOD_TEST]: '🩸 Blood Test',
  [ReportType.IMAGING]: '🩻 Imaging',
  [ReportType.PRESCRIPTION]: '💊 Prescription',
  [ReportType.DISCHARGE]: '🏥 Discharge Summary',
  [ReportType.CONSULTATION]: '👨‍⚕️ Consultation',
  [ReportType.OTHER]: '📄 Report',
};

const severityIcons = {
  [Severity.CRITICAL]: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  [Severity.WARNING]: <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />,
  [Severity.NORMAL]: <CheckCircle className="w-3.5 h-3.5 text-green-500" />,
};

const severityBadge = {
  [Severity.CRITICAL]: 'bg-red-50 text-red-700 border-red-200',
  [Severity.WARNING]: 'bg-amber-50 text-amber-700 border-amber-200',
  [Severity.NORMAL]: 'bg-green-50 text-green-700 border-green-200',
};

export default function ReportCard({ report, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const data = report.extractedData;

  const uploadDate = new Date(report.uploadDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center text-xl flex-shrink-0">
          {data?.reportType === ReportType.BLOOD_TEST && '🩸'}
          {data?.reportType === ReportType.IMAGING && '🩻'}
          {data?.reportType === ReportType.PRESCRIPTION && '💊'}
          {data?.reportType === ReportType.DISCHARGE && '🏥'}
          {data?.reportType === ReportType.CONSULTATION && '👨‍⚕️'}
          {(!data || data.reportType === ReportType.OTHER) && '📄'}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{report.fileName}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-gray-400">{uploadDate}</span>
            {data?.date && data.date !== uploadDate && (
              <>
                <span className="text-gray-200">·</span>
                <span className="text-xs text-gray-500">
                  Report date: {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </>
            )}
            {data && (
              <span className="text-xs text-gray-500">
                {reportTypeLabels[data.reportType] || '📄 Report'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {report.status === 'processing' && (
            <span className="flex items-center gap-1 text-xs text-sky-600 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
              <Loader2 className="w-3 h-3 animate-spin" /> Processing
            </span>
          )}
          {report.status === 'completed' && (
            <span className="text-xs text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
              ✓ Analyzed
            </span>
          )}
          {report.status === 'error' && (
            <span className="text-xs text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
              Error
            </span>
          )}

          {data && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}

          {onDelete && report.id !== undefined && (
            <button
              onClick={() => onDelete(report.id!)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors"
              title="Remove report"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {report.status === 'error' && report.error && (
        <div className="px-5 pb-4">
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {report.error}
          </p>
        </div>
      )}

      {/* Summary */}
      {data?.summary && !expanded && (
        <div className="px-5 pb-4 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
        </div>
      )}

      {/* Expanded Content */}
      {expanded && data && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-5">
          {data.summary && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Summary
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {data.diagnoses.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Diagnoses
              </p>
              <div className="flex flex-wrap gap-2">
                {data.diagnoses.map((d, i) => (
                  <span key={i} className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.testResults.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Test Results
              </p>
              <div className="space-y-1.5">
                {data.testResults.map((t, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 py-1.5 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {severityIcons[t.severity]}
                      <span className="text-sm text-gray-800 truncate">{t.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${severityBadge[t.severity]}`}>
                        {t.value} {t.unit}
                      </span>
                      <span className="text-xs text-gray-400 hidden sm:block">
                        ref: {t.referenceRange}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.medications.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Medications
              </p>
              <div className="space-y-1.5">
                {data.medications.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-800">
                      {m.name} <span className="text-gray-400">{m.dosage}</span>
                    </span>
                    <span className="text-xs text-gray-400">{m.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.doctorNotes && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Doctor&apos;s Notes
              </p>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">
                {data.doctorNotes}
              </p>
            </div>
          )}

          {data.vitals && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Vitals
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {data.vitals.bloodPressure && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-400">Blood Pressure</p>
                    <p className="text-sm font-semibold">{data.vitals.bloodPressure} mmHg</p>
                  </div>
                )}
                {data.vitals.heartRate && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-400">Heart Rate</p>
                    <p className="text-sm font-semibold">{data.vitals.heartRate} bpm</p>
                  </div>
                )}
                {data.vitals.weight && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-400">Weight</p>
                    <p className="text-sm font-semibold">{data.vitals.weight} kg</p>
                  </div>
                )}
                {data.vitals.bmi && (
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-xs text-gray-400">BMI</p>
                    <p className="text-sm font-semibold">{data.vitals.bmi}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
