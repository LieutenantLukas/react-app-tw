import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact">
      <h1>Contacto</h1>
      <p>Tem alguma sugestão de como podemos melhorar o nosso serviço ? Não hesite em mandar mensagem!!!</p>

      <form>
      <label>Nome:</label>
      <input type="text" id="nome" required ></input><br></br>
      <label>Assunto:</label>
      <input type="text" id="assunto" required></input><br></br>
      <label>Mensagem:</label>
      <input type="textarea" id="mensagem" required></input><br></br>
      <button type="submit" id="submit">Submit</button>
      </form>
      
    </div>

    
  );
};

export default Contact;