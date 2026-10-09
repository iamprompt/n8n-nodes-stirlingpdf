import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { makeStirlingRequest } from '../../shared/transport';
import { getBinaryBuffer } from '../../shared/utils';

export async function executeSecurity(
	this: IExecuteFunctions,
	operation: string,
	itemIndex: number,
): Promise<INodeExecutionData> {
	if (operation === 'addPassword') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const password = this.getNodeParameter('password', itemIndex, '') as string;
		const ownerPassword = this.getNodeParameter('ownerPassword', itemIndex, '') as string;
		const keyLength = this.getNodeParameter('keyLength', itemIndex, 256) as number;
		const preventPrinting = this.getNodeParameter('preventPrinting', itemIndex, false) as boolean;
		const preventModify = this.getNodeParameter('preventModify', itemIndex, false) as boolean;
		const preventExtractContent = this.getNodeParameter('preventExtractContent', itemIndex, false) as boolean;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/security/add-password',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					password,
					ownerPassword: ownerPassword || password,
					keyLength,
					preventPrinting,
					preventModify,
					preventExtractContent,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_protected.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'removePassword') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const password = this.getNodeParameter('currentPassword', itemIndex, '') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/security/remove-password',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					password,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_unlocked.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'autoRedact') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const listOfText = this.getNodeParameter('listOfText', itemIndex, '') as string;
		const useRegex = this.getNodeParameter('useRegex', itemIndex, false) as boolean;
		const wholeWordSearch = this.getNodeParameter('wholeWordSearch', itemIndex, false) as boolean;
		const redactColor = this.getNodeParameter('redactColor', itemIndex, '#000000') as string;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/security/auto-redact',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					listOfText,
					useRegex,
					wholeWordSearch,
					redactColor,
					convertPDFToImage: false,
					customPadding: 0,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_redacted.pdf`,
				fallbackMimeType: 'application/pdf',
			},
			itemIndex,
		);

		return {
			json: result.jsonData || {},
			binary: result.binaryData,
		};
	}

	if (operation === 'sanitize') {
		const prop = (this.getNodeParameter('binaryPropertyName', itemIndex, 'data') as string) || 'data';
		const { buffer, fileName } = await getBinaryBuffer(this, itemIndex, prop);
		const removeJavaScript = this.getNodeParameter('removeJavaScript', itemIndex, true) as boolean;
		const removeEmbeddedFiles = this.getNodeParameter('removeEmbeddedFiles', itemIndex, true) as boolean;
		const removeMetadata = this.getNodeParameter('removeMetadata', itemIndex, true) as boolean;

		const result = await makeStirlingRequest(
			this,
			{
				endpoint: '/api/v1/security/sanitize-pdf',
				files: [
					{
						name: 'fileInput',
						data: buffer,
						fileName,
						mimeType: 'application/pdf',
					},
				],
				fields: {
					removeJavaScript,
					removeEmbeddedFiles,
					removeMetadata,
					removeXMPMetadata: removeMetadata,
					removeLinks: false,
					removeFonts: false,
				},
				fallbackFileName: `${fileName.replace(/\.pdf$/i, '')}_sanitized.pdf`,
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
