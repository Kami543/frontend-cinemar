import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/home';
import Filmes from './pages/Filmes';
import Materiais from './pages/Materiais';
import Playlists from './pages/Playlists';
import LocalizationPage from './pages/localization';
import Footer from './components/layout/Footer';
import Eventos from './pages/Eventos'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/filmes" element={<Filmes />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/localizacao" element={<LocalizationPage />} />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/eventos" element={<Eventos />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;