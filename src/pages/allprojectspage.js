
import React, { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useInView,
  useAnimation,
  useMotionValue,
  useSpring
} from "framer-motion";
import { CustomScrollbar } from "../screens/Homescreen";


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
        <span className="brand">
          <Link to="/">SYED RAZA HUSSAIN</Link>
        </span>
      </div>

      <button
        className="menuBtn"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        ☰
      </button>

      <ul
        className={`navLinks ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      >
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/allprojectspage">All Projects</Link>
        </li>
      </ul>
    </nav>
  );
}




function ProjectCard({ proj }) {
  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);

  const rotateX = useSpring(rotateXValue, {
    stiffness: 180,
    damping: 18,
    mass: 0.5,
  });

  const rotateY = useSpring(rotateYValue, {
    stiffness: 180,
    damping: 18,
    mass: 0.5,
  });

  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateYAmount = ((x - centerX) / centerX) * 10;
    const rotateXAmount = -((y - centerY) / centerY) * 10;

    rotateXValue.set(rotateXAmount);
    rotateYValue.set(rotateYAmount);

    setShine({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXValue.set(0);
    rotateYValue.set(0);
    setShine({ x: 50, y: 50 });
  };

  return (
    <div className="project-3d-wrapper">
      <motion.div
        className={`project-3d-card ${isHovered ? "is-hovered" : ""}`}
        style={{
          rotateX,
          rotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Animated glow border */}
        <div className="project-3d-border" />

        {/* Mouse-follow shine */}
        <div
          className="project-3d-shine"
          style={{
            background: `radial-gradient(
              circle at ${shine.x}% ${shine.y}%,
              rgba(255,255,255,0.18),
              transparent 48%
            )`,
          }}
        />

        <div className="project-3d-content">
          {/* Project image */}
          <div className="project-3d-image-wrap">
            <img
              src={proj.image}
              alt={proj.title}
              className="project-3d-image"
              loading="lazy"
            />

            <div className="project-3d-image-overlay" />

            <span className="project-3d-label">
              FEATURED PROJECT
            </span>
          </div>

          {/* Project details */}
          <div className="project-3d-details">
            <h3 className="project-3d-title">
              {proj.title}
            </h3>

            <p className="project-3d-description">
              {proj.desc}
            </p>

            {/* Tech badges */}
            <div className="project-3d-tech">
              {proj.tech.map((tech, index) => (
                <span
                  key={`${tech}-${index}`}
                  className="project-3d-badge"
                  style={{
                    transitionDelay: `${index * 25}ms`,
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Bottom action */}
            <div className="project-3d-footer">
              {proj.link ? (
                <a
                  href={proj.link}
                  target={
                    proj.link.startsWith("/")
                      ? "_self"
                      : "_blank"
                  }
                  rel={
                    proj.link.startsWith("/")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="project-3d-button"
                >
                  <span>Explore Project</span>
                  <span className="project-3d-arrow">↗</span>
                </a>
              ) : (
                <span className="project-3d-private">
                  Project Preview
                </span>
              )}

              
            </div>
          </div>
        </div>
      </motion.div>
    </div>
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


const allprojectspage = () => {
  return (
    <div>
      <ParticleBackground />
      <CustomScrollbar />
      <Nav />

      <main>

        {/* PROJECTS */}
        <Section id="projects" title={<SectionTitle title="Projects" />} className="!pt-4 !pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {projects.map((p, i) => (
              <ProjectCard key={i} proj={p} />
            ))}
          </div>
        </Section>

      </main>

      <style>{`
:root{
  --bg: #0b1020;
  --panel: #0f172a;
  --glass: rgba(255,255,255,0.06);
  --text: #e5e7eb;
  --muted: #94a3b8;
  --brand: #60a5fa; /* blue */
  --brand2: #a78bfa; /* violet */
  --accent: #34d399; /* emerald */
  --shadow: 0 10px 30px rgba(2, 6, 23, 0.6);
  --radius: 20px;
}

main{
  max-width:100%;
  padding:0px 40px 60px 40px;
}
  @keyframes dash { 0% { stroke-dasharray: 10, 200; stroke-dashoffset: 0; } 50% { stroke-dasharray: 200, 10; stroke-dashoffset: -200; } 100% { stroke-dasharray: 10, 200; stroke-dashoffset: 0; } } @keyframes float { 0% { transform: translateY(0px) rotate(0deg) scale(1); } 50% { transform: translateY(-10px) rotate(1deg) scale(1.02); } 100% { transform: translateY(0px) rotate(0deg) scale(1); } } .animate-float { animation: float 5s ease-in-out infinite; }

@media (max-width:640px){
  main{
    padding:0px 20px 40px 20px;
  }
  .sectionTitle{
    font-size: clamp(18px, 5vw, 24px);
    margin: 30px 0 40px;
  }
}

.section{
  margin:20px 0
}

.sectionTitle{
  font-size: clamp(22px, 3vw, 30px);
  margin: 40px 0 60px;
  font-weight:800;
  letter-spacing:0.3px
}

*{box-sizing:border-box}
html,body,#root{height:100%}
body{
  margin:0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  color:var(--text);
  background:var(--bg);
}

.bgCanvas{
  position:fixed; inset:0; z-index:-2
}

/* Navigation */
.nav{
  position:sticky;
  top:0;
  z-index:10;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:14px 22px;
  backdrop-filter: blur(10px);
  background: linear-gradient(to right, rgba(17,24,39,0.6), rgba(2,6,23,0.35));
  border-bottom:1px solid rgba(255,255,255,0.06);
}
.brand{
  font-weight:700;
  letter-spacing:0.3px;
  background:linear-gradient(90deg,var(--brand),var(--brand2));
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent
}
.navLinks{
  display:flex;
  gap:18px;
  list-style:none;
  margin:0;
  padding:0;
}
.navLinks a{
  color:var(--text);
  text-decoration:none;
  font-size:0.95rem;
  opacity:0.9
}
.navLinks a:hover{color:white}
.menuBtn{display:none; font-size:22px; color:var(--text); background:none; border:none}

@media (max-width:860px){
  .menuBtn{display:block}
  .navLinks{
    position:absolute; right:12px; top:58px;
    flex-direction:column;
    background:rgba(15,23,42,0.95);
    padding:12px;
    border:1px solid rgba(255,255,255,0.06);
    border-radius:12px;
    display:none;
  }
  .navLinks.open{display:flex}
}

/* Project Grid */
.grid {
  display: grid;
  gap: 1.25rem;
}

/* Project Card */
.projectCard{
  p-6 rounded-[var(--radius)] shadow-xl flex flex-col
  bg-[var(--panel)] border border-[var(--glass)]
  hover:-translate-y-2 hover:shadow-2xl transition duration-300
  min-h-[500px];
}

.projectCard img{
  width:100%;
  height:auto;
  object-fit:cover;
  border-radius:var(--radius);
}

@media(max-width:640px){
  .projectCard{
    min-h:420px;
    padding:1rem;
  }
  .projectCard h3{font-size:1rem;}
  .projectCard p{font-size:0.8rem;}
  .projectCard .tech-badges span{
    font-size:0.65rem;
    padding:0.25rem 0.5rem;
  }
  .projectCard a{
    padding:0.5rem 1rem;
    font-size:0.75rem;
  }
}


/* Hide native scrollbar but keep page scrolling */
html {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* Custom scrollbar track */
.theme-scrollbar {
  position: fixed;
  top: 0;
  right: 0;
  width: 14px;
  height: 100vh;
  height: 100dvh;
  z-index: 99999;
  background: transparent;
  touch-action: none;
  user-select: none;
}

/* Gradient scrollbar thumb */
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
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 0 8px rgba(96, 165, 250, 0.35),
    0 0 14px rgba(167, 139, 250, 0.2);
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
  .theme-scrollbar {
    width: 18px;
  }

  .theme-scrollbar-thumb {
    left: 4px;
    width: 10px;
    min-height: 44px;
  }
}


/* ===== 3D PROJECT CARDS ===== */

.project-3d-wrapper {
  width: 100%;
  max-width: none;
  min-width: 0;
  margin: 0 auto 20px;
  perspective: 1200px;
}

.project-3d-card {
  position: relative;
  width: 100%;
  height: 600px;
  border-radius: 22px;
  isolation: isolate;
  transform-style: preserve-3d;
  transition: box-shadow 0.35s ease;
  will-change: transform;
}

.project-3d-card.is-hovered {
  box-shadow:
    0 25px 55px rgba(0, 0, 0, 0.4),
    0 0 25px rgba(96, 165, 250, 0.16);
}

/* Gradient border stays above the background */
.project-3d-border {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(
    135deg,
    #60a5fa,
    #a78bfa,
    #34d399,
    #60a5fa
  );
  background-size: 300% 300%;
  animation: projectBorderGlow 7s ease infinite;
  pointer-events: none;

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@keyframes projectBorderGlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Glass card interior */
.project-3d-content {
  position: absolute;
  inset: 1px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  border-radius: 21px;
  background: linear-gradient(
    145deg,
    rgba(15, 23, 42, 0.98),
    rgba(8, 15, 31, 0.98)
  );
  transform: translateZ(1px);
}

/* Shine follows the pointer */
.project-3d-shine {
  position: absolute;
  inset: 0;
  z-index: 3;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-3d-card.is-hovered .project-3d-shine {
  opacity: 1;
}

/* Image */
.project-3d-image-wrap {
  position: relative;
  flex-shrink: 0;
  height: 245px;
  margin: 10px 10px 0;
  overflow: hidden;
  border-radius: 15px;
  transform: translateZ(24px);
  background: #111827;
}

.project-3d-image {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transition:
    transform 0.65s cubic-bezier(0.2, 0.7, 0.2, 1),
    filter 0.5s ease;
}

.project-3d-card.is-hovered .project-3d-image {
  transform: scale(1.08);
  filter: saturate(1.15);
}

.project-3d-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(2, 6, 23, 0.75),
    transparent 65%
  );
  pointer-events: none;
}

.project-3d-label {
  position: absolute;
  left: 12px;
  bottom: 12px;
  padding: 6px 10px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  backdrop-filter: blur(10px);
  color: #dbeafe;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

/* Details */
.project-3d-details {
  position: relative;
  z-index: 2;
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 20px 20px 18px;
  transform: translateZ(16px);
}

.project-3d-title {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  margin: 0 0 12px;
  color: var(--text, #e5e7eb);
  font-size: 20px;
  font-weight: 800;
  line-height: 1.4;
  overflow-wrap: anywhere;
  transition: color 0.3s ease;
}

.project-3d-card.is-hovered .project-3d-title {
  color: #93c5fd;
}

.project-3d-description {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  min-height: 60px;
  margin: 0 0 16px;
  color: var(--muted, #94a3b8);
  font-size: 13px;
  line-height: 1.65;
}

/* Technology badges */
.project-3d-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  max-height: 78px;
  overflow: hidden;
  margin-bottom: 14px;
}

.project-3d-badge {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 6px 9px;
  overflow: hidden;
  border: 1px solid rgba(96, 165, 250, 0.23);
  border-radius: 8px;
  background: rgba(96, 165, 250, 0.07);
  color: #cbd5e1;
  font-size: 10px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease;
}

.project-3d-card.is-hovered .project-3d-badge {
  border-color: rgba(167, 139, 250, 0.4);
  background: rgba(167, 139, 250, 0.1);
  color: #e9d5ff;
}

/* Footer and button */
.project-3d-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transform: translateZ(22px);
}

.project-3d-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  max-width: 100%;
  padding: 11px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 11px;
  background: linear-gradient(
    110deg,
    #2563eb,
    #0891b2,
    #0d9488
  );
  background-size: 200% 100%;
  color: white;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.2);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background-position 0.4s ease;
}

.project-3d-button:hover {
  transform: translateY(-3px);
  background-position: 100% 0;
  box-shadow: 0 10px 28px rgba(8, 145, 178, 0.3);
}

.project-3d-arrow {
  display: inline-block;
  font-size: 16px;
  transition: transform 0.25s ease;
}

.project-3d-button:hover .project-3d-arrow {
  transform: translate(3px, -3px);
}

.project-3d-number {
  color: rgba(148, 163, 184, 0.6);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
}

.project-3d-private {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

/* Tablet */
@media (max-width: 1024px) {
  .project-3d-wrapper {
    max-width: 100%;
  }

  .project-3d-card {
    height: 580px;
  }

  .project-3d-image-wrap {
    height: 220px;
  }
}

@media (min-width: 1025px) {
  .project-3d-card {
    height: 570px;
  }

  .project-3d-image-wrap {
    height: 190px;
  }

  .project-3d-details {
    padding: 16px 14px;
  }

  .project-3d-title {
    font-size: 17px;
  }

  .project-3d-description {
    font-size: 12px;
  }
}

/* Mobile: disable tilt movement, retain card styling */
@media (max-width: 640px) {
  .project-3d-wrapper {
    max-width: 440px;
    margin-bottom: 20px;
    perspective: none;
  }

  .project-3d-card {
    height: 560px;
    transform: none !important;
  }

  .project-3d-content {
    transform: none;
  }

  .project-3d-image-wrap {
    height: 215px;
    transform: none;
  }

  .project-3d-details {
    padding: 17px 16px 15px;
    transform: none;
  }

  .project-3d-title {
    font-size: 18px;
  }

  .project-3d-description {
    font-size: 12px;
  }

  .project-3d-footer {
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-3d-border {
    animation: none;
  }

  .project-3d-image,
  .project-3d-button {
    transition: none;
  }
}


`}</style>

    </div>
  )
}

export default allprojectspage

const projects = [
  {
    title: "RisbenAI - AI-Powered Career Prepartaion Platform",
    desc: "Built an AI-platform that helps job seekers improve resume quality, identify skill gaps, gain actionable career insights, and plan personalized career growth.",
    tech: ["RAG", "LangChain", "LangGraph", "MERN", "Redis", "Firebase", "Razorpay", "Docker", "Github Actions"],
    image: '/risbenai.png',
    link: "https://risbenai.vercel.app"
  },
  {
    title: "Tools Haven – Tool Renting Platform",
    desc: "Role-based tool-sharing platform with real-time updates & notifications; reduced missed returns by 50% and improved engagement by 70%.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Node.js"],
    image: '/toolshaven.png',
    link: "https://tools-haven.vercel.app/"
  },
  {
    title: "Vehicall",
    desc: "Platform to contact vehicle owners in parking zones via secure DB access and phone integration, cutting retrieval time by 60%.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: '/vehicall.png',
    link: "https://vehicall.infinityfree.me"
  },
  {
    title: "Celebratemate",
    desc: "An event reminder system that sends automated SMS and email notifications for birthdays, anniversaries, and other important events to avoid missing special moments.",
    tech: ["React JS", "Express", "NodeJS", "Postgres"],
    image: '/celebratemate.png',
    link: "https://celebratemate-client.onrender.com/"
  },
  {
    title: "Internshala Automation Tool",
    desc: "Automated internship applications using headless browser scripting, reducing manual effort by 95% and boosting reach by 4x.",
    tech: ["Node.js", "Puppeteer"],
    image: '/internshala.png',
    link: "/internshala"
  },

  {
    title: "CivicLink",
    desc: "Multi-role dashboard to report civic issues (water, garbage, roads), improving complaint resolution efficiency by 40%.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    image: '/civiclink.png',
    link: "https://civiclink1.netlify.app/"
  },
  {
    title: "HR Management System",
    desc: "A web-based HR platform for managing employee data, leaves, and roles efficiently, improving organizational workflows.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: '/hr.png',
    link: "https://github.com/syedrazahussain"
  },

  {
    title: "Smart Time Table for University",
    desc: "An intelligent timetable generator that helps universities optimize class schedules, avoid clashes, and save administrative time.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: '/timetable.png',
    link: "https://syedrazahussain.github.io/time-table/"
  },
  {
    title: "Netflix Clone",
    desc: "A video streaming web app clone of Netflix featuring dynamic movie lists, responsive UI, and simulated playback experience.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: '/netflix.png',
    link: "https://github.com/syedrazahussain/netflix_clone"

  },
  {
    title: "Amazon Clone",
    desc: "An e-commerce website clone of Amazon with product listings, cart functionality, and responsive shopping interface.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: '/amazon.png',
    link: 'https://github.com/syedrazahussain/amazon-clone'
  },
  {
    title: "Movie Ticket Booking App",
    desc: "A React-based application for booking movie tickets online, with showtime selection, seat reservation, and user-friendly design.",
    tech: ["React JS"],
    image: '/moviebooking.png',
    link: 'https://github.com/syedrazahussain/Movie-Ticket-Booking-Web-app'

  }
];
