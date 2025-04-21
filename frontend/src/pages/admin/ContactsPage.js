import React, { useState, useEffect } from "react";
import colors from "../../constants/colors";

const mockContacts = [
  {
    id: 1,
    fullName: "Yassine Malal",
    email: "yassinemalal@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 2,
    fullName: "Yassine Abouho",
    email: "yassineabouho@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 3,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 4,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 5,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 6,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 7,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 8,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 9,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 10,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
  {
    id: 11,
    fullName: "Hamza Folan",
    email: "hamzafolan@gmail.com",
    phone: "+212 655146069",
    subject: "Leur structure est définie par un plan de numérotation propre à",
  },
];

export default function ContactsPage() {
  const [contacts, setContacts] = useState(mockContacts);
  const [filter, setFilter] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Responsive hook
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;

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
    c.fullName.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = id => setContacts(cs => cs.filter(c => c.id !== id));
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

          {/* User menu */}
          <div className="user-menu" style={userMenuStyle}>
            <img
              src="/images/image.png"
              alt="User Avatar"
              style={styles.userAvatar}
            />
            <span style={styles.userEmail}>admin1@gmail.com</span>
            <span style={styles.dropdownIcon} onClick={toggleDropdown}>
              <img
                src="/icons/arrow-down.png"
                alt="arrow down"
                style={styles.arrowDownIcon}
              />
            </span>
            {isDropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button
                  style={styles.logoutButton}
                  onClick={() => alert("Logged Out!")}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
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
            key={c.id}
            style={{
              background: "#f9f9f9",
              padding: "1rem",
              borderRadius: 8,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <p><strong>Nom :</strong> {c.fullName}</p>
            <p><strong>Email :</strong> {c.email}</p>
            <p><strong>Téléphone :</strong> {c.phone}</p>
            <p><strong>Sujet :</strong> {c.subject}</p>
            <button
              style={styles.deleteBtn}
              onClick={() => onDelete(c.id)}
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
          {["Nom complet","E‑mail","N° Téléphone","Sujet","Action"].map((h,i)=>(
            <th key={i} style={styles.thtdHeader}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {contacts.map(c => (
          <tr key={c.id} style={styles.row}>
            <td style={styles.thtd}>{c.fullName}</td>
            <td style={styles.thtd}>{c.email}</td>
            <td style={styles.thtd}>{c.phone}</td>
            <td style={styles.thtd}>{c.subject}</td>
            <td style={styles.thtd}>
              <button
                style={styles.deleteBtn}
                onClick={() => onDelete(c.id)}
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
  userEmail: {
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