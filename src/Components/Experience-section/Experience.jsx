import { motion } from "framer-motion";


export const experience = [
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
export default function Experience({ experience = [] }) {
  return (
    <>
      {experience.map((ex, i) => (
        <motion.div
          key={i}
          className="expCard"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="expHeader">
            <h3>{ex.role}</h3>
            <span className="muted">
              {ex.company} • {ex.location}
            </span>
            <span className="period">{ex.period}</span>
          </div>

          <ul className="bullets">
            {ex.bullets.map((b, bi) => (
              <li key={bi} className="bulletItem">
                <span className="starBullet">✦</span>
                <span className="bulletText">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </>
  );
}