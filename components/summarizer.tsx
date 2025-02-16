"use client";

import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface MedicalSummaryProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  documentUrl?: string;
  category?: string;
}

export function Summarizer({
  title = "Medical Report Summary",
  description = "Comprehensive AI-powered medical report analysis",
  imageUrl = "/medical-placeholder.svg",
  documentUrl = "#",
  category = "Healthcare",
}: MedicalSummaryProps) {
  const [doctorInput, setDoctorInput] = useState("");
  const [summary, setSummary] = useState("");
  const [knowledgePanel, setKnowledgePanel] = useState<string[]>([]);
  const [contextAssessment, setContextAssessment] = useState<string[]>([]);
  const [relationExtraction, setRelationExtraction] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Function to safely format extracted data
  const formatText = (data: any) => {
    if (!data) return ["Not available"];
    if (typeof data === "string") return [data];
    if (Array.isArray(data)) return data.length ? data : ["Not available"];
    if (typeof data === "object") {
      return Object.entries(data).map(([key, value]) => `${key}: ${value}`);
    }
    return ["Not available"];
  };

  // Function to Call Gemini AI
  const handleAnalyze = async () => {
    if (!doctorInput) {
      alert("Please enter medical notes.");
      return;
    }

    setLoading(true);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY as string);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const response = await model.generateContent(`Analyze the following medical notes and provide a structured JSON response:

      {
        "summary": "[Concise medical overview]",
        "diagnoses_symptoms": ["Symptom 1", "Symptom 2", "Potential Diagnosis"],
        "context_analysis": ["Clinical significance", "Recommendations"],
        "symptom_treatment_relations": ["Symptom-Treatment connection"]
      }

      Medical Notes:
      ${doctorInput}
      `);

      const result = response.response.text();
      console.log("AI Raw Response:", result);

      // Extract JSON object from AI response
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI");
      }

      const jsonData = JSON.parse(jsonMatch[0]);

      // Populate fields with structured data
      setSummary(jsonData.summary);
      setKnowledgePanel(formatText(jsonData.diagnoses_symptoms));
      setContextAssessment(formatText(jsonData.context_analysis));
      setRelationExtraction(formatText(jsonData.symptom_treatment_relations));
    } catch (error) {
      console.error("Error fetching medical summary:", error);
      setSummary("Failed to generate medical insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
        AI-Powered Medical Summarizer
      </h1>

      {/* Input Text Area */}
      <div className="mb-6">
        <label htmlFor="doctorInput" className="block text-gray-700 text-sm font-medium mb-2">
          Patient's Medical Notes
        </label>
        <textarea
          id="doctorInput"
          value={doctorInput}
          onChange={(e) => setDoctorInput(e.target.value)}
          placeholder="Enter patient history, symptoms, diagnosis, or treatment notes here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        {loading ? "Analyzing Medical Data..." : "Analyze with AI"}
      </button>

      {/* Output Section */}
      {summary && (
        <div className="mt-6">
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-gray-900">Medical Summary</h3>
            <p className="text-gray-700 mt-2">{summary}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white shadow-md border border-gray-300 rounded-lg max-h-48 overflow-auto">
              <h3 className="text-md font-bold text-gray-900">📌 Diagnoses & Symptoms</h3>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {knowledgePanel.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
            <div className="p-4 bg-white shadow-md border border-gray-300 rounded-lg max-h-48 overflow-auto">
              <h3 className="text-md font-bold text-gray-900">🧐 Context Analysis</h3>
              <ul className="list-disc list-inside text-gray-700 mt-2">
                {contextAssessment.map((item, index) => <li key={index}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Summarizer;