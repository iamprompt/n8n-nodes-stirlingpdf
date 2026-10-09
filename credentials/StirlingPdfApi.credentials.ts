import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	INodeTypeDescription,
} from 'n8n-workflow';

export class StirlingPdfApi implements ICredentialType {
	name = 'stirlingPdfApi';

	displayName = 'Stirling-PDF API';

	documentationUrl = 'https://github.com/Stirling-Tools/Stirling-PDF';

	icon: INodeTypeDescription['icon'] = {
		light: 'file:../icons/stirlingpdf.svg',
		dark: 'file:../icons/stirlingpdf.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:8080',
			placeholder: 'https://pdf.iamprompt.me',
			required: true,
			description:
				'The base URL where Stirling-PDF is hosted (e.g. http://localhost:8080 or https://pdf.example.com)',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
				'API key if your Stirling-PDF instance has authentication enabled (sent as X-API-KEY header). Leave empty if authentication is not enabled.',
		},
		{
			displayName: 'Ignore SSL Issues',
			name: 'ignoreSslIssues',
			type: 'boolean',
			default: false,
			description:
				'Whether to ignore SSL/TLS certificate validation errors (useful for self-signed certificates in private homelabs)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-KEY': '={{$credentials.apiKey || undefined}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/v1/api-docs',
			skipSslCertificateValidation: '={{$credentials.ignoreSslIssues}}',
			headers: {
				'X-API-KEY': '={{$credentials.apiKey || undefined}}',
			},
		},
	};
}
