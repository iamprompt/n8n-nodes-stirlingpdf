import type { IBinaryKeyData, IDataObject } from 'n8n-workflow';

export interface IStirlingPdfCredentials {
	baseUrl: string;
	apiKey?: string;
	ignoreSslIssues?: boolean;
}

export interface IBinaryFileParam {
	name: string;
	data: Buffer;
	fileName: string;
	mimeType?: string;
}

export interface IStirlingRequestOptions {
	endpoint: string;
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	files?: IBinaryFileParam[];
	fields?: Record<string, string | number | boolean | undefined | null | string[]>;
	responseType?: 'binary' | 'json';
	outputBinaryProperty?: string;
	fallbackFileName?: string;
	fallbackMimeType?: string;
}

export interface IStirlingResponseResult {
	binaryData?: IBinaryKeyData;
	jsonData?: IDataObject;
}
