import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './CadastroAgendamento.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

export default function CadastroAgendamento() {

  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [maquinas, setMaquinas] = useState([]);

  const [formData, setFormData] = useState({
    id_cliente: '',
    id_tecnico: '',
    data: '',
    hora: ''
  });

  const [maquinasComDefeito, setMaquinasComDefeito] = useState(['']);

  useEffect(() => {
    async function fetchData() {
      try {
        const [clientesRes, tecnicosRes, maquinasRes] = await Promise.all([
          api.get('/cliente'),
          api.get('/tecnico'),
          api.get('/maquina')
        ]);

        setClientes(clientesRes.data);
        setTecnicos(tecnicosRes.data);
        setMaquinas(maquinasRes.data);

      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        alert("Não foi possível carregar clientes, técnicos e máquinas.");
      }
    }
    
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleMaquinaChange = (index, value) => {
    const novasMaquinas = [...maquinasComDefeito];
    novasMaquinas[index] = value;
    setMaquinasComDefeito(novasMaquinas);
  };

  const handleAddMaquina = () => {
    setMaquinasComDefeito([...maquinasComDefeito, '']);
  };

  const handleRemoveMaquina = (index) => {
    const novasMaquinas = maquinasComDefeito.filter((_, i) => i !== index);
    setMaquinasComDefeito(novasMaquinas);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const maquinasValidas = maquinasComDefeito
      .filter(m => m !== '' && m !== null)
      .map(m => parseInt(m));

    if (maquinasValidas.length === 0) {
      alert("Por favor, selecione pelo menos uma máquina.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      maquinas: maquinasValidas
    };

    try {
      const response = await api.post('/agendamento/adicionar', dataToSubmit);
      console.log("Resposta do servidor:", response.data);
      alert("Agendamento cadastrado com sucesso!");
      window.location.href = '/Agendamentos';

    } catch (error) {
      console.error("Erro ao cadastrar agendamento:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">

        <div className="form-header">
          <h2>Cadastrar Agendamento</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="form-logo" />
        </div>

        <form onSubmit={handleSubmit} className="form">

          <h3>Informações gerais</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>

              <div className="form-group">
                <label htmlFor="id_cliente">Cliente</label>
                <select 
                  id="id_cliente" 
                  name="id_cliente" 
                  required 
                  value={formData.id_cliente} 
                  onChange={handleChange}
                >
                  <option value="" disabled>Selecione um cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="id_tecnico">Técnico</label>
                <select 
                  id="id_tecnico" 
                  name="id_tecnico" 
                  required 
                  value={formData.id_tecnico} 
                  onChange={handleChange}
                >
                  <option value="" disabled>Selecione um técnico...</option>
                  {tecnicos.map(tecnico => (
                    <option key={tecnico.id} value={tecnico.id}>
                      {tecnico.nome_completo}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          <h3>Horário</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>

              <div className="form-group">
                <label htmlFor="data">Data</label>
                <input 
                  type="date" 
                  id="data" 
                  name="data" 
                  required 
                  value={formData.data} 
                  onChange={handleChange} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="hora">Hora</label>
                <input 
                  type="time" 
                  id="hora" 
                  name="hora" 
                  step="1" 
                  required 
                  value={formData.hora} 
                  onChange={handleChange} 
                />
              </div>

            </div>
          </div>

          <h3>Máquinas com defeito</h3>
          <div className="form-section">

            {maquinasComDefeito.map((maquinaId, index) => (
              <div key={index} className="maquina-input-row">

                <div className="form-group">
                  <label htmlFor={`maquina-${index}`}>Selecionar máquina</label>

                  <select
                    id={`maquina-${index}`}
                    value={maquinaId}
                    onChange={(e) => handleMaquinaChange(index, e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecione a máquina...</option>

                    {maquinas.map(maquina => (
                      <option key={maquina.id} value={maquina.id}>
                        {`ID: ${maquina.id} — ${maquina.nome || maquina.modelo || "Máquina"}`}
                      </option>
                    ))}

                  </select>
                </div>

                {maquinasComDefeito.length > 1 && (
                  <button 
                    type="button" 
                    className="maquina-button remove" 
                    onClick={() => handleRemoveMaquina(index)}
                  >
                    -
                  </button>
                )}

                {index === maquinasComDefeito.length - 1 && (
                  <button 
                    type="button" 
                    className="maquina-button add" 
                    onClick={handleAddMaquina}
                  >
                    +
                  </button>
                )}

              </div>
            ))}

          </div>

          <button type="submit" className="submit-button">
            Cadastrar novo agendamento
          </button>

        </form>

      </div>

      <div className="footer-wrapper">
        <Footer />
      </div>

    </div>
  );
}
