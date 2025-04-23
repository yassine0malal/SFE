import React, { useRef, useState } from "react";
import HeaderPart from "../../components/admin/header";

export default function ServiceFormPage() {
  const [iconPreview, setIconPreview] = useState(null);
  const [form, setForm] = useState({
    nomService: "",
    description: "",
    details: "",
    icon: null,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  // Responsive styles
  const isMobile = window.innerWidth < 600;

  return (
    <div
      style={{
        flex: 1,
        padding: isMobile ? "1rem 0.5rem" : "2rem",
        position: "relative",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      <HeaderPart />
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: 500,
          width: "100%",
          margin: isMobile ? "30px auto 0 auto" : "60px auto 0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          alignItems: "center",
        }}
        noValidate
      >
        <div style={{ width: "100%" }}>
            <h4 style={{color : '#FF5C78', fontSize:'27px',textAlign:'center' }}>Ajouter un service</h4>
          <input
            name="nomService"
            placeholder="Nom service"
            value={form.nomService}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          {errors.nomService && <div style={errorStyle}>{errors.nomService}</div>}
        </div>
        <div style={{ width: "100%" }}>
          <textarea
            name="description"
            placeholder="Description de service"
            value={form.description}
            onChange={handleInputChange}
            style={inputStyle}
            rows={2}
            required
          />
          {errors.description && <div style={errorStyle}>{errors.description}</div>}
        </div>
        <div style={{ width: "100%" }}>
          <textarea
            name="details"
            placeholder="Détails de service"
            value={form.details}
            onChange={handleInputChange}
            style={inputStyle}
            rows={3}
            required
          />
          {errors.details && <div style={errorStyle}>{errors.details}</div>}
        </div>

        {/* Zone d'upload */}
        <div
          style={{
            ...uploadBoxStyle,
            width: isMobile ? "100%" : 400,
            minWidth: isMobile ? 0 : 300,
            height: isMobile ? 120 : 170,
          }}
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {iconPreview ? (
            <img
              src={iconPreview}
              alt="Aperçu"
              style={{ width: 80, height: 80, objectFit: "contain" }}
            />
          ) : (
            <>
              <img
                src="/images/cloud_upload.png"
                alt="Upload"
                style={{ width: 60, height: 60, marginBottom: 10 }}
              />
              <div style={{ color: "#333", fontWeight: "bold", fontSize: isMobile ? 13 : 16 }}>
                Drag & Drop pour télécharger<br />
                <span style={{ color: "#FF4757" }}>ou naviguer</span>
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>
                JPEG, JPG, PNG, SVG.
              </div>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        {errors.icon && <div style={errorStyle}>{errors.icon}</div>}

        <button type="submit" style={submitBtnStyle}>
          Enregistrer
        </button>
      </form>
    </div>
  );

  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setForm({ ...form, icon: file });
    setErrors({ ...errors, icon: "" });
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setIconPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm({ ...form, icon: file });
      setErrors({ ...errors, icon: "" });
      const reader = new FileReader();
      reader.onload = (ev) => setIconPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleUploadClick() {
    fileInputRef.current.click();
  }

  function handleSubmit(e) {
    e.preventDefault();
    let newErrors = {};
    if (!form.nomService.trim()) newErrors.nomService = "Nom du service requis";
    if (!form.description.trim()) newErrors.description = "Description requise";
    if (!form.details.trim()) newErrors.details = "Détails requis";
    if (!form.icon) newErrors.icon = "Image requise";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    alert("Service enregistré !");
  }
}

const inputStyle = {
  width: "100%",
  padding: "1rem",
  borderRadius: 12,
  border: "none",
  background: "#D9D9D9",
  fontSize: 18,
  outline: "none",
  boxSizing: "border-box",
};

const uploadBoxStyle = {
  border: "2px dashed #FF4757",
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
};

const submitBtnStyle = {
  width: "100%",
  padding: "1.2rem",
  background: "#FF5C78",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "2rem",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  marginTop: 10,
  letterSpacing: 2,
};

const errorStyle = {
  color: "#FF4757",
  fontSize: 14,
  marginTop: 4,
  marginLeft: 4,
  textAlign: "left",
};