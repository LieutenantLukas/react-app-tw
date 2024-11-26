import React, { useState, useEffect } from 'react';
import '../styles/Pokemons.css'; // Importa os estilos CSS específicos para este componente

// Objeto que mapeia os tipos de Pokémon para suas cores correspondentes
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

// Componente principal que renderiza a lista de Pokémon
const Pokemons = () => {
  const [pokemons, setPokemons] = useState([]); // Estado que armazena os detalhes dos Pokémon
  const [loading, setLoading] = useState(true); // Estado que controla o status de carregamento
  const [error, setError] = useState(false); // Estado que controla se ocorreu algum erro

  // Função para buscar os primeiros 150 Pokémon da PokéAPI
  const fetchPokemons = async () => {
    try {
      // Faz a requisição inicial para obter a lista básica dos 150 Pokémon
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=150');
      if (!response.ok) {
        // Lança um erro se a resposta da API não for bem-sucedida
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      const data = await response.json(); // Converte a resposta para JSON

      // Mapeia cada Pokémon para buscar seus detalhes adicionais (como tipos e sprites)
      const detailsPromises = data.results.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );
      // Aguarda que todas as requisições para os detalhes dos Pokémon sejam concluídas
      const details = await Promise.all(detailsPromises);

      setPokemons(details); // Atualiza o estado com os detalhes dos Pokémon
      setLoading(false); // Define que o carregamento foi concluído
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error); // Registra o erro no console
      setError(true); // Define que houve um erro
      setLoading(false); // Finaliza o status de carregamento
    }
  };

  // Hook useEffect para iniciar a busca assim que o componente for montado
  useEffect(() => {
    fetchPokemons(); // Chama a função de busca ao montar o componente
  }, []); // A lista vazia garante que este código será executado apenas uma vez

  return (
    <div className="pokemons">
      <h1>Pokémons Disponíveis</h1>
      {loading ? (
        // Renderiza uma mensagem de carregamento enquanto os dados não foram carregados
        <p>Carregando...</p>
      ) : error ? (
        // Renderiza uma mensagem de erro se ocorreu algum problema durante a busca
        <p>Erro ao carregar Pokémon. Tente novamente mais tarde.</p>
      ) : (
        // Renderiza a lista de Pokémon quando os dados são carregados com sucesso
        <div className="pokemon-list">
          {pokemons.map((pokemon) => {
            // Obtém o tipo principal do Pokémon e define a cor de fundo correspondente
            const primaryType = pokemon.types[0]?.type.name;
            const backgroundColor = typeColors[primaryType] || '#fff';

            // Retorna a estrutura HTML de cada Pokémon com suas informações principais
            return (
              <div
                key={pokemon.id} // Define uma chave única para o elemento, necessária para listas no React
                className="pokemon-item"
                style={{ backgroundColor }} // Aplica a cor de fundo baseada no tipo do Pokémon
              >
                {/* Exibe o ID do Pokémon no canto superior esquerdo */}
                <span className="pokemon-id">#{pokemon.id}</span>
                {/* Exibe a imagem (sprite) do Pokémon */}
                <img
                  src={pokemon.sprites.front_default} // URL da imagem do Pokémon
                  alt={pokemon.name} // Texto alternativo descritivo
                  className="pokemon-image"
                />
                {/* Exibe o nome do Pokémon com a primeira letra maiúscula */}
                <h3 className="pokemon-name">
                  {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </h3>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pokemons;
