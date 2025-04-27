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
  const navigate = useNavigate();

  // Fetch services from API with authentication check
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(API_URL, {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        // Check if user is not authenticated
        if (data.error === "Non authentifié") {
          // Redirect to login page
          window.location.href = "/login";
          return;
        }
        
        if (!response.ok) {
          throw new Error('Erreur de récupération des services');
        }
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          // Convert numeric values to booleans
          const servicesWithStatus = data.map(service => ({
            ...service,
            is_active: service.is_active === '1'
          }));
          setServices(servicesWithStatus);
        } else {
          setServices([]);
          if (data.error) {
            setError(data.error);
          }
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
      // If the error is due to authentication
      if (err.message.includes('Non authentifié')) {
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
          method: 'DELETE',
          credentials: 'include'
        })
      );
      
      if (!response) return; // Authentication failed
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Échec de la suppression');
      }
      
      setServices(prev => prev.filter(s => s.service_id !== serviceId));
      alert('Service supprimé avec succès');
    } catch (err) {
      alert(err.message);
    }
  };

  // Toggle active status with authentication check
  const handleToggleActive = async (service) => {
    const newStatus = !service.is_active;
    const originalStatus = service.is_active;
    
    try {
      // Mise à jour optimiste immédiate
      setServices(prev =>
        prev.map(s =>
          s.service_id === service.service_id
            ? { ...s, is_active: newStatus }
            : s
        )
      );
      
      const response = await checkAuthAndProceed(() => 
        fetch(API_URL, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            service_id: service.service_id,
            nom_service: service.nom_service,
            description: service.description,
            details: service.details,
            image: service.image,
            is_active: newStatus ? 1 : 0 // Conversion en numérique
          })
        })
      );
      
      if (!response) return; // Authentication failed
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Échec de la mise à jour');
      }
    } catch (err) {
      // Revert en cas d'erreur
      setServices(prev =>
        prev.map(s =>
          s.service_id === service.service_id
            ? { ...s, is_active: originalStatus }
            : s
        )
      );
      alert('Erreur: ' + err.message);
    }
  };

  // Rest of your component remains the same...
  // Update active states
  useEffect(() => {
    setActiveStates(prev => {
      if (services.length === prev.length) return prev;
      return services.map((_, i) => prev[i] ?? true);
    });
    
    if (currentPage > Math.ceil(services.length / CARDS_PER_PAGE) - 1) {
      setCurrentPage(Math.max(0, Math.ceil(services.length / CARDS_PER_PAGE) - 1));
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
        <div style={{ color: 'red', textAlign: 'center' }}>
          {error}
        </div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888", fontSize: 24, margin: 40 }}>
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
                      hoveredCard === service.service_id ? "#FF4757" : "#ff5c78",
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
                          maxWidth: '100%',
                          height: 'auto',
                          objectFit: 'cover',
                          borderRadius: '8px',
                          // Add fallback for broken images
                          onError: (e) => {
                            e.target.onerror = null;
                            e.target.src = 'http://localhost/SFE-Project/backend/public/assets/placeholder.png';
                          }
                        }}
                      />
                    </div>
                    <h2 style={{ fontSize: "16px", margin: "10px 0", textAlign: "center" }}>
                      {service.nom_service}
                    </h2>
                    <p style={{ fontSize: "12px", textAlign: "start" }}>
                      {service.description}
                    </p>
                    <h4 style={{ marginTop: "15px" }}>Détails</h4>
                    <p style={{ fontSize: "11px", textAlign: "start" }}>{service.details}</p>
                  </div>
                  <div style={buttonContainerStyle}>
                    <button
                      style={buttonStyle}
                      onClick={() => navigate(`/services/editer/${service.service_id}`)}
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
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "20px" }}>
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
