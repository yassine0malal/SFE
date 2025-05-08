import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";

const API_URL = "http://localhost/SFE-Project/backend/public/api/services";

// Define available icon options
const iconOptions = [
  { value: "flaticon-brand", label: "Brand" },
  { value: "flaticon-tablet", label: "Tablet/Mobile" },
  { value: "flaticon-satellite-dish", label: "Digital Marketing" },
  { value: "flaticon-laptop", label: "Web Development" },
  { value: "flaticon-chatting", label: "Website Design" },
  { value: "flaticon-3d", label: "3D Animation" },
  { value: "flaticon-code", label: "Programming" },
  { value: "flaticon-web-design", label: "Web Design" }
];

export default function ServiceFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    className: "flaticon-brand" ,// Added default icon class
    nom_service: "",
    description: "",
    details: "",
    is_active: true,
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchServiceData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}?service_id=${id}`, {
            credentials: 'include'
          });
          
          if (!response.ok) throw new Error(`Erreur de récupération du service: ${response.status}`);
          
          const data = await response.json();
          if (data.error === "Non authentifié") window.location.href = "/login";
          if (data.error) throw new Error(data.error);

          const service = Array.isArray(data) ? data[0] : data;
          if (service) {
            setFormData({
              nom_service: service.nom_service,
              description: service.description,
              details: service.details,
              is_active: service.is_active === 1 || service.is_active === true,
              image: null,
              className: service.className || "flaticon-brand" // Add this line
            });
            
            if (service.image) {
              setImagePreview(`http://localhost/SFE-Project/backend/public/uploads/images/${service.image}`);
            }
          }
        } catch (err) {
          setError(err.message);
          alert(`Erreur: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchServiceData();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === "file") {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let formDataToSend = new FormData();
      
      if (isEditing) {
        formDataToSend.append("service_id", id);
      }
      
      formDataToSend.append("nom_service", formData.nom_service);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("is_active", formData.is_active ? 1 : 0);
      formDataToSend.append("className", formData.className); // Add this line

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const method = isEditing ? "POST" : "POST"; // Always use POST for FormData
      const url = API_URL + (isEditing ? "" : "");

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        body: formDataToSend
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Une erreur est survenue");
      }

      alert(isEditing ? "Service modifié avec succès!" : "Service ajouté avec succès!");
      navigate("/services");
      
    } catch (err) {
      alert("Erreur: " + err.message);
      console.error("Submission error:", err);
    }
  };
// Function to render icon preview
const renderIconPreview = () => {
  return (
    <div style={styles.iconPreviewContainer}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <i className={formData.className} style={styles.iconPreview}></i>
        <p style={{...styles.iconNote, marginTop: "5px"}}>
          Sélectionnez une icône qui représente ce service
        </p>
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div style={styles.container}>
        <HeaderPart />
        <div style={{ height: "60px" }}></div>
        <div style={styles.loadingMessage}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <HeaderPart />
      <div style={{ height: "60px" }}></div>
      
      <div style={styles.formContainer}>
        <h1 style={styles.title}>
          {isEditing ? "Modifier le service" : "Ajouter un service"}
        </h1>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nom du service</label>
            <input
              type="text"
              name="nom_service"
              value={formData.nom_service}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Détails</label>
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
          </div>
          
          {/* New icon class selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Icône du service</label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              style={styles.input}
              required
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {renderIconPreview()}
            {/* <p style={styles.iconNote}>Sélectionnez une icône qui représente ce service</p> */}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Service actif
            </label>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Image</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={styles.fileInput}
              required={!isEditing}
            />
            
            {imagePreview && (
              <div style={styles.imagePreviewContainer}>
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  style={styles.imagePreview}
                />
                {isEditing && !formData.image && (
                  <p style={styles.imageNote}>Image actuelle (cliquez sur Parcourir pour changer)</p>
                )}
              </div>
            )}
          </div>
          
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/services")}
              style={styles.cancelButton}
            >
              Annuler
            </button>
            <button type="submit" style={styles.submitButton}>
              {isEditing ? "Mettre à jour" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Keep the same styles object

// Styles
const styles = {
  container: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  loadingMessage: {
    textAlign: "center",
    marginTop: "100px",
    fontSize: "18px",
    color: "#666",
  },
  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  formContainer: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    color: "#333",
    marginBottom: "30px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#555",
  },
  input: {
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  },
  textarea: {
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    minHeight: "100px",
    resize: "vertical",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    color: "#555",
    cursor: "pointer",
  },
  fileInput: {
    padding: "10px 0",
  },
  // New styles for icon preview
  iconPreviewContainer: {
    marginTop: "10px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
  },
  iconPreview: {
    fontSize: "40px",
    color: "#FF5C78",
  },
  iconNote: {
    fontSize: "14px",
    color: "#666",
    marginTop: "2px",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  submitButton: {
    padding: "12px 24px",
    backgroundColor: "#FF5C78",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
