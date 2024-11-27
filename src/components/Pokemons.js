import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Para redirecionar às páginas de detalhes
import '../styles/Pokemons.css'; // Importa os estilos para este componente

// Mapeia os tipos de Pokémon para cores específicas
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
  const [pokemons, setPokemons] = useState([]); // Armazena os dados detalhados dos Pokémon
  const [loading, setLoading] = useState(true); // Controla o status de carregamento
  const [error, setError] = useState(false); // Controla se houve erro durante a requisição

  // Busca os dados dos Pokémon
  const fetchPokemons = async () => {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=252'); // Requisição à API
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json(); // Converte a resposta em JSON

      // Faz uma segunda requisição para obter os detalhes de cada Pokémon
      const detailsPromises = data.results.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );
      const details = await Promise.all(detailsPromises); // Aguarda todas as requisições

      setPokemons(details); // Atualiza o estado com os detalhes dos Pokémon
      setLoading(false); // Finaliza o carregamento
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
      setError(true);
      setLoading(false); // Finaliza o carregamento mesmo em caso de erro
    }
  };

  // useEffect para buscar os dados quando o componente é montado
  useEffect(() => {
    fetchPokemons();
  }, []); // Executa apenas uma vez

  return (
    <div className="pokemons">
      <h1>Pokémons Disponíveis</h1>
      {loading ? (
        <p>A carregar...</p> // Mensagem de carregamento
      ) : error ? (
        <p>Erro ao carregar Pokémon. Tente novamente mais tarde.</p> // Mensagem de erro
      ) : (
        <div className="pokemon-list">
          {pokemons.map((pokemon) => {
            const primaryType = pokemon.types[0]?.type.name;
            const backgroundColor = typeColors[primaryType] || '#fff'; // Cor baseada no tipo

            return (
              <div
                key={pokemon.id} // Chave única para cada Pokémon
                className="pokemon-item"
                style={{ backgroundColor }} // Aplica cor de fundo com base no tipo
              >
                <span className="pokemon-id">#{pokemon.id}</span> {/* Exibe o ID */}
                <img
                  src={pokemon.sprites.front_default} // Sprite do Pokémon
                  alt={pokemon.name}
                  className="pokemon-image"
                />
                <h3 className="pokemon-name">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} {/* Nome com a primeira letra maiúscula */}
                </h3>
                {/* Ícone "I" que leva à página de detalhes */}
                <Link to={`/pokemons/${pokemon.id}`} className="info-icon">
                  I
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pokemons;
