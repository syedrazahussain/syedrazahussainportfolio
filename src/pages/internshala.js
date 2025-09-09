
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView, useAnimation, useMotionValue } from "framer-motion";


function ParticleBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // adaptive config
  const config = useMemo(() => {
    const isMobile = window.innerWidth < 640;
    return {
      count: isMobile ? 30 : 80,            // fewer particles on mobile
      maxSpeed: 0.6,
      linkDist: isMobile ? 70 : 110,        // shorter link distance
      size: [1, 3],
      shadows: !isMobile,                   // disable blur on mobile
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // init particles
    particlesRef.current = new Array(config.count).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * config.maxSpeed,
      vy: (Math.random() - 0.5) * config.maxSpeed,
      r: Math.random() * (config.size[1] - config.size[0]) + config.size[0],
    }));

    let lastTime = 0;
    const animate = (time) => {
      // limit to ~30fps
      if (time - lastTime < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = time;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // gradient backdrop (subtle)
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#0f172a"); // slate-900
      grad.addColorStop(1, "#111827"); // gray-900
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const ps = particlesRef.current;

      // draw & move particles
      for (let p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(99,102,241,0.7)"; // indigo-ish
        if (config.shadows) {
          ctx.shadowColor = "#60a5fa";
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      // connect nearby particles
      const linkDistSq = config.linkDist * config.linkDist;
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < linkDistSq) {
            const alpha = 1 - Math.sqrt(distSq) / config.linkDist;
            ctx.strokeStyle = `rgba(96,165,250,${alpha * 0.4})`; // blue-ish
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
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

  return <canvas ref={canvasRef} className="bgCanvas" />;
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="navLeft">
        <span className="brand"><a href='/'> SYED RAZA HUSSAIN </a> </span>
      </div>
      <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="Menu">
        ☰
      </button>
      <ul className={`navLinks ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <li><a href="/">Home</a></li>
        <li><a href="/allprojectspage">All Projects</a></li>
      </ul>
    </nav>
  );
}

function SectionTitle({ title, subtitle }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  return (
    <div
      ref={ref}
      className="relative w-full flex items-center justify-center my-0 overflow-hidden"
    >
      {/* Left Ornament */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="flex-1 h-12 sm:h-20 md:h-24 text-[var(--brand)] opacity-90"
        viewBox="0 0 400 80"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 Q50 0 100 40 T200 40 T300 40 T400 40"
          className={isInView ? "animate-[dash_6s_linear_infinite]" : ""}
        />
        <path
          d="M0 50 Q50 10 100 50 T200 50 T300 50 T400 50"
          opacity="0.6"
          className={isInView ? "animate-[dash_8s_linear_infinite]" : ""}
        />
        <path
          d="M0 30 Q50 70 100 30 T200 30 T300 30 T400 30"
          opacity="0.4"
          className={isInView ? "animate-[dash_10s_linear_infinite]" : ""}
        />

        {[50, 150, 250, 350].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy="40"
            r="4"
            className={isInView ? "animate-pulse" : ""}
            style={{
              animationDuration: `${2 + cx / 120}s`,
              filter: "drop-shadow(0 0 6px var(--accent))",
            }}
          />
        ))}
      </svg>

      {/* Title + Subtitle */}
      <div className="relative z-10 text-center px-2 sm:px-6 max-w-[95%]">
        <h2
          className={`relative text-xl sm:text-3xl md:text-4xl font-extrabold uppercase mb-2 sm:mb-3 ${isInView ? "animate-float" : ""
            }`}
          style={{
            color: "var(--text)",
            textShadow: `
              0 0 12px var(--brand),
              0 0 22px var(--brand2),
              0 0 36px var(--accent),
              0 0 50px var(--brand)
            `,
          }}
        >
          <span className="tracking-[0.1em] sm:tracking-[0.25em] md:tracking-[0.3em]">
            {title}
          </span>
        </h2>

        {subtitle && (
          <p className="text-sm sm:text-lg md:text-xl font-medium text-[var(--textSecondary)] opacity-90 tracking-wide">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Ornament (mirrored) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="flex-1 h-12 sm:h-20 md:h-24 text-[var(--brand2)] opacity-90 rotate-180"
        viewBox="0 0 400 80"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        preserveAspectRatio="none"
      >
        <path
          d="M0 40 Q50 0 100 40 T200 40 T300 40 T400 40"
          className={isInView ? "animate-[dash_6s_linear_infinite]" : ""}
        />
        <path
          d="M0 50 Q50 10 100 50 T200 50 T300 50 T400 50"
          opacity="0.6"
          className={isInView ? "animate-[dash_8s_linear_infinite]" : ""}
        />
        <path
          d="M0 30 Q50 70 100 30 T200 30 T300 30 T400 30"
          opacity="0.4"
          className={isInView ? "animate-[dash_10s_linear_infinite]" : ""}
        />

        {[50, 150, 250, 350].map((cx) => (
          <circle
            key={cx}
            cx={cx}
            cy="40"
            r="4"
            className={isInView ? "animate-pulse" : ""}
            style={{
              animationDuration: `${2 + cx / 140}s`,
              filter: "drop-shadow(0 0 6px var(--brand))",
            }}
          />
        ))}
      </svg>

      {/* Background Glow Layers */}
      <div className="absolute inset-0 -z-10">
        <div
          className={`w-full h-full bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-[var(--brand2)] opacity-20 blur-2xl sm:blur-3xl ${isInView ? "animate-pulse" : ""
            }`}
        ></div>
      </div>

      {/* Center Glow Burst */}
      <div className="absolute inset-0 flex items-center justify-center -z-20">
        <div
          className={`w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-[var(--accent)] blur-[80px] sm:blur-[140px] opacity-30 ${isInView ? "animate-[pulse_5s_ease-in-out_infinite]" : ""
            }`}
        ></div>
      </div>
    </div>
  );
}



const Section = ({ id, title, children }) => (
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


const internshala = () => {
  return (
    <div>
      <ParticleBackground />
      <Nav />

      <main>

        {/* PROJECTS */}
        <Section id="internshala" title={<SectionTitle title="Internshala Automation" />} className="!pt-4 !pb-4">
          <div className="prose prose-invert max-w-none space-y-8 leading-relaxed">

            {/* Intro */}
            <p>
              <strong>Internshala Automation</strong> is a productivity tool designed to
              save time and ensure students never miss important internship
              opportunities. It automates login, filters opportunities based on user
              preferences, applies automatically, and sends real-time SMS/email
              notifications about the status of each application.
            </p>

            {/* Problem Section */}
            <h3 className="text-2xl font-semibold text-[var(--brand)]">The Problem</h3>
            <p>
              Many students lose valuable opportunities due to manual browsing,
              forgetting deadlines, and repetitive application tasks. Checking multiple
              listings daily is time-consuming, often leading to missed chances.
            </p>

            {/* Solution Section */}
            <h3 className="text-2xl font-semibold text-[var(--brand2)]">The Solution</h3>
            <p>
              The automation tool integrates with Internshala to:
            </p>
            <ul className="list-disc list-inside">
              <li>Automatically log in using secure credentials.</li>
              <li>Search internships based on skills, location, and preferences.</li>
              <li>Apply with pre-filled forms to save time.</li>

            </ul>

            {/* Image Placeholder */}
            <div className="media-container flex-col sm:flex-row">
              {/* Image */}
              <div className="flex-1 flex justify-center">
                <img
                  src="/internship_response.jpg"
                  alt="Internshala Automation Dashboard"
                />
              </div>

              {/* Video */}
              <div className="flex-1 flex justify-center">
                <video
                  src="/assets/video/internshala_automation.mp4"
                  controls
                />
              </div>
            </div>



            {/* Impact Section */}
            <h3 className="text-2xl font-semibold text-[var(--accent)]">Impact</h3>
            <p>
              The tool dramatically reduces effort and increases efficiency:
            </p>
            <ul className="list-disc list-inside">
              <li><strong>5+ hours saved weekly</strong> for each student.</li>
              <li>Application submission rate improved by <strong>3×</strong>.</li>
              <li><strong>90% fewer missed opportunities</strong> due to automated reminders.</li>
              <li>Boosted engagement and confidence in securing internships.</li>
            </ul>

            {/* Outro */}
            <p>
              With Internshala Automation, students can focus on preparing for their
              careers while the system takes care of repetitive, time-sensitive tasks.
            </p>
          </div>
        </Section>

      </main>

      <style>{`
      :root{ --bg: #0b1020; --panel: #0f172a; --glass: rgba(255,255,255,0.06); --text: #e5e7eb; --muted: #94a3b8; --brand: #60a5fa; /* blue */ --brand2: #a78bfa; /* violet */ --accent: #34d399; /* emerald */ --shadow: 0 10px 30px rgba(2, 6, 23, 0.6); --radius: 20px; }

  main{max-width:100%; padding:0px 80px 80px 80px;} .section{margin:20px 0} .sectionTitle{font-size: clamp(22px, 3vw, 30px); margin: 40px 0 60px; font-weight:800; letter-spacing:0.3px} *{box-sizing:border-box} html,body,#root{height:100%} body{margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:var(--text); background:var(--bg);} .bgCanvas{position:fixed; inset:0; z-index:-2} .nav{position:sticky; top:0; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:14px 22px; backdrop-filter: blur(10px); background: linear-gradient( to right, rgba(17,24,39,0.6), rgba(2,6,23,0.35)); border-bottom:1px solid rgba(255,255,255,0.06)} .brand{font-weight:700; letter-spacing:0.3px; background:linear-gradient(90deg,var(--brand),var(--brand2)); -webkit-background-clip:text; background-clip:text; color:transparent} .navLinks{display:flex; gap:18px; list-style:none; margin:0; padding:0} .navLinks a{color:var(--text); text-decoration:none; font-size:0.95rem; opacity:0.9} .navLinks a:hover{color:white} .menuBtn{display:none; font-size:22px; color:var(--text); background:none; border:none} @media (max-width:860px){ .menuBtn{display:block} .navLinks{position:absolute; right:12px; top:58px; flex-direction:column; background:rgba(15,23,42,0.95); padding:12px; border:1px solid rgba(255,255,255,0.06); border-radius:12px; display:none} .navLinks.open{display:flex} 

@media (max-width:640px){
  main {
    padding: 0px 20px 40px 20px;
  }
  .sectionTitle {
    font-size: clamp(18px, 5vw, 24px);
    margin: 30px 0 40px;
  }
  h3 {
    font-size: 1.5rem;
  }
  p, ul, li {
    font-size: 0.9rem;
  }
  .media-container {
    flex-direction: column !important;
  }
  .media-container img, .media-container video {
    height: auto !important;
    max-height: 300px;
    width: 100%;
  }
}

.section {
  margin: 20px 0;
}

.prose {
  max-width: 100%;
  line-height: 1.8;
}

.media-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
}

.media-container img, .media-container video {
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  border: 1px solid var(--glass);
  width: 100%;
  max-width: 600px;
  height: 600px;
  object-fit: contain;
}

     @keyframes dash {
  0% {
    stroke-dasharray: 10, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 200, 10;
    stroke-dashoffset: -200;
  }
  100% {
    stroke-dasharray: 10, 200;
    stroke-dashoffset: 0;
  }
}

@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
  50% {
    transform: translateY(-10px) rotate(1deg) scale(1.02);
  }
  100% {
    transform: translateY(0px) rotate(0deg) scale(1);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}
`}</style>



    </div>
  )
}

export default internshala

