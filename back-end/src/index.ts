import express, { Request, Response } from "express";
import { pool } from "./db";
import cors from "cors";
import crypto from "crypto";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const faculty_table_creation_query = `
      CREATE TABLE IF NOT EXISTS faculty_table (
        s_no SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        empid INTEGER UNIQUE NOT NULL,
        photo_url TEXT,
        email TEXT,
        school TEXT
      );
      
    `;

const course_table_creation_query = `
CREATE TABLE IF NOT EXISTS course_table (
  id SERIAL PRIMARY KEY,
  year INTEGER,
  stream TEXT,
  "courseType" TEXT,
  "courseCode" TEXT,
  "courseTitle" TEXT,
  "lectureHours" INTEGER,
  "tutorialHours" INTEGER,
  "practicalHours" INTEGER,
  "credits" INTEGER,
  "prerequisites" TEXT,
  school TEXT,
  "forenoonSlots" INTEGER,
  "afternoonSlots" INTEGER,
  "totalSlots" INTEGER,
  basket TEXT,
  row_hash TEXT UNIQUE 
);
`;

const allocated_courses_creation_query = `CREATE TABLE IF NOT EXISTS allocated_courses (
  id SERIAL PRIMARY KEY,
  year INTEGER ,
  stream TEXT ,
  "courseType" TEXT ,
  "courseCode" TEXT ,
  "courseTitle" TEXT ,
  "lectureHours" INTEGER,
  "tutorialHours" INTEGER ,
  "practicalHours" INTEGER,
  credits INTEGER,
  prerequisites TEXT,
  school TEXT,
  "forenoonSlots" boolean,
  "afternoonSlots"boolean,
  faculty TEXT NOT NULL,
  basket TEXT ,
  empid INTEGER NOT NULL
);`;

const computeRowHash = (row: any): string => {
  const fields = [
    row["year"],
    row["stream"],
    row["courseType"],
    row["courseCode"],
    row["courseTitle"],
    row["lectureHours"],
    row["tutorialHours"],
    row["practicalHours"],
    row["credits"],
    row["prerequisites"],
    row["school"],
    row["forenoonSlots"],
    row["afternoonSlots"],
    row["totalSlots"],
    row["basket"],
  ];

  const normalized = fields.map((val) => {
    if (val === null || val === undefined) return "";
    return val.toString().trim().toLowerCase();
  });

  const stringToHash = normalized.join("|");
  return crypto.createHash("sha256").update(stringToHash).digest("hex");
};


// Health check route
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.send(result.rows[0]);
});

// fetch data from course table and display in CourseAllocation page
app.get("/courses", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "course_table" ORDER BY "stream" ASC'
    );
    res.json(result.rows);
  } catch (error) {
    //  console.error("🔥 Error fetching courses:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// fetch data from faculty table and display in CourseAllocation page Faculty dropdown
app.get("/faculties", async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM "faculty_table" '
    );
    res.json(result.rows);
  } catch (error) {
    // console.error("🔥 Error fetching faculty:", error);
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

// fetch data from allocatedCourses for each individual faculty
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


// POST request handler for slot allocation
app.post("/api/allocate-slot", async (req: Request, res: Response) => {
  const { courseId, F_N, A_N,Course:course,Faculty:faculty,Facultyempid} = req.body;
  const employeeid = parseInt(Facultyempid, 10);
  const client = await pool.connect();
  try {
    await client.query(course_table_creation_query);
    await client.query(allocated_courses_creation_query);
  
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
    await client.query(course_table_creation_query);

    let insertedCount = 0;

    const toNull = (val: any): string | null => {
      return val === "" || val === undefined ? null : val;
    };

    const toInt = (val: any): number | null => {
      const n = parseInt(val, 10);
      return isNaN(n) ? null : n;
    };
    
    const REQUIRED_COLUMNS = [
      "year", "stream", "courseType", "courseCode", "courseTitle",
      "lectureHours", "tutorialHours", "practicalHours", "credits",
      "prerequisites", "school", "forenoonSlots", "afternoonSlots",
      "totalSlots", "basket"
    ];

    const csvHeaders = Object.keys(rows[0] || {});
    const missingHeaders = REQUIRED_COLUMNS.filter(
      (col) => !csvHeaders.includes(col)
    );
    
    
    if (missingHeaders.length > 0) {
      res.status(400).json({
        message: "CSV file is missing required columns.",
        missingColumns: missingHeaders,
      });
      return;
    }

    for (const row of rows) {
      const rowHash = computeRowHash(row);
      const values = [
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
        rowHash
      ];

      const insertQuery = `
        INSERT INTO course_table (
          year, stream, "courseType", "courseCode", "courseTitle",
          "lectureHours", "tutorialHours", "practicalHours", "credits",
          "prerequisites", school, "forenoonSlots", "afternoonSlots",
          "totalSlots", basket, row_hash
        )
        VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10,
          $11, $12, $13, $14,
          $15, $16
        )
        ON CONFLICT (row_hash) DO NOTHING;
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

// insertion of faculty datas.csv to database
app.post("/api/process-Facultycsv", async (req: Request, res: Response) => {
  const rows = req.body.data;

  if (!Array.isArray(rows) || rows.length === 0) {
    // Remove 'return' keyword here
    res.status(400).json({ message: "Bad Request: No data rows provided." });
    return; // Use a plain return to exit the function after sending response
  }

  // Get a client from the pool to run multiple queries in a transaction
  const client = await pool.connect();

  try {
    await client.query(faculty_table_creation_query);    

    let insertedCount = 0;

    const toNull = (val: any): string | null => {
      if (val === undefined || val === null || val.toString().trim() === "")
        return null;
      return val.toString().trim();
    };

    const toInt = (val: any): number | null => {
      const trimmed = val?.toString().trim();
      if (!trimmed || isNaN(trimmed)) return null;
      return parseInt(trimmed, 10);
    };
    

    for (const row of rows) {
      const values = [
        toNull(row["name"]),
        toNull(row["empid"]),
        toNull(row["photo_url"]),
        toNull(row["email"]),
        toNull(row["school"]),
      ];

      const insertQuery = `
      INSERT INTO "faculty_table" (
        "name", "empid", "photo_url", "email", "school"
      )
      VALUES (
        $1, $2, $3, $4, $5
      )
      ON CONFLICT ("empid") DO NOTHING;
    `;

      const result = await client.query(insertQuery, values);
      if (result.rowCount && result.rowCount > 0) {
        insertedCount++;
      }
    }

    await client.query("COMMIT");
    res.status(200).json({
      message: `Successfully processed CSV. Inserted ${insertedCount} new rows.`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("🔥 Error processing CSV data:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      message: "Internal Server Error processing CSV data.",
      error: errorMessage,
    });
  } finally {
    client.release();
  }
});

// post request to delete course details from faculty table
app.post("/delete-course-individual", async (req, res) => {
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


app.get("/each-course-allocation", async (req, res) => {
  const { code, stream } = req.query;

  if (!code || !stream) {
    res.status(400).json({ error: "Missing course code or stream" });
    return
  }

  try {
    const data = await pool.query(
      `SELECT "faculty", "forenoonSlots", "afternoonSlots" FROM allocated_courses WHERE "courseCode" = $1 AND stream = $2`,
      [code, stream]
    );
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch faculty info" });
  }
});


app.post("/api/singleDataEntryCourse", async (req, res) => {
  try {
    const toNull = (val: unknown): string | number | null => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "" || trimmed === " " ? null : trimmed;
      }
      if (val === undefined || val === null) return null;
      if (typeof val === "number") return val;
      return String(val).trim() || null; // fallback for other types
    };
        
    const {
      year,
      stream,
      courseType,
      courseCode,
      courseTitle,
      lectureHours,
      tutorialHours,
      practicalHours,
      credits,
      prerequisites,
      school,
      forenoonSlots,
      afternoonSlots,
      totalSlots,
      basket,
    } = req.body;

    const sanitizedRow = {
      year: toNull(year),
      stream: toNull(stream),
      courseType: toNull(courseType),
      courseCode: toNull(courseCode),
      courseTitle: toNull(courseTitle),
      lectureHours: toNull(lectureHours),
      tutorialHours: toNull(tutorialHours),
      practicalHours: toNull(practicalHours),
      credits: toNull(credits),
      prerequisites: toNull(prerequisites),
      school: toNull(school),
      forenoonSlots: toNull(forenoonSlots),
      afternoonSlots: toNull(afternoonSlots),
      totalSlots: toNull(totalSlots),
      basket: toNull(basket),
    };

    const rowHash = computeRowHash(sanitizedRow);
    
    const query = `
      INSERT INTO course_table(
         year, stream, "courseType", "courseCode", "courseTitle",
        "lectureHours", "tutorialHours", "practicalHours", "credits",
        "prerequisites", "school", "forenoonSlots", "afternoonSlots",
        "totalSlots", basket,row_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `;

    await pool.query(query, [
      sanitizedRow.year,
      sanitizedRow.stream,
      sanitizedRow.courseType,
      sanitizedRow.courseCode,
      sanitizedRow.courseTitle,
      sanitizedRow.lectureHours,
      sanitizedRow.tutorialHours,
      sanitizedRow.practicalHours,
      sanitizedRow.credits,
      sanitizedRow.prerequisites,
      sanitizedRow.school,
      sanitizedRow.forenoonSlots,
      sanitizedRow.afternoonSlots,
      sanitizedRow.totalSlots,
      sanitizedRow.basket,
      rowHash,
    ]);    
    
    res.status(200).json({ message: "Course inserted successfully" });
  } catch (err) {
    console.error("Error inserting course:", err);
    res.status(500).json({ error: "Failed to insert course" });
  }
});

app.post("/api/singleDataEntryFaculty", async (req, res) => {
  try {
    const toNull = (val: unknown): string | null => {
      if (typeof val === "string") {
        const trimmed = val.trim();
        return trimmed === "" || trimmed === " " ? null : trimmed;
      }
      if (val === undefined || val === null) return null;
      return String(val).trim() || null;
    };

    const { name, empid, photo_url, email, school } = req.body;

    // Required field validation
    if (!empid) {
      res.status(400).json({ error: "Employee ID is required." });
      return
    }

    const sanitizedData = {
      name: toNull(name),
      empid: toNull(empid),
      photo_url: toNull(photo_url),
      email: toNull(email),
      school: toNull(school),
    };

    // Additional validation for required fields after sanitization
    if (!sanitizedData.empid) {
      res.status(400).json({ error: "Valid Employee ID is required." });
      return
    }

    const query = `
      INSERT INTO faculty_table(
        name, empid, photo_url, email, school
      )
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (empid) DO UPDATE SET
        name = EXCLUDED.name,
        photo_url = EXCLUDED.photo_url,
        email = EXCLUDED.email,
        school = EXCLUDED.school
    `;

    await pool.query(query, [
      sanitizedData.name,
      sanitizedData.empid,
      sanitizedData.photo_url,
      sanitizedData.email,
      sanitizedData.school,
    ]);

    res.status(200).json({
      message: "Faculty data processed successfully",
      data: sanitizedData,
    });
  } catch (err: any) {
    console.error("Database operation error:", err);

    const errorMessage =
      err.code === "23505"
        ? "Faculty with this Employee ID already exists"
        : "Failed to process faculty data";

    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

app.post("/delete-grouped-faculties", async (req, res) => {
  const { empids: s_nos } = req.body;

  if (!Array.isArray(s_nos) || s_nos.length === 0) {
    res
      .status(400)
      .json({ error: "empids must be a non-empty array of s_no values" });
    return
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Step 1: Get empids from s_no
    const empidResult = await client.query(
      `SELECT empid FROM faculty_table WHERE s_no = ANY($1::integer[])`,
      [s_nos]
    );
    const empids = empidResult.rows.map((row) => row.empid);

    if (empids.length === 0) {
      throw new Error("No matching faculty empids found.");
    }

    // Step 2: Get allocations for those empids
    const allocationResult = await client.query(
      `SELECT empid, "courseCode", year, "courseTitle", "forenoonSlots", "afternoonSlots"
       FROM allocated_courses
       WHERE empid = ANY($1::integer[])`,
      [empids]
    );

    const allocations = allocationResult.rows;
    
    // Step 3: For each allocation, update course_table slot counts
    for (const {
      courseCode,
      year,
      courseTitle,
      forenoonSlots,
      afternoonSlots,
    } of allocations) {
      if (forenoonSlots) {
        await client.query(
          `UPDATE course_table
           SET "forenoonSlots" = "forenoonSlots" + 1
           WHERE "courseCode" = $1 AND "year" = $2 AND "courseTitle" = $3`,
          [courseCode, year, courseTitle]
        );
      }

      if (afternoonSlots) {
        await client.query(
          `UPDATE course_table
           SET "afternoonSlots" = "afternoonSlots" + 1
           WHERE "courseCode" = $1 AND "year" = $2 AND "courseTitle" = $3`,
          [courseCode, year, courseTitle]
        );
      }
    }

    // Step 4: Delete from allocated_courses
    await client.query(
      `DELETE FROM allocated_courses WHERE empid = ANY($1::integer[])`,
      [empids]
    );

    // Step 5: Delete from faculty_table
    await client.query(
      `DELETE FROM faculty_table WHERE s_no = ANY($1::integer[])`,
      [s_nos]
    );

    await client.query("COMMIT");

    res
      .status(200)
      .json({ message: "Faculty and allocations deleted successfully." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Faculty deletion failed:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

app.post("/delete-grouped-courses", async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
     res.status(400).json({ error: "ids must be a non-empty array" });
     return
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Step 1: Get course details from course_table for each ID
    const courseResult = await client.query(
      `SELECT id, "courseTitle", "courseCode", year, school, stream
       FROM course_table
       WHERE id = ANY($1::integer[])`,
      [ids]
    );

    const courseRows = courseResult.rows;
    
    if (courseRows.length === 0) {
      throw new Error("No matching courses found.");
    }

    // Step 2: Delete from allocated_courses based on matching details
    for (const {
      courseTitle,
      courseCode,
      year,
      school,
      stream,
    } of courseRows) {
      await client.query(
        `DELETE FROM allocated_courses
         WHERE "courseTitle" = $1 AND "courseCode" = $2 AND year = $3 AND school = $4 AND stream = $5`,
        [courseTitle, courseCode, year, school, stream]
      );
    }

    // Step 3: Delete from course_table using ID
    await client.query(
      `DELETE FROM course_table WHERE id = ANY($1::integer[])`,
      [ids]
    );

    await client.query("COMMIT");

    res
      .status(200)
      .json({ message: "Courses and their allocations deleted successfully." });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error deleting grouped courses:", error);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});


// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
