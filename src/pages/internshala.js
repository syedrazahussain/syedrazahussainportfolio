
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { CustomScrollbar } from "../screens/Homescreen";

function ParticleBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  const config = useMemo(() => {
    const isMobile = window.innerWidth < 640;

    return {
      count: isMobile ? 30 : 80,
      maxSpeed: 0.6,
      linkDist: isMobile ? 70 : 110,
      size: [1, 3],
      shadows: !isMobile,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    particlesRef.current = Array.from(
      { length: config.count },
      () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * config.maxSpeed,
        vy: (Math.random() - 0.5) * config.maxSpeed,
        r:
          Math.random() * (config.size[1] - config.size[0]) +
          config.size[0],
      })
    );

    let lastTime = 0;

    const animate = (time) => {
      if (time - lastTime < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(
        0, 0, canvas.width, canvas.height
      );
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(1, "#111827");

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99,102,241,0.7)";
        ctx.shadowColor = "#60a5fa";
        ctx.shadowBlur = config.shadows ? 8 : 0;
        ctx.fill();
      }

      ctx.shadowBlur = 0;

      const linkDistSq = config.linkDist * config.linkDist;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < linkDistSq) {
            const alpha =
              1 - Math.sqrt(distSq) / config.linkDist;

            ctx.strokeStyle = `rgba(96,165,250,${alpha * 0.4})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [config]);

  return <canvas ref={canvasRef} className="bgCanvas" aria-hidden="true" />;
}

function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      <div className="navLeft">
        <span className="brand">
          <a href="/">SYED RAZA HUSSAIN</a>
        </span>
      </div>

      <button
        className="menuBtn"
        onClick={() => setOpen((value) => !value)}
        aria-label="Menu"
        aria-expanded={open}
      >
        ☰
      </button>

      <ul
        className={`navLinks ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      >
        <li><a href="/">Home</a></li>
        <li><a href="/allprojectspage">All Projects</a></li>
      </ul>
    </nav>
  );
}

function SectionTitle({ title, subtitle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  const Ornament = ({ mirrored = false }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`ornament ${mirrored ? "mirrored" : ""}`}
      viewBox="0 0 400 80"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 40 Q50 0 100 40 T200 40 T300 40 T400 40"
        className={isInView ? "animate-dash" : ""}
      />
      <path
        d="M0 50 Q50 10 100 50 T200 50 T300 50 T400 50"
        opacity="0.6"
      />
      <path
        d="M0 30 Q50 70 100 30 T200 30 T300 30 T400 30"
        opacity="0.4"
      />
      {[50, 150, 250, 350].map((cx) => (
        <circle
          key={cx}
          cx={cx}
          cy="40"
          r="4"
          className={isInView ? "animate-pulse" : ""}
        />
      ))}
    </svg>
  );

  return (
    <div ref={ref} className="sectionHeading">
      <Ornament />

      <div className="sectionHeadingText">
        <h2 className={isInView ? "animate-float" : ""}>
          {title}
        </h2>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <Ornament mirrored />
    </div>
  );
}

function Section({ id, title, children }) {
  return (
    <section id={id} className="section">
      <motion.h2
        className="sectionTitle"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {title}
      </motion.h2>

      {children}
    </section>
  );
}

function Internshala() {
  return (
    <div className="internshalaPage">
      <ParticleBackground />
      <CustomScrollbar />
      <Nav />

      <main>
        <Section
          id="internshala"
          title={
            <SectionTitle title="Internshala Automation" />
          }
        >
          <div className="prose">
            <p>
              <strong>Internshala Automation</strong> is a productivity
              tool designed to save time and ensure students never miss
              important internship opportunities. It automates login,
              filters opportunities based on user preferences, applies
              automatically, and sends real-time SMS/email notifications
              about the status of each application.
            </p>

            <h3 className="problemTitle">The Problem</h3>
            <p>
              Many students lose valuable opportunities due to manual
              browsing, forgetting deadlines, and repetitive application
              tasks. Checking multiple listings daily is time-consuming,
              often leading to missed chances.
            </p>

            <h3 className="solutionTitle">The Solution</h3>
            <p>The automation tool integrates with Internshala to:</p>
            <ul>
              <li>Automatically log in using secure credentials.</li>
              <li>Search internships based on skills, location, and preferences.</li>
              <li>Apply with pre-filled forms to save time.</li>
            </ul>

            <div className="media-container">
              <div className="mediaItem">
                <img
                  src="/internship_response.jpg"
                  alt="Internshala Automation Dashboard"
                />
              </div>

              <div className="mediaItem">
                <video
                  src="/assets/video/internshala_automation.mp4"
                  controls
                  preload="metadata"
                />
              </div>
            </div>

            <h3 className="impactTitle">Impact</h3>
            <p>The tool dramatically reduces effort and increases efficiency:</p>
            <ul>
              <li><strong>5+ hours saved weekly</strong> for each student.</li>
              <li>Application submission rate improved by <strong>3×</strong>.</li>
              <li><strong>90% fewer missed opportunities</strong> due to automated reminders.</li>
              <li>Boosted engagement and confidence in securing internships.</li>
            </ul>

            <p>
              With Internshala Automation, students can focus on preparing
              for their careers while the system takes care of repetitive,
              time-sensitive tasks.
            </p>
          </div>
        </Section>
      </main>

      <style>{`
        :root {
          --bg: #0b1020;
          --panel: #0f172a;
          --glass: rgba(255,255,255,0.06);
          --text: #e5e7eb;
          --muted: #94a3b8;
          --brand: #60a5fa;
          --brand2: #a78bfa;
          --accent: #34d399;
          --shadow: 0 10px 30px rgba(2,6,23,0.6);
          --radius: 20px;
        }

        * {
          box-sizing: border-box;
        }

        html {
          min-height: 100%;
          overflow-y: auto;
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
          scroll-behavior: smooth;
        }

        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        #root::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        body {
          margin: 0;
          min-height: 100%;
          font-family: ui-sans-serif, system-ui, -apple-system,
            BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
          background: var(--bg);
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }

        .internshalaPage {
          position: relative;
          min-height: 100vh;
          isolation: isolate;
          background: transparent;
        }

        .bgCanvas {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          pointer-events: none;
        }

        .nav {
          position: sticky;
          top: 0;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 22px;
          backdrop-filter: blur(10px);
          background: linear-gradient(
            to right,
            rgba(17,24,39,0.6),
            rgba(2,6,23,0.35)
          );
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        .brand {
          font-weight: 700;
          letter-spacing: 0.3px;
          background: linear-gradient(90deg,var(--brand),var(--brand2));
          -webkit-background-clip: text;
          background-clip: text;
        }

        .brand a {
          color: transparent;
          text-decoration: none;
        }

        .navLinks {
          display: flex;
          gap: 18px;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .navLinks a {
          color: var(--text);
          text-decoration: none;
          font-size: 0.95rem;
          opacity: 0.9;
        }

        .navLinks a:hover {
          color: white;
        }

        .menuBtn {
          display: none;
          font-size: 22px;
          color: var(--text);
          background: none;
          border: none;
          cursor: pointer;
        }

        main {
          width: 100%;
          max-width: 100%;
          padding: 0 80px 80px;
        }

        .section {
          margin: 20px 0;
        }

        .sectionTitle {
          font-size: clamp(22px, 3vw, 30px);
          margin: 40px 0 40px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        .sectionHeading {
          position: relative;
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          gap: 8px;
        }

        .ornament {
          flex: 1;
          min-width: 0;
          height: 80px;
          color: var(--brand);
          opacity: 0.9;
        }

        .ornament.mirrored {
          transform: rotate(180deg);
          color: var(--brand2);
        }

        .sectionHeadingText {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 0 12px;
          max-width: 95%;
        }

        .sectionHeadingText h2 {
          margin: 0 0 10px;
          font-size: clamp(20px, 3vw, 36px);
          font-weight: 800;
          text-transform: uppercase;
          color: var(--text);
          text-shadow:
            0 0 12px var(--brand),
            0 0 22px var(--brand2),
            0 0 36px var(--accent);
        }

        .sectionHeadingText p {
          color: var(--muted);
        }

        .prose {
          max-width: 100%;
          line-height: 1.8;
        }

        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .problemTitle {
          color: var(--brand);
        }

        .solutionTitle {
          color: var(--brand2);
        }

        .impactTitle {
          color: var(--accent);
        }

        .prose ul {
          list-style: disc;
          padding-left: 1.5rem;
        }

        .media-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
        }

        .mediaItem {
          display: flex;
          flex: 1;
          min-width: 0;
          justify-content: center;
        }

        .mediaItem img,
        .mediaItem video {
          display: block;
          width: 100%;
          max-width: 600px;
          height: 600px;
          object-fit: contain;
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          border: 1px solid var(--glass);
        }

        @keyframes dash {
          0% { stroke-dasharray: 10,200; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 200,10; stroke-dashoffset: -200; }
          100% { stroke-dasharray: 10,200; stroke-dashoffset: 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.02); }
        }

        .animate-dash {
          animation: dash 6s linear infinite;
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        /*
          Custom scrollbar.
          Keep this CSS in the same page as CustomScrollbar.
        */
        .theme-scrollbar {
          position: fixed !important;
          top: 0 !important;
          right: 0 !important;
          width: 14px !important;
          height: 100vh !important;
          height: 100dvh !important;
          z-index: 999999 !important;
          display: block !important;
          background: transparent !important;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .theme-scrollbar-thumb {
          position: absolute;
          top: 0;
          left: 3px;
          width: 8px;
          min-height: 38px;
          border-radius: 999px;
          background: linear-gradient(
            180deg,
            var(--brand),
            var(--brand2),
            var(--accent)
          );
          border: 1px solid rgba(255,255,255,0.3);
          box-shadow:
            0 0 8px rgba(96,165,250,0.5),
            0 0 14px rgba(167,139,250,0.3);
          cursor: grab;
          will-change: transform;
        }

        .theme-scrollbar-thumb:hover {
          width: 10px;
          left: 2px;
        }

        .theme-scrollbar-thumb:active {
          cursor: grabbing;
        }

        @media (max-width: 860px) {
          .menuBtn {
            display: block;
          }

          .navLinks {
            position: absolute;
            right: 12px;
            top: 58px;
            flex-direction: column;
            background: rgba(15,23,42,0.95);
            padding: 12px;
            border: 1px solid rgba(255,255,255,0.06);
            border-radius: 12px;
            display: none;
          }

          .navLinks.open {
            display: flex;
          }

          .theme-scrollbar {
            width: 18px !important;
          }

          .theme-scrollbar-thumb {
            left: 4px;
            width: 10px;
          }

          main {
            padding-left: 32px;
            padding-right: 32px;
          }
        }

        @media (max-width: 640px) {
          main {
            padding: 0 20px 40px;
          }

          .sectionTitle {
            font-size: clamp(18px, 5vw, 24px);
            margin: 30px 0 30px;
          }

          .prose h3 {
            font-size: 1.25rem;
          }

          .prose p,
          .prose ul,
          .prose li {
            font-size: 0.9rem;
          }

          .media-container {
            flex-direction: column;
          }

          .mediaItem {
            width: 100%;
          }

          .mediaItem img,
          .mediaItem video {
            width: 100%;
            height: auto;
            max-height: 300px;
          }

          .ornament {
            height: 48px;
          }

          .sectionHeading {
            gap: 2px;
          }

          .sectionHeadingText {
            padding: 0 4px;
          }
        }
      `}</style>
    </div>
  );
}

export default Internshala;
