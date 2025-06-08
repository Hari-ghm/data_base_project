import { useState } from "react";
import { CourseCsvUploader } from "../components/CourseCsvUploader"; // Import the component
import { FacultyCsvUploader } from "../components/FacultyCsvUploader";
import { DataEntryModal } from "../components/DataEntryModel";
import { DeleteEntryModal } from "../components/DeleteModelEntry";

export default function UploadPage() {
  const [modalType, setModalType] = useState<"course" | "faculty" | null>(null);
  
  const [deleteModalType, setDeleteModalType] = useState<
    "course" | "faculty" | null
  >(null);
  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Course Data</h2>
        <p className="mb-1">
          Upload a CSV file containing course information. Make sure the csv
          file have field corresponding to format given below (case sensitive)
        </p>
        <p className="mb-2">
          <span className="font-bold">Format:</span> id | year | stream |
          courseType | courseCode | courseTitle | lectureHours | tutorialHours |
          practicalHours | credits | prerequisites | school | forenoonSlots |
          afternoonSlots | totalSlots | basket
        </p>
        <p className="font-bold">id is SERIAL no (1,2,3,4.....)</p>
        <CourseCsvUploader />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Upload Faculty Data</h2>
        <p className="mb-1">
          Upload a CSV file containing course information. Make sure the csv
          file have field corresponding to format given below (case sensitive)
        </p>
        <p className="mb-2">
          <span className="font-bold">Format:</span> s_no | name | empid |
          photo_url | email | school
        </p>
        <p className="font-bold">s_no is SERIAL no (1,2,3,4.....)</p>
        <FacultyCsvUploader />
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Enter single data into table (course table / faculty table)
        </h2>
        <h2 className="mb-1 text-xl font-semibold">
          click the options below to select the table
        </h2>
        <div className="flex-col gap-4 w-fit pl-16 pt-3">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition mr-6"
            onClick={() => setModalType("faculty")}
          >
            Faculty Data
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
            onClick={() => setModalType("course")}
          >
            Course Data
          </button>
        </div>
        {modalType && (
          <DataEntryModal type={modalType} onClose={() => setModalType(null)} />
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          Delete Data(s) from table (course table / faculty table)
        </h2>
        <h2 className="mb-1 text-xl font-semibold">
          click the options below to select the table
        </h2>
        <div className="flex-col gap-4 w-fit pl-16 pt-3">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition mr-6"
            onClick={() => setDeleteModalType("faculty")}
          >
            Faculty Data
          </button>
          <button
            className="px-6 py-2 bg-green-600 text-white rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
            onClick={() => setDeleteModalType("course")}
          >
            Course Data
          </button>
        </div>
        {deleteModalType && (
          <DeleteEntryModal
            type={deleteModalType}
            onClose={() => setDeleteModalType(null)}
          />
        )}
      </div>
    </>
  );
}
