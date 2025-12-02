import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './EditarCliente.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

export default function EditarCliente() {

  const [tecnicos, setTecnicos] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    cnpj: '',
    id_tecnico_responsavel: '',
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

  useEffect(() => {
    const getCliente = async () => {
      try {
        const id = localStorage.getItem('id');

        if (!id) window.location.href = "/clientes";
        
        const cliente = await api.get(`/cliente/${id}`);
        setFormData({
          id: cliente.data.id,
          nome: cliente.data.nome || '',
          cnpj: cliente.data.cnpj || '',
          id_tecnico_responsavel: cliente.data.id_tecnico_responsavel || '',
          telefone: cliente.data.telefone || '',
          email: cliente.data.email || '',
          cep: cliente.data.cep || '',
          estado: cliente.data.estado || '',
          cidade: cliente.data.cidade || '',
          bairro: cliente.data.bairro || '',
          rua: cliente.data.rua || '',
          numero_estabelecimento: cliente.data.numero_estabelecimento || '',
          complemento: cliente.data.complemento || ''
        });
        
        // Buscar lista de técnicos
        const tecnicosRes = await api.get('/tecnico');
        setTecnicos(tecnicosRes.data);
        
        localStorage.removeItem('id');
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        alert("Erro ao carregar dados do cliente.");
      }
    };
    getCliente();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await api.put(`/cliente/editar/${formData.id}`, formData);
      console.log("Resposta do servidor:", response.data);
      alert("Cliente atualizado com sucesso!");
      window.location.href = '/clientes'; 
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível atualizar o cliente.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        
        <div className="cadastro-header">
          <h2>Editar Cliente</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="logo-cadastro" />
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          
          <h3>Informações gerais</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" required value={formData.nome} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cnpj">CNPJ</label>
                <input type="text" id="cnpj" name="cnpj" required minLength={14} maxLength={14} value={formData.cnpj} onChange={handleChange} />
              </div>
            </div>
            
            <div className="form-row" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label htmlFor="id_tecnico_responsavel">Técnico Responsável</label>
                <select id="id_tecnico_responsavel" name="id_tecnico_responsavel" value={formData.id_tecnico_responsavel || ''} onChange={handleChange}>
                  <option value="">Selecione um técnico...</option>
                  {tecnicos.map(tecnico => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnico.nome_completo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <h3>Contatos</h3>
          <div className="form-section">
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
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="complemento">Complemento</label>
                <input type="text" id="complemento" name="complemento" value={formData.complemento || ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Editar cliente
          </button>

        </form>
      </div>
      
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}
