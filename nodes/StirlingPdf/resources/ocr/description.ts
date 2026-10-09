import type { INodeProperties } from 'n8n-workflow';

export const ocrOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['ocr'],
			},
		},
		options: [
			{
				name: 'Extract Images',
				value: 'extractImages',
				description: 'Extract all embedded images from the PDF into a ZIP archive',
				action: 'Extract images from PDF',
			},
			{
				name: 'Extract Text',
				value: 'extractText',
				description: 'Extract all text content from the PDF into a text file',
				action: 'Extract text from PDF',
			},
			{
				name: 'OCR PDF',
				value: 'ocr',
				description: 'Make scanned or image-based PDF searchable using OCR',
				action: 'Run OCR on PDF',
			},
		],
		default: 'ocr',
	},
];

export const ocrFields: INodeProperties[] = [
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['ocr', 'extractImages', 'extractText'],
			},
		},
		description: 'Name of the binary property containing the input PDF',
	},

	// ----------------------------------
	// ocr: ocr
	// ----------------------------------
	{
		displayName: 'Languages',
		name: 'languages',
		type: 'string',
		default: 'eng',
		placeholder: 'eng, deu, fra, spa',
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['ocr'],
			},
		},
		description: 'Comma-separated 3-letter ISO language codes to use for OCR recognition (e.g. "eng", "eng,deu")',
	},
	{
		displayName: 'OCR Type',
		name: 'ocrType',
		type: 'options',
		options: [
			{ name: 'Normal (Standard OCR)', value: 'Normal' },
			{ name: 'Skip Pages with Existing Text', value: 'skip-text' },
			{ name: 'Force OCR on All Pages', value: 'force-ocr' },
		],
		default: 'Normal',
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['ocr'],
			},
		},
		description: 'How OCR is applied across document pages',
	},
	{
		displayName: 'Render Type',
		name: 'ocrRenderType',
		type: 'options',
		options: [
			{ name: 'HOCR (Searchable PDF Overlay)', value: 'hocr' },
			{ name: 'Sandwich (Searchable PDF Layer)', value: 'sandwich' },
		],
		default: 'hocr',
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['ocr'],
			},
		},
		description: 'How the recognized text layer is rendered inside the output PDF',
	},
	{
		displayName: 'Deskew',
		name: 'deskew',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['ocr'],
			},
		},
		description: 'Whether to straighten crooked or skewed scanned pages before OCR',
	},
	{
		displayName: 'Clean Scan',
		name: 'clean',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['ocr'],
			},
		},
		description: 'Whether to clean scan artifacts and noise before OCR',
	},

	// ----------------------------------
	// ocr: extractImages
	// ----------------------------------
	{
		displayName: 'Output Image Format',
		name: 'extractFormat',
		type: 'options',
		options: [
			{ name: 'PNG', value: 'png' },
			{ name: 'JPEG', value: 'jpeg' },
			{ name: 'GIF', value: 'gif' },
		],
		default: 'png',
		displayOptions: {
			show: {
				resource: ['ocr'],
				operation: ['extractImages'],
			},
		},
		description: 'Image file format for the extracted pictures',
	},
];
