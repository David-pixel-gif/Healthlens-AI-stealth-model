// =======================================================
// File: src/components/diseases/skin_cancer/Detect.jsx
// =======================================================

import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// ✅ Shared Axios instance (with baseURL: http://127.0.0.1:8000/api)
import api from "../../../services/http"; // safer import (use @ only if Vite alias is configured)

export default function Detect() {
  // ----------------------------------
  // 🧾 Local State
  // ----------------------------------
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    doctorOpinion: "",
    image: null,
    imagePreview: null,
  });

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const reportRef = useRef();

  // ----------------------------------
  // 📋 Form Handlers
  // ----------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
      setResult(null);
    }
  };

  // ----------------------------------
  // 🧠 Run AI Prediction (FastAPI)
  // ----------------------------------
  const runPrediction = async () => {
    if (!formData.image) {
      alert("Please upload an image before scanning.");
      return;
    }

    setIsLoading(true);
    const fd = new FormData();
    fd.append("file", formData.image);

    try {
      // ✅ Correct backend route (no ?disease= query)
      const { data } = await api.post("/predict/skin-cancer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Normalize backend result
      const formatted = {
        diagnosis: data.diagnosis || data.result || "Unknown",
        cancerType: data.cancerType || data.type || "Not Specified",
        stage: data.stage || data.top3?.[0]?.class || "N/A",
        confidence:
          data.confidence ||
          (data.top3?.[0]?.confidence
            ? (data.top3[0].confidence * 100).toFixed(1) + "%"
            : "N/A"),
        aiNote: data.aiNote || "No additional AI notes provided.",
      };

      setResult(formatted);

      // ✅ Optional: log report to backend (safe wrapped)
      try {
        await api.post("/reports/log", {
          patient_id: formData.patientId,
          patient_name: formData.patientName,
          scan_result: formatted.diagnosis,
          confidence: formatted.confidence,
          doctor_comments: formData.doctorOpinion,
        });
      } catch (logErr) {
        console.warn("⚠️ Report logging skipped:", logErr.message);
      }
    } catch (err) {
      console.error("❌ Prediction Error:", err);
      alert(err?.response?.data?.detail || "Prediction failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------
  // 🧾 Form Submit
  // ----------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName || !formData.patientId || !formData.image) {
      alert("Please fill out all required fields and upload an image.");
      return;
    }
    runPrediction();
  };

  // ----------------------------------
  // 📄 Export Report as PDF
  // ----------------------------------
  const exportPDF = () => {
    const input = reportRef.current;
    if (!input) return;

    html2canvas(input, { scale: 2, backgroundColor: "#ffffff" }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`skin_cancer_report_${formData.patientId || "patient"}.pdf`);
      }
    );
  };

  // ----------------------------------
  // 🧱 Render
  // ----------------------------------
  return (
    <div className="container py-5">
      <h2 className="text-center text-primary mb-4 fw-bold">
        🧬 Skin Cancer Detection
      </h2>

      {/* Upload and Input Form */}
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm mb-4">
        <div className="row g-3">
          {/* Patient Details */}
          <div className="col-md-6">
            <label className="form-label">Patient Name</label>
            <input
              type="text"
              name="patientName"
              className="form-control"
              value={formData.patientName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Patient ID</label>
            <input
              type="text"
              name="patientId"
              className="form-control"
              value={formData.patientId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label className="form-label">Doctor’s Notes (Optional)</label>
            <textarea
              name="doctorOpinion"
              rows="2"
              className="form-control"
              value={formData.doctorOpinion}
              onChange={handleChange}
              placeholder="Any observations before AI scan..."
            />
          </div>

          <div className="col-12">
            <label className="form-label">Upload Dermoscopic Image</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={handleImageChange}
              required
            />

            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="img-thumbnail mt-3 shadow-sm"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            )}
          </div>

          <div className="d-grid mt-3">
            <button
              className="btn btn-success rounded-pill"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Scanning..." : "Scan Now"}
            </button>
          </div>
        </div>
      </form>

      {/* Result Card */}
      {result && (
        <div className="card shadow p-4" ref={reportRef}>
          <h4 className="text-center text-success mb-3">
            ✅ AI Scan Result Summary
          </h4>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Diagnosis:</strong> {result.diagnosis}
              </p>
              <p>
                <strong>Cancer Type:</strong> {result.cancerType}
              </p>
              <p>
                <strong>Stage:</strong> {result.stage}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Confidence:</strong> {result.confidence}
              </p>
              <p className="text-muted fst-italic">{result.aiNote}</p>
            </div>
          </div>

          <div className="mt-3">
            <h6>Doctor’s Comments:</h6>
            <p>{formData.doctorOpinion || "No comments provided."}</p>
          </div>

          <div className="d-grid mt-3">
            <button
              className="btn btn-outline-primary rounded-pill"
              onClick={exportPDF}
            >
              📄 Download Report as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
