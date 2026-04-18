import { MedicalReport, ChatMessage, ReportType, Severity } from '@/types/health';

export const demoReports: MedicalReport[] = [
  {
    id: 1,
    fileName: 'Annual_Blood_Panel_2024.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-03-15T10:00:00Z',
    status: 'completed',
    extractedData: {
      reportType: ReportType.BLOOD_TEST,
      date: '2024-03-15',
      vitals: {
        bloodPressure: '128/82',
        heartRate: 72,
        weight: 78.5,
        height: 175,
        bmi: 25.6,
        oxygenSaturation: 98,
      },
      testResults: [
        {
          name: 'Hemoglobin',
          value: 14.2,
          unit: 'g/dL',
          referenceRange: '13.5–17.5',
          severity: Severity.NORMAL,
        },
        {
          name: 'Fasting Glucose',
          value: 108,
          unit: 'mg/dL',
          referenceRange: '70–99',
          severity: Severity.WARNING,
        },
        {
          name: 'Total Cholesterol',
          value: 215,
          unit: 'mg/dL',
          referenceRange: '<200',
          severity: Severity.WARNING,
        },
        {
          name: 'LDL Cholesterol',
          value: 138,
          unit: 'mg/dL',
          referenceRange: '<100',
          severity: Severity.WARNING,
        },
        {
          name: 'HDL Cholesterol',
          value: 52,
          unit: 'mg/dL',
          referenceRange: '>40',
          severity: Severity.NORMAL,
        },
        {
          name: 'Triglycerides',
          value: 145,
          unit: 'mg/dL',
          referenceRange: '<150',
          severity: Severity.NORMAL,
        },
        {
          name: 'HbA1c',
          value: 5.9,
          unit: '%',
          referenceRange: '<5.7',
          severity: Severity.WARNING,
        },
        {
          name: 'Creatinine',
          value: 0.9,
          unit: 'mg/dL',
          referenceRange: '0.7–1.2',
          severity: Severity.NORMAL,
        },
        {
          name: 'TSH',
          value: 2.1,
          unit: 'mIU/L',
          referenceRange: '0.4–4.0',
          severity: Severity.NORMAL,
        },
      ],
      diagnoses: ['Pre-diabetes (impaired fasting glucose)', 'Borderline hypercholesterolemia'],
      medications: [
        {
          name: 'Metformin',
          dosage: '500mg',
          frequency: 'Twice daily',
          startDate: '2024-03-15',
          status: 'active',
        },
        {
          name: 'Vitamin D3',
          dosage: '2000 IU',
          frequency: 'Daily',
          startDate: '2024-03-15',
          status: 'active',
        },
      ],
      conditions: [
        {
          name: 'Pre-diabetes',
          status: 'active',
          diagnosedDate: '2024-03-15',
          severity: Severity.WARNING,
        },
        {
          name: 'Borderline Hypercholesterolemia',
          status: 'active',
          diagnosedDate: '2024-03-15',
          severity: Severity.WARNING,
        },
      ],
      doctorNotes:
        'Patient advised to follow a low-glycemic diet and increase physical activity. Follow-up in 3 months to recheck fasting glucose and lipid panel. Consider statin therapy if LDL does not improve with lifestyle changes.',
      rawText: 'Annual Blood Panel Report - Patient: John Doe - Date: March 15, 2024',
      summary:
        'Your annual blood work shows your blood sugar and cholesterol are slightly above normal. This is an early warning sign — the good news is these can often be managed with diet and exercise. Your doctor has started you on Metformin to help keep your blood sugar in check.',
    },
  },
  {
    id: 2,
    fileName: 'Cardiology_Consult_2024.pdf',
    fileType: 'application/pdf',
    uploadDate: '2024-01-20T14:30:00Z',
    status: 'completed',
    extractedData: {
      reportType: ReportType.CONSULTATION,
      date: '2024-01-20',
      vitals: {
        bloodPressure: '135/88',
        heartRate: 78,
        weight: 79.2,
      },
      testResults: [
        {
          name: 'Resting ECG',
          value: 'Normal sinus rhythm',
          unit: '',
          referenceRange: 'Normal sinus rhythm',
          severity: Severity.NORMAL,
        },
        {
          name: 'Troponin I',
          value: 0.01,
          unit: 'ng/mL',
          referenceRange: '<0.04',
          severity: Severity.NORMAL,
        },
        {
          name: 'BNP',
          value: 45,
          unit: 'pg/mL',
          referenceRange: '<100',
          severity: Severity.NORMAL,
        },
      ],
      diagnoses: ['Stage 1 Hypertension', 'No evidence of acute cardiac events'],
      medications: [
        {
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          startDate: '2024-01-20',
          status: 'active',
        },
        {
          name: 'Aspirin',
          dosage: '81mg',
          frequency: 'Once daily',
          startDate: '2024-01-20',
          status: 'active',
        },
      ],
      conditions: [
        {
          name: 'Hypertension (Stage 1)',
          status: 'active',
          diagnosedDate: '2024-01-20',
          severity: Severity.WARNING,
        },
      ],
      doctorNotes:
        'Patient presents with elevated blood pressure on two separate readings. ECG shows normal sinus rhythm. No acute cardiac events identified. Initiating Lisinopril 10mg daily. DASH diet recommended. Encourage 30 minutes of moderate exercise 5 days per week. Follow-up echocardiogram in 6 months.',
      rawText: 'Cardiology Consultation - Patient: John Doe - Date: January 20, 2024',
      summary:
        'Your heart check-up showed your blood pressure is a bit high — think of it like your garden hose having too much pressure. Your doctor found no signs of heart damage, which is great! You have been started on a medication called Lisinopril to bring that pressure down safely.',
    },
  },
  {
    id: 3,
    fileName: 'Discharge_Summary_Hospital.pdf',
    fileType: 'application/pdf',
    uploadDate: '2023-11-05T09:15:00Z',
    status: 'completed',
    extractedData: {
      reportType: ReportType.DISCHARGE,
      date: '2023-11-05',
      vitals: {
        bloodPressure: '142/90',
        heartRate: 88,
        temperature: 37.2,
        oxygenSaturation: 97,
      },
      testResults: [
        {
          name: 'White Blood Cell Count',
          value: 11.2,
          unit: 'K/µL',
          referenceRange: '4.5–11.0',
          severity: Severity.WARNING,
        },
        {
          name: 'C-Reactive Protein',
          value: 18.5,
          unit: 'mg/L',
          referenceRange: '<10',
          severity: Severity.CRITICAL,
        },
        {
          name: 'Blood Culture',
          value: 'No growth',
          unit: '',
          referenceRange: 'No growth',
          severity: Severity.NORMAL,
        },
      ],
      diagnoses: ['Acute pyelonephritis (kidney infection)', 'Successfully treated'],
      medications: [
        {
          name: 'Ciprofloxacin',
          dosage: '500mg',
          frequency: 'Twice daily for 14 days',
          startDate: '2023-11-05',
          endDate: '2023-11-19',
          status: 'completed',
        },
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Every 8 hours as needed',
          startDate: '2023-11-05',
          endDate: '2023-11-12',
          status: 'completed',
        },
      ],
      conditions: [
        {
          name: 'Acute Pyelonephritis',
          status: 'resolved',
          diagnosedDate: '2023-11-03',
          severity: Severity.CRITICAL,
        },
      ],
      doctorNotes:
        'Patient admitted with fever, flank pain, and dysuria. Blood cultures negative. Urine culture positive for E. coli. Responded well to IV antibiotics. Discharged in stable condition on oral Ciprofloxacin. Follow-up with PCP in 1 week.',
      rawText: 'Discharge Summary - Patient: John Doe - Date: November 5, 2023',
      summary:
        'You were in the hospital with a kidney infection caused by bacteria. The medical team treated you successfully with antibiotics through your IV, and then sent you home with antibiotic pills to finish the course. The infection has cleared up — you are doing well!',
    },
  },
];

export const demoHealthMetrics = [
  { date: '2023-08-01', systolic: 138, diastolic: 88, glucose: 112, cholesterol: 228, weight: 81, heartRate: 80 },
  { date: '2023-09-01', systolic: 140, diastolic: 90, glucose: 115, cholesterol: 225, weight: 80.5, heartRate: 79 },
  { date: '2023-10-01', systolic: 142, diastolic: 91, glucose: 110, cholesterol: 222, weight: 80, heartRate: 81 },
  { date: '2023-11-01', systolic: 145, diastolic: 92, glucose: 118, cholesterol: 220, weight: 80.2, heartRate: 85 },
  { date: '2023-12-01', systolic: 138, diastolic: 87, glucose: 114, cholesterol: 218, weight: 79.8, heartRate: 78 },
  { date: '2024-01-01', systolic: 136, diastolic: 86, glucose: 110, cholesterol: 216, weight: 79.5, heartRate: 77 },
  { date: '2024-02-01', systolic: 132, diastolic: 84, glucose: 109, cholesterol: 215, weight: 79, heartRate: 76 },
  { date: '2024-03-01', systolic: 128, diastolic: 82, glucose: 108, cholesterol: 215, weight: 78.5, heartRate: 72 },
];

export const demoChatMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content:
      "Hello! I'm your AI health assistant. I have access to your medical records and I'm here to help you understand your health history. What would you like to know?",
    timestamp: '2024-03-15T11:00:00Z',
  },
  {
    id: 2,
    role: 'user',
    content: 'What are my main health concerns right now?',
    timestamp: '2024-03-15T11:01:00Z',
  },
  {
    id: 3,
    role: 'assistant',
    content:
      "Based on your recent records, here are your main health areas to watch:\n\n1. **Pre-diabetes** — Your fasting glucose of 108 mg/dL and HbA1c of 5.9% are in the pre-diabetic range (from your March 2024 blood test). You've started Metformin to help manage this.\n\n2. **Blood Pressure** — Your January 2024 cardiology consultation noted Stage 1 Hypertension (135/88 mmHg). You're on Lisinopril 10mg daily for this.\n\n3. **Cholesterol** — Your total cholesterol (215 mg/dL) and LDL (138 mg/dL) are borderline high.\n\nThe good news is that all three of these are manageable with your current medications and lifestyle changes! Would you like more detail on any of these?",
    timestamp: '2024-03-15T11:01:30Z',
  },
];
