import { useState, useEffect } from 'react';
import '../styles/Home.css';

// Function to generate a random number between 1 and 252 (inclusive)
const Guessthatpokemon = () => {
  return Math.floor(Math.random() * 252) + 1; // Generate a number from 1 to 252
};

// Function to fetch details of a Pokémon based on its ID
const fetchPokemon = async (pokemonId) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    return data; // Return the Pokémon data
  } catch (error) {
    console.error("Failed to fetch Pokémon data:", error);
    return null;
  }
};

const Home = () => {
  const [pokemonId, setPokemonId] = useState(null);
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const randomPokemonId = Guessthatpokemon(); // Generate a random Pokémon ID
    setPokemonId(randomPokemonId); // Set the random Pokémon ID

    // Fetch the Pokémon data
    const getPokemonData = async () => {
      const data = await fetchPokemon(randomPokemonId);
      setPokemonData(data); // Set the fetched Pokémon data to state
    };

    getPokemonData(); // Call the function to fetch Pokémon data
  }, []); // This runs once when the component mounts

  return (
    <div className="home">
      <h1>Bem-vindo ao Mercado Pokémon!</h1>
      <p>A melhor carne de pokemon do mercado!</p>
      <p>A carne vem toda congelada, para não estragar (pokemons de gelo vêm sem gelo)!</p>

      
      {pokemonData ? (
        <div>
          <h2>{pokemonData.name}</h2>
          
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} className="pokemon-images" />
          
        </div>
      ) : (
        <p>Carregando dados do Pokémon...</p>
      )}
    </div>
  );
};

export default Home;
