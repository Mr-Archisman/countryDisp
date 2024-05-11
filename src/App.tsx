// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CountryDetail from './pages/CountryDetail';

const App = () => {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/country/:name" element={<CountryDetail />} />
      </Routes>
    </Router>
  );
};

export default App;
