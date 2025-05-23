import React from 'react';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import AdminNavbar from './components/admin/AdminNavbar';
import Accueil from './pages/admin/AccueilPage';
import Commentaires from './pages/admin/CommentairePage';
import Publications from './pages/admin/PublicationsPage';
import Services from './pages/admin/ServicesPage';
import Abonnes from './pages/admin/AbonnesPage';
import Contact from './pages/admin/ContactsPage';
import ServiceFormPage from './pages/admin/ServiceEditPage';
import PublicationsForm from './pages/admin/PublicationEditPage';
// import SendMessagePage from "./pages/admin/SendMessage";
import Login from './pages/admin/Login';
import ServiceEditPage from './pages/admin/ServiceAjouterPage';
import PublicationAddPage from './pages/admin/PublicationAjouterPage';
import GalariePage from './pages/admin/GaleriePage';
import GalerieAjouterPage from './pages/admin/GalerieAjouterPage';
import GalerieEditPage from './pages/admin/GalerieEditPage';
import ClientsPage from './pages/admin/ClientPage';
import ClientAjouterPage from './pages/admin/clientsAjouterPage';
import ProtectedRoute from './components/admin/ProtectedRoute'; 
import NotFound from './components/admin/NotFound';

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex' }}>
        <AdminNavbar />
        <div style={{ flex: 1, padding: '1rem' }}>
          <Outlet />
        </div>
      </div>
    </ProtectedRoute>
  );
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />, // NOT wrapped in ProtectedRoute
  },
  {
    path: '/',
    element: <ProtectedLayout />, // ProtectedLayout uses ProtectedRoute
    children: [
      { index: true, element: <Accueil /> },
      { path: 'commentaires', element: <Commentaires /> },
      { path: 'publications', element: <Publications /> },
      { path: 'publications/ajouter', element: <PublicationAddPage /> },
      { path: 'publications/editer/:id', element: <PublicationsForm /> },
      { path: 'services', element: <Services /> },
      { path: 'services/ajouter', element: <ServiceEditPage /> },
      { path: 'services/editer/:id', element: <ServiceFormPage /> },
      { path: 'galerie', element: <GalariePage /> },
      { path: 'galerie/ajouter', element: <GalerieAjouterPage /> },
      { path: 'galerie/editer/:id', element: <GalerieEditPage /> },
      { path: 'clients', element: <ClientsPage /> },
      { path: 'clients/ajouter', element: <ClientAjouterPage /> },
      { path: 'abonnes', element: <Abonnes /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}