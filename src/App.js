import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './components/CartContext'; // Importa o CartProvider
import Header from './components/Header';
import Home from './components/Home';
import Pokemons from './components/Pokemons';
import Contact from './components/Contact';
import PokemonDetails from './components/PokemonDetails';
import Checkout from './components/Checkout';
import './styles/App.css';

const App = () => {
  return (
    <CartProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemons" element={<Pokemons />} />
          <Route path="/pokemons/:id" element={<PokemonDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </CartProvider>
  );
};

export default App;
