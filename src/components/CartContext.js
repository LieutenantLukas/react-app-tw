import React, { createContext, useContext, useReducer } from 'react';

// Estado inicial do carrinho
const initialState = {
  cart: {}, // Armazena os itens no carrinho
  pokemonData: {}, // Dados detalhados dos Pokémons
};

// Preços baseados nos tipos de Pokémon
const typePrices = {
  normal: 1,
  fire: 1.5,
  water: 1.2,
  electric: 2,
  grass: 0.7,
  ice: 1.7,
  fighting: 2,
  poison: 3,
  ground: 0.5,
  flying: 1,
  psychic: 2.5,
  bug: 0.25,
  rock: 0.25,
  ghost: 7,
  dragon: 10,
  dark: 1,
  steel: 2,
  fairy: 1.3,
};


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
      return {
        ...state,
        cart: {}, // Limpa o carrinho
      };
    default:
      return state;
  }
};

// Cria Context para o carrinho
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
    return typePrice * weightInKg * quantity;
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