import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './CadastroMaquinas.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

export default function CadastroMaquinas() {

  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id_cliente: '',
    idade_maquina: '',
    status: '',
    marca: '',
    modelo: '',
    potencia: '',
    funcao: '',
    setor: ''
  });

  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await api.get('/cliente');
        setClientes(response.data);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
        alert("Não foi possível carregar a lista de clientes.");
      }
    }
    fetchClientes();
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
      const response = await api.post('/maquina/adicionar', formData);
      console.log("Resposta do servidor:", response.data);
      alert("Máquina cadastrada com sucesso!");
      window.location.href = '/Maquinas';
    } catch (error) {
      console.error("Erro ao cadastrar máquina:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">
        
        <div className="form-header">
          <h2>Cadastro de Máquinas</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="form-logo" />
        </div>

        <form onSubmit={handleSubmit} className="form">
          
          <h3>Informações gerais</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1.5fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="id_cliente">Selecione cliente</label>
                <select id="id_cliente" name="id_cliente" required value={formData.id_cliente} onChange={handleChange}>
                  <option value="" disabled>Selecione...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="idade_maquina">Idade da máquina</label>
                <input type="text" id="idade_maquina" name="idade_maquina" required value={formData.idade_maquina} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <input type="text" id="status" name="status" required value={formData.status} onChange={handleChange} />
              </div>
            </div>
          </div>

          <h3>Características</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="marca">Marca</label>
                <input type="text" id="marca" name="marca" required value={formData.marca} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="modelo">Modelo</label>
                <input type="text" id="modelo" name="modelo" required value={formData.modelo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="potencia">Potência</label>
                <input type="text" id="potencia" name="potencia" required value={formData.potencia} onChange={handleChange} />
              </div>
            </div>
          </div>

          <h3>Locação</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="funcao">Função</label>
                <input type="text" id="funcao" name="funcao" required value={formData.funcao} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="setor">Setor</label>
                <input type="text" id="setor" name="setor" required value={formData.setor} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-button">
            Cadastrar nova Máquina
          </button>

        </form>
      </div>
      
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}