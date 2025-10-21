// =============================================
// File: frontend/src/components/diseases/malaria/Detect.jsx
// =============================================
import React, { useEffect, useRef, useState } from "react";
import api from "@/services/http";

import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Button,
  ProgressBar,
  Alert,
  Spinner,
  Image,
} from "react-bootstrap";
import { FaUpload, FaMicroscope, FaRedo, FaBug } from "react-icons/fa";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const objectUrlRef = useRef("");

  function onFileChange(f) {
    const file = f instanceof File ? f : f?.target?.files?.[0];
    if (!file) return;

    setFile(file);

    // cleanup old preview
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreview(url);
    setResult(null);
    setError("");
    setProgress(0);
  }

  function onDrop(e) {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0]);
    }
  }

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  async function runDetection(e) {
    e?.preventDefault?.();
    if (!file) return setError("Please select a blood smear image first.");

    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const { data } = await api.post("/diseases/malaria/infer", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt?.total) return;
          setProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });

      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  }

  function resetAll() {
    setFile(null);
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    objectUrlRef.current = "";
    setPreview("");
    setResult(null);
    setError("");
    setProgress(0);
  }

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-2">
          <FaBug className="me-2 text-danger" />
          Malaria Detection
        </h3>
        <p className="text-muted mb-4">
          Upload or drag & drop a <b>blood smear image</b> (JPG/PNG) to test for
          malaria.
        </p>

        <Form onSubmit={runDetection}>
          <Row className="g-3 align-items-start">
            <Col md={6}>
              {/* Drag & Drop Zone */}
              <div
                onDrop={onDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border rounded-3 p-4 text-center bg-light hover-border"
              >
                <FaUpload size={28} className="mb-2 text-secondary" />
                <p className="small mb-1">Drag & drop blood smear here</p>
                <p className="small text-muted">or</p>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  disabled={loading}
                />
                <Form.Text muted>PNG/JPG preferred. Max ~10MB.</Form.Text>
              </div>

              {/* Buttons */}
              <div className="d-flex gap-2 mt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-pill btn-danger"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Analyzing…
                    </>
                  ) : (
                    <>
                      <FaMicroscope className="me-2" />
                      Run Detection
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  className="rounded-pill"
                  onClick={resetAll}
                  disabled={loading || !file}
                >
                  <FaRedo className="me-2" />
                  Reset
                </Button>
              </div>

              {/* Progress/Error */}
              {progress > 0 && progress < 100 && (
                <ProgressBar
                  now={progress}
                  label={`${progress}%`}
                  className="mt-3"
                  variant="danger"
                />
              )}
              {error && (
                <Alert variant="danger" className="mt-3 mb-0">
                  {error}
                </Alert>
              )}
            </Col>

            <Col md={6}>
              <div className="text-center">
                {preview ? (
                  <Image
                    src={preview}
                    alt="preview"
                    thumbnail
                    className="rounded shadow-sm preview-img"
                  />
                ) : (
                  <div className="p-4 border rounded-3 text-muted bg-light">
                    <FaUpload className="mb-2" />
                    <div>No image selected.</div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Form>

        {/* Results */}
        {result && (
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Analysis Result</h5>
              {result?.prediction ? (
                <Alert
                  variant={
                    result.prediction.includes("Malaria") ? "danger" : "success"
                  }
                  className="fw-bold"
                >
                  {result.prediction}
                </Alert>
              ) : null}
              <pre className="bg-light p-3 rounded-3 small mb-0">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card.Body>
          </Card>
        )}
      </Card>

      {/* Scoped styles */}
      <style>{`
        .hover-border:hover {
          border: 2px dashed #dc3545;
          background-color: #fdf2f2;
        }
        .preview-img {
          max-height: 280px;
          object-fit: contain;
          transition: transform 0.2s ease;
        }
        .preview-img:hover {
          transform: scale(1.03);
        }
      `}</style>
    </Container>
  );
}
