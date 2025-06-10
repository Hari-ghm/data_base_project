import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "../contexts/AuthContext";
import { Course } from "../types";
import { Faculty } from "../types";

export default function CourseAllocation() {
  const navigate=useNavigate();

  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [filters, setFilters] = useState({
    stream: "",
    courseType: "",
    school: user?.school || "",
  });
  const [hasError, setHasError] = useState(false);

  // State to hold selected faculty for each course
  const [selectedFaculties, setSelectedFaculties] = useState<{
    [key: string]: { name: string; empId: string };
  }>({});

  // fetching faculty data from faculty_table
  const fetchFaculties = async () => {
    try {
      const response = await fetch("http://localhost:3001/faculties");
      if (!response.ok) {
        setHasError(true);
      }
      else{
        const data: Faculty[] = await response.json();
        setFaculty(data);
        setHasError(false);
      }
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
      setHasError(true);
    }
  };

  const [selectedSlot, setSelectedSlot] = useState<
    Record<string, { FN?: boolean; AN?: boolean }>
  >({});

  //fetching course data from course_table
  const fetchCourses = async () => {
    try {
      const response = await fetch("http://localhost:3001/courses");
      if (!response.ok) {
        setHasError(true);
      }
      else{
        const data: Course[] = await response.json();
        setCourses(data);
        setFilteredCourses(data);
        setHasError(false);
      }
    } catch (error) {
      console.error("❌ Failed to fetch courses:", error);
      setHasError(true);
    }
  };

  // Mock data for demonstration
  useEffect(() => {
    fetchCourses();
    fetchFaculties();
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
  const handleFacultyChange = (courseId: string, facultyName: string) => {
    const selected = faculty.find((f) => f.name === facultyName);
    if (selected) {
      setSelectedFaculties({
        ...selectedFaculties,
        [courseId]: { name: selected.name, empId: selected.empid.toString() },
      });
    }
  };

  // getting course wise faculty,fn,an details
  const [coursewiseDetails, setcoursewiseDetails] = useState<{
    [key: string]: { name: string; fn: boolean; an: boolean }[];
  }>({});

  const fetchcoursewiseDetails = async (
    courseCode: string,
    courseStream: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:3001/each-course-allocation?code=${courseCode}&stream=${courseStream}`
      );
      const data = await res.json();
      const uniqueKey = `${courseCode}_${courseStream}`;
      const transformed = data.map(
        (item: {
          faculty: string;
          forenoonSlots: boolean;
          afternoonSlots: boolean;
        }) => ({
          name: item.faculty,
          fn: item.forenoonSlots,
          an: item.afternoonSlots,
        })
      );
      setcoursewiseDetails((prev) => ({ ...prev, [uniqueKey]: transformed }));
    } catch (error) {
      console.error("Error fetching faculty info:", error);
    }
  };

  const uniqueStreams = Array.from(
    new Set(courses.map((course) => course.stream))
  );
  const uniqueCourseTypes = Array.from(
    new Set(courses.map((course) => course.courseType))
  );

  const handleTitleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sorted = [...filteredCourses].sort((a, b) => {
      const titleA = a.courseTitle.toLowerCase();
      const titleB = b.courseTitle.toLowerCase();

      if (newOrder === "asc") return titleA.localeCompare(titleB);
      else return titleB.localeCompare(titleA);
    });

    setFilteredCourses(sorted);
  };
  
  return (
    <div className="py-6">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Course Allocation
        </h1>

        {hasError ? (
          <div className="text-center text-red-500 mt-8 text-lg">
            Faculty Table or Course Table is not existing. click{" "}
            <span
              className="text-green-500 cursor-pointer"
              onClick={() => navigate("/upload-csv")}
            >
              Data insertion and deletion{" "}
            </span>
            in Navbar
          </div>
        ) : (
          <>
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
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 cursor-pointer select-none"
                            onClick={handleTitleSort}
                          >
                            <div className="flex items-center gap-1">
                              Course Title
                              <span className="text-gray-400 group-hover:text-black transition">
                                {sortOrder === "asc" && <ChevronUp size={16} />}
                                {sortOrder === "desc" && (
                                  <ChevronDown size={16} />
                                )}
                                {sortOrder === null && (
                                  <ChevronsUpDown size={16} />
                                )}
                              </span>
                            </div>
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
                            School
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
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Already Allocated
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredCourses.map((course) => {
                          const uniqueKey = `${course.courseCode}_${course.stream}`;
                          return (
                            <tr key={course.id}>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                <div className="min-w-[180px]">
                                  <Select
                                    options={faculty.map((f) => ({
                                      value: f.name,
                                      label: `${f.empid}_${f.name}`,
                                    }))}
                                    value={
                                      selectedFaculties[course.id]
                                        ? {
                                            value:
                                              selectedFaculties[course.id].name,
                                            label: `${
                                              selectedFaculties[course.id].empId
                                            }_${
                                              selectedFaculties[course.id].name
                                            }`,
                                          }
                                        : null
                                    }
                                    onChange={(selectedOption) =>
                                      handleFacultyChange(
                                        course.id,
                                        selectedOption?.value || ""
                                      )
                                    }
                                    placeholder="Select Faculty"
                                    className="text-sm"
                                    menuPlacement="auto"
                                  />
                                </div>
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
                                {course.school}
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
                                    fetchcoursewiseDetails(
                                      course.courseCode,
                                      course.stream
                                    );
                                    const selectSlot = selectedSlot[course.id];
                                    const selectedFacultyId =
                                      selectedFaculties[course.id];

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
                                    
                                    const uniqueKey = `${course.courseCode}_${course.stream}`;
                                    const existingAllocations =
                                      coursewiseDetails[uniqueKey] || [];
                                    const facultyAlloc =
                                      existingAllocations.find(
                                        (entry) =>
                                          entry.name === selectedFacultyId.name
                                      );

                                      if (facultyAlloc) {
                                        let allocationType = "";
                                        if (facultyAlloc.fn && facultyAlloc.an)
                                          allocationType = "both FN and AN";
                                        else if (facultyAlloc.fn)
                                          allocationType = "forenoon only";
                                        else if (facultyAlloc.an)
                                          allocationType = "afternoon only";

                                        const shouldProceed = window.confirm(
                                          `The faculty has already been allocated this course for ${allocationType}. Do you want to overwrite it?`
                                        );
                                        if (!shouldProceed) return;
                                      }

                                    try {
                                      // Collect all selected slots
                                      const selectedSlotTypes = [];
                                      if (selectSlot.FN)
                                        selectedSlotTypes.push("FN");
                                      if (selectSlot.AN)
                                        selectedSlotTypes.push("AN");

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
                                            Faculty: selectedFacultyId.name,
                                            Facultyempid:
                                              selectedFacultyId.empId,
                                            Course: course,
                                          }),
                                        }
                                      );

                                      const data = await response.json();
                                      if (!response.ok) {
                                        alert(
                                          data.message ||
                                            `Failed to allocate slot.`
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
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                                <div
                                  className="relative group inline-block"
                                  onMouseEnter={() =>
                                    fetchcoursewiseDetails(
                                      course.courseCode,
                                      course.stream
                                    )
                                  }
                                >
                                  <button className="rounded-full bg-gray-400 text-white w-5 h-5 ml-2 flex items-center justify-center text-xs cursor-pointer">
                                    i
                                  </button>

                                  {/* Tooltip Box - positioned to the left */}
                                  <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 hidden group-hover:block bg-white border border-gray-300 shadow-lg p-2 rounded-lg text-sm pointer-events-none w-56">
                                    <table className="table-auto text-left text-xs w-full">
                                      <thead>
                                        <tr className="font-semibold border-b">
                                          <th className="pr-2 py-1">Faculty</th>
                                          <th className="pr-2 py-1">FN</th>
                                          <th className="py-1">AN</th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {coursewiseDetails[uniqueKey]?.map(
                                          (f, idx) => {
                                            return (
                                              <tr key={idx}>
                                                <td className="pr-2 py-1">
                                                  {f.name || "No name"}
                                                </td>
                                                <td className="pr-2 py-1">
                                                  {f.fn ? "yes" : "no"}
                                                </td>
                                                <td className="py-1">
                                                  {f.an ? "yes" : "no"}
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
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
          </>
        )}
      </div>
    </div>
  );
}
