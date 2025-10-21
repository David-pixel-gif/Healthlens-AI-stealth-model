// =============================================
// File: src/components/diseases/brain_tumor/Diagnosis.js
// =============================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ProgressBar, Form } from "react-bootstrap";
import { BsArrowsFullscreen } from "react-icons/bs";
import api from "@/services/http"; // ✅ shared axios instance

const Diagnosis = () => {
  const [userRole, setUserRole] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Scanner state (visual simulation)
  const [scannerProgress, setScannerProgress] = useState(0);
  const [scannerStage, setScannerStage] = useState("");
  const [processingMode, setProcessingMode] = useState("deep");

  const navigate = useNavigate();

  // -----------------------------
  // 👩‍⚕️ Restrict Access
  // -----------------------------
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
  }, []);

  // -----------------------------
  // 📂 File Upload & Preview
  // -----------------------------
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setFilePreview(null);
    setDiagnosisResult(null);
    setScannerProgress(0);
    setScannerStage("");
    setIsProcessing(false);
  };

  // -----------------------------
  // 🌀 Visual Scanner Simulation
  // -----------------------------
  const simulateScanner = (totalTime) => {
    const stages = [
      "Uploading MRI image...",
      "Preprocessing and masking...",
      "Running through CNN layers...",
      "Extracting tumor features...",
      "Analyzing spatial patterns...",
      "Calculating metrics...",
      "Finalizing results...",
    ];

    let stageIndex = 0;
    setScannerStage(stages[stageIndex]);

    const interval = setInterval(() => {
      stageIndex++;
      setScannerProgress((p) => Math.min(p + 100 / stages.length, 100));
      if (stageIndex < stages.length) setScannerStage(stages[stageIndex]);
      else clearInterval(interval);
    }, totalTime / stages.length);
  };

  // -----------------------------
  // 🧠 Submit MRI to FastAPI Model
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please upload an MRI image first.");
      return;
    }

    const totalTime =
      processingMode === "fast"
        ? 5000
        : processingMode === "standard"
        ? 10000
        : 20000;

    setIsProcessing(true);
    simulateScanner(totalTime);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // ✅ Correct FastAPI endpoint
      const { data } = await api.post("/predict/brain-tumor", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ Delay to match simulated scan progress
      setTimeout(() => {
        setDiagnosisResult(data);
        setIsProcessing(false);
        setScannerProgress(100);
        setScannerStage("Scan complete ✅");
      }, totalTime);
    } catch (error) {
      console.error("❌ Brain tumor scan error:", error);
      alert(error?.response?.data?.detail || "Failed to process MRI image.");
      setIsProcessing(false);
    }
  };

  // -----------------------------
  // 🚫 Restrict non-doctor access
  // -----------------------------
  if (userRole && userRole !== "Doctor") {
    return (
      <div className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100">
        <h2 className="text-danger fw-bold mb-3">Access Denied</h2>
        <p className="text-danger">
          Only verified doctors can perform AI-assisted diagnoses.
        </p>
      </div>
    );
  }

  // -----------------------------
  // 🎨 Helper to normalize & color-code probability
  // -----------------------------
  const renderProbability = (label, prob) => {
    const numeric =
      typeof prob === "number"
        ? prob
        : parseFloat(
            typeof prob === "object" && prob !== null ? prob.value ?? NaN : prob
          );
    if (isNaN(numeric)) return `${label}: ${JSON.stringify(prob)}`;

    const color =
      numeric >= 0.8
        ? "text-success fw-bold"
        : numeric >= 0.5
        ? "text-warning"
        : "text-danger";
    return (
      <li key={label} className={color}>
        {label}: {numeric.toFixed(3)}
      </li>
    );
  };

  // -----------------------------
  // 🧱 Render UI
  // -----------------------------
  return (
    <div className="container-fluid p-4">
      <div className="row g-4">
        <h2 className="text-center fw-bold mb-4">🧠 Brain Tumor Detection</h2>

        {/* Upload Section */}
        <div className="col-md-4">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body">
              <h5 className="card-title d-flex justify-content-between">
                Upload MRI Image
                {filePreview && (
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    title="Expand Preview"
                  >
                    <BsArrowsFullscreen />
                  </button>
                )}
              </h5>

              <input
                type="file"
                accept="image/png, image/jpeg"
                className="form-control mb-3"
                onChange={handleFileUpload}
              />

              <Form.Select
                className="mb-3"
                value={processingMode}
                onChange={(e) => setProcessingMode(e.target.value)}
              >
                <option value="fast">⚡ Fast Scan (~5s)</option>
                <option value="standard">⚙️ Standard (~10s)</option>
                <option value="deep">🧠 Deep Thinking (~20s)</option>
              </Form.Select>

              {filePreview && (
                <div className="position-relative">
                  <img
                    src={filePreview}
                    alt="MRI Preview"
                    className="img-fluid rounded shadow"
                  />
                  {isProcessing && (
                    <div className="scanner-overlay position-absolute top-0 start-0 w-100 h-100">
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "4px",
                          background: "limegreen",
                          boxShadow: "0 0 10px limegreen",
                          animation: "scanLine 4s linear infinite",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {isProcessing && (
                <div className="mt-3">
                  <ProgressBar now={scannerProgress} animated />
                  <p className="text-muted small mt-2">{scannerStage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="col-md-8">
          <div className="card shadow-lg border-0 h-100">
            <div className="card-body">
              <h5 className="card-title">Diagnosis Results</h5>

              {diagnosisResult ? (
                <>
                  <p>
                    <strong>Diagnosis:</strong> {diagnosisResult.diagnosis}
                  </p>
                  <p>
                    <strong>Confidence:</strong> {diagnosisResult.confidence}
                  </p>

                  {diagnosisResult.class_probabilities && (
                    <>
                      <p className="mt-3 mb-1">
                        <strong>Class Probabilities:</strong>
                      </p>
                      <ul className="ps-3">
                        {Object.entries(
                          diagnosisResult.class_probabilities
                        ).map(([label, prob]) =>
                          renderProbability(label, prob)
                        )}
                      </ul>
                    </>
                  )}

                  {diagnosisResult.saved_image && (
                    <img
                      src={`http://127.0.0.1:8000${diagnosisResult.saved_image}`}
                      alt="Processed MRI"
                      className="img-fluid rounded shadow mt-3"
                    />
                  )}
                </>
              ) : (
                <p className="text-muted">No diagnosis yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-center gap-3 my-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? "Scanning..." : "Run AI Scan"}
        </button>

        {diagnosisResult && (
          <button className="btn btn-warning btn-lg" onClick={resetUpload}>
            Reset / New Scan
          </button>
        )}
      </div>

      {/* Scanner Animation */}
      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 95%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Diagnosis;
