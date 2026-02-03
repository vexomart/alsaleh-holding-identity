import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Shim paths
const brotliShimPath = path.resolve(__dirname, "./src/shims/brotli.ts");
const brotliDecompressShimPath = path.resolve(__dirname, "./src/shims/brotli-decompress.ts");

// React paths for singleton enforcement
const reactPath = path.resolve(__dirname, "node_modules/react");
const reactDomPath = path.resolve(__dirname, "node_modules/react-dom");

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
      // Force single React instance
      "react": reactPath,
      "react-dom": reactDomPath,
      "react/jsx-runtime": path.resolve(reactPath, "jsx-runtime"),
      "react/jsx-dev-runtime": path.resolve(reactPath, "jsx-dev-runtime"),
      "react-dom/client": path.resolve(reactDomPath, "client"),
    },
  dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "@tanstack/react-query",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-primitive",
      "@radix-ui/react-context",
      "@radix-ui/react-use-callback-ref",
      "@radix-ui/react-use-controllable-state",
      "@radix-ui/react-dismissable-layer",
      "@radix-ui/react-portal",
      "@radix-ui/react-presence",
      "@radix-ui/react-slot",
      "@radix-ui/react-compose-refs",
    ],
  },
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      // Force single React instance in pre-bundling
      define: {
        global: 'globalThis',
      },
    },
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "@tanstack/react-query",
    ],
    exclude: ["brotli"],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
