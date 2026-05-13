import { copyFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.mjs');
const destDir = resolve(__dirname, '../public');
const dest = resolve(destDir, 'pdf.worker.min.mjs');

if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
copyFileSync(src, dest);
console.log('✓ PDF.js worker copied to /public');