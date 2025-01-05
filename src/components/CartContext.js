import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial do carrinho
const initialState = {
  cart: {}, // Armazena a quantidade de cada Pokémon no carrinho
  pokemonData: {}, // Armazena os dados dos Pokémon
};

// Preços baseados nos tipos de Pokémon
const typePrices = {
  normal: 1.01,
  fire: 1.51,
  water: 1.21,
  electric: 2.01,
  grass: 0.71,
  ice: 1.71,
  fighting: 2.01,
  poison: 3.01,
  ground: 0.51,
  flying: 1.01,
  psychic: 2.51,
  bug: 0.241,
  rock: 0.251,
  ghost: 7.01,
  dragon: 10.01,
  dark: 1.01,
  steel: 2.01,
  fairy: 1.31,
};

// Multiplicador para Pokémon lendários
const LEGENDARY_MULTIPLIER = 10;

// Função redutora(react) para manipular o estado do carrinho de compras em vez de varios useState
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POKEMON_DATA':
      return { ...state, pokemonData: action.payload };
    case 'ADD_TO_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.id]: (state.cart[action.payload.id] || 0) + 1,
        },
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.payload.id]: Math.max((state.cart[action.payload.id] || 1) - 1, 0),
        },
      };
    case 'CLEAR_CART_ITEM':
      const updatedCart = { ...state.cart };
      delete updatedCart[action.payload.id];
      return { ...state, cart: updatedCart };
    case 'CLEAR_CART':
      return { ...state, cart: {} };
    default:
      return state;
  }
};

// Criar carrinho 
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addToCart = (id) => dispatch({ type: 'ADD_TO_CART', payload: { id } });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  const clearCartItem = (id) => dispatch({ type: 'CLEAR_CART_ITEM', payload: { id } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const setPokemonData = (data) =>
    dispatch({ type: 'SET_POKEMON_DATA', payload: data });

  const getTotalPrice = (id, quantity = 1) => {
    const pokemon = state.pokemonData[id];
    if (!pokemon) return 0;
    const primaryType = pokemon.types[0]?.type?.name;
    const typePrice = typePrices[primaryType] || 1;
    const weightInKg = pokemon.weight / 10; // Peso em kg

    // Tentativa de uso de `is_legendary` para determinar se um Pokémon é lendário e auumentar o preco accordingly
    const isLegendary = pokemon.is_legendary;

    // Calcular o preço total
    return typePrice * weightInKg * quantity * (isLegendary ? LEGENDARY_MULTIPLIER : 1);
  };

  const calculateCartTotal = () =>
    Object.entries(state.cart).reduce(
      (sum, [id, count]) => sum + getTotalPrice(id, count),
      0
    );

  return (
    <CartContext.Provider
      value={{
        cart: state.cart,
        pokemonData: state.pokemonData,
        addToCart,
        removeFromCart,
        clearCartItem,
        clearCart,
        setPokemonData,
        getTotalPrice,
        calculateCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook para acessar o contexto
export const useCart = () => useContext(CartContext);
