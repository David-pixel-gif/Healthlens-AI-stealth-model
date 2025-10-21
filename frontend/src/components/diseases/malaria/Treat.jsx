// File: src/components/diseases/malaria/Treat.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/http";
import {
  Container,
  Card,
  Row,
  Col,
  ListGroup,
  Alert,
  Button,
  Badge,
  Spinner,
  ProgressBar,
  Table as RBTable,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaCalendarPlus,
  FaCheckCircle,
  FaFileDownload,
} from "react-icons/fa";

function toPercent(value) {
  if (value == null || isNaN(value)) return null;
  const pct = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, pct));
}

function getSeverity(label, confidence) {
  const c = toPercent(confidence) ?? 0;
  const l = String(label || "").toLowerCase();
  if (["positive", "infected"].includes(l)) {
    if (c >= 85) return { level: "high", variant: "danger" };
    if (c >= 50) return { level: "moderate", variant: "warning" };
    return { level: "low", variant: "secondary" };
  }
  if (["suspected", "indeterminate"].includes(l)) {
    return { level: "moderate", variant: "warning" };
  }
  if (["negative", "clear"].includes(l)) {
    return { level: "low", variant: "success" };
  }
  return { level: "unknown", variant: "secondary" };
}

function buildPlan(d) {
  const label = d?.label || d?.prediction || d?.status || "unknown";
  const conf = d?.confidence;
  const { level } = getSeverity(label, conf);

  if (level === "high") {
    return {
      headline:
        "High priority — begin antimalarial therapy and evaluate severity.",
      steps: [
        "Confirm with microscopy/RDT if not already done.",
        "Assess for severe malaria (altered consciousness, severe anemia, respiratory distress).",
        "Start antimalarial treatment promptly; manage fever and hydration.",
        "Consider referral if severe features or unstable vitals.",
      ],
      meds: [
        {
          name: "Artemisinin-based combo therapy (ACT)",
          detail: "e.g., artemether–lumefantrine per weight (demo placeholder)",
        },
        {
          name: "Supportive care",
          detail: "Antipyretics, fluids as needed (demo placeholder)",
        },
      ],
      followup: "Reassess in 24–48 hours, sooner if deterioration.",
    };
  }
  if (level === "moderate") {
    return {
      headline: "Moderate likelihood — confirm and prepare to treat.",
      steps: [
        "Obtain confirmatory test (microscopy/RDT) if pending.",
        "Monitor vitals and symptoms; educate on warning signs.",
        "If confirmed, initiate appropriate ACT.",
      ],
      meds: [
        {
          name: "ACT (if confirmed)",
          detail: "Dose by weight per local guidelines (demo placeholder)",
        },
      ],
      followup: "Follow up in 48 hours or earlier if symptoms worsen.",
    };
  }
  if (level === "low") {
    return {
      headline: "Low likelihood — consider alternative diagnoses.",
      steps: [
        "If test negative but symptoms persist, repeat/confirm testing.",
        "Symptomatic management and safety-net advice.",
      ],
      meds: [],
      followup:
        "Return if fever persists >48–72 hours, or red-flag symptoms appear.",
    };
  }
  return {
    headline: "Insufficient data — collect more information.",
    steps: [
      "Confirm testing, review history/exam, and consider differential diagnoses.",
    ],
    meds: [],
    followup: "Set a short interval review.",
  };
}

export default function Treat() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      setDiagnosis(null);
      try {
        const r = await api.get(`/diagnoses/${id}`);
        if (!mounted) return;
        setDiagnosis(r.data?.item || r.data?.diagnosis || r.data);
      } catch (e) {
        try {
          const recent = await api.get("/diagnoses/recent?limit=200");
          if (!mounted) return;
          const rows = recent?.data?.items || [];
          const found = rows.find((x) => String(x.id) === String(id));
          if (found) setDiagnosis(found);
          else
            setError(
              "Diagnosis not found. The /api/diagnoses/{id} endpoint may be missing."
            );
        } catch (e2) {
          setError(
            e2?.response?.data?.detail ||
              e2.message ||
              "Failed to load diagnosis."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id]);

  const label =
    diagnosis?.label || diagnosis?.prediction || diagnosis?.status || null;
  const confidencePct = toPercent(diagnosis?.confidence);
  const { level, variant } = getSeverity(label, diagnosis?.confidence);
  const modelVersion = diagnosis?.model_version || diagnosis?.model || "—";
  const createdAt = diagnosis?.created_at || diagnosis?.created || "—";
  const plan = useMemo(() => buildPlan(diagnosis), [diagnosis]);

  function onMarkTreated() {
    alert("Marked as treated (demo). Implement API to persist this.");
  }

  function onScheduleFollowUp() {
    alert(
      "Schedule follow-up (demo). Hook to calendar/notifications when ready."
    );
  }

  function onDownloadPlan() {
    window.print();
  }

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center gap-2">
          <Link
            to={`/diseases/malaria/review/${id}`}
            className="btn btn-outline-secondary btn-sm rounded-pill"
          >
            <FaArrowLeft className="me-2" />
            Back to Review
          </Link>
          <h3 className="mb-0">
            🦟 Malaria <span className="text-muted">· Treat</span>
          </h3>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="success"
            className="rounded-pill"
            onClick={onMarkTreated}
          >
            <FaCheckCircle className="me-2" />
            Mark as Treated
          </Button>
          <Button
            variant="outline-primary"
            className="rounded-pill"
            onClick={onScheduleFollowUp}
          >
            <FaCalendarPlus className="me-2" />
            Schedule Follow-up
          </Button>
          <Button
            variant="outline-secondary"
            className="rounded-pill"
            onClick={onDownloadPlan}
          >
            <FaFileDownload className="me-2" />
            Download Care Plan
          </Button>
        </div>
      </div>

      <Card className="p-4 shadow-sm border-0 rounded-4">
        {loading && (
          <div className="text-center my-4">
            <Spinner animation="border" role="status" />
            <div className="mt-2 text-muted">Loading diagnosis #{id}…</div>
          </div>
        )}

        {!loading && error && (
          <Alert variant="danger" className="mb-0">
            {error}
          </Alert>
        )}

        {!loading && !error && diagnosis && (
          <>
            {/* Summary */}
            <Row className="g-4">
              <Col md={6}>
                <Card className="border-0 bg-light rounded-3">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-muted small">Diagnosis Summary</div>
                      <Badge bg="secondary">
                        ID #{String(diagnosis?.id ?? id)}
                      </Badge>
                    </div>
                    <RBTable borderless size="sm" className="mt-2 mb-0">
                      <tbody>
                        <tr>
                          <th style={{ width: 160 }}>Label</th>
                          <td className="text-capitalize">{label || "—"}</td>
                        </tr>
                        <tr>
                          <th>Confidence</th>
                          <td>
                            {confidencePct != null ? (
                              <>
                                {confidencePct.toFixed(1)}%
                                <ProgressBar
                                  now={confidencePct}
                                  className="mt-1"
                                />
                              </>
                            ) : (
                              "—"
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>Severity (derived)</th>
                          <td>
                            <Badge bg={variant} className="text-uppercase">
                              {level}
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <th>Model</th>
                          <td>
                            <code>{modelVersion}</code>
                          </td>
                        </tr>
                        <tr>
                          <th>Created</th>
                          <td>{createdAt}</td>
                        </tr>
                      </tbody>
                    </RBTable>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="border-0 rounded-3">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="text-muted small">Pipeline Status</div>
                    </div>
                    <div className="mt-2">
                      <Badge bg={variant} className="px-3 py-2 text-uppercase">
                        {label || "unknown"}
                      </Badge>
                    </div>
                    <Alert variant="info" className="mt-3 mb-0">
                      This page uses demo treatment logic. Connect to your
                      clinical protocols service to replace placeholders with
                      real guidance.
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Plan */}
            <Row className="g-4 mt-1">
              <Col md={7}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Recommended Next Steps</h5>
                    <p className="text-muted mb-2">{plan.headline}</p>
                    <ListGroup variant="flush">
                      {plan.steps.map((s, i) => (
                        <ListGroup.Item key={i} className="px-0">
                          • {s}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={5}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Medications (Demo)</h5>
                    {plan.meds.length === 0 ? (
                      <div className="text-muted">
                        None recommended at this time.
                      </div>
                    ) : (
                      <ListGroup variant="flush">
                        {plan.meds.map((m, i) => (
                          <ListGroup.Item key={i} className="px-0">
                            <strong>{m.name}</strong>
                            <div className="small text-muted">{m.detail}</div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Follow-up */}
            <Row className="g-4 mt-1">
              <Col md={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-2">Follow-up</h5>
                    <div className="text-muted">{plan.followup}</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Safety disclaimer */}
            <Alert variant="warning" className="mt-4 mb-0">
              <strong>Disclaimer:</strong> This is a demo interface with
              placeholder guidance and is <em>not</em> medical advice. Always
              follow local clinical protocols and consult qualified clinicians.
            </Alert>
          </>
        )}
      </Card>
    </Container>
  );
}
