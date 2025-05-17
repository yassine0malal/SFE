import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import { FaTimes } from "react-icons/fa";

const API_URL = "http://localhost/SFE-Project/backend/public/api/publications";
const SERVICES_API_URL =
  "http://localhost/SFE-Project/backend/public/api/services";

export default function PublicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const principaleImageinputRef = useRef();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    site: "",
    images: [],
    id_service: "",
    principaleImage: null,
  });
  var index = 0;

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [services, setServices] = useState([]);
  const [principaleImagePreview, setPrincipaleImagePreview] = useState(null);
  const [existingPrincipaleImage, setExistingPrincipaleImage] = useState("");

  // Load data if editing
  useEffect(() => {
    if (!id) return;

    const loadPublicationData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}?id_publication=${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to load publication");

        setFormData({
          title: data.title || "",
          description: data.description || "",
          client: data.client || "",
          site: data.site || "",
          images: [],
          id_service: data.id_service || "",
          principaleImage: null,
        });

        // Handle principal image
        if (data.image_principale) {
          const cleanedPath = data.image_principale
            .replace("/images/", "")
            .trim();
          setExistingPrincipaleImage(cleanedPath);
          setPrincipaleImagePreview(
            `http://localhost/SFE-Project/backend/public/uploads/images/${cleanedPath}`
          );
        }

        // Handle other images
        if (data.images?.length > 0) {
          const cleanedImages = data.images.map((img) =>
            img.replace("/images/", "").trim()
          );
          setExistingImages(cleanedImages);

          // Create preview URLs for existing images
          const existingPreviews = cleanedImages.map(
            (img) =>
              `http://localhost/SFE-Project/backend/public/uploads/images/${img}`
          );
          setImagePreviews(existingPreviews);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPublicationData();
  }, [id]);

  // Replace the existing services useEffect with this:
  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch(SERVICES_API_URL, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to load services");

        const result = await response.json();

        // Handle different response formats
        const servicesData = Array.isArray(result)
          ? result
          : result.data?.services || result.data || [];

        // Ensure active status is properly checked
        setServices(
          servicesData.filter((service) => String(service.is_active) === "1")
        );
      } catch (err) {
        console.error("Error loading services:", err);
        setServices([]);
      }
    };
    loadServices();
  }, []);

  const handleChange = (e) => {
    index++;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    index++;
    const files = Array.from(e.target.files).filter(
      (file) => file instanceof File
    );

    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
      setErrors((prev) => ({ ...prev, images: "" }));
    }
  };

  const handlePrincipaleImageChange = (e) => {
    index++;
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      if (
        !["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
          file.type
        )
      ) {
        setErrors((prev) => ({
          ...prev,
          principaleImage: "Format invalide (JPEG, PNG, JPG, WEBP requis)",
        }));
        return;
      }

      if (principaleImagePreview) URL.revokeObjectURL(principaleImagePreview);

      const preview = URL.createObjectURL(file);
      setPrincipaleImagePreview(preview);
      setFormData((prev) => ({ ...prev, principaleImage: file }));
      setExistingPrincipaleImage("");
      setErrors((prev) => ({ ...prev, principaleImage: "" }));
    }
  };

  const handleDrop = (e) => {
    index++;
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) handleFileChange({ target: { files } });
  };

  const handlePrincipaleDrop = (e) => {
    index++;
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handlePrincipaleImageChange({ target: { files: [file] } });
  };

  const handleRemoveExistingImage = (idx) => {
    index++;
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      newPreviews.splice(idx, 1);
      return newPreviews;
    });
  };

  const handleRemoveNewImage = (idx) => {
    index++;
    URL.revokeObjectURL(imagePreviews[idx]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleRemovePrinciplaleImage = () => {
    index++;
    if (principaleImagePreview) {
      URL.revokeObjectURL(principaleImagePreview);
      setPrincipaleImagePreview(null);
    }
    setExistingPrincipaleImage("");
    setFormData((prev) => ({ ...prev, principaleImage: null }));
    setErrors((prev) => ({
      ...prev,
      principaleImage: "Image principale requise",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Titre requis";
    if (!formData.description.trim())
      newErrors.description = "Description requise";
    if (!formData.client.trim()) newErrors.client = "Client requis";
    if (!formData.site.trim()) newErrors.site = "Site requis";
    if (!formData.id_service) newErrors.id_service = "Service requis";
    if (!formData.principaleImage && !existingPrincipaleImage) {
      newErrors.principaleImage = "Image principale requise";
    }
    if (existingImages.length + formData.images.length === 0) {
      newErrors.images = "Au moins une image requise";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("client", formData.client);
      formDataToSend.append("site", formData.site);
      formDataToSend.append("id_service", formData.id_service);

      if (id) formDataToSend.append("id_publication", id);
      if (existingImages.length > 0) {
        formDataToSend.append("existing_images", existingImages.join(","));
      }
      if (existingPrincipaleImage) {
        formDataToSend.append(
          "existing_image_principale",
          existingPrincipaleImage
        );
      }
      if (formData.principaleImage instanceof File) {
        formDataToSend.append("image_principale", formData.principaleImage);
      }
      formData.images.forEach((img) =>
        formDataToSend.append("new_images[]", img)
      );
      if(index==0){
        navigate("/publications");
      }

      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Erreur de sauvegarde");

      alert(id ? "Publication modifiée !" : "Publication créée !");
      navigate("/publications");
    } catch (err) {
      setError(err.message);
    }
  };

  const renderImagePreviews = () => (
    <div style={styles.imagePreviewContainer}>
      {/* Existing images from server */}
      {existingImages.map((img, idx) => (
        <div key={`existing-${idx}`} style={styles.previewWrapper}>
          <img
            src={`http://localhost/SFE-Project/backend/public/uploads/images/${img}`}
            alt={`Preview ${idx + 1}`}
            style={styles.imagePreview}
          />
          <span
            style={styles.removeIcon}
            onClick={() => handleRemoveExistingImage(idx)}
            title="Supprimer cette image"
          >
            <FaTimes />
          </span>
        </div>
      ))}

      {/* New uploaded images */}
      {imagePreviews.slice(existingImages.length).map((preview, idx) => (
        <div key={`new-${idx}`} style={styles.previewWrapper}>
          <img
            src={preview}
            alt={`New preview ${idx + 1}`}
            style={styles.imagePreview}
          />
          <span
            style={styles.removeIcon}
            onClick={() => handleRemoveNewImage(idx)}
            title="Supprimer cette image"
          >
            <FaTimes />
          </span>
        </div>
      ))}
    </div>
  );

  const renderPrincipaleImagePreview = () => {
    const imageUrl =
      principaleImagePreview ||
      (existingPrincipaleImage &&
        `http://localhost/SFE-Project/backend/public/uploads/images/${existingPrincipaleImage}`);

    if (!imageUrl) return null;

    return (
      <div style={styles.imagePreviewContainer}>
        <div style={styles.previewWrapper}>
          <img
            src={imageUrl}
            alt="Image principale"
            style={{ ...styles.imagePreview, width: 150, height: 150 }}
          />
          <span
            style={styles.removeIcon}
            onClick={handleRemovePrinciplaleImage}
            title="Supprimer cette image"
          >
            <FaTimes />
          </span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <HeaderPart />
        <div style={styles.loadingMessage}>Chargement...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <HeaderPart />
      <div style={styles.formContainer}>
        <h1 style={styles.title}>
          {id ? "Modifier la publication" : "Ajouter une publication"}
        </h1>

        {error && <div style={styles.errorMessage}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          {/* Form fields */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.title && (
              <div style={styles.errorMessage}>{errors.title}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
            />
            {errors.description && (
              <div style={styles.errorMessage}>{errors.description}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Client</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.client && (
              <div style={styles.errorMessage}>{errors.client}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Site web</label>
            <input
              type="url"
              name="site"
              value={formData.site}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.site && (
              <div style={styles.errorMessage}>{errors.site}</div>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Service</label>
            <select
              name="id_service"
              value={formData.id_service}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">-- Sélectionner un service --</option>
              {services.map((service) => (
                <option key={service.service_id} value={service.service_id}>
                  {service.nom_service}
                </option>
              ))}
            </select>
            {errors.id_service && (
              <div style={styles.errorMessage}>{errors.id_service}</div>
            )}
          </div>

          {/* Principal Image Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Image Principale</label>
            <div
              style={styles.uploadBox}
              onClick={() => principaleImageinputRef.current.click()}
              onDrop={handlePrincipaleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src="/images/cloud_upload.png"
                alt="Upload"
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <div style={{ color: "#333", fontWeight: "bold", fontSize: 16 }}>
                Drag & Drop ou cliquez pour télécharger
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                Formats acceptés: JPEG, JPG, PNG, WEBP
              </div>
              <input
                ref={principaleImageinputRef}
                type="file"
                accept="image/*"
                onChange={handlePrincipaleImageChange}
                style={{ display: "none" }}
              />
            </div>
            {errors.principaleImage && (
              <div style={styles.errorMessage}>{errors.principaleImage}</div>
            )}
            {renderPrincipaleImagePreview()}
          </div>

          {/* Additional Images Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Images supplémentaires</label>
            <div
              style={styles.uploadBox}
              onClick={() => fileInputRef.current.click()}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <img
                src="/images/cloud_upload.png"
                alt="Upload"
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <div style={{ color: "#333", fontWeight: "bold", fontSize: 16 }}>
                Drag & Drop ou cliquez pour télécharger
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                Formats acceptés: JPEG, JPG, PNG, WEBP
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
            {errors.images && (
              <div style={styles.errorMessage}>{errors.images}</div>
            )}
            {(existingImages.length > 0 || imagePreviews.length > 0) &&
              renderImagePreviews()}
          </div>

          {/* Form Buttons */}
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/publications")}
              style={styles.cancelButton}
            >
              Annuler
            </button>
            <button type="submit" style={styles.submitButton}>
              {id ? "Mettre à jour" : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Keep the same styles object from previous implementation

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    boxSizing: "border-box",
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
  imagePreviewContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
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
  removeIcon: {
    position: "absolute",
    top: 2,
    right: 2,
    background: "#fff",
    borderRadius: "50%",
    color: "#FF5C78",
    cursor: "pointer",
    fontSize: 18,
    padding: 2,
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
    zIndex: 2,
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
    marginBottom: "10px",
    fontSize: "15px",
  },
};
