import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { ThemeProvider } from './components/context/ThemeContext'; // <-- Add this import

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

// Páginas de autenticação — sem Navbar nem Footer
import Login    from './pages/Login';
import Register from './pages/Sigin';

/* Rotas que NÃO devem exibir Navbar/Footer */
const AUTH_ROUTES = ['/login', '/register'];

function AppLayout() {
  const isAuth = AUTH_ROUTES.includes(window.location.pathname);

  return (
    <div className="app">
      {!isAuth && <Navbar />}

      <main className="main-content">
        <Routes>
          {/* ── Públicas ── */}
          <Route path="/"           element={<HomePage />} />
          <Route path="/filmes"     element={<Filmes />} />
          <Route path="/playlists"  element={<Playlists />} />
          <Route path="/localizacao" element={<Location />} />
          <Route path="/local"      element={<Location />} />
          <Route path="/materiais"  element={<Materiais />} />
          <Route path="/eventos"    element={<Eventos />} />
          <Route path="/fotos"      element={<Fotos />} />
          <Route path="/sessions"   element={<Sessions />} />
          <Route path="/contact"    element={<Contact />} />
          <Route path="/about"      element={<About />} />
          <Route path="/podcasts"   element={<Podcasts />} />
          <Route path="/members"    element={<Members />} />

          {/* ── Autenticação ── */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ── 404 ── */}
          <Route path="*" element={
            <div style={{ padding: '2rem' }}>
              <h2>Página não encontrada: {window.location.pathname}</h2>
            </div>
          } />
        </Routes>
      </main>

      {!isAuth && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>  {/* <-- Add ThemeProvider here */}
      <Router>
        <AppLayout />
      </Router>
    </ThemeProvider>
  );
}