import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    // Keep default Vite/Node resolution for React to avoid splitting across different entrypoints.
    // We only alias our app path prefix.
    alias: [
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },
      // Fix ESM default-import expectations for base64-js in some PDF-related deps
      { find: /^base64-js$/, replacement: path.resolve(__dirname, "./src/shims/base64-js.ts") },
      // Fix ESM default-import expectations for unicode-trie in some PDF/font deps
      { find: /^unicode-trie$/, replacement: path.resolve(__dirname, "./src/shims/unicode-trie.ts") },
      // Some deps import the subpath directly and expect a default export:
      //   import decompress from 'brotli/decompress.js'
      // Use both string and regex aliases to cover all resolver code paths.
      { find: "brotli/decompress.js", replacement: path.resolve(__dirname, "./src/shims/brotli-decompress.ts") },
      { find: "brotli/decompress", replacement: path.resolve(__dirname, "./src/shims/brotli-decompress.ts") },
      { find: /^brotli\/decompress\.js$/, replacement: path.resolve(__dirname, "./src/shims/brotli-decompress.ts") },
      { find: /^brotli\/decompress$/, replacement: path.resolve(__dirname, "./src/shims/brotli-decompress.ts") },
    ],

    // Be explicit (even though it's the default) so symlinked deps don't create duplicate React copies.
    preserveSymlinks: false,
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "react-router-dom",
      "@tanstack/react-query",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-dialog",
      "@radix-ui/react-popover",
      "framer-motion",
      "@react-pdf/renderer",
    ],
  },
  optimizeDeps: {
    force: true,
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
      "react-router-dom",
      "@radix-ui/react-tooltip",
      "@tanstack/react-query",
    ],
    // @react-pdf/renderer is known to cause duplicate-React hook crashes when pre-bundled.
    // It will still be loaded when needed, but won't be forced into the shared prebundle.
    // Exclude brotli as well so Vite doesn't prebundle the problematic subpath import
    // before our alias can rewrite it.
    exclude: ["@react-pdf/renderer", "brotli"],
  },
}));
