export enum ReportType {
  BLOOD_TEST = 'BLOOD_TEST',
  IMAGING = 'IMAGING',
  PRESCRIPTION = 'PRESCRIPTION',
  DISCHARGE = 'DISCHARGE',
  CONSULTATION = 'CONSULTATION',
  OTHER = 'OTHER',
}

export enum Severity {
  CRITICAL = 'CRITICAL',
  WARNING = 'WARNING',
  NORMAL = 'NORMAL',
}

export interface TestResult {
  name: string;
  value: string | number;
  unit: string;
  referenceRange: string;
  severity: Severity;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'discontinued' | 'completed';
}

export interface Condition {
  name: string;
  status: 'active' | 'resolved' | 'chronic' | 'suspected';
  diagnosedDate?: string;
  severity: Severity;
}

export interface HealthMetric {
  date: string;
  systolic?: number;
  diastolic?: number;
  glucose?: number;
  cholesterol?: number;
  hba1c?: number;
  weight?: number;
  heartRate?: number;
}

export interface ExtractedReport {
  reportType: ReportType;
  date: string;
  vitals?: {
    bloodPressure?: string;
    heartRate?: number;
    temperature?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    oxygenSaturation?: number;
  };
  testResults: TestResult[];
  diagnoses: string[];
  medications: Medication[];
  conditions: Condition[];
  doctorNotes: string;
  rawText: string;
  summary: string;
}

export interface MedicalReport {
  id?: number;
  fileName: string;
  fileType: string;
  uploadDate: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  extractedData?: ExtractedReport;
  error?: string;
}

export interface ChatMessage {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AppState {
  apiKey: string | null;
  reports: MedicalReport[];
  chatMessages: ChatMessage[];
  isProcessing: boolean;
  demoMode: boolean;
}
