import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import { BarraNav } from './components/templates/BarraNav';
import Footer from './components/templates/Footer';
import ActorTable from './components/Actor/ActorTable';
import HomePage from './components/pages/HomePage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <BarraNav />
        
        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={<HomePage />} 
            />
            <Route 
              path="/actors" 
              element={<ActorTable />} 
            />
            {/* Agrega más rutas aquí */}
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;