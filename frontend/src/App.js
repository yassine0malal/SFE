// // src/App.js
// import React, { useState } from 'react';
// import { ReactComponent as TrashIcon } from './assets/icons/trash.svg';
// import researchIcon from './assets/icons/research.png';
// import colors from './constants/colors';
// import AdminNavbar from './components/layout/AdminLayout';

// // Mock JSON des contacts
// const mockContacts = [
//   {
//     id: 1,
//     fullName: 'Yassine Malal',
//     email: 'yassinemalal@gmail.com',
//     phone: '+212 655146069',
//     subject: "Leur structure est définie par un plan de numérotation propre à"
//   },
//   {
//     id: 2,
//     fullName: 'Yassine Abouho',
//     email: 'yassineabouho@gmail.com',
//     phone: '+212 655146069',
//     subject: "Leur structure est définie par un plan de numérotation propre à"
//   },
//   {
//     id: 3,
//     fullName: 'Hamza Folan',
//     email: 'hamzafolan@gmail.com',
//     phone: '+212 655146069',
//     subject: "Leur structure est définie par un plan de numérotation propre à"
//   },
//   // … ajoutez autant d’objets que nécessaire
// ];

// export default function App() {
//   const [contacts, setContacts] = useState(mockContacts);
//   const [filter, setFilter]     = useState('');

//   const handleDelete = id => {
//     setContacts(cs => cs.filter(c => c.id !== id));
//   };

//   const filtered = contacts.filter(c =>
//     c.fullName.toLowerCase().includes(filter.toLowerCase())
//   );

//   return (
//     <div style={styles.layout}>
//       <AdminNavbar />
//       <main style={styles.main}>
//         <div style={styles.header}>
//           {/* Wrapper positionné pour l’input + icône */}
//           <div style={styles.searchWrapper}>
//             <input
//               type="text"
//               placeholder="Chercher par le nom"
//               value={filter}
//               onChange={e => setFilter(e.target.value)}
//               style={styles.searchInput}
//             />
//             <img
//               src={researchIcon}
//               alt="Recherche"
//               style={styles.searchIcon}
//             />
//           </div>
//           <div style={styles.userMenu}>
//             <span>admin1@gmail.com</span>
//             <span style={{ marginLeft: 6, fontSize: 12 }}>▾</span>
//           </div>
//         </div>
//         <ContactsList contacts={filtered} onDelete={handleDelete} />
//       </main>
//     </div>
//   );
// }



// function ContactsList({ contacts, onDelete }) {
//   if (!contacts.length) return <p>Aucun contact trouvé.</p>;
//   return (
//     <table style={styles.table}>
//       <thead>
//         <tr>
//           {['Nom complet','E‑mail','N° Téléphone','Sujet','Action'].map((h, i) => (
//             <th key={i} style={styles.thtd}>{h}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {contacts.map(c => (
//           <tr key={c.id} style={styles.row}>
//             <td style={styles.thtd}>{c.fullName}</td>
//             <td style={styles.thtd}>{c.email}</td>
//             <td style={styles.thtd}>{c.phone}</td>
//             <td style={styles.thtd}>{c.subject}</td>
//             <td style={styles.thtd}>
//               <button style={styles.deleteBtn} onClick={() => onDelete(c.id)}>
//                 <TrashIcon width={30} height={30} />
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }

// const styles = {
  
//   searchWrapper: {
//     position: 'relative',
//     flex: 1,
//     maxWidth: 300
//   },
//   searchInput: {
//     background: colors.tableRowHover,
//     width: '100%',
//     padding: '1rem 1rem 1rem 3.6rem',
//     border: `1px solid ${colors.inputBorder}`,
//     borderRadius: 15,
//     boxSizing: 'border-box'
//   },
//   searchIcon: {
//     position: 'absolute',
//     left: 8,
//     top: '50%',
//     transform: 'translateY(-50%)',
//     width: 30,
//     height: 30,
//     pointerEvents: 'none'
//   },

//   userMenu: { fontWeight: 'bold' },

//   table: {
//     width: '100%',
//     borderCollapse: 'separate',    // Permet d'utiliser borderSpacing
//     borderSpacing: '0 10px',       // Espace vertical de 10px entre les lignes
//     background: '#fff'
//   },

//   thtd: {
//     padding: '1rem',
//     background: '#f9f9f9',
//     borderRadius: '4px',           // Arrondit les coins de CHAQUE cellule
//     textAlign: 'left'
//   },

//   row: {
//     borderRadius: '12px',           // Rayon des coins de la ligne
//     background: '#ffffff',         // Fond blanc pour que le row se détache du fond gris
//     boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Ombre légère
//     overflow: 'hidden'             // Pour appliquer correctement le borderRadius
//   },

//   deleteBtn: {
//     background: 'none',
//     border: 'none',
//     padding: 0,
//     cursor: 'pointer'
//   }
// };



import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AdminNavbar from './components/admin/AdminNavbar';
import Accueil from './pages/admin/AccueilPage';
import Commentaires from './pages/admin/CommentairePage';
import Publications from './pages/admin/PublicationsPage';
import Services from './pages/admin/ServicesPage';
import Abonnes from './pages/admin/AbonnesPage';
import Contact from './pages/admin/ContactsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Accueil />
        </div>
      </div>
    ),
  },
  {
    path: '/commentaires',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Commentaires />
        </div>
      </div>
    ),
  },
  {
    path: '/publications',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Publications />
        </div>
      </div>
    ),
  },
  {
    path: '/services',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Services />
        </div>
      </div>
    ),
  },
  {
    path: '/abonnes',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Abonnes />
        </div>
      </div>
    ),
  },
  {
    path: '/contact',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Contact />
        </div>
      </div>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}