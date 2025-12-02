import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './EditarMaquina.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

export default function EditarMaquina() {

  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
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
    const getMaquina = async () => {
      try {
        const id = localStorage.getItem('id');

        if (!id) window.location.href = "/Maquinas";
        
        const maquina = await api.get(`/maquina/${id}`);
        setFormData({
          id: maquina.data.id,
          id_cliente: maquina.data.id_cliente || '',
          idade_maquina: maquina.data.idade_maquina || '',
          status: maquina.data.status || '',
          marca: maquina.data.marca || '',
          modelo: maquina.data.modelo || '',
          potencia: maquina.data.potencia || '',
          funcao: maquina.data.funcao || '',
          setor: maquina.data.setor || ''
        });
        
        // Buscar lista de clientes
        const clientesRes = await api.get('/cliente');
        setClientes(clientesRes.data);
        
        localStorage.removeItem('id');
      } catch (error) {
        console.error("Erro ao buscar máquina:", error);
        alert("Erro ao carregar dados da máquina.");
      }
    };
    getMaquina();
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
      const response = await api.put(`/maquina/editar/${formData.id}`, formData);
      console.log("Resposta do servidor:", response.data);
      alert("Máquina atualizada com sucesso!");
      window.location.href = '/Maquinas'; 
    } catch (error) {
      console.error("Erro ao atualizar máquina:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível atualizar a máquina.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-content">
        
        <div className="cadastro-header">
          <h2>Editar Máquina</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="logo-cadastro" />
        </div>

        <form onSubmit={handleSubmit} className="cadastro-form">
          
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
            Editar máquina
          </button>

        </form>
      </div>
      
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}
