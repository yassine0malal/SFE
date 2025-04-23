import React, { useState } from "react";
import HeaderPart from "../../components/admin/header";
import { useNavigate } from "react-router-dom";

import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaPowerOff,
} from "react-icons/fa";

// Example data (replace with your real data or fetch from backend)
const initialProjects = [
  {
    id: 1,
    title: "Gestion de stock",
    images: [
      "/images/reel_site1.jpg",
      "/images/reel_site2.jpg",
      "/images/reel_site3.jpg",
    ],
    description:
      "Le Singleton assure qu'une classe ne peut avoir qu'une seule instance et fournit un point d'accès global à cette instance.",
    client: "Société marocaine de pintering",
    site: "https://monsite1.com",
  },
  {
    id: 2,
    title: "E-commerce",
    images: [
      "/images/reel_site1.jpg",
      "/images/reel_site3.jpg",
    ],
    description:
      "Plateforme e-commerce moderne avec gestion des paiements et catalogue dynamique.",
    client: "Boutique XYZ",
    site: "https://boutique-xyz.com",
  },
  // Ajoute d'autres projets ici...
];

export default function PublicationsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [current, setCurrent] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [activeStates, setActiveStates] = useState(initialProjects.map(() => true));
  const navigate = useNavigate();

  const project = projects[current];

  // Change project slide
  const goPrev = () => {
    setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
    setImgIndex(0);
  };
  const goNext = () => {
    setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
    setImgIndex(0);
  };

  // Change image inside project
  const prevImg = () => {
    setImgIndex((i) =>
      i === 0 ? project.images.length - 1 : i - 1
    );
  };
  const nextImg = () => {
    setImgIndex((i) =>
      i === project.images.length - 1 ? 0 : i + 1
    );
  };

  // Supprimer une publication
  const handleDelete = () => {
    if (window.confirm("Voulez-vous vraiment supprimer cette publication ?")) {
      const updatedProjects = projects.filter((_, idx) => idx !== current);
      const updatedActive = activeStates.filter((_, idx) => idx !== current);
      setProjects(updatedProjects);
      setActiveStates(updatedActive);
      if (updatedProjects.length === 0) {
        setCurrent(0);
        setImgIndex(0);
      } else {
        setCurrent((prev) =>
          prev >= updatedProjects.length ? Math.max(0, updatedProjects.length - 1) : prev
        );
        setImgIndex(0);
      }
    }
  };

  // Activer/désactiver une publication
  const handleToggleActive = () => {
    const updated = [...activeStates];
    updated[current] = !updated[current];
    setActiveStates(updated);
  };

  return (
    <div style={containerStyle}>
      <HeaderPart />
      <div style={topBarStyle}>
      <button
  style={{
    ...addBtnStyle,
    backgroundColor: "#FF5C78",
    
  }}
  onClick={() => navigate("/publications/ajouter")}
>
  Ajouter +
</button>
      </div>
      <div style={sliderWrapperStyle}>
        {/* Left Arrow */}
        <button style={iconBtnStyle} onClick={goPrev} disabled={projects.length === 0}>
          <FaChevronLeft />
        </button>

        {/* Card */}
        {projects.length === 0 ? (
          <div style={{ color: "#888", fontSize: 24, margin: 40 }}>
            Aucune réalisation à afficher.
          </div>
        ) : (
          <div style={cardStyle}>
            {/* Edit/Delete/Power buttons */}
            <div style={iconBarStyle}>
              <button style={iconBtnStyle}><FaEdit /></button>
              <button style={iconBtnStyle} onClick={handleDelete}><FaTrash /></button>
              <button
                style={{
                  ...iconBtnStyle,
                  background: activeStates[current] ? "#fff" : "#FF4757",
                  color: activeStates[current] ? "#222" : "#fff",
                }}
                onClick={handleToggleActive}
              >
                <FaPowerOff />
              </button>
            </div>
            {/* Title */}
            <div style={titleBarStyle}>{project.title}</div>
            {/* Image slider */}
            <div style={imgSliderStyle}>
              <button style={imgArrowBtnStyle("left")} onClick={prevImg} disabled={project.images.length <= 1}>&lt;</button>
              <img
                src={project.images[imgIndex]}
                alt={project.title}
                style={imgStyle}
              />
              <button style={imgArrowBtnStyle("right")} onClick={nextImg} disabled={project.images.length <= 1}>&gt;</button>
            </div>
            {/* Dots for images */}
            <div style={dotsRowStyle}>
              {project.images.map((_, i) => (
                <span
                  key={i}
                  style={{
                    ...dotStyle,
                    background: i === imgIndex ? "#FF5C78" : "#ccc",
                  }}
                  onClick={() => setImgIndex(i)}
                />
              ))}
            </div>
            {/* Description and client */}
            <div style={descRowStyle}>
              <div>
                <div style={descTitleStyle}>Description Projet</div>
                <div style={descTextStyle}>{project.description}</div>
              </div>
              <div>
                <div style={descTitleStyle}>Détails du client</div>
                <div style={descTextStyle}>{project.client}</div>
              </div>
            </div>
            {/* Visit site button */}
            <a
              href={project.site}
              target="_blank"
              rel="noopener noreferrer"
              style={visitBtnStyle}
            >
              Visitez le site
            </a>
          </div>
        )}

        {/* Right Arrow */}
        <button style={iconBtnStyle} onClick={goNext} disabled={projects.length === 0}>
          <FaChevronRight />
        </button>
      </div>
      {/* Pagination dots for projects */}
      <div style={dotsRowStyle}>
        {projects.map((_, i) => (
          <span
            key={i}
            style={{
              ...dotStyle,
              background: i === current ? "#FF5C78" : "#ccc",
            }}
            onClick={() => { setCurrent(i); setImgIndex(0); }}
          />
        ))}
      </div>
    </div>
  );
}

// ...styles identiques à ta version précédente...

// --- Styles ---
const containerStyle = {
  width: "100%",
  minHeight: "100vh",
  background: "#fff",
  padding: "0",
  boxSizing: "border-box",
};

const topBarStyle = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  margin: "0 0 1rem 0",
  padding: "0 2rem",
};

const addBtnStyle = {
  background: "#FF5C78",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.2rem",
  border: "none",
  borderRadius: "8px",
  padding: "12px 32px",
  cursor: "pointer",
  marginTop: "1rem",
};

const sliderWrapperStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1rem",
  width: "100%",
  minHeight: 600,
};

const cardStyle = {
  background: "#FFD1DB",
  border: "3px solid #1e90ff",
  borderRadius: "18px",
  padding: "1.5rem 2rem 2rem 2rem",
  minWidth: 900,
  maxWidth: 1200,
  minHeight: 500,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
};

const iconBarStyle = {
  position: "absolute",
  top: 18,
  left: 18,
  display: "flex",
  gap: "12px",
};

const iconBtnStyle = {
  background: "#fff",
  border: "none",
  borderRadius: "50%",
  width: 36,
  height: 36,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
  color: "#222",
};

const titleBarStyle = {
  background: "#fff0f3",
  color: "#222",
  fontWeight: "bold",
  fontSize: "2rem",
  borderRadius: "10px",
  padding: "0.5rem 2.5rem",
  margin: "0 0 1.5rem 0",
  textAlign: "center",
  alignSelf: "center",
};

const imgSliderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  marginBottom: "1rem",
  marginTop: "0.5rem",
};

const imgArrowBtnStyle = (side) => ({
  background: "none",
  border: "none",
  fontSize: "2rem",
  color: "#888",
  cursor: "pointer",
  margin: side === "left" ? "0 10px 0 0" : "0 0 0 10px",
  padding: 0,
  height: 80,
  display: "flex",
  alignItems: "center",
});

const imgStyle = {
  width: 600,
  height: 300,
  objectFit: "cover",
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  background: "#fff",
};

const dotsRowStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  margin: "1rem 0",
};

const dotStyle = {
  width: 12,
  height: 12,
  borderRadius: "50%",
  background: "#ccc",
  display: "inline-block",
  cursor: "pointer",
  transition: "background 0.3s",
};

const descRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  margin: "1.5rem 0 1rem 0",
  gap: "2rem",
};

const descTitleStyle = {
  fontWeight: "bold",
  fontSize: "1.1rem",
  marginBottom: "0.5rem",
  letterSpacing: "1px",
};

const descTextStyle = {
  fontSize: "1rem",
  color: "#222",
  maxWidth: 400,
};

const visitBtnStyle = {
  margin: "1.5rem auto 0 auto",
  display: "block",
  background: "#FF5C78",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "1.3rem",
  border: "none",
  borderRadius: "12px",
  padding: "16px 48px",
  cursor: "pointer",
  letterSpacing: "2px",
  textDecoration: "none",
  textAlign: "center",
};