import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import '../styles/Pokemons.css';

const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCart, setShowCart] = useState(false);

  const { cart, addToCart, removeFromCart, clearCartItem, getTotalPrice, setPokemonData } = useCart(); // Mudei a logica de counter de pokemons e carrinho para o CartContext para que possa ser compartilhada entre os paginas

  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=252');
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      const detailsPromises = data.results.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );
      const details = await Promise.all(detailsPromises);

      const formattedData = details.map((pokemon) => ({
        id: pokemon.id,
        weight: pokemon.weight,
        types: pokemon.types,
        ...pokemon,
      }));

      setPokemons(formattedData);
      setPokemonData(
        formattedData.reduce((acc, pokemon) => {
          acc[pokemon.id] = pokemon;
          return acc;
        }, {})
      );

      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemons();
  }, []);

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <div className="pokemons">
      <h1>Pokémons Disponíveis</h1>
      <input
        type="text"
        placeholder="Procure por nome ou ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {loading ? (
        <p>A carregar...</p>
      ) : error ? (
        <p>Erro ao carregar Pokémon. Tente novamente mais tarde.</p>
      ) : (
        <div className="pokemon-list">
          {pokemons.map((pokemon) => {
            if (
              pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              searchTerm === '' ||
              pokemon.id.toString().includes(searchTerm)
            ) {
              const primaryType = pokemon.types[0]?.type?.name;
              const backgroundColor = typeColors[primaryType] || '#f4f4f4';

              return (
                <div
                  key={pokemon.id}
                  className="pokemon-item"
                  style={{ backgroundColor }}
                >
                  <span className="pokemon-id">#{pokemon.id}</span>
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} className="pokemon-image" />
                  <h3 className="pokemon-name">
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </h3>
                  <Link to={`/pokemons/${pokemon.id}`} className="info-icon">
                    I
                  </Link>
                  <p className="pokemon-price">
                    Preço: {getTotalPrice(pokemon.id).toFixed(2)}€
                  </p>
                  <div className="counter">
                    <button onClick={() => removeFromCart(pokemon.id)}>-</button>
                    <span>{cart[pokemon.id] || 0}</span>
                    <button onClick={() => addToCart(pokemon.id)}>+</button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      <div className="cart-icon" onClick={toggleCart}>
        <FaShoppingCart size={30} color="white" />
        <div className="cart-bubble">
          {Object.values(cart).reduce((sum, count) => sum + count, 0)}
        </div>
      </div>

      {showCart && (
        <div className="cart-popup">
          <h3>Carrinho</h3>
          <ul>
            {Object.entries(cart)
              .filter(([id, count]) => count > 0)
              .map(([id, count]) => {
                const pokemon = pokemons.find((poke) => poke.id === parseInt(id));
                if (!pokemon) return null;

                return (
                  <li key={id} className="cart-item">
                    <div className="cart-item-left">
                      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="cart-item-image" />
                      <span className="cart-item-name">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                      </span>
                    </div>
                    <div className="cart-item-controls">
                      <span className="cart-item-price">
                        {getTotalPrice(id, count).toFixed(2)}€
                      </span>
                      <button onClick={() => removeFromCart(id)}>-</button>
                      <span>{count}</span>
                      <button onClick={() => addToCart(id)}>+</button>
                      <button onClick={() => clearCartItem(id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="cart-footer">
            <button className="cart-total">
              Total: {Object.entries(cart)
                .reduce((sum, [id, count]) => sum + getTotalPrice(id, count), 0)
                .toFixed(2)}€
            </button>
            <Link to="/checkout" className="checkout-button">
              Pagar
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pokemons;