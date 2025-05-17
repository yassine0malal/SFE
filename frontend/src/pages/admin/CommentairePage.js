import React, { useState, useEffect } from "react";
import HeaderPart from "../../components/admin/header";

const avatarColors = [
  "#7ED957", "#FF6B6B", "#36A2EB", "#FFD43B", "#A259FF", "#FF914D", "#43B97F"
];

const GENDER_OPTIONS = [
  { value: 'male', label: 'Homme', color: '#e3f2fd', textColor: '#1976d2' },
  { value: 'female', label: 'Femme', color: '#fce4ec', textColor: '#c2185b' }
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
  const [comments, setComments] = useState({ commentaires: [], avis: [] });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    gender: '',
    approuve: 'pending'
  });

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

        if (data.success) {
          const shuffled = shuffleArray(avatarColors);
          
          // Process commentaires
          const commentaires = data.commentaires.map((c, i) => ({
            ...c,
            couleur: shuffled[i % shuffled.length],
            approuve: c.approuve === '1' ? 'accepted' : c.approuve === '0' ? 'rejected' : 'pending',
            type: 'comment'
          }));

          // Process avis
          const avis = data.avis.map((a, i) => ({
            ...a,
            couleur: shuffled[(i + commentaires.length) % shuffled.length],
            approuve: a.approuve === '1' ? 'accepted' : a.approuve === '0' ? 'rejected' : 'pending',
            type: 'avis'
          }));

          setComments({ commentaires, avis });
        }
      } catch (e) {
        console.error(e);
        setComments({ commentaires: [], avis: [] });
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, []);

  async function handleDecision(id, idx, decision, type) {
    const confirmMsg = decision === 'accepted' 
      ? "Voulez-vous vraiment accepter cet élément ?"
      : "Voulez-vous vraiment rejeter cet élément ?";

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
        setComments(prev => ({
          ...prev,
          [type]: prev[type].map((c, i) => 
            i === idx ? { ...c, approuve: decision } : c
          )
        }));
        alert(`Élément ${decision === 'accepted' ? 'accepté' : 'rejeté'} !`);
      } else {
        alert(result.error || "Erreur lors de la mise à jour");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur lors de la mise à jour");
    }
  }

  const startEditing = (item) => {
    setEditingId(item.id);
    setFormData({
      gender: item.sex || '',
      approuve: item.approuve || 'pending'
    });
  };

  const handleSubmit = async (e, item, type) => {
    e.preventDefault();
    
    // Only proceed if there are actual changes
    if (formData.gender === item.sex && formData.approuve === item.approuve) {
      setEditingId(null);
      return;
    }

    if (window.confirm('Voulez-vous enregistrer ces modifications ?')) {
      try {
        const res = await fetch(
          "http://localhost/SFE-Project/backend/public/api/avis_utilisateurs",
          {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              id: item.id,
              sex: formData.gender,
              approuve: formData.approuve === 'accepted' ? 1 : 
                       formData.approuve === 'rejected' ? 0 : null
            })
          }
        );
        
        const result = await res.json();

        if (result.success) {
          setComments(prev => ({
            ...prev,
            [type]: prev[type].map((c) => 
              c.id === item.id ? { 
                ...c, 
                sex: formData.gender,
                approuve: formData.approuve
              } : c
            )
          }));
          setEditingId(null);
          alert('Modifications enregistrées avec succès !');
        } else {
          alert(result.error || "Erreur lors de la mise à jour");
        }
      } catch (e) {
        console.error(e);
        alert("Erreur lors de la mise à jour");
      }
    }
  };

  const getInitial = name => name?.charAt(0)?.toUpperCase() || "?";

  const statusConfig = {
    accepted: { text: "Accepté", color: "#2ecc40", icon: "✓" },
    rejected: { text: "Rejeté", color: "#ff4d4f", icon: "✕" },
    pending: { text: "En attente", color: "#888", icon: "?" }
  };

  const renderItem = (item, idx, type) => {
    const status = item.approuve || 'pending';
    const { text, color } = statusConfig[status];
    const isEditing = editingId === item.id;

    return (
      <div
        key={item.id || idx}
        style={{
          padding: "1.5rem",
          borderRadius: 12,
          marginBottom: 15,
          background: "#f8f9fa",
          border: "1px solid #e9ecef",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: item.couleur,
              color: "#fff",
              fontWeight: "bold",
              fontSize: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {getInitial(item.nom_prenom)}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '8px'
            }}>
              <h3 style={{ 
                margin: 0, 
                fontSize: 18,
                fontWeight: "600"
              }}>
                {item.nom_prenom}
              </h3>
              {item.sex && !isEditing && (
                <span style={{ 
                  fontSize: 13,
                  padding: '4px 12px',
                  borderRadius: 20,
                  background: item.sex === 'male' ? '#e3f2fd' : '#fce4ec',
                  color: item.sex === 'male' ? '#1976d2' : '#c2185b',
                  fontWeight: '500'
                }}>
                  {item.sex === 'male' ? 'Homme' : 'Femme'}
                </span>
              )}
              <span style={{
                fontSize: 13,
                padding: '4px 12px',
                borderRadius: 20,
                background: color + '20',
                color: color,
                fontWeight: '500'
              }}>
                {text}
              </span>
            </div>

            <div style={{ fontSize: 14, color: "#666", marginBottom: '8px' }}>
              {item.created_at}
            </div>

            <div style={{ 
              fontSize: 15, 
              color: "#333", 
              marginBottom: '15px',
              lineHeight: '1.5'
            }}>
              {item.message}
            </div>

            {item.id_publication && (
              <div style={{ 
                fontSize: 13, 
                color: "#666", 
                marginBottom: '15px',
                padding: '8px 12px',
                background: '#f1f3f5',
                borderRadius: '6px',
                display: 'inline-block'
              }}>
                ID Publication: {item.id_publication}
              </div>
            )}
          </div>

          <button
            onClick={() => isEditing ? setEditingId(null) : startEditing(item)}
            style={{
              // background: "transparent",
              border: "none",
              color: "#666",
              cursor: "pointer",
              fontSize: "14px",
              padding: "8px 16px",
              borderRadius: "6px",
              transition: "all 0.2s"
            }}
          >
            {isEditing ? "Annuler" : "Modifier"}
          </button>
        </div>

        {isEditing && (
          <div style={{
            marginTop: "20px",
            padding: "20px",
            background: "#fff",
            borderRadius: "8px",
            border: "1px solid #e9ecef"
          }}>
            <form onSubmit={(e) => handleSubmit(e, item, type)}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Statut:
                </label>
                <div style={{ 
                  display: "flex", 
                  gap: "10px",
                  marginBottom: "15px"
                }}>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, approuve: 'accepted' }))}
                    style={{
                      padding: "8px 16px",
                      background: formData.approuve === 'accepted' ? "#2ecc40" : "#fff",
                      color: formData.approuve === 'accepted' ? "#fff" : "#333",
                      border: "1px solid #2ecc40",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>✓</span>
                    Approuver
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, approuve: 'rejected' }))}
                    style={{
                      padding: "8px 16px",
                      background: formData.approuve === 'rejected' ? "#ff4d4f" : "#fff",
                      color: formData.approuve === 'rejected' ? "#fff" : "#333",
                      border: "1px solid #ff4d4f",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>✕</span>
                    Rejeter
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Genre:
                </label>
                <div style={{ 
                  display: "flex", 
                  gap: "10px" 
                }}>
                  {GENDER_OPTIONS.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, gender: option.value }))}
                      style={{
                        padding: "8px 16px",
                        background: formData.gender === option.value ? option.color : "#fff",
                        color: formData.gender === option.value ? option.textColor : "#333",
                        border: `1px solid ${option.color}`,
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ 
                display: "flex", 
                justifyContent: "flex-end", 
                gap: "10px",
                marginTop: "20px" 
              }}>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  style={{
                    padding: "8px 20px",
                    background: "#fff",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 20px",
                    background: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, background: "#fff", minHeight: "100vh" }}>
      <HeaderPart />
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
            Chargement...
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ 
                fontSize: 24,
                fontWeight: 600,
                color: "#333",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "2px solid #eee"
              }}>
                Commentaires ({comments.commentaires.length})
              </h2>
              {comments.commentaires.map((item, idx) => 
                renderItem(item, idx, 'commentaires')
              )}
            </div>

            <div>
              <h2 style={{ 
                fontSize: 24,
                fontWeight: 600,
                color: "#333",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: "2px solid #eee"
              }}>
                Avis ({comments.avis.length})
              </h2>
              {comments.avis.map((item, idx) => 
                renderItem(item, idx, 'avis')
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}