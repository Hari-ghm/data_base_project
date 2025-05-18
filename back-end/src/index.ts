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
    const result = await pool.query(
      'SELECT * FROM "course_table" ORDER BY "stream" ASC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error("🔥 Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get request for faculty
app.get("/faculties", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "faculty_table" '
    );
    res.json(result.rows);
  } catch (error) {
    console.error("🔥 Error fetching faculty:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get request for full allocated table
app.get("/full-table", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "allocated_courses" '
    );
    res.json(result.rows);
  } catch (error) {
    console.error("🔥 Error fetching faculty:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get request for faculty timetable
app.get("/allocated-courses", async (req, res) => {
  const employeeid = parseInt(req.query.empid as string, 10);
  
  try {
    let result = await pool.query(
        'SELECT * FROM "allocated_courses" WHERE "empid" = $1',
        [employeeid]
    )
    
    if (result.rows.length === 0) {
      res.status(200).json({ message: "No courses have been allotted" });
    } else {
      res.status(200).json(result.rows);
    }

  } catch (error) {
    console.error("🔥 Error fetching faculty time table:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// POST request handler for /api/allocate-slot
app.post("/api/allocate-slot", async (req: Request, res: Response) => {
  const { courseId, F_N, A_N,Course:course,Faculty:faculty,Facultyempid} = req.body;
  const employeeid = parseInt(Facultyempid, 10);
  
  try {
    if (F_N && A_N) {
      await pool.query(
        'UPDATE course_table SET "forenoonSlots" = "forenoonSlots" - 1, "afternoonSlots" = "afternoonSlots" - 1 WHERE id = $1 AND "forenoonSlots" > 0 AND "afternoonSlots" > 0',
        [courseId]
      );

      await pool.query(
        `INSERT INTO allocated_courses (
          year, stream, "courseType", "courseCode", "courseTitle",
          "lectureHours","tutorialHours","practicalHours",credits,
          prerequisites, school, "forenoonSlots", "afternoonSlots", faculty, basket,empid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          course.year,course.stream,course.courseType,course.courseCode,course.courseTitle,course.lectureHours,course.tutorialHours,
          course.practicalHours,course.credits,course.prerequisites,course.school,F_N,A_N,faculty,course.basket,employeeid
        ]
      );


    } else if (F_N) {
      await pool.query(
        'UPDATE course_table SET "forenoonSlots" = "forenoonSlots" - 1 WHERE id = $1 AND "forenoonSlots" > 0',
        [courseId]
      );

      await pool.query(
        `INSERT INTO allocated_courses (
          year, stream, "courseType", "courseCode", "courseTitle",
          "lectureHours","tutorialHours","practicalHours",credits,
          prerequisites, school, "forenoonSlots", "afternoonSlots", faculty, basket,empid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          course.year,course.stream,course.courseType,course.courseCode,course.courseTitle,course.lectureHours,course.tutorialHours,
          course.practicalHours,course.credits,course.prerequisites,course.school,F_N,false,faculty,course.basket,employeeid
        ]
      );
    } else if (A_N) {
      await pool.query(
        'UPDATE course_table SET "afternoonSlots" = "afternoonSlots" - 1 WHERE id = $1 AND "afternoonSlots" > 0',
        [courseId]
      );

      await pool.query(
        `INSERT INTO allocated_courses (
          year, stream, "courseType", "courseCode", "courseTitle",
          "lectureHours","tutorialHours","practicalHours",credits,
          prerequisites, school, "forenoonSlots", "afternoonSlots", faculty, basket,empid
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          course.year,course.stream,course.courseType,course.courseCode,course.courseTitle,course.lectureHours,course.tutorialHours,
          course.practicalHours,course.credits,course.prerequisites,course.school,false,A_N,faculty,course.basket,employeeid
        ]
      );
    }

    //  Send a response back to frontend
    res.json({ message: "Slot(s) allocated successfully." });
  } catch (err) {
    console.error("Error in allocate-slot:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/faculty", async (req, res) => {
  const empid = parseInt(req.query.empid as string, 10);
  
  if (isNaN(empid)) {
     res.status(400).json({ message: "Invalid employee ID" });
     return;
  }

  try {
    
    const result = await pool.query(
      'SELECT * FROM "faculty_table" WHERE "empid" = $1',
      [empid]
    );

    if (result.rows.length === 0) {
       res.status(404).json({ message: "Faculty not found" });
       return;
    }

     res.status(200).json(result.rows[0]); // return single faculty
     
  } catch (error) {
    console.error("🔥 Error fetching faculty:", error);
     res.status(500).json({ message: "Internal Server Error" });
  }
});


// Route to handle CSV data submission
// Add explicit types 'Request' and 'Response' to req and res parameters
app.post("/api/process-csv", async (req: Request, res: Response) => {

  const rows = req.body.data;

  if (!Array.isArray(rows) || rows.length === 0) {
    // Remove 'return' keyword here
    res.status(400).json({ message: "Bad Request: No data rows provided." });
    return; // Use a plain return to exit the function after sending response
  }

  // Get a client from the pool to run multiple queries in a transaction
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let insertedCount = 0;

    const toNull = (val: any): string | null => {
      return val === "" || val === undefined ? null : val;
    };

    const toInt = (val: any): number | null => {
      const n = parseInt(val, 10);
      return isNaN(n) ? null : n;
    };

    for (const row of rows) {

      const values = [
        toNull(row["id"]), // Include ID
        toNull(row["year"]),
        toNull(row["stream"]),
        toNull(row["courseType"]),
        toNull(row["courseCode"]),
        toNull(row["courseTitle"]),
        toInt(row["lectureHours"]),
        toInt(row["tutorialHours"]),
        toInt(row["practicalHours"]),
        toInt(row["credits"]),
        toNull(row["prerequisites"]),
        toNull(row["school"]),
        toInt(row["forenoonSlots"]),
        toInt(row["afternoonSlots"]),
        toInt(row["totalSlots"]),
        toNull(row["basket"]),
      ];

      const insertQuery = `
      INSERT INTO "course_table" (
        "id", "year", "stream", "courseType", "courseCode", "courseTitle",
        "lectureHours", "tutorialHours", "practicalHours", "credits",
        "prerequisites", "school", "forenoonSlots", "afternoonSlots",
        "totalSlots", "basket"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16
      )
      ON CONFLICT ("id") DO NOTHING;
    `;

      const result = await client.query(insertQuery, values);
      if (result.rowCount && result.rowCount > 0) {
        insertedCount++;
      }
    }

    await client.query("COMMIT");
    res
      .status(200)
      .json({
        message: `Successfully processed CSV. Inserted ${insertedCount} new rows.`,
      });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🔥 Error processing CSV data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .json({
        message: "Internal Server Error processing CSV data.",
        error: errorMessage,
      });
  } finally {
    client.release();
  }
});

// post request to delete course details from faculty table
app.post("/delete-course", async (req, res) => {
  const { empid, courseCode, afternoonSlots, forenoonSlots } = req.body;

  if (!empid || !courseCode) {
    res
      .status(400)
      .json({ message: "Employee ID and Course Code are required" });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Delete from allocated_courses
    await client.query(
      'DELETE FROM "allocated_courses" WHERE "empid" = $1 AND "courseCode" = $2',
      [empid, courseCode]
    );

    // 2. Conditionally build the update query
    let updateQuery = 'UPDATE "course_table" SET';
    const updates = [];
    const values = [];
    let idx = 1;

    if (forenoonSlots) {
      updates.push(` "forenoonSlots" = "forenoonSlots" + 1`);
    }

    if (afternoonSlots) {
      updates.push(` "afternoonSlots" = "afternoonSlots" + 1`);
    }

    if (updates.length > 0) {
      updateQuery += updates.join(",") + ` WHERE "courseCode" = $${idx}`;
      values.push(courseCode);

      await client.query(updateQuery, values);
    }

    await client.query("COMMIT");

    res.status(200).json({ message: "Course deleted and slots updated" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🔥 Error during course deletion/update:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    client.release();
  }
});




// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
