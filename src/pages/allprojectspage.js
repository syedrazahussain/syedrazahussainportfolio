
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
                <span className="brand"><a href='/'> SYED RAZA HUSSAIN </a></span>
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

function ProjectCard({ proj }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 rounded-[var(--radius)] shadow-xl flex flex-col
                 bg-[var(--panel)] border border-[var(--glass)] 
                 hover:-translate-y-2 hover:shadow-2xl transition duration-300
                 w-full h-[600px] max-w-sm mb-10"
    >
      {/* Project Image */}
      <div className="w-full h-[280px] rounded-[var(--radius)] overflow-hidden mb-4">
        <img
          src={proj.image}
          alt={proj.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-2 text-[var(--text)]">{proj.title}</h3>

      {/* Description */}
      <p className="text-sm text-[var(--muted)] line-clamp-3">{proj.desc}</p>

      {/* Tech Badges */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {proj.tech.map((t, idx) => (
          <span
            key={idx}
            className="px-3 py-1 text-xs rounded-full shadow 
                       bg-[var(--glass)] text-[var(--text)] border border-[var(--brand2)]"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Explore Button */}
      {proj.link && (
        <div className="flex justify-center gap-4 mt-8">
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 
              bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400
              text-white rounded-lg shadow-lg 
              hover:scale-105 hover:shadow-xl 
              transition transform duration-300"
          >
            Explore it
          </a>
        </div>
      )}
    </motion.div>
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
            <Nav />

<main>
            
        {/* PROJECTS */}
<Section id="projects" title={<SectionTitle title="Projects" />} className="!pt-4 !pb-4">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
.grid{
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap:1.5rem;
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
`}</style>

        </div>
    )
}

export default allprojectspage

const projects = [
  {
    title: "Internshala Automation Tool",
    desc: "Automated internship applications using headless browser scripting, reducing manual effort by 95% and boosting reach by 4x.",
    tech: ["Node.js", "Puppeteer"],
    image: '/internshala.png',
    link: "http://localhost:3000/internshala"
  },
  {
    title: "Vehicall",
    desc: "Platform to contact vehicle owners in parking zones via secure DB access and phone integration, cutting retrieval time by 60%.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: '/vehicall.png',
    link: "https://vehicall.great-site.net/"
  },
  {
    title: "CivicLink",
    desc: "Multi-role dashboard to report civic issues (water, garbage, roads), improving complaint resolution efficiency by 40%.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    image: '/civiclink.png',
    link: "https://civiclink1.netlify.app/"
  },
  {
    title: "Tools Haven – Tool Renting Platform",
    desc: "Role-based tool-sharing platform with real-time updates & notifications; reduced missed returns by 50% and improved engagement by 70%.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Node.js"],
    image: '/toolshaven.png',
    link: "https://tools-haven.vercel.app/"
  },
  {
    title: "HR Management System",
    desc: "A web-based HR platform for managing employee data, leaves, and roles efficiently, improving organizational workflows.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: '/hr.png'
  },
  {
    title: "Celebratemate",
    desc: "An event reminder system that sends automated SMS and email notifications for birthdays, anniversaries, and other important events to avoid missing special moments.",
    tech: ["React JS","Express","NodeJS","Postgres"],
    image:'/celebratemate.png',
    link: "https://celebratemate-client.onrender.com/"
  },
  {
    title: "Smart Time Table for University",
    desc: "An intelligent timetable generator that helps universities optimize class schedules, avoid clashes, and save administrative time.",
    tech: ["HTML", "CSS", "JavaScript"],
    image:'/timetable.png',
    link: "https://syedrazahussain.github.io/time-table/"
  },
  {
    title: "Netflix Clone",
    desc: "A video streaming web app clone of Netflix featuring dynamic movie lists, responsive UI, and simulated playback experience.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: '/netflix.png',
    link:"https://github.com/syedrazahussain/netflix_clone"
    
  },
  {
    title: "Amazon Clone",
    desc: "An e-commerce website clone of Amazon with product listings, cart functionality, and responsive shopping interface.",
    tech: ["HTML", "CSS", "JavaScript"],
    image: '/amazon.png',
    link:'https://github.com/syedrazahussain/amazon-clone'
  },
  {
    title: "Movie Ticket Booking App",
    desc: "A React-based application for booking movie tickets online, with showtime selection, seat reservation, and user-friendly design.",
    tech: ["React JS"],
    image: '/moviebooking.png',
    link:'https://github.com/syedrazahussain/Movie-Ticket-Booking-Web-app'
    
  }
];
