import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import { renderToStaticMarkup } from "react-dom/server";
import { EmailTemplate } from "./SendMessage"; // Adjust path if needed
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const API_URL = "http://localhost/SFE-Project/backend/public/api/abonnees";

// Add this custom button component
const CustomToolbar = () => (
  <div id="toolbar">
    <button
      className="ql-code"
      style={{
        padding: "5px 10px",
        margin: "0 5px",
        background: "#f3f3f3",
        border: "1px solid #ccc",
        borderRadius: "3px",
        cursor: "pointer",
      }}
    >
      <i className="fas fa-code"></i> Insert HTML
    </button>
  </div>
);

// First, create a custom HTML button handler
const insertHtml = (quill) => {
  const html = prompt("Insert HTML Code:");
  if (html) {
    const range = quill.getSelection(true);
    quill.clipboard.dangerouslyPasteHTML(range.index, html);
  }
};

// Update the modules configuration
const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image"],
      ["clean"],
      ["html"], // Add custom HTML button
    ],
    handlers: {
      html: function (value) {
        insertHtml(this.quill);
      },
    },
  },
};

// Add custom styles for the HTML button
const customStyles = `
  .ql-html:after {
    content: "HTML";
    font-size: 12px;
  }
  .ql-snow .ql-toolbar button.ql-html {
    width: auto;
    padding: 0 5px;
  }
`;

// Add the style tag in your component
const styleTag = document.createElement("style");
styleTag.innerHTML = customStyles;
document.head.appendChild(styleTag);

const updatePreviewWithCSS = (html, previewRef) => {
  console.log(previewRef,"Updating preview with CSS...", html);
  // 1. Create a temporary container
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 2. Extract all style tags
  const styles = Array.from(tempDiv.getElementsByTagName('style'))
    .map(style => style.innerHTML)
    .join('\n');

  // 3. Remove style tags from HTML
  const styleElements = Array.from(tempDiv.getElementsByTagName('style'));
  styleElements.forEach(style => style.remove());

  // 4. Get cleaned HTML with inline styles preserved
  const cleanHtml = tempDiv.innerHTML;

  // 5. Update preview styles
  let styleTag = document.getElementById('preview-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'preview-style';
    document.head.appendChild(styleTag);
  }
  styleTag.innerHTML = styles;

  // 6. Update preview content using ref
  if (previewRef.current) {
    previewRef.current.innerHTML = cleanHtml;
  }
};

export default function AbonnesPage() {
  const [emailList, setEmailList] = useState([]);
  const [phoneList, setPhoneList] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [subject, setSubject] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);
  const [emailMode, setEmailMode] = useState("custom");
  const [templateFields, setTemplateFields] = useState({
    logoUrl: "",
    mainImage: "",
    title: "",
    subtitle: "",
    sectionTitle: "",
    body: "",
    ctaTitle: "",
    ctaText: "",
    ctaUrl: "",
  });
  const [customHtml, setCustomHtml] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const previewRef = useRef(null);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEmailList(data.emails || []);
        setPhoneList(data.phones || []);
      })
      .catch(() => setError("Erreur lors du chargement des abonnés"))
      .finally(() => setLoading(false));
  }, []);

 useEffect(() => {
  if (emailMode === 'custom') {
    // Create shadow DOM for style isolation
    const previewContainer = previewRef.current;
    if (!previewContainer.shadowRoot) {
      previewContainer.attachShadow({ mode: 'open' });
    }

    // Parse HTML and extract styles
    const parser = new DOMParser();
    const doc = parser.parseFromString(customHtml, 'text/html');
    
    // Extract and inject styles
    const styles = doc.querySelectorAll('style');
    previewContainer.shadowRoot.innerHTML = '';
    
    styles.forEach(style => {
      previewContainer.shadowRoot.appendChild(style.cloneNode(true));
    });

    // Inject content without style tags
    const cleanHtml = customHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = cleanHtml;
    previewContainer.shadowRoot.appendChild(contentDiv);
  }

  return () => {
    if (previewRef.current?.shadowRoot) {
      previewRef.current.shadowRoot.innerHTML = '';
    }
  };
}, [customHtml, emailMode]);



  // Reset content when switching mode
  const handleModeChange = (mode) => {
    setEmailMode(mode);
    setFormError("");
    if (mode === "custom") {
      // Clear template fields
      setTemplateFields({
        logoUrl: "",
        mainImage: "",
        title: "",
        subtitle: "",
        sectionTitle: "",
        body: "",
        ctaTitle: "",
        ctaText: "",
        ctaUrl: "",
      });
    } else if (mode === "template") {
      // Clear custom HTML
      setCustomHtml("");
    }
  };

  // Sélectionner/désélectionner tous les emails
  const toggleAllEmails = () => {
    if (selectedEmails.length === emailList.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(emailList.map((_, i) => i));
    }
  };
  // Sélectionner/désélectionner tous les téléphones
  const toggleAllPhones = () => {
    if (selectedPhones.length === phoneList.length) {
      setSelectedPhones([]);
    } else {
      setSelectedPhones(phoneList.map((_, i) => i));
    }
  };
  // Sélection individuelle email
  const toggleEmail = (idx) => {
    setSelectedEmails((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };
  // Sélection individuelle téléphone
  const togglePhone = (idx) => {
    setSelectedPhones((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  // Validation des champs obligatoires
  const isFormValid = (type) => {
    if (type === "email") {
      return (
        selectedEmails.length > 0 &&
        subject.trim() !== "" &&
        (emailMode === "custom"
          ? customHtml.trim() !== ""
          : templateFields.title.trim() !== "" &&
            templateFields.body.trim() !== "")
      );
    }
    if (type === "whatsapp") {
      return selectedPhones.length > 0 && customHtml.trim() !== "";
    }
    return false;
  };

  const handleSend = async (type) => {
    setFormError("");
    if (!isFormValid(type)) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emails = selectedEmails.map((i) => emailList[i]);
    let payload = {
      emails,
      type,
      subject,
    };

    if (emailMode === "custom") {
      payload.html = customHtml;
    } else if (emailMode === "template") {
      payload.html = renderToStaticMarkup(
        <EmailTemplate {...templateFields} />
      );
    }

    try {
      const res = await fetch(
        "http://localhost/SFE-Project/backend/public/api/send_message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Message envoyé !");
        // Optionally clear fields after send
        if (emailMode === "custom") setCustomHtml("");
        if (emailMode === "template")
          setTemplateFields({
            logoUrl: "",
            mainImage: "",
            title: "",
            subtitle: "",
            sectionTitle: "",
            body: "",
            ctaTitle: "",
            ctaText: "",
            ctaUrl: "",
          });
      } else {
        alert("Erreur : " + (data.error || "Envoi échoué"));
      }
    } catch (e) {
      alert("Erreur réseau");
    }
  };



  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <HeaderPart />
      <div style={{ height: "60px" }} />
      <div style={{ maxWidth: 800, margin: "40px auto 0 auto" }}>
        {loading && <div>Chargement...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Emails selection */}
        {emailList.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#FF5C78",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0 10px 30px",
                }}
              >
                <button
                  onClick={toggleAllEmails}
                  style={{
                    marginRight: 12,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    background: "none",
                    cursor: "pointer",
                    outline: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-label="Tout sélectionner email"
                >
                  {selectedEmails.length === emailList.length &&
                  emailList.length > 0 ? (
                    <span style={{ fontWeight: "bold", color: "#fff" }}>
                      ✔
                    </span>
                  ) : null}
                </button>
                E-mail
              </div>
            </div>
            {fieldErrors.selectedEmails && (
              <div style={{ color: "red", marginBottom: 8 }}>{fieldErrors.selectedEmails}</div>
            )}
            {emailList.map((email, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
                  borderRadius: 10,
                  marginBottom: 10,
                  minHeight: 48,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0 10px 30px",
                  }}
                >
                  <button
                    onClick={() => toggleEmail(idx)}
                    style={{
                      marginRight: 12,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "2px solid #222",
                      background: selectedEmails.includes(idx)
                        ? "#fff"
                        : "none",
                      cursor: "pointer",
                      outline: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Sélectionner email"
                  >
                    {selectedEmails.includes(idx) ? (
                      <span style={{ fontWeight: "bold", color: "#222" }}>
                        ✔
                      </span>
                    ) : null}
                  </button>
                  <span style={{ fontSize: 16 }}>{email}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Phones selection */}
        {phoneList.length > 0 && (
          <>
            <div
              style={{
                display: "flex",
                borderRadius: 10,
                overflow: "hidden",
                marginBottom: 10,
                marginTop: 30,
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: "#FF5C78",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 0 10px 30px",
                }}
              >
                N° Telephone
              </div>
            </div>
            {phoneList.map((phone, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
                  borderRadius: 10,
                  marginBottom: 10,
                  minHeight: 48,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0 10px 30px",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{phone}</span>
                </div>
              </div>
            ))}
          </>
        )}
        <div>
          <h3>Objet de l'email :</h3>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 4,
            }}
            placeholder="Sujet de l'email"
          />
          {fieldErrors.subject && (
            <div style={{ color: "red", marginBottom: 8 }}>
              {fieldErrors.subject}
            </div>
          )}
        </div>
        {/* Email Mode Selection */}
        <div style={{ margin: "30px 0 20px 0", display: "flex", gap: 20 }}>
          <label>
            <input
              type="radio"
              checked={emailMode === "custom"}
              onChange={() => handleModeChange("custom")}
            />{" "}
            Email personnalisé (éditeur HTML)
          </label>
          <label>
            <input
              type="radio"
              checked={emailMode === "template"}
              onChange={() => handleModeChange("template")}
            />{" "}
            Utiliser un template
          </label>
        </div>

        {/* Formulaire du template */}
        {emailMode === "template" && (
          <div style={{ marginBottom: 30 }}>
            <h3>Remplir le template :</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Logo */}
              <label style={{ fontWeight: 500, color: "#333" }}>
                Logo :
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "block", margin: "8px 0 12px 0" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setTemplateFields((f) => ({
                        ...f,
                        logoUrl: ev.target.result,
                      }));
                    reader.readAsDataURL(file);
                  }}
                />
                {templateFields.logoUrl && (
                  <img
                    src={templateFields.logoUrl}
                    alt="Logo"
                    style={{
                      maxWidth: 120,
                      maxHeight: 60,
                      margin: "8px 0",
                      borderRadius: 6,
                      border: "1px solid #eee",
                      background: "#fafafa",
                      display: "block",
                    }}
                  />
                )}
              </label>
              {/* Main Image */}
              <label style={{ fontWeight: 500, color: "#333" }}>
                Image principale :
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "block", margin: "8px 0 12px 0" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setTemplateFields((f) => ({
                        ...f,
                        mainImage: ev.target.result,
                      }));
                    reader.readAsDataURL(file);
                  }}
                />
                {templateFields.mainImage && (
                  <img
                    src={templateFields.mainImage}
                    alt="Main"
                    style={{
                      maxWidth: 300,
                      maxHeight: 120,
                      margin: "8px 0",
                      borderRadius: 8,
                      border: "1px solid #eee",
                      background: "#fafafa",
                      display: "block",
                    }}
                  />
                )}
              </label>
              {/* Other fields */}
              <input
                type="text"
                placeholder="Titre"
                value={templateFields.title}
                onChange={(e) =>
                  setTemplateFields((f) => ({ ...f, title: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
              {fieldErrors.title && (
                <div style={{ color: "red", marginBottom: 8 }}>
                  {fieldErrors.title}
                </div>
              )}
              <input
                type="text"
                placeholder="Sous-titre"
                value={templateFields.subtitle}
                onChange={(e) =>
                  setTemplateFields((f) => ({ ...f, subtitle: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
              <input
                type="text"
                placeholder="Titre de section"
                value={templateFields.sectionTitle}
                onChange={(e) =>
                  setTemplateFields((f) => ({
                    ...f,
                    sectionTitle: e.target.value,
                  }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
              <textarea
                placeholder="Contenu principal (HTML autorisé)"
                value={templateFields.body}
                onChange={(e) =>
                  setTemplateFields((f) => ({ ...f, body: e.target.value }))
                }
                style={{
                  minHeight: 80,
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
              {fieldErrors.body && (
                <div style={{ color: "red", marginBottom: 8 }}>
                  {fieldErrors.body}
                </div>
              )}
              <input
                type="text"
                placeholder="Titre du bouton"
                value={templateFields.ctaTitle}
                onChange={(e) =>
                  setTemplateFields((f) => ({ ...f, ctaTitle: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
              <input
                type="text"
                placeholder="Texte du bouton"
                value={templateFields.ctaText}
                onChange={(e) =>
                  setTemplateFields((f) => ({ ...f, ctaText: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
              <input
                type="text"
                placeholder="URL du bouton"
                value={templateFields.ctaUrl}
                onChange={(e) =>
                  setTemplateFields((f) => ({ ...f, ctaUrl: e.target.value }))
                }
                style={{
                  padding: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  marginBottom: 4,
                }}
              />
            </div>
            <div
              style={{
                marginTop: 20,
                border: "1px solid #eee",
                borderRadius: 8,
                padding: 16,
              }}
            >
              <h4>Aperçu du template :</h4>
              <div style={{ background: "#f9f9f9", padding: 16 }}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: renderToStaticMarkup(
                      <EmailTemplate {...templateFields} />
                    ),
                  }}
                />
              </div>
            </div>
            {/* Submit button for template */}
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              <button
                onClick={() => handleSend("email")}
                disabled={
                  !selectedEmails.length ||
                  !subject.trim() ||
                  !templateFields.title.trim() ||
                  !templateFields.body.trim()
                }
                style={{
                  background: "#0072c6",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: 8,
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Envoyer par Email (Template)
              </button>
            </div>
          </div>
        )}

        {/* Conditional rendering based on email mode */}
        {emailMode === "custom" && (
          <div style={{ marginTop: 40 }}>
            <div style={{ marginBottom: 20 }}>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "20px" }}
              >
                {/* Subject Input */}
                

                {/* Editor and Preview Container */}
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    minHeight: "300px",
                    height: "auto",
                  }}
                >
                  {/* Editor */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      minWidth: "400px",
                      position: "relative",
                    }}
                  >
                    <ReactQuill
                      value={customHtml}
                      onChange={setCustomHtml}
                      modules={modules}
                      formats={[
                        "header",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote",
                        "code-block",
                        "list",
                        "bullet",
                        "script",
                        "indent",
                        "color",
                        "background",
                        "align",
                        "link",
                        "image",
                        "html",
                      ]}
                      style={{
                        height: "auto",
                        minHeight: "600px",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    />
                    {fieldErrors.customHtml && (
                      <div style={{ color: "red", marginBottom: 8 }}>
                        {fieldErrors.customHtml}
                      </div>
                    )}
                  </div>

                  {/* Live Preview - Made larger and flexible */}
                  <div
                    style={{
                      flex: 2,
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      height: "auto",
                      minHeight: "600px",
                      position: "relative",
                    }}
                  >
                    <h4
                      style={{
                        margin: 0,
                        color: "#666",
                        padding: "15px 20px",
                        borderBottom: "1px solid #eee",
                        background: "#fff",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      Preview:
                    </h4>
                    <div
                      ref={previewRef}
                      style={{
                        padding: "20px",
                        overflowY: "auto",
                        flex: 1,
                        minHeight: "500px",
                        height: "auto",
                      }}
                    />
                  </div>
                </div>

                {/* Source HTML View */}
                <div style={{ marginTop: "20px" }}>
                  <details>
                    <summary
                      style={{
                        cursor: "pointer",
                        color: "#666",
                        marginBottom: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      View/Edit HTML Source
                    </summary>
                    <textarea
                      readOnly
                      value={customHtml}
                      onChange={(e) => setCustomHtml(e.target.value)}
                      style={{
                        width: "100%",
                        height: "200px",
                        padding: "10px",
                        fontFamily: "monospace",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        marginTop: "10px",
                      }}
                    />
                  </details>
                </div>
              </div>
            </div>
            {/* Submit button for custom */}
            <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
              <button
                onClick={() => handleSend("email")}
                disabled={
                  !selectedEmails.length ||
                  !subject.trim() ||
                  !customHtml.trim()
                }
                style={{
                  background: "#0072c6",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  border: "none",
                  borderRadius: 8,
                  padding: "1rem 2rem",
                  cursor: "pointer",
                  flex: 1,
                }}
              >
                Envoyer par Email (Personnalisé)
              </button>
            </div>
          </div>
        )}

        {/* Message d'erreur si champs obligatoires manquants */}
        {formError && (
          <div style={{ color: "red", marginBottom: 16 }}>{formError}</div>
        )}
      </div>
    </div>
  );
}


