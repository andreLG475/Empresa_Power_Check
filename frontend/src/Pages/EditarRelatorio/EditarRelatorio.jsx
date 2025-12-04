import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './EditarRelatorio.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png"; 

const emptyVistoria = (maquina = null) => ({
  // armazenamos id_maquina como string no state para facilidade no select
  id_maquina: maquina ? String(maquina.id) : '',
  marca_modelo: maquina ? `${maquina.marca} ${maquina.modelo}` : '',
  vistoria: '',
  problemas_encontrados: '',
  o_que_foi_feito: ''
});

export default function EditarRelatorio() {
  const [loading, setLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null);
  const [formData, setFormData] = useState({ id: '', id_agendamento: '' });
  const [vistorias, setVistorias] = useState([]);

  // Carregar lista de agendamentos (para select)
  useEffect(() => {
    let mounted = true;
    api.get('/agendamento').then(res => {
      if (!mounted) return;
      setAgendamentos(res.data || []);
    }).catch(err => console.error(err));
    return () => { mounted = false; };
  }, []);

  // Função para carregar relatório + agendamento relacionado
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const relId = localStorage.getItem('id');
        if (!relId) {
          window.location.href = '/Relatorios';
          return;
        }

        const relRes = await api.get(`/relatorio/${relId}`);
        const rel = relRes.data;

        // normalizar formData
        setFormData({ id: String(rel.relatorio_id), id_agendamento: String(rel.agendamento_id) });

        // Agora o backend retorna tudo consolidado em rel.agendamento
        const ag = rel.agendamento;
        
        // Buscar máquinas do agendamento para o select
        const agRes = await api.get(`/agendamento/${rel.agendamento_id}`);
        setAgendamentoSelecionado(agRes.data);

        // Construir vistorias com base nos dados consolidados do backend
        const maquinas = agRes.data.maquinas || [];
        const built = (rel.vistorias || []).map(v => {
          const id_maquina_str = v.id_maquina != null ? String(v.id_maquina) : '';
          const maquina = maquinas.find(m => String(m.id) === id_maquina_str);
          return {
            id_maquina: id_maquina_str || (maquinas[0]?.id ? String(maquinas[0].id) : ''),
            marca_modelo: maquina ? `${maquina.marca} ${maquina.modelo}` : (v.marca_modelo || ''),
            vistoria: v.vistoria || '',
            problemas_encontrados: v.problemas_encontrados || '',
            o_que_foi_feito: v.o_que_foi_feito || ''
          };
        });

        // Se não havia vistorias no backend, inicializar com as máquinas do agendamento
        if (built.length === 0 && maquinas.length > 0) {
          setVistorias(maquinas.map(m => emptyVistoria(m)));
        } else {
          setVistorias(built);
        }

        // limpar localStorage id (mesma lógica anterior)
        localStorage.removeItem('id');
      } catch (err) {
        console.error('Erro ao carregar relatório/agendamento', err);
        alert(err.response?.data?.message || 'Erro ao carregar relatório');
        window.location.href = '/Relatorios';
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Quando o usuário muda o agendamento no select, carregar máquinas e ajustar vistorias padrão
  useEffect(() => {
    if (!formData.id_agendamento) {
      setAgendamentoSelecionado(null);
      setVistorias([]);
      return;
    }

    const fetchAg = async () => {
      try {
        const res = await api.get(`/agendamento/${formData.id_agendamento}`);
        setAgendamentoSelecionado(res.data);

        // Se não houver vistorias (ou todas vazias), inicializar a partir das máquinas
        const hasNonEmpty = vistorias.some(v => (v.vistoria || '').trim() !== '');
        if (!hasNonEmpty) {
          setVistorias((res.data.maquinas || []).map(m => emptyVistoria(m)));
        }
      } catch (err) {
        console.error('Erro ao buscar agendamento', err);
      }
    };
    fetchAg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.id_agendamento]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVistoriaField = (index, field, value) => {
    setVistorias(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      // se trocou id_maquina, atualizar marca_modelo
      if (field === 'id_maquina' && agendamentoSelecionado) {
        const maquina = agendamentoSelecionado.maquinas?.find(m => String(m.id) === String(value));
        copy[index].marca_modelo = maquina ? `${maquina.marca} ${maquina.modelo}` : '';
      }
      return copy;
    });
  };

  const addVistoria = () => {
    // tentar escolher primeira máquina não usada
    let maquina = null;
    if (agendamentoSelecionado?.maquinas?.length) {
      const usadas = new Set(vistorias.map(v => String(v.id_maquina)));
      maquina = agendamentoSelecionado.maquinas.find(m => !usadas.has(String(m.id))) || agendamentoSelecionado.maquinas[0];
    }
    setVistorias(prev => [...prev, emptyVistoria(maquina)]);
  };

  const removeVistoria = (index) => {
    setVistorias(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id_agendamento) {
      alert('Selecione um agendamento.');
      return;
    }

    const vistoriasValidas = vistorias.filter(v => (v.vistoria || '').trim() !== '');
    if (vistoriasValidas.length === 0) {
      alert('Preencha a vistoria de pelo menos uma máquina.');
      return;
    }

    // validar id_maquina
    const invalid = vistoriasValidas.some(v => !v.id_maquina || Number.isNaN(Number(v.id_maquina)));
    if (invalid) {
      alert('Selecione a máquina para todas as vistorias antes de salvar.');
      return;
    }

    const payload = { 
      id_agendamento: parseInt(formData.id_agendamento, 10),
      vistorias: vistoriasValidas.map(v => ({
        // backend espera id_maquina como número
        id_maquina: parseInt(v.id_maquina, 10),
        vistoria: v.vistoria,
        problemas_encontrados: v.problemas_encontrados,
        o_que_foi_feito: v.o_que_foi_feito
      })) 
    };

    try {
      await api.put(`/relatorio/editar/${formData.id}`, payload);
      alert('Relatório atualizado com sucesso!');
      window.location.href = '/Relatorios';
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Erro ao atualizar relatório');
    }
  };

  if (loading) {
    return <div className="relatorio-container"><div className="relatorio-content">Carregando...</div></div>;
  }

  function dataHora(data) {
    // 1223-12-12T03:06:28.000Z
    let dataNova = data;
    const [year, month, day] = dataNova.split('T')[0].split('-');
    const [hour, minute, second] = dataNova.split('T')[1].split(':')
    dataNova = `${day}/${month}/${year} - ${hour}:${minute}:${second.split('.')[0]}`;
    console.log(dataNova)
    return dataNova;
  }

  return (
    <div className="relatorio-container">
      <div className="relatorio-content">
        <div className="relatorio-header">
          <h2>Editar Relatório</h2>
          <img src={logoPowerCheck} alt="Power Check Logo" className="relatorio-logo" />
        </div>

        <form onSubmit={handleSubmit} className="relatorio-form">
          <h3>Informações gerais</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
              <div className="form-group">
                <label htmlFor="id_agendamento">Agendamento</label>
                <select id="id_agendamento" name="id_agendamento" required value={formData.id_agendamento} onChange={handleFormChange}>
                  <option value="" disabled>Selecione um agendamento...</option>
                  {agendamentos.map(a => (
                    <option key={a.id} value={String(a.id)}>#{a.id} - {a.cliente_nome} ({dataHora(a.data)})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Cliente</label>
                <input type="text" disabled value={agendamentoSelecionado?.cliente_nome || ''} />
              </div>

              <div className="form-group">
                <label>Técnico</label>
                <input type="text" disabled value={agendamentoSelecionado?.tecnico_nome || ''} />
              </div>
            </div>
          </div>

          {vistorias.length === 0 ? (
            <div className="no-vistorias">
              <p>Nenhuma vistoria encontrada para este agendamento.</p>
              <button type="button" className="vistoria-button add" onClick={addVistoria}>Adicionar vistoria</button>
            </div>
          ) : (
            vistorias.map((v, i) => (
              <div key={i} className="vistoria-box">
                <div className="vistoria-title-row">
                  <h3>Vistoria - {v.marca_modelo || 'Máquina'}</h3>
                  {vistorias.length > 1 && (
                    <button type="button" className="vistoria-button remove" onClick={() => removeVistoria(i)}>-</button>
                  )}
                </div>

                <div className="vistoria-row">
                  <div className="form-group">
                    <label htmlFor={`id_maquina-${i}`}>Máquina</label>
                    {agendamentoSelecionado?.maquinas ? (
                      <select id={`id_maquina-${i}`} value={v.id_maquina} onChange={(e) => handleVistoriaField(i, 'id_maquina', e.target.value)}>
                        <option value="" disabled>Selecione uma máquina...</option>
                        {agendamentoSelecionado.maquinas.map(m => (
                          <option key={m.id} value={String(m.id)}>#{m.id} - {m.marca} {m.modelo}</option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" disabled value={v.id_maquina} />
                    )}
                  </div>

                  <div className="form-group">
                    <label>Marca/Modelo</label>
                    <input type="text" disabled value={v.marca_modelo} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Vistoria</label>
                  <textarea rows={4} required value={v.vistoria} onChange={(e) => handleVistoriaField(i, 'vistoria', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Problemas encontrados</label>
                  <textarea rows={4} value={v.problemas_encontrados} onChange={(e) => handleVistoriaField(i, 'problemas_encontrados', e.target.value)} />
                </div>

                <div className="form-group">
                  <label>O que foi feito</label>
                  <textarea rows={4} value={v.o_que_foi_feito} onChange={(e) => handleVistoriaField(i, 'o_que_foi_feito', e.target.value)} />
                </div>
              </div>
            ))
          )}

          <div className="vistoria-add-button-row">
            <span>Mais máquinas com defeitos</span>
            <button type="button" className="vistoria-button add" onClick={addVistoria}>+</button>
          </div>

          <button type="submit" className="submit-button">Editar relatório</button>
        </form>
      </div>

      <div className="footer-wrapper"><Footer /></div>
    </div>
  );
}