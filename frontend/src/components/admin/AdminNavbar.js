import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminNavbar() {
  const links = [
    { label: "Accueil", path: "/" },
    { label: "Commentaires", path: "/commentaires" },
    { label: "Réalisations", path: "/publications" },
    { label: "Services", path: "/services" },
    { label: "Produits", path: "/galerie" },
    { label: "Abonnés", path: "/abonnes" },
    { label: "Contact", path: "/contact" },
    { label: "Clients", path: "/clients" },
  ];

  const location = useLocation(); // Get the current path
const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  return (
    isLoggedIn == "true" &&
    <nav style={styles.nav}>
      <img src="/images/logo-updated.png" alt="Logo" style={styles.logo} />
      <ul style={styles.navLinks}>
        {links.map(({ label, path }, i) => (
          <li key={i} style={styles.navLink(location.pathname === path)}>
            <Link to={path} style={styles.link}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    width: 200,
    background: "#fff",
    borderRight: "2px solid #ddd",
    padding: "1rem",
    height: "150vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  logo: { width: "100%", marginBottom: "2rem" },
  navLinks: { listStyle: "none", padding: 0, margin: 0 },
  navLink: (active) => ({
    padding: "1rem", // Increased padding for larger clickable area
    cursor: "pointer",
    background: active ? "#f0f0f0" : "transparent",
    fontWeight: "bold",
    fontSize: "1rem",
    color: "#333",
    borderRadius: "4px",
    transition: "background 0.3s",
    display: "block", // Ensures the link spans the full width of the parent
  }),
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "block", // Makes the link fill the entire parent container
    width: "100%", // Ensures the link spans the full width of the parent
    height: "100%", // Ensures the link spans the full height of the parent
  },
};

export default AdminNavbar;