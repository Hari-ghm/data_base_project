import React, { useEffect, useState } from "react";
import "./AllocatedCourse.css";
import Papa from "papaparse";

interface CourseData {
  id: string;
  year: string;
  stream: string;
  courseType: string;
  courseCode: string;
  courseTitle: string;
  lectureHours: string;
  tutorialHours: string;
  practicalHours: string;
  credits: string;
  prerequisites: string;
  school: string;
  forenoonSlots: string;
  afternoonSlots: string;
  faculty: string;
  basket: string;
}

export default function AllocatedCourse() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load the CSV file
    fetch("/allocated_courses_corrected.csv")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch CSV file");
        }
        return response.text();
      })
      .then((csvText) => {
        Papa.parse<CourseData>(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCourses(results.data);
            setLoading(false);
          },
          error: (error) => {
            setError(`Error parsing CSV: ${error.message}`);
            setLoading(false);
          }
        });
      })
      .catch((error) => {
        // Fallback to hardcoded data if fetch fails
        console.error("Error fetching CSV:", error);
        setError("Could not load CSV file. Using sample data instead.");
        
        // Use the data from the CSV file as hardcoded data
        const hardcodedData: CourseData[] = [
          {
            id: "1",
            year: "2022",
            stream: "CSE",
            courseType: "Core",
            courseCode: "CSE101",
            courseTitle: "Introduction to Programming",
            lectureHours: "3",
            tutorialHours: "1",
            practicalHours: "2",
            credits: "4",
            prerequisites: "",
            school: "School of Computing",
            forenoonSlots: "True",
            afternoonSlots: "False",
            faculty: "Dr. A. Kumar",
            basket: "Programming"
          },
          {
            id: "2",
            year: "2021",
            stream: "ECE",
            courseType: "Core",
            courseCode: "ECE102",
            courseTitle: "Digital Logic Design",
            lectureHours: "3",
            tutorialHours: "1",
            practicalHours: "2",
            credits: "4",
            prerequisites: "",
            school: "School of Electronics",
            forenoonSlots: "False",
            afternoonSlots: "True",
            faculty: "Prof. B. Sharma",
            basket: "Digital Systems"
          },
          {
            id: "3",
            year: "2024",
            stream: "CSE",
            courseType: "Elective",
            courseCode: "CSE203",
            courseTitle: "Data Structures",
            lectureHours: "3",
            tutorialHours: "0",
            practicalHours: "2",
            credits: "4",
            prerequisites: "CSE101",
            school: "School of Computing",
            forenoonSlots: "True",
            afternoonSlots: "True",
            faculty: "Dr. C. Verma",
            basket: "DSA"
          },
          {
            id: "4",
            year: "2023",
            stream: "ME",
            courseType: "Core",
            courseCode: "ME201",
            courseTitle: "Thermodynamics",
            lectureHours: "3",
            tutorialHours: "1",
            practicalHours: "0",
            credits: "4",
            prerequisites: "",
            school: "School of Mechanical Engineering",
            forenoonSlots: "True",
            afternoonSlots: "False",
            faculty: "Dr. D. Reddy",
            basket: "Thermal"
          },
          {
            id: "5",
            year: "2024",
            stream: "CSE",
            courseType: "Elective",
            courseCode: "CSE310",
            courseTitle: "Machine Learning",
            lectureHours: "3",
            tutorialHours: "1",
            practicalHours: "2",
            credits: "5",
            prerequisites: "CSE203",
            school: "School of Computing",
            forenoonSlots: "False",
            afternoonSlots: "True",
            faculty: "Dr. E. Nair",
            basket: "AI/ML"
          }
        ];
        
        setCourses(hardcodedData);
        setLoading(false);
      });
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
              <th>Lecture Hours</th>
              <th>Tutorial Hours</th>
              <th>Practical Hours</th>
              <th>Credits</th>
              <th>Prerequisites</th>
              <th>School</th>
              <th>Forenoon Slots</th>
              <th>Afternoon Slots</th>
              <th>Faculty</th>
              <th>Basket</th>
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
                <td>{course.lectureHours}</td>
                <td>{course.tutorialHours}</td>
                <td>{course.practicalHours}</td>
                <td>{course.credits}</td>
                <td>{course.prerequisites || "None"}</td>
                <td>{course.school}</td>
                <td>{course.forenoonSlots}</td>
                <td>{course.afternoonSlots}</td>
                <td>{course.faculty}</td>
                <td>{course.basket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}