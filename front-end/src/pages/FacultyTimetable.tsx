import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Papa from "papaparse";
import "./AllocatedCourse.css";
import { CourseData, Faculty } from "../types";
import { ArrowLeft } from "lucide-react";

export default function FacultyTimetable() {
  const { facultyId } = useParams<{ facultyId: string }>();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would be fetched from an API
    const mockFaculties: Faculty[] = [
      {
        id: "1",
        name: "Dr. A. Kumar",
        department: "School of Computing",
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "2",
        name: "Prof. B. Sharma",
        department: "School of Electronics",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "3",
        name: "Dr. C. Verma",
        department: "School of Computing",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "4",
        name: "Dr. D. Reddy",
        department: "School of Mechanical Engineering",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
      },
      {
        id: "5",
        name: "Dr. E. Nair",
        department: "School of Computing",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
      }
    ];

    const currentFaculty = mockFaculties.find(f => f.id === facultyId) || null;
    setFaculty(currentFaculty);

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
            // Filter courses for the current faculty
            if (currentFaculty) {
              const facultyCourses = results.data.filter(
                course => course.faculty === currentFaculty.name
              );
              setCourses(facultyCourses);
            } else {
              setCourses([]);
              setError("Faculty not found");
            }
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
        
        if (currentFaculty) {
          const facultyCourses = hardcodedData.filter(
            course => course.faculty === currentFaculty.name
          );
          setCourses(facultyCourses);
        } else {
          setCourses([]);
          setError("Faculty not found");
        }
        setLoading(false);
      });
  }, [facultyId]);

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
        <Link to="/allocated-course" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Faculty List
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img 
            src={faculty.imageUrl} 
            alt={faculty.name} 
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold">{faculty.name}</h1>
            <p className="text-gray-600">{faculty.department}</p>
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
          <p className="text-gray-600">No courses allocated to this faculty.</p>
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
                <th>Lecture Hours</th>
                <th>Tutorial Hours</th>
                <th>Practical Hours</th>
                <th>Prerequisites</th>
                <th>School</th>
                <th>Forenoon Slots</th>
                <th>Afternoon Slots</th>
                <th>Basket</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id}>
                  <td>{course.year}</td>
                  <td>{course.courseCode}</td>
                  <td>{course.courseTitle}</td>
                  <td>{course.courseType}</td>
                  <td>{course.stream}</td>
                  <td>{course.credits}</td>
                  <td>{course.lectureHours}</td>
                  <td>{course.tutorialHours}</td>
                  <td>{course.practicalHours}</td>
                  <td>{course.prerequisites || "None"}</td>
                  <td>{course.school}</td>
                  <td>{course.forenoonSlots}</td>
                  <td>{course.afternoonSlots}</td>
                  <td>{course.basket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}