import { useEffect, useRef, useState,useMemo } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
} from "framer-motion";

import Lottie from "lottie-react";
import coderAnim from "../../../src/screens/coder.json";

export const projects = [
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


  ];


function ProjectsScene({ projects = [] }) {
  const containerRef = useRef(null);
  const gridRefs = useRef([]);
  const [landedProjects, setLandedProjects] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [triggered, setTriggered] = useState(false);
  const [playedOnce, setPlayedOnce] = useState(false); // <-- new


  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  const lottieControls = useAnimation();

  const visibleProjects = useMemo(
  () => projects.slice(0, 6),
  [projects]
);

  // Get Lottie position for bubbles
  // Get Lottie position for bubbles (from head)
  
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


  // Trigger animation when section is visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedOnce) {
          setTriggered(true);      // trigger the animation
          setPlayedOnce(true);     // lock it so it won't replay
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [playedOnce]);


  // add this inside ProjectsScene, below your other useEffects
  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      if (!triggered) return; // only after IntersectionObserver fired

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // check if container is in view while scrolling
      if (rect.top < windowHeight && rect.bottom > 0) {
        // section is visible
        if (!triggered) {
          setTriggered(true);
        }
      } else {
        // section out of view, reset so it can fire again on next scroll

      }

    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

        gridRefs.current[i]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

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

export default ProjectsScene;
