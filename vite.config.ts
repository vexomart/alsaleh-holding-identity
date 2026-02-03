import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const brotliShimPath = path.resolve(__dirname, "./src/shims/brotli.ts");
const brotliDecompressShimPath = path.resolve(__dirname, "./src/shims/brotli-decompress.ts");

// Comprehensive brotli replacement plugin
function brotliReplacementPlugin(): Plugin {
  return {
    name: "brotli-replacement",
    enforce: "pre",
    resolveId(source) {
      if (source === "brotli/decompress" || source === "brotli/decompress.js") {
        return { id: brotliDecompressShimPath, moduleSideEffects: false };
      }
      if (source.startsWith("brotli/")) {
        return { id: brotliDecompressShimPath, moduleSideEffects: false };
      }
      if (source === "brotli") {
        return { id: brotliShimPath, moduleSideEffects: false };
      }
      return null;
    },
    load(id) {
      if (id.includes("node_modules/brotli")) {
        return `
          function decompress(buffer) {
            if (buffer instanceof Uint8Array) return buffer;
            if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
            return new Uint8Array(buffer);
          }
          function compress(buffer) {
            if (buffer instanceof Uint8Array) return buffer;
            if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
            return new Uint8Array(buffer);
          }
          export default decompress;
          export { decompress, compress };
        `;
      }
      return null;
    },
  };
}

// Force single React instance - v7
const reactPath = path.resolve(__dirname, "node_modules/react");
const reactDomPath = path.resolve(__dirname, "node_modules/react-dom");

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  plugins: [
    brotliReplacementPlugin(),
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "base64-js": path.resolve(__dirname, "./src/shims/base64-js.ts"),
      "unicode-trie": path.resolve(__dirname, "./src/shims/unicode-trie.ts"),
      "brotli/decompress": brotliDecompressShimPath,
      "brotli": brotliShimPath,
      // Critical: Force single React instance
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
    ],
  },
  // Cache bust: v7 - Simplified config to fix React duplication
  optimizeDeps: {
    force: true,
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "@tanstack/react-query",
      "react-router-dom",
    ],
    exclude: ["brotli"],
    esbuildOptions: {
      plugins: [
        {
          name: "brotli-esbuild-shim",
          setup(build) {
            build.onResolve({ filter: /^brotli$/ }, () => ({
              path: brotliShimPath,
            }));
            build.onResolve({ filter: /^brotli\/decompress/ }, () => ({
              path: brotliDecompressShimPath,
            }));
          },
        },
      ],
    },
  },
}));
