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
      // Replace entire brotli package
      if (source === "brotli") {
        return { id: brotliShimPath, moduleSideEffects: false };
      }
      // Replace decompress subpath
      if (source === "brotli/decompress" || source === "brotli/decompress.js") {
        return { id: brotliDecompressShimPath, moduleSideEffects: false };
      }
      return null;
    },
    load(id) {
      // Intercept any direct file access to brotli
      if (id.includes("node_modules/brotli/decompress")) {
        return `
          function decompress(buffer) {
            if (buffer instanceof Uint8Array) return buffer;
            if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
            return new Uint8Array(buffer);
          }
          export default decompress;
          export { decompress };
        `;
      }
      if (id.includes("node_modules/brotli") && !id.includes("decompress")) {
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
          export { decompress, compress };
          export default { decompress, compress };
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
    brotliReplacementPlugin(),
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: [
      { find: /^@\//, replacement: path.resolve(__dirname, "./src") + "/" },
      { find: /^base64-js$/, replacement: path.resolve(__dirname, "./src/shims/base64-js.ts") },
      { find: /^unicode-trie$/, replacement: path.resolve(__dirname, "./src/shims/unicode-trie.ts") },
      // Alias entire brotli package
      { find: /^brotli$/, replacement: brotliShimPath },
      { find: "brotli", replacement: brotliShimPath },
      // Alias decompress subpath
      { find: "brotli/decompress.js", replacement: brotliDecompressShimPath },
      { find: "brotli/decompress", replacement: brotliDecompressShimPath },
      { find: /^brotli\/decompress\.js$/, replacement: brotliDecompressShimPath },
      { find: /^brotli\/decompress$/, replacement: brotliDecompressShimPath },
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
    ],
    exclude: ["brotli", "@react-pdf/renderer"],
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
