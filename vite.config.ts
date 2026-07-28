import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages serves project sites at <username>.github.io/<repo>/, so every
// asset URL (JS/CSS chunks, icons, manifest) needs this prefix baked in at
// build time. Keep in sync with the repo name if it ever changes.
const BASE_PATH = "/Language-School/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg"],
      manifest: {
        name: "Language School",
        short_name: "Language School",
        description:
          "Study Chinese (HSK 3.0) and Spanish vocabulary with flashcards and spaced repetition.",
        theme_color: "#1b6b4f",
        background_color: "#ffffff",
        display: "standalone",
        start_url: BASE_PATH,
        scope: BASE_PATH,
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "icons/maskable-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "icons/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Level 7's word chunk is the largest generated asset (~1MB); raise the
        // default 2MB precache limit slightly so it's still eligible for offline caching.
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
      },
    }),
  ],
});
