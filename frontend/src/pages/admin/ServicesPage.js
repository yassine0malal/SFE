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

const CARDS_PER_PAGE = 3;
const CARD_WIDTH = 320;
const API_URL = "http://localhost/SFE-Project/backend/public/api/services";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeStates, setActiveStates] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  // Fetch services from API with authentication check
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_URL, { credentials: "include" });
        const data = await response.json();

        if (data.error === "Non authentifié") {
          window.location.href = "/login";
          return;
        }

        if (Array.isArray(data)) {
          const servicesWithStatus = data.map((service) => ({
            ...service,
            is_active: service.is_active === "1",
            className: service.className || "flaticon-brand",
          }));
          setServices(servicesWithStatus);
          // alert(JSON.stringify(servicesWithStatus));
        } else {
          setServices([]);
          if (data.error) setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Add authentication check to all API calls
  const checkAuthAndProceed = async (apiCall) => {
    try {
      const result = await apiCall();
      return result;
    } catch (err) {
      if (err.message.includes("Non authentifié")) {
        window.location.href = "/login";
        return null;
      }
      throw err;
    }
  };

  // Delete service handler with authentication check
  const handleDelete = async (serviceId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce service ?")) return;

    try {
      const response = await checkAuthAndProceed(() =>
        fetch(`${API_URL}?service_id=${serviceId}`, {
          method: "DELETE",
          credentials: "include",
        })
      );

      if (!response) return;

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de la suppression");
      }

      setServices((prev) => prev.filter((s) => s.service_id !== serviceId));
      alert("Service supprimé avec succès");
    } catch (err) {
      alert(err.message);
    }
  };

  // Replace the existing handleToggleActive function with this:
  const handleToggleActive = async (service) => {
    const newStatus = !service.is_active;
    const originalStatus = service.is_active;

    try {
      // Optimistically update UI
      setServices((prev) =>
        prev.map((s) =>
          s.service_id === service.service_id
            ? { ...s, is_active: newStatus }
            : s
        )
      );

      const formData = new FormData();
      formData.append("service_id", service.service_id);
      formData.append("action", "toggle_active");
      formData.append("is_active", newStatus ? "1" : "0");

      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Échec de la mise à jour");
      }
    } catch (err) {
      // Revert UI on error
      setServices((prev) =>
        prev.map((s) =>
          s.service_id === service.service_id
            ? { ...s, is_active: originalStatus }
            : s
        )
      );
      alert("Erreur: " + err.message);
    }
  };

  useEffect(() => {
    setActiveStates((prev) => {
      if (services.length === prev.length) return prev;
      return services.map((_, i) => prev[i] ?? true);
    });

    if (currentPage > Math.ceil(services.length / CARDS_PER_PAGE) - 1) {
      setCurrentPage(
        Math.max(0, Math.ceil(services.length / CARDS_PER_PAGE) - 1)
      );
    }
  }, [services, currentPage]);

  const pageCount = Math.ceil(services.length / CARDS_PER_PAGE) || 1;

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

  // Helper for icon label (implement as needed)
  // const getIconLabel = (iconClass) => {
  //   // Example: return a label based on iconClass
  //   if (!iconClass) return "";
  //   if (iconClass === "flaticon-brand") return "Brand";
  //   // Add more mappings as needed
  //   return iconClass;
  // };

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
      {loading ? (
        <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
          Chargement...
        </div>
      ) : error ? (
        <div style={{ color: "red", textAlign: "center" }}>{error}</div>
      ) : services.length === 0 ? (
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
          <button
            onClick={handlePrev}
            style={{ ...arrowButtonStyle, left: "10px" }}
            disabled={animating}
          >
            <FaChevronLeft />
          </button>
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
              {visibleServices.map((service, index) => (
                <div
                  key={service.service_id}
                  style={{
                    ...cardStyle,
                    backgroundColor:
                      hoveredCard === service.service_id
                        ? "#FF4757"
                        : "#ff5c78",
                    cursor: "pointer",
                    marginRight: "20px",
                    transition: "background 0.3s",
                  }}
                  onMouseEnter={() => setHoveredCard(service.service_id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div style={cardContentStyle}>
                    <div style={{ fontSize: "30px" }}>
                      <img
                        src={`http://localhost/SFE-Project/backend/public/uploads/images/${service.image}`}
                        width={120}
                        height={120}
                        alt={service.nom_service}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          objectFit: "cover",
                          borderRadius: "8px",
                          onError: (e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "http://localhost/SFE-Project/backend/public/assets/placeholder.png";
                          },
                        }}
                      />
                    </div>
                    <div
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          margin: "10px 0",
                          padding: "5px",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "4px",
                          margin: "10px 0",
                          fontSize: "12px",
                          color: "#fff",
                          textAlign: "center",
                          fontWeight: "bold",
                        }}
                      >
                        <span>Les Images de Service:</span>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            gap: "5px",
                            marginTop: "5px",
                          }}
                        >
                          {service.images &&
                            service.images
                              .split(",")
                              .map((imageName, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={`http://localhost/SFE-Project/backend/public/uploads/images/${imageName.trim()}`}
                                  alt={`${service.nom_service} image ${imgIndex + 1}`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    border: "1px solid rgba(255,255,255,0.3)",
                                    cursor: "pointer", // Ajouter un curseur pointer pour indiquer que c'est cliquable
                                  }}
                                  onClick={() => {
                                    setSelectedImage(imageName.trim());
                                    setShowImageModal(true);
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src =
                                      "http://localhost/SFE-Project/backend/public/assets/placeholder.png";
                                  }}
                                />
                              ))}
                        </div>
                      </div>
                    <h2
                      style={{
                        fontSize: "16px",
                        margin: "10px 0",
                        textAlign: "center",
                      }}
                    >
                      {service.nom_service}
                    </h2>
                    <p style={{ fontSize: "12px", textAlign: "start" }}>
                      {service.description}
                    </p>
                    <h4 style={{ marginTop: "15px" }}>Détails</h4>
                    <p style={{ fontSize: "11px", textAlign: "start" }}>
                      {service.details}
                    </p>
                    {/* Sous-services section */}
                    {service.sous_services && (
                      <div style={{
                        margin: "15px 0",
                        padding: "10px",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px"
                      }}>
                        <h4 style={{ marginBottom: "10px", color: "white" }}>Sous-services</h4>
                        <div style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px"
                        }}>
                          {service.sous_services.split('|').map((sousService, idx) => {
                            const [title, description, icon] = sousService.split(':');
                            if (!title) return null;
                            
                            return (
                              <div key={idx} style={{
                                padding: "8px",
                                backgroundColor: "rgba(255, 255, 255, 0.05)",
                                borderRadius: "4px",
                                textAlign: "left"
                              }}>
                                <div style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px",
                                  marginBottom: "4px"
                                }}>
                                  <span style={{ 
                                    fontSize: "12px", 
                                    color: "rgba(255, 255, 255, 0.7)"
                                  }}>
                                    {icon}
                                  </span>
                                  <strong style={{ fontSize: "14px" }}>{title}</strong>
                                </div>
                                <p style={{ 
                                  fontSize: "12px",
                                  margin: "0",
                                  color: "rgba(255, 255, 255, 0.8)"
                                }}>
                                  {description}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                      {/* Icon display section */}
                      
                  </div>
                  <div style={buttonContainerStyle}>
                    <button
                      style={buttonStyle}
                      onClick={() =>
                        navigate(`/services/editer/${service.service_id}`)
                      }
                    >
                      <FaEdit />
                    </button>
                    <button
                      style={buttonStyle}
                      onClick={() => handleDelete(service.service_id)}
                    >
                      <FaTrash />
                    </button>
                    <button
                      style={{
                        ...buttonStyle,
                        backgroundColor: service.is_active ? "white" : "red",
                      }}
                      onClick={() => handleToggleActive(service)}
                    >
                      <FaPowerOff />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleNext}
            style={{ ...arrowButtonStyle, right: "10px" }}
            disabled={animating}
          >
            <FaChevronRight />
          </button>
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
                  background: i === currentPage ? "#FF4757" : "#ccc",
                  cursor: "pointer",
                }}
                onClick={() => !animating && setCurrentPage(i)}
              />
            ))}
          </div>
        </>
      )}

      {/* Modal pour afficher l'image en grand */}
      {showImageModal && selectedImage && (
  <div 
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.8)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2000,
    }}
    onClick={() => setShowImageModal(false)} // Ferme le modal quand on clique sur l'arrière-plan
  >
    <div 
      style={{
        position: "relative",
        maxWidth: "90vw",
        maxHeight: "90vh",
      }}
      onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique sur le conteneur de l'image
    >
      <img
        src={`http://localhost/SFE-Project/backend/public/uploads/images/${selectedImage}`}
        alt="Image agrandie"
        style={{
          maxWidth: "80%",
          maxHeight: "90vh",
          objectFit: "contain",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)"
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'http://localhost/SFE-Project/backend/public/assets/placeholder.png';
        }}
      />
      {/* Vous pouvez garder ou supprimer ce bouton, selon votre préférence */}
      <button
        onClick={() => setShowImageModal(false)}
        style={{
          position: "absolute",
          top: "-20px",
          right: "-20px",
          backgroundColor: "#FF4757",
          color: "white",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          fontSize: "20px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.3)"
        }}
      >
        ×
      </button>
    </div>
  </div>
      )}
    </div>
  );
};





// Styles remain the same
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