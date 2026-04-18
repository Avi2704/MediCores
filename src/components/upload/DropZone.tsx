'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, Image, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store';
import { extractMedicalData } from '@/lib/claude';
import { db } from '@/lib/db';
import { MedicalReport, ExtractedReport, ReportType, Severity } from '@/types/health';

interface FileEntry {
  file: File;
  id: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export default function DropZone() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [processing, setProcessing] = useState(false);
  const { apiKey, demoMode, addReport } = useStore();

  const onDrop = useCallback(
    (accepted: File[]) => {
      const newEntries: FileEntry[] = accepted.slice(0, 10 - files.length).map((f) => ({
        file: f,
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        status: 'pending',
      }));
      setFiles((prev) => [...prev, ...newEntries]);
    },
    [files.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'text/plain': ['.txt'],
    },
    maxSize: 20 * 1024 * 1024,
    maxFiles: 10,
    disabled: processing,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const processFiles = async () => {
    if (!apiKey && !demoMode) {
      alert('Please add your Anthropic API key in Settings first.');
      return;
    }
    if (files.length === 0) return;

    setProcessing(true);
    const pending = files.filter((f) => f.status === 'pending');

    for (const entry of pending) {
      setFiles((prev) =>
        prev.map((f) => (f.id === entry.id ? { ...f, status: 'processing' } : f))
      );

      try {
        // Step 1: Extract text
        const formData = new FormData();
        formData.append('file', entry.file);
        const extractRes = await fetch('/api/extract', { method: 'POST', body: formData });
        if (!extractRes.ok) {
          const err = await extractRes.json();
          throw new Error(err.error || 'Text extraction failed');
        }
        const { text } = await extractRes.json();

        // Step 2: Call Claude to parse
        let extractedData: ExtractedReport;
        if (demoMode || !apiKey) {
          extractedData = buildFallbackExtraction(entry.file.name);
        } else {
          const raw = await extractMedicalData(text, apiKey, entry.file.type);
          extractedData = normalizeExtraction(raw, text);
        }

        // Step 3: Save to IndexedDB
        const report: MedicalReport = {
          fileName: entry.file.name,
          fileType: entry.file.type,
          uploadDate: new Date().toISOString(),
          status: 'completed',
          extractedData,
        };
        const id = await db.reports.add(report);
        addReport({ ...report, id: id as number });

        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, status: 'done' } : f))
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Processing failed';
        const report: MedicalReport = {
          fileName: entry.file.name,
          fileType: entry.file.type,
          uploadDate: new Date().toISOString(),
          status: 'error',
          error: message,
        };
        await db.reports.add(report).catch(() => {});
        setFiles((prev) =>
          prev.map((f) => (f.id === entry.id ? { ...f, status: 'error', error: message } : f))
        );
      }
    }
    setProcessing(false);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="w-4 h-4 text-purple-500" />;
    return <FileText className="w-4 h-4 text-sky-500" />;
  };

  const pendingCount = files.filter((f) => f.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-sky-400 bg-sky-50'
            : 'border-gray-300 bg-gray-50 hover:border-sky-400 hover:bg-sky-50'
        } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-sky-400 mx-auto mb-3" />
        <p className="text-base font-medium text-gray-700">
          {isDragActive ? 'Drop your files here…' : 'Drag & drop medical files here'}
        </p>
        <p className="text-sm text-gray-500 mt-1">or click to browse</p>
        <p className="text-xs text-gray-400 mt-3">PDF, JPG, PNG, TXT · Up to 10 files · 20MB each</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-3"
            >
              {getFileIcon(entry.file.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{entry.file.name}</p>
                <p className="text-xs text-gray-400">
                  {(entry.file.size / 1024 / 1024).toFixed(2)} MB
                  {entry.error && <span className="text-red-500 ml-2">{entry.error}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {entry.status === 'pending' && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                )}
                {entry.status === 'processing' && (
                  <Loader2 className="w-4 h-4 text-sky-500 animate-spin" />
                )}
                {entry.status === 'done' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {entry.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {entry.status === 'pending' && (
                  <button
                    onClick={() => removeFile(entry.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {pendingCount > 0 && (
        <button
          onClick={processFiles}
          disabled={processing}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing with AI…
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Process {pendingCount} File{pendingCount !== 1 ? 's' : ''} with AI
            </>
          )}
        </button>
      )}
    </div>
  );
}

function buildFallbackExtraction(fileName: string): ExtractedReport {
  return {
    reportType: ReportType.OTHER,
    date: new Date().toISOString().split('T')[0],
    testResults: [],
    diagnoses: [],
    medications: [],
    conditions: [],
    doctorNotes: 'Demo mode — AI extraction not performed.',
    rawText: fileName,
    summary: 'This file was uploaded in demo mode. Add an API key to enable AI analysis.',
  };
}

function normalizeExtraction(raw: Record<string, unknown>, rawText: string): ExtractedReport {
  const getArray = (key: string): unknown[] => {
    const val = raw[key];
    return Array.isArray(val) ? val : [];
  };

  return {
    reportType: (raw.reportType as ReportType) || ReportType.OTHER,
    date:
      (raw.date as string) ||
      (raw.report_date as string) ||
      new Date().toISOString().split('T')[0],
    vitals: (raw.vitals as ExtractedReport['vitals']) || undefined,
    testResults: getArray('testResults').map((t: unknown) => {
      const item = t as Record<string, unknown>;
      return {
        name: String(item.name || ''),
        value: (item.value as string | number) || '',
        unit: String(item.unit || ''),
        referenceRange: String(item.referenceRange || item.reference_range || ''),
        severity: (item.severity as Severity) || Severity.NORMAL,
      };
    }),
    diagnoses: getArray('diagnoses').map(String),
    medications: getArray('medications').map((m: unknown) => {
      const item = m as Record<string, unknown>;
      return {
        name: String(item.name || ''),
        dosage: String(item.dosage || ''),
        frequency: String(item.frequency || ''),
        startDate: item.startDate as string | undefined,
        endDate: item.endDate as string | undefined,
        status: (item.status as 'active' | 'discontinued' | 'completed') || 'active',
      };
    }),
    conditions: getArray('conditions').map((c: unknown) => {
      const item = c as Record<string, unknown>;
      return {
        name: String(item.name || ''),
        status:
          (item.status as 'active' | 'resolved' | 'chronic' | 'suspected') || 'active',
        diagnosedDate: item.diagnosedDate as string | undefined,
        severity: (item.severity as Severity) || Severity.NORMAL,
      };
    }),
    doctorNotes: String(raw.doctorNotes || raw.doctor_notes || ''),
    rawText,
    summary: String(raw.summary || ''),
  };
}
