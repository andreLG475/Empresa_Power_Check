import React, { useState, useEffect } from 'react';
import Footer from "../../componentes/footer/Footer"; 
import './EditarCliente.css'; 
import api from '../../api/api';
import logoPowerCheck from "/src/assets/imagens/logo.png";
import { formatCNPJ, formatTelefone, formatCEP, unformatValue } from '../../utils/formatters'; 

export default function EditarCliente() {

  const [formData, setFormData] = useState({
    id: '',
    nome: '',
    cnpj: '',
    responsavel: '',
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
          cnpj: formatCNPJ(cliente.data.cnpj) || '',
          responsavel: cliente.data.responsavel || '',
          telefone: formatTelefone(cliente.data.telefone) || '',
          email: cliente.data.email || '',
          cep: formatCEP(cliente.data.cep) || '',
          estado: cliente.data.estado || '',
          cidade: cliente.data.cidade || '',
          bairro: cliente.data.bairro || '',
          rua: cliente.data.rua || '',
          numero_estabelecimento: cliente.data.numero_estabelecimento || '',
          complemento: cliente.data.complemento || ''
        });
        
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
    let formattedValue = value;

    // Aplicar formatações específicas
    if (name === 'cnpj') {
      formattedValue = formatCNPJ(value);
    } else if (name === 'telefone') {
      formattedValue = formatTelefone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData(prevState => ({
      ...prevState,
      [name]: formattedValue
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Remover formatação antes de enviar ao servidor
      const dataToSubmit = {
        ...formData,
        cnpj: unformatValue(formData.cnpj),
        telefone: unformatValue(formData.telefone),
        cep: unformatValue(formData.cep)
      };
      const response = await api.put(`/cliente/editar/${formData.id}`, dataToSubmit);
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
                <input type="text" id="cnpj" name="cnpj" required maxLength={18} value={formData.cnpj} onChange={handleChange} />
              </div>
            </div>
            
            <div className="form-row" style={{ gridTemplateColumns: '1fr' }}>
              <div className="form-group">
                <label htmlFor="responsavel">Responsável</label>
                <input type="text" id="responsavel" name="responsavel" value={formData.responsavel} onChange={handleChange} />
              </div>
            </div>
          </div>

          <h3>Contatos</h3>
          <div className="form-section">
            <div className="form-row" style={{ gridTemplateColumns: '1fr 2fr' }}>
              <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input type="tel" id="telefone" name="telefone" required maxLength={14} value={formData.telefone} onChange={handleChange} placeholder="(xx) xxxxx-xxxx" />
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
                <input type="text" id="cep" name="cep" required maxLength={9} value={formData.cep} onChange={handleChange} placeholder="xxxxx-xxx" />
              </div>
              <div className="form-group">
                <label htmlFor="estado">Estado</label>
                <select id="estado" name="estado" required value={formData.estado} onChange={handleChange} >
                  <option value="" disabled>Selecione...</option>
                  <option value="Acre">AC</option>
                  <option value="Alagoas">AL</option>
                  <option value="Amapá">	AP</option>
                  <option value="Amazonas">	AM</option>
                  <option value="Bahia">BA</option>
                  <option value="Ceará">CE</option>
                  <option value="Distrito Federal">DF</option>
                  <option value="Espírito Santo">ES</option>
                  <option value="Goiás">GO</option>
                  <option value="Maranhão">MA</option>
                  <option value="Mato Grosso">MT</option>
                  <option value="Mato Grosso do Sul">MS</option>
                  <option value="Minas Gerais">MG</option>
                  <option value="Pará">PA</option>
                  <option value="Paraíba">PB</option>
                  <option value="Paraná">PR</option>
                  <option value="Pernambuco">PE</option>
                  <option value="Piauí">PI</option>
                  <option value="Rio de Janeiro">RJ</option>
                  <option value="Rio Grande do Norte">RN</option>
                  <option value="Rio Grande do Sul">RS</option>
                  <option value="Rondônia">RO</option>
                  <option value="Roraima">RR</option>
                  <option value="Santa Catarina">SC</option>
                  <option value="São Paulo">SP</option>
                  <option value="Sergipe">SE</option>
                  <option value="Tocantins">TO</option>
                </select>
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
