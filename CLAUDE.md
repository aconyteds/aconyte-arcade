# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This project uses **Bun** as the package manager and runtime.

### Running the Application

- `bun install` - Install dependencies
- `bun run dev` - Start development server at http://localhost:3000
- `bun run build` - Build production bundle
- `bun start` - Start production server
- `bun run export` - Build and export static files to `out/` directory

### Testing

- `bun test` - Run all tests with coverage
- `bun run test:watch` - Run tests in watch mode
- Jest configuration in `jest.config.ts` with jsdom environment
- Setup file: `jest.setup.ts` (imports @testing-library/jest-dom)
- Tests use @testing-library/react for component testing

### Linting & Formatting

- `bun run lint` - Run Next.js ESLint
- `bun run format` - Format all TypeScript files with Prettier
- `bun run format-staged` - Format staged files (used in pre-commit hook via husky)

### Deployment

- Build: `bun run export` (generates static site in `out/`)
- Deploy: `firebase deploy` (requires Firebase CLI setup)
- Live site: https://aconyte-arcade.web.app/

## Architecture Overview

### Next.js Static Site

This is a Next.js 15.x application configured for static export using the Pages Router. Pages are in `pages/`:

- `pages/index.tsx` - Home page
- `pages/_app.tsx` - App wrapper with navigation and ToasterContextProvider
- `pages/games/` - Game-specific pages (sudoku, wordGame, logicGame)

### Common Components & Utilities

The `common/` directory contains shared code:

**Contexts (`common/contexts/`):**

- `toaster.tsx` - Global toast notification system

**Hooks (`common/hooks/`):**

- Custom hooks like `useArray`, `useDebounce`, `useInterval`, `useStorage`, `useTimeout`, `useToggle`, `useUpdateEffect`
- All exported from `common/hooks/index.tsx`

**Components (`common/components/`):**

- Each game has its own directory with components, context, engine, and models
- Shared components: `ConfirmationButton`, `CountdownButton`, `Loader`

### Game Architecture

Each game follows a consistent pattern:

1. **Context Provider** (`context.tsx`)
   - Manages game state (inGame, gameOver, won, etc.)
   - Provides game actions (newGame, endGame, startGame, etc.)
   - Example: `LogicGameContext`, `WordGameContext`, Sudoku uses local state

2. **Engine** (`engine.ts`)
   - Pure functions for game logic
   - Example: `generateGame()`, `checkForDefeat()` in LogicGame
   - Example: `solveSudoku()`, `validatePuzzle()`, `generateSudoku()` in Sudoku

3. **Models** (`models.ts`)
   - TypeScript types and constants
   - Difficulty configurations, game state types, etc.

4. **Components**
   - Game-specific UI components
   - Menu, ScoreScreen, and game board components

### WebAssembly Integration

The project uses Rust-compiled WASM modules for performance-critical game logic:

**Sudoku WASM** (`common/WASM/sudoku/`):

- Functions: `solve_sudoku`, `generate_sudoku`, `validate_sudoku`, `generate_suggestions`, `generate_all_suggestions`
- TypeScript definitions in `wasm_sudoku_rust.d.ts`
- Engine wrapper in `common/components/Sudoku/engine.ts` provides fallback TypeScript implementations
- Initialize with `initializeSudokuEngine()` before use

**Word Game WASM** (`common/WASM/wordGame/`):

- Functions: `get_word`, `get_suggestion`, `get_feedback`
- TypeScript definitions in `rust_word_game.d.ts`
- Used by `common/components/WordGame/context.tsx`

**WASM Pattern:**

- Each WASM module has TypeScript bindings (`.d.ts` files)
- Game engines provide both WASM and fallback TypeScript implementations
- Use `useWasm` parameter (default `true`) to toggle between implementations

### Styling

- Global styles in `styles/globals.scss`
- Uses SASS with Bootstrap 5.3.x and react-bootstrap
- Custom theme in `styles/Theme/`
- Custom fonts in `styles/Fonts/`
- FontAwesome icons used throughout

### TypeScript Configuration

- TypeScript 5.7.x with strict mode enabled
- Comprehensive type checking with all strict flags enabled
- `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters` all enabled
- Next.js specific config with incremental compilation and bundler module resolution

## Testing Strategy

- Component tests colocated with components (e.g., `Game.test.tsx` next to `Game.tsx`)
- Engine logic has dedicated test files (e.g., `engine.test.ts`)
- Use `@testing-library/react` for component testing
- Use `@testing-library/jest-dom` for DOM assertions
- Coverage reports generated in `coverage/` directory

## Important Implementation Notes

- **WASM modules must be initialized** before use (async operation)
- **Game contexts** wrap game pages to provide state management
- **Navigation** is in `pages/_app.tsx` using Next.js Link components
- **Static export** means no server-side rendering or API routes
- **Firebase hosting** is the deployment target (not Vercel)
