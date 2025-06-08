import React, { useEffect, useState } from "react";

interface ModalProps {
  type: "course" | "faculty";
  onClose: () => void;
}

export const DataEntryModal: React.FC<ModalProps> = ({ type, onClose }) => {
  // Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const courseFields = [
    "year",
    "stream",
    "courseType",
    "courseCode",
    "courseTitle",
    "lectureHours",
    "tutorialHours",
    "practicalHours",
    "credits",
    "prerequisites",
    "school",
    "forenoonSlots",
    "afternoonSlots",
    "totalSlots",
    "basket",
  ];

  const facultyFields = ["name", "empid", "photo_url", "email", "school"];

  const fields = type === "course" ? courseFields : facultyFields;
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log(formData);
      const response = await fetch(
        type === "course"
          ? "http://localhost:3001/api/singleDataEntryCourse"
          : "http://localhost:3001/api/singleDataEntryFaculty",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to submit");

      alert("Data submitted successfully");
      onClose(); // close modal
    } catch (err: any) {
      console.error("Error submitting:", err);
      alert("s_no or empid already exists.");
    }
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <h2 className="text-xl font-bold mb-4">
          {type === "course" ? "Enter Course Data" : "Enter Faculty Data"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map((field) => (
            <input
              key={field}
              name={field}
              placeholder={field}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          ))}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>

        <button onClick={onClose} className="mt-4 text-red-500 underline">
          Close
        </button>
      </div>
    </div>
  );
};
