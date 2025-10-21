// File: src/components/diseases/malnutrition/Review.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "@/services/http";
import {
  Container,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
  Table as RBTable,
  Badge,
  Button,
} from "react-bootstrap";

export default function Review() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    api
      .get("/diagnoses/recent", { params: { limit: 200 } })
      .then(({ data }) => {
        if (!active) return;
        setItems(Array.isArray(data?.items) ? data.items : []);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err?.response?.data?.detail || err.message || "Failed to load"
        );
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const current = useMemo(() => {
    const nid = Number(id);
    if (!Number.isFinite(nid)) return null;
    return items.find((x) => x.id === nid) || null;
  }, [items, id]);

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <Row className="align-items-center">
          <Col>
            <h3 className="mb-0">🍞 Malnutrition · Review</h3>
            <div className="text-muted">Diagnosis ID: {id}</div>
          </Col>
          <Col className="text-end">
            <Link to={`/diseases/malnutrition/treat/${id}`}>
              <Button className="rounded-pill">Go to Treatment</Button>
            </Link>
          </Col>
        </Row>

        {loading && (
          <div className="mt-4">
            <Spinner animation="border" size="sm" className="me-2" />
            Loading…
          </div>
        )}

        {error && (
          <Alert variant="danger" className="mt-4">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            {current ? (
              <>
                <Card className="mt-4 border-0 shadow-sm">
                  <Card.Body>
                    <Row className="g-3">
                      <Col md={4}>
                        <div className="text-muted small">Patient</div>
                        <div className="fw-semibold">
                          {current.patient?.name || "—"}
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="text-muted small">Disease</div>
                        <div className="fw-semibold text-capitalize">
                          {current.disease_key || "malnutrition"}
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="text-muted small">Label</div>
                        <Badge bg="info">{current.label || "queued"}</Badge>
                      </Col>
                      <Col md={2}>
                        <div className="text-muted small">Confidence</div>
                        <div className="fw-semibold">
                          {current.confidence ?? "—"}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Card className="mt-4 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Raw Record</h5>
                    <pre className="bg-light p-3 rounded-3 mb-0">
                      {JSON.stringify(current, null, 2)}
                    </pre>
                  </Card.Body>
                </Card>
              </>
            ) : (
              <>
                <Alert variant="warning" className="mt-4">
                  Couldn’t find diagnosis <Badge bg="secondary">{id}</Badge> in
                  the recent list.
                </Alert>

                <Card className="mt-3 border-0 shadow-sm">
                  <Card.Body>
                    <h5 className="mb-3">Recent Malnutrition Diagnoses</h5>
                    <RBTable hover responsive className="mb-0">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Patient</th>
                          <th>Label</th>
                          <th>Confidence</th>
                          <th>Created</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {items
                          .filter((x) => x.disease_key === "malnutrition")
                          .map((x) => (
                            <tr key={x.id}>
                              <td>{x.id}</td>
                              <td>{x.patient?.name || "—"}</td>
                              <td>
                                <Badge bg="info">{x.label || "—"}</Badge>
                              </td>
                              <td>{x.confidence ?? "—"}</td>
                              <td>{x.created_at || "—"}</td>
                              <td>
                                <Link
                                  to={`/diseases/malnutrition/review/${x.id}`}
                                >
                                  <Button size="sm" variant="outline-primary">
                                    View
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </RBTable>
                  </Card.Body>
                </Card>
              </>
            )}
          </>
        )}
      </Card>
    </Container>
  );
}
