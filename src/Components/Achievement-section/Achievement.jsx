
import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useInView,
} from "framer-motion";
import "./Achievement.css";

export const achievements = [
  {
    title: "9.57 CGPA – Academic Excellence",
    desc: "Achieved an outstanding 9.57 CGPA, demonstrating strong academic performance and consistent dedication to learning.",
    image: "/academic-excellence.png",
  },
  {
    title: "2nd place – Code Debugging (Utkarsh 2K25)",
    desc: "Among participants from 30+ colleges.",
    image: "/debuggingprize.jpg",
  },
  {
    title: "Finalist – Tech Quiz (Enlight Degree College)",
    desc: "Tested on DBMS, Web, C, and Python.",
    image: "/enlightprize.jpg",
  },
  {
    title: "60+ DSA Problems Solved – LeetCode",
    desc: "Strengthened problem-solving skills by practicing Data Structures and Algorithms, covering arrays, strings, hashing, recursion, and other fundamental concepts.",
    image: "/leetcode-dsa.png",
  },
  {
    title: "Full Stack – Application Development",
    desc: "Designed, Developed, and Deployed 10+ full-stack applications with end-to-end frontend, backend, and database integrations.",
    image: "/achievement-full-stack.png",
  },
  {
    title: "Participant – AWSome Day Online Conference",
    desc: "Explored AWS cloud services and infrastructure.",
    image: "/awsbackground_image.jpg",
  },
];

const popupImages = [
  "/academic-excellence.png",
  "/newspaper.jpg",
  "/enlight_certificate.jpg",
  "/leetcode-dsa.png",
  "/achievement-full-stack.png",
  "/Awsomeonlineconferencecertificate.png",
];

const popupDescriptions = [
  "Achieved an outstanding 9.57 CGPA, reflecting consistent academic performance, strong learning discipline, and a commitment to technical and professional growth.",
  "I came in the newspaper for excellent debugging skills and won 2nd prize. Over 30+ colleges participated in this competition.",
  "Participated in the Enlight Degree College quiz competition and showcased problem-solving and analytical skills.",
  "Strengthened problem-solving skills by practicing Data Structures and Algorithms, covering arrays, strings, hashing, recursion, and other fundamental concepts.",
  "Designed, Developed, and Deployed 10+ full-stack applications with end-to-end frontend, backend, and database integrations.",
  "Successfully completed the AWSome Day Online Conference 2025, gaining knowledge of cloud computing and AWS infrastructure.",
];

const OCTAGON =
  "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)";

export default function CardGrid({ items = achievements }) {
  const [popupItem, setPopupItem] = useState(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const touchStartRef = useRef({ x: 0, y: 0 });
  const hoverTimeout = useRef(null);
  const scrollTimeout = useRef(null);
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    margin: isMobile
      ? "-30px 0px -30px 0px"
      : "-100px 0px -100px 0px",
    amount: isMobile ? 0.15 : 0.3,
  });

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 180);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout.current);
      clearTimeout(hoverTimeout.current);
    };
  }, []);

  const openPopup = (item, index) => {
    clearTimeout(hoverTimeout.current);

    setPopupItem({
      ...item,
      image: popupImages[index] || item.image,
      desc: popupDescriptions[index] || item.desc,
    });
  };

  const handleMouseEnter = (item, index) => {
    if (isScrolling || isMobile) return;

    clearTimeout(hoverTimeout.current);

    hoverTimeout.current = setTimeout(() => {
      openPopup(item, index);
    }, 1200);
  };

  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (event, item, index) => {
    const touch = event.changedTouches[0];

    const dx = Math.abs(
      touch.clientX - touchStartRef.current.x
    );
    const dy = Math.abs(
      touch.clientY - touchStartRef.current.y
    );

    // Open only on a tap, not when the user scrolls.
    if (dx < 10 && dy < 10) {
      openPopup(item, index);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="achievement-section relative flex w-full flex-col items-center"
    >
      {/* Decorative horizontal energy line */}
      <div className="achievement-energy-line relative mb-16 h-[15px] w-full overflow-hidden rounded-full">
        <div className="achievement-energy-base absolute inset-0 rounded-full" />

        <motion.div
          className="achievement-energy-shimmer absolute inset-y-0 w-1/3"
          initial={{ x: "-100%" }}
          animate={
            isInView
              ? { x: ["-100%", "400%"] }
              : { x: "-100%" }
          }
          transition={{
            duration: isInView ? 3 : 0,
            repeat: isInView ? Infinity : 0,
            ease: "linear",
          }}
        />
      </div>

      {/* Achievement cards */}
      <div className="achievement-grid grid w-full grid-cols-1 gap-x-10 gap-y-20 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8">
        {items.map((item, index) => (
          <motion.article
            key={`${item.title}-${index}`}
            className="achievement-card relative flex w-full flex-col items-center"
            initial={{ opacity: 0, y: 45 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
            }}
            onMouseEnter={() => handleMouseEnter(item, index)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={(event) =>
              handleTouchEnd(event, item, index)
            }
            onClick={() => {
              if (!isMobile) openPopup(item, index);
            }}
          >
            {/* Chain behind the medal */}
            <div className="achievement-chain" aria-hidden="true">
              <div className="achievement-chain-top" />

              <div className="achievement-chain-links">
                {Array.from({ length: 7 }).map((_, linkIndex) => (
                  <motion.span
                    key={linkIndex}
                    className="achievement-chain-link"
                    animate={
                      isInView
                        ? { rotate: [0, 8, -8, 0] }
                        : { rotate: 0 }
                    }
                    transition={{
                      duration: 2.5,
                      repeat: isInView ? Infinity : 0,
                      delay: linkIndex * 0.08,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Medal motion wrapper */}
            <motion.div
              className="achievement-medal"
              animate={
                isInView
                  ? { y: [0, -7, 0, 7, 0] }
                  : { y: 0 }
              }
              transition={{
                duration: 4,
                repeat: isInView ? Infinity : 0,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.045,
                rotate: 1,
              }}
            >
              {/* Outer gold frame stays outside clipped content */}
              <div
                className="gold-medal-frame"
                style={{ "--octagon": OCTAGON }}
              >
                {/* Image and content inside the octagon */}
                <div
                  className="gold-medal-inner"
                  style={{ clipPath: OCTAGON }}
                >
                  <div
                    className="medal-background-image"
                    style={{
                      backgroundImage: `url("${item.image}")`,
                    }}
                  />

                  <div className="medal-dark-overlay" />

                  <div className="medal-content">
                    <span className="medal-kicker">
                      ACHIEVEMENT · {String(index + 1).padStart(2, "0")}
                    </span>

                    <h3>{item.title}</h3>

                    <p>{item.desc}</p>

                    <span className="medal-view-hint">
                      VIEW ACHIEVEMENT
                    </span>
                  </div>
                </div>
              </div>

              {/* Gold star medal at the bottom */}
              <div className="gold-star-badge" aria-hidden="true">
                <span>★</span>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </div>

      {/* Achievement popup */}
      <AnimatePresence>
        {popupItem && (
          <motion.div
            className="achievement-popup-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPopupItem(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={popupItem.title}
              className="achievement-popup"
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="achievement-popup-close"
                aria-label="Close achievement"
                onClick={() => setPopupItem(null)}
              >
                ×
              </button>

              <div className="achievement-popup-image-frame">
                <img
                  src={popupItem.image}
                  alt={popupItem.title}
                  className="achievement-popup-image"
                />
              </div>

              <h3>{popupItem.title}</h3>
              <p>{popupItem.desc}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
