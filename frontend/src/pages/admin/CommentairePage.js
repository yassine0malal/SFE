import React, { useState, useEffect } from "react";
import HeaderPart from "../../components/admin/header";

const avatarColors = [
  "#7ED957", "#FF6B6B", "#36A2EB", "#FFD43B", "#A259FF", "#FF914D", "#43B97F"
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CommentairePage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(
          "http://localhost/SFE-Project/backend/public/api/avis_utilisateurs",
          { method: "GET", credentials: "include" }
        );
        const data = await res.json();
        
        if (data.error === "Non authentifié") {
          window.location.href = "/login";
          return;
        }

        if (Array.isArray(data)) {
          console.log(JSON.stringify(data));
          const shuffled = shuffleArray(avatarColors);
          const withColors = data.map((c, i) => ({
            ...c,
            couleur: shuffled[i % shuffled.length],
            approuve: c.approuve === '1' ? 'accepted' : c.approuve === '0' ? 'rejected' : 'pending'
          }));
          setComments(withColors);
        } else {
          setComments([]);
        }
      } catch (e) {
        console.error(e);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  async function handleDecision(id, idx, decision) {
    const confirmMsg = decision === 'accepted' 
      ? "Voulez-vous vraiment accepter ce commentaire ?"
      : "Voulez-vous vraiment rejeter ce commentaire ?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(
        "http://localhost/SFE-Project/backend/public/api/avis_utilisateurs",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            id, 
            approuve: decision === 'accepted' ? 1 : 0 
          })
        }
      );
      
      const result = await res.json();
      
      if (result.success) {
        setComments(prev =>
          prev.map((c, i) => 
            i === idx ? { ...c, approuve: decision } : c
          )
        );
        alert(`Commentaire ${decision === 'accepted' ? 'accepté' : 'rejeté'} !`);
      } else {
        alert(result.error || "Erreur lors de la mise à jour");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour");
    }
  }

  const getInitial = name => name?.charAt(0)?.toUpperCase() || "?";

  const statusConfig = {
    accepted: { text: "Accepté", color: "#2ecc40" },
    rejected: { text: "Rejeté", color: "#ff4d4f" },
    pending: { text: "En attente", color: "#888" }
  };

  return (
    <div style={{ flex: 1, background: "#fff", minHeight: "100vh", position: "relative" }}>
      <HeaderPart />
      <div style={{ height: 60 }} />
      <div style={{ maxWidth: 900, margin: "40px auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            Chargement...
          </div>
        ) : comments.length === 0 ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            Aucun commentaire trouvé.
          </div>
        ) : (
          comments.map((comment, idx) => {
            const status = comment.approuve || 'pending';
            const { text, color } = statusConfig[status];

            return (
              <div
                key={comment.id || idx}
                style={{
                  padding: "1rem",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 10,
                  marginBottom: 10,
                  minHeight: 60,
                  background: idx % 2 === 0 ? "#f7f7f7" : "#ededed"
                }}
              >
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
                    margin: "0 18px"
                  }}
                >
                  {getInitial(comment.nom_prenom)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>{comment.nom_prenom}</div>
                  <div style={{ fontSize: 13, color: "#888" }}>{comment.created_at}</div>
                  <div style={{ fontSize: 15, color: "#333", marginTop: 2, whiteSpace: "pre-line" }}>
                    {comment.message}
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      color: color,
                      marginTop: 4,
                      fontWeight: "bold"
                    }}
                  >
                    Statut: {text}
                  </div>
                </div>

                {status === 'pending' && (
                  <div style={{ display: "flex", gap: 10, marginRight: 18 }}>
                    <button
                      onClick={() => handleDecision(comment.id, idx, 'accepted')}
                      style={{
                        background: "#7ED957",
                        border: "none",
                        borderRadius: "50%",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      title="Accepter"
                    >
                      <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>✓</span>
                    </button>
                    <button
                      onClick={() => handleDecision(comment.id, idx, 'rejected')}
                      style={{
                        background: "#FF6B6B",
                        border: "none",
                        borderRadius: "50%",
                        width: 28,
                        height: 28,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer"
                      }}
                      title="Rejeter"
                    >
                      <span style={{ color: "#fff", fontWeight: "bold", fontSize: 18 }}>✕</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}