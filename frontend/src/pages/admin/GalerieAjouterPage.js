import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import { FaTimes } from "react-icons/fa";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost/SFE-Project/backend/public/api/galerie";
const SERVICES_API_URL = "http://localhost/SFE-Project/backend/public/api/services";

const quillModules = {
  toolbar: {
    container: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['link', 'image'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean'],
      ['insertHtml'] // Custom HTML insert button
    ]
  }
};

export default function GalerieAjouterPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const fileInputRefMain = useRef();
  const quillRef = useRef();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    prix: "",
    promotion: "",
    images: [],
    id_service: "",
  });
  const [subDescription, setSubDescription] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [firstImage, setFirstImage] = useState(null);
  const [firstImagePreview, setFirstImagePreview] = useState(null);

  useEffect(() => {
    fetch(SERVICES_API_URL,{
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        console.log("Services API response:", data);
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const toolbar = quillRef.current.getEditor().getModule('toolbar');
      // Add custom HTML insert button if not already present
      if (!document.getElementById('ql-insertHtml')) {
        const button = document.createElement('button');
        button.innerHTML = "&lt;/&gt;";
        button.id = "ql-insertHtml";
        button.type = "button";
        button.className = "ql-insertHtml";
        button.title = "Insérer du code HTML";
        button.onclick = () => {
          const html = prompt("Collez votre code HTML ici :");
          if (html) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.clipboard.dangerouslyPasteHTML(range.index, html);
          }
        };
        const toolbarElem = quillRef.current.editor.container.previousSibling;
        toolbarElem.appendChild(button);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
    setImagePreviews(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleUploadClick = () => {
    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleRemoveNewImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Titre requis";
    if (!formData.description.trim()) newErrors.description = "Description requise";
    if (!formData.prix.trim()) newErrors.prix = "prix requis";
    if (
      !formData.promotion.trim() ||
      isNaN(formData.promotion) ||
      Number(formData.promotion) < 0 ||
      Number(formData.promotion) > 99
    ) {
      newErrors.promotion = "La promotion doit être comprise entre 0 et 99";
    }
    if (!formData.images || formData.images.length === 0) newErrors.images = "Au moins une image requise";
    if (!formData.id_service) newErrors.id_service = "Service requis";
    if (!firstImage) newErrors.first_image = "Image principale requise";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("prix", formData.prix);
    formDataToSend.append("promotion", formData.promotion);
    formDataToSend.append("id_service", formData.id_service);
    formDataToSend.append("first_image", firstImage);
    formDataToSend.append("sub_description", subDescription);
    formData.images.forEach(img => formDataToSend.append("images[]", img));

    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || "Erreur lors de l'enregistrement");
      alert("produit créée !");
      navigate("/galerie");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <HeaderPart />
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Ajouter un produit</h1>
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
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              required
            />
            {errors.description && <div style={styles.errorMessage}>{errors.description}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>prix</label>
            <input
              type="number"
              name="prix"
              value={formData.prix}
              onChange={handleChange}
              style={styles.input}
              required
            />
            {errors.prix && <div style={styles.errorMessage}>{errors.prix}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>promotion </label>
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
            <label style={styles.label}>Service</label>
            <select
              name="id_service"
              value={formData.id_service}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">-- Sélectionner un service --</option>
              {(Array.isArray(services) ? services : [])
                .filter(service => service.is_active == "1" || service.is_active == 1)
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
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={subDescription}
              onChange={setSubDescription}
              style={{ background: "#fff", borderRadius: 4 }}
              modules={quillModules}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Image principale (motto)</label>
            <div
              style={styles.uploadBox}
              onClick={() => {
                if (fileInputRefMain) fileInputRefMain.current.value = "";
                fileInputRefMain.current.click();
              }}
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
                ref={fileInputRefMain}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={e => {
                  const file = e.target.files[0];
                  setFirstImage(file);
                  setFirstImagePreview(file ? URL.createObjectURL(file) : null);
                  setErrors(prev => ({ ...prev, first_image: "" }));
                }}
                required
              />
            </div>
            {firstImagePreview && (
              <img
                src={firstImagePreview}
                alt="Aperçu image principale"
                style={{ width: 100, height: 100, objectFit: "cover", marginTop: 8, borderRadius: 8 }}
              />
            )}
            {errors.first_image && <div style={styles.errorMessage}>{errors.first_image}</div>}
          </div>
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
            {formData.images.length > 0 && (
              <div style={styles.imagePreviewContainer}>
                {formData.images.map((file, idx) => (
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
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/galerie")}
              style={styles.cancelButton}
            >
              Annuler
            </button>
            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? "Enregistrement..." : "Enregistrer"}
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
  errorMessage: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
    fontSize: "15px",
  },
};