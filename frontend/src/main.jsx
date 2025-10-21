// File: src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Global styles/vendor (remove @-alias lines if you don't have the alias)
import "@/assets/styles/index.css";
import "@/assets/styles/theme.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Pages/components
import Landing from "./components/Landing.jsx";
import LoginModal from "./components/LoginModal.jsx";
import RegisterModal from "./components/RegisterModal.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import DashboardOverview from "./components/DashboardOverview.jsx";

// Disease pages
import BrainTumorDetect from "./components/diseases/brain_tumor/Detect.jsx";
import BrainTumorReview from "./components/diseases/brain_tumor/Review.jsx";
import BrainTumorTreat from "./components/diseases/brain_tumor/Treat.jsx";

import MalariaDetect from "./components/diseases/malaria/Detect.jsx";
import MalariaReview from "./components/diseases/malaria/Review.jsx";
import MalariaTreat from "./components/diseases/malaria/Treat.jsx";

import MalnutritionDetect from "./components/diseases/malnutrition/Detect.jsx";
import MalnutritionReview from "./components/diseases/malnutrition/Review.jsx";
import MalnutritionTreat from "./components/diseases/malnutrition/Treat.jsx";

import SkinCancerDetect from "./components/diseases/skin_cancer/Detect.jsx";
import SkinCancerReview from "./components/diseases/skin_cancer/Review.jsx";
import SkinCancerTreat from "./components/diseases/skin_cancer/Treat.jsx";

import TBDetect from "./components/diseases/tb/Detect.jsx";
import TBReview from "./components/diseases/tb/Review.jsx";
import TBTreat from "./components/diseases/tb/Treat.jsx";

// Guard (why: avoid bouncing logged-in users; match tokens your modals save)
function ProtectedRoute({ children }) {
  const token =
    localStorage.getItem("hl_token") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("refresh_token");

  return token ? children : <Navigate to="/login" replace />;
}

// Local routes container — not exported and not named "App"
function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<LoginModal />} />
      <Route path="/register" element={<RegisterModal />} />

      {/* Protected */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />

        {/* Disease routes */}
        <Route
          path="diseases/brain_tumor/detect"
          element={<BrainTumorDetect />}
        />
        <Route
          path="diseases/brain_tumor/review"
          element={<BrainTumorReview />}
        />
        <Route
          path="diseases/brain_tumor/treat"
          element={<BrainTumorTreat />}
        />

        <Route path="diseases/malaria/detect" element={<MalariaDetect />} />
        <Route path="diseases/malaria/review" element={<MalariaReview />} />
        <Route path="diseases/malaria/treat" element={<MalariaTreat />} />

        <Route
          path="diseases/malnutrition/detect"
          element={<MalnutritionDetect />}
        />
        <Route
          path="diseases/malnutrition/review"
          element={<MalnutritionReview />}
        />
        <Route
          path="diseases/malnutrition/treat"
          element={<MalnutritionTreat />}
        />

        <Route
          path="diseases/skin_cancer/detect"
          element={<SkinCancerDetect />}
        />
        <Route
          path="diseases/skin_cancer/review"
          element={<SkinCancerReview />}
        />
        <Route
          path="diseases/skin_cancer/treat"
          element={<SkinCancerTreat />}
        />

        <Route path="diseases/tb/detect" element={<TBDetect />} />
        <Route path="diseases/tb/review" element={<TBReview />} />
        <Route path="diseases/tb/treat" element={<TBTreat />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
