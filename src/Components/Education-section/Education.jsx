
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./Education.css";

const education = [
  {
    title: "B.Tech in Computer Science",
    place: "B.E.S.T Innovation University, Gorantla",
    year: "2022 – 2026",
    score: "CGPA: 9.57 / 10",
    desc: "Coursework & labs across DSA, DBMS, Web Development, and Systems.",
    icon: "🎓",
    number: "01",
  },
  {
    title: "Intermediate (MPC)",
    place: "R.K Junior College, Machilipatnam",
    year: "2020 – 2022",
    score: "88%",
    desc: "Built a strong foundation in Mathematics, Physics, and Chemistry.",
    icon: "📘",
    number: "02",
  },
  {
    title: "SSC",
    place: "Nirmala High School, Machilipatnam",
    year: "2019 – 2020",
    score: "586 / 600",
    desc: "Developed foundational knowledge in General Science and Mathematics.",
    icon: "🏅",
    number: "03",
  },
];

export default function Timeline() {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "0px 0px -10% 0px",
  });

  return (
    <section className="education-section" id="education">
     
      <div className="education-timeline" ref={ref}>
        {/* Animated timeline rail */}
        <motion.div
          className="education-track"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : {}}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        >
          <motion.div
            className="education-track-light"
            animate={isInView ? { top: ["0%", "100%"] } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.4,
            }}
          />
        </motion.div>

        {education.map((item, i) => (
          <motion.article
            key={item.number}
            className={`education-item ${
              i % 2 === 0 ? "item-left" : "item-right"
            }`}
            initial={{
              opacity: 0,
              y: 55,
              rotateX: 12,
              scale: 0.94,
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                  }
                : {}
            }
            transition={{
              duration: 0.9,
              delay: 0.3 + i * 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              transformPerspective: 1000,
              transformOrigin: "center bottom",
            }}
          >
            {/* Timeline node */}
            <motion.div
              className="education-node"
              initial={{ scale: 0, rotate: -90 }}
              animate={isInView ? { scale: 1, rotate: 0 } : {}}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 12,
                delay: 0.5 + i * 0.3,
              }}
            >
              <span>{item.number}</span>
            </motion.div>

            {/* Education card */}
            <motion.div
              className="education-card"
              whileHover={{
                y: -6,
                transition: { duration: 0.25 },
              }}
            >
              <div className="education-card-top">
                <motion.div
                  className="education-icon"
                  whileHover={{ rotate: -8, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 250 }}
                >
                  {item.icon}
                </motion.div>

                <span className="education-year">{item.year}</span>
              </div>

              <div className="education-card-body">
                <span className="education-label">
                  EDUCATION {item.number}
                </span>

                <h3>{item.title}</h3>

                <p className="education-place">
                  <span aria-hidden="true">📍</span> {item.place}
                </p>

                <p className="education-description">{item.desc}</p>
              </div>

              <div className="education-card-footer">
                <span className="education-score-label">
                  Academic Achievement
                </span>

                <motion.span
                  className="education-score"
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.8 + i * 0.3 }}
                >
                  {item.score}
                </motion.span>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
