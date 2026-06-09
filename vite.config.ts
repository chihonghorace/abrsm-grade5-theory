import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base ('./') makes the build work at any path, so it can be hosted
// from a GitHub *project* page (user.github.io/repo/) or a user/custom domain
// without changing config. The app uses in-app (state-based) navigation rather
// than URL routes, so there are no deep-link 404s on GitHub Pages.
export default defineConfig({
  base: './',
  plugins: [react()],
})
