# Source Tree

### Existing Project Structure

```
keyboard-master/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Charts/         # Chart components
│   │   ├── Metrics.tsx     # Performance metrics display
│   │   ├── Results.tsx     # Results modal
│   │   └── TypingArea.tsx  # Main typing interface
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   └── firebase.ts     # Firebase configuration
│   ├── pages/              # Page components
│   │   ├── Dashboard.tsx   # Main dashboard
│   │   ├── Practice.tsx    # Practice modes
│   │   └── Settings.tsx    # Settings page
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── docs/                   # Documentation
├── package.json            # Dependencies and scripts
└── vite.config.ts         # Build configuration
```

### New File Organization

For future enhancements, follow this pattern:

```
keyboard-master/
├── src/
│   ├── components/          # Existing components
│   │   ├── Charts/         # Existing chart components
│   │   ├── Metrics.tsx     # Existing metrics
│   │   ├── Results.tsx     # Existing results
│   │   ├── TypingArea.tsx  # Existing typing area
│   │   └── NewFeature/     # New feature components
│   │       ├── Component1.tsx
│   │       └── Component2.tsx
│   ├── hooks/              # Existing hooks
│   │   └── useNewFeature.ts # New feature hooks
│   ├── lib/                # Existing libraries
│   │   └── newFeature.ts   # New feature utilities
│   ├── pages/              # Existing pages
│   │   └── NewFeature.tsx  # New feature page
│   ├── types/              # Existing types
│   │   └── newFeature.ts   # New feature types
│   └── utils/              # Existing utilities
│       └── newFeature.ts   # New feature utilities
```

### Integration Guidelines

- **File Naming:** PascalCase for components, camelCase for utilities
- **Folder Organization:** Feature-based organization with clear separation of concerns
- **Import/Export Patterns:** Use index files for clean imports, maintain consistent export patterns