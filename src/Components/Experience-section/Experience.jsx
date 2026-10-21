
import { motion } from "framer-motion";
import "./Experience.css";

export const experience = [
  {
    role: "Full Stack Developer",
    company: "Scuts Technologies Pvt. Ltd.",
    location: "Bangalore, India",
    period: "Sep 2024 – Mar 2025",
    bullets: [
      "Developed scalable RESTful APIs, improving data transaction speed by 30%.",
      "Enhanced responsive UI and accessibility, boosting user engagement by 25%.",
      "Optimized PostgreSQL queries, reducing page load time by 40%.",
      "Collaborated with cross-functional teams to deliver 5+ major features.",
      "Resolved critical deployment bugs and improved platform reliability.",
    ],
  },
 
];

export default function Experience({
  experience: items = experience,
}) {
  return (
    <section className="timelineSection">
      

      <div className="timeline">

        {items.map((ex, i) => (
          <motion.article
            className="timelineItem"
            key={`${ex.company}-${i}`}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            animate={{
              y: [0, -8, 0, 8, 0],
              rotate: [0, 0.2, 0, -0.2, 0],
            }}
            transition={{
              opacity: {
                duration: 0.6,
                delay: i * 0.15,
              },
              y: {
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
              rotate: {
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div className="timelineMarker">
              <span className="timelineDot" />
            </div>

            <div className="timelineCard">
              <div className="timelineCardTop">
                <span className="timelineDate">
                  {ex.period}
                </span>

                <span className="timelineIndex">
                  EXPERIENCE / 0{i + 1}
                </span>
              </div>

              <h3 className="timelineRole">
                {ex.role}
              </h3>

              <div className="timelineCompanyRow">
                <span className="timelineCompanyIcon">
                  ↗
                </span>

                <span className="timelineCompany">
                  {ex.company}
                </span>

                <span className="timelineLocation">
                  {ex.location}
                </span>
              </div>

              <div className="timelineDivider" />

              <h4 className="timelineSubheading">
                Key Responsibilities & Achievements
              </h4>

              <ul className="timelineAchievements">
                {ex.bullets.map((bullet, bi) => (
                  <motion.li
                    key={bi}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: bi * 0.08,
                    }}
                  >
                    <span className="timelineBullet">
                      <span />
                    </span>

                    <span>{bullet}</span>
                  </motion.li>
                ))}
              </ul>

              
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
