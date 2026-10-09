import type { INodeProperties } from 'n8n-workflow';

export const optimizeOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['optimize'],
			},
		},
		options: [
			{
				name: 'Compress / Optimize',
				value: 'compress',
				description: 'Reduce PDF file size and apply web linearization',
				action: 'Compress or optimize PDF',
			},
			{
				name: 'Flatten',
				value: 'flatten',
				description: 'Flatten form fields or whole document into static non-editable elements',
				action: 'Flatten PDF',
			},
			{
				name: 'Repair',
				value: 'repair',
				description: 'Attempt to recover and repair corrupted or damaged PDF files',
				action: 'Repair PDF',
			},
		],
		default: 'compress',
	},
];

export const optimizeFields: INodeProperties[] = [
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['optimize'],
				operation: ['compress', 'repair', 'flatten'],
			},
		},
		description: 'Name of the binary property containing the input PDF',
	},

	// ----------------------------------
	// optimize: compress
	// ----------------------------------
	{
		displayName: 'Compression Level',
		name: 'optimizeLevel',
		type: 'options',
		options: [
			{ name: 'Low (Preserve High Quality)', value: 1 },
			{ name: 'Medium (Balanced Quality & Size)', value: 2 },
			{ name: 'High (Smallest Size)', value: 3 },
			{ name: 'Extreme (Very Aggressive)', value: 4 },
		],
		default: 2,
		displayOptions: {
			show: {
				resource: ['optimize'],
				operation: ['compress'],
			},
		},
		description: 'Level of compression to apply',
	},
	{
		displayName: 'Linearize (Fast Web View)',
		name: 'linearize',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['optimize'],
				operation: ['compress'],
			},
		},
		description: 'Whether to organize the PDF for progressive page-at-a-time downloading in browsers',
	},
	{
		displayName: 'Convert to Grayscale',
		name: 'grayscale',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['optimize'],
				operation: ['compress'],
			},
		},
		description: 'Whether to convert all color images and text to grayscale',
	},

	// ----------------------------------
	// optimize: flatten
	// ----------------------------------
	{
		displayName: 'Flatten Scope',
		name: 'flattenOnlyForms',
		type: 'options',
		options: [
			{ name: 'Forms Only (Retain Text, Lock Inputs)', value: true },
			{ name: 'Entire Document (Convert Pages to Raster Images)', value: false },
		],
		default: true,
		displayOptions: {
			show: {
				resource: ['optimize'],
				operation: ['flatten'],
			},
		},
		description: 'Whether to lock and flatten only interactive form fields or rasterize the whole document',
	},
];
