"use client";
import { useState } from "react";
import axios from "axios";

export default function PDFUploader() {
  const [file, setFile] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a PDF file");

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setReport(res.data);
    } catch (error) {
      alert("Error analyzing document");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold">Upload Medical Report</h2>
      <input type="file" onChange={handleFileChange} accept="application/pdf" className="my-2" />
      <button onClick={handleUpload} className="p-2 bg-blue-500 text-white rounded">
        {loading ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {report && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-bold">Medical Summary</h3>
          <p>{report.summary}</p>

          <h4 className="font-bold mt-2">Diagnoses</h4>
          <ul className="list-disc pl-4">
            {report.diagnoses.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h4 className="font-bold mt-2">Recommendations</h4>
          <ul className="list-disc pl-4">
            {report.recommendations.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
