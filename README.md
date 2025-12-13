# Activity Listing Page

A single codebase (Expo) that renders a responsive activity listing for an online learning platform on web and native. Learners can search, filter, and act on Online Classes and Assessments.

## Tech choices
- **Expo (React Native + React Native Web)** for shared web/mobile code and fast dev tooling.
- **React Native Paper (MD3)** for accessible components and theming.
- **Mock API + fallback**: Express server in `server/index.js` for `/login` and `/activities`, with local mock fallback.
- **Unified palette** in `src/theme` to keep colors consistent.
- **Testing** via `jest-expo` and `@testing-library/react-native` for components and filter logic.

## Features
- Scrollable list of activities with status, type, due date, progress, instructor, and tags.
- Quick filters: search, type, status, due-soon toggle, and sorting options.
- Contextual primary actions (Start/Continue/Review) per activity state.
- Responsive layout that adapts between mobile and web via React Native primitives.

## Getting started
1. Install dependencies (Node 20+):
   ```bash
   npm install
   ```
2. Start the mock backend (no database needed):
   ```bash
   npm run server  # serves on http://localhost:4000
   ```
   Set `EXPO_PUBLIC_API_BASE_URL` if you want a different host/port.
3. Run on web:
   ```bash
   npm run web
   ```
4. Run on iOS/Android (requires simulators/Expo Go):
   ```bash
   npm run ios   # iOS simulator
   npm run android   # Android emulator or device
   ```

## Login
- Credentials: `amin@example.com` / `admin@123`
- You can also create a new account from the login screen; accounts are stored in the mock server memory for the session.

## Build for mobile (Expo)
These commands require the Expo CLI/EAS CLI (`npm install -g expo eas-cli`) and logged-in Expo account.
1. Configure native projects (only needed for custom builds):
   ```bash
   npx expo prebuild
   ```
2. Build for a device or store:
   ```bash
   eas build --platform ios      # produces an .ipa or simulator build
   eas build --platform android  # produces an .aab or .apk
   ```
3. Install the produced artifact on your device/emulator. The JS bundle is shared with web; no code changes needed.

## Architecture & tradeoffs
- Shared UI primitives through React Native + React Native Web keep the surface area small; React Native Paper supplies MD3 components and theming.
- Mocked data is returned by a lightweight Express server (`npm run server`) so the client exercises a real HTTP fetch. If the API is unreachable, the hook falls back to local mock data (`src/data/activities.js`).
- Filter logic is centralized in `src/utils/filters.js`, making it easy to unit test and reuse; filter drawer requires explicit Apply.
- For large datasets, consider a virtualization swap (FlashList/RecyclerListView) and API pagination; current FlatList is sufficient for small/mid lists.
- Dark mode is not enabled by default; palette is defined centrally for consistency and can be extended for dark mode later.

## Testing
```bash
npm test
```

## Project structure
- `App.js` – entrypoint, theming, and page shell.
- `src/components` – UI pieces (`Filters`, `ActivityList`, `ActivityCard`).
- `src/hooks` – `useActivities` that simulates fetching.
- `src/utils` – filter logic, metadata helpers.
- `src/theme` – MD3 light/dark overrides.
- `__tests__` – filter and component tests.

## Next steps (possible improvements)
- Wire to a real API with pagination and optimistic updates.
- Add persisted filter state and deep links.
- Extend assessments to show scores/attempts, and allow submission uploads.
- Add end-to-end tests (Detox/Playwright) and performance profiling for large lists.
