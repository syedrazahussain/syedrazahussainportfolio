import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import "../Internshala_Header/Internshala_Header.css";

const navItems = [
    {
        label: "Home",
        to: "/#home",
        activePath: "/",
        id: "home",
    },
    
];

export default function Internshala_Header() {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when the route changes
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    const closeMenu = () => {
        setOpen(false);
    };

    return (
        <header className="premiumHeader">
            <nav className="nav" aria-label="Main navigation">

                {/* Brand */}
                <Link
                    to="/#home"
                    className="navBrand"
                    onClick={closeMenu}
                    aria-label="Syed Raza Hussain home"
                >
                    <span className="brandName">
                        SYED RAZA HUSSAIN
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className={`menuBtn ${open ? "menuBtnOpen" : ""}`}
                    type="button"
                    onClick={() => setOpen((previous) => !previous)}
                    aria-label={
                        open ? "Close navigation menu" : "Open navigation menu"
                    }
                    aria-expanded={open}
                    aria-controls="primary-navigation"
                >
                    <span />
                    <span />
                    <span />
                </button>


                {/* Navigation Panel */}
                <div
                    className={`navPanel ${open ? "navPanelOpen" : ""}`}
                    id="primary-navigation"
                    style={{
                        display: open ? "flex" : undefined,
                    }}
                >
                    <ul className="navLinks">
                        {navItems.map((item, index) => {
                            const isActive = location.pathname === item.activePath;

                            return (
                                <li
                                    key={item.id}
                                    className="navItem"
                                    style={{ "--item-index": index }}
                                >
                                    <Link
                                        to={item.to}
                                        className={`navLink ${isActive ? "navLinkActive" : ""
                                            }`}
                                        aria-current={isActive ? "page" : undefined}
                                        onClick={closeMenu}
                                    >
                                        <span>{item.label}</span>
                                        <span className="navLinkDot" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="navAction">
                        <Link
                            to="/internshala"
                            className="navProjectBtn"
                            onClick={closeMenu}
                        >
                            <span>Internshala</span>
                            <FaArrowRight className="navProjectArrow" />
                        </Link>
                    </div>
                </div>

            </nav>
        </header>
    );
}
