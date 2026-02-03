import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Brotli shim paths
const brotliShimPath = path.resolve(__dirname, "./src/shims/brotli.ts");
const brotliDecompressShimPath = path.resolve(__dirname, "./src/shims/brotli-decompress.ts");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Brotli shims
      "brotli/decompress": brotliDecompressShimPath,
      "brotli": brotliShimPath,
      // Shims for other problematic packages
      "base64-js": path.resolve(__dirname, "./src/shims/base64-js.ts"),
      "unicode-trie": path.resolve(__dirname, "./src/shims/unicode-trie.ts"),
    },
    // CRITICAL: Force single React instance
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
  optimizeDeps: {
    // Force rebuild of pre-bundled deps
    force: true,
    include: ["@tanstack/react-query"],
    exclude: ["brotli"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
