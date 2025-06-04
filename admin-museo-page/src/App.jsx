import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import { BarraNav } from './components/templates/BarraNav';
import Footer from './components/templates/Footer';
import HomePage from './components/pages/HomePage';

// Actors
import ActorTable from './components/Actor/ActorTable';
import AddActorForm from './components/Actor/AddActorForm';
import EditActorForm from './components/Actor/EditActorForm';

// Authors
import AuthorTable from './components/Author/AuthorTable';
import AddAuthorForm from './components/Author/AddAuthorForm';
import EditAuthorForm from './components/Author/EditAuthorForm';

// Histories
import HistoryTable from './components/Histories/HistoryTable';
import AddHistoryForm from './components/Histories/AddHistoryForm';
import EditHistoryForm from './components/Histories/EditHistoryForm';

// Taller
import TallerTable from './components/Taller/TallerTable';
import AddTallerForm from './components/Taller/AddTallerForm';
import EditTallerForm from './components/Taller/EditTallerForm';
function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <BarraNav />
        
        <main className="flex-grow-1">
          <Routes>
            {/* Home */}
            <Route path="/" element={<HomePage />} />
            
            {/* Actors */}
            <Route path="/actors">
              <Route index element={<ActorTable />} />
              <Route path="add" element={<AddActorForm />} />
              <Route path="edit/:id" element={<EditActorForm />} />
            </Route>
            
            {/* Authors */}
            <Route path="/authors">
              <Route index element={<AuthorTable />} />
              <Route path="add" element={<AddAuthorForm />} />
              <Route path="edit/:id" element={<EditAuthorForm />} />
            </Route>
            
            {/* Histories */}
            <Route path="/histories">
              <Route index element={<HistoryTable />} />
              <Route path="add" element={<AddHistoryForm />} />
              <Route path="edit/:id" element={<EditHistoryForm />} />
            </Route>

            {/* Taller */}
            <Route path="/tallers">
              <Route index element={<TallerTable />} />
              <Route path="add" element={<AddTallerForm />} />
              <Route path="edit/:id" element={<EditTallerForm />} />
            </Route>
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;