# DarkPDF

Convert any PDF into a beautiful, eye-friendly dark-mode PDF — entirely in your browser. No login, no upload, no tracking.

![Status](https://img.shields.io/badge/status-production-ready-brightgreen)

## ✨ Features

- 🎨 **Smart conversion** — backgrounds and text are recoloured, but images, charts, and colourful graphics are preserved.
- 🖼 **Region-aware** — local-variance + saturation analysis detects photo regions and keeps them intact.
- 🎭 **Five themes** — AMOLED Black, Dark Gray, Midnight Blue, Sepia Dark, Low Contrast.
- 🎚 **Brightness & contrast sliders** — fine-tune for your reading comfort.
- 👁 **Side-by-side preview** — see original vs. converted live.
- ⚡ **Web-Worker pipeline** — pixel transforms run off the main thread; UI never freezes.
- 🔒 **Zero server** — every byte stays on your device.
- 📱 **Responsive** — works great on mobile & desktop.
- ⌨ **Keyboard shortcuts** — `← / →` change page, `Cmd/Ctrl + Enter` to convert.

## 🧱 Tech Stack

| Layer            | Library             |
|------------------|---------------------|
| UI               | React 18 + Vite     |
| Styling          | Tailwind CSS 3      |
| PDF rendering    | PDF.js (`pdfjs-dist`) |
| PDF authoring    | `pdf-lib`           |
| Pixel work       | Canvas API + Web Workers |

## 🚀 Quick start

```bash
# 1. install
npm install

# 2. dev server
npm run dev

# 3. production build
npm run build
npm run preview