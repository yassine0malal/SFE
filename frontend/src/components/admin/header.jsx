import React,{ useState, useEffect }from "react";
import { useNavigate }from "react-router-dom";
export default function Header(){



    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
      const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
      const closeDropdown = () => setIsDropdownOpen(false);
      const navigate = useNavigate(); // Utilisé pour la redirection

    
      // Responsive
      const [width, setWidth] = useState(window.innerWidth);
      const isMobile = width <= 768;
      useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        const handleClickOutside = event => {
          if (!event.target.closest(".user-menu")) closeDropdown();
        };
    
        window.addEventListener("resize", handleResize);
        document.addEventListener("click", handleClickOutside);
        return () => {
          window.removeEventListener("resize", handleResize);
          document.removeEventListener("click", handleClickOutside);
        };
      }, []);
    
      const styles = {
        userMenu: {
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          position: isMobile ? "static" : "absolute",
          top: isMobile ? "auto" : "10px",
          right: isMobile ? "auto" : "10px",
          margin: isMobile ? "1rem auto" : 0,
          background: "#f9f9f9",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        },
        userAvatar: {
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          marginRight: "10px",
          background: "#e0e0e0",
        },
        userEmail: {
          fontSize: "1rem",
          fontWeight: "bold",
          color: "#333",
          marginRight: "6px",
          lineHeight: "1.2",
        },
        dropdownIcon: {
          cursor: "pointer",
        },
        arrowDownIcon: {
          width: "20px",
          height: "20px",
        },
        dropdownMenu: {
          position: "absolute",
          top: "50px",
          right: "10px",
          background: "#fff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "0.5rem",
          zIndex: 1000,
        },
        logoutButton: {
          background: "none",
          border: "none",
          color: "#333",
          fontSize: "1rem",
          fontWeight: "bold",
          cursor: "pointer",
          padding: "0.5rem 1rem",
          textAlign: "left",
          width: "100%",
          borderRadius: "4px",
          transition: "background 0.3s",
        },
       
      };
      return (
      <div className="user-menu" style={styles.userMenu}>
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
  onClick={() => {
    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    fetch("http://localhost/SFE-Project/backend/public/api/logout", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(() => {
        window.location.href = "/login";
      })
      .catch(() => alert("Erreur de déconnexion"));
  }}
>
  Log Out
</button>
          </div>
        )}
      </div>
      );
}
