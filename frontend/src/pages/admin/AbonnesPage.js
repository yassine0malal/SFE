import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import { renderToStaticMarkup } from "react-dom/server";
import { EmailTemplate } from "./SendMessage"; // Adjust path if needed

const API_URL = "http://localhost/SFE-Project/backend/public/api/abonnees";

export default function AbonnesPage() {
  const [emailList, setEmailList] = useState([]);
  const [phoneList, setPhoneList] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [subject, setSubject] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sectionTitle, setSectionTitle] = useState("");
  const [message, setMessage] = useState("");
  const [footer, setFooter] = useState("");
  const [image, setImage] = useState(null);
  const [ctaTitle, setCtaTitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaUrl, setCtaUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
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
        message.trim() !== ""
      );
    }
    if (type === "whatsapp") {
      return (
        selectedPhones.length > 0 &&
        message.trim() !== ""
      );
    }
    return false;
  };

  const handleSend = async (type) => {
    setFormError("");
    if (!isFormValid(type)) {
      setFormError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const emails = selectedEmails.map(i => emailList[i]);
    const phones = selectedPhones.map(i => phoneList[i]);
    let html = undefined;

    if (type === "email") {
      html = renderToStaticMarkup(
        <EmailTemplate
          logoUrl="images/logo.png"
          mainImage={image}
          title={subject}
          subtitle={subtitle}
          sectionTitle={sectionTitle}
          body={message}
          ctaTitle={ctaTitle}
          ctaText={ctaText}
          ctaUrl={ctaUrl}
        />
      );
    }

    const payload = {
      emails,
      phones,
      subject,
      subtitle,
      sectionTitle,
      message,
      footer,
      html,
      ctaTitle,
      ctaText,
      ctaUrl,
      type
    };

    try {
      const res = await fetch("http://localhost/SFE-Project/backend/public/api/send_message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload)
      });
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
    <div style={{ flex: 1, background: "#fff", minHeight: "100vh", position: "relative" }}>
      <HeaderPart />
      <div style={{ height: "60px" }} />
      <div style={{ maxWidth: 800, margin: "40px auto 0 auto" }}>
        {loading && <div>Chargement...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}

        {/* Emails selection */}
        {emailList.length > 0 && (
          <>
            <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
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
                  {selectedEmails.length === emailList.length && emailList.length > 0 ? (
                    <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
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
                <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
                  <button
                    onClick={() => toggleEmail(idx)}
                    style={{
                      marginRight: 12,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "2px solid #222",
                      background: selectedEmails.includes(idx) ? "#fff" : "none",
                      cursor: "pointer",
                      outline: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Sélectionner email"
                  >
                    {selectedEmails.includes(idx) ? (
                      <span style={{ fontWeight: "bold", color: "#222" }}>✔</span>
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
    <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10, marginTop: 30 }}>
      <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
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
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
          <span style={{ fontSize: 16 }}>{phone}</span>
        </div>
      </div>
    ))}
  </>
)}

        {/* Formulaire du message */}
        <div style={{ marginTop: 40 }}>
          <h3>Objet (Titre principal) :</h3>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Sujet de l'email"
          />

          <h3>Sous-titre :</h3>
          <input
            type="text"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Sous-titre"
          />

          <h3>Image principale :</h3>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ marginBottom: 20 }}
            onChange={handleImageUpload}
          />
          {image && (
            <div style={{ marginBottom: 20 }}>
              <img src={image} alt="Aperçu" style={{ maxWidth: "100%", maxHeight: 200 }} />
            </div>
          )}

          <h3>Titre de section :</h3>
          <input
            type="text"
            value={sectionTitle}
            onChange={e => setSectionTitle(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Titre de la section"
          />

          <h3>Corps du message :</h3>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            style={{
              width: "100%",
              minHeight: 100,
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Votre message ici..."
          />

          <h3>Pied de page (facultatif) :</h3>
          <input
            type="text"
            value={footer}
            onChange={e => setFooter(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Pied de page ou signature"
          />

          <h3>Titre du bloc bouton :</h3>
          <input
            type="text"
            value={ctaTitle}
            onChange={e => setCtaTitle(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Titre au-dessus du bouton"
          />

          <h3>Texte du bouton :</h3>
          <input
            type="text"
            value={ctaText}
            onChange={e => setCtaText(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="Texte du bouton"
          />

          <h3>Lien du bouton :</h3>
          <input
            type="text"
            value={ctaUrl}
            onChange={e => setCtaUrl(e.target.value)}
            style={{
              width: "100%",
              borderRadius: 8,
              border: "1px solid #ccc",
              padding: 12,
              fontSize: 16,
              marginBottom: 20
            }}
            placeholder="https://votre-lien.com"
          />
        </div>

        {/* Message d'erreur si champs obligatoires manquants */}
        {formError && (
          <div style={{ color: "red", marginBottom: 16 }}>{formError}</div>
        )}

        {/* Boutons d'envoi */}
        <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
          
          <button
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
            onClick={() => handleSend("email")}
            disabled={!isFormValid("email")}
          >
            Envoyer par Email
          </button>
        </div>
      </div>
    </div>
  );
}