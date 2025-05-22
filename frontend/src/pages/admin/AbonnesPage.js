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
  // const [emailMode, setEmailMode] = useState('template'); // 'template' or 'custom'
  const [customHtml, setCustomHtml] = useState("");

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
        customHtml.trim() !== "" // <-- use customHtml, not message
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
    const payload = {
      emails,
      type,
      subject,
      html: customHtml,
    };
    console.log(payload); // <--- HERE

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

        {/* Email Mode Selection */}
        <div style={{ marginTop: 40, marginBottom: 30 }}>
          <div style={{ display: "flex", gap: 15 }}>
            <button
              style={{
                padding: "10px 20px",
                background: "#FF5C78",
                color: "#fff",
                border: "1px solid #FF5C78",
                borderRadius: 8,
                cursor: "pointer",
                flex: 1,
              }}
            >
              L'envoi d'email 
            </button>
          </div>
        </div>

        {/* Conditional rendering based on email mode */}

        <div style={{ marginTop: 40 }}>
          <div style={{ marginBottom: 20 }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Subject Input */}
              <div>
                <h3>Objet de l'email :</h3>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    padding: 12,
                    fontSize: 16,
                    marginBottom: 20,
                  }}
                  placeholder="Sujet de l'email"
                />
              </div>

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
                    theme="snow"
                    value={customHtml}
                    onChange={(content) => {
                      setCustomHtml(content);
                      // Force preview update
                      const previewDiv =
                        document.getElementById("preview-content");
                      if (previewDiv) {
                        previewDiv.innerHTML = content;
                      }
                    }}
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
                    id="preview-content"
                    style={{
                      padding: "20px",
                      overflowY: "auto",
                      flex: 1,
                      minHeight: "500px",
                      height: "auto",
                    }}
                    dangerouslySetInnerHTML={{ __html: customHtml }}
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
        </div>

        {/* Message d'erreur si champs obligatoires manquants */}
        {formError && (
          <div style={{ color: "red", marginBottom: 16 }}>{formError}</div>
        )}

        {/* Boutons d'envoi */}
        <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
          <button
            onClick={() => handleSend("email")}
            disabled={!isFormValid("email")}
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
            Envoyer par Email
          </button>
        </div>
      </div>
    </div>
  );
}

<style>
  {`
    .ql-container {
      flex: 1;
      overflow: visible;
      height: auto !important;
      min-height: 300px;
    }
    .ql-editor {
      min-height: 300px;
      height: auto !important;
      font-size: 16px;
      line-height: 1.6;
      overflow: visible;
    }
    .ql-editor p {
      margin-bottom: 1em;
    }
    #preview-content {
      font-size: 16px;
      line-height: 1.6;
      height: auto !important;
      min-height: 300px;
    }
    #preview-content p {
      margin-bottom: 1em;
    }
    .ql-toolbar.ql-snow {
      position: sticky;
      top: 0;
      z-index: 2;
      background: white;
    }
  `}
</style>;
