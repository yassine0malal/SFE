import HeaderPart from "../../components/admin/header";
import React, { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaPowerOff,
} from "react-icons/fa";

// Simulated backend data stored as JSON
const backendServices = [
  {
    id: 1,
    nomService: "Creation des sites web",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "💻",
  },
  {
    id: 2,
    nomService: "Design Graphique",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "🖌️",
  },
  {
    id: 3,
    nomService: "Impression",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "🖨️",
  },
  {
    id: 4,
    nomService: "Marketing Digital",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "📈",
  },
  {
    id: 5,
    nomService: "Support Technique",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "🛠️",
  },
  {
    id: 6,
    nomService: "Conseil IT",
    description: "Conseil et accompagnement en transformation digitale.",
    details:
      "Nous aidons les entreprises à réussir leur transformation numérique.",
    icon: "💡",
  },
  {
    id: 7,
    nomService: "Conseil IT",
    description: "Conseil et accompagnement en transformation digitale.",
    details:
      "Nous aidons les entreprises à réussir leur transformation numérique.",
    icon: "💡",
  },
];

const CARDS_PER_PAGE = 3;
const pageCount = Math.ceil(backendServices.length / CARDS_PER_PAGE);

const ServicesPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeStates, setActiveStates] = useState(
    backendServices.map(() => true)
  );

  const maxIndex = Math.ceil(backendServices.length / CARDS_PER_PAGE) - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
  };

  // Découper les services à afficher
  const getVisibleServices = () => {
    const start = currentIndex * CARDS_PER_PAGE;
    let visible = backendServices.slice(start, start + CARDS_PER_PAGE);
  
    // If not enough cards, wrap around to the start
    if (visible.length < CARDS_PER_PAGE) {
      visible = visible.concat(
        backendServices.slice(0, CARDS_PER_PAGE - visible.length)
      );
    }
    return visible;
  };
  
  const visibleServices = getVisibleServices();
  var isActive = true;

  return (
    <div style={sliderContainerStyle}>
      {/* Header with admin email and logout */}
      <HeaderPart />

      {/* Spacer */}
      <div style={{ height: "50px" }}></div>

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        style={{ ...arrowButtonStyle, left: "10px" }}
      >
        <FaChevronLeft />
      </button>

      {/* Slider */}
      <div style={sliderWrapperStyle}>
        <div style={sliderStyle}>
          {visibleServices.map((service, index) => (
            <div
              key={service.id}
              style={{
                ...cardStyle,
                backgroundColor:
                  hoveredCard === service.id ? "#FF4757" : "#ff5c78", // impressive red on hover
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredCard(service.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={cardContentStyle}>
                <div style={{ fontSize: "30px", margin: "10px 0" }}>
                  {service.icon}
                </div>
                <h2 style={{ fontSize: "16px", margin: "10px 0" }}>
                  {service.nomService}
                </h2>
                <p style={{ fontSize: "12px" }}>{service.description}</p>
                <h4 style={{ marginTop: "15px" }}>Détails</h4>
                <p style={{ fontSize: "11px" }}>{service.details}</p>
              </div>
              <div style={buttonContainerStyle}>
                <button style={{ ...buttonStyle }}>
                  <FaEdit />
                </button>
                <button style={buttonStyle}>
                  <FaTrash />
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: activeStates[backendServices.findIndex(s => s.id === service.id)] ? "white" : "red",
                  }}
                  onClick={() => {
                    const globalIndex = currentIndex * CARDS_PER_PAGE + index;
                    const updated = [...activeStates];
                    updated[globalIndex] = !updated[globalIndex];
                    setActiveStates(updated);
                  }}
                >
                  <FaPowerOff />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        style={{ ...arrowButtonStyle, right: "10px" }}
      >
        <FaChevronRight />
      </button>

<div style={{
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  marginTop: "20px"
}}>
  {Array.from({ length: pageCount }).map((_, i) => (
    <span
      key={i}
      style={{
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        display: "inline-block",
        background: i === currentIndex ? "#FF4757" : "#ccc",
        transition: "background 0.3s",
        cursor: "pointer" // Make it look clickable
      }}
      onClick={() => setCurrentIndex(i)} // <-- Add this line
    />
  ))}
</div>
    </div>
  );
};

// Styles
const sliderContainerStyle = {
  position: "relative",
  width: "80vw",
  maxWidth: "100vw",
  overflow: "hidden",
  padding: "40px 0",
  boxSizing: "border-box",
  margin: "0 auto",
  minHeight: "500px",
};

const sliderWrapperStyle = {
  width: "100%",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
};

const sliderStyle = {
  display: "flex",
  gap: "20px",
  justifyContent: "center",
  width: "100%",
};

const cardStyle = {
  minWidth: "300px",
  maxWidth: "300px",
  minHeight: "500px",
  backgroundColor: "#ff5c78",
  color: "#fff",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
  flexShrink: 0,
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const arrowButtonStyle = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "transparent",
  border: "none",
  borderRadius: "50%",
  width: "40px",
  height: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  cursor: "pointer",
  fontSize: "20px",
  zIndex: 1000,
};
const buttonContainerStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginBottom: 20,
};

const buttonStyle = {
  backgroundColor: "white",
  borderRadius: "50%",
  width: "30px",
  height: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  color: "black",
  fontSize: "14px",
  cursor: "pointer",
};

export default ServicesPage;
