import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import '../styles/Checkout.css';
import { jsPDF } from 'jspdf';

const Checkout = () => {
  const { cart, clearCart, getTotalPrice, pokemonData } = useCart();

  const handlePayment = () => {
    // Comeca o pdf com a biblioteca
    const doc = new jsPDF();
    
    // Mete titulo
    doc.setFontSize(20);
    doc.text('Recibo de Compra', 10, 20);
    
    // Mete os pokemons do carrinho
    let yPosition = 30;
    Object.entries(cart)
      .filter(([id, count]) => count > 0)
      .forEach(([id, count]) => {
        const pokemon = pokemonData[id];
        if (pokemon) {
          const name = `${count}x ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`;
          const price = `${getTotalPrice(id, count).toFixed(2)}€`;
          doc.text(`${name} - ${price}`, 10, yPosition);
          yPosition += 10; // Mete um espaco entre cada pokemon
        }
      });

    // Mete o total do carrinho
    doc.setFontSize(16);
    doc.text(`Pago: ${Object.entries(cart)
      .reduce((sum, [id, count]) => sum + getTotalPrice(id, count), 0)
      .toFixed(2)}€`, 10, yPosition + 10);

    // Guarda o pdf
    doc.save('Recibo_de_Compra.pdf');

    // Limpa o carrinho
    clearCart();
  };

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

      <button className="pay-button" onClick={handlePayment}>
        Pagar
      </button>
    </div>
  );
};

export default Checkout;
