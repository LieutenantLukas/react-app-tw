import React from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/Contact.css';

const Contact = () => {
  const navigate = useNavigate();

  const handleClick = (event) => {
    event.preventDefault(); 
    const nome = document.getElementById("nome").value.trim();
    const assunto = document.getElementById("assunto").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !assunto || !mensagem) {
      alert("Por favor, preencha todos os campos antes de enviar.");
      return;
    }

    alert("Mensagem enviada com sucesso!");
    navigate("/pokemons");
  };

  return (
    <div className="contact">
      <h1>Contacto</h1>
      <p>Tem alguma sugestão de como podemos melhorar o nosso serviço? Não hesite em mandar mensagem!!!</p>

      <form>
        <label>Nome:</label>
        <input type="text" id="nome" required /><br />
        <label>Assunto:</label>
        <input type="text" id="assunto" required /><br />
        <label>Mensagem:</label>
        <textarea id="mensagem" required></textarea><br />
        <button type="submit" id="submit" onClick={handleClick}>Submit</button>
      </form>
    </div>
  );
};

export default Contact;
