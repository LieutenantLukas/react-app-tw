import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/pokemons">Pokémons</Link></li>
          <li><Link to="/contact">Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;