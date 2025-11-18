import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Clientes.css";

const Clientes = () => {

  const [clientes, setClientes] = useState([]);

  useEffect(() => {

    setClientes([
      { id: 1, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999" },
      { id: 2, nome: "Maria Souza", email: "maria@email.com", telefone: "(11) 98888-8888" },
      { id: 3, nome: "Carlos Oliveira", email: "carlos@email.com", telefone: "(11) 97777-7777" },
      { id: 4, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999" },
      { id: 5, nome: "Maria Souza", email: "maria@email.com", telefone: "(11) 98888-8888" },
      { id: 6, nome: "Carlos Oliveira", email: "carlos@email.com", telefone: "(11) 97777-7777" },
      { id: 7, nome: "João Silva", email: "joao@email.com", telefone: "(11) 99999-9999" },
      { id: 8, nome: "Maria Souza", email: "maria@email.com", telefone: "(11) 98888-8888" },
      { id: 9, nome: "Carlos Oliveira", email: "carlos@email.com", telefone: "(11) 97777-7777" },
    ]);
  }, []);

  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>Clientes</h1>
  

  <button className="btn btn-cadastrar">Cadastrar novo cliente +</button>
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
    <td>{cliente.telefone}</td>
    <td>
      <div className="container-botoes-acao">
        <button className="btn">Editar</button>
        <button className="btn delete">Excluir</button>
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