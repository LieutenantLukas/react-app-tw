import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Pokemons from './components/Pokemons';
import Contact from './components/Contact';
import PokemonDetails from './components/PokemonDetails'; // Importa a página de detalhes
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pokemons" element={<Pokemons />} />
        <Route path="/pokemons/:id" element={<PokemonDetails />} /> {/* Rota para detalhes */}
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;