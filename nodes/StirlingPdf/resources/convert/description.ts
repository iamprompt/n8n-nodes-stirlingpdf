import type { INodeProperties } from 'n8n-workflow';

export const convertOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['convert'],
			},
		},
		options: [
			{
				name: 'File / Office to PDF',
				value: 'fileToPdf',
				description: 'Convert document files (DOCX, XLSX, PPTX, TXT, etc.) to PDF',
				action: 'Convert a file to PDF',
			},
			{
				name: 'HTML to PDF',
				value: 'htmlToPdf',
				description: 'Convert HTML string or ZIP package to PDF',
				action: 'Convert HTML to PDF',
			},
			{
				name: 'Images to PDF',
				value: 'imagesToPdf',
				description: 'Convert one or more images into a single PDF document',
				action: 'Convert images to PDF',
			},
			{
				name: 'Markdown to PDF',
				value: 'markdownToPdf',
				description: 'Convert Markdown text/file to PDF',
				action: 'Convert markdown to PDF',
			},
			{
				name: 'PDF to Images',
				value: 'pdfToImages',
				description: 'Convert PDF pages into image files (PNG, JPEG, WebP)',
				action: 'Convert PDF to images',
			},
			{
				name: 'PDF to PDF/A',
				value: 'pdfToPdfa',
				description: 'Convert PDF to archival PDF/A standard',
				action: 'Convert PDF to PDF/A',
			},
			{
				name: 'PDF to Text',
				value: 'pdfToText',
				description: 'Convert PDF to plain text or RTF format',
				action: 'Convert PDF to text',
			},
			{
				name: 'PDF to Word',
				value: 'pdfToWord',
				description: 'Convert PDF to Word document (.docx, .doc, .odt)',
				action: 'Convert PDF to word',
			},
			{
				name: 'URL to PDF',
				value: 'urlToPdf',
				description: 'Render a website URL into a PDF document',
				action: 'Convert a URL to PDF',
			},
		],
		default: 'pdfToImages',
	},
];

export const convertFields: INodeProperties[] = [
	// ----------------------------------
	// convert: pdfToImages
	// ----------------------------------
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: [
					'pdfToImages',
					'fileToPdf',
					'markdownToPdf',
					'pdfToWord',
					'pdfToText',
					'pdfToPdfa',
				],
			},
		},
		description: 'Name of the binary property containing the input file',
	},
	{
		displayName: 'Image Format',
		name: 'imageFormat',
		type: 'options',
		options: [
			{ name: 'PNG', value: 'png' },
			{ name: 'JPEG', value: 'jpeg' },
			{ name: 'WebP', value: 'webp' },
			{ name: 'GIF', value: 'gif' },
		],
		default: 'png',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToImages'],
			},
		},
		description: 'Output image format',
	},
	{
		displayName: 'Single or Multiple Images',
		name: 'singleOrMultiple',
		type: 'options',
		options: [
			{ name: 'Separate Images (Zip Archive)', value: 'multiple' },
			{ name: 'Single Stitched Image', value: 'single' },
		],
		default: 'multiple',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToImages'],
			},
		},
		description: 'Whether to create separate images per page or combine all into one long image',
	},
	{
		displayName: 'DPI',
		name: 'dpi',
		type: 'number',
		default: 300,
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToImages'],
			},
		},
		description: 'DPI (dots per inch) resolution for rendered images',
	},
	{
		displayName: 'Page Numbers',
		name: 'pageNumbers',
		type: 'string',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToImages'],
			},
		},
		description: 'Pages to convert (e.g. "all", "1,3,5-9")',
	},
	{
		displayName: 'Color Type',
		name: 'colorType',
		type: 'options',
		options: [
			{ name: 'Color', value: 'color' },
			{ name: 'Greyscale', value: 'greyscale' },
			{ name: 'Black & White', value: 'blackwhite' },
		],
		default: 'color',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToImages'],
			},
		},
		description: 'Color mode for rendered images',
	},

	// ----------------------------------
	// convert: imagesToPdf
	// ----------------------------------
	{
		displayName: 'Input Mode',
		name: 'inputMode',
		type: 'options',
		options: [
			{
				name: 'Single Item (Comma-Separated Properties)',
				value: 'singleItem',
				description: 'Read multiple binary properties on the current item (e.g. data,data2)',
			},
			{
				name: 'Aggregate All Incoming Items',
				value: 'aggregateItems',
				description: 'Combine the binary property from all incoming items into one PDF',
			},
		],
		default: 'aggregateItems',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['imagesToPdf'],
			},
		},
		description: 'How to collect the input images',
	},
	{
		displayName: 'Binary Property Name(s)',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['imagesToPdf'],
			},
		},
		description: 'Name of the binary property (or comma-separated names if in Single Item mode)',
	},
	{
		displayName: 'Fit Option',
		name: 'fitOption',
		type: 'options',
		options: [
			{ name: 'Fill Page', value: 'fillPage' },
			{ name: 'Fit Document to Image', value: 'fitDocumentToImage' },
			{ name: 'Fit Document to Page', value: 'fitDocumentToPage' },
			{ name: 'Maintain Aspect Ratio', value: 'maintainAspectRatio' },
		],
		default: 'fillPage',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['imagesToPdf'],
			},
		},
		description: 'How the image will fit onto the page',
	},
	{
		displayName: 'Auto Rotate',
		name: 'autoRotate',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['imagesToPdf'],
			},
		},
		description: 'Whether to automatically rotate images to match page orientation',
	},

	// ----------------------------------
	// convert: urlToPdf
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'urlInput',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['urlToPdf'],
			},
		},
		description: 'Web page URL to convert to PDF',
	},

	// ----------------------------------
	// convert: htmlToPdf
	// ----------------------------------
	{
		displayName: 'HTML Input Source',
		name: 'htmlInputSource',
		type: 'options',
		options: [
			{ name: 'HTML String', value: 'string' },
			{ name: 'Binary Property (HTML / ZIP File)', value: 'binary' },
		],
		default: 'string',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['htmlToPdf'],
			},
		},
		description: 'Whether to supply raw HTML text or a binary file',
	},
	{
		displayName: 'HTML Content',
		name: 'htmlContent',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		default: '<html><body><h1>Hello World</h1></body></html>',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['htmlToPdf'],
				htmlInputSource: ['string'],
			},
		},
		description: 'HTML markup to convert to PDF',
	},
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['htmlToPdf'],
				htmlInputSource: ['binary'],
			},
		},
		description: 'Name of the binary property containing the HTML or ZIP file',
	},

	// ----------------------------------
	// convert: pdfToWord
	// ----------------------------------
	{
		displayName: 'Output Format',
		name: 'outputFormat',
		type: 'options',
		options: [
			{ name: 'DOCX', value: 'docx' },
			{ name: 'DOC', value: 'doc' },
			{ name: 'ODT', value: 'odt' },
		],
		default: 'docx',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToWord'],
			},
		},
		description: 'Target Word document format',
	},

	// ----------------------------------
	// convert: pdfToText
	// ----------------------------------
	{
		displayName: 'Output Format',
		name: 'textOutputFormat',
		type: 'options',
		options: [
			{ name: 'Plain Text (TXT)', value: 'txt' },
			{ name: 'Rich Text Format (RTF)', value: 'rtf' },
		],
		default: 'txt',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToText'],
			},
		},
		description: 'Target text format',
	},

	// ----------------------------------
	// convert: pdfToPdfa
	// ----------------------------------
	{
		displayName: 'PDF/A Standard',
		name: 'pdfaFormat',
		type: 'options',
		options: [
			{ name: 'PDF/A-1b', value: 'pdfa-1' },
			{ name: 'PDF/A-2b', value: 'pdfa-2b' },
			{ name: 'PDF/A-3b', value: 'pdfa-3b' },
			{ name: 'PDF/A', value: 'pdfa' },
		],
		default: 'pdfa-2b',
		displayOptions: {
			show: {
				resource: ['convert'],
				operation: ['pdfToPdfa'],
			},
		},
		description: 'Target PDF/A standard compliance level',
	},
];
