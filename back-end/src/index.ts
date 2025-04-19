import express, { Request, Response } from "express";
import { pool } from "./db";
import cors from "cors";


const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());


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

// POST request handler for /api/allocate-slot
app.post("/api/allocate-slot", async (req: Request, res: Response) => {
  const { courseId, F_N, A_N } = req.body;

  try {
    if (F_N && A_N) {
      await pool.query(
        'UPDATE course_table SET "forenoonSlots" = "forenoonSlots" - 1, "afternoonSlots" = "afternoonSlots" - 1 WHERE id = $1 AND "forenoonSlots" > 0 AND "afternoonSlots" > 0',
        [courseId]
      );
    } else if (F_N) {
      await pool.query(
        'UPDATE course_table SET "forenoonSlots" = "forenoonSlots" - 1 WHERE id = $1 AND "forenoonSlots" > 0',
        [courseId]
      );
    } else if (A_N) {
      await pool.query(
        'UPDATE course_table SET "afternoonSlots" = "afternoonSlots" - 1 WHERE id = $1 AND "afternoonSlots" > 0',
        [courseId]
      );
    }

    //  Send a response back to frontend
    res.json({ message: "Slot(s) allocated successfully." });
  } catch (err) {
    console.error("Error in allocate-slot:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
