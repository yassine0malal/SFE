// import React, { useState, useEffect } from "react";

// export default function Accueil() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev); // Toggle dropdown visibility
//   };

//   const closeDropdown = () => {
//     setIsDropdownOpen(false); // Close the dropdown
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       // Close the dropdown if the click is outside the dropdown menu
//       if (!event.target.closest(".user-menu")) {
//         closeDropdown();
//       }
//     };

//     document.addEventListener("click", handleClickOutside);

//     return () => {
//       document.removeEventListener("click", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div style={styles.container}>
//       {/* User Menu at the Top */}
//       <div className="user-menu" style={styles.userMenu}>
//         <img
//           src="/images/image.png" // Replace with the correct path to the user avatar
//           alt="User Avatar"
//           style={styles.userAvatar}
//         />
//         <span style={styles.userEmail}>admin1@gmail.com</span>
//         <span
//           style={styles.dropdownIcon}
//           onClick={toggleDropdown} // Toggle dropdown on click
//         >
//           <img
//             src="/icons/arrow-down.png" // Replace with the correct path to the arrow icon
//             alt="arrow down"
//             style={styles.arrowDownIcon}
//           />
//         </span>
//         {isDropdownOpen && (
//           <div style={styles.dropdownMenu}>
//             <button
//               style={styles.logoutButton}
//               onClick={() => alert("Logged Out!")}
//             >
//               Log Out
//             </button>
//           </div>
//         )}
//       </div>
//       <div style={{ height: "50px" }}></div>


//       {/* Stats Cards at the Top */}
//       <div style={styles.statsContainer}>
//   <div style={styles.card}>
//     <h2 style={styles.cardNumber}>34</h2>
//     <div style={styles.cardLabelContainer}>
//       <img
//         src="/icons/line-ascendant-graphic-of-zigzag-arrow.png" // Replace with the correct path to the icon
//         alt="Abonnés Icon"
//         style={styles.iconCard}
//       />
//       <p style={styles.cardLabel}>Total Abonnés</p>
//     </div>
//   </div>
//   <div style={styles.card}>
//     <h2 style={styles.cardNumber}>50+</h2>
//     <div style={styles.cardLabelContainer}>
//       <img
//         src="/icons/analytics.png" // Replace with the correct path to the icon
//         alt="Projects Icon"
//         style={styles.iconCard}
//       />
//       <p style={styles.cardLabel}>Total Projets</p>
//     </div>
//   </div>
//   <div style={styles.card}>
//     <h2 style={styles.cardNumber}>230+</h2>
//     <div style={styles.cardLabelContainer}>
//       <img
//         src="/icons/demand.png" // Replace with the correct path to the icon
//         alt="Demandes Icon"
//         style={styles.iconCard}
//       />
//       <p style={styles.cardLabel}>Total Demandes</p>
//     </div>
//   </div>
// </div>

//       {/* Greeting and Image on the Same Line */}
//       <div style={styles.header}>
//         <div style={styles.greetingSection}>
//           <h1 style={styles.greeting}><span style={styles.Bonjour}>Bonjour</span> admin1</h1>
//           <p style={styles.subGreeting}>
//           Bienvenue dans votre espace d’administration
//           </p>
//         </div>
//         <div style={styles.imageContainer}>
//           <img
//             src="/images/dashboard.jpg" // Replace with the correct path to your image
//             alt="Dashboard Illustration"
//             style={styles.image}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     padding: "2rem",
//     fontFamily: "Arial, sans-serif",
//   },
//   userMenu: {
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "flex-end",
//     position: "absolute", // Position the menu at the top-right
//     top: "10px", // Distance from the top
//     right: "10px", // Distance from the right
//     background: "#f9f9f9",
//     padding: "0.5rem 1rem",
//     borderRadius: "8px",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//     zIndex: 1000, // Ensure it appears above other elements
//   },
//   userAvatar: {
//     width: "40px",
//     height: "40px",
//     borderRadius: "50%",
//     marginRight: "10px",
//     background: "#e0e0e0",
//   },
//   Bonjour : {
//     color: "#333",
//   },
//   userEmail: {
//     fontSize: "1rem",
//     fontWeight: "bold",
//     color: "#333",
//     marginRight: "6px",
//     lineHeight: "1.2",
//     padding: "0",
//   },
//   dropdownIcon: {
//     fontSize: "1rem",
//     color: "#333",
//     cursor: "pointer",
//   },
//   arrowDownIcon: {
//     width: "20px",
//     height: "20px",
//   },
//   dropdownMenu: {
//     position: "absolute",
//     top: "50px",
//     right: "10px",
//     background: "#fff",
//     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//     borderRadius: "8px",
//     padding: "0.5rem",
//     zIndex: 1000,
//   },
//   logoutButton: {
//     background: "none",
//     border: "none",
//     color: "#333",
//     fontSize: "1rem",
//     fontWeight: "bold",
//     cursor: "pointer",
//     padding: "0.5rem 1rem",
//     textAlign: "left",
//     width: "100%",
//     borderRadius: "4px",
//     transition: "background 0.3s",
//   },
//   statsContainer: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "2rem",
//   },
//   card: {
//     background: "#D9D9D9",
//     borderRadius: "8px",
//     paddingTop: "20px",
//     textAlign: "center",
//     flex: 1,
//     maxWidth: "400px",
//     height: "200px",
//     // margin: "0 0rem",
//   },
//   cardNumber: {
//     paddingTop: "30px",
//     fontSize: "4.2rem",
//     fontWeight: "bold",
//     color: "#ff5e5e",
//     margin: 0,
//   },
//   cardLabel: {
//     padding:"0px",
//     fontSize: "2rem",
//     fontWeight: "bold",
//     color: "#000",
//     marginBottom: 30,
//   },
//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: "2rem",
//   },
//   greetingSection: {
//     flex: 1,
//     marginRight: "2rem",
//   },
//   greeting: {
//     fontSize: "3rem",
//     color: "#ff5e5e",
//     marginBottom: 100,
//   },
//   subGreeting: {
//     fontSize: "4rem",
//     fontWeight:"bold",
//     // fontFamily: 'Menlo, Monaco, "Courier New", monospace',
//     color: "#333",
//     margin: 0,
//   },
//   imageContainer: {
//     flex: 2,
//     textAlign: "right",
//   },
//   image: {
//     maxWidth: "100%",
//     height: "auto",

//   },
//   cardLabelContainer: {
//     display: "flex", // Align icon and label horizontally
//     alignItems: "center", // Vertically center the content
//     justifyContent: "center", // Center the content horizontally
//     marginTop: "0.9rem", // Add spacing between the number and the label
//   },
// iconCard: {
//   width: "35px", // Adjust the size of the icon
//   height: "35px",
//   marginRight: "1rem", // Add spacing between the icon and the label
// },
// };






import HeaderPart from '../../components/admin/header';
import React, { useState, useEffect } from "react";

export default function Accueil() {
  // Dropdown
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const toggleDropdown = () => setIsDropdownOpen(prev => !prev);
  // const closeDropdown = () => setIsDropdownOpen(false);

  // // Responsive
  const [width, setWidth] = useState(window.innerWidth);
  const isMobile = width <= 768;
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    const handleClickOutside = event => {
      // if (!event.target.closest(".user-menu")) closeDropdown();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Styles dynamiques
  const container = {
    padding: "2rem",
    fontFamily: "Arial, sans-serif",
    position: "relative",
    maxWidth: 1200,
    margin: "0 auto",
  };

  const statsContainer = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "1rem":"3rem",
    marginBottom: "2rem",
  };

  const header = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    alignItems: "center",
    textAlign: isMobile ? "center" : "left",
    marginTop: "2rem",
  };

  const greetingSection = {
    flex: 1,
    marginRight: isMobile ? 0 : "2rem",
  };

  const imageContainer = {
    flex: 2,
    textAlign: isMobile ? "center" : "right",
  };

  // Styles fixes
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
    card: {
      background: "#D9D9D9",
      borderRadius: "8px",
      padding: "1rem",
      textAlign: "center",
      flex: 1,
      minWidth: "200px",
      height: "200px",
    },
    cardNumber: {
      fontSize: "4.2rem",
      fontWeight: "bold",
      color: "#ff5e5e",
      margin: 0,
    },
    cardLabelContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "0.9rem",
    },
    iconCard: {
      width: "35px",
      height: "35px",
      marginRight: "1rem",
    },
    cardLabel: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#000",
      margin: 0,
    },
    greeting: {
      fontSize: "3rem",
      color: "#ff5e5e",
      margin: isMobile ? "0.5rem 0" : "0 0 1rem 0",
      marginBottom: isMobile ? "40" : "100px",
    },
    subGreeting: {
      fontSize: isMobile ? "1.5rem" : "2rem",
      fontWeight: "bold",
      color: "#333",
      margin: 0,
    },
    image: {
      maxWidth: "100%",
      height: "auto",
    },
  };

  return (
    <div style={container}>
      {/* User Menu */}
      <HeaderPart/>

      {/* Espacement */}
      <div style={{ height: "50px" }}></div>

      {/* Stats Cards */}
      <div style={statsContainer}>
        <div style={styles.card}>
          <h2 style={styles.cardNumber}>34</h2>
          <div style={styles.cardLabelContainer}>
            <img
              src="/icons/line-ascendant-graphic-of-zigzag-arrow.png"
              alt="Abonnés Icon"
              style={styles.iconCard}
            />
            <p style={styles.cardLabel}>Total Abonnés</p>
          </div>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardNumber}>50+</h2>
          <div style={styles.cardLabelContainer}>
            <img
              src="/icons/analytics.png"
              alt="Projects Icon"
              style={styles.iconCard}
            />
            <p style={styles.cardLabel}>Total Projets</p>
          </div>
        </div>
        <div style={styles.card}>
          <h2 style={styles.cardNumber}>230+</h2>
          <div style={styles.cardLabelContainer}>
            <img
              src="/icons/demand.png"
              alt="Demandes Icon"
              style={styles.iconCard}
            />
            <p style={styles.cardLabel}>Total Demandes</p>
          </div>
        </div>
      </div>

      {/* Greeting & Illustration */}
      <div style={header}>
        <div style={greetingSection}>
          <h1 style={styles.greeting}>
            <span style={{ color: "#333" }}>Bonjour</span> admin1
          </h1>
          <p style={styles.subGreeting}>
            Bienvenue dans votre espace d’administration
          </p>
        </div>
        <div style={imageContainer}>
          <img
            src="/images/dashboard.jpg"
            alt="Dashboard Illustration"
            style={styles.image}
          />
        </div>
      </div>
    </div>
  );
}
