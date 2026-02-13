import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    imageService: "cloudflare",
    platformProxy: {
      enabled: true,
    },
  }),
  i18n: {
    defaultLocale: "en",
    locales: ["en", "vi"],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Use react-dom/server.edge instead of react-dom/server.browser for React 19.
      // Without this, MessageChannel from node:worker_threads needs to be polyfilled.
      alias: {
        ...(import.meta.env.PROD && {
          "react-dom/server": "react-dom/server.edge",
        }),
        "es-module-lexer": "es-module-lexer/js",
      },
    },
  },
  integrations: [react()],
});
