import { describe, it, expect } from 'vitest';
import { StirlingPdf } from '../../nodes/StirlingPdf/StirlingPdf.node';
import { StirlingPdfApi } from '../../credentials/StirlingPdfApi.credentials';

describe('StirlingPdf Node Structure', () => {
	const node = new StirlingPdf();

	it('should define valid metadata and name', () => {
		expect(node.description.name).toBe('stirlingPdf');
		expect(node.description.displayName).toBe('Stirling-PDF');
		expect(node.description.usableAsTool).toBe(true);
		expect(node.description.credentials).toEqual([
			{
				name: 'stirlingPdfApi',
				required: true,
			},
		]);
	});

	it('should contain all 5 required resources', () => {
		const resourceProp = node.description.properties.find((p) => p.name === 'resource');
		expect(resourceProp).toBeDefined();
		const resourceValues = (resourceProp?.options as Array<{ value: string }>).map((o) => o.value);
		expect(resourceValues).toEqual(
			expect.arrayContaining(['convert', 'document', 'ocr', 'optimize', 'security']),
		);
	});

	it('should validate StirlingPdfApi credential configuration', () => {
		const credentials = new StirlingPdfApi();
		expect(credentials.name).toBe('stirlingPdfApi');
		expect(credentials.properties.some((p) => p.name === 'baseUrl')).toBe(true);
		expect(credentials.properties.some((p) => p.name === 'apiKey')).toBe(true);
		expect(credentials.properties.some((p) => p.name === 'ignoreSslIssues')).toBe(true);
	});
});
