// import React, { useRef, useState } from "react";
// import HeaderPart from "../../components/admin/header";

// export default function PublicationFormPage() {
//   const [iconPreview, setIconPreview] = useState(null);
//   const [form, setForm] = useState({
//     nom: "",
//     description: "",
//     client: "",
//     categorie: "",
//     icon: null,
//   });
//   const [errors, setErrors] = useState({});
//   const fileInputRef = useRef();

//   const isMobile = window.innerWidth < 600;

//   function handleInputChange(e) {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setErrors({ ...errors, [e.target.name]: "" });
//   }

//   function handleFileChange(e) {
//     const file = e.target.files[0];
//     setForm({ ...form, icon: file });
//     setErrors({ ...errors, icon: "" });
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setIconPreview(ev.target.result);
//       reader.readAsDataURL(file);
//     }
//   }

//   function handleDrop(e) {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file) {
//       setForm({ ...form, icon: file });
//       setErrors({ ...errors, icon: "" });
//       const reader = new FileReader();
//       reader.onload = (ev) => setIconPreview(ev.target.result);
//       reader.readAsDataURL(file);
//     }
//   }

//   function handleDragOver(e) {
//     e.preventDefault();
//   }

//   function handleUploadClick() {
//     fileInputRef.current.click();
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     let newErrors = {};
//     if (!form.nom.trim()) newErrors.nom = "Nom de publication requis";
//     if (!form.description.trim()) newErrors.description = "Description requise";
//     if (!form.client.trim()) newErrors.client = "Détails du client requis";
//     if (!form.categorie.trim()) newErrors.categorie = "Catégorie requise";
//     if (!form.icon) newErrors.icon = "Image requise";
//     setErrors(newErrors);
//     if (Object.keys(newErrors).length > 0) return;
//     alert("Publication enregistrée !");
//   }

//   return (
//     <div
//       style={{
//         flex: 1,
//         padding: isMobile ? "1rem 0.5rem" : "2rem",
//         position: "relative",
//         background: "#fff",
//         minHeight: "100vh",
//       }}
//     >
//       <HeaderPart />
//       <form
//         onSubmit={handleSubmit}
//         style={{
//           maxWidth: 500,
//           width: "100%",
//           margin: isMobile ? "30px auto 0 auto" : "60px auto 0 auto",
//           display: "flex",
//           flexDirection: "column",
//           gap: "1.5rem",
//           alignItems: "center",
//         }}
//         noValidate
//       >
//         <div style={{ width: "100%" }}>
//           <h4 style={{ color: "#FF5C78", fontSize: "27px", textAlign: "center" }}>
//             Ajouter une publication
//           </h4>
//           <input
//             name="nom"
//             placeholder="Nom de publication"
//             value={form.nom}
//             onChange={handleInputChange}
//             style={inputStyle}
//             required
//           />
//           {errors.nom && <div style={errorStyle}>{errors.nom}</div>}
//         </div>
//         <div style={{ width: "100%" }}>
//           <textarea
//             name="description"
//             placeholder="Description de publication"
//             value={form.description}
//             onChange={handleInputChange}
//             style={inputStyle}
//             rows={2}
//             required
//           />
//           {errors.description && <div style={errorStyle}>{errors.description}</div>}
//         </div>
//         <div style={{ width: "100%" }}>
//           <input
//             name="client"
//             placeholder="Détails du client"
//             value={form.client}
//             onChange={handleInputChange}
//             style={inputStyle}
//             required
//           />
//           {errors.client && <div style={errorStyle}>{errors.client}</div>}
//         </div>
//         <div style={{ width: "100%" }}>
//           <input
//             name="categorie"
//             placeholder="Catégorie de projet"
//             value={form.categorie}
//             onChange={handleInputChange}
//             style={inputStyle}
//             required
//           />
//           {errors.categorie && <div style={errorStyle}>{errors.categorie}</div>}
//         </div>
//         {/* Zone d'upload */}
//         <div
//           style={{
//             ...uploadBoxStyle,
//             width: isMobile ? "100%" : 500,
//             minWidth: isMobile ? 0 : 300,
//             height: isMobile ? 120 : 170,
//             border: "2px dashed #FF5C78",
//           }}
//           onClick={handleUploadClick}
//           onDrop={handleDrop}
//           onDragOver={handleDragOver}
//         >
//           {iconPreview ? (
//             <img
//               src={iconPreview}
//               alt="Aperçu"
//               style={{ width: 80, height: 80, objectFit: "contain" }}
//             />
//           ) : (
//             <>
//               <img
//                 src="/images/cloud_upload.png"
//                 alt="Upload"
//                 style={{ width: 60, height: 60, marginBottom: 10 }}
//               />
//               <div style={{ color: "#333", fontWeight: "bold", fontSize: isMobile ? 13 : 16 }}>
//                 Drag & Drop pour télécharger<br />
//                 <span style={{ color: "#FF4757" }}>ou naviguer</span>
//               </div>
//               <div style={{ fontSize: 12, color: "#888" }}>
//                 JPEG, JPG, PNG.
//               </div>
//             </>
//           )}
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="image/*"
//             style={{ display: "none" }}
//             onChange={handleFileChange}
//           />
//         </div>
//         {errors.icon && <div style={errorStyle}>{errors.icon}</div>}

//         <button type="submit" style={submitBtnStyle}>
//           Enregistrer
//         </button>
//       </form>
//     </div>
//   );
// }

// const inputStyle = {
//   width: "100%",
//   padding: "1rem",
//   borderRadius: 12,
//   border: "none",
//   background: "#D9D9D9",
//   fontSize: 18,
//   outline: "none",
//   boxSizing: "border-box",
//   marginBottom: 0,
// };

// const uploadBoxStyle = {
//   border: "2px dashed #FF5C78",
//   borderRadius: 16,
//   background: "#fff",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   cursor: "pointer",
//   marginBottom: 10,
//   textAlign: "center",
//   transition: "border 0.2s",
// };

// const submitBtnStyle = {
//   width: "100%",
//   padding: "1.2rem",
//   background: "#FF5C78",
//   color: "#fff",
//   fontWeight: "bold",
//   fontSize: "2rem",
//   border: "none",
//   borderRadius: 12,
//   cursor: "pointer",
//   marginTop: 10,
//   letterSpacing: 2,
// };

// const errorStyle = {
//   color: "#FF4757",
//   fontSize: 14,
//   marginTop: 4,
//   marginLeft: 4,
//   textAlign: "left",
// };





import React, { useRef, useState } from "react";
import HeaderPart from "../../components/admin/header";

export default function PublicationFormPage() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    description: "",
    client: "",
    categorie: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  const isMobile = window.innerWidth < 600;

  function handleInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files);
    // Ajoute les nouvelles images à celles déjà présentes
    const newImages = [...form.images, ...files];
    setForm({ ...form, images: newImages });
    setErrors({ ...errors, images: "" });

    // Génère les nouveaux aperçus
    // const newPreviews = [];
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleDrop(e) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const newImages = [...form.images, ...files];
    setForm({ ...form, images: newImages });
    setErrors({ ...errors, images: "" });

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target.result]);
      };
      reader.readAsDataURL(file);
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleUploadClick() {
    fileInputRef.current.value = ""; // reset to allow re-uploading same file
    fileInputRef.current.click();
  }

  function handleSubmit(e) {
    e.preventDefault();
    let newErrors = {};
    if (!form.nom.trim()) newErrors.nom = "Nom de publication requis";
    if (!form.description.trim()) newErrors.description = "Description requise";
    if (!form.client.trim()) newErrors.client = "Détails du client requis";
    if (!form.categorie.trim()) newErrors.categorie = "Catégorie requise";
    if (!form.images || form.images.length === 0) newErrors.images = "Au moins une image requise";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    alert("Publication enregistrée !");
  }

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
          <input
            name="nom"
            placeholder="Nom de publication"
            value={form.nom}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          {errors.nom && <div style={errorStyle}>{errors.nom}</div>}
        </div>
        <div style={{ width: "100%" }}>
          <textarea
            name="description"
            placeholder="Description de de publication"
            value={form.description}
            onChange={handleInputChange}
            style={inputStyle}
            rows={2}
            required
          />
          {errors.description && <div style={errorStyle}>{errors.description}</div>}
        </div>
        <div style={{ width: "100%" }}>
          <input
            name="client"
            placeholder="Détails du client"
            value={form.client}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          {errors.client && <div style={errorStyle}>{errors.client}</div>}
        </div>
        <div style={{ width: "100%" }}>
          <input
            name="categorie"
            placeholder="Catégorie de projet"
            value={form.categorie}
            onChange={handleInputChange}
            style={inputStyle}
            required
          />
          {errors.categorie && <div style={errorStyle}>{errors.categorie}</div>}
        </div>

        {/* Aperçu des images au-dessus de la zone d'upload */}
        {imagePreviews.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 10 }}>
            {imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Aperçu ${idx + 1}`}
                style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 8, border: "1px solid #eee" }}
              />
            ))}
          </div>
        )}

        {/* Zone d'upload */}
        <div
          style={{
            ...uploadBoxStyle,
            width: isMobile ? "100%" : 500,
            minWidth: isMobile ? 0 : 300,
            height: isMobile ? 120 : 170,
            border: "2px dashed #FF5C78",
            overflow: "auto",
          }}
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <img
            src="/images/cloud_upload.png"
            alt="Upload"
            style={{ width: 60, height: 60, marginBottom: 10 }}
          />
          <div style={{ color: "#333", fontWeight: "bold", fontSize: isMobile ? 13 : 16 }}>
            Drage & Drop pour télécharger<br />
            <span style={{ color: "#FF4757" }}>ou naviguer</span>
          </div>
          <div style={{ fontSize: 12, color: "#888" }}>
            JPEG, JPG, PNG.
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        {/* Bouton pour ajouter une autre image */}
        
        {errors.images && <div style={errorStyle}>{errors.images}</div>}

        <button type="submit" style={submitBtnStyle}>
          ENREGISTRER
        </button>
      </form>
    </div>
  );
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
  marginBottom: 0,
};

const uploadBoxStyle = {
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
};

const submitBtnStyle = {
  width: "100%",
  padding: "1.5rem",
  background: "#FF5C78",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "2rem",
  border: "none",
  borderRadius: 12,
  cursor: "pointer",
  marginTop: 10,
  letterSpacing: 3,
  textTransform: "uppercase",
};

const errorStyle = {
  color: "#FF4757",
  fontSize: 14,
  marginTop: 4,
  marginLeft: 4,
  textAlign: "left",
};