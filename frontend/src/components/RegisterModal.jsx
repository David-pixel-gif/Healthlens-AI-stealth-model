// File: src/components/RegisterModal.jsx
import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { register as registerUser, login } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import {
  FaUserPlus,
  FaEnvelope,
  FaUser,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

export default function RegisterModal({
  show = false,
  onHide = () => {},
  onSwitch = () => {},
}) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // ✅ backend expects "full_name"
      await registerUser({ full_name: fullName, email, password });

      // ✅ auto-login with same credentials
      const data = await login({ email, password });

      if (data?.access_token) {
        localStorage.setItem("hl_token", data.access_token);
      }

      // ✅ Close modal first, then navigate
      onHide();
      navigate("/app/dashboard", { replace: true });
    } catch (e) {
      console.error("Registration error:", e); // debug log
      setErr(e?.response?.data?.detail || "Registration failed");
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
            <FaUserPlus size={22} />
          </div>
          <h5 className="mt-3 mb-1">Create your account</h5>
          <div className="text-body-secondary small">
            Join HealthLens to get started
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
              id="regName"
              type="text"
              placeholder="Your name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
            <label htmlFor="regName">
              <FaUser className="me-2 opacity-50" />
              Full name
            </label>
          </Form.Floating>

          <Form.Floating className="mb-3">
            <Form.Control
              id="regEmail"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <label htmlFor="regEmail">
              <FaEnvelope className="me-2 opacity-50" />
              Email
            </label>
          </Form.Floating>

          <div className="mb-3">
            <Form.Label className="small text-muted">Password</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPwd ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
            <div className="form-text">
              Use 6+ characters with letters & numbers.
            </div>
          </div>

          <div className="mb-2">
            <Form.Label className="small text-muted">
              Confirm password
            </Form.Label>
            <InputGroup>
              <Form.Control
                type={showPwd2 ? "text" : "password"}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPwd2((s) => !s)}
                aria-label={showPwd2 ? "Hide password" : "Show password"}
              >
                {showPwd2 ? <FaEyeSlash /> : <FaEye />}
              </Button>
            </InputGroup>
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
                Creating account…
              </>
            ) : (
              <>
                <FaUserPlus className="me-2" />
                Sign up
              </>
            )}
          </Button>

          <div className="small text-muted">
            Already have an account?{" "}
            <Button variant="link" className="p-0" onClick={onSwitch}>
              Sign in
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
          background: linear-gradient(135deg, #4f46e5, #10b981);
        }
      `}</style>
    </Modal>
  );
}
