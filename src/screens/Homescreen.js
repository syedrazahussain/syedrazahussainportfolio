import React, { useEffect, useRef, useMemo, } from "react";
import { motion,  useInView, } from "framer-motion";

import "../Components/Skills-section/SkillsGraph.css";
import SkillsGraph from "../Components/Skills-section/SkillsGraph";
import { skills } from "../Components/Skills-section/SkillsGraph";

import Experience, { experience } from "../Components/Experience-section/Experience";
import '../Components/Experience-section/Experience.css'

import CertificateBook, { certs } from "../Components/Certificate-section/Certificate";
import '../Components/Certificate-section/Certificate.css'

import ProjectsScene, { projects } from "../Components/Project-section/Project";


import Timeline from "../Components/Education-section/Education";
import '../Components/Education-section/Education.css'

import CardGrid, { achievements } from "../Components/Achievement-section/Achievement";
import '../Components/Achievement-section/Achievement.css'


import Footer from "../Components/Footer-section/Footer";
import '../Components/Footer-section/Footer.css'

import Header from "../Components/Header-section/Header";

import Hero from "../Components/Hero-section/Hero";
import "../Components/Hero-section/Hero.css";







// ==========================
// Particle Background (Canvas)
// ==========================
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

// ==========================
// Helper Components
// ==========================
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







// ==========================
// MAIN EXPORT
// ==========================
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


export default function Portfolio() {
  // ---------- Data (from your resume) ----------
  const contact = {
    name: "SYED RAZA HUSSAIN",
    phone: "+91 8639945414",
    email: "srazahussain123@gmail.com",
    linkedin: "https://linkedin.com/in/syedrazahussain1512",
    github: "https://github.com/syedrazahussain",
    image: "/my_image.jpg"

  };

  const objective = `Software Developer with hands-on project experience in full-stack web development using React.js, Node.js,
Express.js, and MongoDB. Experienced in building REST APIs and integrating AI-powered features using LLMs
and RAG. Eager to apply problem-solving skills and build reliable, scalable software solutions.`;


  return (
    <div className="wrap">
      <ParticleBackground />

        <Header />



    {/* HERO SECTION */}
<Hero contact={contact} objective={objective} />


      <main>
        {/* SKILLS */}
        <Section
          id="skills"
          title={<SectionTitle title="Skills" />}
          className="!pt-4 !pb-4 mt-0"
        >
          <SkillsGraph data={skills} />
        </Section>


        {/* EXPERIENCE */}
        <Section
          id="experience"
          title={<SectionTitle title="Experience" />}
          className="!pt-4 !pb-4"
        >
          <Experience experience={experience} />
        </Section>


        {/* PROJECTS */}
        <Section id="projects" title={<SectionTitle title="Projects" />} className="!pt-4 !pb-4">
          <ProjectsScene projects={projects} />
        </Section>


        {/* EDUCATION */}
        <Section id="education" title={<SectionTitle title="Education" />} className="!pt-4 !pb-4">
          <Timeline />
        </Section>

        {/* ACHIEVEMENTS */}
        <Section
          id="achievements"
          title={<SectionTitle title="Achievements" />}
          className="!pt-4 !pb-4"
        >
          <CardGrid items={achievements} />
        </Section>

        {/* CERTIFICATIONS */}
        <Section id="certifications" title={<SectionTitle title="Certifications" />} className="!pt-4 !pb-4">
          <CertificateBook items={certs} />
        </Section>

      </main>


      {/* Footer */}
      <Footer contact={contact} />
      

      {/* INLINE CSS (no Tailwind) */}
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
    @keyframes dash{0%{stroke-dasharray:10,200; stroke-dashoffset:0} 50%{stroke-dasharray:200,10; stroke-dashoffset:-200} 100%{stroke-dasharray:10,200; stroke-dashoffset:0}}
@keyframes float{0%{transform:translateY(0px) rotate(0deg) scale(1)} 50%{transform:translateY(-10px) rotate(1deg) scale(1.02)} 100%{transform:translateY(0px) rotate(0deg) scale(1)}}
.animate-float{animation:float 5s ease-in-out infinite}
.animated-gradient-text{background:linear-gradient(270deg,var(--brand),var(--brand2),var(--accent),var(--brand)); background-size:600% 600%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:gradient-flow 8s ease infinite}
.animated-gradient-glow{background:linear-gradient(270deg,var(--brand),var(--brand2),var(--accent),var(--brand)); background-size:600% 600%; animation:gradient-flow 8s ease infinite, pulse 4s ease-in-out infinite; border-radius:var(--radius)}
.particles{position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; pointer-events:none; z-index:1}
.particles li{position:absolute; display:block; list-style:none; width:8px; height:8px; background:var(--accent); border-radius:50%; opacity:0.6; animation:floatUp linear infinite}
.particles li:nth-child(1){left:10%; animation-duration:20s; animation-delay:0s}
.particles li:nth-child(2){left:25%; animation-duration:18s; animation-delay:2s}
.particles li:nth-child(3){left:40%; animation-duration:22s; animation-delay:4s}
.particles li:nth-child(4){left:55%; animation-duration:15s; animation-delay:6s}
.particles li:nth-child(5){left:70%; animation-duration:25s; animation-delay:3s}
.particles li:nth-child(6){left:85%; animation-duration:19s; animation-delay:1s}
.particles li:nth-child(7){left:15%; animation-duration:24s; animation-delay:5s}
.particles li:nth-child(8){left:35%; animation-duration:20s; animation-delay:8s}
.particles li:nth-child(9){left:65%; animation-duration:18s; animation-delay:4s}
.particles li:nth-child(10){left:80%; animation-duration:21s; animation-delay:7s}
.particles li:nth-child(11){left:50%; animation-duration:23s; animation-delay:9s}
.particles li:nth-child(12){left:90%; animation-duration:17s; animation-delay:11s}
@keyframes floatUp{0%{transform:translateY(100vh) scale(0.5); opacity:0.4} 50%{opacity:1} 100%{transform:translateY(-10vh) scale(1.2); opacity:0}}
@keyframes gradient-flow{0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}}
@keyframes pulse{0%,100%{opacity:0.7; transform:scale(1)} 50%{opacity:1; transform:scale(1.05)}}
.particles li{position:absolute; display:block; list-style:none; width:8px; height:8px; border-radius:50%; opacity:0.6; animation:floatUp linear infinite, colorShift 6s ease-in-out infinite}
.particles li:nth-child(1){left:10%; animation-duration:20s; animation-delay:0s}
.particles li:nth-child(2){left:25%; animation-duration:18s; animation-delay:2s}
.particles li:nth-child(3){left:40%; animation-duration:22s; animation-delay:4s}
.particles li:nth-child(4){left:55%; animation-duration:15s; animation-delay:6s}
.particles li:nth-child(5){left:70%; animation-duration:25s; animation-delay:3s}
.particles li:nth-child(6){left:85%; animation-duration:19s; animation-delay:1s}
.particles li:nth-child(7){left:15%; animation-duration:24s; animation-delay:5s}
.particles li:nth-child(8){left:35%; animation-duration:20s; animation-delay:8s}
.particles li:nth-child(9){left:65%; animation-duration:18s; animation-delay:4s}
.particles li:nth-child(10){left:80%; animation-duration:21s; animation-delay:7s}
.particles li:nth-child(11){left:50%; animation-duration:23s; animation-delay:9s}
.particles li:nth-child(12){left:90%; animation-duration:17s; animation-delay:11s}
@keyframes colorShift{0%{background:var(--brand)} 33%{background:var(--brand2)} 66%{background:var(--accent)} 100%{background:var(--brand)}}




        *{box-sizing:border-box}
        html,body,#root{height:100%}
        body{margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:var(--text); background:var(--bg);}

        .bgCanvas{position:fixed; inset:0; z-index:-2}

        .wrap{position:relative; min-height:100vh;}




        .ctaRow{display:flex; gap:14px; justify-content:center; margin-top:12px}
        .primaryBtn,.ghostBtn{padding:12px 18px; border-radius:12px; text-decoration:none; font-weight:600}
        .primaryBtn{background:linear-gradient(90deg,var(--brand),var(--brand2)); color:#0b1020; box-shadow:0 10px 20px rgba(96,165,250,0.3)}
        .ghostBtn{border:1px solid rgba(255,255,255,0.18); color:var(--text)}

        // main{max-width:1100px; margin:0 auto}
         main{max-width:100%; padding:100px;}
        .section{margin:60px 0}
        .sectionTitle{font-size: clamp(22px, 3vw, 30px); margin: 90px 0 60px; font-weight:800; letter-spacing:0.3px}
        @media (max-width:860px){
          main{padding:0px;}
        }

        

//  hero section top section grid

        /* Grid responsiveness */
.grid {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) { /* sm: */
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) { /* lg: */
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}


      `}</style>
    </div>
  );
}