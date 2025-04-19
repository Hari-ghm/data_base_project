import { CsvUploader } from "../components/CsvUploader"; // Import the component

export default function UploadPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Upload Course Data</h2>
      <p className="mb-4">
        Upload a CSV file containing course information (e.g., course_code,
        course_name, credits).
      </p>
      <CsvUploader />
    </div>
  );
}
