import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ThankYouPage.css';

const ThankYouPage = () => {
  return (
    <div className="thank-you">
      <h1>Obrigado pela sua compra!</h1>
      <p>Esperamos vê-lo novamente em breve! Se tiver alguma dúvida, não hesite em contactar-nos.</p>
      <Link to="/pokemons" className="back-to-home">
        Voltar para o início
      </Link>
    </div>
  );
};

export default ThankYouPage;
