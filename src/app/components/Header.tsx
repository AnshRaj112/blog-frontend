"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./styles/Header.module.scss";

const Header: React.FC = () => {
  const [scrolling, setScrolling] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Track screen width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 770);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock/Unlock Scrolling when Menu Opens
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Smooth Scroll to Section
  const handleNavigation = useCallback((id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  }, []);

  // Inline styles when header is scrolled
  const getHeaderStyle = () => {
    const baseStyle = {
      position: "fixed" as const,
      top: 0,
      width: "100%",
      zIndex: 10,
      transition: "all 0.3s ease",
    };

    if (!scrolling) return baseStyle;

    return {
      ...baseStyle,
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
    };
  };

  return (
    <header className={styles.header} style={getHeaderStyle()}>
      {/* Mobile Menu Toggle */}
      {/* <div
        className={styles.menuToggle}
        style={{ color: "#fff" }}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? (
          <RxCross2
            size={24}
            className={styles.menuToggleIcon}
            style={{ color: "#fff" }}
          />
        ) : (
          <FaBars
            size={24}
            className={styles.menuToggleIcon}
            style={{ color: "#fff" }}
          />
        )}
      </div> */}
      <div className={styles.logoContainer}>
        <Link href="/">
          <p>ANSH RAJ</p>
        </Link>
      </div>

      {/* Overlay for Mobile Menu */}
      {/* <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence> */}

      {/* Navigation */}
      {/* {isMobile ? (
        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              className={styles.navOptions}
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className={styles.menuBox} style={{ color: "#fff" }}>
                {[
                  "home",
                  "education",
                  "projects",
                  "skills",
                  "research",
                  "testimonial",
                  "contact",
                ].map((id) => (
                  <div
                    key={id}
                    className={styles.navItem}
                    onClick={() => handleNavigation(id)}
                  >
                    <span>
                      {id.charAt(0).toUpperCase() +
                        id
                          .slice(1)
                          .replace("testimonial", "Testimonial")
                          .replace("research", "Research Paper")}
                    </span>
                  </div>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      ) : (
        <nav className={styles.navOptions}>
          <div className={styles.menuBox} style={{ color: "#fff" }}>
            {[
              "home",
              "education",
              "projects",
              "skills",
              "research",
              "testimonial",
              "contact",
            ].map((id) => (
              <div
                key={id}
                className={styles.navItem}
                onClick={() => handleNavigation(id)}
              >
                <span>
                  {id.charAt(0).toUpperCase() +
                    id
                      .slice(1)
                      .replace("testimonial", "Testimonial")
                      .replace("research", "Research Paper")}
                </span>
              </div>
            ))}
          </div>
        </nav>
      )} */}
    </header>
  );
};

export default Header;
