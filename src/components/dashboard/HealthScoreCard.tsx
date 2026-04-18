'use client';

import { useMemo } from 'react';
import { Heart, Droplet, Zap, Weight, Activity, TrendingUp } from 'lucide-react';
import { MedicalReport, Severity } from '@/types/health';

interface Props {
  reports: MedicalReport[];
}

interface MetricCard {
  label: string;
  value: string;
  unit: string;
  severity: Severity;
  icon: React.ReactNode;
  subtext?: string;
}

export default function HealthScoreCard({ reports }: Props) {
  const metrics = useMemo<MetricCard[]>(() => {
    const completed = reports.filter((r) => r.status === 'completed' && r.extractedData);
    if (completed.length === 0) return [];

    const cards: MetricCard[] = [];

    // Blood Pressure
    const bpReport = [...completed].reverse().find((r) => r.extractedData?.vitals?.bloodPressure);
    if (bpReport?.extractedData?.vitals?.bloodPressure) {
      const bp = bpReport.extractedData.vitals.bloodPressure;
      const [sys] = bp.split('/').map(Number);
      cards.push({
        label: 'Blood Pressure',
        value: bp,
        unit: 'mmHg',
        severity: sys >= 140 ? Severity.CRITICAL : sys >= 130 ? Severity.WARNING : Severity.NORMAL,
        icon: <Heart className="w-5 h-5" />,
        subtext: sys >= 140 ? 'High' : sys >= 130 ? 'Elevated' : 'Normal',
      });
    }

    // Latest glucose
    const glucoseResult = completed
      .flatMap((r) => r.extractedData!.testResults)
      .filter((t) => t.name.toLowerCase().includes('glucose'))
      .pop();
    if (glucoseResult) {
      const val = Number(glucoseResult.value);
      cards.push({
        label: 'Fasting Glucose',
        value: String(glucoseResult.value),
        unit: glucoseResult.unit || 'mg/dL',
        severity: glucoseResult.severity,
        icon: <Droplet className="w-5 h-5" />,
        subtext: val >= 126 ? 'Diabetic range' : val >= 100 ? 'Pre-diabetic' : 'Normal',
      });
    }

    // HbA1c
    const hba1cResult = completed
      .flatMap((r) => r.extractedData!.testResults)
      .filter((t) => t.name.toLowerCase().includes('hba1c') || t.name.toLowerCase().includes('a1c'))
      .pop();
    if (hba1cResult) {
      const val = Number(hba1cResult.value);
      cards.push({
        label: 'HbA1c',
        value: String(hba1cResult.value),
        unit: hba1cResult.unit || '%',
        severity: hba1cResult.severity,
        icon: <Zap className="w-5 h-5" />,
        subtext: val >= 6.5 ? 'Diabetic range' : val >= 5.7 ? 'Pre-diabetic' : 'Normal',
      });
    }

    // Cholesterol
    const cholResult = completed
      .flatMap((r) => r.extractedData!.testResults)
      .filter((t) => t.name.toLowerCase().includes('total cholesterol'))
      .pop();
    if (cholResult) {
      const val = Number(cholResult.value);
      cards.push({
        label: 'Total Cholesterol',
        value: String(cholResult.value),
        unit: cholResult.unit || 'mg/dL',
        severity: cholResult.severity,
        icon: <TrendingUp className="w-5 h-5" />,
        subtext: val >= 240 ? 'High' : val >= 200 ? 'Borderline' : 'Normal',
      });
    }

    // Weight
    const weightReport = [...completed].reverse().find((r) => r.extractedData?.vitals?.weight);
    if (weightReport?.extractedData?.vitals?.weight) {
      const w = weightReport.extractedData.vitals.weight;
      cards.push({
        label: 'Weight',
        value: String(w),
        unit: 'kg',
        severity: Severity.NORMAL,
        icon: <Weight className="w-5 h-5" />,
      });
    }

    // Heart Rate
    const hrReport = [...completed].reverse().find((r) => r.extractedData?.vitals?.heartRate);
    if (hrReport?.extractedData?.vitals?.heartRate) {
      const hr = hrReport.extractedData.vitals.heartRate;
      cards.push({
        label: 'Heart Rate',
        value: String(hr),
        unit: 'bpm',
        severity: hr > 100 || hr < 50 ? Severity.WARNING : Severity.NORMAL,
        icon: <Activity className="w-5 h-5" />,
        subtext: hr > 100 ? 'Elevated' : hr < 60 ? 'Low' : 'Normal',
      });
    }

    return cards;
  }, [reports]);

  if (metrics.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center text-gray-400">
        <p className="text-sm">No metrics yet — upload reports to see your health data.</p>
      </div>
    );
  }

  const severityColors: Record<Severity, string> = {
    [Severity.NORMAL]: 'bg-green-50 border-green-200 text-green-700',
    [Severity.WARNING]: 'bg-amber-50 border-amber-200 text-amber-700',
    [Severity.CRITICAL]: 'bg-red-50 border-red-200 text-red-700',
  };

  const iconColors: Record<Severity, string> = {
    [Severity.NORMAL]: 'text-green-500',
    [Severity.WARNING]: 'text-amber-500',
    [Severity.CRITICAL]: 'text-red-500',
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`rounded-xl border p-4 flex flex-col gap-2 ${severityColors[m.severity]}`}
        >
          <div className={iconColors[m.severity]}>{m.icon}</div>
          <div>
            <p className="text-xs font-medium opacity-75">{m.label}</p>
            <p className="text-xl font-bold">
              {m.value}
              <span className="text-xs font-normal ml-1 opacity-70">{m.unit}</span>
            </p>
            {m.subtext && <p className="text-xs opacity-75 mt-0.5">{m.subtext}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
