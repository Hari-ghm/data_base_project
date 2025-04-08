// src/db.ts
import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "vitc_course_db",
  password: "hxri@123",
  port: 5432,
});