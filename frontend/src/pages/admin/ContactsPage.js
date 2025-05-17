import React, { useState, useEffect } from "react";
import colors from "../../constants/colors";
import Header from "../../components/admin/header"; // <-- Import your Header


export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Responsive hook
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

  // Récupération des contacts depuis l'API backend
  useEffect(() => {
    fetch("http://localhost/SFE-Project/backend/public/api/contact", {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data.error === "Non authentifié") {
          window.location.href = "/login";
        } else {
          setContacts(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => setContacts([]));
  }, []);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    const handleClickOutside = e => {
      if (!e.target.closest(".user-menu")) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const filtered = contacts.filter(c =>
    (c.nom_prenom || "").toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = id_contact => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce contact ?");
    if (!confirmDelete) return;
    console.log("Deleting contact with ID:", id_contact);
    fetch(`http://localhost/SFE-Project/backend/public/api/contact?id_contact=${id_contact}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setContacts(cs => cs.filter(c => c.id_contact !== id_contact));
        } else {
          alert(data.error || "Erreur lors de la suppression");
        }
      })
      .catch(() => alert("Erreur lors de la suppression"));
  };
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // Dynamic styles
  const layoutStyle = {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    width: "100%",
    boxSizing: "border-box",
  };
  const mainStyle = {
    maxWidth: 1200,
    margin: "0 auto",
  };
  const headerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.5rem",
  };
  const searchWrapperStyle = {
    position: "relative",
    flex: 1,
    maxWidth: isMobile ? "100%" : 300,
    marginBottom: isMobile ? "1rem" : 0,
  };
  const userMenuStyle = {
    ...styles.userMenu,
    position: isMobile ? "static" : "absolute",
    top: isMobile ? "auto" : 10,
    right: isMobile ? "auto" : 10,
    margin: isMobile ? "0 auto 1rem" : 0,
  };

  return (
    <div style={layoutStyle}>
      <main style={mainStyle}>
        <div style={headerStyle}>
          {/* Search */}
          <div style={searchWrapperStyle}>
            <input
              type="text"
              placeholder="Chercher par le nom"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={styles.searchInput}
            />
            <img
              src="icons/research.png"
              alt="Recherche"
              style={styles.searchIcon}
            />
          </div>
          <Header/>

        </div>

        {/* Table / Cards */}
        <div style={{ overflowX: isMobile ? "auto" : "visible" }}>
          <ContactsList
            contacts={filtered}
            onDelete={handleDelete}
            isMobile={isMobile}
          />
        </div>
      </main>
    </div>
  );
}

function ContactsList({ contacts, onDelete, isMobile }) {
  if (!contacts.length) return <p>Aucun contact trouvé.</p>;

  // Mobile: as cards
  if (isMobile) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {contacts.map(c => (
          <div
            key={c.id_contact}
            style={{
              background: "#f9f9f9",
              padding: "1rem",
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Nom :</strong> {c.nom_prenom}</p>
            <p><strong>adresse_email :</strong> {c.adresse_email}</p>
            <p><strong>Télételephone :</strong> {c.telephone}</p>
            <p><strong>Message :</strong> {c.message}</p>
            <button
              style={styles.deleteBtn}
              onClick={() => onDelete(c.id_contact)}
            >
              <img src="icons/trash.svg" alt="Supprimer" width={24} />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: as table
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          {["Nom complet","E‑mail","N° Télételephone","Message","Action"].map((h,i)=>(
            <th key={i} style={styles.thtdHeader}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {contacts.map(c => (
          <tr key={c.id_contact} style={styles.row}>
            <td style={styles.thtd}>{c.nom_prenom}</td>
            <td style={styles.thtd}>{c.adresse_email}</td>
            <td style={styles.thtd}>{c.telephone}</td>
            <td style={styles.thtd}>{c.message}</td>
            <td style={styles.thtd}>
              <button
                style={styles.deleteBtn}
                onClick={() => onDelete(c.id_contact)}
              >
                <img src="icons/trash.svg" alt="Supprimer" width={30} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  searchInput: {
    background: colors.tableRowHover,
    width: "100%",
    padding: "1rem 1rem 1rem 3.6rem",
    border: `1px solid ${colors.inputBorder}`,
    borderRadius: 15,
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    left: 8,
    top: "50%",
    transform: "translateY(-50%)",
    width: 30,
    height: 30,
    pointerEvents: "none",
  },
  userMenu: {
    display: "flex",
    alignItems: "center",
    background: "#f9f9f9",
    padding: "0.5rem 1rem",
    borderRadius: 8,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  userAvatar: {
    width: 40, height: 40, borderRadius: "50%", marginRight: 10,
    background: "#e0e0e0",
  },
  useradresse_email: {
    fontSize: "1rem", fontWeight: "bold", color: "#333", marginRight: 6,
  },
  dropdownIcon: { cursor: "pointer" },
  arrowDownIcon: { width: 30, height: 30, marginLeft: 4 },
  dropdownMenu: {
    position: "absolute", top: 50, right: 10,
    background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    borderRadius: 8, padding: "0.5rem", zIndex: 1000,
  },
  logoutButton: {
    background: "none", border: "none", color: "#333",
    fontSize: "1rem", fontWeight: "bold", cursor: "pointer",
    padding: "0.5rem 1rem", textAlign: "left", width: "100%",
  },
  table: {
    width: "100%", borderCollapse: "separate", borderSpacing: "0 10px",
    background: "#fff", minWidth: 600,
  },
  thtdHeader: {
    padding: "1rem", textAlign: "left",
  },
  row: {
    background: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    borderRadius: 12, overflow: "hidden",
  },
  thtd: {
    padding: "1rem", background: "#f9f9f9", borderRadius: 4, textAlign: "left",
  },
  deleteBtn: {
    background: "none", border: "none", padding: 0, cursor: "pointer",
  },
};