import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import AdminNavbar from './components/admin/AdminNavbar';
import Accueil from './pages/admin/AccueilPage';
import Commentaires from './pages/admin/CommentairePage';
import Publications from './pages/admin/PublicationsPage';
import Services from './pages/admin/ServicesPage';
import Abonnes from './pages/admin/AbonnesPage';
import Contact from './pages/admin/ContactsPage';
import ServiceFormPage from './pages/admin/ServiceFormPage';
import PublicationsForm from './pages/admin/PublicationFormPage';
import SendMessagePage from "./pages/admin/SendMessage";
import Login from './pages/admin/Login';
import ServiceEditPage from './pages/admin/ServiceAjouterPage';
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
    path: '/login',
    element: (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '1rem' }}>
          <Login />
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
    path: '/services/editer/:id',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <ServiceFormPage />
        </div>
      </div>
    ),
  },
  {
    path: '/services/ajouter',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <ServiceEditPage />
        </div>
      </div>
    ),
  },
  {
    path: '/publications/editer/:id',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <PublicationsForm />
        </div>
      </div>
    ),
  },
  {
    path: '/abonees/envoyer-message',
    element: (
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <SendMessagePage />
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