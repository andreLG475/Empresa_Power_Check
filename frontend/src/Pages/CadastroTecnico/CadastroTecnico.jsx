import React, { useState } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './CadastroTecnico.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

export default function CadastroTecnico() {

  const [formData, setFormData] = useState({
    nome_completo: '',
    cpf: '',
    funcao: '',
    senha: '',
    confirmeSenha: '',
    telefone: '',
    email: '',
    cep: '',
    estado: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero_estabelecimento: '',
    complemento: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.senha !== formData.confirmeSenha) {
      alert("As senhas não coincidem!");
      return;
    }
    // eslint-disable-next-line no-unused-vars
    const { confirmeSenha, ...dataToSubmit } = formData;
    try {
      const response = await api.post('/auth/tecnico/register', dataToSubmit);
      console.log("Resposta do servidor:", response.data);
      alert("Técnico cadastrado com sucesso!");
      window.location.href = '/login'; 
    } catch (error) {
      console.error("Erro ao cadastrar técnico:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        
        <div className="cadastro-header">
          <h2>Cadastro de Técnicos</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="logo-cadastro" />
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          
          <h3>Informações gerais</h3>
          <div className="form-section">
            {/* Linha 1: Nome e CPF */}
            <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="nome_completo">Nome completo</label>
                <input type="text" id="nome_completo" name="nome_completo" required value={formData.nome_completo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input type="text" id="cpf" name="cpf" required value={formData.cpf} minLength={11} maxLength={11} onChange={handleChange} />
              </div>
            </div>
            
            {/* Linha 2: Função, Senha, Confirmação */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="funcao">Função</label>
                <select id="funcao" name="funcao" required value={formData.funcao} onChange={handleChange}>
                  <option value="" disabled>Selecione...</option>
                  <option value="tecnico">Mecânico</option>
                  <option value="eletricista">Eletricista</option>
                  <option value="auxiliar">Auxiliar</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" required value={formData.senha} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="confirmeSenha">Confirme a senha</label>
                <input type="password" id="confirmeSenha" name="confirmeSenha" required value={formData.confirmeSenha} onChange={handleChange} />
              </div>
            </div>
          </div>

          <h3>Contatos</h3>
          <div className="form-section">
            {/* Linha 3: Telefone e Email - Proporção AJUSTADA */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" required value={formData.telefone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
              </div>
            </div>
          </div>

          <h3>Endereço</h3>
          <div className="form-section">
            {/* Linha 4: CEP, Estado, Cidade */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="cep">CEP</label>
                <input type="text" id="cep" name="cep" required value={formData.cep} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <input type="text" id="estado" name="estado" required value={formData.estado} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cidade">Cidade</label>
                <input type="text" id="cidade" name="cidade" required value={formData.cidade} onChange={handleChange} />
              </div>
            </div>
            {/* Linha 5: Bairro, Rua, Número */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="bairro">Bairro</label>
                <input type="text" id="bairro" name="bairro" required value={formData.bairro} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="rua">Rua</label>
                <input type="text" id="rua" name="rua" required value={formData.rua} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="numero_estabelecimento">Número do estabelecimento</label>
                <input type="text" id="numero_estabelecimento" name="numero_estabelecimento" required value={formData.numero_estabelecimento} onChange={handleChange} />
              </div>
            </div>
            {/* Linha 6: Complemento */}
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="complemento">Complemento</label>
                <input type="text" id="complemento" name="complemento" value={formData.complemento} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Cadastrar novo técnico
          </button>

        </form>
      </div>
      
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}