import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import img from "./image/St Manuel copy.png";

const links = [
  { href: "/", label: "Home" },
  { href: "/aboutme", label: "About" },
  { href: "/pastwork", label: "Work" },
  { href: "/blog", label: "Blog" },
  { href: "/blogvideo", label: "Videos" },
];

const MainNav = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const hamburgerRef = useRef(null);

  /* Close menu on route change */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [location.pathname]);

  /* Lock body scroll while menu is open on mobile */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Close on click outside the nav / hamburger */
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  /* Close on Escape key */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  return (
    <nav className="navbars1" role="navigation" aria-label="Main navigation">
      <div className="navbar11">
        <Link to="/" aria-label="St Manuel — home" onClick={() => setOpen(false)}>
          <img src={img} alt="St Manuel logo" className="logo-img" />
        </Link>
        <button
          ref={hamburgerRef}
          className={`hamburger${open ? " open" : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="primary-nav"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div
          id="primary-nav"
          ref={navRef}
          className={`nav${open ? " nav-open" : ""}`}
          role="menubar"
        >
          {links.map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={location.pathname === href ? "active" : ""}
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* Backdrop — dims page content behind the open mobile menu */}
        {open && <div className="nav-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />}
      </div>
    </nav>
  );
};

export default MainNav;
