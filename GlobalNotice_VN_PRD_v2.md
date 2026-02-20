# GlobalNotice VN - Product Requirements Document (v2.0)

## 1. Project Overview
**Product Name:** GlobalNotice VN
**Purpose:** A lightweight, browser-based viewer for university notices (GlobalNotice).
**Core Value:** Provides a fast, reliable, and offline-capable interface to browse notices and PDFs without relying on heavy backend infrastructure or complex build processes.

## 2. System Constraints (Critical)
> [!IMPORTANT]
> **Runtime Environment:** Google AI Studio / Browser-only Runtime.
> **Node.js**: **STRICTLY PROHIBITED.** No `npm install`, `vite`, `webpack`, or Node.js build steps are allowed.
> **Hosting:** Static hosting (GitHub Pages) or direct file opening.

## 3. Technology Stack & Architecture

### 3.1 Core Technologies
- **Runtime:** HTML5 + ES Modules (ESM)
- **Framework:** React 18.2.0 (via ESM Import Maps)
- **Language:** JavaScript (ESNext) or TypeScript (Transpiled in-browser if necessary, but standard JS preferred for zero-build).
- **Styling:** Tailwind CSS (via CDN or runtime script) + `clsx` / `tailwind-merge`.
- **Icons:** `lucide-react` (ESM version).
- **Markdown:** `react-markdown` (ESM version).

### 3.2 Dependency Management (Import Maps)
Dependencies are managed via `importmap` in `index.html`, eliminating `package.json`.

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.2.0",
    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
    "lucide-react": "https://esm.sh/lucide-react",
    "clsx": "https://esm.sh/clsx",
    "tailwind-merge": "https://esm.sh/tailwind-merge",
    "idb-keyval": "https://esm.sh/idb-keyval",
    "react-markdown": "https://esm.sh/react-markdown"
  }
}
</script>
```

### 3.3 Folder Structure
Non-standard, flat structure optimized for browser loading:
```text
root/
  ├── index.html       # Entry point, Import Map, Tailwind CDN
  ├── src/
  │     ├── main.js    # ReactDOM root
  │     ├── App.js     # Main component & Routing logic
  │     └── components/# UI Components (esm modules)
  └── style.css        # Custom CSS overrides
```

## 4. Functional Requirements

### 4.1 Data Access & Authentication
- **Source:** Data is fetched solely from **Public GitHub Repositories** via `raw.githubusercontent.com` or GitHub Pages (`user.github.io`).
- **Authentication:**
    - **No GitHub API Token** required for reading public data (avoids Rate Limiting & Security issues).
    - **Rate Limit Strategy:** Fetch static `data.json` instead of querying GitHub API endpoints.
    - **CORS Handling:** Use GitHub Pages for JSON hosting if Raw content types cause issues.

### 4.2 Application Features
#### F1. Notice List
- Display a paginated or infinite-scroll list of notices.
- **Search & Filter:** Client-side filtering by keyword, date, or category.
- **Performance:** Prefetch metadata in parallel (`Promise.all`).

#### F2. Notice Detail View
- View full text of the notice (Markdown/Text support).
- **Routing:** Use `HashRouter` or state-based view switching to support static hosting without server-side rewrites.
    - *Constraint:* Standard `BrowserRouter` (pushState) is forbidden unless 404 fallback is guaranteed.

#### F3. PDF Viewer
- **Primary:** Embedded PDF viewer for notice attachments.
- **Implementation:**
    - Use `react-pdf` (ESM) if compatible.
    - **Fallback:** Standard `<iframe>` or direct Download Link if mobile browser compatibility is poor.
- **Memory:** Explicitly revoke Object URLs after use to prevent leaks.

#### F4. Offline Capability
- **Storage:** Use `idb-keyval` (IndexedDB) to cache `data.json` and visited notice details.
- **Persistence:** App should load previously viewed content even when offline.

#### F5. Settings & Debugging
- **System Log:** "Export Debug Log" button to download console logs/internal state for troubleshooting.
- **Version Info:** Display current app version.

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance
- **Parallel Loading:** Use `Promise.all` for fetching independent resources.
- **Lazy Loading:** Load PDF components only when required.

### 5.2 Reliability
- **Error Handling:** Wrap major components in `ErrorBoundary` to prevent white-screen of death.
- **Retry Logic:** Exponential backoff for network failures, but **STOP** immediately on 404 or Rate Limit errors to prevent spamming.

### 5.3 User Experience (UX)
- **Feedback:** Use Toast notifications for transient errors/successes.
- **Non-blocking:** Modal dialogs should be used sparingly; prefer inline expansion or toasts.

### 5.4 Security
- **No Secrets:** Client-side code must NOT contain any API Keys, Personal Access Tokens (PAT), or client secrets.
- **XSS Prevention:** Sanitize Markdown input if rendering HTML (use `react-markdown` safe defaults).
