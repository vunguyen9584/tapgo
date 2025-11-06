 # Keyboard Master (React + TypeScript + Tailwind + Vite)

A modern, responsive typing practice app with real‑time WPM, accuracy, and results chart.

## Features
- Random quote typing with visual feedback (correct/incorrect, animated caret)
- Real‑time metrics: WPM, accuracy, timer (15/30/60/120s)
- Auto‑finish on timer end or when text completes
- Results modal with Net WPM, accuracy, correct/incorrect counts, and WPM‑over‑time chart
- Clean, responsive UI using Tailwind CSS

## Quick start
1. Install dependencies:
   - npm install
2. Start dev server:
   - npm run dev
3. Build for production:
   - npm run build
4. Preview production build:
   - npm run preview

## Project structure
```
.
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    ├── components/
    │   ├── Metrics.tsx
    │   ├── Results.tsx
    │   └── TypingArea.tsx
    ├── styles/
    │   └── styles.css  (includes Tailwind directives + caret styles)
    ├── types/
    │   └── index.ts
    └── utils/
        └── text.ts
```

## Notes
- Tailwind is configured to scan `index.html` and `src/**/*.{ts,tsx}`.
- The app’s entry point is `src/main.tsx`; global styles live in `src/styles/styles.css`.
