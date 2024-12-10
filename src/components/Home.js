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
  const [pokemonNames, setPokemonNames] = useState([]); // Stores fetched Pokémon names for autocomplete
  const [suggestions, setSuggestions] = useState([]); // Stores filtered suggestions
  const [error, setError] = useState(''); // To store error message if guess is invalid
  const [guessedPokemon, setGuessedPokemon] = useState([]); // Stores guessed Pokémon (both correct and incorrect)

  // Fetch Pokémon names when the component mounts
  useEffect(() => {
    const getPokemonNames = async () => {
      const names = await fetchPokemons();
      setPokemonNames(names); // Save the fetched Pokémon names
    };

    getPokemonNames();
    getNewPokemon();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Function to get a new random Pokémon and set data
  const getNewPokemon = async () => {
    const randomPokemonId = Guessthatpokemon(); // Generate a random Pokémon ID
    setPokemonId(randomPokemonId); // Update the state with new Pokémon ID
    setRemainingGuesses(3); // Reset the guesses
    setIsGuessedCorrectly(false); // Reset the guess state
    setIsGameOver(false); // Reset game over state
    setGuess(''); // Reset the guess input field
    setSuggestions([]); // Clear suggestions
    setError(''); // Clear previous error message
    setGuessedPokemon([]); // Clear previous guessed Pokémon

    const data = await fetchPokemon(randomPokemonId); // Fetch new Pokémon data
    setPokemonData(data); // Set the new Pokémon data
  };

  // Handle the "Adivinhar" button click
  const handleGuess = () => {
    if (isGameOver || isGuessedCorrectly) return; // Do nothing if the game is over or guessed correctly

    // Check if the guess is valid
    if (!guess.trim() || !pokemonNames.includes(guess.toLowerCase())) {
      setError('Por favor, digite um Pokémon válido!');
      return;
    }
    setError(''); // Clear the error if the guess is valid

    if (guess.toLowerCase() === pokemonData.name.toLowerCase()) {
      setIsGuessedCorrectly(true); // Correct guess
      setGuessedPokemon([...guessedPokemon, guess.toLowerCase()]); // Add to guessed Pokémon list
    } else {
      if (remainingGuesses > 1) {
        setRemainingGuesses(remainingGuesses - 1); // Incorrect guess, decrement remaining guesses
      } else {
        setRemainingGuesses(0); // Set remaining guesses to 0 explicitly
        setIsGameOver(true); // Set game over state
      }
      setGuessedPokemon([...guessedPokemon, guess.toLowerCase()]); // Add to guessed Pokémon list
    }
    setGuess(''); // Clear the input field after each guess
  };

  // Handle the input change and filter suggestions
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setGuess(inputValue);

    if (inputValue) {
      // Filter suggestions by excluding guessed Pokémon
      const filteredSuggestions = pokemonNames
        .filter((name) => name.toLowerCase().includes(inputValue.toLowerCase()) && !guessedPokemon.includes(name.toLowerCase()))
        .slice(0, 5); // Limit suggestions to 5 items
      console.log('Filtered Suggestions:', filteredSuggestions); // Add this log
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }

    // Clear error if there's a valid guess
    if (inputValue && pokemonNames.includes(inputValue.toLowerCase()) && !guessedPokemon.includes(inputValue.toLowerCase())) {
      setError('');
    }
  };

  // Handle the click event on a suggestion
  const handleSuggestionClick = (suggestion) => {
    setGuess(suggestion); // Set the input value to the clicked suggestion
    setSuggestions([]); // Clear suggestions after selection
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
            {error && <p className="error-message">{error}</p>} {/* Display error message if exists */}

            <p className="guesses-remaining">Tentativas restantes: {remainingGuesses}</p> {/* Display remaining guesses */}

            {/* Show input box and button only if the game is ongoing */}
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
                        onClick={() => handleSuggestionClick(suggestion)} // Set the suggestion as the input value when clicked
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
