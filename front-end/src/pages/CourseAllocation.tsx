import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Course } from "../types";

export default function CourseAllocation() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState({
    stream: "",
    courseType: "",
    school: user?.school || "",
  });

  // Mock data for faculties
  const faculties = ["Dr. Smith", "Prof. Johnson", "Dr. Williams", "Ms. Brown"];

  // State to hold selected faculty for each course
  const [selectedFaculties, setSelectedFaculties] = useState<{
    [key: string]: string;
  }>({});
   

  const [selectedSlot, setSelectedSlot] = useState<
    Record<string, { FN?: boolean; AN?: boolean }>
  >({});

  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3001/courses");
      const data: Course[] = await response.json();
      setCourses(data);
      setFilteredCourses(data);
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
    }
  };

  // Mock data for demonstration
  useEffect(() => {
    fetchCourses();
  }, []);


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);

    let filtered = courses;
    if (newFilters.stream) {
      filtered = filtered.filter(
        (course) => course.stream === newFilters.stream
      );
    }
    if (newFilters.courseType) {
      filtered = filtered.filter(
        (course) => course.courseType === newFilters.courseType
      );
    }
    if (newFilters.school) {
      filtered = filtered.filter(
        (course) => course.school === newFilters.school
      );
    }
    setFilteredCourses(filtered);
  };

  // Handle faculty selection for each course
  const handleFacultyChange = (courseId: string, faculty: string) => {
    setSelectedFaculties({ ...selectedFaculties, [courseId]: faculty });
  };


  const uniqueStreams = Array.from(
    new Set(courses.map((course) => course.stream))
  );
  const uniqueCourseTypes = Array.from(
    new Set(courses.map((course) => course.courseType))
  );
   
  return (
    <div className="py-6">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Course Allocation
        </h1>

        {/* Filters */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select
            name="stream"
            value={filters.stream}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Streams</option>
            {uniqueStreams.map((stream) => (
              <option key={stream} value={stream}>
                {stream}
              </option>
            ))}
          </select>

          <select
            name="courseType"
            value={filters.courseType}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Course Types</option>
            {uniqueCourseTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            name="school"
            value={filters.school}
            onChange={handleFilterChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Schools</option>
            <option value="SCOPE">SCOPE</option>
            <option value="SENSE">SENSE</option>
            <option value="VITBS">VITBS</option>
            <option value="ACAD">ACAD</option>
          </select>
        </div>

        {/* Course Table */}
        <div className="mt-8 flex flex-col overflow-visible relative">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 overflow-visible">
            <div className="inline-block min-w-full min-h-72 py-2 align-middle md:px-6 lg:px-8 relative">
              <div className="overflow-visible shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[130px]"
                      >
                        Faculty
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Year
                      </th>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Course Code
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 max-w-[200px] truncate "
                      >
                        Course Title
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Stream
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Credit
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        FN Slots
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        AN Slots
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCourses.map((course) => (
                      <tr key={course.id}>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <select
                            value={selectedFaculties[course.id] || ""}
                            onChange={(e) =>
                              handleFacultyChange(course.id, e.target.value)
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select Faculty</option>
                            {faculties.map((faculty) => (
                              <option key={faculty} value={faculty}>
                                {faculty}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {course.year}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {course.courseCode}
                        </td>
                        <td
                          className="whitespace-nowrap px-3 py-4 text-sm text-gray-500  max-w-[200px] truncate"
                          title={course.courseTitle}
                        >
                          {course.courseTitle}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {course.stream}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {course.courseType}
                        </td>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {course.credits}
                        </td>

                        {/* FN Slots */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                          <button
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.forenoonSlots > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              if (course.forenoonSlots > 0) {
                                setSelectedSlot((prev) => ({
                                  ...prev,
                                  [course.id]: {
                                    ...prev[course.id],
                                    FN: !prev[course.id]?.FN, // toggle FN only
                                  },
                                }));
                              }
                            }}
                            disabled={course.forenoonSlots === 0}
                          >
                            {selectedSlot[course.id]?.FN
                              ? "Selected"
                              : `${course.forenoonSlots} available`}
                          </button>
                        </td>

                        {/* AN Slots */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                          <button
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.afternoonSlots > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800 cursor-not-allowed"
                            }`}
                            onClick={() => {
                              if (course.afternoonSlots > 0) {
                                setSelectedSlot((prev) => ({
                                  ...prev,
                                  [course.id]: {
                                    ...prev[course.id],
                                    AN: !prev[course.id]?.AN, // toggle AN only
                                  },
                                }));
                              }
                            }}
                            disabled={course.afternoonSlots === 0}
                          >
                            {selectedSlot[course.id]?.AN
                              ? "Selected"
                              : `${course.afternoonSlots} available`}
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={async () => {
                              const selectSlot = selectedSlot[course.id];
                              const selectedFacultyId =selectedFaculties[course.id];
                              console.log(selectedFacultyId)
                              if (!selectedFacultyId) {
                                alert("Please select a faculty first!");
                                return;
                              }

                              if (
                                !selectSlot ||
                                (!selectSlot.FN && !selectSlot.AN)
                              ) {
                                alert("Please select a slot first!");
                                return;
                              }


                              try {
                                // Collect all selected slots
                                const selectedSlotTypes = [];
                                if (selectSlot.FN) selectedSlotTypes.push("FN");
                                if (selectSlot.AN) selectedSlotTypes.push("AN");
 
                                const response = await fetch(
                                  "http://localhost:3001/api/allocate-slot",
                                  {
                                    method: "POST",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                      courseId: course.id,
                                      F_N: selectSlot.FN,
                                      A_N: selectSlot.AN,
                                      faculty:selectedFacultyId,
                                      Course:course
                                    }),
                                  }
                                );

                                const data = await response.json();
                                if (!response.ok) {
                                  alert(
                                    data.message || `Failed to allocate slot.`
                                  );
                                  return; // stop if any request fails
                                }

                                alert("Slot(s) allocated successfully!");
                                // Reset selection after allocation
                                setSelectedSlot((prev) => ({
                                  ...prev,
                                  [course.id]: { FN: false, AN: false },
                                }));

                                await fetchCourses();
                              } catch (error) {
                                console.error("Error:", error);
                                alert("Something went wrong!");
                              }
                            }}
                          >
                            Allocate
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredCourses.length === 0 && (
                      <tr>
                        <td
                          colSpan={8}
                          className="whitespace-nowrap px-3 py-4 text-center text-sm text-gray-500"
                        >
                          No courses found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
