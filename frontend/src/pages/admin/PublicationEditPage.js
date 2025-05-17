import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import { FaTimes } from "react-icons/fa";

const API_URL = "http://localhost/SFE-Project/backend/public/api/publications";
const SERVICES_API_URL = "http://localhost/SFE-Project/backend/public/api/services";

export default function PublicationFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const principaleImageinputRef = useRef()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client: "",
    site: "",
    images: [],
    id_service: "",
    principaleImage:null
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [existingImages, setExistingImages] = useState([]); 
  const [services, setServices] = useState([]);

  const [principaleImagePreview,setPrincipaleImagePreview]= useState(null);
  const [exisitngPrincipaleImage,setExistingPrincipaleImage] = useState(null);
  

  // Load data if editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`${API_URL}?id_publication=${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setFormData({
          title: data.title || "",
          description: data.description || "",
          client: data.client || "",
          site: data.site || "",
          images: [],
          id_service: data.id_service || "",
          principaleImage:null
        });

        if (data.principale_image) {
          setExistingPrincipaleImage(data.principale_image.replace('/images/',''));
          setPrincipaleImagePreview(`http://localhost/SFE-Project/backend/public/uploads/images/${data.principale_image.replace('/images/','')}`);
        }

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
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetch(SERVICES_API_URL, { credentials: "include" })
      .then(res => res.json())
      .then(data => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]));
  }, []);

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


  const handlePrincipaleImageChange = (e)=>{
    if(e.target.files && e.target.files.length > 0){
      const file = e.target.files[0];
      console.log('principale image selected ',file);
      setFormData(prev =>({...prev,principale_image:file}));


      if(principaleImagePreview){
        URL.revokeObjectURL(principaleImagePreview);
      }

      setFormData(prev =>{
        const newFormData = {...prev,principaleImage:file};
        console.log('updated form data ',newFormData);
        return newFormData;
      });

      setPrincipaleImagePreview(URL.createObjectURL(file));
      setErrors(prev=>({ ...prev,principaleImage:""}));
    }
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
  
  const handlePrincipaleImageUploadClick  = (e)=>{
    principaleImageinputRef.current.value = "";
    principaleImageinputRef.current.click();
  }

  // Remove an existing image (from DB)
  const handleRemoveExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemovePrinciplaleImage = ()=>{
    setFormData(prev=>({...prev,principaleImage:null}));
    if(principaleImagePreview){
      URL.revokeObjectURL(principaleImagePreview);
    }
    setFormData(prev=>({...prev,principaleImage:null}));
    setPrincipaleImagePreview(null);
  }

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
    if (!formData.description.trim()) newErrors.description = "Description requise";
    if (!formData.client.trim()) newErrors.client = "Client requis";
    if (!formData.site.trim()) newErrors.site = "Site requis";
    if (!formData.id_service) newErrors.id_service = "Service requis";
    if(!formData.principaleImage) newErrors.principaleImage = "Image principale reqiuse";
    if (!id && (!formData.images || formData.images.length === 0)) newErrors.images = "Au moins une image requise";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
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
    if (formData.images && formData.images.length > 0) {
      formData.images.forEach(img => formDataToSend.append("images[]", img));
    }
    formDataToSend.append("PrincipaleImage",formData.principaleImage);
    try {
      setLoading(true);
      const response = await fetch(API_URL, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || "Erreur lors de l'enregistrement");
      alert(id ? "Publication modifiée !" : "Publication créée !");
      navigate("/publications");
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
        <h1 style={styles.title}>{id ? "Modifier la publication" : "Ajouter une publication"}</h1>
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
            <label style={styles.label}>Client</label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              style={styles.input}
              required
            />
            {errors.client && <div style={styles.errorMessage}>{errors.client}</div>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Site web</label>
            <input
              type="url"
              name="site"
              value={formData.site}
              onChange={handleChange}
              style={styles.input}
              required
            />
            {errors.site && <div style={styles.errorMessage}>{errors.site}</div>}
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
                .filter(service => service.is_active == 1)
                .map(service => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.nom_service}
                  </option>
                ))}
            </select>
            {errors.id_service && <div style={styles.errorMessage}>{errors.id_service}</div>}
          </div>


{/* IMAGES THAT IS AT PRINCIPALE  */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Image Principale</label>
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
                ref={principaleImageinputRef}
                type="file"
                name="images"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={handlePrincipaleImageChange}
              />
            </div>
            {errors.images && <div style={styles.errorMessage}>{errors.images}</div>}
            {(existingImages.length > 0 || formData.images.length > 0) && (
              <div style={styles.imagePreviewContainer}>
                {/* Existing images */}
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
                {/* New images */}
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
{/* IMAGES THAT IS AT PRINCIPALE  */}



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
                {/* Existing images */}
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
                {/* New images */}
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