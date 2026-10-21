import { betterAuth } from "better-auth";
// @ts-expect-error `pg` types are not installed in this project.

import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon requires secure SSL connections
    ssl: {
      rejectUnauthorized: false,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
}
);