import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

// Create a NavbarWrapper component to handle conditional rendering
const NavbarWrapper = () => {
  const location = useLocation();
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  const isLoginPage = location.pathname === '/login';

  // Don't show navbar on login page or when not logged in
  if (isLoginPage || !isLoggedIn) {
    return null;
  }

  return <AdminNavbar />;
};

export default function App() {
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  console.log("isLoggedIn from the app :", isLoggedIn);
  return (
    <BrowserRouter>
      <div style={{ display: 'flex' }}>
        <NavbarWrapper />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route exact path="/" element={ <Accueil />} />
            <Route path="/login" element={ <Login />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/services" element={isLoggedIn == false ? <Login />: <Services />} />  
              <Route path="/commentaires" element={<Commentaires />} />
              <Route path="/publications" element={<Publications />} />
              <Route path="/abonnes" element={<Abonnes />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/services/editer/:id" element={<ServiceFormPage />} />
              <Route path="/services/ajouter" element={<ServiceEditPage />} />
              <Route path="/publications/ajouter" element={<PublicationAddPage />} />
              <Route path="/publications/editer/:id" element={<PublicationsForm />} />
              <Route path="/galerie" element={<GalariePage />} />
              <Route path="/galerie/ajouter" element={<GalerieAjouterPage />} />
              <Route path="/galerie/editer/:id" element={<GalerieEditPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/ajouter" element={<ClientAjouterPage />} />
            </Route>

            <Route path="*" element={<h1>Page Not Found</h1>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}