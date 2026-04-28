# GapCheck

A submission checker for students. Paste your assignment requirements and your submitted work — GapCheck compares them and tells you what's met, what's partial, and what's missing before you hand anything in.

## What it does

Most students lose marks not because they didn't do the work, but because they forgot to include something. GapCheck solves that by doing a direct comparison between what was asked and what was submitted, using AI to understand meaning rather than just matching keywords.

The result is a scored report — per requirement — with specific suggestions on what to fix.

There's also a cover page generator for formatting a clean, printable cover page without having to set it up manually each time.

## Stack

- React + TypeScript (Vite)
- Groq API — `llama-3.3-70b-versatile` for the AI comparison
- `pdfjs-dist` — PDF text extraction
- `tesseract.js` — OCR for image files
- `mammoth` — Word document (.docx) extraction
- CSS variables for theming, dark mode via `prefers-color-scheme`

## Project structure

```
src/
├── api/
│   └── ai.ts
├── utils/
│   └── extractText.ts
├── components/
│   └── ComparePage/
│       ├── ComparePage.tsx
│       ├── ComparePage.css
│       ├── InputPanel.tsx
│       ├── ScoreBlock.tsx
│       └── ResultCard.tsx
├── types/
│   └── index.ts
├── App.tsx
├── App.css
└── index.css
```

## Getting started

**1. Clone and install**

```bash
git clone https://github.com/your-username/gapcheck.git
cd gapcheck
npm install
```

**2. Get a Groq API key**

Go to [console.groq.com](https://console.groq.com), sign in, and create an API key. It's free.

**3. Create a `.env` file in the project root**

```
VITE_GROQ_API_KEY=your_key_here
```

**4. Run the dev server**

```bash
npm run dev
```

Open `http://localhost:5173`.

## Supported file types

Both the requirements and submission sides accept:

| Type | Extension | How it's handled |
|---|---|---|
| Word document | .docx | `mammoth` extracts raw text |
| PDF | .pdf | `pdfjs-dist` reads page by page |
| Image | .jpg .png .webp | `tesseract.js` runs OCR |
| Plain text | .txt .md | base64 decoded directly |

You can also just type or paste text directly without uploading anything.

## How the comparison works

The requirement and submission content — whether typed or extracted from a file — are sent to Groq's Llama model with a structured prompt. The model returns a JSON object with a status for each requirement (`met`, `partial`, or `missing`), a suggestion for anything not fully met, and a two-sentence overall summary.

The score is calculated as:

```
score = ((met + partial × 0.5) / total) × 100
```


## Environment variables

| Variable | Description |
|---|---|
| `VITE_GROQ_API_KEY` | Your Groq API key |


## Local development notes

- The Vite dev server runs on port 5173 by default
- On mobile, open `http://YOUR_LOCAL_IP:5173` to test the responsive layout
- The print dialog in Cover Page uses the browser's native print — choose "Save as PDF" to download

## License

MIT