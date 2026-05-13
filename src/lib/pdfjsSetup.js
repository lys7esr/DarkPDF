import * as pdfjsLib from 'pdfjs-dist';

// Worker is copied to /public via postinstall script
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export { pdfjsLib };