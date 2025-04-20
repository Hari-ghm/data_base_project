import React, { useEffect, useState } from "react";
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
