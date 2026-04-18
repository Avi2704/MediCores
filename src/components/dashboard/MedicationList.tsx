'use client';

import { useMemo } from 'react';
import { Pill, CheckCircle, XCircle, Clock } from 'lucide-react';
import { MedicalReport, Medication } from '@/types/health';

interface Props {
  reports: MedicalReport[];
}

export default function MedicationList({ reports }: Props) {
  const medications = useMemo<Medication[]>(() => {
    const all = reports
      .filter((r) => r.status === 'completed' && r.extractedData)
      .flatMap((r) => r.extractedData!.medications);

    // Deduplicate by name
    const seen = new Map<string, Medication>();
    all.forEach((m) => {
      const key = m.name.toLowerCase();
      if (!seen.has(key) || m.status === 'active') {
        seen.set(key, m);
      }
    });
    return Array.from(seen.values()).sort((a, b) => {
      const order = { active: 0, discontinued: 1, completed: 2 };
      return (order[a.status] ?? 3) - (order[b.status] ?? 3);
    });
  }, [reports]);

  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-3">Medications</h3>
        <p className="text-sm text-gray-400">No medications recorded yet.</p>
      </div>
    );
  }

  const statusIcons: Record<string, React.ReactNode> = {
    active: <CheckCircle className="w-4 h-4 text-green-500" />,
    discontinued: <XCircle className="w-4 h-4 text-red-400" />,
    completed: <Clock className="w-4 h-4 text-gray-400" />,
  };

  const active = medications.filter((m) => m.status === 'active');
  const past = medications.filter((m) => m.status !== 'active');

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Medications ({medications.length})</h3>

      {active.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">Active</p>
          <ul className="space-y-2">
            {active.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-green-50 rounded-lg p-3">
                <Pill className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {m.name}
                    <span className="text-gray-500 font-normal ml-1">{m.dosage}</span>
                  </p>
                  <p className="text-xs text-gray-500">{m.frequency}</p>
                </div>
                {statusIcons[m.status]}
              </li>
            ))}
          </ul>
        </div>
      )}

      {past.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Past</p>
          <ul className="space-y-2">
            {past.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 bg-gray-50 rounded-lg p-3 opacity-70">
                <Pill className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-600 line-through">
                    {m.name}
                    <span className="font-normal ml-1">{m.dosage}</span>
                  </p>
                  <p className="text-xs text-gray-400">{m.frequency}</p>
                </div>
                {statusIcons[m.status]}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
