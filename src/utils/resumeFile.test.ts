import { afterEach, describe, expect, it, vi } from 'vitest';
import { RESUME_FILE_ACCEPT, extractResumeText } from './resumeFile';

vi.mock('pdfjs-dist/build/pdf.worker.min.mjs?url', () => ({ default: 'worker.js' }));

vi.mock('mammoth', () => ({
  extractRawText: vi.fn(async () => ({
    value: 'Katherine Johnson\nOrbital mechanics',
    messages: [],
  })),
}));

vi.mock('pdfjs-dist', () => ({
  GlobalWorkerOptions: { workerSrc: '' },
  getDocument: vi.fn(() => ({
    promise: Promise.resolve({
      numPages: 2,
      getPage: async (n: number) => ({
        getTextContent: async () => ({
          items: [{ str: `page ${n}` }, { str: 'text' }],
        }),
        cleanup: () => {},
      }),
      destroy: async () => {},
    }),
  })),
}));

afterEach(() => {
  vi.clearAllMocks();
});

describe('RESUME_FILE_ACCEPT', () => {
  it('advertises PDF, Word and plain-text formats', () => {
    expect(RESUME_FILE_ACCEPT).toContain('.pdf');
    expect(RESUME_FILE_ACCEPT).toContain('.docx');
    expect(RESUME_FILE_ACCEPT).toContain('.txt');
    expect(RESUME_FILE_ACCEPT).toContain('.md');
  });
});

describe('extractResumeText', () => {
  it('reads plain text files directly and tidies whitespace', async () => {
    const file = new File(['Ada  Lovelace\n\n\n\nAnalytical Engine  \n'], 'cv.txt', {
      type: 'text/plain',
    });
    const result = await extractResumeText(file);
    expect(result).toEqual({
      kind: 'text',
      text: 'Ada Lovelace\n\nAnalytical Engine',
    });
  });

  it('rejects an empty file', async () => {
    const file = new File([''], 'cv.txt', { type: 'text/plain' });
    await expect(extractResumeText(file)).rejects.toThrow(/empty/i);
  });

  it('rejects legacy .doc with export guidance', async () => {
    const file = new File([' binary'], 'resume.doc', {
      type: 'application/msword',
    });
    await expect(extractResumeText(file)).rejects.toThrow(/\.docx or export it to PDF/i);
  });

  it('extracts text from a .docx via mammoth', async () => {
    const file = new File(['zip-bytes'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const result = await extractResumeText(file);
    expect(result.kind).toBe('docx');
    expect(result.text).toContain('Katherine Johnson');
  });

  it('extracts and joins page text from a PDF via pdfjs', async () => {
    const file = new File(['%PDF-1.4'], 'resume.pdf', { type: 'application/pdf' });
    const result = await extractResumeText(file);
    expect(result.kind).toBe('pdf');
    expect(result.text).toBe('page 1 text\n\npage 2 text');
  });
});
