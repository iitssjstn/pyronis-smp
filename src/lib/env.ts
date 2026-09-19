import { z } from "zod";
import path from "node:path";
import { readSecret, getOrCreatePersistedSecret } from "./secrets";

// The JWT signing secret is auto-generated on first boot and persisted
// inside the data directory — see getOrCreatePersistedSecret. Nothing a
// human has to invent or store anywhere.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),

  // SQLite: a file path, not a server connection — no password, no
  // separate database container, nothing to configure.
  DATABASE_URL: z.string().min(1),

  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),

  // Still used by the System Health "storage writable" check.
  STORAGE_LOCAL_PATH: z.string(),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  // Resolved once, up front, so DATABASE_URL's default and the data
  // directory always agree — an absolute path, whether that's /app/data
  // inside the Docker image (WORKDIR /app) or <project>/data for local
  // `npm run dev` outside Docker.
  const dataDir = process.env.STORAGE_LOCAL_PATH
    ? path.resolve(process.env.STORAGE_LOCAL_PATH)
    : path.resolve(process.cwd(), "data");

  const resolved = {
    ...process.env,
    STORAGE_LOCAL_PATH: dataDir,
    DATABASE_URL: readSecret("DATABASE_URL") || process.env.DATABASE_URL || `file:${path.join(dataDir, "production.db")}`,
    JWT_SECRET: getOrCreatePersistedSecret("JWT_SECRET", dataDir),
  };

  const parsed = envSchema.safeParse(resolved);
  if (!parsed.success) {
    const problems = parsed.error.issues.map((i) => i.path.join(".")).join(", ");
    throw new Error(`Invalid environment configuration. Problem fields: ${problems}`);
  }
  return parsed.data;
}

export const env = loadEnv();
