import React, { useState } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './Login.css'; 
import api from '../../api/api';
import Sidebar from '../../componentes/sidebar/Sidebar';

export default function Login() {

  const [nome, mudarNome] = useState('');
  const [senha, mudarSenha] = useState('');
  const [error, mudarError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let response;
    try {
      response = await api.post('/auth/tecnico/login', {nome, senha});
      console.log(response.data);
      const {token, nome_completo} = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('nome', nome_completo);
      window.location.href='/clientes';
    } catch (err) {

      mudarError(err.response.data.message);
    }
  };

  return (
    
    <div className="login-container">
      <Sidebar></Sidebar>
      <div className="login-content">
        <img src="/src/assets/imagens/logo.png" alt="logo" className="logo" />
        <p className="login-prompt">Faça login para continuar</p>
<form onSubmit={handleSubmit} className="login-form"> {/* <--- ADICIONE ESTA CLASSE */}
  <input type="text" placeholder="Nome" required value={nome} onChange={(e) => mudarNome(e.target.value)} />
  <input type="password" placeholder="Senha" required value={senha} onChange={(e) => mudarSenha(e.target.value)} />
  <button type="submit" className="login-button">
    LOGIN
  </button>
  {error && <h3>{error}</h3>}
</form>
      </div>
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}
