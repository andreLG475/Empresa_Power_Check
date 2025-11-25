import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Agendamentos.css";
import api from '../../api/api';
import { Link } from "react-router-dom";

const Agendamentos = () => {

  const [Agendamentos, setAgendamentos] = useState([]);

    async function atualizarDados() {
  
        const response = await api.get("/agendamento");
        console.log(response.data)
        setAgendamentos(response.data);
      };

  useEffect(() => {

    atualizarDados();
  }, []);

  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>Agendamentos</h1>
  
  <button className="btn btn-cadastrar">Cadastrar novo Agendamento +</button>
</div>
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Clientes</th>
                <th>Técnico</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {Agendamentos.map((Agendamentos) => (
  <tr key={Agendamentos.id}>
    <td>{Agendamentos.id}</td>
    <td>{Agendamentos.cliente_nome}</td>
    <td>{Agendamentos.tecnico_nome}</td>
    <td>{Agendamentos.data}</td>
    <td>{Agendamentos.hora}</td>
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

export default Agendamentos;