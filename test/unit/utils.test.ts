import { describe, it, expect } from 'vitest';
import { extractFilenameFromContentDisposition } from '../../nodes/StirlingPdf/shared/utils';

describe('extractFilenameFromContentDisposition', () => {
	it('should return fallback when header is missing', () => {
		expect(extractFilenameFromContentDisposition(undefined, 'fallback.pdf')).toBe('fallback.pdf');
	});

	it('should extract simple filename from Content-Disposition', () => {
		const header = 'attachment; filename=document.pdf';
		expect(extractFilenameFromContentDisposition(header, 'fallback.pdf')).toBe('document.pdf');
	});

	it('should extract quoted filename', () => {
		const header = 'attachment; filename="my_sample_document.pdf"';
		expect(extractFilenameFromContentDisposition(header, 'fallback.pdf')).toBe(
			'my_sample_document.pdf',
		);
	});

	it('should extract utf-8 encoded filename', () => {
		const header = "attachment; filename*=UTF-8''contract%202026.pdf";
		expect(extractFilenameFromContentDisposition(header, 'fallback.pdf')).toBe('contract 2026.pdf');
	});
});
