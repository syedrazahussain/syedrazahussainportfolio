
import {
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";

import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
} from "framer-motion";

import Lottie from "lottie-react";
import coderAnim from "../../../src/screens/coder.json";
import "./Projects3D.css";


export const projects = [
  {
    title: "RisbenAI - AI-Powered Career Prepartaion Platform",
    desc: "Built an AI-platform that helps job seekers improve resume quality, identify skill gaps, gain actionable career insights, and plan personalized career growth.",
    tech: [
      "RAG",
      "LangChain",
      "LangGraph",
      "MERN",
      "Redis",
      "Firebase",
      "Razorpay",
      "Docker",
      "Github Actions",
    ],
    image: "/risbenai.png",
    link: "https://risbenai.vercel.app",
  },
  {
    title: "Tools Haven – Tool Renting Platform",
    desc: "Role-based tool-sharing platform with real-time updates & notifications; reduced missed returns by 50% and improved engagement by 70%.",
    tech: ["Next.js", "Express.js", "PostgreSQL", "Node.js"],
    image: "/toolshaven.png",
    link: "https://tools-haven.vercel.app/",
  },
  {
    title: "Vehicall",
    desc: "Platform to contact vehicle owners in parking zones via secure DB access and phone integration, cutting retrieval time by 60%.",
    tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    image: "/vehicall.png",
    link: "https://vehicall.infinityfree.me",
  },
  {
    title: "Celebratemate",
    desc: "An event reminder system that sends automated SMS and email notifications for birthdays, anniversaries, and other important events to avoid missing special moments.",
    tech: ["React JS", "Express", "NodeJS", "Postgres"],
    image: "/celebratemate.png",
    link: "https://celebratemate-client.onrender.com/",
  },
  {
    title: "Internshala Automation Tool",
    desc: "Automated internship applications using headless browser scripting, reducing manual effort by 95% and boosting reach by 4x.",
    tech: ["Node.js", "Puppeteer"],
    image: "/internshala.png",
    link: "/internshala",
  },
  {
    title: "CivicLink",
    desc: "Multi-role dashboard to report civic issues (water, garbage, roads), improving complaint resolution efficiency by 40%.",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    image: "/civiclink.png",
    link: "https://civiclink1.netlify.app/",
  },
];

function ProjectsScene({ projects = [] }) {
  const containerRef = useRef(null);
  const gridRefs = useRef([]);
  const animationRunRef = useRef(false);
  const releaseStartedRef = useRef(false);

  const [landedProjects, setLandedProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [triggered, setTriggered] = useState(false);
  const [playedOnce, setPlayedOnce] = useState(false);

  const lottieControls = useAnimation();

  const visibleProjects = useMemo(
    () => projects.slice(0, 6),
    [projects]
  );

  // Get the Lottie position relative to the project section.
  const getLottieCenter = () => {
    const container = containerRef.current;
    const lottieDiv = container?.querySelector(".lottie-wrapper");

    if (!container || !lottieDiv) {
      return { x: 0, y: 0 };
    }

    const rect = lottieDiv.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top + rect.height * 0.2,
    };
  };

  // MOBILE FIX:
  // A tall projects section may never be 50% visible on a
  // 360 x 800 screen. A smaller threshold lets the animation start.
  // The playedOnce guard prevents the animation from replaying.
  useEffect(() => {
    const container = containerRef.current;

    if (!container || playedOnce) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationRunRef.current) {
          animationRunRef.current = true;
          setTriggered(true);
          setPlayedOnce(true);
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -5% 0px",
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [playedOnce]);

  // Animate the Lottie, bubbles, and project cards sequentially.
  useEffect(() => {
    if (!triggered || releaseStartedRef.current) return;

    releaseStartedRef.current = true;

    let cancelled = false;
    const timers = new Set();

    const wait = (ms) =>
      new Promise((resolve) => {
        const timer = setTimeout(() => {
          timers.delete(timer);
          resolve();
        }, ms);

        timers.add(timer);
      });

    const releaseBubbles = async () => {
      try {
        for (let i = 0; i < visibleProjects.length; i++) {
          if (cancelled) return;

          const container = containerRef.current;
          const target = gridRefs.current[i];

          if (!container || !target) continue;

          // Read fresh positions on every iteration.
          const containerBox = container.getBoundingClientRect();
          const targetBox = target.getBoundingClientRect();

          const dx =
            targetBox.left -
            containerBox.left +
            targetBox.width / 2;

          const dy = targetBox.top - containerBox.top - 10;

          // Use animation controls as the single source of truth.
          // Do not override their x/y with useMotionValue styles.
          await lottieControls.start({
            x: dx,
            y: dy,
            transition: {
              duration: 0.25,
              ease: "easeInOut",
            },
          });

          if (cancelled) return;

          setActiveIndex(i);

          // Keep the existing scrolling behavior on desktop.
          // On narrow screens, avoid unnecessary viewport jumps.
          // Scroll to each project on mobile and desktop.
          target.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
          // Let the bubble finish before showing the card.
          await wait(1200);

          if (cancelled) return;

          setLandedProjects((prev) => {
            if (
              prev.some(
                (project) => project.title === visibleProjects[i].title
              )
            ) {
              return prev;
            }

            return [...prev, visibleProjects[i]];
          });

          await wait(200);

          if (cancelled) return;
        }

        if (!cancelled) {
          await lottieControls.start({
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.5 },
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Projects animation failed:", error);
        }
      }
    };

    releaseBubbles();

    return () => {
      cancelled = true;
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [triggered, visibleProjects, lottieControls]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-w-0 overflow-x-clip"
    >
      {/* Lottie animation */}
      <motion.div
        initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        animate={lottieControls}
        style={{
          transformOrigin: "50% 50%",
        }}
        className="
          lottie-wrapper
          absolute top-0 left-0 z-50
          w-48 max-w-[50vw]
          pointer-events-none
        "
      >
        <Lottie
          animationData={coderAnim}
          loop
          style={{
            width: "100%",
            height: "auto",
            display: "block",
          }}
        />
      </motion.div>

      {/* Animated bubble */}
      {activeIndex >= 0 &&
        activeIndex < visibleProjects.length && (
          <BubbleFromScreen
            key={activeIndex}
            project={visibleProjects[activeIndex]}
            containerRef={containerRef}
            targetRef={() => gridRefs.current[activeIndex]}
            getSpawn={getLottieCenter}
          />
        )}

      {/* Project cards */}
      <div
        className="
          mt-4 relative z-10
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
          gap-8
          w-full min-w-0
        "
      >
        {visibleProjects.map((proj, i) => (
          <div
            key={proj.title}
            ref={(el) => {
              gridRefs.current[i] = el;
            }}
            className="min-w-0 w-full min-h-[250px]"
          >
            {landedProjects.some(
              (landed) => landed.title === proj.title
            ) && <ProjectCard proj={proj} />}
          </div>
        ))}
      </div>

      {/* View More Projects CTA */}
      {triggered &&
        landedProjects.length === visibleProjects.length && (
          <div className="flex justify-center mt-8">
            <a
              href="/allprojectspage"
              className="
                px-6 py-3
                bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                text-white rounded-lg shadow-lg
                hover:scale-105 hover:shadow-xl
                transition transform duration-300
              "
            >
              View More Projects
            </a>
          </div>
        )}
    </div>
  );
}

function BubbleFromScreen({
  project,
  containerRef,
  targetRef,
  getSpawn,
}) {
  const controls = useAnimation();

  useEffect(() => {
    let cancelled = false;

    const animate = async () => {
      const container = containerRef.current;
      const target = targetRef();

      if (!container || !target) return;

      const containerBox = container.getBoundingClientRect();
      const targetBox = target.getBoundingClientRect();

      // Bubble starts near the Lottie animation.
      const spawn = getSpawn();

      const startX = spawn.x;
      const startY = spawn.y;

      // Bubble ends at the project card.
      const targetX =
        targetBox.left -
        containerBox.left +
        targetBox.width / 2;

      const targetY =
        targetBox.top -
        containerBox.top +
        targetBox.height / 2;

      const duration = 1.2;

      const arcHeight = 8 + Math.random() * 12;
      const horizontalOffset = (Math.random() - 0.5) * 40;

      const midX = (startX + targetX) / 2 + horizontalOffset;
      const midY = Math.min(startY, targetY) - arcHeight;

      const rotateStart = (Math.random() - 0.5) * 30;
      const rotateEnd = (Math.random() - 0.5) * 30;

      // Throw the bubble toward the card.
      await controls.start({
        top: [startY, midY, targetY],
        left: [startX, midX, targetX],
        rotate: [rotateStart, rotateEnd, 0],
        scale: [1.2, 1.3, 1],
        borderRadius: ["50%", "50%", "1rem"],
        opacity: [0, 1, 1],
        transition: {
          duration,
          ease: "easeInOut",
        },
      });

      if (cancelled) return;

      // Shrink the bubble after landing.
      await controls.start({
        scale: 0,
        opacity: 0,
        transition: {
          duration: 0.4,
          ease: "easeInOut",
        },
      });
    };

    animate();

    return () => {
      cancelled = true;
      controls.stop();
    };
  }, [controls, containerRef]);

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.2,
        rotate: 0,
      }}
      animate={controls}
      style={{
        position: "absolute",
        transform: "translate(-50%, -50%)",
        zIndex: 50,
        pointerEvents: "none",
      }}
      className="
        w-10 h-10
        bg-gradient-to-tr from-[var(--brand)] to-[var(--brand2)]
        shadow-xl
      "
    />
  );
}


function ProjectCard({ proj }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = {
    stiffness: 180,
    damping: 18,
    mass: 0.6,
  };

  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = x / rect.width;
    const percentY = y / rect.height;

    rotateX.set(((centerY - y) / centerY) * 9);
    rotateY.set(((x - centerX) / centerX) * 10);

    card.style.setProperty(
      "--pointer-x",
      `${percentX * 100}%`
    );

    card.style.setProperty(
      "--pointer-y",
      `${percentY * 100}%`
    );
  };

  const handleMouseLeave = (event) => {
    rotateX.set(0);
    rotateY.set(0);

    event.currentTarget.style.setProperty(
      "--pointer-x",
      "50%"
    );

    event.currentTarget.style.setProperty(
      "--pointer-y",
      "50%"
    );
  };

  return (
    <motion.div
      className="project-3d-scene"
      style={{
        perspective: 1200,
      }}
    >
      <motion.article
        className="project-3d-card"
        style={{
          rotateX: smoothRotateX,
          rotateY: smoothRotateY,
          transformPerspective: 1200,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          scale: 1.025,
          transition: { duration: 0.25 },
        }}
      >
        {/* Animated edge glow */}
        <div className="project-card-border" />

        {/* Mouse-following light */}
        <div className="project-card-shine" />

        {/* Image with 3D depth */}
        <div
          className="project-3d-image"
          style={{ transform: "translateZ(25px)" }}
        >
          <img
            src={proj.image}
            alt={proj.title}
            loading="lazy"
          />

          <div className="project-image-overlay" />

          <span className="project-image-tag">
            FEATURED PROJECT
          </span>
        </div>

        {/* Card content */}
        <div
          className="project-3d-content"
          style={{ transform: "translateZ(35px)" }}
        >
          <h3>{proj.title}</h3>

          <p className="project-3d-description">
            {proj.desc}
          </p>

          {/* Technology badges */}
          <div className="project-3d-tech">
            {proj.tech.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          {/* Project link */}
          {proj.link && (
            <a
              href={proj.link}
              target="_blank"
              rel="noopener noreferrer"
              className="project-3d-button"
            >
              Explore Project
              <span aria-hidden="true"> ↗</span>
            </a>
          )}
        </div>
      </motion.article>
    </motion.div>
  );
}

export default ProjectsScene;
