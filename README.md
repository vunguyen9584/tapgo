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

## Firebase configuration (Google Sign‑In + progress storage)

The app supports Google Sign‑In and saves lesson progress to Cloud Firestore. If Firebase is not configured, the Login button is disabled and progress is stored in browser `localStorage` instead.

1) Create a Firebase Project and a Web App
- Go to https://console.firebase.google.com → Add project.
- Project settings → Your apps → Web app (</>) → Register app to obtain the Web SDK config.

2) Enable Authentication (Google)
- Authentication → Sign‑in method → Google → Enable.
- Add your dev domain (e.g. `http://localhost:5173`) to Authorized domains if needed.

3) Enable Cloud Firestore
- Firestore Database → Create database.
- Recommended basic rules for user document `users/{uid}`:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4) Create environment file for Vite variables
- In the project root, create `.env.local` (do not commit) with values from your Web SDK config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

5) Restart the dev server
- Stop `npm run dev` (if running) and start it again to load environment variables.

Technical notes:
- Config is consumed in `src/lib/firebase.ts` via `import.meta.env.*`. When variables are present, `firebaseEnabled` is true; the app uses Google Auth and writes progress to `users/{uid}` (field `lessons`).
- Without config, the app runs offline and stores progress in `localStorage` key `km_lessons`.
