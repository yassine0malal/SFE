// import React, { useEffect, useState } from "react";
// import HeaderPart from "../../components/admin/header";
// import MDEditor from "@uiw/react-md-editor";

// export default function SendMessagePage() {
//   const [emails, setEmails] = useState([]);
//   const [phones, setPhones] = useState([]);
//   const [message, setMessage] = useState("");

//   useEffect(() => {
//     const storedEmails = JSON.parse(localStorage.getItem("selectedEmails") || "[]");
//     const storedPhones = JSON.parse(localStorage.getItem("selectedPhones") || "[]");
//     setEmails(storedEmails);
//     setPhones(storedPhones);
//   }, []);

//   const handleSend = () => {
//     alert("Message à envoyer :\n" + message);
//     // Ici tu peux ajouter l'envoi réel par API/email/WhatsApp
//   };

//   return (
//     <div style={{ flex: 1, background: "#fff", minHeight: "100vh" }}>
//       <HeaderPart />
//       <div style={{ maxWidth: 600, margin: "40px auto 0 auto" }}>
//         <h2 style={{ color: "#FF5C78", textAlign: "center" }}>Envoyer un message</h2>
//         <div style={{ marginTop: 30 }}>
//           <h3>Emails sélectionnés :</h3>
//           {emails.length > 0 ? (
//             <ul>
//               {emails.map((email, idx) => (
//                 <li key={idx} style={{ fontSize: 16 }}>{email}</li>
//               ))}
//             </ul>
//           ) : (
//             <div style={{ color: "#888" }}>Aucun email sélectionné.</div>
//           )}
//         </div>
//         <div style={{ marginTop: 30 }}>
//           <h3>Numéros de téléphone sélectionnés :</h3>
//           {phones.length > 0 ? (
//             <ul>
//               {phones.map((phone, idx) => (
//                 <li key={idx} style={{ fontSize: 16 }}>{phone}</li>
//               ))}
//             </ul>
//           ) : (
//             <div style={{ color: "#888" }}>Aucun numéro sélectionné.</div>
//           )}
//         </div>
//         {/* Editeur markdown */}
//         <div style={{ marginTop: 40 }}>
//           <h3>Message personnalisé :</h3>
//           <MDEditor value={message} onChange={setMessage} />
//         </div>
//         <button
//           style={{
//             marginTop: 30,
//             background: "#FF5C78",
//             color: "#fff",
//             fontWeight: "bold",
//             fontSize: "1.2rem",
//             border: "none",
//             borderRadius: 8,
//             padding: "1rem 2rem",
//             cursor: "pointer",
//             display: "block",
//             width: "100%",
//           }}
//           onClick={handleSend}
//         >
//           Envoyer
//         </button>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState, useRef } from "react";
import HeaderPart from "../../components/admin/header";
import MDEditor from "@uiw/react-md-editor";

export default function SendMessagePage() {
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedEmails = JSON.parse(localStorage.getItem("selectedEmails") || "[]");
    const storedPhones = JSON.parse(localStorage.getItem("selectedPhones") || "[]");
    setEmails(storedEmails);
    setPhones(storedPhones);
  }, []);

  // Gérer l'ajout d'image locale
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setMessage(msg => (msg || "") + `\n\n![](${ev.target.result})\n`);
    };
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    alert("Message à envoyer :\n" + message);
    // Ici tu peux ajouter l'envoi réel par API/email/WhatsApp
  };

  return (
    <div style={{ flex: 1, background: "#fff", minHeight: "100vh" }}>
      <HeaderPart />
      <div style={{ maxWidth: 600, margin: "40px auto 0 auto" }}>
        <h2 style={{ color: "#FF5C78", textAlign: "center" }}>Envoyer un message</h2>
        <div style={{ marginTop: 30 }}>
          <h3>Emails sélectionnés :</h3>
          {emails.length > 0 ? (
            <ul>
              {emails.map((email, idx) => (
                <li key={idx} style={{ fontSize: 16 }}>{email}</li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#888" }}>Aucun email sélectionné.</div>
          )}
        </div>
        <div style={{ marginTop: 30 }}>
          <h3>Numéros de téléphone sélectionnés :</h3>
          {phones.length > 0 ? (
            <ul>
              {phones.map((phone, idx) => (
                <li key={idx} style={{ fontSize: 16 }}>{phone}</li>
              ))}
            </ul>
          ) : (
            <div style={{ color: "#888" }}>Aucun numéro sélectionné.</div>
          )}
        </div>
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
          <MDEditor value={message} onChange={setMessage} height={400} width={650} />
        </div>
        <button
          style={{
            marginTop: 30,
            background: "#FF5C78",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.2rem",
            border: "none",
            borderRadius: 8,
            padding: "1rem 2rem",
            cursor: "pointer",
            display: "block",
            width: "100%",
          }}
          onClick={handleSend}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}