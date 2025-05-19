import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import HeaderPart from "../../components/admin/header";

const API_URL = "http://localhost/SFE-Project/backend/public/api/services";

// Icon options
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
var index= 0;
export default function ServiceEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [tempSousServicesCount, setTempSousServicesCount] = useState(0);

  // Main form state
  const [formData, setFormData] = useState({
    nom_service: "",
    description: "",
    details: "",
    is_active: false,
  });

  // Main image
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [existingMainImage, setExistingMainImage] = useState(null);

  // Multiple images
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // Sous-services
  const [sousServices, setSousServices] = useState([]);
  const [sousServicesCount, setSousServicesCount] = useState(0);

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  // Load service data
  useEffect(() => {
    if (isEditing) {
      const fetchServiceData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}?service_id=${id}`, { credentials: 'include' });
          if (!response.ok) throw new Error(`Erreur de récupération du service: ${response.status}`);
          const data = await response.json();
          
          if (data.error) throw new Error(data.error);
          const service = data;

          // alert(JSON.stringify(service));
          if (service) {
            setFormData({
              nom_service: service.nom_service,
              description: service.description,
              details: service.details,
              is_active: data.is_active === "1",
            });

            if (service.image) setExistingMainImage(service.image);
            
            if (service.images) {
              const imgs = service.images.split(",").map(s => s.trim()).filter(Boolean);
              setExistingImages(imgs);
            }

            if (service.sous_services) {
              const sousArr = service.sous_services.split("|").filter(Boolean).map(item => {
                const [title, description, icon] = item.split(/:(?![\\|])/);
                return {
                  title: title?.trim() || "",
                  description: description?.trim() || "",
                  icon: icon?.trim() || iconOptions[0].value
                };
              });
              setSousServices(sousArr);
              setSousServicesCount(sousArr.length);
            }
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchServiceData();
    }
  }, [id, isEditing]);

  // Sous-services dynamic update
  useEffect(() => {
    setSousServices(prev => {
      const arr = [...prev];
      if (sousServicesCount > arr.length) {
        for (let i = arr.length; i < sousServicesCount; i++) {
          arr.push({ title: "", description: "", icon: iconOptions[0].value });
        }
      } else if (sousServicesCount < arr.length) {
        arr.length = sousServicesCount;
      }
      return arr;
    });
    // eslint-disable-next-line
  }, [sousServicesCount]);

  // Handlers
  const handleChange = (e) => {
    index++;
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    console.log("formData.is_active =", formData.is_active);
  };

  const handleSousServiceChange = (idx, field, value) => {
    index++;
    setSousServices(prev => {
      const updated = [...prev];
      updated[idx][field] = value;
      return updated;
    });
  };

  // Main image
  const handleMainImageChange = (e) => {
    index++;
    const file = e.target.files[0];
    setMainImage(file);
    setMainImagePreview(file ? URL.createObjectURL(file) : null);
    setExistingMainImage(null); // Remove preview of old image if new selected
  };

  // Multiple images
  const handleFileChange = (e) => {
    index++;
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleUploadClick = () => {
    index++;
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleRemoveNewImage = (idx) => {
    index++;
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveExistingImage = (imgName) => {
    index++;
    setExistingImages(prev => prev.filter(img => img !== imgName));
  };

  // Build sous_services string for backend
  const buildSousServicesString = () => {
    index++;
    return sousServices
      .filter(s => s.title.trim() !== "")
      .map(s => `${s.title.trim()}:${s.description.trim()}:${s.icon}`)
      .join("|");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    // Basic validation - only check if we have either existing or new data
    let newErrors = {};
    
    // For text fields - they should have either new input or existing data
    if (!formData.nom_service?.trim()) {
        newErrors.nom_service = "Nom du service requis";
    }
    if (!formData.description?.trim()) {
        newErrors.description = "Description requise";
    }
    if (!formData.details?.trim()) {
        newErrors.details = "Détails requis";
    }

    // For images - either existing or new ones should be present
    if (!mainImage && !existingMainImage) {
        newErrors.main_image = "Image principale requise";
    }
    
    // For gallery images - check both existing and new
    const totalImages = images.length + existingImages.length;
    if (totalImages < 1) {
        newErrors.images = "Au moins une image requise";
    }

    // For sous-services - validate only if there are any
    if (sousServicesCount > 0) {
        const sousServicesRemplis = sousServices.filter(s => 
            s.title.trim() !== "" || s.description.trim() !== ""
        );
        if (sousServicesRemplis.length < sousServicesCount) {
            newErrors.sous_services = "Veuillez remplir tous les sous-services ou aucun.";
        }
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if(index === 0){
      navigate("/services");
      return;
    }

    try {
        const formDataToSend = new FormData();
        
        // Always send all data
        formDataToSend.append("service_id", id);
        formDataToSend.append("nom_service", formData.nom_service);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("details", formData.details);
        formDataToSend.append("is_active", formData.is_active ? "1" : "0");
        formDataToSend.append("sous_services", buildSousServicesString() || '');
        formDataToSend.append("existing_main_image", existingMainImage || '');
        formDataToSend.append("existing_images", existingImages.join(","));

        // Only append new files if they exist
        if (mainImage) {
            formDataToSend.append("main_image", mainImage);
        }

        if (images.length > 0) {
            images.forEach((img) => {
                formDataToSend.append("images[]", img);
            });
        }

        // Debug what's being sent
        console.log("Sending form data:", {
            nom_service: formData.nom_service,
            description: formData.description,
            details: formData.details,
            is_active: formData.is_active,
            existing_main_image: existingMainImage,
            existing_images: existingImages,
            has_new_main_image: !!mainImage,
            new_images_count: images.length
        });
console.log(JSON.stringify(formDataToSend));
        const response = await fetch(API_URL, {
            method: "POST",
            credentials: 'include',
            body: formDataToSend
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || "Une erreur est survenue");
        }

        navigate("/services");
        
    } catch (err) {
        alert("Erreur: " + err.message);
        console.error("Submission error:", err);
    }
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
        <h1 style={styles.title}>Modifier le service</h1>
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
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="number"
                min={0}
                value={tempSousServicesCount}
                onChange={(e) => setTempSousServicesCount(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ ...styles.input, marginBottom: 12, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => {
                  setSousServicesCount(tempSousServicesCount);
                  index++;
                }}
                style={{ 
                  padding: '12px 24px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: 12
                }}
              >
                Mettre à jour
              </button>
            </div>
            
            {sousServices.slice(0, sousServicesCount).map((sous, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #eee",
                  borderRadius: 4,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder={`Titre du sous-service ${idx + 1}`}
                    value={sous.title}
                    onChange={(e) =>
                      handleSousServiceChange(idx, "title", e.target.value)
                    }
                    style={{ ...styles.input, flex: 2 }}
                    required={sousServicesCount > 0}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={sous.description}
                    onChange={(e) =>
                      handleSousServiceChange(
                        idx,
                        "description",
                        e.target.value
                      )
                    }
                    style={{ ...styles.input, flex: 3 }}
                    required={sousServicesCount > 0}
                  />
                  <select
                    value={sous.icon}
                    onChange={(e) =>
                      handleSousServiceChange(idx, "icon", e.target.value)
                    }
                    style={{ ...styles.input, flex: 1 }}
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <i
                    className={sous.icon}
                    style={{ fontSize: 24, marginLeft: 8 }}
                  ></i>
                </div>
              </div>
            ))}
            {errors.sous_services && (
              <div style={styles.errorMessage}>{errors.sous_services}</div>
            )}
          </div>
          {/* Main Image Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Image principale <span style={{ color: "red" }}>*</span>
            </label>
            <div
              style={styles.uploadBox}
              onClick={() => document.getElementById("mainImageInput").click()}
            >
              <img
                src="/images/cloud_upload.png"
                alt="Upload"
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <div style={{ color: "#333", fontWeight: "bold", fontSize: 16 }}>
                Drag & Drop pour télécharger
                <br />
                <span style={{ color: "#FF4757" }}>ou naviguer</span>
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>JPEG, JPG, PNG.</div>
              <input
                id="mainImageInput"
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                style={{ display: "none" }}
              />
            </div>
            {/* Main image preview */}
            {mainImagePreview && (
              <div style={styles.imagePreviewContainer}>
                <div style={styles.previewWrapper}>
                  <img
                    src={mainImagePreview}
                    alt="Aperçu principale"
                    style={styles.imagePreview}
                  />
                  <span
                    style={styles.removeIcon}
                    title="Supprimer cette image"
                    onClick={() => {
                      setMainImage(null);
                      setMainImagePreview(null);
                    }}
                  >
                    <FaTimes />
                  </span>
                </div>
              </div>
            )}
            {!mainImagePreview && existingMainImage && (
              <div style={styles.imagePreviewContainer}>
                <div style={styles.previewWrapper}>
                  <img
                    src={`http://localhost/SFE-Project/backend/public/uploads/images/${existingMainImage}`}
                    alt="Aperçu principale"
                    style={styles.imagePreview}
                  />
                </div>
              </div>
            )}
          </div>
          {/* Images Section (gallery) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Images</label>
            <div style={styles.uploadBox} onClick={handleUploadClick}>
              <img
                src="/images/cloud_upload.png"
                alt="Upload"
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <div style={{ color: "#333", fontWeight: "bold", fontSize: 16 }}>
                Drag & Drop pour télécharger
                <br />
                <span style={{ color: "#FF4757" }}>ou naviguer</span>
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>JPEG, JPG, PNG.</div>
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
            {/* Existing images */}
            {existingImages.length > 0 && (
              <div style={styles.imagePreviewContainer}>
                {existingImages.map((img, idx) => (
                  <div key={img} style={styles.previewWrapper}>
                    <img
                      src={`http://localhost/SFE-Project/backend/public/uploads/images/${img}`}
                      alt={`Aperçu existante ${idx + 1}`}
                      style={styles.imagePreview}
                    />
                    <span
                      style={styles.removeIcon}
                      title="Supprimer cette image"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveExistingImage(img);
                      }}
                    >
                      <FaTimes />
                    </span>
                  </div>
                ))}
              </div>
            )}
            {/* New images */}
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
                      onClick={(e) => {
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
            {errors.images && (
              <div style={styles.errorMessage}>{errors.images}</div>
            )}
          </div>
          {/* Aperçu de toutes les images du service */}

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
            <span>{formData.is_active ? "Actif" : "Désactivé"}</span>
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
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Styles with improved icon selection styling
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
  imagePreviewContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap", // This will wrap to the next line if full
    marginTop: "10px",
  },
  previewWrapper: {
    position: "relative",
    display: "inline-block",
  },
  imagePreview: {
    width: "100px",
    height: "100px",
    objectFit: "cover",
    borderRadius: "4px",
    border: "1px solid #ddd",
  },
  uploadBox: {
    border: "2px dashed #FF5C78",
    borderRadius: 16,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: 10,
    textAlign: "center",
    transition: "border 0.2s",
    width: "100%",
    minHeight: 120,
  },
  imageNote: {
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  // New styles for icon selection
  iconSelectionContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  iconSelect: {
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
    flex: 1,
  },
  iconPreviewSmall: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "20px",
    color: "#FF5C78",
  },
  iconPreviewContainer: {
    marginTop: "10px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  iconPreview: {
    fontSize: "48px",
    color: "#FF5C78",
    marginBottom: "10px",
  },
  iconLabel: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "bold",
    margin: 0,
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
