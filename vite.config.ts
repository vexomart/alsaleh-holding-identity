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
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Hard-pin React entry points to avoid duplicate React instances in Vite prebundling
      react: path.resolve(__dirname, "./node_modules/react/index.js"),
      "react/jsx-runtime": path.resolve(__dirname, "./node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": path.resolve(
        __dirname,
        "./node_modules/react/jsx-dev-runtime.js"
      ),
      "react-dom": path.resolve(__dirname, "./node_modules/react-dom/index.js"),
      "react-dom/client": path.resolve(
        __dirname,
        "./node_modules/react-dom/client.js"
      ),
    },
    dedupe: [
      "react", 
      "react-dom", 
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom",
      "react-dom/client",
      "react-router-dom",
    ],
  },
}));
