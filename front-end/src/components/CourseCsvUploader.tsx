import React, { useState, useCallback } from "react";
import Papa from "papaparse";

interface CsvData {
  headers: string[];
  rows: Record<string, string>[];
}

export function CourseCsvUploader() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  // Add state for submission status
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setError("");
      setCsvData(null);
      setFileName("");
      setSubmitStatus(null); // Clear previous submission status on new file select

      const file = event.target.files?.[0];
      if (!file) {
        setError("No file selected.");
        return;
      }

      if (file.type !== "text/csv") {
        setError("Please select a CSV file.");
        // Reset the input value so the user can select the same file again if needed
        event.target.value = "";
        return;
      }

      setFileName(file.name);

      Papa.parse(file, {
        header: true, // Treat the first row as headers
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("Parsing errors:", results.errors);
            setError(`Error parsing CSV: ${results.errors[0].message}`);
            setCsvData(null);
          } else if (!results.meta.fields || results.meta.fields.length === 0) {
            setError("CSV file appears to be empty or header row is missing.");
            setCsvData(null);
          } else {
            // Ensure all rows are objects, filter out any non-objects if necessary
            const validRows = results.data.filter(
              (row) => typeof row === "object" && row !== null
            ) as Record<string, string>[];
            setCsvData({ headers: results.meta.fields, rows: validRows });
            setError(""); // Clear any previous error
          }
        },
        error: (err) => {
          console.error("PapaParse error:", err);
          setError(`Failed to parse file: ${err.message}`);
          setCsvData(null);
        },
      });

      // Reset the input value to allow uploading the same file again after an error or modification
      event.target.value = "";
    },
    []
  );

  // Function to handle submitting data to the backend
  const handleSubmit = useCallback(async () => {
    if (!csvData || csvData.rows.length === 0) {
      setError("No data available to submit.");
      return;
    }

    // --- IMPORTANT: Replace with your actual backend API endpoint ---
    // Use the full URL since frontend and backend are on different ports
    const apiUrl = "http://localhost:3001/api/process-csv";
    // ---

    setIsSubmitting(true);
    setSubmitStatus(null);
    setError(""); // Clear previous file errors

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Send only the rows, assuming the backend knows what to expect
        // Adjust the payload as needed based on your backend requirements
        body: JSON.stringify({ data: csvData.rows }),
      });

      const responseData = await response.json(); // Assuming backend sends JSON response

      if (!response.ok) {
        // Handle HTTP errors (e.g., 4xx, 5xx)
        throw new Error(
          responseData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Handle success
      setSubmitStatus({
        type: "success",
        message: responseData.message || "Data submitted successfully!",
      });
      // Optionally clear the data after successful submission
      // setCsvData(null);
      // setFileName('');
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unknown error occurred during submission.";
      setSubmitStatus({
        type: "error",
        message: `Submission failed: ${errorMessage}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [csvData]); // Dependency array includes csvData

  return (
    <div className="p-4 border rounded shadow-md max-w-4xl mx-auto mt-5">
      <h2 className="text-xl font-semibold mb-4">Upload CSV File</h2>

      <label className="block mb-4">
        <span className="sr-only">Choose CSV file</span>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isSubmitting} // Disable file input during submission
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed" // Style when disabled
        />
      </label>

      {fileName && (
        <p className="text-sm text-gray-600 mb-2">Selected file: {fileName}</p>
      )}
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Display submission status */}
      {submitStatus && (
        <p
          className={`text-sm mb-4 ${
            submitStatus.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {submitStatus.message}
        </p>
      )}

      {/* Conditionally render submit button and table */}
      {csvData && csvData.rows.length > 0 && (
        <>
          {/* Submit Button */}
          <div className="my-4">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !csvData || csvData.rows.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Data to Server"}
            </button>
          </div>

          {/* Data Preview Table */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Extracted Data Preview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border">
                <thead className="bg-gray-50">
                  <tr>
                    {csvData.headers.map((header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {csvData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {csvData.headers.map((header) => (
                        <td
                          key={`${rowIndex}-${header}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 border-l"
                        >
                          {row[header] ?? ""}{" "}
                          {/* Handle potential undefined values */}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {csvData && csvData.rows.length === 0 && !error && (
        <p className="text-yellow-600 text-sm mt-4">
          CSV file parsed, but it contains no data rows (only headers or empty).
        </p>
      )}
    </div>
  );
}
