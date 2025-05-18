import "./AllocatedCourse.css";
import { AllocatedCourses } from "../types";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const FullTable = () => {
    const [courses, setCourses] = useState<AllocatedCourses[]>([]);

    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:3001/full-table");
        const data: AllocatedCourses[] = await response.json();
        setCourses(data); 
      } catch (error) {
        console.error("❌ Failed to fetch courses:", error);
      }
    };

    // Mock data for demonstration
    useEffect(() => {
      fetchCourses();
    }, []);
    
    //downloading csv
    const downloadCSV = () => {
      if (!courses.length) return;

      // Exclude 'id' from headers
      const keys = Object.keys(courses[0]).filter((key) => key !== "id");
      const header = keys.join(",") + "\n";

      const rows = courses
        .map((course) =>
          keys
            .map((key) => {
              const value = course[key as keyof AllocatedCourses];
              return typeof value === "string" && value.includes(",")
                ? `"${value}"`
                : value;
            })
            .join(",")
        )
        .join("\n");

      const csvContent = header + rows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "allocated_courses.csv");
      link.click();
    };
    
    // downloading pdf
    const downloadPDF = () => {
      if (!courses.length) return;

      const doc = new jsPDF();

      // Get all keys except 'id'
      const keys = Object.keys(courses[0]).filter((key) => key !== "id");

      // Add "S.No" as first column header
      const headers = [["S.No", ...keys.map((key) => key.toUpperCase())]];

      // Map data rows with serial numbers starting from 1
      const data = courses.map((course, index) => {
        const row = keys.map((key) => {
          const value = course[key as keyof typeof course];
          return typeof value === "boolean"
            ? value
              ? "Yes"
              : "No"
            : String(value);
        });
        return [index + 1, ...row]; // Add S.No at the beginning
      });

      autoTable(doc, {
        head: headers,
        body: data,
        startY: 20,
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] }, // Teal header
      });

      doc.save("allocated_courses.pdf");
    };
     
    if (!courses.length) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-xl mx-auto mt-10">
          No courses are allocated yet !!
        </div>
      );
    }
      
    return (
      <div className="mt-8 flex flex-col overflow-visible relative">
        <div className="text-3xl font-semibold text-center mb-7">
          General Allocated Course Table
        </div>
        <div className="">
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 mr-9 rounded-lg mb-7 shadow"
            onClick={downloadCSV}
          >
            Download CSV
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg mb-7 shadow"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>

        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8 overflow-visible">
          <div className="inline-block min-w-full min-h-72 py-2 align-middle md:px-6 lg:px-8 relative">
            <div className="overflow-visible shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[130px]"
                    >
                      Faculty
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 min-w-[130px]"
                    >
                      EmpId
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {course.faculty}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                        {course.empid}
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

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                        {course.forenoonSlots ? "Yes" : "No"}
                      </td>

                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 relative">
                        {course.afternoonSlots ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
      
};

export default FullTable
