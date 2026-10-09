import type { IDataObject, IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import type {
	IStirlingPdfCredentials,
	IStirlingRequestOptions,
	IStirlingResponseResult,
} from './types';
import { extractFilenameFromContentDisposition } from './utils';

export async function makeStirlingRequest(
	context: IExecuteFunctions,
	options: IStirlingRequestOptions,
	itemIndex: number = 0,
): Promise<IStirlingResponseResult> {
	const credentials = (await context.getCredentials(
		'stirlingPdfApi',
		itemIndex,
	)) as unknown as IStirlingPdfCredentials;

	let baseUrl = credentials.baseUrl || 'http://localhost:8080';
	baseUrl = baseUrl.replace(/\/+$/, '');

	const form = new FormData();

	if (options.files && options.files.length > 0) {
		for (const file of options.files) {
			const blob = new Blob([file.data], {
				type: file.mimeType || 'application/octet-stream',
			});
			form.append(file.name, blob, file.fileName);
		}
	}

	if (options.fields) {
		for (const [key, val] of Object.entries(options.fields)) {
			if (val !== undefined && val !== null) {
				if (Array.isArray(val)) {
					for (const item of val) {
						form.append(key, String(item));
					}
				} else {
					form.append(key, String(val));
				}
			}
		}
	}

	const headers: Record<string, string> = {};

	if (credentials.apiKey && credentials.apiKey.trim().length > 0) {
		headers['X-API-KEY'] = credentials.apiKey.trim();
	}

	const isBinaryResponse = options.responseType !== 'json';

	try {
		const response = await context.helpers.httpRequest({
			method: options.method || 'POST',
			url: `${baseUrl}${options.endpoint}`,
			headers,
			body: form,
			skipSslCertificateValidation: !!credentials.ignoreSslIssues,
			encoding: isBinaryResponse ? 'arraybuffer' : 'json',
			returnFullResponse: true,
		});

		if (isBinaryResponse) {
			const resBuffer = Buffer.isBuffer(response.body)
				? response.body
				: Buffer.from(response.body as ArrayBuffer);

			const contentDisposition = (response.headers['content-disposition'] ||
				response.headers['Content-Disposition']) as string | undefined;

			const contentType = (response.headers['content-type'] ||
				response.headers['Content-Type'] ||
				options.fallbackMimeType ||
				'application/pdf') as string;

			const fileName = extractFilenameFromContentDisposition(
				contentDisposition,
				options.fallbackFileName || 'output.pdf',
			);

			const outputProp = options.outputBinaryProperty || 'data';
			const binary = await context.helpers.prepareBinaryData(
				resBuffer,
				fileName,
				contentType.split(';')[0].trim(),
			);

			return {
				binaryData: {
					[outputProp]: binary,
				},
				jsonData: {
					fileName,
					mimeType: contentType,
					size: resBuffer.length,
				},
			};
		}

		return {
			jsonData: response.body as IDataObject,
		};
	} catch (error: unknown) {
		const err = error as {
			statusCode?: number;
			response?: { status?: number; data?: Buffer | string | unknown };
		};

		let parsedMessage: string | undefined;
		if (err.response?.data) {
			try {
				const raw = Buffer.isBuffer(err.response.data)
					? err.response.data.toString('utf-8')
					: String(err.response.data);
				const parsed = JSON.parse(raw);
				parsedMessage = parsed.message || parsed.error || raw;
			} catch {
				parsedMessage =
					typeof (err.response.data as { toString?: () => string })?.toString === 'function'
						? (err.response.data as { toString: () => string }).toString()
						: String(err.response.data);
			}
		}

		if (parsedMessage) {
			throw new NodeApiError(context.getNode(), error as JsonObject, {
				message: `Stirling-PDF API Error (${err.statusCode || err.response?.status || 500}): ${parsedMessage}`,
				itemIndex,
			});
		}

		throw new NodeApiError(context.getNode(), error as JsonObject, { itemIndex });
	}
}
