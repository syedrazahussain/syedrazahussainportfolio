import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

export default function Footer({ contact }) {
  return (
    <footer
      id="contact"
      className="portfolioFooter"
    >
      {/* Glow accent */}
      <div className="footerGlow" aria-hidden="true">
        <div className="footerGlowTop" />
        <div className="footerGlowBottom" />
      </div>

      <div className="footerContent">
        <h3>Get in touch</h3>

        <p className="footerDescription">
          Have an opportunity or collaboration in mind? Let’s talk.
        </p>

        <div className="footerContactRow">
          <a
            href={`tel:${contact.phone}`}
            className="footerChip"
          >
            📞 {contact.phone}
          </a>

          <a
            href={`mailto:${contact.email}`}
            className="footerChip"
          >
            ✉️ {contact.email}
          </a>

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noreferrer"
            className="footerChip"
          >
            <FaLinkedin className="footerIcon" />
            LinkedIn
          </a>

          <a
            href={contact.github}
            target="_blank"
            rel="noreferrer"
            className="footerChip"
          >
            <FaGithub className="footerIcon" />
            GitHub
          </a>
        </div>

        <p className="footerCopyright">
          © {new Date().getFullYear()} {contact.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}