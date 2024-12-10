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
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const [guessedPokemons, setGuessedPokemons] = useState([]); // Track guessed Pokémon

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
    setErrorMessage(''); // Clear any previous error message
    setGuessedPokemons([]); // Clear previously guessed Pokémon

    const data = await fetchPokemon(randomPokemonId); // Fetch new Pokémon data
    setPokemonData(data); // Set the new Pokémon data
  };

  // Handle the "Adivinhar" button click
  const handleGuess = () => {
    if (isGameOver || isGuessedCorrectly) return; // Do nothing if the game is over or guessed correctly

    // Check if the guess is not empty and exists in the Pokémon names list
    if (guess.trim() === '') {
      setErrorMessage('Por favor, insira um nome de Pokémon válido!');
      return; // Do nothing if the guess is empty
    }

    if (!pokemonNames.includes(guess.toLowerCase())) {
      setErrorMessage('Pokémon não encontrado! Tente novamente.');
      return; // Do nothing if the Pokémon doesn't exist in the list
    }

    if (guessedPokemons.includes(guess.toLowerCase())) {
      setErrorMessage('Você já adivinhou esse Pokémon! Tente outro.');
      return; // Prevent guessing the same Pokémon twice
    }

    // If the guess is valid, check if it's correct
    if (guess.toLowerCase() === pokemonData.name.toLowerCase()) {
      setIsGuessedCorrectly(true); // Correct guess
      setErrorMessage(''); // Clear error message if the guess is correct
    } else {
      if (remainingGuesses > 1) {
        setRemainingGuesses(remainingGuesses - 1); // Incorrect guess, decrement remaining guesses
      } else {
        setRemainingGuesses(0); // Set remaining guesses to 0 explicitly
        setIsGameOver(true); // Set game over state
      }
      setErrorMessage('Tente novamente!');
    }

    // Add the guessed Pokémon to the list of guessed Pokémon and remove it from suggestions if incorrect
    setGuessedPokemons([...guessedPokemons, guess.toLowerCase()]);

    // Remove the guessed Pokémon from the suggestions list if the guess was incorrect
    if (remainingGuesses > 0) {
      setSuggestions(suggestions.filter((suggestion) => suggestion.toLowerCase() !== guess.toLowerCase()));
    }

    setGuess(''); // Clear the input field after each guess
  };

  // Handle the input change and filter suggestions
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setGuess(inputValue);

    if (inputValue) {
      const filteredSuggestions = pokemonNames
        .filter((name) => name.toLowerCase().includes(inputValue.toLowerCase()) && !guessedPokemons.includes(name.toLowerCase())) // Exclude guessed names
        .slice(0, 5); // Limit suggestions to 5 items
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
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

          {/* Display Guesses Remaining */}
          <p>Tentativas restantes: {remainingGuesses}</p>

          {/* Display error message above the input box */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          {!isGameOver && !isGuessedCorrectly && remainingGuesses > 0 && (
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
