// File: src/components/DashboardOverview.jsx
import { Link } from "react-router-dom";
import { Card, Table, Badge } from "react-bootstrap";

const diseases = [
  { key: "brain_tumor", name: "Brain Tumor" },
  { key: "malnutrition", name: "Malnutrition" },
  { key: "skin_cancer", name: "Skin Cancer" },
];

export default function DashboardOverview() {
  const recentDiagnoses = [];
  const alerts = [];

  const kpis = [
    { label: "Today's Diagnoses", value: 0 },
    { label: "Active Jobs", value: 0 },
    { label: "Alerts", value: 0 },
  ];

  return (
    <div className="my-4 space-y-5">
      {/* KPIs */}
      <div
        className="d-grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
      >
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-sm border-0 text-center">
            <Card.Body>
              <div className="fs-4 fw-bold">{k.value}</div>
              <div className="text-muted small">{k.label}</div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Disease cards */}
      <div className="mt-4">
        <h5 className="mb-3">Disease Modules</h5>
        <div
          className="d-grid gap-3"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {diseases.map((d) => (
            <Link
              key={d.key}
              to={`/app/diseases/${d.key}/detect`}
              className="text-decoration-none text-dark"
            >
              <Card className="h-100 shadow-sm border-0 hover-shadow transition">
                <Card.Body>
                  <div className="fw-medium">{d.name}</div>
                  <div className="text-muted small">Open detection module</div>
                </Card.Body>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent diagnoses */}
      <div className="mt-4">
        <h5 className="mb-3">Recent Diagnoses</h5>
        {recentDiagnoses.length === 0 ? (
          <div className="text-muted small">No recent diagnoses</div>
        ) : (
          <Table hover responsive>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Disease</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recentDiagnoses.map((r) => (
                <tr key={r.id}>
                  <td>{r.patient_name || "—"}</td>
                  <td>{r.disease_name || "—"}</td>
                  <td>
                    <Badge bg="secondary">{r.status || "unknown"}</Badge>
                  </td>
                  <td>
                    <Link to={`/app/diseases/${r.disease_key}/review/${r.id}`}>
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Alerts */}
      <div className="mt-4">
        <h5 className="mb-3">Alerts</h5>
        {alerts.length === 0 && (
          <div className="text-muted small">No alerts</div>
        )}
        <div className="d-flex flex-column gap-2">
          {alerts.map((a) => (
            <Card
              key={a.id}
              className="shadow-sm border-0 p-3 d-flex flex-row justify-content-between align-items-center"
            >
              <div>
                <div className="fw-medium">{a.message}</div>
                <div className="text-muted small">
                  {a.disease_name} — {a.patient_name}
                </div>
              </div>
              <Link
                to={`/app/diseases/${a.disease_key}/review/${a.diagnosis_id}`}
                className="text-primary small"
              >
                Review →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
