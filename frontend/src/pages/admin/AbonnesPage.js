import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";

// Données sous forme demandée
const abonnesData = {
  emails: [
    "yassinienlalal@gmail.com",
    "yassinienlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
    "hassanmlalal@gmail.com",
  ],
  phones: [
    "0655146069",
    "0655146069",
    "0655146069",
    "0655146069",
    "0655233433",
    "0612345678",
    "0612345678",
  ],
};

export default function AbonnesPage() {
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const navigate = useNavigate();

  // Sélectionner/désélectionner tous les emails
  const toggleAllEmails = () => {
    if (selectedEmails.length === abonnesData.emails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(abonnesData.emails.map((_, i) => i));
    }
  };
  // Sélectionner/désélectionner tous les téléphones
  const toggleAllPhones = () => {
    if (selectedPhones.length === abonnesData.phones.length) {
      setSelectedPhones([]);
    } else {
      setSelectedPhones(abonnesData.phones.map((_, i) => i));
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

  // Sauvegarder et rediriger
  const handleSend = () => {
    const emails = selectedEmails.map(i => abonnesData.emails[i]);
    const phones = selectedPhones.map(i => abonnesData.phones[i]);
    localStorage.setItem("selectedEmails", JSON.stringify(emails));
    localStorage.setItem("selectedPhones", JSON.stringify(phones));
    console.log("Emails sélectionnés :", emails, "Téléphones sélectionnés :", phones);
    if(emails.length > 0 || phones.length > 0)
    navigate("/abonees/envoyer-message");
  };

  return (
    <div style={{ flex: 1, background: "#fff", minHeight: "100vh", position: "relative" }}>
      <HeaderPart />
      <div style={{ height: "60px" }}> </div>
      <div style={{ maxWidth: 800, margin: "40px auto 0 auto" }}>
        {/* Emails */}
        {abonnesData.emails.length > 0 && (
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
                  {selectedEmails.length === abonnesData.emails.length && abonnesData.emails.length > 0 ? (
                    <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
                  ) : null}
                </button>
                E-mail
              </div>
            </div>
            {abonnesData.emails.map((email, idx) => (
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

        {/* Phones */}
        {abonnesData.phones.length > 0 && (
          <>
            <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10, marginTop: 30 }}>
              <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
                <button
                  onClick={toggleAllPhones}
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
                  aria-label="Tout sélectionner téléphone"
                >
                  {selectedPhones.length === abonnesData.phones.length && abonnesData.phones.length > 0 ? (
                    <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
                  ) : null}
                </button>
                N° Telephone
              </div>
            </div>
            {abonnesData.phones.map((phone, idx) => (
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
                    onClick={() => togglePhone(idx)}
                    style={{
                      marginRight: 12,
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      border: "2px solid #222",
                      background: selectedPhones.includes(idx) ? "#fff" : "none",
                      cursor: "pointer",
                      outline: "none",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-label="Sélectionner téléphone"
                  >
                    {selectedPhones.includes(idx) ? (
                      <span style={{ fontWeight: "bold", color: "#222" }}>✔</span>
                    ) : null}
                  </button>
                  <span style={{ fontSize: 16 }}>{phone}</span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* Bouton Envoyer */}
        <button
          style={{
            display: "block",
            width: 400,
            maxWidth: "100%",
            margin: "40px auto 0 auto",
            background: "#FF5C78",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "2rem",
            border: "none",
            borderRadius: 12,
            padding: "1.2rem",
            letterSpacing: 2,
            cursor: "pointer",
          }}
          onClick={handleSend}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}