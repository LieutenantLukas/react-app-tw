import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import '../styles/Checkout.css';

const Checkout = () => {
  const { cart, clearCart, getTotalPrice, pokemonData } = useCart();

  return (
    <div className="checkout">
      <div className="back-button-container">
        <Link to="/pokemons" className="back-button">
          Voltar
        </Link>
      </div>
      <h1>Checkout</h1>
      <ul>
        {Object.entries(cart)
          .filter(([id, count]) => count > 0)
          .map(([id, count]) => {
            const pokemon = pokemonData[id];
            if (!pokemon) return null;

            return (
              <li key={id} className="checkout-item">
                <div className="checkout-item-left">
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="checkout-item-image"
                  />
                  <span className="checkout-item-name">
                    {count}x {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </span>
                </div>
                <span className="checkout-item-price">
                  {(getTotalPrice(id, count)).toFixed(2)}€
                </span>
              </li>
            );
          })}
      </ul>

      <div className="checkout-total">
        Total: {Object.entries(cart)
          .reduce((sum, [id, count]) => sum + getTotalPrice(id, count), 0)
          .toFixed(2)}€
      </div>

      <button className="pay-button" onClick={clearCart}>
        Pagar
      </button>
    </div>
  );
};

export default Checkout;
