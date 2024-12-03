import React from 'react';
import '../styles/Contact.css';

const Contact = () => {
  return (
    <div className="contact">
      <h1>Contacto</h1>
      <p>Entre ai em contacto mano bro</p>

      <form>
      <label>Nome:</label>
      <input type="text" id="nome" required ></input><br></br>
      <label>Assunto:</label>
      <input type="text" id="assunto" required></input><br></br>
      <label>Mensagem:</label>
      <input type="textarea" id="mensagem" required></input><br></br>
      <button type='submit'>Submit</button>
      </form>
      
    </div>

    
  );
};

export default Contact;