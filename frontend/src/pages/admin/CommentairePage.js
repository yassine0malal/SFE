import React, { useState } from "react";
import HeaderPart from "../../components/admin/header";

// Données des commentaires
const commentairesData = [
  {
    nom: "Yassine MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#7ED957",
  },
  {
    nom: "Hassine MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à LeuLeur structure est définie par un plan de numérotation propre àLeur structure est définie par un plan de numérotation propre àr structure est définie par un plan de numérotation propre à Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FF6B6B",
  },
  {
    nom: "Yassine MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#7ED957",
  },
  {
    nom: "Hassine MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à LeuLeur structure est définie par un plan de numérotation propre àLeur structure est définie par un plan de numérotation propre àr structure est définie par un plan de numérotation propre à Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FF6B6B",
  },
  {
    nom: "Yassine MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#7ED957",
  },
  {
    nom: "Hassine MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à LeuLeur structure est définie par un plan de numérotation propre àLeur structure est définie par un plan de numérotation propre àr structure est définie par un plan de numérotation propre à Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FF6B6B",
  },
  {
    nom: "Taha MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#36A2EB",
  },
  {
    nom: "Abdelah MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FFD43B",
  },
  {
    nom: "Yahya MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#7ED957",
  },
  {
    nom: "Mbarek MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FF6B6B",
  },
  {
    nom: "Fatima MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#36A2EB",
  },
  {
    nom: "Yahya MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#7ED957",
  },
  {
    nom: "Mbarek MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FF6B6B",
  },
  {
    nom: "Fatima MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#36A2EB",
  },
  {
    nom: "Yahya MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#7ED957",
  },
  {
    nom: "Mbarek MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#FF6B6B",
  },
  {
    nom: "Fatima MLAL",
    date: "7-08-2025 at 8:55 PM",
    texte: "Leur structure est définie par un plan de numérotation propre à",
    couleur: "#36A2EB",
  },
];

export default function CommentairePage() {
  const [comments, setComments] = useState(commentairesData);

  // Confirmation pour accepter
  const handleAccept = (idx) => {
    if (window.confirm("Voulez-vous vraiment accepter ce commentaire ?")) {
      alert("Commentaire accepté !");
      // Ici tu peux faire un appel API ou mettre à jour le state si besoin
    }
  };

  // Confirmation pour rejeter
  const handleReject = (idx) => {
    if (window.confirm("Voulez-vous vraiment rejeter ce commentaire ?")) {
      alert("Commentaire rejeté !");
      // Ici tu peux faire un appel API ou mettre à jour le state si besoin
    }
  };

  // Pour obtenir la première lettre du nom
  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div style={{ flex: 1, background: "#fff", minHeight: "100vh", position: "relative" }}>
      <HeaderPart />
      <div style={{ height: "60px" }}></div>
      <div style={{ maxWidth: 900, margin: "40px auto 0 auto" }}>
        {comments.map((comment, idx) => (
          <div
            key={idx}
            style={{
                padding: "1rem",
              display: "flex",
              alignItems: "center",
              borderRadius: 10,
              marginBottom: 10,
              minHeight: 60,
              background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
              border: "none",
              boxShadow: "none",
            }}
          >
            {/* Avatar rond avec initiale */}
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: comment.couleur,
                color: "#fff",
                fontWeight: "bold",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 18px",
              }}
            >
              {getInitial(comment.nom)}
            </div>
            {/* Infos commentaire */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: "bold", fontSize: 16 }}>{comment.nom}</div>
              <div style={{ fontSize: 13, color: "#888" }}>{comment.date}</div>
              <div style={{ fontSize: 15, color: "#333", marginTop: 2, whiteSpace: "pre-line" }}>
                {comment.texte}
              </div>
            </div>
            {/* Boutons */}
            <div style={{ display: "flex", gap: 10, marginRight: 18 }}>
              <button
                onClick={() => handleAccept(idx)}
                style={{
                  background: "#7ED957",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Accepter"
              >
                <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>✓</span>
              </button>
              <button
                onClick={() => handleReject(idx)}
                style={{
                  background: "#FF6B6B",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Rejeter"
              >
                <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>✕</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}