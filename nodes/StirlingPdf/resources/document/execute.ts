import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeStirlingRequest } from '../../shared/transport';
import {
	getBinaryBuffer,
	getAllBinaryBuffers,
	aggregateBinaryFromAllItems,
} from '../../shared/utils';
import type { IBinaryFileParam } from '../../shared/types';

export async function executeDocument(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	if (operation === 'merge') {
		const inputMode = this.getNodeParameter('inputMode', itemIndex, 'aggregateItems') as string;
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const sortType = this.getNodeParameter('sortType', itemIndex, 'orderProvided') as string;
		const removeCertSign = this.getNodeParameter('removeCertSign', itemIndex, true) as boolean;
		const generateToc = this.getNodeParameter('generateToc', itemIndex, false) as boolean;

		let pdfFiles: Array<{ buffer: Buffer; fileName: string; mimeType: string }>;
		if (inputMode === 'aggregateItems') {
			pdfFiles = await aggregateBinaryFromAllItems(this, prop);
		} else {
			const props = prop.split(',').map((p) => p.trim());
			pdfFiles = await getAllBinaryBuffers(this, itemIndex, props);
		}

		const files: IBinaryFileParam[] = pdfFiles.map((pdf) => ({
			name: 'fileInput',
			data: pdf.buffer,
			fileName: pdf.fileName,
			mimeType: pdf.mimeType || 'application/pdf',
		}));

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/merge-pdfs',
				files,
				fields: {
					sortType,
					removeCertSign,
					generateToc,
				},
				fallbackFileName: 'merged.pdf',
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'split') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const pageNumbers = this.getNodeParameter('pageNumbers', itemIndex, 'all') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/split-pages',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					pageNumbers,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_split.zip`,
				fallbackMimeType: 'application/zip',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'rotate') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const angle = this.getNodeParameter('angle', itemIndex, 90) as number;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/rotate-pdf',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					angle,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_rotated.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'crop') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const autoCrop = this.getNodeParameter('autoCrop', itemIndex, true) as boolean;

		const fields: Record<string, string | number | boolean> = {
			autoCrop,
			pageNumbers: 'all',
		};

		if (!autoCrop) {
			fields.x = this.getNodeParameter('cropX', itemIndex, 0) as number;
			fields.y = this.getNodeParameter('cropY', itemIndex, 0) as number;
			fields.width = this.getNodeParameter('cropWidth', itemIndex, 500) as number;
			fields.height = this.getNodeParameter('cropHeight', itemIndex, 700) as number;
		}

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/crop',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields,
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_cropped.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'addPageNumbers') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const position = this.getNodeParameter('pageNumberPosition', itemIndex, 8) as number;
		const customText = this.getNodeParameter('customText', itemIndex, 'Page {n} of {total}') as string;
		const startingNumber = this.getNodeParameter('startingNumber', itemIndex, 1) as number;
		const fontSize = this.getNodeParameter('fontSize', itemIndex, 12) as number;
		const fontType = this.getNodeParameter('fontType', itemIndex, 'helvetica') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/misc/add-page-numbers',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					position,
					customText,
					startingNumber,
					fontSize,
					fontType,
					fontColor: '#000000',
					pageNumbers: 'all',
					customMargin: 'medium',
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_numbered.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'addWatermark') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const watermarkText = this.getNodeParameter('watermarkText', itemIndex, 'CONFIDENTIAL') as string;
		const opacity = this.getNodeParameter('watermarkOpacity', itemIndex, 0.3) as number;
		const rotation = this.getNodeParameter('watermarkRotation', itemIndex, 45) as number;
		const fontSize = this.getNodeParameter('watermarkFontSize', itemIndex, 40) as number;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/security/add-watermark',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					watermarkType: 'text',
					watermarkText,
					opacity,
					rotation,
					fontSize,
					customColor: '#d3d3d3',
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_watermarked.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'rearrange') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const rearrangeMode = this.getNodeParameter('rearrangeMode', itemIndex, 'REVERSE_ORDER') as string;
		const pageNumbers =
			rearrangeMode === 'CUSTOM'
				? (this.getNodeParameter('rearrangePageNumbers', itemIndex, '1,3,2') as string)
				: 'all';

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/rearrange-pages',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					customMode: rearrangeMode,
					pageNumbers,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_rearranged.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'multiPageLayout') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const pagesPerSheet = this.getNodeParameter('pagesPerSheet', itemIndex, 2) as number;

		const cols = pagesPerSheet === 4 ? 2 : 2;
		const rows = pagesPerSheet === 4 ? 2 : 1;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/multi-page-layout',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					docsPerPage: pagesPerSheet,
					cols,
					rows,
					orientation: 'PORTRAIT',
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_nup.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'scalePages') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const pageSize = this.getNodeParameter('pageSize', itemIndex, 'A4') as string;
		const scaleFactor = this.getNodeParameter('scaleFactor', itemIndex, 1) as number;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/general/scale-pages',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					pageSize,
					scaleFactor,
					orientation: 'PORTRAIT',
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_scaled.pdf`,
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
