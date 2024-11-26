const API_URL = "https://pokeapi.co/api/v2/pokemon";
const root = document.getElementById("root");
const form = document.getElementById("addPokemonForm");
form.addEventListener("submit", (event) => {
  // Prevents the form from submitting and refreshing the page
  event.preventDefault();
  const pokemonName = document.getElementById("pokemonName").value;
  fetch(`${API_URL}/${pokemonName}`)
    .then((response) => response.json())
    .then((newPokemon) => {
      // create elements for the Pokemon Card
      const div = document.createElement("div");
      const image = document.createElement("img");
      const name = document.createElement("h1");
      const tipo = document.createElement("h2")
      console.log(tipo)
      console.log(`${API_URL}/${pokemonName}`)
      div.className = "card";
      image.src = newPokemon.sprites.other.dream_world.front_default;
      name.textContent = newPokemon.name;
      tipo.textContent = newPokemon.id;
      div.appendChild(name);
      div.appendChild(image);
      div.appendChild(tipo)
      root.appendChild(div);


      // another image option:
      //image.src = newPokemon.sprites.front_default;
      // other ideas:
      // div.appendChild(pokemonNameLabel);
      // div.appendChild(pokemonAttack);
      // div.appendChild(pokemonHealth);
  });
});