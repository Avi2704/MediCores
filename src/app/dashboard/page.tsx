'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Upload, LayoutDashboard, RefreshCw, Loader2 } from 'lucide-react';
import HealthScoreCard from '@/components/dashboard/HealthScoreCard';
import ConditionTracker from '@/components/dashboard/ConditionTracker';
import MedicationList from '@/components/dashboard/MedicationList';
import MetricChart from '@/components/dashboard/MetricChart';
import HealthAlert from '@/components/alerts/HealthAlert';
import ExportButton from '@/components/export/ExportButton';
import { useStore } from '@/lib/store';
import { db } from '@/lib/db';
import { Severity, HealthMetric } from '@/types/health';
import { demoHealthMetrics } from '@/lib/demo-data';
import { generateHealthSummary } from '@/lib/claude';

export default function DashboardPage() {
  const { reports, setReports, demoMode, apiKey, isProcessing } = useStore();
  const [summary, setSummary] = useState('');
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    db.reports.toArray().then((r) => {
      if (r.length > 0 && reports.length === 0) setReports(r);
    }).catch(() => {});
  }, [setReports, reports.length]);

  const completedReports = reports.filter((r) => r.status === 'completed' && r.extractedData);

  // Build health metrics from reports
  const healthMetrics = useMemo<HealthMetric[]>(() => {
    if (demoMode) return demoHealthMetrics;
    return completedReports
      .filter((r) => r.extractedData?.vitals)
      .map((r) => ({
        date: r.extractedData!.date,
        systolic: r.extractedData!.vitals?.bloodPressure
          ? parseInt(r.extractedData!.vitals.bloodPressure.split('/')[0])
          : undefined,
        diastolic: r.extractedData!.vitals?.bloodPressure
          ? parseInt(r.extractedData!.vitals.bloodPressure.split('/')[1])
          : undefined,
        heartRate: r.extractedData!.vitals?.heartRate,
        weight: r.extractedData!.vitals?.weight,
        glucose: r.extractedData!.testResults.find(t =>
          t.name.toLowerCase().includes('glucose')
        )?.value as number | undefined,
        cholesterol: r.extractedData!.testResults.find(t =>
          t.name.toLowerCase().includes('total cholesterol')
        )?.value as number | undefined,
        hba1c: r.extractedData!.testResults.find(t =>
          t.name.toLowerCase().includes('hba1c') || t.name.toLowerCase().includes('a1c')
        )?.value as number | undefined,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [completedReports, demoMode]);

  // Build alerts for critical/warning findings
  const alerts = useMemo(() => {
    return completedReports
      .flatMap((r) =>
        r.extractedData!.testResults
          .filter((t) => t.severity !== Severity.NORMAL)
          .map((t) => ({
            id: `${r.id}-${t.name}`,
            severity: t.severity,
            title: `${t.name}: ${t.value} ${t.unit}`,
            message: `Reference range: ${t.referenceRange} — from ${r.fileName}`,
          }))
      )
      .slice(0, 5);
  }, [completedReports]);

  const visibleAlerts = alerts.filter((a) => !dismissedAlerts.includes(a.id));

  const handleGenerateSummary = async () => {
    if (!apiKey || completedReports.length === 0) return;
    setGeneratingSummary(true);
    try {
      const text = await generateHealthSummary(reports, apiKey);
      setSummary(text);
    } catch (err) {
      setSummary(err instanceof Error ? err.message : 'Failed to generate summary.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  if (completedReports.length === 0 && !isProcessing) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard className="w-5 h-5 text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center">
          <Upload className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No reports yet</h2>
          <p className="text-gray-400 mb-6">Upload your medical records to see your health dashboard.</p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload Records
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="dashboard-export">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-sky-500" />
          <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
          {demoMode && (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExportButton targetId="dashboard-export" fileName="health-dashboard.pdf" />
        </div>
      </div>

      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {visibleAlerts.map((alert) => (
            <HealthAlert
              key={alert.id}
              severity={alert.severity}
              title={alert.title}
              message={alert.message}
              onDismiss={() => setDismissedAlerts((prev) => [...prev, alert.id])}
            />
          ))}
        </div>
      )}

      {/* Health Scores */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Key Metrics</h2>
        <HealthScoreCard reports={reports} />
      </div>

      {/* Charts */}
      {healthMetrics.length > 1 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Trends</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <MetricChart
              data={healthMetrics}
              metricKey="systolic"
              label="Systolic BP"
              unit="mmHg"
              color="#EF4444"
              referenceMax={130}
            />
            <MetricChart
              data={healthMetrics}
              metricKey="glucose"
              label="Fasting Glucose"
              unit="mg/dL"
              color="#F59E0B"
              referenceMax={99}
            />
            <MetricChart
              data={healthMetrics}
              metricKey="cholesterol"
              label="Total Cholesterol"
              unit="mg/dL"
              color="#8B5CF6"
              referenceMax={200}
            />
            <MetricChart
              data={healthMetrics}
              metricKey="hba1c"
              label="HbA1c"
              unit="%"
              color="#F59E0B"
              referenceMax={5.7}
            />
            <MetricChart
              data={healthMetrics}
              metricKey="weight"
              label="Weight"
              unit="kg"
              color="#0EA5E9"
            />
            <MetricChart
              data={healthMetrics}
              metricKey="heartRate"
              label="Heart Rate"
              unit="bpm"
              color="#EC4899"
              referenceMin={60}
              referenceMax={100}
            />
          </div>
        </div>
      )}

      {/* Conditions + Medications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ConditionTracker reports={reports} />
        <MedicationList reports={reports} />
      </div>

      {/* AI Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">AI Health Summary</h2>
          {apiKey && completedReports.length > 0 && (
            <button
              onClick={handleGenerateSummary}
              disabled={generatingSummary}
              className="inline-flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {generatingSummary ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              {generatingSummary ? 'Generating…' : 'Generate Summary'}
            </button>
          )}
        </div>
        {summary ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
        ) : (
          <p className="text-sm text-gray-400">
            {apiKey
              ? 'Click "Generate Summary" to get an AI-powered plain-English overview of your health.'
              : 'Add your Anthropic API key in Settings to generate an AI health summary.'}
          </p>
        )}
      </div>
    </div>
  );
}
