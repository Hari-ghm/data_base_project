// src/index.ts
import express from "express";
import { pool } from "./db";

const app = express();
const port = 3001;

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(result.rows[0]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
