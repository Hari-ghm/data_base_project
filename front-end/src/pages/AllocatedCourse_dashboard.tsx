import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AllocatedCourse.css";
import { Faculty } from "../types";

// Update the Faculty type to include email and employeeId
interface ExtendedFaculty extends Faculty {
  email: string;
  employeeId: string;
}

export default function AllocatedCourses() {
  const [faculties, setFaculties] = useState<ExtendedFaculty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    // In a real application, this would be fetched from an API
    const mockFaculties: ExtendedFaculty[] = [
      {
        id: "1",
        name: "Dr. A. Kumar",
        department: "School of Computing",
        imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        email: "a.kumar@example.com",
        employeeId: "EMP001"
      },
      {
        id: "2",
        name: "Prof. B. Sharma",
        department: "School of Electronics",
        imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        email: "b.sharma@example.com",
        employeeId: "EMP002"
      },
      {
        id: "3",
        name: "Dr. C. Verma",
        department: "School of Computing",
        imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        email: "c.verma@example.com",
        employeeId: "EMP003"
      },
      {
        id: "4",
        name: "Dr. D. Reddy",
        department: "School of Mechanical Engineering",
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        email: "d.reddy@example.com",
        employeeId: "EMP004"
      },
      {
        id: "5",
        name: "Dr. E. Nair",
        department: "School of Computing",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
        email: "e.nair@example.com",
        employeeId: "EMP005"
      }
    ];

    setFaculties(mockFaculties);
    setLoading(false);
  }, []);

  // Filter faculties based on search query and department
  const filteredFaculties = faculties.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || faculty.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for the filter dropdown
  const departments = Array.from(new Set(faculties.map(faculty => faculty.department)));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Faculty Timetable System</h1>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <select
          aria-label="Filter by Department" // Added aria-label for accessibility
          className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={departmentFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartmentFilter(e.target.value)}
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>

        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search faculty..."
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="absolute right-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      {loading ?
        <div className="text-center py-10">
          <div className="spinner"></div>
          <p className="mt-4 text-gray-600">Loading faculty data...</p>
        </div>
        : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFaculties.length > 0 ? (
              filteredFaculties.map(faculty => (
                <div key={faculty.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-105">
                  <Link to={`/faculty-timetable/${faculty.id}`} className="block text-current no-underline">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={faculty.imageUrl}
                          alt={faculty.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{faculty.name}</h3>
                          <span className="text-gray-500 text-sm">{faculty.email}</span>
                          <span className="text-gray-500 text-sm block">{faculty.employeeId}</span>
                          <span className="text-gray-500 text-sm">{faculty.department}</span>
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
                <h3 className="text-xl text-gray-500 mb-2">No faculty members found</h3>
                <p className="text-gray-400">Try adjusting your search criteria</p>
              </div>
            )}
          </div>
        )}
    </div>
  );
}