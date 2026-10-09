import type { INodeProperties } from 'n8n-workflow';

export const documentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['document'],
			},
		},
		options: [
			{
				name: 'Add Page Numbers',
				value: 'addPageNumbers',
				description: 'Insert page numbering into the PDF',
				action: 'Add page numbers to PDF',
			},
			{
				name: 'Add Watermark',
				value: 'addWatermark',
				description: 'Overlay a text watermark across PDF pages',
				action: 'Add watermark to PDF',
			},
			{
				name: 'Crop',
				value: 'crop',
				description: 'Crop margins or auto-crop white space from PDF pages',
				action: 'Crop PDF',
			},
			{
				name: 'Merge',
				value: 'merge',
				description: 'Merge multiple PDF files into a single document',
				action: 'Merge pd fs',
			},
			{
				name: 'Multi-Page Layout (N-Up)',
				value: 'multiPageLayout',
				description: 'Fit multiple pages per sheet (e.g. 2-up, 4-up)',
				action: 'Create multi page layout',
			},
			{
				name: 'Rearrange Pages',
				value: 'rearrange',
				description: 'Reorder, reverse, duplicate, or remove pages',
				action: 'Rearrange pages in PDF',
			},
			{
				name: 'Rotate',
				value: 'rotate',
				description: 'Rotate PDF pages by 90, 180, or 270 degrees',
				action: 'Rotate PDF',
			},
			{
				name: 'Scale / Resize Pages',
				value: 'scalePages',
				description: 'Change page paper sizes (A4, Letter) or scale content',
				action: 'Scale or resize pages',
			},
			{
				name: 'Split',
				value: 'split',
				description: 'Split PDF into separate documents by page numbers or cut points',
				action: 'Split PDF',
			},
		],
		default: 'merge',
	},
];

export const documentFields: INodeProperties[] = [
	// ----------------------------------
	// document: merge
	// ----------------------------------
	{
		displayName: 'Input Mode',
		name: 'inputMode',
		type: 'options',
		options: [
			{
				name: 'Aggregate All Incoming Items',
				value: 'aggregateItems',
				description: 'Combine the binary property from all incoming items into one merged PDF',
			},
			{
				name: 'Single Item (Comma-Separated Properties)',
				value: 'singleItem',
				description: 'Read multiple binary properties on the current item (e.g. data,data2)',
			},
		],
		default: 'aggregateItems',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['merge'],
			},
		},
		description: 'How to collect the input PDF files to merge',
	},
	{
		displayName: 'Binary Property Name(s)',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: [
					'merge',
					'split',
					'rotate',
					'crop',
					'addPageNumbers',
					'addWatermark',
					'rearrange',
					'multiPageLayout',
					'scalePages',
				],
			},
		},
		description:
			'Name of the binary property (or comma-separated property names if in Single Item mode for Merge)',
	},
	{
		displayName: 'Sort Type',
		name: 'sortType',
		type: 'options',
		options: [
			{ name: 'Order Provided', value: 'orderProvided' },
			{ name: 'By File Name', value: 'byFileName' },
			{ name: 'By Date Modified', value: 'byDateModified' },
			{ name: 'By PDF Title', value: 'byPDFTitle' },
		],
		default: 'orderProvided',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['merge'],
			},
		},
		description: 'The order in which the files should be merged',
	},
	{
		displayName: 'Generate Table of Contents',
		name: 'generateToc',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['merge'],
			},
		},
		description: 'Whether to generate a table of contents using filenames as chapter titles',
	},
	{
		displayName: 'Remove Cert Signatures',
		name: 'removeCertSign',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['merge'],
			},
		},
		description: 'Whether to remove digital certificate signatures from the merged PDF',
	},

	// ----------------------------------
	// document: split
	// ----------------------------------
	{
		displayName: 'Page Numbers / Cut Points',
		name: 'pageNumbers',
		type: 'string',
		default: 'all',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['split'],
			},
		},
		description:
			'Page numbers after which to split (e.g. "2" splits into 1-2 and 3+; "all" splits every page into individual files)',
	},

	// ----------------------------------
	// document: rotate
	// ----------------------------------
	{
		displayName: 'Rotation Angle',
		name: 'angle',
		type: 'options',
		options: [
			{ name: '90° Clockwise', value: 90 },
			{ name: '180° Half Turn', value: 180 },
			{ name: '270° (90° Counter-Clockwise)', value: 270 },
		],
		default: 90,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['rotate'],
			},
		},
		description: 'Clockwise angle by which to rotate all pages',
	},

	// ----------------------------------
	// document: crop
	// ----------------------------------
	{
		displayName: 'Auto Crop',
		name: 'autoCrop',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['crop'],
			},
		},
		description: 'Whether to automatically detect and trim white space margins',
	},
	{
		displayName: 'Crop X',
		name: 'cropX',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['crop'],
				autoCrop: [false],
			},
		},
		description: 'Top-left corner X coordinate (in points)',
	},
	{
		displayName: 'Crop Y',
		name: 'cropY',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['crop'],
				autoCrop: [false],
			},
		},
		description: 'Top-left corner Y coordinate (in points)',
	},
	{
		displayName: 'Crop Width',
		name: 'cropWidth',
		type: 'number',
		default: 500,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['crop'],
				autoCrop: [false],
			},
		},
		description: 'Width of the crop area (in points)',
	},
	{
		displayName: 'Crop Height',
		name: 'cropHeight',
		type: 'number',
		default: 700,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['crop'],
				autoCrop: [false],
			},
		},
		description: 'Height of the crop area (in points)',
	},

	// ----------------------------------
	// document: addPageNumbers
	// ----------------------------------
	{
		displayName: 'Position',
		name: 'pageNumberPosition',
		type: 'options',
		options: [
			{ name: 'Bottom Center (Default)', value: 8 },
			{ name: 'Bottom Right', value: 9 },
			{ name: 'Bottom Left', value: 7 },
			{ name: 'Top Center', value: 2 },
			{ name: 'Top Right', value: 3 },
			{ name: 'Top Left', value: 1 },
		],
		default: 8,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addPageNumbers'],
			},
		},
		description: 'Placement of the page number on the sheet',
	},
	{
		displayName: 'Custom Text Format',
		name: 'customText',
		type: 'string',
		default: 'Page {n} of {total}',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addPageNumbers'],
			},
		},
		description: 'Text pattern with placeholders: {n}=page number, {total}=total pages',
	},
	{
		displayName: 'Starting Number',
		name: 'startingNumber',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addPageNumbers'],
			},
		},
		description: 'First page number to count from',
	},
	{
		displayName: 'Font Size',
		name: 'fontSize',
		type: 'number',
		default: 12,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addPageNumbers'],
			},
		},
		description: 'Font size in points',
	},
	{
		displayName: 'Font Family',
		name: 'fontType',
		type: 'options',
		options: [
			{ name: 'Helvetica', value: 'helvetica' },
			{ name: 'Times', value: 'times' },
			{ name: 'Courier', value: 'courier' },
		],
		default: 'helvetica',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addPageNumbers'],
			},
		},
		description: 'Font family to use for numbering',
	},

	// ----------------------------------
	// document: addWatermark
	// ----------------------------------
	{
		displayName: 'Watermark Text',
		name: 'watermarkText',
		type: 'string',
		default: 'CONFIDENTIAL',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addWatermark'],
			},
		},
		description: 'Text content of the watermark',
	},
	{
		displayName: 'Opacity',
		name: 'watermarkOpacity',
		type: 'number',
		default: 0.3,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addWatermark'],
			},
		},
		description: 'Transparency from 0.0 (fully transparent) to 1.0 (opaque)',
	},
	{
		displayName: 'Rotation (Degrees)',
		name: 'watermarkRotation',
		type: 'number',
		default: 45,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addWatermark'],
			},
		},
		description: 'Angle of the watermark text across pages',
	},
	{
		displayName: 'Font Size',
		name: 'watermarkFontSize',
		type: 'number',
		default: 40,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['addWatermark'],
			},
		},
		description: 'Font size of the watermark text',
	},

	// ----------------------------------
	// document: rearrange
	// ----------------------------------
	{
		displayName: 'Mode',
		name: 'rearrangeMode',
		type: 'options',
		options: [
			{ name: 'Booklet Sort', value: 'BOOKLET_SORT' },
			{ name: 'Custom Page Order', value: 'CUSTOM' },
			{ name: 'Duplex Sort (Scanned Backs & Fronts)', value: 'DUPLEX_SORT' },
			{ name: 'Odd / Even Split', value: 'ODD_EVEN_SPLIT' },
			{ name: 'Remove First and Last Pages', value: 'REMOVE_FIRST_AND_LAST' },
			{ name: 'Remove First Page', value: 'REMOVE_FIRST' },
			{ name: 'Remove Last Page', value: 'REMOVE_LAST' },
			{ name: 'Reverse Order', value: 'REVERSE_ORDER' },
		],
		default: 'REVERSE_ORDER',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['rearrange'],
			},
		},
		description: 'Rearrangement pattern to apply',
	},
	{
		displayName: 'Page Order',
		name: 'rearrangePageNumbers',
		type: 'string',
		default: '1,3,2',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['rearrange'],
				rearrangeMode: ['CUSTOM'],
			},
		},
		description: 'Comma-separated new page sequence (e.g. "1,3,2")',
	},

	// ----------------------------------
	// document: multiPageLayout
	// ----------------------------------
	{
		displayName: 'Pages per Sheet',
		name: 'pagesPerSheet',
		type: 'options',
		options: [
			{ name: '2 Pages per Sheet (2-Up)', value: 2 },
			{ name: '4 Pages per Sheet (4-Up)', value: 4 },
		],
		default: 2,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['multiPageLayout'],
			},
		},
		description: 'Number of input pages to fit onto each output sheet',
	},

	// ----------------------------------
	// document: scalePages
	// ----------------------------------
	{
		displayName: 'Target Page Size',
		name: 'pageSize',
		type: 'options',
		options: [
			{ name: 'A3', value: 'A3' },
			{ name: 'A4', value: 'A4' },
			{ name: 'A5', value: 'A5' },
			{ name: 'Keep Original Dimensions', value: 'KEEP' },
			{ name: 'Legal', value: 'LEGAL' },
			{ name: 'Letter', value: 'LETTER' },
		],
		default: 'A4',
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['scalePages'],
			},
		},
		description: 'Paper dimensions for output pages',
	},
	{
		displayName: 'Scale Factor',
		name: 'scaleFactor',
		type: 'number',
		default: 1,
		displayOptions: {
			show: {
				resource: ['document'],
				operation: ['scalePages'],
			},
		},
		description: 'Content zoom multiplier (1.0 = 100%)',
	},
];
