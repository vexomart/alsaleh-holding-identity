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
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      // Pin only the exact React entrypoints to prevent duplicate React instances,
      // without breaking subpath imports like `react/jsx-runtime`.
      { find: /^react$/, replacement: path.resolve(__dirname, "node_modules/react/index.js") },
      { find: /^react-dom$/, replacement: path.resolve(__dirname, "node_modules/react-dom/index.js") },
      {
        find: /^react-dom\/client$/,
        replacement: path.resolve(__dirname, "node_modules/react-dom/client.js"),
      },
      {
        find: /^react\/jsx-runtime$/,
        replacement: path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
      },
      {
        find: /^react\/jsx-dev-runtime$/,
        replacement: path.resolve(__dirname, "node_modules/react/jsx-dev-runtime.js"),
      },
    ],
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "react-router-dom",
      "@tanstack/react-query",
      "@radix-ui/react-tooltip",
      "framer-motion",
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
  },
}));
