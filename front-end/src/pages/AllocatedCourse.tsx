import { useEffect, useState } from "react";
import "./AllocatedCourse.css";
import { AllocatedCourses } from "../types";

export default function AllocatedCourse() {
  const [courses, setCourses] = useState<AllocatedCourses[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3001/allocated-courses");
        const data: AllocatedCourses[] = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
      }
  };
  
    // Mock data for demonstration
    useEffect(() => {
      fetchCourses();
    }, []);

  if (loading) {
    return (
      <div className="allocated-course-container">
        <h1>Allocated Courses</h1>
        <div className="loading">Loading course data...</div>
      </div>
    );
  }

  return (
    <div className="allocated-course-container">
      <h1>Allocated Courses</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="table-container">
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Year</th>
              <th>Stream</th>
              <th>Course Type</th>
              <th>Course Code</th>
              <th>Course Title</th>
              <th>Credits</th>
              <th>Prerequisites</th>
              <th>School</th>
              <th>Forenoon Slots</th>
              <th>Afternoon Szlots</th>
              <th>Faculty</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.year}</td>
                <td>{course.stream}</td>
                <td>{course.courseType}</td>
                <td>{course.courseCode}</td>
                <td>{course.courseTitle}</td>
                <td>{course.credits}</td>
                <td>{course.prerequisites || "None"}</td>
              
                <td>{course.forenoonSlots}</td>
                <td>{course.afternoonSlots}</td>
                <td>{course.faculty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}