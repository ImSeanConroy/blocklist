import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: "public/manifest.json", dest: "." },
        { src: "public/icons", dest: "." },
        { src: "src/background/background.js", dest: "." },
        { src: "src/content/content.js", dest: "." },
        { src: "src/blocked", dest: "." },
      ],
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/options/__tests__/setupTests.ts",
    coverage: {
      include: ["src/options"],
      exclude: [
        "src/options/__tests__/**",
        "src/options/index.tsx",
        "src/options/vite-env.d.ts",
        "src/*.test.{js,ts,jsx,tsx}",
        "dist",
      ],
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
});
