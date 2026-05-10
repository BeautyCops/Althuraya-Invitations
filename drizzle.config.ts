import { defineConfig } from "drizzle-kit";

import { databaseUrlFromEnv } from "./src/lib/server/pg-options";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrlFromEnv(),
  },
  strict: true,
});
