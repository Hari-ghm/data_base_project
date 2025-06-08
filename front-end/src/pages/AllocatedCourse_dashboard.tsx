import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import "./AllocatedCourse.css";
import { Faculty } from "../types";


export default function AllocatedCourses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [hasError, setHasError] = useState(false);
  
  const navigate=useNavigate();

  // Mock data for faculties
  const fetchFaculties = async () => {
    try {
      const response = await fetch("http://localhost:3001/faculties");
      if (!response.ok) {
        setHasError(true);
      }
      else{
        const data: Faculty[] = await response.json();
        setFaculty(data);
        setLoading(false);
      }
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
    }
  };

  useEffect(() => {
      fetchFaculties();
    }, []);

  // Filter faculties based on search query and school
  const filteredFaculties = faculty.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || faculty.school === departmentFilter;
    return matchesSearch && matchesDepartment;
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Faculty Timetable System
      </h1>

      {hasError ? (
        <div className="text-center text-red-500 mt-8 text-lg">
          Faculty Table or Course Table is not existing. click{" "}
          <span
            className="text-green-500 cursor-pointer"
            onClick={() => navigate("/upload-csv")}
          >
            upload csv{" "}
          </span>
          in Navbar
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row items-center mb-8 gap-4">
            <select
              aria-label="Filter by Department" // Added aria-label for accessibility
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departmentFilter}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDepartmentFilter(e.target.value)
              }
            >
              <option value="all">All Departments</option>
            </select>

            <Link to="/full-table">
              <button className=" px-4 py-2 bg-green-600 text-white rounded hover:bg-indigo-700">
                View Full Table
              </button>
            </Link>

            <div className="relative w-full md:w-64 text-right ml-auto">
              <input
                type="text"
                placeholder="Search faculty..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="absolute right-3 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <div className="spinner"></div>
              <p className="mt-4 text-gray-600">Loading faculty data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFaculties.length > 0 ? (
                filteredFaculties.map((faculty) => (
                  <div
                    key={faculty.empid}
                    className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105"
                  >
                    <Link
                      to={`/faculty-timetable/${String(faculty.empid)}`}
                      className="block text-current no-underline"
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <img
                            src={faculty.photo_url}
                            alt={faculty.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-lg">
                              {faculty.name}
                            </h3>
                            <span className="text-gray-500 text-sm">
                              {faculty.email}
                            </span>
                            <span className="text-gray-500 text-sm block">
                              {faculty.empid}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {faculty.school}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">
                            View Timetable
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 bg-white rounded-lg">
                  <h3 className="text-xl text-gray-500 mb-2">
                    No faculty members found
                  </h3>
                  <p className="text-gray-400">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}