// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const ghPages = process.env.GH_PAGES === "true" || process.env.GH_PAGES === "1";

export default defineConfig({
  // Always disable the Cloudflare adapter — Railway runs Node.js, not a Cloudflare Worker.
  // For GitHub Pages we also don't need Cloudflare (static prerender only).
  cloudflare: false,
  tanstackStart: ghPages
    ? {
        prerender: {
          enabled: true,
          // روابط الـ # تُسجّل أحياناً في الزحف وقد تفشل على مُنفّذات CI
          filter: (page) => !String(page.path).includes("#"),
          crawlLinks: true,
          failOnError: true,
        },
      }
    : {
        // preset node → Nitro؛ يقرأ PORT/NITRO_PORT وHOST/NITRO_HOST (انظر Dockerfile وrailway).
        server: {
          preset: "node",
        },
      },
  vite: {
    base: process.env.VITE_BASE?.trim() || "/",
  },
});
