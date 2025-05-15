import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import { FaTimes } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost/SFE-Project/backend/public/api/galerie";
const SERVICES_API_URL = "http://localhost/SFE-Project/backend/public/api/services";

const quillModulesDesc = {
  toolbar: { container: "#custom-quill-toolbar-desc" }
};
const quillModulesSubDesc = {
  toolbar: { container: "#custom-quill-toolbar-subdesc" }
};

const CustomToolbar = ({ id, onInsertHtml }) => (
  <div id={id}>
    <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option value="" />
    </select>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-link" />
    <button className="ql-image" />
    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />
    <button className="ql-clean" />
    {/* Custom HTML button */}
    <button
      type="button"
      style={{
        marginLeft: 8,
        borderRadius: 4,
        background: "#fff",
        color: "#FF5C78",
        fontWeight: "bold",
        fontSize: "1.1rem",
        cursor: "pointer",
        padding: "2px 10px",
        verticalAlign: "middle"
      }}
      onClick={onInsertHtml}
      tabIndex={-1}
      title="Insérer du code HTML"
    >
      &lt;/&gt;
    </button>
  </div>
);

export default function GalerieEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const quillRefDesc = useRef();
  const quillRefSubDesc = useRef();

  const [formData, setFormData] = useState({
    title: "",
    prix: "",
    promotion: "",
    images: [],
    id_service: "",
  });
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const [subDescription, setSubDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [existingImages, setExistingImages] = useState([]);
  const [firstImage, setFirstImage] = useState(null);
  const [firstImagePreview, setFirstImagePreview] = useState(null);
  const [existingFirstImage, setExistingFirstImage] = useState("");
  const [services, setServices] = useState([]);

  // Load services
  useEffect(() => {
    fetch(SERVICES_API_URL, { credentials: "include" })
      .then(res => res.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]));
  }, []);

  // Load data if editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}?id_galerie=${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setFormData({
          title: data.title || "",
          prix: data.prix || "",
          promotion: data.promotion || "",
          images: [],
          id_service: data.id_service || "",
        });
        setDescriptionHtml(data.description || "");
        setSubDescription(data.sub_description || "");
        if (data.images && Array.isArray(data.images)) {
          setExistingImages(data.images.map(img =>
            img.replace('/images/', '')
          ));
          setImagePreviews(
            data.images.map(img =>
              img.startsWith("http")
                ? img
                : `http://localhost/SFE-Project/backend/public/uploads${img}`
            )
          );
        }
        if (data.first_image) {
          setExistingFirstImage(data.first_image.replace('/images/', ''));
          setFirstImagePreview(`http://localhost/SFE-Project/backend/public/uploads/images/${data.first_image.replace('/images/', '')}`);
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  // File selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setErrors(prev => ({ ...prev, images: "" }));
    setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  // Drag & drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setErrors(prev => ({ ...prev, images: "" }));
    setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };
  const handleDragOver = (e) => e.preventDefault();

  // Open file selector
  const handleUploadClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  // Remove an existing image (from DB)
  const handleRemoveExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // Remove a newly selected image (not yet uploaded)
  const handleRemoveNewImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
    setImagePreviews(prev => {
      const existingCount = existingImages.length;
      return prev.filter((_, i) => i !== (existingCount + idx));
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Titre requis";
    if (!descriptionHtml.trim()) newErrors.description = "Description requise";
    if (!formData.prix.trim()) newErrors.prix = "Prix requis";
    if (!formData.id_service) newErrors.id_service = "Service requis";
    if (
      !formData.promotion.trim() ||
      isNaN(formData.promotion) ||
      Number(formData.promotion) < 0 ||
      Number(formData.promotion) > 99
    ) {
      newErrors.promotion = "La promotion doit être comprise entre 0 et 99";
    }
    if (!id && (!formData.images || formData.images.length === 0)) newErrors.images = "Au moins une image requise";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();
    if (id) formDataToSend.append("id_galerie", id);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", descriptionHtml); // Utilise le HTML
    formDataToSend.append("prix", formData.prix);
    formDataToSend.append("promotion", formData.promotion);
    formDataToSend.append("id_service", formData.id_service);
    formDataToSend.append("sub_description", subDescription);

    if (existingImages.length > 0) {
      formDataToSend.append("existing_images", existingImages.join(","));
    }

    if (formData.images && formData.images.length > 0) {
      formData.images.forEach(img => formDataToSend.append("images[]", img));
    }

    if (firstImage) {
      formDataToSend.append("first_image", firstImage);
    } else if (existingFirstImage) {
      formDataToSend.append("existing_first_image", existingFirstImage);
    }

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || "Erreur lors de l'enregistrement");
      alert(id ? "Galerie modifiée !" : "Galerie créée !");
      navigate("/galerie");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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
        <h1 style={styles.title}>{id ? "Modifier la galerie" : "Ajouter une galerie"}</h1>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <div style={styles.formGroup}>
            <label style={styles.label}>Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
            {errors.title && <div style={styles.errorMessage}>{errors.title}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <CustomToolbar
              id="custom-quill-toolbar-desc"
              onInsertHtml={() => {
                const html = prompt("Collez votre code HTML ici :");
                if (html && quillRefDesc.current) {
                  const quill = quillRefDesc.current.getEditor();
                  const range = quill.getSelection(true);
                  quill.clipboard.dangerouslyPasteHTML(range ? range.index : 0, html);
                }
              }}
            />
            <ReactQuill
              ref={quillRefDesc}
              theme="snow"
              value={descriptionHtml}
              onChange={setDescriptionHtml}
              style={{ background: "#fff", borderRadius: 4 }}
              modules={quillModulesDesc}
            />
            {errors.description && <div style={styles.errorMessage}>{errors.description}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Prix</label>
            <input
              type="text"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              style={styles.input}
              required
            />
            {errors.prix && <div style={styles.errorMessage}>{errors.prix}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Promotion</label>
            <input
              type="number"
              name="promotion"
              value={formData.promotion}
              onChange={handleChange}
              style={styles.input}
              required
              min={0}
              max={99}
            />
            {errors.promotion && <div style={styles.errorMessage}>{errors.promotion}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Service associé</label>
            <select
              name="id_service"
              value={formData.id_service}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">-- Sélectionner un service --</option>
              {services
                .filter(service => service.is_active == 1)
                .map(service => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.nom_service}
                  </option>
                ))}
            </select>
            {errors.id_service && <div style={styles.errorMessage}>{errors.id_service}</div>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Sous-description personnalisée</label>
            <CustomToolbar
              id="custom-quill-toolbar-subdesc"
              onInsertHtml={() => {
                const html = prompt("Collez votre code HTML ici :");
                if (html && quillRefSubDesc.current) {
                  const quill = quillRefSubDesc.current.getEditor();
                  const range = quill.getSelection(true);
                  quill.clipboard.dangerouslyPasteHTML(range ? range.index : 0, html);
                }
              }}
            />
            <ReactQuill
              ref={quillRefSubDesc}
              theme="snow"
              value={subDescription}
              onChange={setSubDescription}
              style={{ background: "#fff", borderRadius: 4 }}
              modules={quillModulesSubDesc}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Image principale</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                setFirstImage(file);
                setFirstImagePreview(file ? URL.createObjectURL(file) : null);
                setErrors(prev => ({ ...prev, first_image: "" }));
              }}
              style={styles.input}
            />
            {firstImagePreview && (
              <img
                src={firstImagePreview}
                alt="Aperçu image principale"
                style={{ width: 100, height: 100, objectFit: "cover", marginTop: 8, borderRadius: 8 }}
              />
            )}
            {!firstImagePreview && existingFirstImage && (
              <img
                src={`http://localhost/SFE-Project/backend/public/uploads/images/${existingFirstImage}`}
                alt="Image principale existante"
                style={{ width: 100, height: 100, objectFit: "cover", marginTop: 8, borderRadius: 8 }}
              />
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Images</label>
            <div
              style={styles.uploadBox}
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
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
            {(existingImages.length > 0 || formData.images.length > 0) && (
              <div style={styles.imagePreviewContainer}>
                {existingImages.map((img, idx) => (
                  <div key={`existing-${idx}`} style={styles.previewWrapper}>
                    <img
                      src={`http://localhost/SFE-Project/backend/public/uploads/images/${img}`}
                      alt={`Aperçu ${idx + 1}`}
                      style={styles.imagePreview}
                    />
                    <span
                      style={styles.removeIcon}
                      title="Supprimer cette image"
                      onClick={e => {
                        e.stopPropagation();
                        handleRemoveExistingImage(idx);
                      }}
                    >
                      <FaTimes />
                    </span>
                  </div>
                ))}
                {formData.images.map((file, idx) => (
                  <div key={`new-${idx}`} style={styles.previewWrapper}>
                    <img
                      src={imagePreviews[existingImages.length + idx]}
                      alt={`Aperçu nouveau ${idx + 1}`}
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

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/galerie")}
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
    width: "300px",
    height: "150px",
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