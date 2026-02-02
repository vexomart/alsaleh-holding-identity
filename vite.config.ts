import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const shimPath = path.resolve(__dirname, "./src/shims/brotli-decompress.ts");

// Custom plugin to intercept ALL brotli/decompress imports
function brotliShimPlugin(): Plugin {
  return {
    name: "brotli-shim-resolver",
    enforce: "pre",
    resolveId(source, importer, options) {
      // Match any brotli/decompress import pattern
      if (
        source === "brotli/decompress" ||
        source === "brotli/decompress.js" ||
        source.includes("brotli/decompress")
      ) {
        return { id: shimPath, moduleSideEffects: false };
      }
      return null;
    },
    load(id) {
      // If somehow the raw brotli/decompress is loaded, redirect
      if (id.includes("node_modules/brotli/decompress")) {
        return `
          export default function decompress(buffer) {
            console.warn("[brotli-shim] decompress called");
            return buffer;
          }
          export const decompress = function(buffer) {
            return buffer;
          };
        `;
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  plugins: [
    brotliShimPlugin(),
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },
      { find: /^base64-js$/, replacement: path.resolve(__dirname, "./src/shims/base64-js.ts") },
      { find: /^unicode-trie$/, replacement: path.resolve(__dirname, "./src/shims/unicode-trie.ts") },
      { find: "brotli/decompress.js", replacement: shimPath },
      { find: "brotli/decompress", replacement: shimPath },
      { find: /^brotli\/decompress\.js$/, replacement: shimPath },
      { find: /^brotli\/decompress$/, replacement: shimPath },
    ],
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
      "@react-pdf/renderer",
    ],
    esbuildOptions: {
      plugins: [
        {
          name: "brotli-shim-esbuild",
          setup(build) {
            build.onResolve({ filter: /brotli\/decompress/ }, () => ({
              path: shimPath,
            }));
          },
        },
      ],
    },
  },
}));
