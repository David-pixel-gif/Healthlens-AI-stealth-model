// =============================================
// File: frontend/src/components/diseases/malnutrition/Treat.jsx
// =============================================
import React from "react";
import { Container, Card, ListGroup, Alert } from "react-bootstrap";

export default function Treat() {
  return (
    <Container className="my-4">
      <Alert variant="warning" className="mb-4 rounded-4">
        ⚠️ These treatment recommendations are for **educational/demo purposes
        only**. Always confirm with WHO / UNICEF guidelines and consult a
        clinician.
      </Alert>

      <Card className="p-4 shadow-sm border-0 rounded-4">
        <h3 className="mb-4">🍎 Malnutrition · Treatment</h3>

        {/* Immediate Actions */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Immediate Actions</h5>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Stabilize patient (treat hypoglycemia, hypothermia,
                dehydration).
              </ListGroup.Item>
              <ListGroup.Item>
                Treat infections empirically with broad-spectrum antibiotics.
              </ListGroup.Item>
              <ListGroup.Item>
                Correct electrolyte imbalance (K⁺, Mg²⁺).
              </ListGroup.Item>
              <ListGroup.Item>
                Start cautious feeding (F-75 therapeutic formula).
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Nutrition Support */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Nutrition Support</h5>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Transition to F-100 formula as tolerated.
              </ListGroup.Item>
              <ListGroup.Item>
                Provide vitamins and micronutrients (no iron until stabilized).
              </ListGroup.Item>
              <ListGroup.Item>
                Encourage breastfeeding if appropriate.
              </ListGroup.Item>
              <ListGroup.Item>
                Gradual increase of caloric intake and monitoring of weight
                gain.
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Follow-up Care */}
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Follow-Up Care</h5>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Weekly monitoring of weight and clinical status.
              </ListGroup.Item>
              <ListGroup.Item>
                Transition to community-based management if stable.
              </ListGroup.Item>
              <ListGroup.Item>
                Provide caregiver education on nutrition and hygiene.
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        {/* Care Plan Notes */}
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Care Plan Notes</h5>
            <ListGroup variant="flush">
              <ListGroup.Item>
                Feeding plan agreed with caregiver.
              </ListGroup.Item>
              <ListGroup.Item>
                Supplementation schedule documented.
              </ListGroup.Item>
              <ListGroup.Item>Next follow-up date scheduled.</ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Card>
    </Container>
  );
}
