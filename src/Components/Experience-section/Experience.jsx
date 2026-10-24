
import { motion, useReducedMotion } from "framer-motion";
import "./Experience.css";

export const experience = [
  {
    role: "Full Stack Intern",
    company: "HEXAIND Technologies and Services LLP",
    location: "Chennai, Tamil Nadu, India · Remote",
    period: "May 2025 – Jul 2025",
    bullets: [
      "Developed and deployed CelebrateMate, a full-stack event reminder platform using PostgreSQL, Express.js, React.js, and Node.js (PERN stack).",
      "Implemented automated birthday and anniversary notifications using Node-cron, Nodemailer, and Twilio, testing scheduled email and SMS reminders across 20+ events.",
      "Built automated reminder workflows that helped users remember important occasions and send timely birthday and anniversary wishes.",
      "Integrated PostgreSQL to manage user information, event dates, and reminder schedules, supporting reliable event tracking and notification delivery.",
      "Developed a responsive React.js frontend and deployed the application on Render for convenient access across devices."
    ]
  },
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
      "Resolved critical deployment bugs and improved platform reliability."
    ]
  }
];

export default function Experience({
  experience: items = experience
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="timelineSection"
      aria-label="Professional experience"
    >
      <div className="timeline">
        {items.map((ex, i) => (
          <motion.article
            className="timelineItem"
            key={`${ex.company}-${i}`}
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 30 }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : { opacity: 1, y: 0 }
            }
            viewport={{
              once: true,
              amount: 0.15
            }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    opacity: {
                      duration: 0.6,
                      delay: i * 0.15
                    },
                    y: {
                      duration: 0.6,
                      delay: i * 0.15,
                      ease: "easeOut"
                    }
                  }
            }
          >
            <div className="timelineMarker" aria-hidden="true">
              <span className="timelineDot" />
            </div>

            <motion.div
              className="timelineCardFloat"
              animate={
                shouldReduceMotion
                  ? undefined
                  : { y: [0, -4, 0, 4, 0] }
              }
              transition={
                shouldReduceMotion
                  ? undefined
                  : {
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
              }
            >
              <div className="timelineCard">
                <div className="timelineCardTop">
                  <span className="timelineDate">
                    {ex.period}
                  </span>

                  <span className="timelineIndex">
                    EXPERIENCE / {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="timelineRole">
                  {ex.role}
                </h3>

                <div className="timelineCompanyRow">
                  <span
                    className="timelineCompanyIcon"
                    aria-hidden="true"
                  >
                    ↗
                  </span>

                  <span className="timelineCompany">
                    {ex.company}
                  </span>

                  <span className="timelineLocation">
                    {ex.location}
                  </span>
                </div>

                <div
                  className="timelineDivider"
                  aria-hidden="true"
                />

                <h4 className="timelineSubheading">
                  Key Responsibilities &amp; Achievements
                </h4>

                <ul className="timelineAchievements">
                  {ex.bullets.map((bullet, bi) => (
                    <motion.li
                      key={`${ex.company}-bullet-${bi}`}
                      initial={
                        shouldReduceMotion
                          ? false
                          : { opacity: 0, x: -12 }
                      }
                      whileInView={
                        shouldReduceMotion
                          ? undefined
                          : { opacity: 1, x: 0 }
                      }
                      viewport={{
                        once: true,
                        amount: 0.1
                      }}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : {
                              duration: 0.35,
                              delay: bi * 0.08,
                              ease: "easeOut"
                            }
                      }
                    >
                      <span
                        className="timelineBullet"
                        aria-hidden="true"
                      >
                        <span />
                      </span>

                      <span className="timelineBulletText">
                        {bullet}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
