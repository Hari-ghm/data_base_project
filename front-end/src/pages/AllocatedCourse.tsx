/*import React, { useEffect, useState } from "react";
import "./AllocatedCourse.css"; // Import the CSS file

export default function AllocatedCourse() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/allocated-courses")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="allocated-course-container">
      <h1>Allocated Courses for Faculty</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Code</th>
            <th>Title</th>
            <th>Type</th>
            <th>Slot</th>
            <th>Stream</th>
            <th>Pre-requisite</th>
            <th>School</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.year}</td>
              <td>{row.code}</td>
              <td>{row.title}</td>
              <td>{row.type}</td>
              <td>{row.slot}</td>
              <td>{row.stream}</td>
              <td>{row.pre_requisite}</td>
              <td>{row.school}</td>
              <td>{row.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
*/

import React, { useEffect, useState } from "react";
import "./AllocatedCourse.css"; // Import the CSS file

export default function AllocatedCourse() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Dummy data for testing
    const dummyData = [
      {
        year: 2023,
        code: "CS101",
        title: "Introduction to Programming",
        type: "Core",
        slot: "A1",
        stream: "Engineering",
        pre_requisite: "None",
        school: "School of Computing",
        credit: 4,
      },
      {
        year: 2023,
        code: "MA101",
        title: "Calculus I",
        type: "Core",
        slot: "B1",
        stream: "Engineering",
        pre_requisite: "None",
        school: "School of Mathematics",
        credit: 3,
      },
      {
        year: 2023,
        code: "PH101",
        title: "Physics I",
        type: "Core",
        slot: "C1",
        stream: "Engineering",
        pre_requisite: "None",
        school: "School of Physics",
        credit: 4,
      },
    ];

    // Set the dummy data
    setData(dummyData);
  }, []);

  return (
    <div className="allocated-course-container">
      <h1>Allocated Courses for Faculty</h1>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Code</th>
            <th>Title</th>
            <th>Type</th>
            <th>Slot</th>
            <th>Stream</th>
            <th>Pre-requisite</th>
            <th>School</th>
            <th>Credit</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td>{row.year}</td>
              <td>{row.code}</td>
              <td>{row.title}</td>
              <td>{row.type}</td>
              <td>{row.slot}</td>
              <td>{row.stream}</td>
              <td>{row.pre_requisite}</td>
              <td>{row.school}</td>
              <td>{row.credit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}