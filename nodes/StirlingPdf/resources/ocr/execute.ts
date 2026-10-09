import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeStirlingRequest } from '../../shared/transport';
import { getBinaryBuffer } from '../../shared/utils';

export async function executeOcr(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	if (operation === 'ocr') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const languagesRaw = this.getNodeParameter('languages', itemIndex, 'eng') as string;
		const ocrType = this.getNodeParameter('ocrType', itemIndex, 'Normal') as string;
		const ocrRenderType = this.getNodeParameter('ocrRenderType', itemIndex, 'hocr') as string;
		const deskew = this.getNodeParameter('deskew', itemIndex, false) as boolean;
		const clean = this.getNodeParameter('clean', itemIndex, false) as boolean;

		const languages = languagesRaw
			.split(',')
			.map((l) => l.trim())
			.filter(Boolean);

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/misc/ocr-pdf',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					languages,
					ocrType,
					ocrRenderType,
					deskew,
					clean,
					sidecar: false,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_ocr.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'extractImages') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const format = this.getNodeParameter('extractFormat', itemIndex, 'png') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/misc/extract-images',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					format,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_images.zip`,
				fallbackMimeType: 'application/zip',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'extractText') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/pdf/text',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					outputFormat: 'txt',
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_text.txt`,
				fallbackMimeType: 'text/plain',
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
