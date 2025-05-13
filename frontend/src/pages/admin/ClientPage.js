import HeaderPart from "../../components/admin/header";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const API_URL = "http://localhost/SFE-Project/backend/public/api/clients";

const ClientCard = ({ client, onDelete }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...cardStyle,
        backgroundColor: hovered ? "#FF4757" : "#ff5c78",
        transition: "background 0.3s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={cardContentStyle}>
        <div style={imageContainerStyle}>
          <img
            src={`http://localhost/SFE-Project/backend/public/uploads/images/${client.image}`}
            alt={client.nom_entreprise}
            style={imageStyle}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "http://localhost/SFE-Project/backend/public/assets/placeholder.png";
            }}
          />
        </div>
        <h2 style={titleStyle}>{client.nom_entreprise}</h2>
      </div>
      <div style={buttonContainerStyle}>
        <button
          style={buttonStyle}
          onClick={() => onDelete(client.id)}
          title="Supprimer"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(API_URL, { credentials: "include" });
        const data = await response.json();
        if (data.error === "Non authentifié") {
          window.location.href = "/login";
          return;
        }
        if (Array.isArray(data)) {
          setClients(data);
        } else {
          setClients([]);
          if (data.error) setError(data.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const handleDelete = async (clientId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce partenaire ?")) return;
    try {
      const response = await fetch(`${API_URL}?id_Client=${clientId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Échec de la suppression");
      }
      setClients(prevClients => prevClients.filter(c => c.id !== clientId));
      alert("Partenaire supprimé avec succès");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <HeaderPart />
      <button
        style={addButtonStyle}
        onClick={() => navigate("/clients/ajouter")}
      >
        Ajouter +
      </button>
      <div style={{ height: "50px" }}></div>
      {loading ? (
        <div style={loadingStyle}>Chargement...</div>
      ) : error ? (
        <div style={errorStyle}>{error}</div>
      ) : clients.length === 0 ? (
        <div style={emptyStyle}>Aucun partenaire à afficher.</div>
      ) : (
        <div style={gridStyle}>
          {clients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  padding: "40px 0 0 0",
  maxWidth: "1200px",
  margin: "0 auto",
  minHeight: "500px",
  position: "relative",
};

const addButtonStyle = {
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
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "32px",
  marginTop: "40px",
};

const cardStyle = {
  minHeight: "350px",
  backgroundColor: "#ff5c78",
  color: "#fff",
  borderRadius: "12px",
  padding: "20px",
  textAlign: "center",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
};

const cardContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const imageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "200px",
  backgroundColor: "white",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "20px",
};

const imageStyle = {
  maxWidth: "100%",
  maxHeight: "180px",
  objectFit: "contain",
  borderRadius: "4px",
};

const titleStyle = {
  fontSize: "18px",
  margin: "15px 0",
  textAlign: "center",
};

const buttonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 10,
};

const buttonStyle = {
  backgroundColor: "white",
  borderRadius: "50%",
  width: "36px",
  height: "36px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  color: "#FF4757",
  fontSize: "18px",
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
};

const loadingStyle = {
  textAlign: "center",
  color: "#888",
  marginTop: 40,
};

const errorStyle = {
  color: "red",
  textAlign: "center",
  marginTop: 40,
};

const emptyStyle = {
  textAlign: "center",
  color: "#888",
  fontSize: 24,
  margin: 40,
};

export default ClientsPage;