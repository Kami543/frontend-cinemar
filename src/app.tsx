// frontend/src/App.tsx
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './components/context/ThemeContext';
import { wakeUpBackend } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import HomePage  from './pages/Home';
import Filmes    from './pages/Filmes';
import Materiais from './pages/Materiais';
import Playlists from './pages/Playlists';
import Eventos   from './pages/Eventos';
import Fotos     from './pages/Fotos';
import Sessions  from './pages/Sessions';
import Contact   from './pages/Contact';
import About     from './pages/About';
import Podcasts  from './pages/Podcasts';
import Members   from './pages/Members';
import Location  from './pages/Location';
import TermosDeUso from './pages/TermosDeUso';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade'; // ✅ Adicionar

// Páginas de autenticação
import Login    from './pages/Login';
import Register from './pages/Sigin';

/* Rotas que NÃO devem exibir Navbar/Footer */
const AUTH_ROUTES = ['/login', '/register'];

// Componente interno que usa useLocation
function AppContent() {
  const location = useLocation();
  const { isLoading } = useAuth();
  const isAuthRoute = AUTH_ROUTES.includes(location.pathname);
  
  if (isLoading) {
    return (
      <div className="app-loading-container">
        <div className="app-loading-spinner">
          <FaSpinner className="spinner-icon" />
        </div>
        <p className="app-loading-text">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {!isAuthRoute && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/"                 element={<HomePage />} />
          <Route path="/filmes"           element={<Filmes />} />
          <Route path="/playlists"        element={<Playlists />} />
          <Route path="/localizacao"      element={<Location />} />
          <Route path="/local"            element={<Location />} />
          <Route path="/materiais"        element={<Materiais />} />
          <Route path="/eventos"          element={<Eventos />} />
          <Route path="/fotos"            element={<Fotos />} />
          <Route path="/sessions"         element={<Sessions />} />
          <Route path="/contact"          element={<Contact />} />
          <Route path="/about"            element={<About />} />
          <Route path="/podcasts"         element={<Podcasts />} />
          <Route path="/members"          element={<Members />} />
          <Route path="/login"            element={<Login />} />
          <Route path="/register"         element={<Register />} />
          <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} /> {/* ✅ Adicionado */}
          <Route path="/TermosDeUso"      element={<TermosDeUso />} />      {/* ✅ Compatibilidade */}
          <Route path="*" element={
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2>404 - Página não encontrada</h2>
              <p>A página <strong>{location.pathname}</strong> não existe.</p>
            </div>
          } />
        </Routes>
      </main>
      {!isAuthRoute && <Footer />}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    wakeUpBackend();
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}