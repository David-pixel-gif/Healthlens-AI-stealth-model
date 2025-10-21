import React from "react";
import { Card } from "react-bootstrap";

const PredictionResult = ({ riskLevel, description, input }) => {
  return (
    <Card className="p-3 shadow-sm border-0 rounded-3 bg-white mt-3">
      <h4 className="text-center">🧠 Prediction Result</h4>

      <p className="mb-1">
        <strong>Predicted Risk Level:</strong> {riskLevel || "N/A"}
      </p>

      <p className="mb-1">
        <strong>Description:</strong>{" "}
        {description || "No explanation provided."}
      </p>

      {input && typeof input === "object" && (
        <div className="mt-3">
          <strong>Input Summary:</strong>
          <ul className="mb-0">
            {Object.entries(input).map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default PredictionResult;
