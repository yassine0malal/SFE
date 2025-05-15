import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
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

  const fileInputRef = useRef();

  // Sous-services state
  const [sousServices, setSousServices] = useState([
    { title: "", description: "", icon: iconOptions[0].value },
    { title: "", description: "", icon: iconOptions[0].value },
    { title: "", description: "", icon: iconOptions[0].value },
    { title: "", description: "", icon: iconOptions[0].value }
  ]);
  const [sousServicesCount, setSousServicesCount] = useState(0);

  useEffect(() => {
    setSousServices(prev => {
      const arr = [...prev];
      if (sousServicesCount > arr.length) {
        // Add new empty sous-services
        for (let i = arr.length; i < sousServicesCount; i++) {
          arr.push({ title: "", description: "", icon: iconOptions[0].value });
        }
      } else if (sousServicesCount < arr.length) {
        // Remove extra sous-services
        arr.length = sousServicesCount;
      }
      return arr;
    });
    // eslint-disable-next-line
  }, [sousServicesCount]);

  // Multiple images state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    className: "flaticon-brand",
    nom_service: "",
    description: "",
    details: "",
    is_active: true
  });

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

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
              className: service.className || "flaticon-brand"
            });
            // TODO: Load sousServices and images if editing
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

  // Handle main form fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Handle sous-services
  const handleSousServiceChange = (idx, field, value) => {
    setSousServices(prev => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  // Handle multiple images
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleRemoveNewImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // Handler for main image
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    setMainImagePreview(file ? URL.createObjectURL(file) : null);
  };

  // Build sous_services string for backend
  const buildSousServicesString = () => {
    return sousServices
      .filter(s => s.title.trim() !== "")
      .map(s => `${s.title.trim()}:${s.description.trim()}:${s.icon}`)
      .join("|");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.nom_service.trim()) newErrors.nom_service = "Nom du service requis";
    if (!formData.description.trim()) newErrors.description = "Description requise";
    if (!formData.details.trim()) newErrors.details = "Détails requis";
    if (!mainImage && !isEditing) newErrors.main_image = "Image principale requise";
    if (images.length < 1) newErrors.images = "Au moins une image requise";

    // Validation sous-services : soit aucun rempli, soit tous remplis (titre ET description)
    const sousServicesRemplis = sousServices.filter(s => s.title.trim() !== "" || s.description.trim() !== "");
    if (sousServicesRemplis.length > 0 && sousServicesRemplis.length < sousServicesCount) {
      newErrors.sous_services = "Veuillez remplir tous les sous-services ou aucun.";
    } else if (sousServicesRemplis.length === sousServicesCount) {
      // Vérifie que chaque sous-service a bien un titre ET une description
      for (let i = 0; i < sousServicesCount; i++) {
        if (!sousServices[i].title.trim() || !sousServices[i].description.trim()) {
          newErrors.sous_services = "Chaque sous-service doit avoir un titre et une description.";
          break;
        }
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      let formDataToSend = new FormData();
      if (isEditing) formDataToSend.append("service_id", id);

      formDataToSend.append("nom_service", formData.nom_service);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("details", formData.details);
      formDataToSend.append("is_active", formData.is_active ? 1 : 0);
      formDataToSend.append("sous_services", buildSousServicesString());

      // Main image
      if (mainImage) formDataToSend.append("main_image", mainImage);

      // Other images (the "Images" input)
      images.forEach((img) => {
        formDataToSend.append("images[]", img);
      });

      const response = await fetch(API_URL, {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   
        method: "POST",
        credentials: 'include',
        body: formDataToSend
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Une erreur est survenue");

      alert(isEditing ? "Service modifié avec succès!" : "Service ajouté avec succès!");
      navigate("/services");
    } catch (err) {
      alert("Erreur: " + err.message);
      console.error("Submission error:", err);
    }
  };

  // Icon preview for main service
  const renderIconPreview = () => (
    <div style={styles.iconPreviewContainer}>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <i className={formData.className} style={styles.iconPreview}></i>
        <p style={{...styles.iconNote, marginTop: "5px"}}>
          Sélectionnez une icône qui représente ce service
        </p>
      </div>
    </div>
  );

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
          {/* Sous-services */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Nombre de sous-services (0 ou plus)
            </label>
            <input
              type="number"
              min={0}
              value={sousServicesCount}
              onChange={e => setSousServicesCount(Math.max(0, Number(e.target.value)))}
              style={{ ...styles.input, width: 120, marginBottom: 12 }}
            />
            {sousServices.slice(0, sousServicesCount).map((sous, idx) => (
              <div key={idx} style={{border: "1px solid #eee", borderRadius: 4, padding: 10, marginBottom: 10}}>
                <div style={{display: "flex", gap: 10, alignItems: "center"}}>
                  <input
                    type="text"
                    placeholder={`Titre du sous-service ${idx + 1}`}
                    value={sous.title}
                    onChange={e => handleSousServiceChange(idx, "title", e.target.value)}
                    style={{...styles.input, flex: 2}}
                    required={sousServicesCount > 0}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={sous.description}
                    onChange={e => handleSousServiceChange(idx, "description", e.target.value)}
                    style={{...styles.input, flex: 3}}
                    required={sousServicesCount > 0}
                  />
                  <select
                    value={sous.icon}
                    onChange={e => handleSousServiceChange(idx, "icon", e.target.value)}
                    style={{...styles.input, flex: 1}}
                  >
                    {iconOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <i className={sous.icon} style={{fontSize: 24, marginLeft: 8}}></i>
                </div>
              </div>
            ))}
            {errors.sous_services && <div style={styles.errorMessage}>{errors.sous_services}</div>}
          </div>
          {/* Main image */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Image principale <span style={{color: "red"}}>*</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              required={!isEditing}
              style={styles.fileInput}
            />
            {mainImagePreview && (
              <img src={mainImagePreview} alt="Aperçu principale" style={{width: 100, height: 100, objectFit: "cover", borderRadius: 4, marginTop: 8}} />
            )}
          </div>
          {/* Other images */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Images</label>
            <div
              style={styles.uploadBox}
              onClick={handleUploadClick}
            >
              <img
                src="/images/cloud_upload.png"
                alt="Upload"
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <div style={{ color: "#333", fontWeight: "bold", fontSize: 16 }}>
                Drag & Drop pour télécharger<br />
                <span style={{ color: "#FF4757" }}>ou naviguer</span>
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                JPEG, JPG, PNG.
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="images"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            {errors.images && <div style={styles.errorMessage}>{errors.images}</div>}
            {images.length > 0 && (
              <div style={styles.imagePreviewContainer}>
                {images.map((file, idx) => (
                  <div key={idx} style={styles.previewWrapper}>
                    <img
                      src={imagePreviews[idx]}
                      alt={`Aperçu ${idx + 1}`}
                      style={styles.imagePreview}
                    />
                    <span
                      style={styles.removeIcon}
                      title="Supprimer cette image"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveNewImage(idx);
                      }}
                    >
                      <FaTimes />
                    </span>
                  </div>
                ))}
              </div>
            )}
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
  uploadBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    border: "2px dashed #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#f9f9f9",
  },
  imagePreviewContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  previewWrapper: {
    position: "relative",
    width: "80px",
    height: "80px",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  removeIcon: {
    position: "absolute",
    top: "5px",
    right: "5px",
    color: "#FF4757",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "white",
    borderRadius: "50%",
    padding: "2px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
};
