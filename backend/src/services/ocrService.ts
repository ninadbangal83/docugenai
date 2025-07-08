// import pdfParse from 'pdf-parse/lib/pdf-parse.js'; // ✅ ESM-compatible

import mammoth from 'mammoth';
import Tesseract from 'tesseract.js';

export const extractTextFromBuffer = async (
  buffer: Buffer,
  originalname: string
): Promise<string> => {
  const ext = originalname.split('.').pop()?.toLowerCase();

  try {
    // if (ext === 'pdf') {
    //   const data = await pdfParse(buffer); // ✅ PDF buffer passed
    //   return data.text;
    // }

    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
      const { data } = await Tesseract.recognize(buffer, 'eng');
      return data.text;
    }

    if (ext === 'txt') {
      return buffer.toString('utf8');
    }

    return '';
  } catch (err) {
    console.error('OCR/Text Extraction failed:', err);
    return '';
  }
};
