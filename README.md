# n8n-nodes-stirlingpdf

[![npm version](https://img.shields.io/npm/v/n8n-nodes-stirlingpdf.svg)](https://www.npmjs.com/package/n8n-nodes-stirlingpdf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An [n8n](https://n8n.io) community node for [Stirling-PDF](https://github.com/Stirling-Tools/Stirling-PDF), a powerful open-source web application for PDF manipulation.

---

## Features

This node exposes the core document processing operations of Stirling-PDF organized into 5 major resources:

### 1. Convert (`convert`)
- **PDF to Images**: Convert PDF pages into PNG, JPEG, WebP, or GIF (single stitched image or zip archive).
- **Images to PDF**: Convert one or multiple images into a single PDF (supports both single-item and multi-item workflow aggregation).
- **File / Office to PDF**: Convert DOCX, PPTX, XLSX, ODT, TXT, and other LibreOffice-supported documents to PDF.
- **URL to PDF**: Render web pages from a URL directly to PDF.
- **HTML to PDF**: Convert raw HTML strings or HTML/ZIP packages to PDF.
- **Markdown to PDF**: Convert Markdown text/files to formatted PDF.
- **PDF to Word**: Convert PDF into DOCX, DOC, or ODT.
- **PDF to Text**: Extract content to Plain Text (.txt) or Rich Text (.rtf).
- **PDF to PDF/A**: Standardize PDF into archival formats (PDF/A-1b, PDF/A-2b, PDF/A-3b).

### 2. Document Operations (`document`)
- **Merge**: Combine multiple PDF files into one (supports multi-item batch aggregation or comma-separated property names, optional table of contents generation).
- **Split**: Split PDFs by cut points, page ranges, or into individual single-page documents.
- **Rotate**: Rotate all pages by 90°, 180°, or 270°.
- **Crop**: Auto-crop whitespace margins or specify exact bounding boxes (x, y, width, height).
- **Add Page Numbers**: Insert customizable pagination with position selection, font choice, and format strings (e.g. `Page {n} of {total}`).
- **Add Watermark**: Add text watermarks with customizable opacity, rotation, and font size.
- **Rearrange Pages**: Reverse order, duplex sort (scanned front/back sheets), booklet imposition, odd/even split, or custom page sequences.
- **Multi-Page Layout (N-Up)**: Place 2 or 4 pages per sheet.
- **Scale / Resize Pages**: Change paper dimensions (A4, Letter, Legal, etc.) and scale content.

### 3. Security & Sign (`security`)
- **Add Password**: Encrypt PDF with user and owner passwords and set permissions (printing, modifying, content extraction).
- **Remove Password**: Decrypt password-protected PDFs.
- **Auto Redact**: Blackout matching keywords or regular expression patterns.
- **Sanitize**: Strip embedded JavaScript, attached files, and document metadata.

### 4. Optimize & Repair (`optimize`)
- **Compress / Optimize**: Reduce PDF file size with selectable compression levels, fast web view linearization, and grayscale conversion.
- **Flatten**: Flatten interactive form fields or rasterize the entire document.
- **Repair**: Recover corrupted or malformed PDF files.

### 5. OCR & Extract (`ocr`)
- **OCR PDF**: Run OCR to make scanned documents searchable using customizable language packs and render modes (HOCR, Sandwich).
- **Extract Images**: Extract all embedded images from the PDF into a ZIP archive.
- **Extract Text**: Extract all text from the PDF into a text file.

---

## Installation

### In n8n (Community Nodes)
1. Go to **Settings > Community Nodes** in your n8n instance.
2. Select **Install**.
3. Enter `n8n-nodes-stirlingpdf` and confirm.

---

## Credentials Configuration

1. Create a **Stirling-PDF API** credential in n8n.
2. Configure:
   - **Base URL**: The URL where your Stirling-PDF instance is hosted (e.g. `http://localhost:8080` or `https://pdf.example.com`).
   - **API Key**: If your instance has authentication enabled, supply your API Key (sent as `X-API-KEY` header). Leave empty if authentication is disabled.
   - **Ignore SSL Issues**: Toggle on if your self-hosted instance uses a self-signed certificate.

---

## Development & Testing

This project is built using modern tooling (`pnpm`, `@n8n/node-cli`, TypeScript 5.8+, ESLint 9, and Vitest):

```bash
# Install dependencies
pnpm install

# Build the node package
pnpm run build

# Run lint checks
pnpm run lint

# Autofix lint formatting
pnpm run lint:fix

# Run unit tests
pnpm test

# Run live API integration tests against a live instance
STIRLING_API_KEY="your-key" pnpm test:live
```

---

## License

[MIT](LICENSE.md)
