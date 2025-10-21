// File: src/components/LoginModal.jsx
import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import api from "../services/http"; // ✅ use your central axios instance
import { useNavigate } from "react-router-dom";
import {
  FaHeartbeat,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function LoginModal({ show, onHide, onSwitch }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔑 login with backend API
  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login/", {
        email,
        password,
      });

      // save token in localStorage/session
      if (res.data?.access) {
        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);
      }

      onHide?.();
      navigate("/app");
    } catch (e) {
      setErr(e?.response?.data?.detail || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      contentClassName="border-0 rounded-4 overflow-hidden"
    >
      <Form onSubmit={onSubmit}>
        {/* Hero header */}
        <div className="p-4 text-center auth-hero position-relative">
          <div className="auth-badge mx-auto">
            <FaHeartbeat size={24} />
          </div>
          <h5 className="mt-3 mb-1">Welcome back</h5>
          <div className="text-body-secondary small">
            Sign in to your HealthLens account
          </div>
        </div>

        <Modal.Body className="pt-3 pb-0">
          {err && (
            <Alert variant="danger" className="rounded-3">
              {err}
            </Alert>
          )}

          <Form.Floating className="mb-3">
            <Form.Control
              id="loginEmail"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="loginEmail">
              <FaEnvelope className="me-2 opacity-50" />
              Email
            </label>
          </Form.Floating>

          <div className="mb-2">
            <Form.Label className="small text-muted">Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPwd ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-2">
            <Form.Check
              type="checkbox"
              id="rememberMe"
              label={<span className="small text-muted">Remember me</span>}
            />
            <Button variant="link" className="p-0 small">
              Forgot password?
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 flex-column gap-2">
          <Button
            type="submit"
            disabled={loading}
            className="w-100 rounded-pill"
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Signing in…
              </>
            ) : (
              <>
                <FaLock className="me-2" />
                Sign in
              </>
            )}
          </Button>

          <div className="small text-muted">
            New here?{" "}
            <Button variant="link" className="p-0" onClick={onSwitch}>
              Create an account
            </Button>
          </div>
        </Modal.Footer>
      </Form>

      {/* scoped styles */}
      <style>{`
        .auth-hero {
          background:
            radial-gradient(700px 300px at 0% 0%, rgba(99,102,241,.12), transparent 60%),
            radial-gradient(700px 300px at 100% 0%, rgba(34,197,94,.12), transparent 60%),
            linear-gradient(180deg, #ffffff, #fafafa);
        }
        .auth-badge {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: grid; place-items: center;
          color: #fff;
          box-shadow: 0 10px 25px rgba(0,0,0,.08);
          background: linear-gradient(135deg, #6366f1, #22c55e);
        }
      `}</style>
    </Modal>
  );
}
