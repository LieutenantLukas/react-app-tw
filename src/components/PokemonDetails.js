import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Para obter o ID da URL e retornar à lista
import '../styles/PokemonDetails.css'; // Importa os estilos específicos para esta página

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

const PokemonDetails = () => {
  const { id } = useParams(); // Obtém o ID do Pokémon a partir da URL
  const [pokemon, setPokemon] = useState(null); // Armazena os detalhes do Pokémon
  const [loading, setLoading] = useState(true); // Controla o status de carregamento
  const [error, setError] = useState(false); // Controla se ocorreu um erro

  // Função para buscar os detalhes do Pokémon
  const fetchPokemonDetails = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`); // Requisição para o Pokémon específico
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json();
      setPokemon(data); // Atualiza o estado com os detalhes
      setLoading(false); // Finaliza o carregamento
    } catch (error) {
      console.error('Erro ao carregar detalhes do Pokémon:', error);
      setError(true);
      setLoading(false); // Finaliza o carregamento mesmo em caso de erro
    }
  };

  // Hook para buscar os dados quando o componente é montado
  useEffect(() => {
    fetchPokemonDetails();
  }, [id]);

  // Renderiza mensagens de status
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar Pokémon. Tente novamente mais tarde.</p>;

  // Renderiza os detalhes do Pokémon quando os dados são carregados
  return (
    <div className="pokemon-details"
      style={{ backgroundColor: typeColors[pokemon.types[0].type.name] || '#fff' }}>
      <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <p><strong>ID:</strong> #{pokemon.id}</p>
      <p><strong>Peso:</strong> {pokemon.weight / 10} kg</p>
      <p><strong>Tipos:</strong></p>
      <ul>
        {pokemon.types.map((type) => (
          <li key={type.type.name}>{type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}</li>
        ))}
      </ul>
      <a href="/pokemons" className="back-button">Voltar</a>
    </div>

  );
};

export default PokemonDetails;