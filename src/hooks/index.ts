import { neon } from '@neondatabase/serverless';
export const sql = neon(import.meta.env.VITE_DB_URL);
export * from "./create-mutation";
export * from "./delete-mutation";
export * from "./get-query";
export * from "./global-provider";
export * from "./sql-mutation";
export * from "./sql-query";
export * from "./update-mutation";

