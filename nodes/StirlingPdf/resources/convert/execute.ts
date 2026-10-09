import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeStirlingRequest } from '../../shared/transport';
import {
	getBinaryBuffer,
	getAllBinaryBuffers,
	aggregateBinaryFromAllItems,
} from '../../shared/utils';
import type { IBinaryFileParam } from '../../shared/types';

export async function executeConvert(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	if (operation === 'pdfToImages') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const imageFormat = this.getNodeParameter('imageFormat', itemIndex, 'png') as string;
		const singleOrMultiple = this.getNodeParameter('singleOrMultiple', itemIndex, 'multiple') as string;
		const dpi = this.getNodeParameter('dpi', itemIndex, 300) as number;
		const pageNumbers = this.getNodeParameter('pageNumbers', itemIndex, 'all') as string;
		const colorType = this.getNodeParameter('colorType', itemIndex, 'color') as string;

		const isMultiple = singleOrMultiple === 'multiple';
		const fallbackExt = isMultiple ? 'zip' : imageFormat;
		const fallbackMime = isMultiple ? 'application/zip' : `image/${imageFormat}`;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/pdf/img',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					imageFormat,
					singleOrMultiple,
					dpi,
					pageNumbers,
					colorType,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}.${fallbackExt}`,
				fallbackMimeType: fallbackMime,
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'imagesToPdf') {
		const inputMode = this.getNodeParameter('inputMode', itemIndex, 'aggregateItems') as string;
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const fitOption = this.getNodeParameter('fitOption', itemIndex, 'fillPage') as string;
		const autoRotate = this.getNodeParameter('autoRotate', itemIndex, false) as boolean;

		let imageFiles: Array<{ buffer: Buffer; fileName: string; mimeType: string }>;
		if (inputMode === 'aggregateItems') {
			imageFiles = await aggregateBinaryFromAllItems(this, prop);
		} else {
			const props = prop.split(',').map((p) => p.trim());
			imageFiles = await getAllBinaryBuffers(this, itemIndex, props);
		}

		const files: IBinaryFileParam[] = imageFiles.map((img) => ({
			name: 'fileInput',
			data: img.buffer,
			fileName: img.fileName,
			mimeType: img.mimeType,
		}));

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/img/pdf',
				files,
				fields: {
					fitOption,
					autoRotate,
					colorType: 'color',
				},
				fallbackFileName: 'converted.pdf',
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'fileToPdf') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName, mimeType } = await getBinaryBuffer(this, itemIndex, prop);

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/file/pdf',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType,
					},
				],
				fallbackFileName: `${fileName.replace(/\.[^.]+$/, '')}.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'urlToPdf') {
		const urlInput = this.getNodeParameter('urlInput', itemIndex) as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/url/pdf',
				fields: {
					urlInput,
				},
				fallbackFileName: 'webpage.pdf',
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'htmlToPdf') {
		const source = this.getNodeParameter('htmlInputSource', itemIndex, 'string') as string;
		let htmlBuffer: Buffer;
		let fileName = 'document.html';

		if (source === 'string') {
			const content = this.getNodeParameter('htmlContent', itemIndex, '') as string;
			htmlBuffer = Buffer.from(content, 'utf-8');
		} else {
			const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
			const res = await getBinaryBuffer(this, itemIndex, prop);
			htmlBuffer = res.buffer;
			fileName = res.fileName;
		}

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/html/pdf',
				files: [
					{
						name: 'fileInput',
						data: htmlBuffer,
						fileName,
						mimeType: 'text/html',
					},
				],
				fields: {
					zoom: 1,
				},
				fallbackFileName: 'converted.pdf',
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'markdownToPdf') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/markdown/pdf',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'text/markdown',
					},
				],
				fallbackFileName: `${fileName.replace(/\.md$/i, '')}.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'pdfToWord') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const outputFormat = this.getNodeParameter('outputFormat', itemIndex, 'docx') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/pdf/word',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					outputFormat,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}.${outputFormat}`,
				fallbackMimeType:
					outputFormat === 'docx'
						? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
						: 'application/msword',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'pdfToText') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const outputFormat = this.getNodeParameter('textOutputFormat', itemIndex, 'txt') as string;

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
					outputFormat,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}.${outputFormat}`,
				fallbackMimeType: outputFormat === 'rtf' ? 'application/rtf' : 'text/plain',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'pdfToPdfa') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const outputFormat = this.getNodeParameter('pdfaFormat', itemIndex, 'pdfa-2b') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/convert/pdf/pdfa',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					outputFormat,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_pdfa.pdf`,
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
