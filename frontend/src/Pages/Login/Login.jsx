import React, { useState } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './Login.css'; 
import axios from "axios";
import { Navigate } from 'react-router-dom';

export default function Login() {

  const [nome, mudarNome] = useState('');
  const [senha, mudarSenha] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post('http://localhost:5000/api/auth/tecnico/login', {nome, senha});
    const token = response.data.token;
    localStorage.setItem('token', token);
    window.location.href='/clientes'
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <img src="/src/assets/imagens/logo.png" alt="logo" className="logo" />
        <p className="login-prompt">Faça login para continuar</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nome" required value={nome} onChange={(e) => mudarNome(e.target.value)} />
          <input type="password" placeholder="Senha" required value={senha} onChange={(e) => mudarSenha(e.target.value)} />
          <button type="submit" className="login-button">
            LOGIN
          </button>
        </form>
      </div>
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}
