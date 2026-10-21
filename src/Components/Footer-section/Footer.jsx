
import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import {
  FaArrowUpRightFromSquare,
  FaEnvelope,
  FaPhone,
  FaCode,
  FaArrowUp,
} from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import "./Footer.css";

export default function Footer({ contact }) {
  return (
    <footer id="contact" className="portfolioFooter">
      <div className="footerContainer">
        {/* Top section */}
        <div className="footerTop">
          <div className="footerIdentity">
            <a href="#home" className="footerBrand">
              <span className="footerLogo">
                <FaCode />
              </span>
              <span>
                {contact.name}
                <span className="footerBrandDot">.</span>
              </span>
            </a>

            <p className="footerTagline">
              Building digital experiences with code and creativity.
            </p>
          </div>

          <div className="footerConnect">
            <span className="footerEyebrow">CONNECT WITH ME</span>

            <div className="footerSocials">
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="GitHub profile"
                title="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="LinkedIn profile"
                title="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://leetcode.com/u/Razahussain1512/"
                target="_blank"
                rel="noopener noreferrer"
                className="footerSocialLink"
                aria-label="LeetCode profile"
                title="LeetCode"
              >
                <SiLeetcode />
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="footerSocialLink"
                aria-label="Send email"
                title="Email"
              >
                <FaEnvelope />
              </a>
            </div>
          </div>
        </div>

        {/* Contact strip */}
        <div className="footerContactBar">
          <div className="footerContactInfo">
            <span className="footerContactIcon">
              <FaEnvelope />
            </span>
            <div>
              <span className="footerContactLabel">EMAIL</span>
              <a href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </div>
          </div>

          <div className="footerContactInfo">
            <span className="footerContactIcon">
              <FaPhone />
            </span>
            <div>
              <span className="footerContactLabel">PHONE</span>
              <a href={`tel:${contact.phone}`}>
                {contact.phone}
              </a>
            </div>
          </div>

          <a href="#home" className="footerBackTop">
            <span>Back to top</span>
            <FaArrowUp />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="footerBottom">
          <p>
            © {new Date().getFullYear()} {contact.name}.
            {" "}All rights reserved.
          </p>

          <span className="footerMadeWith">
            Crafted with <span>♥</span> and code
            <FaArrowUpRightFromSquare />
          </span>
        </div>
      </div>
    </footer>
  );
}
