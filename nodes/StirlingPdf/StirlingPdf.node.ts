import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

import { convertOperations, convertFields } from './resources/convert/description';
import { executeConvert } from './resources/convert/execute';

import { documentOperations, documentFields } from './resources/document/description';
import { executeDocument } from './resources/document/execute';

import { securityOperations, securityFields } from './resources/security/description';
import { executeSecurity } from './resources/security/execute';

import { optimizeOperations, optimizeFields } from './resources/optimize/description';
import { executeOptimize } from './resources/optimize/execute';

import { ocrOperations, ocrFields } from './resources/ocr/description';
import { executeOcr } from './resources/ocr/execute';

export class StirlingPdf implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Stirling-PDF',
		name: 'stirlingPdf',
		icon: {
			light: 'file:../../icons/stirlingpdf.svg',
			dark: 'file:../../icons/stirlingpdf.dark.svg',
		},
		group: ['transform'],
		version: 1,
		usableAsTool: true,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Convert, manipulate, secure, compress, and OCR PDF documents using Stirling-PDF',
		defaults: {
			name: 'Stirling-PDF',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'stirlingPdfApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Convert',
						value: 'convert',
						description:
							'Convert PDF to/from images, office documents, HTML, markdown, or text',
					},
					{
						name: 'Document Operation',
						value: 'document',
						description:
							'Merge, split, rotate, crop, page numbering, watermark, rearrange, or scale PDFs',
					},
					{
						name: 'OCR & Extract',
						value: 'ocr',
						description: 'Run OCR on scanned PDFs, extract images or text',
					},
					{
						name: 'Optimize & Repair',
						value: 'optimize',
						description: 'Compress, flatten, or repair PDFs',
					},
					{
						name: 'Security & Sign',
						value: 'security',
						description: 'Encrypt, decrypt, sanitize, or auto-redact PDFs',
					},
				],
				default: 'convert',
			},
			...convertOperations,
			...convertFields,
			...documentOperations,
			...documentFields,
			...securityOperations,
			...securityFields,
			...optimizeOperations,
			...optimizeFields,
			...ocrOperations,
			...ocrFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Check if the operation is in multi-item aggregation mode
		const isAggregateMerge =
			resource === 'document' &&
			operation === 'merge' &&
			this.getNodeParameter('inputMode', 0, 'aggregateItems') === 'aggregateItems';

		const isAggregateImagesToPdf =
			resource === 'convert' &&
			operation === 'imagesToPdf' &&
			this.getNodeParameter('inputMode', 0, 'aggregateItems') === 'aggregateItems';

		if (isAggregateMerge || isAggregateImagesToPdf) {
			try {
				let resultItem: INodeExecutionData;
				if (isAggregateMerge) {
					resultItem = await executeDocument.call(this, operation, 0);
				} else {
					resultItem = await executeConvert.call(this, operation, 0);
				}
				resultItem.pairedItem = items.map((_, index) => ({ item: index }));
				returnData.push(resultItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: items.map((_, index) => ({ item: index })),
					});
				} else {
					throw new NodeApiError(this.getNode(), error as JsonObject);
				}
			}
			return [returnData];
		}

		for (let i = 0; i < items.length; i++) {
			try {
				let resultItem: INodeExecutionData;

				if (resource === 'convert') {
					resultItem = await executeConvert.call(this, operation, i);
				} else if (resource === 'document') {
					resultItem = await executeDocument.call(this, operation, i);
				} else if (resource === 'security') {
					resultItem = await executeSecurity.call(this, operation, i);
				} else if (resource === 'optimize') {
					resultItem = await executeOptimize.call(this, operation, i);
				} else if (resource === 'ocr') {
					resultItem = await executeOcr.call(this, operation, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown resource "${resource}"`, {
						itemIndex: i,
					});
				}

				resultItem.pairedItem = { item: i };
				returnData.push(resultItem);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
