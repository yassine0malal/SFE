// import HeaderPart from "../../components/admin/header";
// import React, { useState } from "react";
// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaEdit,
//   FaTrash,
//   FaPowerOff,
// } from "react-icons/fa";

// // Simulated backend data stored as JSON
// const backendServices = [
//   {
//     id: 1,
//     nomService: "Creation des sites web",
//     description:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
//     details:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
//     icon: "💻",
//   },
//   {
//     id: 2,
//     nomService: "Design Graphique",
//     description:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
//     details:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
//     icon: "🖌️",
//   },
//   {
//     id: 3,
//     nomService: "Impression",
//     description:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
//     details:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
//     icon: "🖨️",
//   },
//   {
//     id: 4,
//     nomService: "Marketing Digital",
//     description:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
//     details:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
//     icon: "📈",
//   },
//   {
//     id: 5,
//     nomService: "Support Technique",
//     description:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
//     details:
//       "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
//     icon: "🛠️",
//   },
//   {
//     id: 6,
//     nomService: "Conseil IT",
//     description: "Conseil et accompagnement en transformation digitale.",
//     details:
//       "Nous aidons les entreprises à réussir leur transformation numérique.",
//     icon: "💡",
//   },
//   {
//     id: 7,
//     nomService: "Conseil IT",
//     description: "Conseil et accompagnement en transformation digitale.",
//     details:
//       "Nous aidons les entreprises à réussir leur transformation numérique.",
//     icon: "💡",
//   },
// ];
// const CARDS_PER_PAGE = 3;
// const CARD_WIDTH = 320; // 300px + 20px gap
// const pageCount = Math.ceil(backendServices.length / CARDS_PER_PAGE);

// const ServicesPage = () => {
//   const [hoveredCard, setHoveredCard] = useState(null);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [activeStates, setActiveStates] = useState(
//     backendServices.map(() => true)
//   );

//   // Get the 3 cards for the current page, wrapping if needed
//   const getVisibleServices = () => {
//     let visible = [];
//     for (let i = 0; i < CARDS_PER_PAGE; i++) {
//       const idx = (currentPage * CARDS_PER_PAGE + i) % backendServices.length;
//       visible.push(backendServices[idx]);
//     }
//     return visible;
//   };
//   const visibleServices = getVisibleServices();

//   // Animation: use a wrapper and a track, and animate the track
//   const [animating, setAnimating] = useState(false);

//   const handlePrev = () => {
//     setAnimating(true);
//     setTimeout(() => {
//       setCurrentPage((prev) =>
//         prev === 0 ? pageCount - 1 : prev - 1
//       );
//       setAnimating(false);
//     }, 500);
//   };

//   const handleNext = () => {
//     setAnimating(true);
//     setTimeout(() => {
//       setCurrentPage((prev) =>
//         prev === pageCount - 1 ? 0 : prev + 1
//       );
//       setAnimating(false);
//     }, 500);
//   };

//   return (
//     <div style={sliderContainerStyle}>
//       <HeaderPart />
//       <div style={{ height: "50px" }}></div>

//       {/* Left Arrow */}
//       <button
//         onClick={handlePrev}
//         style={{ ...arrowButtonStyle, left: "10px" }}
//         disabled={animating}
//       >
//         <FaChevronLeft />
//       </button>

//       {/* Slider */}
//       <div style={sliderWrapperStyle}>
//         <div
//           style={{
//             ...sliderTrackStyle,
//             width: `${CARDS_PER_PAGE * CARD_WIDTH}px`,
//             transform: animating
//               ? `translateX(-${CARDS_PER_PAGE * CARD_WIDTH}px)`
//               : "translateX(0)",
//             transition: animating
//               ? "transform 0.5s cubic-bezier(.77,0,.18,1)"
//               : "none",
//             display: "flex",
//           }}
//         >
//           {visibleServices.map((service, idx) => (
//             <div
//               key={service.id}
//               style={{
//                 ...cardStyle,
//                 backgroundColor:
//                   hoveredCard === service.id ? "#FF4757" : "#ff5c78",
//                 cursor: "pointer",
//                 marginRight: "20px",
//                 transition: "background 0.3s",
//               }}
//               onMouseEnter={() => setHoveredCard(service.id)}
//               onMouseLeave={() => setHoveredCard(null)}
//             >
//               <div style={cardContentStyle}>
//                 <div style={{ fontSize: "30px", margin: "10px 0" }}>
//                   {service.icon}
//                 </div>
//                 <h2 style={{ fontSize: "16px", margin: "10px 0" }}>
//                   {service.nomService}
//                 </h2>
//                 <p style={{ fontSize: "12px" }}>{service.description}</p>
//                 <h4 style={{ marginTop: "15px" }}>Détails</h4>
//                 <p style={{ fontSize: "11px" }}>{service.details}</p>
//               </div>
//               <div style={buttonContainerStyle}>
//                 <button style={{ ...buttonStyle }}>
//                   <FaEdit />
//                 </button>
//                 <button style={buttonStyle}>
//                   <FaTrash />
//                 </button>
//                 <button
//                   style={{
//                     ...buttonStyle,
//                     backgroundColor: activeStates[
//                       backendServices.findIndex(s => s.id === service.id)
//                     ]
//                       ? "white"
//                       : "red",
//                   }}
//                   onClick={() => {
//                     const realIndex = backendServices.findIndex(
//                       (s) => s.id === service.id
//                     );
//                     const updated = [...activeStates];
//                     updated[realIndex] = !updated[realIndex];
//                     setActiveStates(updated);
//                   }}
//                 >
//                   <FaPowerOff />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right Arrow */}
//       <button
//         onClick={handleNext}
//         style={{ ...arrowButtonStyle, right: "10px" }}
//         disabled={animating}
//       >
//         <FaChevronRight />
//       </button>

//       {/* Pagination Dots */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           gap: "8px",
//           marginTop: "20px",
//         }}
//       >
//         {Array.from({ length: pageCount }).map((_, i) => (
//           <span
//             key={i}
//             style={{
//               width: "12px",
//               height: "12px",
//               borderRadius: "50%",
//               display: "inline-block",
//               background: i === currentPage ? "#FF4757" : "#ccc",
//               transition: "background 0.3s",
//               cursor: "pointer",
//             }}
//             onClick={() => !animating && setCurrentPage(i)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// // Styles
// const sliderContainerStyle = {
//   position: "relative",
//   width: "80vw",
//   maxWidth: "100vw",
//   overflow: "hidden",
//   padding: "40px 0 0 20px ",
//   boxSizing: "border-box",
//   margin: "0 auto",
//   minHeight: "500px",
// };

// const sliderWrapperStyle = {
//   width: `${CARDS_PER_PAGE * CARD_WIDTH}px`,
//   overflow: "hidden",
//   margin: "0 auto",
// };

// const sliderTrackStyle = {
//   display: "flex",
//   alignItems: "stretch",
// };

// const cardStyle = {
//   minWidth: "300px",
//   maxWidth: "300px",
//   minHeight: "500px",
//   backgroundColor: "#ff5c78",
//   color: "#fff",
//   borderRadius: "12px",
//   padding: "20px",
//   textAlign: "center",
//   flexShrink: 0,
//   boxSizing: "border-box",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "space-between",
// };

// const cardContentStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "flex-start",
// };

// const arrowButtonStyle = {
//   position: "absolute",
//   top: "50%",
//   transform: "translateY(-50%)",
//   backgroundColor: "transparent",
//   border: "none",
//   borderRadius: "50%",
//   width: "40px",
//   height: "40px",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   cursor: "pointer",
//   fontSize: "20px",
//   zIndex: 1000,
// };

// const buttonContainerStyle = {
//   display: "flex",
//   justifyContent: "space-around",
//   marginBottom: 20,
// };

// const buttonStyle = {
//   backgroundColor: "white",
//   borderRadius: "50%",
//   width: "30px",
//   height: "30px",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   border: "none",
//   color: "black",
//   fontSize: "14px",
//   cursor: "pointer",
// };

// export default ServicesPage;

import HeaderPart from "../../components/admin/header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaPowerOff,
} from "react-icons/fa";

// Move initial data to a separate variable
const initialServices = [
  {
    id: 1,
    nomService: "Creation des sites web",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "web_site.png",
  },
  {
    id: 2,
    nomService: "Design Graphique",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "impression.png",
  },
  {
    id: 3,
    nomService: "Impression",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "impression.png",
  },
  {
    id: 4,
    nomService: "Marketing Digital",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logiciellesCe pattern est un élément fondamental de nombreuses architectures logiciellesCe pattern est un élément fondamental de nombreuses architectures logiciellesCe pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "design_graphique.png",
  },
  {
    id: 5,
    nomService: "Support Technique",
    description:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles...",
    details:
      "Ce pattern est un élément fondamental de nombreuses architectures logicielles et s'avère particulièrement utile pour gérer des ressources partagées comme les connexions aux bases de données.",
    icon: "impression.png",
  },
  {
    id: 6,
    nomService: "Conseil IT",
    description: "Conseil et accompagnement en transformation digitale.",
    details:
      "Nous aidons les entreprises à réussir leur transformation numérique.",
    icon: "design_graphique.png",
  },
  {
    id: 7,
    nomService: "Conseil IT",
    description: "Conseil et accompagnement en transformation digitale.",
    details:
      "Nous aidons les entreprises à réussir leur transformation numérique.",
    icon: "design_graphique.png",
  },
];
const CARDS_PER_PAGE = 3;
const CARD_WIDTH = 320; // 300px + 20px gap

const ServicesPage = () => {
  const [services, setServices] = useState(initialServices);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeStates, setActiveStates] = useState(
    initialServices.map(() => true)
  );
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();


  // Update activeStates if services change (keep length in sync)
  useEffect(() => {
    setActiveStates((prev) => {
      if (services.length === prev.length) return prev;
      return services.map((_, i) => prev[i] ?? true);
    });
    // If currentPage is out of bounds, fix it
    if (currentPage > Math.ceil(services.length / CARDS_PER_PAGE) - 1) {
      setCurrentPage(
        Math.max(0, Math.ceil(services.length / CARDS_PER_PAGE) - 1)
      );
    }
  }, [services, currentPage]);

  const pageCount = Math.ceil(services.length / CARDS_PER_PAGE) || 1;

  // Get the 3 cards for the current page, wrapping if needed, but only if services exist
  const getVisibleServices = () => {
    let visible = [];
    if (services.length === 0) return visible;
    for (let i = 0; i < Math.min(CARDS_PER_PAGE, services.length); i++) {
      const idx = (currentPage * CARDS_PER_PAGE + i) % services.length;
      visible.push(services[idx]);
    }
    return visible;
  };
  const visibleServices = getVisibleServices();

  const handlePrev = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev === 0 ? pageCount - 1 : prev - 1));
      setAnimating(false);
    }, 500);
  };

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentPage((prev) => (prev === pageCount - 1 ? 0 : prev + 1));
      setAnimating(false);
    }, 500);
  };

  return (
    <div style={sliderContainerStyle}>
      <HeaderPart />
<button
  style={{
    width: "160px",
    height: "50px",
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#FF5C78",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    zIndex: 1100,
  }}
  onClick={() => navigate("/services/ajouter")}
>
  Ajouter +
</button>
      <div style={{ height: "50px" }}></div>

      {services.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#888",
            fontSize: 24,
            margin: 40,
          }}
        >
          Aucun service à afficher.
        </div>
      ) : (
        <>
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            style={{ ...arrowButtonStyle, left: "10px" }}
            disabled={animating}
          >
            <FaChevronLeft />
          </button>

          {/* Slider */}
          <div style={sliderWrapperStyle}>
            <div
              style={{
                ...sliderTrackStyle,
                width: `${CARDS_PER_PAGE * CARD_WIDTH}px`,
                transform: animating
                  ? `translateX(-${CARDS_PER_PAGE * CARD_WIDTH}px)`
                  : "translateX(0)",
                transition: animating
                  ? "transform 0.5s cubic-bezier(.77,0,.18,1)"
                  : "none",
                display: "flex",
              }}
            >
              {visibleServices.map(
                (service, idx) =>
                  service && (
                    <div
                      key={service.id}
                      style={{
                        ...cardStyle,
                        backgroundColor:
                          hoveredCard === service.id ? "#FF4757" : "#ff5c78",
                        cursor: "pointer",
                        marginRight: "20px",
                        transition: "background 0.3s",
                      }}
                      onMouseEnter={() => setHoveredCard(service.id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div style={cardContentStyle}>
                        <div style={{ fontSize: "30px" }}>
                          <img
                            src={`images/${service.icon}`}
                            width={60}
                            height={60}
                          />
                        </div>
                        <h2
                          style={{
                            fontSize: "16px",
                            margin: "10px 0",
                            textAlign: "center",
                            width: "100%",
                            display: "block",
                          }}
                        >
                          {service.nomService}
                        </h2>
                        <p style={{ fontSize: "12px",textAlign: "start" }}>
                          {service.description}
                        </p>
                        <h4 style={{ marginTop: "15px" }}>Détails</h4>
                        <p style={{ fontSize: "11px", textAlign: "start" }}>{service.details}</p>
                      </div>
                      <div style={buttonContainerStyle}>
                        <button style={{ ...buttonStyle }}>
                          <FaEdit />
                        </button>
                        <button
                          style={buttonStyle}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Voulez-vous vraiment supprimer ce service ?"
                              )
                            ) {
                              setServices((prev) =>
                                prev.filter((s) => s.id !== service.id)
                              );
                              setActiveStates((prev) => {
                                const idxInAll = services.findIndex(
                                  (s) => s.id === service.id
                                );
                                const updated = [...prev];
                                updated.splice(idxInAll, 1);
                                return updated;
                              });
                            }
                          }}
                        >
                          <FaTrash />
                        </button>
                        <button
                          style={{
                            ...buttonStyle,
                            backgroundColor: activeStates[
                              services.findIndex((s) => s.id === service.id)
                            ]
                              ? "white"
                              : "red",
                          }}
                          onClick={() => {
                            const realIndex = services.findIndex(
                              (s) => s.id === service.id
                            );
                            const updated = [...activeStates];
                            updated[realIndex] = !updated[realIndex];
                            setActiveStates(updated);
                          }}
                        >
                          <FaPowerOff />
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            style={{ ...arrowButtonStyle, right: "10px" }}
            disabled={animating}
          >
            <FaChevronRight />
          </button>

          {/* Pagination Dots */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            {Array.from({ length: pageCount }).map((_, i) => (
              <span
                key={i}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  display: "inline-block",
                  background: i === currentPage ? "#FF4757" : "#ccc",
                  transition: "background 0.3s",
                  cursor: "pointer",
                }}
                onClick={() => !animating && setCurrentPage(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Styles
const sliderContainerStyle = {
  position: "relative",
  width: "80vw",
  maxWidth: "100vw",
  overflow: "hidden",
  padding: "40px 0 0 20px ",
  boxSizing: "border-box",
  margin: "0 auto",
  minHeight: "500px",
};

const sliderWrapperStyle = {
  width: `${CARDS_PER_PAGE * CARD_WIDTH}px`,
  overflow: "hidden",
  margin: "0 auto",
};

const sliderTrackStyle = {
  display: "flex",
  alignItems: "stretch",
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
