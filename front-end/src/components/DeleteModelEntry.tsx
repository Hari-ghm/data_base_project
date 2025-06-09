import React, { useEffect, useRef, useState } from "react";
import { Course, Faculty } from "../types";

interface DeleteEntryModalProps {
  type: "course" | "faculty";
  onClose: () => void;
}

type RowItem = Faculty | Course;

export const DeleteEntryModal: React.FC<DeleteEntryModalProps> = ({
  type,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [data, setData] = useState<RowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    try {
      const endpoint = type === "faculty" ? "/faculties" : "/courses";
      const response = await fetch(`http://localhost:3001${endpoint}`);
      if (!response.ok) throw new Error("Failed to fetch");
      let result = await response.json();
      if (type === "faculty") {
        result = result.map((item: any) => ({
          ...item,
          id: item.s_no, // map s_no to id
        }));
      }
      
      setData(result);
    } catch (err) {
      console.error("❌ API error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [type]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    const endpoint =
      type === "faculty"
        ? "/delete-grouped-faculties"
        : "/delete-grouped-courses";

    try {
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          type === "faculty" ? { empids: selectedIds } : { ids: selectedIds }
        ),
      });
       
      if (!response.ok) {
        throw new Error("Failed to delete data");
      }
      alert(
        `Selected ${
          type === "faculty" ? "faculties" : "courses"
        } deleted successfully.`
      );

      onClose();
    } catch (error) {
      console.error("❌ Error deleting data:", error);
    }
  };  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Delete {type === "faculty" ? "Faculty" : "Course"} Data
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <div className="text-center text-red-600">
            <p className="mb-4">
              {type === "faculty"
                ? "❌ Faculty table is not existing."
                : "❌ Course table is not existing."}
            </p>
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Select</th>
                {type === "faculty" ? (
                  <>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Emp ID</th>
                  </>
                ) : (
                  <>
                    <th className="p-2 text-left">Year</th>
                    <th className="p-2 text-left">Course Title</th>
                    <th className="p-2 text-left">Course Type</th>
                    <th className="p-2 text-left">Course Code</th>
                    <th className="p-2 text-left">Stream</th>
                    <th className="p-2 text-left">School</th>
                    <th className="p-2 text-left"></th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {data.map((row) => {
                const rowId = Number(row.id);
                if (isNaN(rowId)) return null;

                return (
                  <tr key={rowId} className="border-t">
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(rowId)}
                        onChange={() => handleCheckboxChange(rowId)}
                      />
                    </td>
                    {type === "faculty" ? (
                      <>
                        <td className="p-2">{(row as Faculty).name}</td>
                        <td className="p-2">{(row as Faculty).empid}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-2">{(row as Course).year}</td>
                        <td className="p-2">{(row as Course).courseTitle}</td>
                        <td className="p-2">{(row as Course).courseType}</td>
                        <td className="p-2">{(row as Course).courseCode}</td>
                        <td className="p-2">{(row as Course).stream}</td>
                        <td className="p-2">{(row as Course).school}</td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!error && (
          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
