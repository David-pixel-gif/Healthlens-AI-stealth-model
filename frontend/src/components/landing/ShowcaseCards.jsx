import { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { FaHeartbeat, FaChartLine, FaShieldAlt } from "react-icons/fa";

export default function ShowcaseCards({ onPreview }) {
  const [idx, setIdx] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const timerRef = useRef(null);

  const cards = [
    {
      key: "preview",
      title: "Live Dashboard Preview",
      body: (
        <div className="showcase-video">
          {/* Put your demo video at /public/videos/healthlens-dashboard.mp4 */}
          <video
            src="/videos/healthlens-dashboard.mp4"
            muted
            loop
            playsInline
            autoPlay
          />
        </div>
      ),
      ctas: (
        <div className="showcase-ctas">
          <Button size="sm" onClick={onPreview}>
            Preview Login
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={onPreview}>
            Explore
          </Button>
        </div>
      ),
      icon: <FaHeartbeat className="text-primary me-2" />,
    },
    {
      key: "reports",
      title: "One-click Reports",
      body: (
        <p className="mb-0 text-body-secondary">
          Export clean PDFs with predictions, confidence and notes your team can
          review in minutes.
        </p>
      ),
      ctas: (
        <Button size="sm" onClick={onPreview}>
          See sample
        </Button>
      ),
      icon: <FaChartLine className="text-primary me-2" />,
    },
    {
      key: "privacy",
      title: "Privacy-first by Design",
      body: (
        <p className="mb-0 text-body-secondary">
          Data stays in your environment. Role-based access & audit trail
          (coming soon).
        </p>
      ),
      ctas: (
        <Button size="sm" variant="outline-secondary" onClick={onPreview}>
          Learn more
        </Button>
      ),
      icon: <FaShieldAlt className="text-primary me-2" />,
    },
  ];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setLeaving(idx); // animate current out
      setIdx((p) => (p + 1) % cards.length);
      setTimeout(() => setLeaving(null), 650); // clear leaving flag after anim
    }, 2200);
    return () => clearInterval(timerRef.current);
  }, [idx]); // rotate every ~2.2s

  const active = cards[idx];
  const leavingCard = leaving != null ? cards[leaving] : null;

  return (
    <div className="showcase">
      <div className="showcase-stack">
        {leavingCard && (
          <div className="showcase-card leaving">
            <div className="showcase-inner">
              <div className="d-flex align-items-center mb-1">
                {leavingCard.icon}
                <div className="showcase-title h5 mb-0">
                  {leavingCard.title}
                </div>
              </div>
              {leavingCard.body}
            </div>
          </div>
        )}

        <div className="showcase-card is-active">
          <div className="showcase-inner">
            <div className="d-flex align-items-center mb-1">
              {active.icon}
              <div className="showcase-title h5 mb-0">{active.title}</div>
            </div>
            {active.body}
            <div>{active.ctas}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
