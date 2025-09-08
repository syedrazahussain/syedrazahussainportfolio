import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence, useInView, useAnimation, useMotionValue } from "framer-motion";
import ForceGraph2D from 'react-force-graph-2d';

import { ReactTyped } from "react-typed";



import Lottie from "lottie-react";

import coderAnim from "./coder.json";

import * as d3 from "d3-force";
import HTMLFlipBook from "react-pageflip";
import {
  FaPython, FaJava, FaReact, FaNodeJs, FaDatabase, FaGitAlt, FaDocker, FaHtml5,
  FaCss3Alt,
  FaJsSquare,
  FaGithub
} from "react-icons/fa";
import { FaPhone, FaEnvelope, FaLinkedin } from "react-icons/fa";

import { SiC, SiNextdotjs, SiTailwindcss, SiExpress, SiMongodb, SiPostgresql, SiMysql, SiSupabase, SiVercel, SiNetlify, SiRender, SiRailway, SiPostman, SiAnaconda } from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { SiXampp } from "react-icons/si";
import { GiSwampBat } from "react-icons/gi";
import { SiPhp } from "react-icons/si";

function SkillsGraph({ data }) {
  const ref = useRef(null);

  // 👇 Remove "once:true" so inView updates both on enter and exit
  const isInView = useInView(ref, { margin: "-100px" });

  const [activeParent, setActiveParent] = useState(0);
  const [paused, setPaused] = useState(false);
  const isPointerDownRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Detect screen size
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth <= 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // ✅ Auto cycle parents, but only if visible
  useEffect(() => {
    if (paused || !isInView) return;
    const interval = setInterval(() => {
      setActiveParent((prev) => (prev + 1) % data.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [paused, data.length, isInView]);

  // ✅ Pause when scrolled out, resume when back in
  useEffect(() => {
    if (!isInView) {
      setPaused(true);
    } else if (!isPointerDownRef.current) {
      setPaused(false);
    }
  }, [isInView]);

  // ✅ Global release listener (only if visible)
  useEffect(() => {
    if (!isInView) return;
    const handleRelease = () => {
      if (isPointerDownRef.current) {
        isPointerDownRef.current = false;
        setPaused(false);
      }
    };
    window.addEventListener("pointerup", handleRelease);
    window.addEventListener("pointercancel", handleRelease);
    return () => {
      window.removeEventListener("pointerup", handleRelease);
      window.removeEventListener("pointercancel", handleRelease);
    };
  }, [isInView]);

  // === Layout utilities ===
  const arcLayout = (count, radius, cx, cy, startAngle, endAngle) => {
    if (count === 1) {
      return [
        {
          x: cx + radius * Math.cos((startAngle + endAngle) / 2),
          y: cy + radius * Math.sin((startAngle + endAngle) / 2),
        },
      ];
    }
    const step = (endAngle - startAngle) / (count - 1);
    return new Array(count).fill(0).map((_, i) => {
      const angle = startAngle + i * step;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
      };
    });
  };

  const circleLayout = (count, radius, cx, cy) => {
    const step = (2 * Math.PI) / count;
    return new Array(count).fill(0).map((_, i) => {
      const angle = i * step;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        angle,
      };
    });
  };
  // ✅ Dynamic canvas size
  const canvasSize = Math.min(
    isMobile ? window.innerWidth - 40 : 700,
    700
  );

  // ✅ Parent & child radii
  const parentRadius = Math.min(
    isMobile ? 120 : 250,
    canvasSize / 2 - 60
  );

  const childRadius = Math.min(
    isMobile ? 90 : 180,
    canvasSize / 2 - 100
  );

  const childArcSpan = isMobile ? Math.PI / 1.5 : Math.PI;

  // ✅ Step 1: base center
  let center = {
    x: canvasSize / 2,
    y: canvasSize / 2,
  };

  // ✅ Step 2: first cat positions
  let catPositions = circleLayout(data.length, parentRadius, center.x, center.y);

  // ✅ Step 3: adjust center dynamically (mobile only)
  if (isMobile && activeParent !== null) {
    const pos = catPositions[activeParent];
    if (pos.x > canvasSize / 2) {
      center = { ...center, x: center.x - 60 }; // shift left
    }
  }

  // ✅ Step 4: recompute cat positions with new center
  catPositions = circleLayout(data.length, parentRadius, center.x, center.y);


  const handlePointerDown = (parentIndex) => {
    isPointerDownRef.current = true;
    setPaused(true);
    setActiveParent(parentIndex);
  };

  return (
    <div ref={ref}
      className="skillsGraphWrapper"
      style={{
        height: isMobile ? "500px" : "900px",
        width: "100%",
        position: "relative",
        background: "transparent",
        borderRadius: "16px",
        overflow: "hidden",
        marginTop: isMobile ? "-20px" : "-40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="skillsCanvas"
        style={{
          position: "relative",
          width: `${canvasSize}px`,
          height: `${canvasSize}px`,
        }}
      >
        {/* Root */}
        <motion.div
          className="bubble root"
          style={{ left: center.x - 60, top: center.y - 60 }}
        >
          Skills
        </motion.div>
        {data.map((cat, i) => {
          let pos = catPositions[i];
          const isActive = activeParent === i;

          if (isMobile && isActive) {
            // Active parent stays in place
            pos = { ...pos };
          } else if (isMobile && activeParent !== null) {
            // Push ALL non-active parents outward away from the active one
            const activePos = catPositions[activeParent];
            const dx = pos.x - activePos.x;
            const dy = pos.y - activePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Dynamic breathing distance
            const basePush = 60; // increase this for more space
            const extraPush = cat.children ? cat.children.length * 5 : 0;
            const push = basePush + extraPush;

            pos = {
              ...pos,
              x: pos.x + (dx / dist) * push,
              y: pos.y + (dy / dist) * push,
            };
          }


          let startAngle, endAngle;

          if (isMobile) {
            // ✅ Mobile only: dynamic arc expansion
            if (pos.x > center.x + 20) {
              // Right side → expand LEFT (toward center)
              startAngle = Math.PI / 2 + 0.3;       // downward tilt
              endAngle = (3 * Math.PI) / 2 - 0.3;   // upward tilt
            } else if (pos.x < center.x - 20) {
              // Left side → expand RIGHT (toward center)
              startAngle = -Math.PI / 2 - 0.3;
              endAngle = Math.PI / 2 + 0.3;
            } else {
              // Top or Bottom → expand evenly
              startAngle = pos.angle - childArcSpan / 2;
              endAngle = pos.angle + childArcSpan / 2;
            }
          } else {
            // ✅ Desktop/laptop → keep original behavior
            startAngle = pos.angle - childArcSpan / 2;
            endAngle = pos.angle + childArcSpan / 2;
          }


          const childrenPos = isActive
            ? arcLayout(cat.children.length, childRadius, pos.x, pos.y, startAngle, endAngle)
            : [];

          return (
            <React.Fragment key={cat.name}>
              {/* Parent node */}
              <motion.div
                className={`bubble category ${isActive ? "active" : ""}`}
                animate={{ left: pos.x - 40, top: pos.y - 40, scale: isActive ? 1.15 : 1 }}
                transition={{ duration: 0.6 }}
                style={{ position: "absolute" }}
                onPointerDown={() => handlePointerDown(i)}
              >
                {cat.name}
              </motion.div>

              {/* Children */}
              {isActive &&
                cat.children.map((ch, j) => {
                  const cp = childrenPos[j];
                  return (
                    <motion.div
                      key={ch.name}
                      className="bubble skill"
                      style={{
                        left: cp.x - 30,
                        top: cp.y - 30,
                        flexDirection: "column",
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: j * 0.25,
                      }}
                      onPointerDown={() => handlePointerDown(i)}
                    >
                      {ch.icon && (
                        <span style={{ fontSize: "20px", marginBottom: "4px" }}>
                          {ch.icon}
                        </span>
                      )}
                      <span>{ch.name}</span>
                    </motion.div>
                  );
                })}
            </React.Fragment>
          );
        })}


      </div>


      {/* CSS */}
      <style>{`
        .bubble {
          position: absolute;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          font-size: 14px;
          padding: 10px;
          cursor: pointer;
          box-shadow: 0 0 15px rgba(76,175,80,0.4);
          user-select: none;
        }
        .root {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #22c55e, #3b82f6);
          font-size: 18px;
          font-weight: bold;
        }
        .category {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
        }
        .category.active {
          border: 3px solid #22c55e;
        }
        .skill {
          width: 65px;
          height: 65px;
          background:black;
          border: 2px solid #34d399;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .skill span {
          font-size: 11px;
        }

        /* ✅ Only mobile bubble sizing */
        @media (max-width: 768px) {
          .root {
            width: 80px;
            height: 80px;
            font-size: 14px;
          }
          .category {
            width: 60px;
            height: 60px;
            font-size: 12px;
          }
          .skill {
            width: 40px;
            height: 40px;
            font-size: 10px;
          }
          .skill span {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
}


function CertificateBook({ items }) {
  const bookRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const isInView = useInView(containerRef, {
    margin: "-100px", // start before fully visible
  });

  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [pageHeight, setPageHeight] = useState(450);

  // Detect mobile and adjust page height
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      setPageHeight(mobile ? window.innerHeight * 0.8 : 400);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const startAutoFlip = (startPage = 0) => {
    if (!bookRef.current) return;
    const flipBook = bookRef.current.pageFlip?.();
    if (!flipBook) return;

    let page = startPage;
    intervalRef.current = setInterval(() => {
      page++;
      if (page >= items.length) page = 0;
      flipBook.flip(page);
    }, 2500);
  };

  const stopAutoFlip = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ✅ Auto-run only if in view
  useEffect(() => {
    if (isInView && !isPaused) {
      const flipBook = bookRef.current?.pageFlip?.();
      const currentPage = flipBook?.getCurrentPageIndex?.() ?? 0;
      startAutoFlip(currentPage);
    } else {
      stopAutoFlip();
    }

    return () => stopAutoFlip();
  }, [isInView, isPaused]);

  const handlePointerDown = () => {
    stopAutoFlip();
    setIsPaused(true);
  };

  const handlePointerUp = () => {
    if (isPaused && bookRef.current) {
      setIsPaused(false);
      if (isInView) {
        const flipBook = bookRef.current.pageFlip?.();
        if (!flipBook) return;
        const currentPage = flipBook.getCurrentPageIndex();
        startAutoFlip(currentPage);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex justify-center w-full"
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
    >
      <HTMLFlipBook
        width={isMobile ? window.innerWidth * 0.95 : 300}
        height={pageHeight}
        size="stretch"
        minWidth={150}
        maxWidth={500}
        minHeight={300}
        maxHeight={window.innerHeight * 0.9}
        className="demo-book w-full max-w-[95vw] sm:max-w-[500px]"
        showCover={!isMobile}
        ref={bookRef}
        usePortrait={isMobile}
        mobileScrollSupport={true}
        drawShadow={true}
        flipOnTouch={true}
      >
        {items.map((cert, i) => (
          <div
            key={i}
            className="page flex flex-col justify-start items-center p-4 bg-gradient-to-b from-gray-800 to-black rounded-xl shadow-lg"
            style={{
              height: "100%",
              minHeight: pageHeight,
            }}
          >
            <img
              src={cert.image}
              alt={cert.title}
              className="certImg w-full h-auto max-h-[60vh] sm:h-64 object-contain rounded-lg mb-2"
            />
            <h4 className="text-white text-lg font-bold">{cert.title}</h4>
            {cert.subtitle && (
              <p className="text-gray-400 text-sm">{cert.subtitle}</p>
            )}
            <p className="text-gray-200 text-sm mt-1">{cert.desc}</p>
          </div>
        ))}
      </HTMLFlipBook>
    </div>
  );
}



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

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="nav">
      <div className="navLeft">
        <span className="brand">SYED RAZA HUSSAIN </span>
      </div>
      <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="Menu">
        ☰
      </button>
      <ul className={`navLinks ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#achievements">Achievements</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}



// ==========================
// Projects Carousel
// ==========================
function ProjectsScene({ projects = [] }) {
  const containerRef = useRef(null);
  const gridRefs = useRef([]);
  const [landedProjects, setLandedProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [triggered, setTriggered] = useState(false); // trigger animation

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const lottieControls = useAnimation();

  const visibleProjects = projects.slice(0, 4);

  // Get Lottie position for bubbles
  // Get Lottie position for bubbles (from head)
  const getLottieCenter = () => {
    const lottieDiv = containerRef.current?.querySelector(".lottie-wrapper");
    if (!lottieDiv) return { x: 0, y: 0 };

    const rect = lottieDiv.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,      // center horizontally
      y: rect.top - containerRect.top + rect.height * 0.2,     // near top ~ head
    };
  };

  // Trigger animation when section is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered) {
          setTriggered(true); // mark animation triggered
        }
      },
      { threshold: 0.5 } // 50% of section visible
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [triggered]);

  // Animate Lottie, bubbles, and cards when triggered
  // Inside ProjectsScene
  useEffect(() => {
    if (!triggered) return;

    async function releaseBubbles() {
      for (let i = 0; i < visibleProjects.length; i++) {
        if (!gridRefs.current[i]) continue;

        const containerBox = containerRef.current.getBoundingClientRect();
        const targetBox = gridRefs.current[i].getBoundingClientRect();

        const dx = targetBox.left - containerBox.left + targetBox.width / 2;
        const dy = targetBox.top - containerBox.top - 10;

        await lottieControls.start({
          x: dx,
          y: dy,
          transition: { duration: 0.25, ease: "easeInOut" },
        });

        setActiveIndex(i);

        // Wait bubble to reach card before rendering it
        await new Promise((resolve) => {
          const timer = setTimeout(() => {
            setLandedProjects((prev) => [...prev, visibleProjects[i]]);
            resolve();
          }, 1200); // match BubbleFromScreen animation duration
        });

        await new Promise((res) => setTimeout(res, 200)); // optional small delay
      }

      await lottieControls.start({
        opacity: 0,
        scale: 0.9,
        transition: { duration: 0.5 },
      });
    }

    releaseBubbles();
  }, [triggered]);


  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Lottie */}
      <motion.div
        animate={lottieControls}
        style={{ x, y, rotate, originX: 0.5, originY: 0.5 }}
        className="lottie-wrapper absolute top-0 z-50 w-48"
        ref={(el) => {
          if (el && gridRefs.current[0]) {
            const firstCard = gridRefs.current[0].getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            x.set(firstCard.left - containerRect.left + firstCard.width / 2 - firstCard.width / 2);
            y.set(firstCard.top - containerRect.top - 20);
          }
        }}
      >
        <Lottie animationData={coderAnim} loop style={{ width: "100%", height: "auto" }} />
      </motion.div>

      {/* Bubble */}
      {activeIndex >= 0 && (
        <BubbleFromScreen
          key={activeIndex}
          project={visibleProjects[activeIndex]}
          containerRef={containerRef}
          targetRef={() => gridRefs.current[activeIndex]}
          getSpawn={getLottieCenter}
        />
      )}

      {/* Cards */}
      <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
        {visibleProjects.map((proj, i) => (
          <div key={i} ref={(el) => (gridRefs.current[i] = el)} className="min-h-[250px]">
            {landedProjects.find((lp) => lp.title === proj.title) && <ProjectCard proj={proj} />}

          </div>

        ))}

      </div>

      {/* CTA */}
      {triggered && landedProjects.length === visibleProjects.length && (
        <div className="flex justify-center mt-8">
          <a href='/allprojectspage'

            className=" px-6 py-3 
  bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
  text-white rounded-lg shadow-lg 
  hover:scale-105 hover:shadow-xl 
  transition transform duration-300"

          >
            View More Projects
          </a>
        </div>
      )}
    </div>
  );
}


function BubbleFromScreen({ project, containerRef, targetRef, getSpawn }) {
  const controls = useAnimation();

  useEffect(() => {
    async function animate() {
      if (!containerRef.current || !targetRef()) return;

      const containerBox = containerRef.current.getBoundingClientRect();
      const targetBox = targetRef().getBoundingClientRect();

      // Spawn at Lottie screen
      const spawn = getSpawn();
      const startX = spawn.x;
      const startY = spawn.y;

      // Target card center
      const targetX = targetBox.left - containerBox.left + targetBox.width / 2;
      const targetY = targetBox.top - containerBox.top + targetBox.height / 2;

      const duration = 1.2;

      // Random arc for natural throw
      const arcHeight = 8 + Math.random() * 12; // lower arc, so bubble starts near card

      const horizontalOffset = (Math.random() - 0.5) * 40;
      const midX = (startX + targetX) / 2 + horizontalOffset;
      const midY = Math.min(startY, targetY) - arcHeight;

      const rotateStart = (Math.random() - 0.5) * 30;
      const rotateEnd = (Math.random() - 0.5) * 30;

      // Animate bubble toward card
      await controls.start({
        top: [startY, midY, targetY],
        left: [startX, midX, targetX],
        rotate: [rotateStart, rotateEnd, 0],
        scale: [1.2, 1.3, 1],
        borderRadius: ["50%", "50%", "1rem"],
        opacity: [0, 1, 1],
        transition: { duration, ease: "easeInOut" },
      });

      // Landing animation: shrink and fade
      await controls.start({
        scale: 0,
        opacity: 0,
        transition: { duration: 0.4, ease: "easeInOut" },
      });
    }

    animate();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.2, rotate: 0 }}
      animate={controls}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
      }}
      className="w-10 h-10 bg-gradient-to-tr from-[var(--brand)] to-[var(--brand2)] shadow-xl"
    />
  );
} function ProjectCard({ proj }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="
        p-6 rounded-[var(--radius)] shadow-xl flex flex-col
        bg-[var(--panel)] border border-[var(--glass)] 
        hover:-translate-y-2 hover:shadow-2xl transition duration-300
        w-full max-w-sm h-[600px] 
        sm:h-auto sm:p-4
      "
    >
      {/* Project Image */}
      <div className="w-full h-[280px] sm:h-[200px] rounded-[var(--radius)] overflow-hidden mb-4">
        <img
          src={proj.image}
          alt={proj.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <h3 className="text-lg sm:text-base font-bold mb-2 text-[var(--text)]">
        {proj.title}
      </h3>

      {/* Description */}
      <p className="text-sm sm:text-xs text-[var(--muted)] line-clamp-3">
        {proj.desc}
      </p>

      {/* Tech Badges */}
      <div className="flex flex-wrap gap-2 mt-auto sm:mt-4">
        {proj.tech.map((t, idx) => (
          <span
            key={idx}
            className="px-3 py-1 sm:px-2 sm:py-0.5 text-xs rounded-full shadow 
                       bg-[var(--glass)] text-[var(--text)] border border-[var(--brand2)]"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Explore Button */}
      {proj.link && (
        <div className="flex justify-center gap-4 mt-8 sm:mt-4">
          <a
            href={proj.link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 sm:px-4 sm:py-2
              bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-400
              text-white rounded-lg shadow-lg 
              hover:scale-105 hover:shadow-xl 
              transition transform duration-300 text-sm sm:text-xs"
          >
            Explore it
          </a>
        </div>
      )}
    </motion.div>
  );
}






// ==========================
// Timeline (Education)
// ==========================

const education = [
  {
    title: "B.Tech in Computer Science | CGPA: 9.57 / 10 (Expected 2026)",
    place: "B.E.S.T Innovation University, Gorantla",
    year: "2022 – 2026",
    desc: "Coursework & labs across DSA, DBMS, Web, and Systems.",
  },
  {
    title: "Intermediate (MPC) | 88%",
    place: "R.K Junior College, Machilipatnam",
    year: "2020 – 2022",
    desc: "Maths, Physics, Chemistry.",
  },
  {
    title: "SSC | 586 / 600",
    place: "Nirmala High School, Machilipatnam",
    year: "2019 – 2020",
    desc: "General Science & Mathematics.",
  },
];
function Timeline() {
  const ref = useRef(null);


  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -30% 0px",
  });

  return (
    <div className="timeline" ref={ref}>
      {education.map((item, i) => (
        <motion.div
          key={i}
          className="scrollItem"
          initial={{ rotateY: -150, scaleX: 0.1, opacity: 0 }}
          animate={
            isInView
              ? { rotateY: 0, scaleX: 1, opacity: 1 }
              : {}
          }
          transition={{
            duration: 3,
            delay: i * 1,
            ease: [0.68, -0.55, 0.27, 1.55],
          }}
        >
          {/* Rod */}
          <motion.div
            className="scrollRod"
            initial={{ rotateZ: -180 }}
            animate={isInView ? { rotateZ: 0 } : {}}
            transition={{
              duration: 5,
              delay: i * 1,
              ease: [0.68, -0.55, 0.27, 1.55],
            }}
          />

          {/* Folding shadow */}
          <motion.div
            className="scrollShadow"
            initial={{ rotateY: -150 }}
            animate={isInView ? { rotateY: 0 } : {}}
            transition={{ duration: 5, delay: i * 1, ease: "easeOut" }}
          />

          {/* Highlight */}
          <motion.div
            className="scrollHighlight"
            initial={{ rotateY: -150 }}
            animate={isInView ? { rotateY: 0 } : {}}
            transition={{ duration: 5, delay: i * 1, ease: "easeOut" }}
          />

          {/* Content */}
          <div className="scrollContent">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="muted">
              {item.place} • {item.year}
            </p>
            <p>{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ==========================
// Cards Grid (Achievements / Certs)
// ==========================

function CardGrid({ items }) {
  const [popupItem, setPopupItem] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartRef = useRef({ x: 0, y: 0 });

  const hoverTimeout = useRef(null);
  const sectionRef = useRef(null);

  // responsive mobile check for in-view thresholds
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // tuned thresholds for mobile vs desktop
  const isInView = useInView(sectionRef, {
    margin: isMobile ? "-30px 0px -30px 0px" : "-100px 0px -100px 0px",
    amount: isMobile ? 0.15 : 0.6,
  });

  useEffect(() => {
    return () => clearTimeout(hoverTimeout.current);
  }, []);

  const popupImages = [
    "/newspaper.jpg",
    "/enlight_certificate.jpg",
    "/Awsomeonlineconferencecertificate.png",
  ];

  const descriptionforpopup = [
    "I came in the newspaper for excellent debugging skills and won 2nd prize. Over 30+ colleges participated in this competition.",
    "Participated in the Enlight Degree College quiz competition and showcased problem-solving and analytical skills.",
    "Successfully completed the AWS Awesome Online Conference 2025, gaining hands-on experience and deepening cloud computing knowledge.",
  ];

  useEffect(() => {
    let scrollTimeout;
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150); // 150ms after stop
    };
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const handleMouseEnter = (item, index) => {
    if (isScrolling) return; // 🚫 don't trigger popup while scrolling
    clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => {
      setPopupItem({
        ...item,
        image: popupImages[index],
        desc: descriptionforpopup[index],
      });
    }, 1200); // optional: make it faster than 3s
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
  };
  const handleClick = (item, index) => {
    clearTimeout(hoverTimeout.current);
    setPopupItem({
      ...item,
      image: popupImages[index],
      desc: descriptionforpopup[index],
    });
  };

  const handleTouchStart = (e) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e, item, index) => {
    const t = e.changedTouches[0];
    const dx = Math.abs(t.clientX - touchStartRef.current.x);
    const dy = Math.abs(t.clientY - touchStartRef.current.y);

    // treat as tap only if finger didn’t move much
    if (dx < 10 && dy < 10) {
      setPopupItem({
        ...item,
        image: popupImages[index],
        desc: descriptionforpopup[index],
      });
    }
  };

  return (
    <div ref={sectionRef} className="relative flex flex-col items-center w-full">
      {/* Horizontal Stick */}
      <div className="relative w-full mb-12">
        <div className="relative h-[15px] w-full rounded-full overflow-hidden">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, var(--brand) 0%, var(--brand2) 50%, var(--accent) 100%)`,
              boxShadow: `inset 0 1px 3px rgba(255,255,255,0.25),
                          inset 0 -2px 4px rgba(0,0,0,0.6),
                          var(--shadow)`,
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0))",
              mixBlendMode: "overlay",
            }}
          />
          <div
            className="absolute -left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, white, var(--brand))",
              boxShadow: "0 0 15px var(--brand)",
            }}
          />
          <div
            className="absolute -right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full"
            style={{
              background: "radial-gradient(circle at 70% 70%, white, var(--brand2))",
              boxShadow: "0 0 15px var(--brand2)",
            }}
          />
          <div
            className="absolute -bottom-3 left-4 right-4 h-4 blur-xl rounded-full"
            style={{
              background: "radial-gradient(ellipse, var(--brand2), transparent 70%)",
              opacity: 0.5,
            }}
          />

          {/* shimmer - remount on isInView for reliable stop */}
          <motion.div
            key={`shimmer-${isInView ? "run" : "stop"}`}
            className="absolute inset-y-0 w-1/3 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)",
              mixBlendMode: "screen",
            }}
            initial={{ x: "-35%" }}
            animate={isInView ? { x: ["-35%", "135%"] } : { x: "-35%" }}
            transition={{
              duration: isInView ? 3 : 0,
              repeat: isInView ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full px-8 relative">
        {items.map((it, i) => (
          <motion.div
            key={i}
            className="relative flex flex-col items-center w-full cursor-pointer"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            viewport={{ once: true }}
            onMouseEnter={() => handleMouseEnter(it, i)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => handleTouchEnd(e, it, i)}
            onClick={() => handleClick(it, i)} // desktop clicks
          >

            <div className="relative flex flex-col items-center">
              {/* Chain (behind card) */}
              <div className="absolute -top-20 flex flex-col items-center pointer-events-none z-0">
                <div
                  className="w-4 h-4 rounded-full mb-[-2px]"
                  style={{
                    background: "radial-gradient(circle, var(--brand), white)",
                    boxShadow: "0 0 8px var(--brand)",
                  }}
                />
                <div className="flex flex-col items-center space-y-[-18px]">
                  {[...Array(10)].map((_, idx) => (
                    <motion.div
                      key={`link-${idx}-${isInView ? "run" : "stop"}`}
                      className="relative w-6 h-10 rounded-full overflow-hidden"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, #fff, #d1d5db 25%, #a1a1aa 60%, #3f3f46 100%)`,
                        boxShadow: `inset -2px -2px 4px rgba(255,255,255,0.7),
                                    inset 3px 3px 6px rgba(0,0,0,0.8),
                                    0 0 15px rgba(255,255,255,0.6)`,
                        transform: `rotate(${idx % 2 === 0 ? "90deg" : "0deg"})`,
                      }}
                      initial={{ y: 0 }}
                      animate={isInView ? { y: [0, 2, -2, 0] } : { y: 0 }}
                      transition={{
                        duration: isInView ? 3 : 0,
                        repeat: isInView ? Infinity : 0,
                        ease: "easeInOut",
                        delay: isInView ? idx * 0.08 : 0,
                      }}
                    >
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{
                          background: "var(--bg)",
                          boxShadow: "inset 0 0 6px rgba(0,0,0,0.8)",
                        }}
                      />
                      <motion.div
                        key={`shine-${idx}-${isInView ? "run" : "stop"}`}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(120deg, rgba(255,255,255,0.9), transparent 70%)",
                          mixBlendMode: "overlay",
                        }}
                        initial={{ x: "-100%" }}
                        animate={isInView ? { x: ["-100%", "100%"] } : { x: "-100%" }}
                        transition={{
                          duration: isInView ? 2.2 : 0,
                          repeat: isInView ? Infinity : 0,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Polygon Card (in front) */}
              <motion.div
                key={`poly-wrap-${isInView ? "run" : "stop"}`}
                animate={
                  isInView
                    ? { y: [0, -12, 0, 12, 0], rotateY: [-6, 6, -6] }
                    : { y: 0, rotateY: 0 }
                }
                transition={{
                  duration: isInView ? 4 : 0,
                  repeat: isInView ? Infinity : 0,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.06,
                  rotate: 1,
                  // ✅ restore glowing white effect
                  filter: "drop-shadow(0 0 20px white) drop-shadow(0 0 40px white)",
                }}
                style={{ perspective: "1000px", zIndex: 10 }}
              >
                <motion.div
                  key={`poly-inner-${isInView ? "run" : "stop"}-${i}`}
                  animate={isInView ? { rotateY: [-5, 5, -5] } : { rotateY: 0 }}
                  transition={{
                    duration: isInView ? 2 : 0,
                    repeat: isInView ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                  className="relative flex flex-col items-center justify-center text-center p-4 sm:p-6 overflow-hidden"
                  style={{
                    clipPath:
                      "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    maxWidth: "450px",
                    backgroundColor: "black",
                    zIndex: 10,
                  }}
                >
                  {/* blurred background image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${it.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(20px) brightness(0.6)",
                      transform: "scale(1.2)",
                    }}
                  />
                  {/* centered clear image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${it.image})`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                  {/* dark overlay */}
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath:
                        "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
                      background: "rgba(0,0,0,0.44)",
                    }}
                  />
                  <div className="relative z-20 flex flex-col items-center text-white px-6">
                    <h4 className="font-bold text-2xl mb-2 drop-shadow-lg">{it.title}</h4>
                    <p className="text-base opacity-90">{it.desc}</p>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </motion.div>
        ))}
      </div>

      {/* Popup */}
      <AnimatePresence>
        {popupItem && (
          <motion.div
            key="popup"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupItem(null)}
          >
            <motion.div
              className="bg-black rounded-xl shadow-2xl p-3 sm:p-6 w-full max-w-full sm:max-w-2xl flex flex-col items-center space-y-3 sm:space-y-6 overflow-y-auto max-h-[90vh]"
              style={{ maxWidth: "100vw" }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={popupItem.image}
                alt={popupItem.title}
                className="w-full max-h-[40vh] sm:max-h-[60vh] object-contain rounded-lg"
              />
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold text-white mt-2 text-center break-words">
                {popupItem.title}
              </h3>
              <p className="text-white/90 text-sm sm:text-base md:text-lg text-center px-2 break-words">
                {popupItem.desc}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

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

  const objective = `Aspiring software professional with a strong foundation in computer science and a keen interest in solving real-world problems through technology. Seeking an opportunity to contribute to impactful projects, grow through hands-on experience, and collaborate within a forward-thinking development team.`;

  const experience = [
    {
      role: "Full Stack Developer",
      company: "Scuts Technologies Pvt. Ltd.",
      location: "Bangalore, India",
      period: "Sep 2024 – Mar 2025",
      bullets: [
        "Developed and deployed scalable RESTful APIs, improving data transaction speed by 30%.",
        "Enhanced UI responsiveness and accessibility across devices, boosting user engagement by 25%.",
        "Optimized backend queries in PostgreSQL, reducing page load time by 40%.",
        "Collaborated with cross-functional team to deliver 5+ major features within strict deadlines.",
        "Resolved critical bugs during on-site deployment, increasing platform reliability.",
      ],
    },
  ];

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
    }
  ];


  const skills = [
    {
      name: "Programming Languages",
      children: [
        { name: "Python", icon: <FaPython /> },
        { name: "C Lang", icon: <SiC /> },
        { name: "Java", icon: <FaJava /> },
      ],
    },
    {
      name: "Frontend / Frameworks",
      children: [
        { name: "React", icon: <FaReact /> },
        { name: "Next.js", icon: <SiNextdotjs /> },
        { name: "HTML5", icon: <FaHtml5 /> },
        { name: "CSS3", icon: <FaCss3Alt /> },
        { name: "JavaScript", icon: <FaJsSquare /> },
        { name: "Tailwind CSS", icon: <SiTailwindcss /> },
      ],
    },
    {
      name: "Backend / Frameworks",
      children: [
        { name: "Node.js", icon: <FaNodeJs /> },
        { name: "Express.js", icon: <SiExpress /> },
        { name: "Php", icon: <SiPhp /> },
      ],
    },
    {
      name: "Databases",
      children: [
        { name: "MySQL", icon: <SiMysql /> },
        { name: "PostgreSQL", icon: <SiPostgresql /> },
        { name: "MongoDB", icon: <SiMongodb /> },
        { name: "Supabase", icon: <SiSupabase /> },
      ],
    },
    {
      name: "Developer Tools",
      children: [
        { name: "Git", icon: <FaGitAlt /> },
        { name: "GitHub", icon: <FaGithub /> },
        { name: "VS Code", icon: <VscVscode /> },
        { name: "Postman", icon: <SiPostman /> },
        { name: "Anaconda", icon: <SiAnaconda /> },
        { name: "Docker", icon: <FaDocker /> },
        { name: "Xampp", icon: <SiXampp /> },
        { name: "Wamp", icon: <GiSwampBat /> },
      ],
    },
    {
      name: "Deployment",
      children: [
        { name: "Vercel", icon: <SiVercel /> },
        { name: "Netlify", icon: <SiNetlify /> },
        { name: "Render", icon: <SiRender /> },
        { name: "Railway", icon: <SiRailway /> },
      ],
    },
  ];



  const achievements = [
    { title: "2nd place – Code Debugging (Utkarsh 2K25)", desc: "Among participants from 30+ colleges.", image: '/debuggingprize.jpg' },
    { title: "Finalist – Tech Quiz (Enlight Degree College)", desc: "Tested on DBMS, Web, C, and Python.", image: '/enlightprize.jpg' },
    { title: "Participant – AWSome Day Online Conference", desc: "Explored AWS cloud services & infrastructure.", image: '/awsbackground_image.jpg' },
  ];

  const certs = [
    { title: "MERN Stack Advanced", subtitle: "Infosys", desc: "Advanced MERN concepts and project work.", image: '/Infosys_certified_mern_stack-1.png' },
    { title: "Python Programming", subtitle: "Kaggle", desc: "Hands-on notebooks and challenges.", image: '/kaggle_python.png' },
    { title: "SQL", subtitle: "LetsUpgrade", desc: "Relational queries & optimization basics.", image: '/SQL_bootcamp_certificate-1.png' },
    { title: "Introduction To Generative AI", subtitle: "SimpliLearn(Google Cloud)", desc: "Overview of ai, algorithms, concepts", image: '/google_cloud-1.png' },
    { title: "Postman API Fundamentals", subtitle: "Postman", desc: "API design, testing, and collections.", image: '/postman_api_certificate-1.png' },
    { title: "Databases for Developers", subtitle: "Oracle Dev Gym", desc: "PL/SQL and design patterns.", image: '/Oracle_database_for_developers-1.png' },
    { title: "Mern stack fundamental", subtitle: "Great Learning", desc: "Covered basic fundamentals.", image: '/Great_learning_mern_certificate_1.png' },
    { title: "Node JS", subtitle: "LetsUpgrade", desc: "Creating server,http,making REST Api's", image: '/Nodejs_certificate-1.png' },
    { title: "Typing speed", subtitle: "TypeDojo", desc: "I Typed 68 words/min with 93%", image: '/Type_Dojo_User_Certificate-1.png' },

  ];

  return (
    <div className="wrap">
      <ParticleBackground />

      <Nav />

      {/* HERO */}

      <header
        className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--bg)" }}
      >
        {/* Background Glows */}
        <div
          className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"
          style={{ background: "var(--brand)" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full blur-3xl opacity-30 translate-x-1/4 sm:translate-x-1/3 translate-y-1/4 sm:translate-y-1/3"
          style={{ background: "var(--brand2)" }}
        ></div>

        {/* Floating Particles */}
        <ul className="particles hidden sm:block">
          {Array.from({ length: 12 }).map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-12 flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 min-h-screen">
          {/* Left Content */}
          <motion.div
            className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight"
              style={{ color: "var(--text)" }}
            >
              Hi, I’m{" "}
              <span className="animated-gradient-text">{contact.name}</span>
            </h1>

            <ReactTyped
              strings={[
                `<span style="color: var(--brand)">Full-Stack Developer</span>`,
                `<span style="color: var(--brand2)">Software Developer</span>`,
                `<span style="color: var(--accent)">Web Developer</span>`,
                `<span style="color: pink">MERN-Stack Developer</span>`,
                `<span style="color: var(--text)">Problem Solver 🚀</span>`
              ]}
              typeSpeed={60}
              backSpeed={40}
              backDelay={1500}
              loop
              className="text-base sm:text-lg md:text-xl font-medium tracking-wide"
              style={{ color: "var(--muted)" }}
              smartBackspace
            />

            <motion.p
              className="max-w-lg mx-auto lg:mx-0 text-sm sm:text-base"
              style={{ color: "var(--text)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {objective}
            </motion.p>

            {/* Contact Row */}
            <div className="contactGrid mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-[1000px] mx-auto">
  {[
    { icon: <FaPhone />, label: "Phone", value: contact.phone, href: `tel:${contact.phone}` },
    { icon: <FaEnvelope />, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    { icon: <FaLinkedin />, label: "LinkedIn", value: "/syedrazahussain1512", href: contact.linkedin },
    { icon: <FaGithub />, label: "GitHub", value: "/syedrazahussain", href: contact.github },
  ].map((c, i) => (
    <a
      key={i}
      href={c.href}
      target={c.href.startsWith("http") ? "_blank" : "_self"}
      rel={c.href.startsWith("http") ? "noreferrer" : ""}
      className="contactCard flex items-start p-6 bg-[var(--panel)] rounded-xl shadow-lg hover:scale-105 transition-transform w-full min-w-[280px] break-words"
      style={{ minHeight: "120px" }}
    >
      <span className="icon text-[var(--brand)] text-3xl flex-shrink-0">{c.icon}</span>
      <div className="ml-5 flex flex-col min-w-0 break-words">
        <p className="label text-base text-[var(--text)] font-medium">{c.label}</p>
        <p className="text-[var(--text)] text-lg break-words">{c.value}</p>
      </div>
    </a>
  ))}
</div>


            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="#projects"
                className="primaryBtn px-5 py-2 sm:px-6 sm:py-3 bg-[var(--brand)] text-white rounded-lg shadow-lg hover:scale-105 transition transform text-sm sm:text-base"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-5 py-2 sm:px-6 sm:py-3 font-semibold rounded-xl transition text-sm sm:text-base"
                style={{
                  border: "1px solid var(--muted)",
                  color: "var(--text)",
                }}
              >
                Contact Me
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            className="flex-1 flex justify-center lg:justify-end relative"
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative">
              {/* Animated Gradient Glow */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-[var(--radius)] blur-2xl sm:blur-3xl opacity-80 animated-gradient-glow"></div>

              {/* Profile Image */}
              <img
                src={contact.image}
                alt={contact.name}
                className="relative object-cover w-[220px] h-[320px] sm:w-[300px] sm:h-[450px] md:w-[400px] md:h-[600px]"
                style={{
                  borderRadius: "var(--radius)",
                  boxShadow: "var(--shadow)",
                  border: "4px solid var(--panel)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </header>

      <main>
        {/* SKILLS */}
        <Section id="skills" title={<SectionTitle title="Skills" />} className="!pt-4 !pb-4 mt-0">
          <SkillsGraph data={skills} />
        </Section>


        {/* EXPERIENCE */}
        <Section id="experience" title={<SectionTitle title="Experience" />} className="!pt-4 !pb-4">
          {experience.map((ex, i) => (
            <motion.div key={i} className="expCard" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="expHeader">
                <h3>{ex.role}</h3>
                <span className="muted">{ex.company} • {ex.location}</span>
                <span className="period">{ex.period}</span>
              </div>
              <ul className="bullets">
                {ex.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </Section>



        {/* PROJECTS */}
        <Section id="projects" title={<SectionTitle title="Projects" />} className="!pt-4 !pb-4">
          <ProjectsScene projects={projects} />
        </Section>


        {/* EDUCATION */}
        <Section id="education" title={<SectionTitle title="Education" />} className="!pt-4 !pb-4">
          <Timeline items={education} />
        </Section>

        {/* ACHIEVEMENTS */}
        <Section id="achievements" title={<SectionTitle title="Achievements" />} className="!pt-4 !pb-4">
          <CardGrid items={achievements} />
        </Section>
        {/* CERTIFICATIONS */}
        <Section id="certifications" title={<SectionTitle title="Certifications" />} className="!pt-4 !pb-4">
          <CertificateBook items={certs} />
        </Section>



      </main>

      {/* CONTACT */}
      <footer
        id="contact"
        className="w-full px-6 py-12 bg-[var(--panel)] text-[var(--text)] relative overflow-hidden"
      >
        {/* Glow accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-[var(--brand)] opacity-20 blur-[200px]" />
          <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[var(--accent)] opacity-10 blur-[160px]" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold tracking-wide mb-2">
            Get in touch
          </h3>
          <p className="text-[var(--muted)] text-base md:text-lg mb-6">
            Have an opportunity or collaboration in mind? Let’s talk.
          </p>

          {/* Contact row */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8">
            <a
              href={`tel:${contact.phone}`}
              className="chip flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass)] hover:bg-[var(--brand)] hover:text-white transition-all duration-300 backdrop-blur-md shadow-md text-sm md:text-base"
            >
              📞 {contact.phone}
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="chip flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass)] hover:bg-[var(--brand2)] hover:text-white transition-all duration-300 backdrop-blur-md shadow-md text-sm md:text-base"
            >
              ✉️ {contact.email}
            </a>
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noreferrer"
              className="chip flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass)] hover:bg-[var(--accent)] hover:text-white transition-all duration-300 backdrop-blur-md shadow-md text-sm md:text-base"
            >
              <FaLinkedin className="text-lg" /> LinkedIn
            </a>
            <a
              href={contact.github}
              target="_blank"
              rel="noreferrer"
              className="chip flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--glass)] hover:bg-[var(--brand)] hover:text-white transition-all duration-300 backdrop-blur-md shadow-md text-sm md:text-base"
            >
              <FaGithub className="text-lg" /> GitHub
            </a>
          </div>

          {/* Bottom line */}
          <p className="tiny text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} {contact.name}. All rights reserved.
          </p>
        </div>
      </footer>

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

/* === Contact Grid === */
.contactGrid {
  display: grid;
  grid-template-columns: 1fr; /* mobile single column */
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px; /* ensure enough space for 2 columns */
  margin: 0 auto;
}

.contactCard {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: var(--panel);
  padding: 1.5rem;
  border-radius: var(--radius);
  color: var(--text);
  box-shadow: var(--shadow);
  transition: all 0.35s ease;
  position: relative;
  overflow: visible; /* allow shadows */
  min-width: 280px; /* prevent text clipping */
  break-words: break-word;
}

.contactCard::before{content:""; position:absolute; inset:-2px; border-radius:inherit; background:linear-gradient(120deg, var(--brand), var(--brand2), var(--accent)); opacity:0; transition:opacity 0.4s ease; z-index:0}
.contactCard:hover::before{opacity:1; animation:gradient-flow 6s linear infinite}
.contactCard:hover{transform:translateY(-4px) scale(1.02)}
.contactCard .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--panel);
  box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
  font-size: 1.3rem;
  z-index: 1;
  transition: all 0.3s ease;
}
.contactCard:hover .icon{box-shadow:0 0 25px rgba(167, 139, 250, 0.8), 0 0 40px rgba(52, 211, 153, 0.7)}
.contactCard .label{font-size:0.85rem; color:var(--muted); margin-bottom:0.2rem}
.contactCard p{margin:0; font-size:1rem; z-index:1; position:relative}
.typed-cursor{color:var(--brand2); font-weight:bold; animation:blink 1s infinite}
@keyframes blink{50%{opacity:0}}
@media (max-width: 640px) {
  .contactGrid {
    grid-template-columns: 1fr; /* 1 column on mobile */
  }
}


        *{box-sizing:border-box}
        html,body,#root{height:100%}
        body{margin:0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color:var(--text); background:var(--bg);}

        .bgCanvas{position:fixed; inset:0; z-index:-2}

        .wrap{position:relative; min-height:100vh;}

        .nav{position:sticky; top:0; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:14px 22px; backdrop-filter: blur(10px); background: linear-gradient( to right, rgba(17,24,39,0.6), rgba(2,6,23,0.35)); border-bottom:1px solid rgba(255,255,255,0.06)}
        .brand{font-weight:700; letter-spacing:0.3px; background:linear-gradient(90deg,var(--brand),var(--brand2)); -webkit-background-clip:text; background-clip:text; color:transparent}
        .navLinks{display:flex; gap:18px; list-style:none; margin:0; padding:0}
        .navLinks a{color:var(--text); text-decoration:none; font-size:0.95rem; opacity:0.9}
        .navLinks a:hover{color:white}
        .menuBtn{display:none; font-size:22px; color:var(--text); background:none; border:none}
        @media (max-width:860px){
          .menuBtn{display:block}
          .navLinks{position:absolute; right:12px; top:58px; flex-direction:column; background:rgba(15,23,42,0.95); padding:12px; border:1px solid rgba(255,255,255,0.06); border-radius:12px; display:none}
          .navLinks.open{display:flex}
        }

  
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

        
/* Experience */
.expCard {
  background: linear-gradient(180deg, rgba(96,165,250,0.06), rgba(2,6,23,0.2));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 18px 18px 6px;
  box-shadow: var(--shadow);
  margin-bottom: 16px; /* spacing between cards */
}

.expHeader {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  align-items: baseline;
}

.expHeader h3 {
  font-size: 1.125rem; /* 18px default */
  font-weight: 600;
  line-height: 1.3;
}

.muted {
  color: #94a3b8;
  font-size: 0.9rem;
}

.period {
  margin-left: auto;
  color: #c7d2fe;
  font-size: 0.9rem;
}

.bullets {
  margin: 10px 0 8px 18px;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* ✅ Mobile tweaks */
@media (max-width: 768px) {
  .expCard {
    padding: 14px 14px 4px;
  }

  .expHeader {
    flex-direction: column; /* stack role, company, and period */
    align-items: flex-start;
    gap: 4px;
  }

  .expHeader h3 {
    font-size: 1rem; /* smaller title */
  }

  .muted,
  .period {
    font-size: 0.85rem;
  }

  .period {
    margin-left: 0; /* no auto push, just below company */
    color: #a5b4fc;
  }

  .bullets {
    margin-left: 14px; /* reduce indent */
    font-size: 0.85rem;
  }
}

/* ✅ Extra-small phones (like 360px wide) */
@media (max-width: 400px) {
  .expCard {
    padding: 12px;
    border-radius: 12px;
  }

  .expHeader h3 {
    font-size: 0.95rem;
  }

  .muted,
  .period,
  .bullets {
    font-size: 0.8rem;
  }
}


       /* Timeline */
.timeline {
  position: relative;
  padding-left: 26px;
}

.timeline:before {
  content: "";
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(transparent, var(--brand), transparent);
}

/* Each item */
.tItem {
  position: relative;
  margin: 0 0 22px;
}

/* Dot */
.tDot {
  position: absolute;
  left: 4px;
  top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.25);
}

/* Content */
.tContent {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 8px 18px rgba(2, 6, 23, 0.35);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* ✅ Responsive Adjustments */
@media (max-width: 768px) {
  .timeline {
    padding-left: 18px; /* reduce left padding */
  }

  .timeline:before {
    left: 6px; /* move vertical line closer */
  }

  .tDot {
    left: 0;
    width: 10px;
    height: 10px;
    box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.25);
  }

  .tContent {
    padding: 10px 12px;
    font-size: 0.85rem;
  }

  .tContent h3 {
    font-size: 1rem;
  }

  .tContent p {
    font-size: 0.8rem;
  }
}

@media (max-width: 400px) {
  .timeline {
    padding-left: 14px;
  }

  .timeline:before {
    left: 4px;
  }

  .tDot {
    width: 8px;
    height: 8px;
    top: 4px;
  }

  .tContent {
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
  }

  .tContent h3 {
    font-size: 0.9rem;
  }

  .tContent p {
    font-size: 0.75rem;
  }
}

        /* Card Grid */
        .cardGrid{display:grid; grid-template-columns: repeat(auto-fill, minmax(450px, 1fr)); gap:14px}
        .card{background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:14px; min-height:120px;box-shadow: var(--shadow)}
        .card h4{margin: 4px 0 6px; font-weight:bold; font-size:20px;}
        .card img{height:360px;width:100%; border-radius:10px;}
        .card p {color:var(--muted);}

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

/* Popup modal */
@media (max-width: 640px) {
  .popupCard {
    max-width: 95%;
    padding: 1rem;
  }

  .popupCard h3 {
    font-size: 1.25rem;
  }

  .popupCard p {
    font-size: 0.9rem;
  }

  .popupCard img {
    max-height: 250px;
  }
}


       /* Footer */
.footer {
  padding: 20px 10px;
  text-align: center;
  background: #0a0a0a; /* optional dark background */
}

.footerCard {
  max-width: 600px; /* limit width on large screens */
  width: 95%; /* responsive width on mobile */
  margin: 0 auto 16px;
  padding: 22px;
  border-radius: 16px;
  background: linear-gradient(180deg, rgba(34,197,94,0.08), rgba(2,6,23,0.25));
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: var(--shadow);
}

.footerCard h3 {
  font-size: 1.2rem;
  margin-bottom: 8px;
  color: var(--brand);
}

.footerCard p {
  font-size: 0.95rem;
  margin-bottom: 12px;
  color: var(--text);
}

/* Responsive chips row */
.contactRow {
  display: flex;
  flex-wrap: wrap; /* wrap on small screens */
  justify-content: center;
  gap: 8px; /* space between chips */
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  color: var(--text);
  font-size: 0.85rem;
  text-decoration: none;
  transition: background 0.3s;
}

.chip:hover {
  background: rgba(34,197,94,0.2);
}

.tiny {
  color: var(--muted);
  font-size: 12px;
  margin-top: 8px;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .footerCard {
    padding: 16px;
    border-radius: 12px;
  }

  .footerCard h3 {
    font-size: 1rem;
  }

  .footerCard p {
    font-size: 0.9rem;
  }

  .chip {
    font-size: 0.8rem;
    padding: 5px 10px;
  }
}

.demo-book {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100% !important;
  height: auto !important;
  overflow: hidden; /* ✅ prevent layout shifts */
}


.demo-book .page {
  background: linear-gradient(180deg, rgba(96,165,250,0.06), rgba(2,6,23,0.25));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  box-shadow: inset 0 0 20px rgba(0,0,0,0.3), var(--shadow);
  padding: 12px;
  color: var(--text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.demo-book .page h4 {
  margin: 6px 0 4px;
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  font-weight: 700;
  color: var(--brand);
}

.demo-book .page p {
  margin: 4px 0;
  font-size: clamp(0.8rem, 2vw, 0.95rem);
}

.demo-book .page .muted {
  color: var(--muted);
  font-size: clamp(0.7rem, 1.8vw, 0.85rem);
}

.demo-book .certImg {
  width: 100%;
  max-height: 35vh;
  object-fit: contain;
  border-radius: 10px;
  margin-bottom: 12px;
  background: rgba(255,255,255,0.08);
 
  box-shadow: inset 0 0 25px rgba(0,0,0,0.4);
}

.scrollItem{position:relative; transform-origin:left center; transform-style:preserve-3d; background:var(--panel); border-radius:var(--radius); padding:2rem 1rem 2rem 3rem; overflow:hidden; perspective:1500px; box-shadow:var(--shadow); color:var(--text); margin-bottom:30px}
.scrollRod{position:absolute; left:-20px; top:0; bottom:0; width:15px; background:var(--brand2); border-radius:8px; transform-origin:center center; box-shadow:0 0 10px rgba(0,0,0,0.5)}
.scrollShadow{position:absolute; left:0; top:0; width:100%; height:100%; background:linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.5) 100%); pointer-events:none; transform-origin:left center}
.scrollHighlight{position:absolute; top:0; left:0; width:100%; height:100%; background:linear-gradient(120deg, rgba(255,255,255,0.15), rgba(255,255,255,0)); transform-origin:left center; pointer-events:none}
.scrollContent{position:relative; z-index:2; color:var(--text)}
.muted{color:var(--muted)}

      `}</style>
    </div>
  );
}