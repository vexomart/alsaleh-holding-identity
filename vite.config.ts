import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Shim paths
const brotliShimPath = path.resolve(__dirname, "./src/shims/brotli.ts");
const brotliDecompressShimPath = path.resolve(__dirname, "./src/shims/brotli-decompress.ts");

// Plugin to handle brotli imports
function brotliPlugin(): Plugin {
  return {
    name: "brotli-shim",
    enforce: "pre",
    resolveId(source) {
      if (source === "brotli/decompress" || source === "brotli/decompress.js" || source.startsWith("brotli/")) {
        return brotliDecompressShimPath;
      }
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
    },
    // Dedupe to ensure single React instance
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
    ],
  },
  optimizeDeps: {
    // Force deps optimization on every server start
    force: true,
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@tanstack/react-query",
      "framer-motion",
      "react-router-dom",
    ],
    exclude: ["brotli"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
}));
