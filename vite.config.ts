import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    }
  },
  server: {
    port: 5173,
    strictPort: false,
    open: true
  },
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
