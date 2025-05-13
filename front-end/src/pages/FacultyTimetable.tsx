import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./AllocatedCourse.css";
import { AllocatedCourses, Faculty } from "../types";
import { ArrowLeft } from "lucide-react";

export default function FacultyTimetable() {
  const { facultyempId } = useParams<{ facultyempId: string }>();
  const empid = facultyempId ? parseInt(facultyempId, 10) : null;

  const [courses, setCourses] = useState<AllocatedCourses[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async (empid: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/allocated-courses?empid=${empid}`
      );
      const data = await response.json();

      if (Array.isArray(data)) {
        setCourses(data); // ✅ set valid courses
      } else {
        setCourses([]); // 🚫 response was not an array (e.g. { message: "No courses..." })
        setError(data.message || "Unknown error"); // optional: store error
      }
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
      setError("Failed to fetch courses");
      setCourses([]); // prevent map crash
    } finally {
      setLoading(false); // ✅ always stop loading
    }
  };
  

  const fetchFaculty = async (empid: number) => {
    try {
      const response = await fetch(
        `http://localhost:3001/faculty?empid=${empid}`
      );
      const data = await response.json();

      // You might get an array or a single object
      if (data && !data.message) {
        setFaculty(data); // or setFaculty(data[0]) if it's an array
      } else {
        setFaculty(null);
        console.warn("Faculty not found in response");
      }
    } catch (error) {
      console.error("❌ Failed to fetch faculty:", error);
    } finally {
      setLoading(false); // ✅ Important!
    }
  };

  useEffect(() => {
    if (empid) {
      fetchCourses(empid);
      fetchFaculty(empid);
    }
  }, [empid]);
  
  const handleDelete = async (courseCode: string,afternoonSlots: boolean,forenoonSlots:boolean) => {
    try {
      
      const response = await fetch("http://localhost:3001/delete-course", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empid, // from useParams
          courseCode, // passed from button
          afternoonSlots,
          forenoonSlots
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (typeof empid === "number") {
          alert("Slot(s) deleted successfully!");
          fetchCourses(empid);
        }
      } else {
        console.error("❌ Failed to delete course:", result.message);
      }
    } catch (error) {
      console.error("❌ Error deleting course:", error);
    }
  };
  

  if (loading) {
    return (
      <div className="allocated-course-container">
        <h1>Faculty Timetable</h1>
        <div className="loading">Loading timetable data...</div>
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="allocated-course-container">
        <h1>Faculty Not Found</h1>
        <div className="error-message">The requested faculty could not be found.</div>
        <div className="text-center mt-6">
          <Link to="/allocated-course" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Faculty List
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="allocated-course-container">
      <div className="mb-8">
        <Link
          to="/allocated-course"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Faculty List
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={faculty.photo_url}
            alt={faculty.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{faculty.name}</h1>
            <p className="text-gray-600">{faculty.school}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                {courses.length} Courses
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                Active Faculty
              </span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Allocated Courses</h2>

      {error && <div className="error-message">{error}</div>}

      {courses.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">Allocate course to this faculty</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Course Type</th>
                <th>Stream</th>
                <th>Credits</th>
                <th>Prerequisites</th>
                <th>School</th>
                <th>Forenoon Slots</th>
                <th>Afternoon Slots</th>
                <th>Delete course</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? (
                courses.map((course) => (
                  <tr key={course.id}>
                    <td>{course.year}</td>
                    <td>{course.courseCode}</td>
                    <td>{course.courseTitle}</td>
                    <td>{course.courseType}</td>
                    <td>{course.stream}</td>
                    <td>{course.credits}</td>
                    <td>{course.prerequisites || "None"}</td>
                    <td>{course.school}</td>
                    <td>{course.forenoonSlots ? "Yes" : "No"}</td>
                    <td>{course.afternoonSlots ? "Yes" : "No"}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(course.courseCode,!!course.afternoonSlots,!!course.forenoonSlots)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <p>No courses found for this faculty</p>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}