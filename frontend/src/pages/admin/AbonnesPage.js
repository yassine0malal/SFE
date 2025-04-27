// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import HeaderPart from "../../components/admin/header";

// // const API_URL = "http://localhost/SFE-Project/backend/public/api/abonnees";

// // export default function AbonnesPage() {
// //   const [emailList, setEmailList] = useState([]);
// //   const [phoneList, setPhoneList] = useState([]);
// //   const [selectedEmails, setSelectedEmails] = useState([]);
// //   const [selectedPhones, setSelectedPhones] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetch(API_URL, { credentials: "include" })
// //       .then(res => res.json())
// //       .then(data => {
// //         if (data && Array.isArray(data.emails) && Array.isArray(data.phones)) {
// //           setEmailList(data.emails);
// //           setPhoneList(data.phones);
// //         } else {
// //           setError("Erreur lors du chargement des abonnés");
// //         }
// //       })
// //       .catch(() => setError("Erreur lors du chargement des abonnés"))
// //       .finally(() => setLoading(false));
// //   }, []);

// //   // Sélectionner/désélectionner tous les emails
// //   const toggleAllEmails = () => {
// //     if (selectedEmails.length === emailList.length) {
// //       setSelectedEmails([]);
// //     } else {
// //       setSelectedEmails(emailList.map((_, i) => i));
// //     }
// //   };
// //   // Sélectionner/désélectionner tous les téléphones
// //   const toggleAllPhones = () => {
// //     if (selectedPhones.length === phoneList.length) {
// //       setSelectedPhones([]);
// //     } else {
// //       setSelectedPhones(phoneList.map((_, i) => i));
// //     }
// //   };

// //   // Sélection individuelle email
// //   const toggleEmail = (idx) => {
// //     setSelectedEmails((prev) =>
// //       prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
// //     );
// //   };
// //   // Sélection individuelle téléphone
// //   const togglePhone = (idx) => {
// //     setSelectedPhones((prev) =>
// //       prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
// //     );
// //   };

// //   // Sauvegarder et rediriger
// //   const handleSend = () => {
// //     const emails = selectedEmails.map(i => emailList[i]);
// //     const phones = selectedPhones.map(i => phoneList[i]);
// //     localStorage.setItem("selectedemail_telephone", JSON.stringify(emails));
// //     localStorage.setItem("selectedPhones", JSON.stringify(phones));
// //     if (emails.length > 0 || phones.length > 0)
// // // Remplace navigate("/abonees/envoyer-message"); par :
// //     navigate("/abonees/envoyer-message", {
// //       state: {
// //         emails,
// //         phones
// //       }
// //     });  };

// //   return (
// //     <div style={{ flex: 1, background: "#fff", minHeight: "100vh", position: "relative" }}>
// //       <HeaderPart />
// //       <div style={{ height: "60px" }}> </div>
// //       <div style={{ maxWidth: 800, margin: "40px auto 0 auto" }}>
// //         {loading && <div>Chargement...</div>}
// //         {error && <div style={{ color: "red" }}>{error}</div>}

// //         {/* Emails */}
// //         {emailList.length > 0 && (
// //           <>
// //             <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
// //               <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
// //                 <button
// //                   onClick={toggleAllEmails}
// //                   style={{
// //                     marginRight: 12,
// //                     width: 22,
// //                     height: 22,
// //                     borderRadius: "50%",
// //                     border: "2px solid #fff",
// //                     background: "none",
// //                     cursor: "pointer",
// //                     outline: "none",
// //                     display: "inline-flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                   }}
// //                   aria-label="Tout sélectionner email"
// //                 >
// //                   {selectedEmails.length === emailList.length && emailList.length > 0 ? (
// //                     <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
// //                   ) : null}
// //                 </button>
// //                 E-mail
// //               </div>
// //             </div>
// //             {emailList.map((email, idx) => (
// //               <div
// //                 key={idx}
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
// //                   borderRadius: 10,
// //                   marginBottom: 10,
// //                   minHeight: 48,
// //                 }}
// //               >
// //                 <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
// //                   <button
// //                     onClick={() => toggleEmail(idx)}
// //                     style={{
// //                       marginRight: 12,
// //                       width: 22,
// //                       height: 22,
// //                       borderRadius: "50%",
// //                       border: "2px solid #222",
// //                       background: selectedEmails.includes(idx) ? "#fff" : "none",
// //                       cursor: "pointer",
// //                       outline: "none",
// //                       display: "inline-flex",
// //                       alignItems: "center",
// //                       justifyContent: "center",
// //                     }}
// //                     aria-label="Sélectionner email"
// //                   >
// //                     {selectedEmails.includes(idx) ? (
// //                       <span style={{ fontWeight: "bold", color: "#222" }}>✔</span>
// //                     ) : null}
// //                   </button>
// //                   <span style={{ fontSize: 16 }}>{email}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </>
// //         )}

// //         {/* Phones */}
// //         {phoneList.length > 0 && (
// //           <>
// //             <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10, marginTop: 30 }}>
// //               <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
// //                 <button
// //                   onClick={toggleAllPhones}
// //                   style={{
// //                     marginRight: 12,
// //                     width: 22,
// //                     height: 22,
// //                     borderRadius: "50%",
// //                     border: "2px solid #fff",
// //                     background: "none",
// //                     cursor: "pointer",
// //                     outline: "none",
// //                     display: "inline-flex",
// //                     alignItems: "center",
// //                     justifyContent: "center",
// //                   }}
// //                   aria-label="Tout sélectionner téléphone"
// //                 >
// //                   {selectedPhones.length === phoneList.length && phoneList.length > 0 ? (
// //                     <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
// //                   ) : null}
// //                 </button>
// //                 N° Telephone
// //               </div>
// //             </div>
// //             {phoneList.map((phone, idx) => (
// //               <div
// //                 key={idx}
// //                 style={{
// //                   display: "flex",
// //                   alignItems: "center",
// //                   background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
// //                   borderRadius: 10,
// //                   marginBottom: 10,
// //                   minHeight: 48,
// //                 }}
// //               >
// //                 <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
// //                   <button
// //                     onClick={() => togglePhone(idx)}
// //                     style={{
// //                       marginRight: 12,
// //                       width: 22,
// //                       height: 22,
// //                       borderRadius: "50%",
// //                       border: "2px solid #222",
// //                       background: selectedPhones.includes(idx) ? "#fff" : "none",
// //                       cursor: "pointer",
// //                       outline: "none",
// //                       display: "inline-flex",
// //                       alignItems: "center",
// //                       justifyContent: "center",
// //                     }}
// //                     aria-label="Sélectionner téléphone"
// //                   >
// //                     {selectedPhones.includes(idx) ? (
// //                       <span style={{ fontWeight: "bold", color: "#222" }}>✔</span>
// //                     ) : null}
// //                   </button>
// //                   <span style={{ fontSize: 16 }}>{phone}</span>
// //                 </div>
// //               </div>
// //             ))}
// //           </>
// //         )}

// //         {/* Bouton Envoyer */}
// //         <button
// //           style={{
// //             display: "block",
// //             width: 400,
// //             maxWidth: "100%",
// //             margin: "40px auto 0 auto",
// //             background: "#FF5C78",
// //             color: "#fff",
// //             fontWeight: "bold",
// //             fontSize: "2rem",
// //             border: "none",
// //             borderRadius: 12,
// //             padding: "1.2rem",
// //             letterSpacing: 2,
// //             cursor: "pointer",
// //           }}
// //           onClick={handleSend}
// //         >
// //           Envoyer
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }






// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import HeaderPart from "../../components/admin/header";

// const API_URL = "http://localhost/SFE-Project/backend/public/api/abonnees";

// export default function AbonnesPage() {
//   const [emailList, setEmailList] = useState([]);
//   const [phoneList, setPhoneList] = useState([]);
//   const [selectedEmails, setSelectedEmails] = useState([]);
//   const [selectedPhones, setSelectedPhones] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(API_URL, { credentials: "include" })
//       .then(res => res.json())
//       .then(data => {
//         if (data && Array.isArray(data.emails) && Array.isArray(data.phones)) {
//           setEmailList(data.emails);
//           setPhoneList(data.phones);
//         } else {
//           setError("Erreur lors du chargement des abonnés");
//         }
//       })
//       .catch(() => setError("Erreur lors du chargement des abonnés"))
//       .finally(() => setLoading(false));
//   }, []);

//   // Sélectionner/désélectionner tous les emails
//   const toggleAllEmails = () => {
//     if (selectedEmails.length === emailList.length) {
//       setSelectedEmails([]);
//     } else {
//       setSelectedEmails(emailList.map((_, i) => i));
//     }
//   };
//   // Sélectionner/désélectionner tous les téléphones
//   const toggleAllPhones = () => {
//     if (selectedPhones.length === phoneList.length) {
//       setSelectedPhones([]);
//     } else {
//       setSelectedPhones(phoneList.map((_, i) => i));
//     }
//   };

//   // Sélection individuelle email
//   const toggleEmail = (idx) => {
//     setSelectedEmails((prev) =>
//       prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
//     );
//   };
//   // Sélection individuelle téléphone
//   const togglePhone = (idx) => {
//     setSelectedPhones((prev) =>
//       prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
//     );
//   };

//   // Envoi via backend
//   const handleSend = async (type) => {
//     const emails = selectedEmails.map(i => emailList[i]);
//     const phones = selectedPhones.map(i => phoneList[i]);
//     const payload = {
//       emails,
//       phones,
//       message,
//       type // "email" ou "whatsapp"
//     };
//     try {
//       const res = await fetch("http://localhost/SFE-Project/backend/public/api/send_message", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify(payload)
//       });
//       const data = await res.json();
//       if (data.success) {
//         alert("Message envoyé !");
//       } else {
//         alert("Erreur : " + (data.error || "Envoi échoué"));
//       }
//     } catch (e) {
//       alert("Erreur réseau");
//     }
//   };

//   return (
//     <div style={{ flex: 1, background: "#fff", minHeight: "100vh", position: "relative" }}>
//       <HeaderPart />
//       <div style={{ height: "60px" }}> </div>
//       <div style={{ maxWidth: 800, margin: "40px auto 0 auto" }}>
//         {loading && <div>Chargement...</div>}
//         {error && <div style={{ color: "red" }}>{error}</div>}

//         {/* Emails */}
//         {emailList.length > 0 && (
//           <>
//             <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
//               <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
//                 <button
//                   onClick={toggleAllEmails}
//                   style={{
//                     marginRight: 12,
//                     width: 22,
//                     height: 22,
//                     borderRadius: "50%",
//                     border: "2px solid #fff",
//                     background: "none",
//                     cursor: "pointer",
//                     outline: "none",
//                     display: "inline-flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                   aria-label="Tout sélectionner email"
//                 >
//                   {selectedEmails.length === emailList.length && emailList.length > 0 ? (
//                     <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
//                   ) : null}
//                 </button>
//                 E-mail
//               </div>
//             </div>
//             {emailList.map((email, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
//                   borderRadius: 10,
//                   marginBottom: 10,
//                   minHeight: 48,
//                 }}
//               >
//                 <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
//                   <button
//                     onClick={() => toggleEmail(idx)}
//                     style={{
//                       marginRight: 12,
//                       width: 22,
//                       height: 22,
//                       borderRadius: "50%",
//                       border: "2px solid #222",
//                       background: selectedEmails.includes(idx) ? "#fff" : "none",
//                       cursor: "pointer",
//                       outline: "none",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                     aria-label="Sélectionner email"
//                   >
//                     {selectedEmails.includes(idx) ? (
//                       <span style={{ fontWeight: "bold", color: "#222" }}>✔</span>
//                     ) : null}
//                   </button>
//                   <span style={{ fontSize: 16 }}>{email}</span>
//                 </div>
//               </div>
//             ))}
//           </>
//         )}

//         {/* Phones */}
//         {phoneList.length > 0 && (
//           <>
//             <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", marginBottom: 10, marginTop: 30 }}>
//               <div style={{ flex: 1, background: "#FF5C78", color: "#fff", fontWeight: "bold", fontSize: 18, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
//                 <button
//                   onClick={toggleAllPhones}
//                   style={{
//                     marginRight: 12,
//                     width: 22,
//                     height: 22,
//                     borderRadius: "50%",
//                     border: "2px solid #fff",
//                     background: "none",
//                     cursor: "pointer",
//                     outline: "none",
//                     display: "inline-flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                   aria-label="Tout sélectionner téléphone"
//                 >
//                   {selectedPhones.length === phoneList.length && phoneList.length > 0 ? (
//                     <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
//                   ) : null}
//                 </button>
//                 N° Telephone
//               </div>
//             </div>
//             {phoneList.map((phone, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   alignItems: "center",
//                   background: idx % 2 === 0 ? "#f7f7f7" : "#ededed",
//                   borderRadius: 10,
//                   marginBottom: 10,
//                   minHeight: 48,
//                 }}
//               >
//                 <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "10px 0 10px 30px" }}>
//                   <button
//                     onClick={() => togglePhone(idx)}
//                     style={{
//                       marginRight: 12,
//                       width: 22,
//                       height: 22,
//                       borderRadius: "50%",
//                       border: "2px solid #222",
//                       background: selectedPhones.includes(idx) ? "#fff" : "none",
//                       cursor: "pointer",
//                       outline: "none",
//                       display: "inline-flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                     aria-label="Sélectionner téléphone"
//                   >
//                     {selectedPhones.includes(idx) ? (
//                       <span style={{ fontWeight: "bold", color: "#222" }}>✔</span>
//                     ) : null}
//                   </button>
//                   <span style={{ fontSize: 16 }}>{phone}</span>
//                 </div>
//               </div>
//             ))}
//           </>
//         )}

//         {/* Message personnalisé */}
//         <div style={{ marginTop: 30 }}>
//           <h3>Message personnalisé :</h3>
//           <textarea
//             value={message}
//             onChange={e => setMessage(e.target.value)}
//             style={{
//               width: "100%",
//               minHeight: 100,
//               borderRadius: 8,
//               border: "1px solid #ccc",
//               padding: 12,
//               fontSize: 16,
//               marginBottom: 20
//             }}
//             placeholder="Votre message ici..."
//           />
//         </div>

//         {/* Boutons d'envoi */}
//         <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
//           <button
//             style={{
//               background: "#25D366",
//               color: "#fff",
//               fontWeight: "bold",
//               fontSize: "1.1rem",
//               border: "none",
//               borderRadius: 8,
//               padding: "1rem 2rem",
//               cursor: "pointer",
//               flex: 1,
//             }}
//             onClick={() => handleSend("whatsapp")}
//             disabled={selectedPhones.length === 0}
//           >
//             Envoyer sur WhatsApp
//           </button>
//           <button
//             style={{
//               background: "#0072c6",
//               color: "#fff",
//               fontWeight: "bold",
//               fontSize: "1.1rem",
//               border: "none",
//               borderRadius: 8,
//               padding: "1rem 2rem",
//               cursor: "pointer",
//               flex: 1,
//             }}
//             onClick={() => handleSend("email")}
//             disabled={selectedEmails.length === 0}
//           >
//             Envoyer par Email
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }









import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import HeaderPart from "../../components/admin/header";
import MDEditor from "@uiw/react-md-editor";

const API_URL = "http://localhost/SFE-Project/backend/public/api/abonnees";

export default function AbonnesPage() {
  const [emailList, setEmailList] = useState([]);
  const [phoneList, setPhoneList] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedPhones, setSelectedPhones] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_URL, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.emails) && Array.isArray(data.phones)) {
          setEmailList(data.emails);
          setPhoneList(data.phones);
        } else {
          setError("Erreur lors du chargement des abonnés");
        }
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

  // Handle image upload for MD Editor
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMessage(msg => (msg || "") + `\n\n![](${ev.target.result})\n`);
    };
    reader.readAsDataURL(file);
  };

  // Envoi via backend
  const handleSend = async (type) => {
    const emails = selectedEmails.map(i => emailList[i]);
    const phones = selectedPhones.map(i => phoneList[i]);
    const payload = {
      emails,
      phones,
      message,
      type // "email" ou "whatsapp"
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
      <div style={{ height: "60px" }}> </div>
      <div style={{ maxWidth: 800, margin: "40px auto 0 auto" }}>
        {loading && <div>Chargement...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {/* Emails */}
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
        {/* Phones */}
        {phoneList.length > 0 && (
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
                  {selectedPhones.length === phoneList.length && phoneList.length > 0 ? (
                    <span style={{ fontWeight: "bold", color: "#fff" }}>✔</span>
                  ) : null}
                </button>
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
        
        {/* Message personnalisé avec MDEditor */}
        <div style={{ marginTop: 40 }}>
          <h3>Message personnalisé :</h3>
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            style={{
              marginBottom: 12,
              padding: '0.5rem 1rem',
              borderRadius: 4,
              border: '1px solid #ccc',
              cursor: 'pointer',
              background: '#f9f9f9'
            }}
          >
            Ajouter une image
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
          <MDEditor value={message} onChange={setMessage} height={400} />
        </div>
        
        {/* Boutons d'envoi */}
        <div style={{ display: "flex", gap: 16, marginTop: 30 }}>
          <button
            style={{
              background: "#25D366",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "none",
              borderRadius: 8,
              padding: "1rem 2rem",
              cursor: "pointer",
              flex: 1,
            }}
            onClick={() => handleSend("whatsapp")}
            disabled={selectedPhones.length === 0}
          >
            Envoyer sur WhatsApp
          </button>
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
            disabled={selectedEmails.length === 0}
          >
            Envoyer par Email
          </button>
        </div>
      </div>
    </div>
  );
}
