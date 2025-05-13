import React, { useState, useEffect } from "react";
import HeaderPart from "../../components/admin/header";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const API_URL = "http://localhost/SFE-Project/backend/public/api/galerie";

export default function GalariePage() {
  const [publications, setPublications] = useState([]);
  const [current, setCurrent] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const [activeStates, setActiveStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch publications
  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch(API_URL, {
          credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.error === "Non authentifié") {
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          throw new Error('Erreur de récupération des publications');
        }

        if (Array.isArray(data)) {
          setPublications(data);
          setActiveStates(data.map(pub => pub.is_active === '1'));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPublications();
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette publication ?")) return;
    
    const publicationId = publications[current].id_galerie;
    
    try {
      const response = await fetch(`${API_URL}?id_galerie=${publicationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Échec de la suppression');
      }

      const updatedPublications = publications.filter((_, idx) => idx !== current);
      setPublications(updatedPublications);
      setActiveStates(prev => prev.filter((_, idx) => idx !== current));
      
      if (updatedPublications.length === 0) {
        setCurrent(0);
        setImgIndex(0);
      } else {
        setCurrent(prev => 
          prev >= updatedPublications.length ? updatedPublications.length - 1 : prev
        );
      }

      alert('Publication supprimée avec succès');
    } catch (err) {
      alert(err.message);
    }
  };



  // Navigation handlers
  const goPrev = () => {
    setCurrent((prev) => (prev === 0 ? publications.length - 1 : prev - 1));
    setImgIndex(0);
  };

  const goNext = () => {
    setCurrent((prev) => (prev === publications.length - 1 ? 0 : prev + 1));
    setImgIndex(0);
  };

  const prevImg = () => {
    setImgIndex((i) => 
      i === 0 ? sliderImages.length - 1 : i - 1
    );
  };

  const nextImg = () => {
    setImgIndex((i) =>
      i === sliderImages.length - 1 ? 0 : i + 1
    );
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <HeaderPart />
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          Chargement...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <HeaderPart />
        <div style={{ color: "red", textAlign: "center", marginTop: "100px" }}>
          {error}
        </div>
      </div>
    );
  }

  const publication = publications[current];

  // Build the images array for the slider
  let sliderImages = [];
  if (publication) {
    sliderImages = [
      ...(publication.first_image ? [publication.first_image.replace('/images/', '')] : []),
      ...(
        Array.isArray(publication.images)
          ? publication.images.map(img => img.replace('/images/', ''))
          : []
      )
    ];
    // Remove duplicates if first_image is already in images
    sliderImages = sliderImages.filter((img, idx, arr) => arr.indexOf(img) === idx);
  }
  const calculateDiscountedPrice = (price, promotion) => {
    if (!price || !promotion || promotion <= 0) return parseFloat(price).toFixed(2);
    
    const discountAmount = (parseFloat(promotion) * parseFloat(price)) / 100;
    return (parseFloat(price) - discountAmount).toFixed(2);
  };

  // Modifier le style de la bannière de promotion
const promotionBannerStyle = {
  position: "absolute",
  top: 150,
  left: 630,
  right: -40,
  transform: "rotate(45deg)",
  transformOrigin: "right top",
  background: publication.promotion && publication.promotion !== "0" && publication.promotion.trim() !== "" ? "#F1F507" : "#FF5C78",
  color: publication.promotion && publication.promotion !== "0" && publication.promotion.trim() !== "" ? "#E31A37" : "#fff",
  fontWeight: "bold",
  fontSize: "1.8rem",
  padding: "8px 50px",
  boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
  zIndex: 50,
  letterSpacing: "2px",
  border: "2px solid #E31A37",
  minWidth: "200px",
  textAlign: "center",
  userSelect: "none",
  pointerEvents: "none"
};
  return (
    <div style={containerStyle}>
      <HeaderPart />
      <div style={topBarStyle}>
        <button
          style={addBtnStyle}
          onClick={() => navigate(`/galerie/ajouter`)}
        >
          Ajouter +
        </button>
      </div>
      <div style={sliderWrapperStyle}>
        <button style={iconBtnStyle} onClick={goPrev} disabled={publications.length === 0}>
          <FaChevronLeft />
        </button>
        {/* <pre>{JSON.stringify(publication)}</pre> */}

        {publications.length === 0 ? (
          <div style={{ color: "#888", fontSize: 24, margin: 40 }}>
            Aucune chose dans le galerie à afficher.
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={iconBarStyle}>
              {/* Bannière promotion toujours visible, bien lisible et bien placée */}
              {publication.promotion && publication.promotion !== "0" && publication.promotion.trim() !== "" && (
                <div style={promotionBannerStyle}>
                  {publication.promotion.startsWith("-") || publication.promotion.endsWith("%")
                    ? publication.promotion
                    : `-${publication.promotion}%`}
                </div>
              )}
              <button 
                style={iconBtnStyle}
                onClick={() => navigate(`/galerie/editer/${publication.id_galerie}`)}
              >
                <FaEdit />
              </button>
              <button style={iconBtnStyle} onClick={handleDelete}>
                <FaTrash />
              </button>
              
            </div>

            <div style={titleBarStyle}>{publication.title}</div>
            <div style={subtitleBarStyle}><span style={{color:"#FF5C78"}}> service : </span> {publication.nom_service}</div>

       

            <div style={imgSliderStyle}>
  <button 
    style={imgArrowBtnStyle("left")} 
    onClick={prevImg} 
    disabled={sliderImages.length <= 1}
  >
    &lt;
  </button>
  
  <div style={imageContainerStyle}>
    <img
      src={`http://localhost/SFE-Project/backend/public/uploads/images/${sliderImages[imgIndex]}`}
      alt={publication.title}
      style={imgStyle}
    />
  </div>
  
  <button 
    style={imgArrowBtnStyle("right")} 
    onClick={nextImg} 
    disabled={sliderImages.length <= 1}
  >
    &gt;
  </button>
</div>

            <div style={dotsRowStyle}>
              {sliderImages.map((_, i) => (
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

            <div style={descRowStyle}>
              <div>
                <div style={descTitleStyle}>Description Projet</div>
                <div style={descTextStyle}>{publication.description}</div>
              </div>
              <div>
              <div style={descTitleStyle}>Prix</div>
                {publication.promotion > 0 ? (
                  <>
                    <del>
                      <span style={{...descTextStyle}}>
                        {parseFloat(publication.prix).toFixed(2)} DH
                      </span>
                    </del> 
                    <div style={prixsyle}>
                      {calculateDiscountedPrice(publication.prix, publication.promotion)} DH
                    </div>
                  </>
                ) : (
                  <div style={prixsyle}>
                    {parseFloat(publication.prix).toFixed(2)} DH
                  </div>
                )}
              </div>
            </div>

            
          </div>
          
        )}

        <button style={iconBtnStyle} onClick={goNext} disabled={publications.length === 0}>
          <FaChevronRight />
        </button>
      </div>

      <div style={dotsRowStyle}>
        {publications.map((_, i) => (
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

// Your existing styles remain the same



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
  overflow: "hidden", // <-- AJOUTE CETTE LIGNE
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
const subtitleBarStyle = {
  // background: "#fff0f3",
  color: "#222",
  fontWeight: "bold",
  fontSize: "1.2rem",
  borderRadius: "10px",
  padding: "0.5rem 2.5rem",
  margin: "0 0 1.5rem 0",
  textAlign: "center",
  alignSelf: "center",
};

// Modifiez ces styles existants
const imgSliderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  margin: "1rem 0",
  position: "relative"
};

const imgStyle = {
  maxWidth: "100%",
  maxHeight: "400px", // Hauteur maximale fixe
  width: "auto",
  height: "auto",
  objectFit: "contain", // Affiche toute l'image
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  background: "#fff",
  padding: "10px"
};

// Ajouter ce nouveau style pour le conteneur d'image
const imageContainerStyle = {
  position: "relative",
  maxWidth: "800px",
  maxHeight: "500px",
  width: "90%",
  height: "400px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "16px",
  overflow: "hidden",
  margin: "0 auto"
};

const imgArrowBtnStyle = (side) => ({
  background: "rgba(255, 255, 255, 0.9)",
  border: "none",
  fontSize: "1.5rem",
  color: "#FF5C78",
  cursor: "pointer",
  padding: "12px",
  height: 50,
  width: 50,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
  margin: side === "left" ? "0 15px 0 0" : "0 0 0 15px",
  transform: `translateX(${side === "left" ? "-10px" : "10px"})`,
  opacity: 0.8,
  "&:hover": {
    background: "#FF5C78",
    color: "#fff",
    opacity: 1,
    transform: `translateX(${side === "left" ? "-5px" : "5px"})`,
  },
  "&:disabled": {
    background: "#f0f0f0",
    color: "#ccc",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.5,
  }
});

const buttonHoverStyles = {
  transform: "scale(1.05)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
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
const prixsyle = {
  fontSize: "1rem",
  color: "#FF0033",
  fontSize: "1.2rem",
  fontWeight: "bold",
  maxWidth: 400,
};

const visitBtnStyle = {
  margin: "1.5rem auto 0 auto",
  display: "block",
  background: "#F1F507",
  color: "#E31A37",
  fontWeight: "bold",
  fontSize: "2rem",
  border: "none",
  borderRadius: "12px",
  padding: "16px 48px",
  cursor: "pointer",
  letterSpacing: "2px",
  textDecoration: "none",
  textAlign: "center",
};
