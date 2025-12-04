import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './EditarAgendamento.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

export default function EditarAgendamento() {

  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [todasAsMaquinas, setTodasAsMaquinas] = useState([]);
  const [maquinas, setMaquinas] = useState([]);

  const [formData, setFormData] = useState({
    id: '',
    id_cliente: '',
    id_tecnico: '',
    data: '',
    hora: ''
  });

  const [maquinasSelecionadas, setMaquinasSelecionadas] = useState(['']);

  useEffect(() => {
    const getAgendamento = async () => {
      try {
        const id = localStorage.getItem('id');

        if (!id) window.location.href = "/Agendamentos";
        
        const agendamento = await api.get(`/agendamento/${id}`);
        
        
        let dataFormatada = '';
        if (agendamento.data.data) {
          const dataObj = new Date(agendamento.data.data);
          if (!isNaN(dataObj.getTime())) {
            dataFormatada = dataObj.toISOString().split('T')[0];
          } else {
            // Se já vier no formato correto
            dataFormatada = agendamento.data.data.split('T')[0];
          }
        }
        
        
        let horaFormatada = agendamento.data.hora || '';
        if (horaFormatada && horaFormatada.length > 5) {
          horaFormatada = horaFormatada.substring(0, 5);
        }
        
        setFormData({
          id: agendamento.data.id.toString(),
          id_cliente: agendamento.data.id_cliente?.toString() || '',
          id_tecnico: agendamento.data.id_tecnico?.toString() || '',
          data: dataFormatada,
          hora: horaFormatada
        });

        // Preencher máquinas selecionadas
        if (agendamento.data.maquinas && agendamento.data.maquinas.length > 0) {
          setMaquinasSelecionadas(agendamento.data.maquinas.map(m => m.id.toString()));
        }
        
        // Buscar listas
        const [clientesRes, tecnicosRes, maquinasRes] = await Promise.all([
          api.get('/cliente'),
          api.get('/tecnico'),
          api.get('/maquina')
        ]);

        setClientes(clientesRes.data);
        setTecnicos(tecnicosRes.data);
        setTodasAsMaquinas(maquinasRes.data);
        
        // Filtrar máquinas do cliente selecionado
        const idClienteSelecionado = agendamento.data.id_cliente;
        const maquinasDoCliente = maquinasRes.data.filter(maq => maq.id_cliente === idClienteSelecionado);
        setMaquinas(maquinasDoCliente);
        
        localStorage.removeItem('id');
      } catch (error) {
        console.error("Erro ao buscar agendamento:", error);
        alert("Erro ao carregar dados do agendamento.");
      }
    };
    getAgendamento();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Filtrar máquinas quando cliente for alterado
    if (name === 'id_cliente') {
      const maquinasDoCliente = todasAsMaquinas.filter(maq => maq.id_cliente === parseInt(value));
      setMaquinas(maquinasDoCliente);
      // Limpar máquinas selecionadas quando cliente mudar
      setMaquinasSelecionadas(['']);
    }
  };

  const handleMaquinaChange = (index, value) => {
    const novasMaquinas = [...maquinasSelecionadas];
    novasMaquinas[index] = value;
    setMaquinasSelecionadas(novasMaquinas);
  };

  const handleAddMaquina = () => {
    setMaquinasSelecionadas([...maquinasSelecionadas, '']);
  };

  const handleRemoveMaquina = (index) => {
    const novasMaquinas = maquinasSelecionadas.filter((_, i) => i !== index);
    setMaquinasSelecionadas(novasMaquinas);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const maquinasValidas = maquinasSelecionadas
      .filter(m => m !== '' && m !== null)
      .map(m => parseInt(m));

    if (maquinasValidas.length === 0) {
      alert("Por favor, selecione pelo menos uma máquina.");
      return;
    }

    try {
      // Atualizar o agendamento com dados básicos E máquinas
      await api.put(`/agendamento/editar/${formData.id}`, {
        data: formData.data,
        hora: formData.hora,
        id_cliente: parseInt(formData.id_cliente),
        id_tecnico: parseInt(formData.id_tecnico),
        maquinas: maquinasValidas
      });
      
      alert("Agendamento atualizado com sucesso!");
      window.location.href = '/Agendamentos';

    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível atualizar o agendamento.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  return (
    <div className="form-container">
      <div className="form-content">

        <div className="form-header">
          <h2>Editar Agendamento</h2>
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

            {maquinasSelecionadas.map((maquinaId, index) => (
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

                {maquinasSelecionadas.length > 1 && (
                  <button 
                    type="button" 
                    className="maquina-button remove" 
                    onClick={() => handleRemoveMaquina(index)}
                  >
                    -
                  </button>
                )}

                {index === maquinasSelecionadas.length - 1 && (
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
            Editar agendamento
          </button>

        </form>

      </div>

      <div className="footer-wrapper">
        <Footer />
      </div>

    </div>
  );
}
