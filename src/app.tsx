import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home';
import Filmes from './pages/Filmes';
import Materiais from './pages/Materiais';
import Playlists from './pages/Playlists';

import Footer from './components/layout/Footer';
import Eventos from './pages/Eventos';
import Fotos from './pages/Fotos';

// Importe as novas páginas que você precisará
import Sessions from './pages/Sessions';
import Contact from './pages/Contact';
import About from './pages/About';
import Podcasts from './pages/Podcasts';
import Members from './pages/Members';
import Location from './pages/Location';

export default function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/localizacao" element={<Location />} />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/fotos" element={<Fotos />} />
            
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/podcasts" element={<Podcasts />} />
            <Route path="/members" element={<Members />} />
            <Route path="/local" element={<Location />} />
            
            {/* Rota para depuração */}
            <Route path="*" element={
              <div style={{ padding: '20px' }}>
                <h2>Rota não encontrada: {window.location.pathname}</h2>
                <p>Rotas disponíveis:</p>
                <ul>
                  <li>/</li>
                  <li>/filmes</li>
                  <li>/playlists</li>
                  <li>/localizacao</li>
                  <li>/materiais</li>
                  <li>/eventos</li>
                  <li>/fotos</li>
                  <li>/sessions</li>
                  <li>/contact</li>
                  <li>/about</li>
                  <li>/podcasts</li>
                  <li>/members</li>
                  <li>/local</li>
                </ul>
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}