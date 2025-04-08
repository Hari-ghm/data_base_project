import express from "express";
import { pool } from "./db";

const app = express();
const port = 3001;

// Health check route
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(result.rows[0]);
});

// Courses route
app.get("/courses", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM "course_table"');
    res.json(result.rows);
  } catch (error) {
    console.error("🔥 Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
