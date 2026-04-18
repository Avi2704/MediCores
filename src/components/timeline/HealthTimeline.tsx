'use client';

import { MedicalReport, ReportType } from '@/types/health';

interface Props {
  reports: MedicalReport[];
}

const reportTypeLabels: Record<ReportType, string> = {
  [ReportType.BLOOD_TEST]: '🩸 Blood Test',
  [ReportType.IMAGING]: '🩻 Imaging',
  [ReportType.PRESCRIPTION]: '💊 Prescription',
  [ReportType.DISCHARGE]: '🏥 Discharge',
  [ReportType.CONSULTATION]: '👨‍⚕️ Consultation',
  [ReportType.OTHER]: '📄 Report',
};

const statusColors: Record<string, string> = {
  completed: 'bg-green-100 text-green-700 border-green-200',
  processing: 'bg-sky-100 text-sky-700 border-sky-200',
  error: 'bg-red-100 text-red-700 border-red-200',
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function HealthTimeline({ reports }: Props) {
  const events = reports
    .filter((r) => r.status === 'completed' && r.extractedData)
    .sort(
      (a, b) =>
        new Date(b.extractedData!.date).getTime() - new Date(a.extractedData!.date).getTime()
    );

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
        <p className="text-gray-400 text-sm">No timeline events yet. Upload medical reports to build your health history.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {events.map((report, i) => {
          const data = report.extractedData!;
          const dateObj = new Date(data.date);
          const hasAbnormal = data.testResults.some((t) => t.severity !== 'NORMAL');

          return (
            <div key={report.id ?? i} className="relative pl-12">
              {/* Dot */}
              <div
                className={`absolute left-0 top-3 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm bg-white ${
                  hasAbnormal ? 'border-amber-400' : 'border-sky-400'
                }`}
              >
                {data.reportType === ReportType.BLOOD_TEST && '🩸'}
                {data.reportType === ReportType.IMAGING && '🩻'}
                {data.reportType === ReportType.PRESCRIPTION && '💊'}
                {data.reportType === ReportType.DISCHARGE && '🏥'}
                {data.reportType === ReportType.CONSULTATION && '👨‍⚕️'}
                {data.reportType === ReportType.OTHER && '📄'}
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {reportTypeLabels[data.reportType] || '📄 Report'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{report.fileName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasAbnormal && (
                      <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                        Abnormal findings
                      </span>
                    )}
                    <span className="text-sm font-medium text-gray-600">
                      {dateObj.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {data.diagnoses.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {data.diagnoses.map((d, j) => (
                      <span
                        key={j}
                        className="text-xs bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {data.summary && (
                  <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
                )}

                {data.vitals && (
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 border-t border-gray-100 pt-3">
                    {data.vitals.bloodPressure && (
                      <span>🫀 BP: {data.vitals.bloodPressure} mmHg</span>
                    )}
                    {data.vitals.heartRate && (
                      <span>💓 HR: {data.vitals.heartRate} bpm</span>
                    )}
                    {data.vitals.weight && (
                      <span>⚖️ Weight: {data.vitals.weight} kg</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
