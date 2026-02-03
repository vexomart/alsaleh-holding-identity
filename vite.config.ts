import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Brotli shim paths
const brotliShimPath = path.resolve(__dirname, "./src/shims/brotli.ts");
const brotliDecompressShimPath = path.resolve(__dirname, "./src/shims/brotli-decompress.ts");

// Plugin to handle all brotli imports
function brotliPlugin(): Plugin {
  return {
    name: "brotli-shim",
    enforce: "pre",
    resolveId(source) {
      // Handle brotli/decompress and any subpath
      if (source === "brotli/decompress" || source === "brotli/decompress.js" || source.startsWith("brotli/")) {
        return brotliDecompressShimPath;
      }
      // Handle main brotli import
      if (source === "brotli") {
        return brotliShimPath;
      }
      return null;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    brotliPlugin(),
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "base64-js": path.resolve(__dirname, "./src/shims/base64-js.ts"),
      "unicode-trie": path.resolve(__dirname, "./src/shims/unicode-trie.ts"),
    },
    // CRITICAL: Force single React instance
    dedupe: ["react", "react-dom", "react/jsx-runtime", "@tanstack/react-query"],
  },
  optimizeDeps: {
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
