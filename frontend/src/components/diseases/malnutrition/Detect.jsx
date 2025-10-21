// ==========================================================
// File: src/components/diseases/malnutrition/Detect.jsx
// ==========================================================

import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { FaPercentage, FaUsers } from "react-icons/fa";
import PredictionResult from "./PredictionResult.jsx";

// ==========================================================
// 🛰️ API IMPORT
// ----------------------------------------------------------
// ⚠️ Use only ONE import. The "@" alias only works if configured
// in vite.config.js. Otherwise, the relative path below works
// perfectly out-of-the-box.
// ==========================================================

// ✅ Preferred: clean alias import (if vite alias set up properly)
/// import api from "@/services/http";

// ✅ Guaranteed-safe relative import (works in all setups)
import api from "../../../services/http";

const Detect = () => {
  // ==========================================================
  // 🧠 STATE MANAGEMENT
  // ==========================================================
  const [formData, setFormData] = useState({
    Stunting: "",
    Wasting: "",
    Underweight: "",
    Overweight: "",
    U5_Pop_Thousands: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ==========================================================
  // ✍️ HANDLE INPUT CHANGES
  // ==========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================================
  // 🚀 HANDLE PREDICTION SUBMISSION
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setResult(null);
    setLoading(true);

    try {
      // ✅ Convert values to floats for backend model compatibility
      const payload = {
        Stunting: parseFloat(formData.Stunting) || 0,
        Wasting: parseFloat(formData.Wasting) || 0,
        Underweight: parseFloat(formData.Underweight) || 0,
        Overweight: parseFloat(formData.Overweight) || 0,
        U5_Pop_Thousands: parseFloat(formData.U5_Pop_Thousands) || 0,
      };

      // 🧩 Debug: confirm API baseURL
      console.log("📡 Using API baseURL:", api.defaults.baseURL);

      // ✅ Correct backend route (FastAPI: /api/predict/malnutrition)
      const { data } = await api.post("/predict/malnutrition", payload);

      // ✅ Store and render results
      setResult(data);
    } catch (error) {
      console.error("❌ Prediction failed:", error);
      const msg =
        error?.response?.data?.detail ||
        error?.message ||
        "An error occurred while predicting. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // 🧱 RENDER UI
  // ==========================================================
  return (
    <Container className="my-5">
      <Card className="p-4 shadow-lg border-0 rounded-4 bg-light">
        <h3 className="mb-4 text-center">🍽️ Malnutrition Risk Detection</h3>

        {/* =======================================
            📋 INPUT FORM
        ======================================= */}
        <Form onSubmit={handleSubmit}>
          {/* Row 1 */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>
                Stunting (%) <FaPercentage className="ms-1" />
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="Stunting"
                value={formData.Stunting}
                onChange={handleChange}
                placeholder="e.g., 25.4"
                required
              />
            </Col>

            <Col md={6}>
              <Form.Label>
                Wasting (%) <FaPercentage className="ms-1" />
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="Wasting"
                value={formData.Wasting}
                onChange={handleChange}
                placeholder="e.g., 12.3"
                required
              />
            </Col>
          </Row>

          {/* Row 2 */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>
                Underweight (%) <FaPercentage className="ms-1" />
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="Underweight"
                value={formData.Underweight}
                onChange={handleChange}
                placeholder="e.g., 18.6"
                required
              />
            </Col>

            <Col md={6}>
              <Form.Label>
                Overweight (%) <FaPercentage className="ms-1" />
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                max="100"
                name="Overweight"
                value={formData.Overweight}
                onChange={handleChange}
                placeholder="e.g., 5.4"
                required
              />
            </Col>
          </Row>

          {/* Row 3 */}
          <Form.Group className="mb-4">
            <Form.Label>
              Under-5 Population (in thousands) <FaUsers className="ms-1" />
            </Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              name="U5_Pop_Thousands"
              value={formData.U5_Pop_Thousands}
              onChange={handleChange}
              placeholder="e.g., 10.2"
              required
            />
          </Form.Group>

          {/* ⚠️ Error Message */}
          {errorMsg && (
            <Alert variant="danger" className="text-center">
              {errorMsg}
            </Alert>
          )}

          {/* 🔘 Submit Button */}
          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="rounded-pill"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Predicting...
                </>
              ) : (
                "Predict Risk"
              )}
            </Button>
          </div>
        </Form>
      </Card>

      {/* ✅ Display Prediction Results */}
      {result && (
        <div className="mt-4">
          <PredictionResult
            riskLevel={result.predicted_risk_level}
            description={result.description}
            input={result.input}
          />
        </div>
      )}
    </Container>
  );
};

export default Detect;
