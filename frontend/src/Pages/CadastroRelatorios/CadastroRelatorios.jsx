import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './CadastroRelatorios.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

const initialVistoria = {
  id_maquina: '',
  marca_modelo: '',
  vistoria: '',
  problemas_encontrados: '',
  o_que_foi_feito: ''
};

export default function CadastroRelatorios() {

  const [agendamentos, setAgendamentos] = useState([]);
  const [maquinasAgendamento, setMaquinasAgendamento] = useState([]);
  const [todasAsMaquinas, setTodasAsMaquinas] = useState([]);
  
  const [formData, setFormData] = useState({
    id_agendamento: ''
  });
  
  const [vistorias, setVistorias] = useState([initialVistoria]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);

  useEffect(() => {
    async function fetchAgendamentos() {
      try {
        const response = await api.get('/agendamento');
        setAgendamentos(response.data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        alert("Não foi possível carregar agendamentos.");
      }
    }
    fetchAgendamentos();
  }, []);

  useEffect(() => {
    async function fetchTodasAsMaquinas() {
      try {
        const response = await api.get('/maquina');
        setTodasAsMaquinas(response.data);
      } catch (error) {
        console.error("Erro ao buscar máquinas:", error);
      }
    }
    fetchTodasAsMaquinas();
  }, []);

  useEffect(() => {
    async function fetchMaquinasAgendamento() {
      if (!formData.id_agendamento) {
        setMaquinasAgendamento([]);
        setAgendamentoSelecionado(null);
        return;
      }
      
      try {
        const response = await api.get(`/agendamento/${formData.id_agendamento}`);
        setAgendamentoSelecionado(response.data);
        
        // Filtrar máquinas apenas do cliente do agendamento
        const maquinasDoCliente = todasAsMaquinas.filter(
          maq => maq.id_cliente === response.data.id_cliente
        );
        setMaquinasAgendamento(maquinasDoCliente);
        
        // Preencher automaticamente as vistorias com as máquinas do agendamento
        const novasVistorias = response.data.maquinas.map(maquina => ({
          id_maquina: maquina.id,
          marca_modelo: `${maquina.marca} ${maquina.modelo}`,
          vistoria: '',
          problemas_encontrados: '',
          o_que_foi_feito: ''
        }));
        setVistorias(novasVistorias);
      } catch (error) {
        console.error("Erro ao buscar máquinas do agendamento:", error);
        alert("Não foi possível carregar as máquinas do agendamento.");
      }
    }
    fetchMaquinasAgendamento();
  }, [formData.id_agendamento, todasAsMaquinas]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleVistoriaChange = (index, field, value) => {
    const novasVistorias = [...vistorias];
    novasVistorias[index] = {
      ...novasVistorias[index],
      [field]: value
    };
    setVistorias(novasVistorias);
  };

  const handleAddVistoria = () => {
    setVistorias([...vistorias, { ...initialVistoria }]);
  };

  const handleRemoveVistoria = (index) => {
    const novasVistorias = vistorias.filter((_, i) => i !== index);
    setVistorias(novasVistorias);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!formData.id_agendamento) {
      alert("Por favor, selecione um agendamento!");
      return;
    }

    // Filtrar vistorias vazias
    const vistoriasValidas = vistorias.filter(v => v.vistoria.trim() !== '');

    if (vistoriasValidas.length === 0) {
      alert("Por favor, preencha a vistoria de pelo menos uma máquina!");
      return;
    }

    const dataToSubmit = {
      id_agendamento: parseInt(formData.id_agendamento),
      vistorias: vistoriasValidas
    };

    try {
      const response = await api.post('/relatorio/adicionar', dataToSubmit);
      
      alert("Relatório cadastrado com sucesso!");
      window.location.href = '/relatorios'; 
    } catch (error) {
      console.error("Erro ao cadastrar relatório:", error);
      const errorMsg = error.response?.data?.message || "Não foi possível realizar o cadastro.";
      alert(`Erro: ${errorMsg}`);
    }
  };

  function dataHora(data) {
    // 1223-12-12T03:06:28.000Z
    let dataNova = data;
    const [year, month, day] = dataNova.split('T')[0].split('-');
    const [hour, minute, second] = dataNova.split('T')[1].split(':')
    dataNova = `${day}/${month}/${year} - ${hour}:${minute}:${second.split('.')[0]}`;
    return dataNova;
  }

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
                <label htmlFor="id_agendamento">Agendamento</label>
                <select id="id_agendamento" name="id_agendamento" required value={formData.id_agendamento} onChange={handleChange}>
                  <option value="" disabled>Selecione um agendamento...</option>
                  {agendamentos.map(agendamento => (
                    <option key={agendamento.id} value={agendamento.id}>
                      #{agendamento.id} - {agendamento.cliente_nome} ({dataHora(agendamento.data)})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="cliente">Cliente</label>
                <input type="text" id="cliente" name="cliente" disabled value={agendamentoSelecionado?.cliente_nome || ''} />
              </div>
              <div className="form-group">
                <label htmlFor="tecnico">Técnico</label>
                <input type="text" id="tecnico" name="tecnico" disabled value={agendamentoSelecionado?.tecnico_nome || ''} />
              </div>
            </div>
          </div>
          
          {vistorias.map((vistoria, index) => (
            <div key={index} className="vistoria-box">
                
                <div className="vistoria-title-row">
                    <h3>Vistoria - {vistoria.marca_modelo || 'Máquina'}</h3>
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

                {/* Linha 1: ID Máquina e Marca/Modelo */}
                <div className="vistoria-row">
                    <div className="form-group">
                        <label htmlFor={`id_maquina-${index}`}>Máquina</label>
                        <select
                            id={`id_maquina-${index}`}
                            value={String(vistoria.id_maquina)}
                            onChange={(e) => {
                              const maqId = e.target.value;
                              const maquina = maquinasAgendamento.find(m => String(m.id) === maqId);
                              handleVistoriaChange(index, 'id_maquina', parseInt(maqId));
                              if (maquina) {
                                handleVistoriaChange(index, 'marca_modelo', `${maquina.marca} ${maquina.modelo}`);
                              }
                            }}
                            required
                        >
                            <option value="">Selecione uma máquina...</option>
                            {maquinasAgendamento.map(maq => (
                              <option key={maq.id} value={String(maq.id)}>
                                #{maq.id} - {maq.marca} {maq.modelo}
                              </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor={`marca_modelo-${index}`}>Marca/Modelo</label>
                        <input 
                            type="text" 
                            id={`marca_modelo-${index}`} 
                            name="marca_modelo" 
                            disabled 
                            value={vistoria.marca_modelo} 
                        />
                    </div>
                </div>
                
                {/* Campos de Texto (Textareas) */}
                <div className="form-group">
                    <label htmlFor={`vistoria-${index}`}>Vistoria:</label>
                    <textarea 
                        id={`vistoria-${index}`} 
                        name="vistoria" 
                        rows="4" 
                        required 
                        value={vistoria.vistoria} 
                        onChange={(e) => handleVistoriaChange(index, 'vistoria', e.target.value)}
                    ></textarea>
                </div>
                
                <div className="form-group">
                    <label htmlFor={`problemas_encontrados-${index}`}>Problemas encontrados:</label>
                    <textarea 
                        id={`problemas_encontrados-${index}`} 
                        name="problemas_encontrados" 
                        rows="4" 
                        value={vistoria.problemas_encontrados} 
                        onChange={(e) => handleVistoriaChange(index, 'problemas_encontrados', e.target.value)}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor={`o_que_foi_feito-${index}`}>O que foi feito:</label>
                    <textarea 
                        id={`o_que_foi_feito-${index}`} 
                        name="o_que_foi_feito" 
                        rows="4" 
                        value={vistoria.o_que_foi_feito} 
                        onChange={(e) => handleVistoriaChange(index, 'o_que_foi_feito', e.target.value)}
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