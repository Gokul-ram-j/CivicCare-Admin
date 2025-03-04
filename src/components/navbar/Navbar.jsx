import React, { useState } from "react";
import styles from "./navbar.module.css";
import { signOut } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const navLinks = [
  { to: "/", title: "DashBoard" },
  { to: "/communityInfo", title: "Community Info" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate=useNavigate()
  const toggleMenu = () => setIsOpen(!isOpen);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      navigate("/"); // Redirect user after sign out
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className={styles.navContainer}>
      <div className={styles.logo}>
        <h2>CivicCare</h2>
      </div>

      {/* Desktop Navigation */}
      <div className={styles.navLinks}>
        {navLinks.map((item, ind) => (
          <Link key={ind} to={item.to} className={styles.navItem}>
            {item.title}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button className={styles.menuBtn} onClick={toggleMenu}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
      </button>

      {/* Mobile Dropdown */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.showMenu : ""}`}>
        {navLinks.map((item, ind) => (
          <Link key={ind} to={item.to} className={styles.mobileNavItem} onClick={toggleMenu}>
            {item.title}
          </Link>
        ))}
        <button className={styles.signOutBtnMobile} onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
        </button>
      </div>

      {/* Desktop Sign-Out Button */}
      <button className={styles.signOutBtn} onClick={handleSignOut}>
        <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
      </button>
    </nav>
  );
}

export default Navbar;
