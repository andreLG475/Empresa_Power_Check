import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Clientes.css";
import api from '../../api/api';
import { Link } from "react-router-dom";
import { formatCNPJ, formatTelefone } from '../../utils/formatters';

const Clientes = () => {

  const [clientes, setClientes] = useState([]);

  async function atualizarDados() {
  
    const response = await api.get("/cliente");
    setClientes(response.data);
  };

  function excluir(id) {
    api.delete('cliente/deletar/' + id.target.id);

    atualizarDados();
  }

  function editar(id) {
    localStorage.setItem('id', id.target.id);
    window.location.href = '/EditarCliente';
  }

  useEffect(() => {
atualizarDados();
    
  }, []);



  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>Clientes</h1>
  

  <Link to="/CadastroClientes" className="btn btn-cadastrar">Cadastrar novo cliente +</Link>
</div>
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
  <tr key={cliente.id}>
    <td>{cliente.id}</td>
    <td>{cliente.nome}</td>
    <td>{cliente.email}</td>
    <td>{formatTelefone(cliente.telefone)}</td>
    <td>
      <div className="container-botoes-acao">
        <button className="btn" onClick={editar} id={cliente.id}>Editar</button>
      <button className="btn delete" onClick={excluir} id={cliente.id}>Excluir</button>
      </div>
    </td>

  </tr>
              ))}
            </tbody>
          </table>
        </div> 
        <div className="footer-wrapper">
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Clientes;