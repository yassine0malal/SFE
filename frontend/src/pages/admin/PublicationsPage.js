// import React, { useState } from "react";
// import HeaderPart from "../../components/admin/header";
// import { useNavigate } from "react-router-dom";

// import {
//   FaChevronLeft,
//   FaChevronRight,
//   FaEdit,
//   FaTrash,
//   FaPowerOff,
// } from "react-icons/fa";

// // Example data (replace with your real data or fetch from backend)
// const initialProjects = [
//   {
//     id_publication: 1,
//     title: "Gestion de stock",
//     images: [
//       "/images/reel_site1.jpg",
//       "/images/reel_site2.jpg",
//       "/images/reel_site3.jpg",
//     ],
//     description:
//       "Le Singleton assure qu'une classe ne peut avoir qu'une seule instance et fournit un point d'accès global à cette instance.",
//     client: "Société marocaine de pintering",
//     site: "https://monsite1.com",
//   },
//   {
//     id_publication: 2,
//     title: "E-commerce",
//     images: [
//       "/images/reel_site1.jpg",
//       "/images/reel_site3.jpg",
//     ],
//     description:
//       "Plateforme e-commerce moderne avec gestion des paiements et catalogue dynamique.",
//     client: "Boutique XYZ",
//     site: "https://boutique-xyz.com",
//   },
//   // Ajoute d'autres projets ici...
// ];

// export default function PublicationsPage() {
//   const [projects, setProjects] = useState(initialProjects);
//   const [current, setCurrent] = useState(0);
//   const [imgIndex, setImgIndex] = useState(0);
//   const [activeStates, setActiveStates] = useState(initialProjects.map(() => true));
//   const navigate = useNavigate();

//   const project = projects[current];

//   // Change project slide
//   const goPrev = () => {
//     setCurrent((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
//     setImgIndex(0);
//   };
//   const goNext = () => {
//     setCurrent((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
//     setImgIndex(0);
//   };

//   // Change image inside project
//   const prevImg = () => {
//     setImgIndex((i) =>
//       i === 0 ? project.images.length - 1 : i - 1
//     );
//   };
//   const nextImg = () => {
//     setImgIndex((i) =>
//       i === project.images.length - 1 ? 0 : i + 1
//     );
//   };

//   // Supprimer une publication
//   const handleDelete = () => {
//     if (window.confirm("Voulez-vous vraiment supprimer cette publication ?")) {
//       const updatedProjects = projects.filter((_, idx) => idx !== current);
//       const updatedActive = activeStates.filter((_, idx) => idx !== current);
//       setProjects(updatedProjects);
//       setActiveStates(updatedActive);
//       if (updatedProjects.length === 0) {
//         setCurrent(0);
//         setImgIndex(0);
//       } else {
//         setCurrent((prev) =>
//           prev >= updatedProjects.length ? Math.max(0, updatedProjects.length - 1) : prev
//         );
//         setImgIndex(0);
//       }
//     }
//   };

//   // Activer/désactiver une publication
//   const handleToggleActive = () => {
//     const updated = [...activeStates];
//     updated[current] = !updated[current];
//     setActiveStates(updated);
//   };

//   return (
//     <div style={containerStyle}>
//       <HeaderPart />
//       <div style={topBarStyle}>
//       <button
//   style={{
//     ...addBtnStyle,
//     backgroundColor: "#FF5C78",
    
//   }}
//   onClick={() => navigate("/publications/ajouter")}
// >
//   Ajouter +
// </button>
//       </div>
//       <div style={sliderWrapperStyle}>
//         {/* Left Arrow */}
//         <button style={iconBtnStyle} onClick={goPrev} disabled={projects.length === 0}>
//           <FaChevronLeft />
//         </button>

//         {/* Card */}
//         {projects.length === 0 ? (
//           <div style={{ color: "#888", fontSize: 24, margin: 40 }}>
//             Aucune réalisation à afficher.
//           </div>
//         ) : (
//           <div style={cardStyle}>
//             {/* Edit/Delete/Power buttons */}
//             <div style={iconBarStyle}>
//               <button style={iconBtnStyle}><FaEdit /></button>
//               <button style={iconBtnStyle} onClick={handleDelete}><FaTrash /></button>
//               <button
//                 style={{
//                   ...iconBtnStyle,
//                   background: activeStates[current] ? "#fff" : "#FF4757",
//                   color: activeStates[current] ? "#222" : "#fff",
//                 }}
//                 onClick={handleToggleActive}
//               >
//                 <FaPowerOff />
//               </button>
//             </div>
//             {/* Title */}
//             <div style={titleBarStyle}>{project.title}</div>
//             {/* Image slider */}
//             <div style={imgSliderStyle}>
//               <button style={imgArrowBtnStyle("left")} onClick={prevImg} disabled={project.images.length <= 1}>&lt;</button>
//               <img
//                 src={project.images[imgIndex]}
//                 alt={project.title}
//                 style={imgStyle}
//               />
//               <button style={imgArrowBtnStyle("right")} onClick={nextImg} disabled={project.images.length <= 1}>&gt;</button>
//             </div>
//             {/* Dots for images */}
//             <div style={dotsRowStyle}>
//               {project.images.map((_, i) => (
//                 <span
//                   key={i}
//                   style={{
//                     ...dotStyle,
//                     background: i === imgIndex ? "#FF5C78" : "#ccc",
//                   }}
//                   onClick={() => setImgIndex(i)}
//                 />
//               ))}
//             </div>
//             {/* Description and client */}
//             <div style={descRowStyle}>
//               <div>
//                 <div style={descTitleStyle}>Description Projet</div>
//                 <div style={descTextStyle}>{project.description}</div>
//               </div>
//               <div>
//                 <div style={descTitleStyle}>Détails du client</div>
//                 <div style={descTextStyle}>{project.client}</div>
//               </div>
//             </div>
//             {/* Visit site button */}
//             <a
//               href={project.site}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={visitBtnStyle}
//             >
//               Visitez le site
//             </a>
//           </div>
//         )}

//         {/* Right Arrow */}
//         <button style={iconBtnStyle} onClick={goNext} disabled={projects.length === 0}>
//           <FaChevronRight />
//         </button>
//       </div>
//       {/* Pagination dots for projects */}
//       <div style={dotsRowStyle}>
//         {projects.map((_, i) => (
//           <span
//             key={i}
//             style={{
//               ...dotStyle,
//               background: i === current ? "#FF5C78" : "#ccc",
//             }}
//             onClick={() => { setCurrent(i); setImgIndex(0); }}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// // ...styles identiques à ta version précédente...

// // --- Styles ---
// const containerStyle = {
//   width: "100%",
//   minHeight: "100vh",
//   background: "#fff",
//   padding: "0",
//   boxSizing: "border-box",
// };

// const topBarStyle = {
//   display: "flex",
//   justifyContent: "flex-start",
//   alignItems: "center",
//   margin: "0 0 1rem 0",
//   padding: "0 2rem",
// };

// const addBtnStyle = {
//   background: "#FF5C78",
//   color: "#fff",
//   fontWeight: "bold",
//   fontSize: "1.2rem",
//   border: "none",
//   borderRadius: "8px",
//   padding: "12px 32px",
//   cursor: "pointer",
//   marginTop: "1rem",
// };

// const sliderWrapperStyle = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   gap: "1rem",
//   width: "100%",
//   minHeight: 600,
// };

// const cardStyle = {
//   background: "#FFD1DB",
//   border: "3px solid #1e90ff",
//   borderRadius: "18px",
//   padding: "1.5rem 2rem 2rem 2rem",
//   minWidth: 900,
//   maxWidth: 1200,
//   minHeight: 500,
//   boxSizing: "border-box",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   position: "relative",
//   boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
// };

// const iconBarStyle = {
//   position: "absolute",
//   top: 18,
//   left: 18,
//   display: "flex",
//   gap: "12px",
// };

// const iconBtnStyle = {
//   background: "#fff",
//   border: "none",
//   borderRadius: "50%",
//   width: 36,
//   height: 36,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   fontSize: "1.2rem",
//   cursor: "pointer",
//   boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
//   color: "#222",
// };

// const titleBarStyle = {
//   background: "#fff0f3",
//   color: "#222",
//   fontWeight: "bold",
//   fontSize: "2rem",
//   borderRadius: "10px",
//   padding: "0.5rem 2.5rem",
//   margin: "0 0 1.5rem 0",
//   textAlign: "center",
//   alignSelf: "center",
// };

// const imgSliderStyle = {
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   width: "100%",
//   marginBottom: "1rem",
//   marginTop: "0.5rem",
// };

// const imgArrowBtnStyle = (side) => ({
//   background: "none",
//   border: "none",
//   fontSize: "2rem",
//   color: "#888",
//   cursor: "pointer",
//   margin: side === "left" ? "0 10px 0 0" : "0 0 0 10px",
//   padding: 0,
//   height: 80,
//   display: "flex",
//   alignItems: "center",
// });

// const imgStyle = {
//   width: 600,
//   height: 300,
//   objectFit: "cover",
//   borderRadius: "16px",
//   boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
//   background: "#fff",
// };

// const dotsRowStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   gap: "8px",
//   margin: "1rem 0",
// };

// const dotStyle = {
//   width: 12,
//   height: 12,
//   borderRadius: "50%",
//   background: "#ccc",
//   display: "inline-block",
//   cursor: "pointer",
//   transition: "background 0.3s",
// };

// const descRowStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   width: "100%",
//   margin: "1.5rem 0 1rem 0",
//   gap: "2rem",
// };

// const descTitleStyle = {
//   fontWeight: "bold",
//   fontSize: "1.1rem",
//   marginBottom: "0.5rem",
//   letterSpacing: "1px",
// };

// const descTextStyle = {
//   fontSize: "1rem",
//   color: "#222",
//   maxWidth: 400,
// };

// const visitBtnStyle = {
//   margin: "1.5rem auto 0 auto",
//   display: "block",
//   background: "#FF5C78",
//   color: "#fff",
//   fontWeight: "bold",
//   fontSize: "1.3rem",
//   border: "none",
//   borderRadius: "12px",
//   padding: "16px 48px",
//   cursor: "pointer",
//   letterSpacing: "2px",
//   textDecoration: "none",
//   textAlign: "center",
// };


















import React, { useState, useEffect } from "react";
import HeaderPart from "../../components/admin/header";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaTrash,
  FaPowerOff,
} from "react-icons/fa";

const API_URL = "http://localhost/SFE-Project/backend/public/api/publications";

export default function PublicationsPage() {
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
    
    const publicationId = publications[current].id_publication;
    
    try {
      const response = await fetch(`${API_URL}?id_publication=${publicationId}`, {
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

  const handleToggleActive = async () => {
    const publication = publications[current];
    const newStatus = !activeStates[current];
    const originalStatus = activeStates[current];

    try {
      // Optimistic update
      setActiveStates(prev => {
        const updated = [...prev];
        updated[current] = newStatus;
        return updated;
      });

      const response = await fetch(API_URL, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_publication: publication.id_publication,
          is_active: newStatus ? 1 : 0,
          lien_web_site: publication.site,
          id_service: publication.id_service
        })
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'La mise à jour a échoué');
      }
    } catch (err) {
      // Revert on error
      setActiveStates(prev => {
        const updated = [...prev];
        updated[current] = originalStatus;
        return updated;
      });
      alert('Erreur: ' + err.message);
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
    const publication = publications[current];
    setImgIndex((i) => 
      i === 0 ? publication.images.length - 1 : i - 1
    );
  };

  const nextImg = () => {
    const publication = publications[current];
    setImgIndex((i) =>
      i === publication.images.length - 1 ? 0 : i + 1
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

  // Rest of your JSX remains largely the same, just update the data references
  return (
    <div style={containerStyle}>
      <HeaderPart />
      <div style={topBarStyle}>
        <button
          style={addBtnStyle}
          onClick={() => navigate(`/publications/ajouter`)}
        >
          Ajouter +
        </button>
      </div>
      <div style={sliderWrapperStyle}>
        <button style={iconBtnStyle} onClick={goPrev} disabled={publications.length === 0}>
          <FaChevronLeft />
        </button>

        {publications.length === 0 ? (
          <div style={{ color: "#888", fontSize: 24, margin: 40 }}>
            Aucune publication à afficher.
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={iconBarStyle}>
              <button 
                style={iconBtnStyle}
                onClick={() => navigate(`/publications/editer/${publication.id_publication}`)}
              >
                <FaEdit />
              </button>
              <button style={iconBtnStyle} onClick={handleDelete}>
                <FaTrash />
              </button>
              
            </div>

            <div style={titleBarStyle}>{publication.title}</div>
            <div style={subtitleBarStyle}>service : {publication.nom_service}</div>

            <div style={imgSliderStyle}>
  <button 
    style={imgArrowBtnStyle("left")} 
    onClick={prevImg} 
    disabled={publication.images.length <= 1}
  >
    &lt;
  </button>
  
  <div style={imageContainerStyle}>
    <img
      src={`http://localhost/SFE-Project/backend/public/uploads/${publication.images[imgIndex]}`}
      alt={publication.title}
      style={imgStyle}
    />
  </div>
  
  <button 
    style={imgArrowBtnStyle("right")} 
    onClick={nextImg} 
    disabled={publication.images.length <= 1}
  >
    &gt;
  </button>
</div>

            <div style={dotsRowStyle}>
              {publication.images.map((_, i) => (
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
                <div style={descTitleStyle}>Client</div>
                <div style={descTextStyle}>{publication.client}</div>
              </div>
            </div>

            <a
  href={publication.site} // Changé de publication.site à publication.lien_web_site
  target="_blank"
  rel="noopener noreferrer"
  style={{
    ...visitBtnStyle,
    '&:hover': {
      background: '#ff4757',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(255,92,120,0.3)',
    }
  }}
>
  Visitez le site
</a>
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
  objectFit: "contain", // Changez de 'cover' à 'contain'
  borderRadius: "16px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  background: "#fff",
  padding: "10px"
};

// Ajoutez ce nouveau style pour le conteneur d'image
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