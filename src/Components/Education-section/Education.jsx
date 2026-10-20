import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const education = [
  {
    title: "B.Tech in Computer Science | CGPA: 9.57 / 10",
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


export default function Timeline() {
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
