import { MedicalReport, ChatMessage } from '@/types/health';

const CLAUDE_MODEL = 'claude-opus-4-5';

const EXTRACTION_SYSTEM_PROMPT =
  'You are a medical data extraction expert. Analyze this medical report and extract: 1. Report type and date 2. Patient vitals if present 3. All test results with values and reference ranges 4. Diagnoses and conditions mentioned 5. Medications prescribed or mentioned 6. Doctor\'s notes and recommendations 7. Any abnormal findings (flag as CRITICAL/WARNING/NORMAL) Return structured JSON only. Be thorough and precise.';

const SUMMARY_SYSTEM_PROMPT =
  "You are a compassionate health translator. Given these medical records, write a clear health story in plain English (Grade 7 level) for the patient. Structure it as: - What's going well - What to watch out for - Key numbers to remember - Questions to ask your doctor No medical jargon. Warm, reassuring tone. Be honest but not alarming.";

const CHAT_SYSTEM_PROMPT =
  "You are a personal health assistant with access to this patient's medical records. Answer questions about their health history accurately, cite specific reports when relevant, and always recommend consulting a doctor for medical decisions. Never diagnose. Be warm and clear.";

async function callClaude(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  maxTokens = 2000
): Promise<string> {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('Invalid API key. Please check your Anthropic API key in Settings.');
    if (response.status === 429) throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    throw new Error(err?.error?.message || `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.content?.[0];
  if (!content || content.type !== 'text') throw new Error('Unexpected response format from Claude.');
  return content.text;
}

export async function extractMedicalData(
  content: string,
  apiKey: string,
  fileType: string
): Promise<Record<string, unknown>> {
  const userMessage = `Extract structured medical data from this ${fileType} report content. Return valid JSON only:\n\n${content}`;
  const raw = await callClaude(apiKey, EXTRACTION_SYSTEM_PROMPT, userMessage, 3000);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Could not parse structured data from the report.');
  return JSON.parse(jsonMatch[0]);
}

export async function generateHealthSummary(
  reports: MedicalReport[],
  apiKey: string
): Promise<string> {
  const summaryData = reports
    .filter((r) => r.status === 'completed' && r.extractedData)
    .map((r) => ({
      date: r.extractedData!.date,
      type: r.extractedData!.reportType,
      diagnoses: r.extractedData!.diagnoses,
      conditions: r.extractedData!.conditions,
      medications: r.extractedData!.medications,
      testResults: r.extractedData!.testResults,
      doctorNotes: r.extractedData!.doctorNotes,
    }));

  const userMessage = `Here are the patient's medical records:\n\n${JSON.stringify(summaryData, null, 2)}\n\nPlease write a clear, plain-English health summary for this patient.`;
  return callClaude(apiKey, SUMMARY_SYSTEM_PROMPT, userMessage, 1500);
}

export async function chatWithRecords(
  message: string,
  records: MedicalReport[],
  history: ChatMessage[],
  apiKey: string
): Promise<string> {
  const recordsContext = records
    .filter((r) => r.status === 'completed' && r.extractedData)
    .map((r) => ({
      fileName: r.fileName,
      date: r.extractedData!.date,
      type: r.extractedData!.reportType,
      diagnoses: r.extractedData!.diagnoses,
      conditions: r.extractedData!.conditions,
      medications: r.extractedData!.medications,
      testResults: r.extractedData!.testResults,
      doctorNotes: r.extractedData!.doctorNotes,
      summary: r.extractedData!.summary,
    }));

  const contextMessage = `Patient medical records:\n${JSON.stringify(recordsContext, null, 2)}\n\nUser question: ${message}`;

  const messages = [
    ...history.slice(-10).map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user' as const, content: contextMessage },
  ];

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': apiKey,
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: CHAT_SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    if (response.status === 401) throw new Error('Invalid API key. Please check your settings.');
    if (response.status === 429) throw new Error('Rate limit exceeded. Please wait a moment.');
    throw new Error(err?.error?.message || `Request failed with status ${response.status}`);
  }

  const data = await response.json();
  const content = data.content?.[0];
  if (!content || content.type !== 'text') throw new Error('Unexpected response from Claude.');
  return content.text;
}
