/* eslint-disable @n8n/community-nodes/no-restricted-globals */
import { describe, it, expect } from 'vitest';

const BASE_URL = process.env.STIRLING_BASE_URL || 'https://pdf.iamprompt.me';
const API_KEY = process.env.STIRLING_API_KEY;

describe('Stirling-PDF Live API Integration (https://pdf.iamprompt.me)', () => {
	let generatedPdfBuffer: Buffer;

	const getHeaders = (): Record<string, string> => {
		const headers: Record<string, string> = {};
		if (API_KEY) {
			headers['X-API-KEY'] = API_KEY;
		}
		return headers;
	};

	it('should connect to /v1/api-docs and receive Stirling PDF 3.1.0 OpenAPI spec', async () => {
		const res = await fetch(`${BASE_URL}/v1/api-docs`);
		expect(res.status).toBe(200);
		const json = (await res.json()) as { info: { title: string; version: string } };
		expect(json.info.title).toContain('Stirling PDF');
		expect(json.info.version).toBe('3.1.0');
	});

	it.skipIf(!API_KEY)(
		'should convert HTML to PDF via /api/v1/convert/html/pdf (requires STIRLING_API_KEY)',
		async () => {
			const form = new FormData();
			const htmlContent =
				'<html><body><h1>Live Integration Test</h1><p>Tested from n8n-nodes-stirlingpdf</p></body></html>';
			form.append(
				'fileInput',
				new Blob([Buffer.from(htmlContent)], { type: 'text/html' }),
				'index.html',
			);
			form.append('zoom', '1');

			const res = await fetch(`${BASE_URL}/api/v1/convert/html/pdf`, {
				method: 'POST',
				headers: getHeaders(),
				body: form,
			});

			expect(res.status).toBe(200);
			const arrayBuf = await res.arrayBuffer();
			generatedPdfBuffer = Buffer.from(arrayBuf);

			expect(generatedPdfBuffer.length).toBeGreaterThan(100);
			expect(generatedPdfBuffer.subarray(0, 5).toString('ascii')).toBe('%PDF-');
		},
	);

	it.skipIf(!API_KEY)('should rotate PDF via /api/v1/general/rotate-pdf', async () => {
		expect(generatedPdfBuffer).toBeDefined();

		const form = new FormData();
		form.append(
			'fileInput',
			new Blob([generatedPdfBuffer], { type: 'application/pdf' }),
			'sample.pdf',
		);
		form.append('angle', '90');

		const res = await fetch(`${BASE_URL}/api/v1/general/rotate-pdf`, {
			method: 'POST',
			headers: getHeaders(),
			body: form,
		});

		expect(res.status).toBe(200);
		const buf = Buffer.from(await res.arrayBuffer());
		expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
	});

	it.skipIf(!API_KEY)(
		'should add watermark via /api/v1/security/add-watermark',
		async () => {
			expect(generatedPdfBuffer).toBeDefined();

			const form = new FormData();
			form.append(
				'fileInput',
				new Blob([generatedPdfBuffer], { type: 'application/pdf' }),
				'sample.pdf',
			);
			form.append('watermarkType', 'text');
			form.append('watermarkText', 'VERIFIED_N8N');
			form.append('fontSize', '30');
			form.append('rotation', '45');
			form.append('opacity', '0.5');

			const res = await fetch(`${BASE_URL}/api/v1/security/add-watermark`, {
				method: 'POST',
				headers: getHeaders(),
				body: form,
			});

			expect(res.status).toBe(200);
			const buf = Buffer.from(await res.arrayBuffer());
			expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
		},
	);

	it.skipIf(!API_KEY)('should compress PDF via /api/v1/misc/compress-pdf', async () => {
		expect(generatedPdfBuffer).toBeDefined();

		const form = new FormData();
		form.append(
			'fileInput',
			new Blob([generatedPdfBuffer], { type: 'application/pdf' }),
			'sample.pdf',
		);
		form.append('optimizeLevel', '2');
		form.append('expectedOutputSize', '25KB');
		form.append('linearize', 'false');
		form.append('grayscale', 'false');

		const res = await fetch(`${BASE_URL}/api/v1/misc/compress-pdf`, {
			method: 'POST',
			headers: getHeaders(),
			body: form,
		});

		expect(res.status).toBe(200);
		const buf = Buffer.from(await res.arrayBuffer());
		expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
	});

	it.skipIf(!API_KEY)(
		'should add page numbers via /api/v1/misc/add-page-numbers',
		async () => {
			expect(generatedPdfBuffer).toBeDefined();

			const form = new FormData();
			form.append(
				'fileInput',
				new Blob([generatedPdfBuffer], { type: 'application/pdf' }),
				'sample.pdf',
			);
			form.append('position', '8');
			form.append('customText', 'Page {n} of {total}');
			form.append('startingNumber', '1');
			form.append('fontSize', '12');
			form.append('fontType', 'helvetica');
			form.append('fontColor', '#000000');
			form.append('pageNumbers', 'all');

			const res = await fetch(`${BASE_URL}/api/v1/misc/add-page-numbers`, {
				method: 'POST',
				headers: getHeaders(),
				body: form,
			});

			expect(res.status).toBe(200);
			const buf = Buffer.from(await res.arrayBuffer());
			expect(buf.subarray(0, 5).toString('ascii')).toBe('%PDF-');
		},
	);
});
