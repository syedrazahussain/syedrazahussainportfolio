
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";
import "./Header.css";

const navItems = [
  { label: "About", href: "#home", id: "home" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Education", href: "#education", id: "education" },
  { label: "Achievements", href: "#achievements", id: "achievements" },
  { label: "Certifications", href: "#certifications", id: "certifications" },
  { label: "Contact", href: "#contact", id: "contact" },
];


export default function Header() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const location = useLocation();

  useEffect(() => {
    setOpen(false);

    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const updateActiveSection = () => {
      let current = "home";

      for (const item of navItems) {
        const section = document.getElementById(item.id);

        if (section && section.getBoundingClientRect().top <= 150) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname]);

  const closeMenu = () => setOpen(false);

  return (
    <header className="premiumHeader">
      <nav className="nav" aria-label="Main navigation">

        <a
          href="/#home"
          className="navBrand"
          onClick={closeMenu}
          aria-label="Syed Raza Hussain home"
        >
          <span className="brandName">SYED RAZA HUSSAIN</span>
        </a>


        <button
          className={`menuBtn ${open ? "menuBtnOpen" : ""}`}
          type="button"
          onClick={() => setOpen((previous) => !previous)}
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`navPanel ${open ? "navPanelOpen" : ""}`}
          id="primary-navigation"
        >
          <ul className="navLinks">
            {navItems.map((item, index) => (
              <li
                key={item.id}
                className="navItem"
                style={{ "--item-index": index }}
              >
                <a
                  href={`/${item.href}`}
                  className={`navLink ${location.pathname === "/" &&
                      activeSection === item.id
                      ? "navLinkActive"
                      : ""
                    }`}
                  aria-current={
                    location.pathname === "/" &&
                      activeSection === item.id
                      ? "location"
                      : undefined
                  }
                  onClick={closeMenu}
                >
                  <span>{item.label}</span>
                  <span className="navLinkDot" />
                </a>
              </li>
            ))}
          </ul>

          <div className="navAction">
            <Link
              to="/allprojectspage"
              className="navProjectBtn"
              onClick={closeMenu}
            >
              <span>All Projects</span>
              <FaArrowRight className="navProjectArrow" />
            </Link>
          </div>
        </div>

        <button
          className="mobileCloseBtn"
          type="button"
          aria-label="Close menu"
          onClick={closeMenu}
        >
          <FaTimes />
        </button>
      </nav>
    </header>
  );
}
