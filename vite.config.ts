import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base ('./') makes the build work at any path, so it can be hosted
// from a GitHub *project* page (user.github.io/repo/) or a user/custom domain
// without changing config. The app uses in-app (state-based) navigation rather
// than URL routes, so there are no deep-link 404s on GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
  // Only scan the app's own entry for dependencies. Without this, Vite's dep
  // scanner crawls every *.html in the project — including the huge local
  // UIUX/ design-skill repo (WebGL test suites) — which breaks `npm run dev`.
  optimizeDeps: { entries: ['index.html'] },
  server: {
    // Don't watch the big local-only folders (saves CPU and file-watch handles).
    watch: { ignored: ['**/UIUX/**', '**/data/papers/**', '**/public/papers/**'] },
  },
})
