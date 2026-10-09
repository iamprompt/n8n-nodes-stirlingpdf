import type { INodeProperties } from 'n8n-workflow';

export const securityOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['security'],
			},
		},
		options: [
			{
				name: 'Add Password',
				value: 'addPassword',
				description: 'Encrypt PDF and set user/owner passwords and permissions',
				action: 'Add password to PDF',
			},
			{
				name: 'Auto Redact',
				value: 'autoRedact',
				description: 'Automatically redact matching keywords or regex patterns in PDF',
				action: 'Auto redact PDF',
			},
			{
				name: 'Remove Password',
				value: 'removePassword',
				description: 'Decrypt and remove password protection from PDF',
				action: 'Remove password from PDF',
			},
			{
				name: 'Sanitize',
				value: 'sanitize',
				description: 'Remove JavaScript, embedded files, and metadata from PDF',
				action: 'Sanitize PDF',
			},
		],
		default: 'addPassword',
	},
];

export const securityFields: INodeProperties[] = [
	{
		displayName: 'Binary Property Name',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword', 'removePassword', 'sanitize', 'autoRedact'],
			},
		},
		description: 'Name of the binary property containing the input PDF',
	},

	// ----------------------------------
	// security: addPassword
	// ----------------------------------
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword'],
			},
		},
		description: 'The password required to open and read the document',
	},
	{
		displayName: 'Owner Password',
		name: 'ownerPassword',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword'],
			},
		},
		description: 'Owner password required to change permissions and edit document',
	},
	{
		displayName: 'Key Length (Bits)',
		name: 'keyLength',
		type: 'options',
		options: [
			{ name: '256-Bit (AES Recommended)', value: 256 },
			{ name: '128-Bit (AES)', value: 128 },
			{ name: '40-Bit (Legacy)', value: 40 },
		],
		default: 256,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword'],
			},
		},
		description: 'Encryption key length',
	},
	{
		displayName: 'Prevent Printing',
		name: 'preventPrinting',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword'],
			},
		},
		description: 'Whether to restrict printing permissions',
	},
	{
		displayName: 'Prevent Modifying',
		name: 'preventModify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword'],
			},
		},
		description: 'Whether to restrict document modification',
	},
	{
		displayName: 'Prevent Extracting Content',
		name: 'preventExtractContent',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['addPassword'],
			},
		},
		description: 'Whether to restrict copying and extracting content',
	},

	// ----------------------------------
	// security: removePassword
	// ----------------------------------
	{
		displayName: 'Current Password',
		name: 'currentPassword',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['removePassword'],
			},
		},
		description: 'Current document password needed to decrypt and unlock',
	},

	// ----------------------------------
	// security: autoRedact
	// ----------------------------------
	{
		displayName: 'Text to Redact',
		name: 'listOfText',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'SSN, Secret, Confidential',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['autoRedact'],
			},
		},
		description: 'Comma-separated terms or regex patterns to redact',
	},
	{
		displayName: 'Use Regular Expression',
		name: 'useRegex',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['autoRedact'],
			},
		},
		description: 'Whether search patterns should be evaluated as regex',
	},
	{
		displayName: 'Whole Word Search',
		name: 'wholeWordSearch',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['autoRedact'],
			},
		},
		description: 'Whether to match only whole words',
	},
	{
		displayName: 'Redact Box Color',
		name: 'redactColor',
		type: 'color',
		default: '#000000',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['autoRedact'],
			},
		},
		description: 'Color of the blackout redaction box',
	},

	// ----------------------------------
	// security: sanitize
	// ----------------------------------
	{
		displayName: 'Remove JavaScript',
		name: 'removeJavaScript',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['sanitize'],
			},
		},
		description: 'Whether to strip embedded JavaScript actions',
	},
	{
		displayName: 'Remove Embedded Files',
		name: 'removeEmbeddedFiles',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['sanitize'],
			},
		},
		description: 'Whether to strip file attachments',
	},
	{
		displayName: 'Remove Document Metadata',
		name: 'removeMetadata',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['sanitize'],
			},
		},
		description: 'Whether to strip author, title, and standard metadata',
	},
];
