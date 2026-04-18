'use client';

import { MedicalReport, Condition, Severity } from '@/types/health';

interface Props {
  reports: MedicalReport[];
}

export default function ConditionTracker({ reports }: Props) {
  const allConditions: Condition[] = reports
    .filter((r) => r.status === 'completed' && r.extractedData)
    .flatMap((r) => r.extractedData!.conditions);

  // Deduplicate by name (keep the most recent)
  const seen = new Map<string, Condition>();
  allConditions.forEach((c) => {
    const key = c.name.toLowerCase();
    if (!seen.has(key)) seen.set(key, c);
  });
  const conditions = Array.from(seen.values());

  if (conditions.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Conditions</h3>
        <p className="text-sm text-gray-400">No conditions recorded yet.</p>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    active: 'bg-red-100 text-red-700',
    chronic: 'bg-amber-100 text-amber-700',
    suspected: 'bg-orange-100 text-orange-700',
    resolved: 'bg-green-100 text-green-700',
  };

  const severityDot: Record<Severity, string> = {
    [Severity.CRITICAL]: 'bg-red-500',
    [Severity.WARNING]: 'bg-amber-500',
    [Severity.NORMAL]: 'bg-green-500',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Conditions ({conditions.length})</h3>
      <ul className="space-y-2.5">
        {conditions.map((c, i) => (
          <li key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot[c.severity]}`} />
              <span className="text-sm text-gray-800 truncate">{c.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {c.diagnosedDate && (
                <span className="text-xs text-gray-400">
                  {new Date(c.diagnosedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${statusColors[c.status] || 'bg-gray-100 text-gray-600'}`}>
                {c.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
