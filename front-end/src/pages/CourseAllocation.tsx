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

  // State to manage slot dropdown selection
  const [selectedSlot, setSelectedSlot] = useState<{
    courseId: string;
    slotType: "FN" | "AN";
  } | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: "1",
        year: 2021,
        stream: "M.Tech CSE (SE)",
        courseType: "Core",
        courseCode: "SWE1011",
        courseTitle: "Soft Computing",
        lectureHours: 3,
        tutorialHours: 0,
        practicalHours: 0,
        credits: 4,
        prerequisites: "",
        school: "SCOPE",
        forenoonSlots: 1,
        afternoonSlots: 0,
        totalSlots: 1,
        basket: "Basket 5",
      },
    ];
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
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

  // Toggle slot dropdown
  const toggleSlotDropdown = (courseId: string, slotType: "FN" | "AN") => {
    if (
      selectedSlot?.courseId === courseId &&
      selectedSlot?.slotType === slotType
    ) {
      setSelectedSlot(null); // Close dropdown if clicked again
    } else {
      setSelectedSlot({ courseId, slotType });
    }
  };

  // Handle slot selection (A, B, C)
  const handleSlotSelection = (
    courseId: string,
    slot: string,
    slotType: "FN" | "AN"
  ) => {
    setAllocatedSlots((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [slotType]: slot,
      },
    }));
    setSelectedSlot(null); // Close dropdown after selection
  };

  const uniqueStreams = Array.from(
    new Set(courses.map((course) => course.stream))
  );
  const uniqueCourseTypes = Array.from(
    new Set(courses.map((course) => course.courseType))
  );
   
  const [allocatedSlots, setAllocatedSlots] = useState<{
    [key: string]: { FN?: string; AN?: string };
  }>({});


  return (
    <div className="py-6">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Course Code
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Faculty
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
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
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Type
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
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {course.courseCode}
                        </td>
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
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {course.courseTitle}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {course.stream}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {course.courseType}
                        </td>

                        {/* FN Slots */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                          <button
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.forenoonSlots > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800 cursor-not-allowed"
                            }`}
                            onClick={() =>
                              course.forenoonSlots > 0 &&
                              toggleSlotDropdown(course.id, "FN")
                            }
                            disabled={course.forenoonSlots === 0}
                          >
                            {allocatedSlots[course.id]?.FN ||
                              `${course.forenoonSlots} available`}
                          </button>

                          {selectedSlot?.courseId === course.id &&
                            selectedSlot?.slotType === "FN" &&
                            course.forenoonSlots > 0 && (
                              <div className="absolute z-50 right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg max-h-[150px] overflow-y-auto">
                                <ul className="py-1 max-h-[100px] overflow-y-auto">
                                  {["A", "B", "C"].map((item) => (
                                    <li
                                      key={item}
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        handleSlotSelection(
                                          course.id,
                                          item,
                                          "FN"
                                        )
                                      }
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </td>

                        {/* AN Slots */}
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                          <button
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              course.afternoonSlots > 0
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800 cursor-not-allowed"
                            }`}
                            onClick={() =>
                              course.afternoonSlots > 0 &&
                              toggleSlotDropdown(course.id, "AN")
                            }
                            disabled={course.afternoonSlots === 0}
                          >
                            {allocatedSlots[course.id]?.AN ||
                              `${course.afternoonSlots} available`}
                          </button>

                          {selectedSlot?.courseId === course.id &&
                            selectedSlot?.slotType === "AN" &&
                            course.afternoonSlots > 0 && (
                              <div className="absolute z-50 right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg max-h-[150px] overflow-y-auto">
                                <ul className="py-1 max-h-[100px] overflow-y-auto">
                                  {["A", "B", "C"].map((item) => (
                                    <li
                                      key={item}
                                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                                      onClick={() =>
                                        handleSlotSelection(
                                          course.id,
                                          item,
                                          "AN"
                                        )
                                      }
                                    >
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900"
                          onClick={()=>console.log(course.id)}
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
