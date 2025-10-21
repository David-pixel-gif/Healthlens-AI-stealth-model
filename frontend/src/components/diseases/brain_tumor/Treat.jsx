import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, ListGroup, Alert, Button } from "react-bootstrap";

export default function Treat() {
  const { id } = useParams();

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-3">🧠 Brain Tumor · Treat</h3>
        <Alert variant="info" className="mb-3">
          Diagnosis ID: <strong>{id}</strong>
        </Alert>

        {/* Placeholder content — adapt to your clinical workflow */}
        <ListGroup className="mb-3">
          <ListGroup.Item className="border-0">
            • Confirm imaging modality and quality (MRI preferred: T1/T2/FLAIR ± contrast).
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            • Refer to neuro-oncology/neurosurgery if high suspicion; discuss biopsy vs. resection.
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            • Manage symptoms (steroids for edema, seizure prophylaxis as indicated).
          </ListGroup.Item>
          <ListGroup.Item className="border-0">
            • Plan follow-up imaging and document clinical findings.
          </ListGroup.Item>
        </ListGroup>

        <div className="d-flex gap-2">
          <Button
            as={Link}
            to={`/diseases/brain_tumor/review/${id}`}
            variant="outline-secondary"
            className="rounded-pill"
          >
            Back to Review
          </Button>
          <Button as={Link} to="/diseases/brain_tumor/detect" className="rounded-pill">
            New Detection
          </Button>
        </div>
      </Card>
    </Container>
  );
}
