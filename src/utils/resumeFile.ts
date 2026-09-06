/**
 * Résumé file → plain text extraction for the AI Import tab.
 *
 * Runs entirely in the browser. Plain text is read directly; PDF and Word
 * (`.docx`) are converted to text with libraries that are lazy-loaded on first
 * use so they stay out of the main bundle. Legacy binary `.doc` is not
 * supported — the format needs a heavyweight parser and users can export a
 * `.docx` or PDF instead.
 */

export type ResumeFileKind = 'text' | 'pdf' | 'docx';

export interface ExtractedResume {
  text: string;
  kind: ResumeFileKind;
}

/** `accept` attribute for the résumé file picker. */
export const RESUME_FILE_ACCEPT = [
  '.txt',
  '.md',
  '.markdown',
  '.pdf',
  '.docx',
  'text/plain',
  'text/markdown',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
].join(',');

const extensionOf = (name: string): string => {
  const dot = name.lastIndexOf('.');
  return dot === -1 ? '' : name.slice(dot).toLowerCase();
};

const DOCX_MIME =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/** Collapses the ragged whitespace text extractors tend to produce. */
const tidy = (value: string): string =>
  value
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

const extractPdf = async (file: File): Promise<string> => {
  const pdfjs = await import('pdfjs-dist');
  const workerSrc = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url'))
    .default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;
  try {
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber += 1) {
      const page = await doc.getPage(pageNumber);
      const content = await page.getTextContent();
      const line = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      pages.push(line);
      page.cleanup();
    }
    return pages.join('\n\n');
  } finally {
    await doc.destroy();
  }
};

const extractDocx = async (file: File): Promise<string> => {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

/**
 * Reads `file` and returns its résumé text. Throws an `Error` with a
 * user-facing message when the format is unsupported or yields no text.
 */
export const extractResumeText = async (
  file: File,
): Promise<ExtractedResume> => {
  const ext = extensionOf(file.name);
  const mime = file.type;

  if (ext === '.doc' || mime === 'application/msword') {
    throw new Error(
      'Legacy .doc files are not supported. Save the document as .docx or export it to PDF, then upload again.',
    );
  }

  if (ext === '.pdf' || mime === 'application/pdf') {
    const text = tidy(await extractPdf(file));
    if (!text) {
      throw new Error(
        'No selectable text found in this PDF. If it is a scan, upload a text-based PDF or paste the text manually.',
      );
    }
    return { text, kind: 'pdf' };
  }

  if (ext === '.docx' || mime === DOCX_MIME) {
    const text = tidy(await extractDocx(file));
    if (!text) {
      throw new Error('Could not extract any text from this Word document.');
    }
    return { text, kind: 'docx' };
  }

  const text = tidy(await file.text());
  if (!text) {
    throw new Error('This file is empty.');
  }
  return { text, kind: 'text' };
};
