// =============================================
// File: frontend/src/components/diseases/tb/Treat.jsx
// =============================================
import React from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";

export default function Treat() {
  const { id } = useParams();

  return (
    <Container className="my-4">
      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-3">🧫 Tuberculosis · Treatment</h3>
        <p className="text-muted mb-4">
          Diagnosis ID: <strong>{id}</strong>
        </p>

        <p>
          Standard TB care involves{" "}
          <strong>6 months of antibiotic therapy</strong>, often with{" "}
          <em>isoniazid, rifampin, pyrazinamide, and ethambutol</em>. Please
          consult WHO or CDC guidelines before prescribing.
        </p>

        <div className="d-flex gap-2 mt-4">
          <Button
            as={Link}
            to={`/diseases/tb/review/${id}`}
            variant="outline-secondary"
            className="rounded-pill"
          >
            Back to Review
          </Button>
          <Button as={Link} to="/diseases/tb/detect" className="rounded-pill">
            New Detection
          </Button>
        </div>
      </Card>
    </Container>
  );
}
