import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function extractFilenameFromContentDisposition(
	header: string | string[] | undefined,
	fallback: string,
): string {
	if (!header) return fallback;
	const headerStr = Array.isArray(header) ? header[0] : header;
	const match = /filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i.exec(headerStr);
	if (match && match[1]) {
		try {
			return decodeURIComponent(match[1].trim());
		} catch {
			return match[1].trim();
		}
	}
	return fallback;
}

export async function getBinaryBuffer(
	context: IExecuteFunctions,
	itemIndex: number,
	propertyName: string,
): Promise<{ buffer: Buffer; fileName: string; mimeType: string }> {
	const item = context.getInputData(itemIndex)[0];
	if (!item || !item.binary || !item.binary[propertyName]) {
		throw new NodeOperationError(
			context.getNode(),
			`No binary data found in property "${propertyName}" on item index ${itemIndex}`,
			{ itemIndex },
		);
	}

	const binaryData = item.binary[propertyName];
	const buffer = await context.helpers.getBinaryDataBuffer(itemIndex, propertyName);
	const fileName = binaryData.fileName || 'document.pdf';
	const mimeType = binaryData.mimeType || 'application/pdf';

	return { buffer, fileName, mimeType };
}

export async function getAllBinaryBuffers(
	context: IExecuteFunctions,
	itemIndex: number,
	propertyNames: string[],
): Promise<Array<{ buffer: Buffer; fileName: string; mimeType: string }>> {
	const buffers: Array<{ buffer: Buffer; fileName: string; mimeType: string }> = [];
	for (const prop of propertyNames) {
		const trimmed = prop.trim();
		if (!trimmed) continue;
		const res = await getBinaryBuffer(context, itemIndex, trimmed);
		buffers.push(res);
	}
	return buffers;
}

export async function aggregateBinaryFromAllItems(
	context: IExecuteFunctions,
	propertyName: string,
): Promise<Array<{ buffer: Buffer; fileName: string; mimeType: string }>> {
	const items = context.getInputData();
	const buffers: Array<{ buffer: Buffer; fileName: string; mimeType: string }> = [];

	for (let i = 0; i < items.length; i++) {
		const itm = items[i];
		if (itm?.binary && itm.binary[propertyName]) {
			const res = await getBinaryBuffer(context, i, propertyName);
			buffers.push(res);
		}
	}

	if (buffers.length === 0) {
		throw new NodeOperationError(
			context.getNode(),
			`No binary data found in property "${propertyName}" across all ${items.length} incoming items`,
		);
	}

	return buffers;
}
