import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeStirlingRequest } from '../../shared/transport';
import { getBinaryBuffer } from '../../shared/utils';

export async function executeOptimize(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	if (operation === 'compress') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const optimizeLevel = this.getNodeParameter('optimizeLevel', itemIndex, 2) as number;
		const linearize = this.getNodeParameter('linearize', itemIndex, false) as boolean;
		const grayscale = this.getNodeParameter('grayscale', itemIndex, false) as boolean;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/misc/compress-pdf',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					optimizeLevel,
					linearize,
					grayscale,
					expectedOutputSize: '25KB',
					normalize: false,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_compressed.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'repair') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/misc/repair',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_repaired.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'flatten') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const flattenOnlyForms = this.getNodeParameter('flattenOnlyForms', itemIndex, true) as boolean;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/misc/flatten',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					flattenOnlyForms,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_flattened.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	return { json: {} };
}
