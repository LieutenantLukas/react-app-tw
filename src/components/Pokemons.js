import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import '../styles/Pokemons.css';

// Definições de cores baseadas nos tipos de Pokémon
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

// Preços baseados nos tipos de Pokémon
const typePrices = {
  normal: 1,
  fire: 1,
  water: 1,
  electric: 1,
  grass: 1,
  ice: 1,
  fighting: 1,
  poison: 1,
  ground: 1,
  flying: 1,
  psychic: 1,
  bug: 1,
  rock: 1,
  ghost: 1,
  dragon: 1,
  dark: 1,
  steel: 1,
  fairy: 1,
};

const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [counts, setCounts] = useState({});
  const [showCart, setShowCart] = useState(false);

  // Função para buscar os dados da API e processar os Pokémon
  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=252');
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();

      // Detalhes adicionais de cada Pokémon
      const detailsPromises = data.results.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );
      const details = await Promise.all(detailsPromises);

      // Inicializar o contador de cada Pokémon com 0
      const initialCounts = details.reduce((counter, pokemon) => {
        counter[pokemon.id] = 0;
        return counter;
      }, {});
      setCounts(initialCounts);
      setPokemons(details);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      setError(true);
      setLoading(false);
    }
  };

  // Executar a busca de Pokémon quando o componente é montado
  useEffect(() => {
    fetchPokemons();
  }, []);

  // Incrementa o contador do Pokémon com ID especificado
  const incrementCount = (id) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: prevCounts[id] + 1,
    }));
  };

  // Decrementa o contador do Pokémon com ID especificado
  const decrementCount = (id) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: Math.max(prevCounts[id] - 1, 0),
    }));
  };

  // Alterna a visibilidade do popup do carrinho
  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  return (
    <div className="pokemons">
      <h1>Pokémons Disponíveis</h1>
      {/* Barra de busca para filtrar Pokémon */}
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
              const primaryType = pokemon.types[0].type.name;
              const weight = pokemon.weight / 10; // Peso em kg
              const basePrice = typePrices[primaryType] || 1;
              const totalPrice = (basePrice * weight).toFixed(2);
              const backgroundColor = typeColors[primaryType];

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
                  <p className="pokemon-price">Preço: {totalPrice}€</p>
                  <div className="counter">
                    <button onClick={() => decrementCount(pokemon.id)}>-</button>
                    <span>{counts[pokemon.id]}</span>
                    <button onClick={() => incrementCount(pokemon.id)}>+</button>
                  </div>
                </div>
              );
            }
          })}
        </div>
      )}

      {/* Ícone do Carrinho */}
      <div className="cart-icon" onClick={toggleCart}>
        <FaShoppingCart size={30} color="white" />
        <div className="cart-bubble">
          {Object.values(counts).reduce((sum, count) => sum + count, 0)}
        </div>
      </div>

      {/* Popup do Carrinho */}
      {showCart && (
        <div className="cart-popup">
          <h3>Carrinho</h3>
          <ul>
            {Object.entries(counts)
              .filter(([id, count]) => count > 0)
              .map(([id, count]) => {
                const pokemon = pokemons.find((poke) => poke.id === parseInt(id));
                const primaryType = pokemon.types[0].type.name;
                const weight = pokemon.weight / 10;
                const basePrice = typePrices[primaryType] || 1;
                const totalPrice = (basePrice * weight * count).toFixed(2);

                return (
                  <li key={id} className="cart-item">
                    <div className="cart-item-left">
                      <img src={pokemon.sprites.front_default} alt={pokemon.name} className="cart-item-image" />
                      <span className="cart-item-name">
                        {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                      </span>
                    </div>
                    <div className="cart-item-controls">
                      <span className="cart-item-price">{totalPrice}€</span>
                      <button onClick={() => decrementCount(pokemon.id)}>-</button>
                      <span>{count}</span>
                      <button onClick={() => incrementCount(pokemon.id)}>+</button>
                      <button
                        onClick={() =>
                          setCounts((prevCounts) => ({
                            ...prevCounts,
                            [id]: 0,
                          }))
                        }
                      >
                        X
                      </button>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="cart-footer">
            <button className="cart-total">
              Total: {Object.entries(counts)
                .filter(([id, count]) => count > 0)
                .reduce((sum, [id, count]) => {
                  const pokemon = pokemons.find((poke) => poke.id === parseInt(id));
                  const primaryType = pokemon.types[0].type.name;
                  const weight = pokemon.weight / 10;
                  const basePrice = typePrices[primaryType] || 1;
                  return sum + basePrice * weight * count;
                }, 0)
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