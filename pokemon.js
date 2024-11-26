// probs temos de fazer uma função para o tipo. eu estou a cozinhar, ajuda-me antonio por favor. eu sei que vais ler esta merda no github por favor salva-me do meu hubris. eu pensva que era chill mas estou a sofrer... dor dor dor dor dor dor dor dor

function getType(id){
  



// dor dor dor
}


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
      const pid = document.createElement("h2")
      const ptipo = "a"

      // get info

      console.log(`${API_URL}/${pokemonName}`)
      div.className = "card";
      image.src = newPokemon.sprites.other.dream_world.front_default;
      name.textContent = newPokemon.name;
      ptipo.textContent = newPokemon.types;
      pid.textContent = newPokemon.id;
      console.log(ptipo)
      
      //ptipo.forEach((element) => console.log(element));

      // print info

      div.appendChild(name);
      div.appendChild(image);
      div.appendChild(pid);
      ptipo.innerHTML=newPokemon.types[0].type.name //ainda só consegue ir buscar 1 dos tipos do pokemon. implementar um for loop para ir buscar tudo como array

      //div.appendChild(ptipo);

      root.appendChild(div);
      console.log(ptipo);
      console.log(newPokemon.types[0].type.name);



    });
});