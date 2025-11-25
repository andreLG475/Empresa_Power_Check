import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './CadastroRelatorios.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

const initialVistoria = {
  idMaquina: '',
  nomeMaquina: '', // Campo para exibir o nome da máquina (simulado)
  problemas: '',
  solucao: '',
  acoesTomadas: ''
};

export default function CadastroRelatorios() {

  const [formData, setFormData] = useState({
    idAgenda: '',
    cliente: '',
    tecnico: ''
  });
  
  const [vistorias, setVistorias] = useState([initialVistoria]);
  
  // UseEffects para buscar dados aqui...
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleVistoriaChange = (index, name, value) => {
    const novasVistorias = [...vistorias];
    novasVistorias[index] = {
        ...novasVistorias[index],
        [name]: value
    };
    // Simulação: Se o ID da máquina mudar, você faria uma chamada API para buscar o nome aqui.
    if (name === 'idMaquina') {
        // Exemplo: Simplesmente define o nome da máquina para demonstração.
        novasVistorias[index].nomeMaquina = value ? `Máquina #${value}` : '';
    }
    setVistorias(novasVistorias);
  };

  const handleAddVistoria = () => {
    setVistorias([...vistorias, initialVistoria]);
  };

  const handleRemoveVistoria = (index) => {
    const novasVistorias = vistorias.filter((_, i) => i !== index);
    setVistorias(novasVistorias);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const dataToSubmit = {
      ...formData,
      vistorias: vistorias.filter(v => v.idMaquina.trim() !== '') 
    };

    try {
      // Simulação de chamada API
      // const response = await api.post('/relatorio/adicionar', dataToSubmit);
      console.log("Dados Enviados:", dataToSubmit);
      alert("Relatório cadastrado com sucesso!");
      window.location.href = '/relatorios'; 
    } catch (error) {
      console.error("Erro ao cadastrar relatório:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
      // alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="relatorio-container">
      <div className="relatorio-content">
        
        <div className="relatorio-header">
          <h2>Cadastro de relatórios</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="relatorio-logo" />
        </div>

        <form onSubmit={handleSubmit} className="relatorio-form">
          
          <h3>Informações gerais</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="idAgenda">ID Agenda</label>
                <input type="text" id="idAgenda" name="idAgenda" required value={formData.idAgenda} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="cliente">Cliente</label>
                <input type="text" id="cliente" name="cliente" required value={formData.cliente} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="tecnico">Técnico</label>
                <input type="text" id="tecnico" name="tecnico" required value={formData.tecnico} onChange={handleChange} />
              </div>
            </div>
          </div>
          
          {vistorias.map((vistoria, index) => (
            <div key={index} className="vistoria-box">
                
                <div className="vistoria-title-row">
                    <h3>Vistoria</h3>
                    {vistorias.length > 1 && (
                        <button 
                            type="button" 
                            className="vistoria-button remove" 
                            onClick={() => handleRemoveVistoria(index)}
                        >
                            -
                        </button>
                    )}
                </div>

                {/* Linha 1: ID Máquina e Máquina com defeito */}
                <div className="vistoria-row">
                    <div className="form-group">
                        <label htmlFor={`idMaquina-${index}`}>ID do Máquina</label>
                        <input 
                            type="text" 
                            id={`idMaquina-${index}`} 
                            name="idMaquina" 
                            required 
                            value={vistoria.idMaquina} 
                            onChange={(e) => handleVistoriaChange(index, e.target.name, e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor={`nomeCliente-${index}`}>nome do Cliente</label>
                        <input 
                            type="text" 
                            id={`nomeCliente-${index}`} 
                            name="nomeCliente" 
                            disabled 
                            value={vistoria.nomeMaquina} 
                            placeholder="Nome do Cliente (Automático)" 
                        />
                    </div>
                </div>
                
                {/* Campos de Texto (Textareas) */}
                <div className="form-group">
                    <label htmlFor={`problemas-${index}`}>Problemas encontrados:</label>
                    <textarea 
                        id={`problemas-${index}`} 
                        name="problemas" 
                        rows="4" 
                        required 
                        value={vistoria.problemas} 
                        onChange={(e) => handleVistoriaChange(index, e.target.name, e.target.value)}
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label htmlFor={`solucao-${index}`}>Solução:</label>
                    <textarea 
                        id={`solucao-${index}`} 
                        name="solucao" 
                        rows="4" 
                        required 
                        value={vistoria.solucao} 
                        onChange={(e) => handleVistoriaChange(index, e.target.name, e.target.value)}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor={`acoesTomadas-${index}`}>Ações tomadas:</label>
                    <textarea 
                        id={`acoesTomadas-${index}`} 
                        name="acoesTomadas" 
                        rows="4" 
                        required 
                        value={vistoria.acoesTomadas} 
                        onChange={(e) => handleVistoriaChange(index, e.target.name, e.target.value)}
                    ></textarea>
                </div>
            </div>
          ))}

          {/* Botão de Adicionar Máquina */}
          <div className="vistoria-add-button-row">
            <span>Mais máquinas com defeitos</span>
            <button 
                type="button" 
                className="vistoria-button add" 
                onClick={handleAddVistoria}
            >
                +
            </button>
          </div>

          <button type="submit" className="submit-button">
            Cadastrar novo relatório
          </button>

        </form>
      </div>
      
      <div className="footer-wrapper">
        <Footer />
      </div>
    </div>
  );
}