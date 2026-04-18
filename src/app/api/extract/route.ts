import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 20MB.' }, { status: 400 });
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF, JPG, PNG, or TXT files.' },
        { status: 400 }
      );
    }

    let extractedText = '';

    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Dynamically import pdf-parse to avoid Next.js build issues
      const pdfParse = (await import('pdf-parse')).default;
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text;
    } else if (file.type === 'text/plain') {
      extractedText = await file.text();
    } else {
      // For images (JPG, PNG), return a placeholder — Claude will handle via vision if needed
      extractedText = `[Image file: ${file.name} — image content to be analyzed]`;
    }

    if (!extractedText || extractedText.trim().length < 10) {
      extractedText = `[File: ${file.name}] — Could not extract readable text from this file.`;
    }

    return NextResponse.json({ text: extractedText, fileName: file.name, fileType: file.type });
  } catch (error) {
    console.error('Extract error:', error);
    const message = error instanceof Error ? error.message : 'Failed to extract file content';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
