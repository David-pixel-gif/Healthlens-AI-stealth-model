// =============================================
// File: frontend/src/components/diseases/tb/Detect.jsx
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
import { FaUpload, FaMicroscope, FaRedo, FaLungs } from "react-icons/fa";

export default function Detect() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const objectUrlRef = useRef("");

  function onFileChange(e) {
    const f = e?.target?.files?.[0] || null;
    setFile(f);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = "";
    }
    const url = f ? URL.createObjectURL(f) : "";
    objectUrlRef.current = url;
    setPreview(url);
    setResult(null);
    setError("");
    setProgress(0);
  }

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  async function runDetection(e) {
    e?.preventDefault?.();
    if (!file) return setError("Please select a chest X-ray image first.");
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/diseases/tb/infer", fd, {
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
          <FaLungs className="me-2 text-danger" />
          Tuberculosis · Detect
        </h3>
        <p className="text-muted mb-4">
          Upload a chest X-ray (JPG/PNG). Drag & drop is also supported.
        </p>
        <Form onSubmit={runDetection}>
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <Form.Group controlId="tbUpload">
                <Form.Label>Upload X-ray</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  disabled={loading}
                />
                <Form.Text muted>PNG/JPG preferred. Max ~10MB.</Form.Text>
              </Form.Group>
              <div className="d-flex gap-2 mt-3">
                <Button
                  type="submit"
                  disabled={loading}
                  className="rounded-pill btn-danger"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" animation="border" className="me-2" />
                      Running…
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
                    className="rounded shadow-sm"
                    style={{ maxHeight: 320, objectFit: "contain" }}
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
        {result && (
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Result</h5>
              <pre className="bg-light p-3 rounded-3 mb-0 small">
                {JSON.stringify(result, null, 2)}
              </pre>
            </Card.Body>
          </Card>
        )}
      </Card>
    </Container>
  );
}
