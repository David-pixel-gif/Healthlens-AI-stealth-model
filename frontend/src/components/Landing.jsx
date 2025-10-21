// File: src/components/Landing.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import ShowcaseCards from "./landing/ShowcaseCards";
import LoginModal from "./LoginModal.jsx"; // modal expects show/onHide/onSwitch
import RegisterModal from "./RegisterModal.jsx"; // modal expects show/onHide/onSwitch

/**
 * Headlines are seeded from recent reputable sources.
 * Swap to a backend or a news API later if you want true runtime updates.
 */
const newsByDisease = {
  brain_tumor: [
    {
      title: "FDA approves Modeyso for diffuse midline glioma (DMG)",
      source: "Reuters",
      date: "Aug 6, 2025",
      url: "https://www.reuters.com/business/healthcare-pharmaceuticals/us-fda-approves-jazz-pharmas-drug-rare-brain-tumor-2025-08-06/",
    },
    {
      title: "CAR-T therapy shrinks tumors in recurrent glioblastoma (62%)",
      source: "Reuters",
      date: "Jun 1, 2025",
      url: "https://www.reuters.com/business/healthcare-pharmaceuticals/gileads-car-t-cell-therapy-shows-promise-deadly-brain-cancer-2025-06-01/",
    },
  ],

  malnutrition: [
    {
      title: "Global hunger down overall, rising in Africa & W. Asia",
      source: "UNICEF",
      date: "Aug 2025",
      url: "https://www.unicef.org/press-releases/global-hunger-declines-rises-africa-and-western-asia-un-report",
    },
    {
      title: "UNICEF: 2.4M children risk losing life-saving RUTF in 2025",
      source: "UNICEF",
      date: "Sep 2025",
      url: "https://www.unicef.org/press-releases/least-14-million-children-face-disruptions-critical-nutrition-services-2025-unicef",
    },
    {
      title: "Sudan: el-Fasher siege sees deadly surge in malnutrition",
      source: "AP News",
      date: "Sep 2025",
      url: "https://apnews.com/article/82eeee30439a90be55cf6c3493508834",
    },
  ],

  skin_cancer: [
    {
      title: "IO Biotech melanoma vaccine misses primary goal, shows signal",
      source: "Reuters",
      date: "Aug 12, 2025",
      url: "https://www.reuters.com/business/healthcare-pharmaceuticals/io-biotechs-cancer-vaccine-shows-improvement-narrowly-misses-study-goal-2025-08-11/",
    },
    {
      title: "FDA okays subcutaneous pembrolizumab (incl. melanoma labels)",
      source: "FDA",
      date: "Sep 19, 2025",
      url: "https://www.fda.gov/drugs/resources-information-approved-drugs/oncology-cancerhematologic-malignancies-approval-notifications",
    },
    {
      title: "Fact-check: sunscreen ‘danger’ posts lack key context",
      source: "Reuters",
      date: "Jul 16, 2025",
      url: "https://www.reuters.com/fact-check/key-context-missing-post-suggesting-sunscreen-is-dangerous-2025-07-16/",
    },
  ],
};

/**
 * List of AI modules available in the app.
 */
const features = [
  {
    key: "brain_tumor",
    name: "Brain Tumor",
    desc: "AI-powered MRI analysis for early tumor detection.",
  },
  {
    key: "malnutrition",
    name: "Malnutrition",
    desc: "Image-driven growth & nutrition assessment for children.",
  },
  {
    key: "skin_cancer",
    name: "Skin Cancer",
    desc: "Dermatology-grade lesion detection and classification.",
  },
];

/** Small pill to label disease type. */
function DiseaseBadge({ id }) {
  const color =
    {
      brain_tumor: "primary",
      malnutrition: "warning",
      skin_cancer: "danger",
    }[id] || "secondary";

  return (
    <Badge bg={color} className="text-uppercase">
      {id.replace("_", " ")}
    </Badge>
  );
}

/** Auto-rotating news card stack with a flip effect. */
function NewsFlipper() {
  const categories = useMemo(() => Object.keys(newsByDisease), []);
  const [catIdx, setCatIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const currentKey = categories[catIdx];
  const items = newsByDisease[currentKey];

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setItemIdx((i) => {
        const next = (i + 1) % items.length;
        if (next === 0) setCatIdx((c) => (c + 1) % categories.length);
        return next;
      });
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [paused, items.length, categories.length]);

  const goPrev = () => {
    setPaused(true);
    setItemIdx((i) => (i - 1 + items.length) % items.length);
  };

  const goNext = () => {
    setPaused(true);
    setItemIdx((i) => {
      const next = (i + 1) % items.length;
      if (next === 0) setCatIdx((c) => (c + 1) % categories.length);
      return next;
    });
  };

  const item = items[itemIdx];

  return (
    <div
      className="position-relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="h5 mb-0 text-dark">Live Disease News</h3>
        <div className="d-flex align-items-center gap-2">
          <DiseaseBadge id={currentKey} />
          <Badge bg={paused ? "secondary" : "dark"}>
            {paused ? "Paused" : "Auto"}
          </Badge>
          <Button
            variant="outline-dark"
            size="sm"
            onClick={goPrev}
            aria-label="Previous"
          >
            ‹
          </Button>
          <Button variant="dark" size="sm" onClick={goNext} aria-label="Next">
            ›
          </Button>
        </div>
      </div>

      <div style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentKey}-${itemIdx}`}
            initial={{ rotateX: 90, opacity: 0, y: -10 }}
            animate={{ rotateX: 0, opacity: 1, y: 0 }}
            exit={{ rotateX: -90, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
          >
            <Card className="border-0 shadow rounded-4 overflow-hidden">
              <Card.Body className="p-4">
                <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                  <div>
                    <div className="mb-2">
                      <DiseaseBadge id={currentKey} />
                    </div>
                    <Card.Title className="h5 text-dark mb-2">
                      {item.title}
                    </Card.Title>
                    <Card.Subtitle className="text-muted small">
                      {item.source} • {item.date}
                    </Card.Subtitle>
                  </div>
                  <div>
                    <a
                      className="btn btn-outline-primary rounded-pill"
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Read ↗
                    </a>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="text-muted small mt-3">
        Cycling through:{" "}
        {categories.map((k, i) => (
          <span
            key={k}
            className={`me-2 ${i === catIdx ? "fw-semibold text-dark" : ""}`}
          >
            {k.replace("_", " ")}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showLogin, setShowLogin] = useState(false);
  const [showReg, setShowReg] = useState(false);

  // open/close helpers keep URL in sync: /?auth=login|register
  const openLogin = () => {
    setShowReg(false);
    setShowLogin(true);
    setSearchParams({ auth: "login" }, { replace: true });
  };
  const openRegister = () => {
    setShowLogin(false);
    setShowReg(true);
    setSearchParams({ auth: "register" }, { replace: true });
  };
  const closeModals = () => {
    setShowLogin(false);
    setShowReg(false);
    navigate("/", { replace: true }); // Clear the query param & stay on home
  };

  // deep-link support: /?auth=login or /?auth=register
  useEffect(() => {
    const auth = (searchParams.get("auth") || "").toLowerCase();
    if (auth === "login") {
      setShowLogin(true);
      setShowReg(false);
    } else if (auth === "register") {
      setShowReg(true);
      setShowLogin(false);
    } else {
      setShowLogin(false);
      setShowReg(false);
    }
  }, [searchParams]);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Hero */}
      <section className="flex-grow d-flex flex-column align-items-center justify-content-center text-center px-4 py-5 bg-light">
        <motion.h1
          className="display-5 fw-bold mb-4 text-dark"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Welcome to <span className="text-primary">HealthLens AI</span>
        </motion.h1>
        <motion.p
          className="lead text-muted mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          An AI-powered diagnostic toolkit for clinicians. Upload scans &
          images, and let HealthLens assist early detection.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="d-flex gap-3 flex-wrap justify-content-center"
        >
          <Button
            variant="primary"
            size="lg"
            className="rounded-pill px-4 py-2 shadow"
            onClick={openLogin}
          >
            Get Started →
          </Button>
          <Button
            variant="outline-dark"
            size="lg"
            className="rounded-pill px-4 py-2"
            onClick={openRegister}
          >
            Create account
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-5 bg-white border-top">
        <Container>
          <h2 className="text-center fw-semibold mb-5 text-dark">
            Explore Modules
          </h2>
          <Row className="g-4">
            {features.map((f) => (
              <Col key={f.key} xs={12} sm={6} lg={4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card className="h-100 shadow-sm border-0 rounded-4">
                    <Card.Body className="d-flex flex-column justify-content-between p-4">
                      <div>
                        <Card.Title className="fw-bold text-dark">
                          {f.name}
                        </Card.Title>
                        <Card.Text className="text-muted small">
                          {f.desc}
                        </Card.Text>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="rounded-pill mt-3"
                          onClick={openLogin}
                        >
                          Try Module →
                        </Button>
                        <DiseaseBadge id={f.key} />
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Live News */}
      <section className="py-5 bg-light border-top">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10} xl={9}>
              <NewsFlipper />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Showcase */}
      <section className="py-5 bg-white border-top">
        <Container>
          <h2 className="text-center fw-semibold mb-5 text-dark">
            Why HealthLens?
          </h2>
          <ShowcaseCards />
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center text-muted small border-top">
        © {new Date().getFullYear()} HealthLens AI. All rights reserved.
      </footer>

      {/* Auth Modals */}
      <LoginModal
        show={showLogin}
        onHide={closeModals}
        onSwitch={openRegister}
      />
      <RegisterModal show={showReg} onHide={closeModals} onSwitch={openLogin} />
    </div>
  );
}
