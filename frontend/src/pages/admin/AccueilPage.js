
import HeaderPart from '../../components/admin/header';
import React, { useState, useEffect } from "react";

export default function Accueil() {
  const [stats, setStats] = useState({
    nbAbonnes: 0,
    nbPublications: 0,
    nbProjectsRequests: 0,
    admin: null
  });
  const [loading, setLoading] = useState(true);

  // Responsive
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch("http://localhost/SFE-Project/backend/public/api/acceuil", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.error === "Non authentifié") window.location.href = "/login";
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // ...styles...


    const container = {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    maxWidth: 1200,
    margin: "0 auto",
  };

  const statsContainer = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "1rem":"3rem",
    marginBottom: "2rem",
  };

  const header = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    textAlign: isMobile ? "center" : "left",
    marginTop: "2rem",
  };

  const greetingSection = {
    flex: 1,
    marginRight: isMobile ? 0 : "2rem",
  };

  const imageContainer = {
    flex: 2,
    textAlign: isMobile ? "center" : "right",
  };
  const styles = {
    userMenu: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      position: isMobile ? "static" : "absolute",
      top: isMobile ? "auto" : "10px",
      right: isMobile ? "auto" : "10px",
      margin: isMobile ? "1rem auto" : 0,
      background: "#f9f9f9",
      padding: "0.5rem 1rem",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    },
    userAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "10px",
      background: "#e0e0e0",
    },
    userEmail: {
      fontSize: "1rem",
      fontWeight: "bold",
      color: "#333",
      marginRight: "6px",
      lineHeight: "1.2",
    },
    dropdownIcon: {
      cursor: "pointer",
    },
    arrowDownIcon: {
      width: "20px",
      height: "20px",
    },
    dropdownMenu: {
      position: "absolute",
      top: "50px",
      right: "10px",
      background: "#fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      padding: "0.5rem",
      zIndex: 1000,
    },
    logoutButton: {
      background: "none",
      border: "none",
      color: "#333",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      padding: "0.5rem 1rem",
      textAlign: "left",
      width: "100%",
      borderRadius: "4px",
      transition: "background 0.3s",
    },
    card: {
      background: "#D9D9D9",
      borderRadius: "8px",
      padding: "1rem",
      textAlign: "center",
      flex: 1,
      minWidth: "200px",
      height: "200px",
    },
    cardNumber: {
      fontSize: "4.2rem",
      fontWeight: "bold",
      color: "#ff5e5e",
      margin: 0,
    },
    cardLabelContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "0.9rem",
    },
    iconCard: {
      width: "35px",
      height: "35px",
      marginRight: "1rem",
    },
    cardLabel: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#000",
      margin: 0,
    },
    greeting: {
      fontSize: "3rem",
      color: "#ff5e5e",
      margin: isMobile ? "0.5rem 0" : "0 0 1rem 0",
      marginBottom: isMobile ? "40" : "100px",
    },
    subGreeting: {
      fontSize: isMobile ? "1.5rem" : "2rem",
      fontWeight: "bold",
      color: "#333",
      margin: 0,
    },
    image: {
      maxWidth: "100%",
      height: "auto",
    },
  };

  const isLoggedIn = window.localStorage.getItem("isLoggedIn") === "true";
  return (
    isLoggedIn &&
    <div style={container}>
      <HeaderPart/>
      <div style={{ height: "50px" }}></div>
      {/* Stats Cards */}
      <div style={statsContainer}>
        <div style={styles.card}>
          <h2 style={styles.cardNumber}>{loading ? "..." : stats.nbAbonnes}</h2>
          <div style={styles.cardLabelContainer}>
            <img src="/icons/line-ascendant-graphic-of-zigzag-arrow.png" alt="Abonnés Icon" style={styles.iconCard} />
            <p style={styles.cardLabel}>Total Abonnés</p>
          </div>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardNumber}>{loading ? "..." : stats.nbPublications}</h2>
          <div style={styles.cardLabelContainer}>
            <img src="/icons/analytics.png" alt="Projects Icon" style={styles.iconCard} />
            <p style={styles.cardLabel}>Total Projets</p>
          </div>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardNumber}>{loading ? "..." : stats.nbProjectsRequests}</h2>
          <div style={styles.cardLabelContainer}>
            <img src="/icons/demand.png" alt="Demandes Icon" style={styles.iconCard} />
            <p style={styles.cardLabel}>Total Demandes</p>
          </div>
        </div>
      </div>
      {/* Greeting & Illustration */}
      <div style={header}>
        <div style={greetingSection}>
          <h1 style={styles.greeting}>
            <span style={{ color: "#333" }}>Bonjour</span>{" "}
            {stats.admin|| ""}
          </h1>
          <p style={styles.subGreeting}>
            Bienvenue dans votre espace d’administration
          </p>
        </div>
        <div style={imageContainer}>
          <img src="/images/dashboard.jpg" alt="Dashboard Illustration" style={styles.image} />
        </div>
      </div>
    </div>
  );
}


