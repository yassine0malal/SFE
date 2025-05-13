import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";

const ClientAjouterPage = () => {
  const [formData, setFormData] = useState({
    nom_entreprise: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nom_entreprise) {
      setError("Le nom de l'entreprise est requis");
      return;
    }
    if (!selectedImage) {
      setError("Une image est requise");
      return;
    }

    setLoading(true);
    setError("");

    const formPayload = new FormData();
    formPayload.append("nom_entreprise", formData.nom_entreprise);
    formPayload.append("image", selectedImage);

    try {
      const response = await fetch(
        "http://localhost/SFE-Project/backend/public/api/clients",
        {
          method: "POST",
          body: formPayload,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'ajout du partenaire");
      }

      alert("Partenaire ajouté avec succès!");
      navigate("/clients");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <HeaderPart />
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Ajouter un nouveau partenaire</h2>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Nom de l'entreprise</label>
            <input
              type="text"
              name="nom_entreprise"
              value={formData.nom_entreprise}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Nom de l'entreprise"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Logo de l'entreprise</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={fileInputStyle}
            />
            {imagePreview && (
              <div style={imagePreviewContainerStyle}>
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  style={imagePreviewStyle}
                />
              </div>
            )}
          </div>

          <div style={buttonGroupStyle}>
            <button
              type="button"
              onClick={() => navigate("/clients")}
              style={cancelButtonStyle}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              style={submitButtonStyle}
              disabled={loading}
            >
              {loading ? "Chargement..." : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  padding: "20px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const formContainerStyle = {
  backgroundColor: "white",
  borderRadius: "10px",
  padding: "30px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  maxWidth: "800px",
  margin: "40px auto",
};

const titleStyle = {
  color: "#FF5C78",
  marginBottom: "30px",
  textAlign: "center",
  fontSize: "24px",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
};

const labelStyle = {
  fontWeight: "bold",
  fontSize: "14px",
  color: "#333",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const fileInputStyle = {
  padding: "10px 0",
};

const imagePreviewContainerStyle = {
  marginTop: "10px",
  border: "1px solid #ddd",
  borderRadius: "6px",
  padding: "10px",
  display: "flex",
  justifyContent: "center",
};

const imagePreviewStyle = {
  maxWidth: "100%",
  maxHeight: "200px",
  objectFit: "contain",
};

const buttonGroupStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "20px",
};

const buttonBaseStyle = {
  padding: "12px 24px",
  borderRadius: "6px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

const submitButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: "#FF5C78",
  color: "white",
};

const cancelButtonStyle = {
  ...buttonBaseStyle,
  backgroundColor: "#f0f0f0",
  color: "#333",
};

const errorStyle = {
  backgroundColor: "#ffebee",
  color: "#c62828",
  padding: "10px",
  borderRadius: "4px",
  marginBottom: "20px",
  fontSize: "14px",
};

export default ClientAjouterPage;
