import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import {
  databaseUrlFromEnv,
  getPostgresJsClientOptions,
} from "@/lib/server/pg-options";

let client: ReturnType<typeof postgres> | null = null;
let instance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const url = databaseUrlFromEnv();
  if (!url) {
    throw new Error(
      "رابط Postgres غير معرّف (DATABASE_URL أو DATABASE_PUBLIC_URL / DATABASE_PRIVATE_URL على Railway، أو .env محليًا).",
    );
  }
  if (!instance) {
    client = postgres(url, getPostgresJsClientOptions(10, url));
    instance = drizzle(client, { schema });
  }
  return instance;
}

export async function closeDb() {
  if (client) {
    await client.end();
    client = null;
    instance = null;
  }
}

export type Db = NonNullable<typeof instance>;
export { schema };
