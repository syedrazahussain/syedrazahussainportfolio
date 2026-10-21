import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

 return (
    <nav className="nav">
      <div className="navLeft">
        <span className="brand" ><a href='/'> SYED RAZA HUSSAIN </a></span>
      </div>
      <button className="menuBtn" onClick={() => setOpen(!open)} aria-label="Menu">
        ☰
      </button>
      <ul className={`navLinks ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
        <li><a href="#about">About</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#experience">Experience</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><Link to="/allprojectspage">All Projects</Link></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#achievements">Achievements</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}