import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import '../styles/Checkout.css';
import jsPDF from 'jspdf';

const Checkout = () => {
  const { cart, clearCart, getTotalPrice, pokemonData } = useCart();

  const handlePayment = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297],
    });

    let yPosition = 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recibo de Compra', 40, yPosition, { align: 'center' });
    yPosition += 10;

    doc.setLineWidth(0.5);
    doc.line(5, yPosition, 75, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    Object.entries(cart)
      .filter(([id, count]) => count > 0)
      .forEach(([id, count]) => {
        const pokemon = pokemonData[id];
        if (!pokemon) return;

        const total = getTotalPrice(id, count).toFixed(2);

        const img = new Image();
        img.src = pokemon.sprites.front_default;
        doc.addImage(img, 'PNG', 5, yPosition - 5, 10, 10); 

        doc.text(`${count}x ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}`, 20, yPosition);

        doc.text(`${total}€`, 75, yPosition, { align: 'right' });

        yPosition += 12;
      });

    yPosition += 5;
    doc.line(5, yPosition, 75, yPosition);
    yPosition += 8;


    const totalPrice = Object.entries(cart)
      .reduce((sum, [id, count]) => sum + getTotalPrice(id, count), 0)
      .toFixed(2);

    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 5, yPosition);
    doc.text(`${totalPrice}€`, 75, yPosition, { align: 'right' });

    doc.save('Recibo_de_Compra.pdf');
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
                  {getTotalPrice(id, count).toFixed(2)}€
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