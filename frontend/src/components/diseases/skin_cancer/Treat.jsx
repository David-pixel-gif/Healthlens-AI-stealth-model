import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, ListGroup, Alert, Button } from "react-bootstrap";

export default function Treat() {
  const { id } = useParams();

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-3">🧴 Skin Cancer · Treat</h3>
        <Alert variant="info" className="mb-3">
          Diagnosis ID: <strong>{id}</strong>
        </Alert>

        {/* Placeholder content — adapt to your clinical workflow */}
        <ListGroup className="mb-3">
          <ListGroup.Item className="border-0">
            • Schedule dermoscopy and clinician review.
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            • If suspicious: biopsy referral; document lesion size/location.
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            • Provide sun protection counseling and follow-up timeline.
          </ListGroup.Item>
        </ListGroup>

        <div className="d-flex gap-2">
          <Button
            as={Link}
            to={`/diseases/skin_cancer/review/${id}`}
            variant="outline-secondary"
            className="rounded-pill"
          >
            Back to Review
          </Button>
          <Button
            as={Link}
            to="/diseases/skin_cancer/detect"
            className="rounded-pill"
          >
            New Detection
          </Button>
        </div>
      </Card>
    </Container>
  );
}
