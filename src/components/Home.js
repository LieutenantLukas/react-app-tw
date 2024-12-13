import { useState, useEffect } from 'react';
import '../styles/Home.css';

// Fetching the first 252 Pokémon names and details
const fetchPokemons = async () => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=252');
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    const data = await response.json();
    // Return only the names of the Pokémon
    return data.results.map((pokemon) => pokemon.name);
  } catch (error) {
    console.error("Failed to fetch Pokémon data:", error);
    return [];
  }
};

const Guessthatpokemon = () => {
  return Math.floor(Math.random() * 252) + 1; // Generate a number from 1 to 252
};

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
  const [guess, setGuess] = useState('');
  const [remainingGuesses, setRemainingGuesses] = useState(3);
  const [isGuessedCorrectly, setIsGuessedCorrectly] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [pokemonNames, setPokemonNames] = useState([]); 
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(''); 
  const [guessedPokemon, setGuessedPokemon] = useState([]);

  useEffect(() => {
    const getPokemonNames = async () => {
      const names = await fetchPokemons();
      setPokemonNames(names); 
    };

    getPokemonNames();
    getNewPokemon();
  }, []);

  const getNewPokemon = async () => {
    const randomPokemonId = Guessthatpokemon(); 
    setPokemonId(randomPokemonId); 
    setRemainingGuesses(3); 
    setIsGuessedCorrectly(false); 
    setIsGameOver(false);
    setGuess('');
    setSuggestions([]);
    setError('');
    setGuessedPokemon([]);

    const data = await fetchPokemon(randomPokemonId); 
    setPokemonData(data); 
  };

  const handleGuess = () => {
    if (isGameOver || isGuessedCorrectly) return; 

    if (!guess.trim() || !pokemonNames.includes(guess.toLowerCase())) {
      setError('Por favor, digite um Pokémon válido!');
      return;
    }
    setError('');

    if (guess.toLowerCase() === pokemonData.name.toLowerCase()) {
      setIsGuessedCorrectly(true);
      setGuessedPokemon([...guessedPokemon, guess.toLowerCase()]);
    } else {
      if (remainingGuesses > 1) {
        setRemainingGuesses(remainingGuesses - 1);
      } else {
        setRemainingGuesses(0); 
        setIsGameOver(true);
      }
      setGuessedPokemon([...guessedPokemon, guess.toLowerCase()]);
    }
    setGuess('');
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setGuess(inputValue);

    if (inputValue) {
      const filteredSuggestions = pokemonNames
        .filter((name) => name.toLowerCase().includes(inputValue.toLowerCase()) && !guessedPokemon.includes(name.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }

    if (inputValue && pokemonNames.includes(inputValue.toLowerCase()) && !guessedPokemon.includes(inputValue.toLowerCase())) {
      setError('');
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion); 
    setSuggestions([]);
  };

  return (
    <div className="home">
      <h1>Bem-vindo ao Mercado Pokémon!</h1>
      <p>A melhor carne de pokemon do mercado!</p>
      <p>A carne vem toda congelada, para não estragar (pokemons de gelo vêm sem gelo)!</p>

      {pokemonData ? (
        <div>
          <img
            src={pokemonData.sprites.front_default}
            alt={pokemonData.name}
            className="pokemon-images"
            style={{
              filter: isGuessedCorrectly || isGameOver ? 'brightness(100%)' : 'brightness(0%)',
            }}
          />

          <div className="textboxpkmn-container">
            {error && <p className="error-message">{error}</p>}

            <p className="guesses-remaining">Tentativas restantes: {remainingGuesses}</p>
            {!isGuessedCorrectly && !isGameOver && remainingGuesses > 0 && (
              <div>
                <input
                  className="textboxpkmn"
                  placeholder="Adivinhe o Pokémon"
                  value={guess}
                  onChange={handleInputChange}
                />
                <button className="button" onClick={handleGuess}>Adivinhar</button>
                {suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((suggestion) => (
                      <li
                        key={suggestion}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {remainingGuesses === 0 && !isGuessedCorrectly && (
            <p>Fim de tentativas! O Pokémon era {pokemonData.name}. Tente novamente!</p>
          )}

          {isGuessedCorrectly && <p>Parabéns! Você adivinhou corretamente!</p>}

          <button className="button2" onClick={getNewPokemon}>Reset</button>
        </div>
      ) : (
        <p>Carregando dados do Pokémon...</p>
      )}
    </div>
  );
};

export default Home;
