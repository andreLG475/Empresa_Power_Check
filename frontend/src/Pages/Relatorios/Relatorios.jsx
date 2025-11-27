import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Relatorios.css";
import api from "../../api/api";
import { Link } from "react-router-dom";

const Relatorios = () => {

  const [Relatorios, setRelatorios] = useState([]);

  async function atualizarDados() {
  
        const response = await api.get("/relatorio");
        setRelatorios(response.data);
      };
  function excluir(id) {
    api.delete('relatorio/deletar/' + id.target.id);

    atualizarDados();
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
  <h1>relatórios</h1>
  
  <Link to='/CadastroRelatorios' className="btn btn-cadastrar">Cadastrar novo relatório +</Link>
</div>
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Agendamento</th>
                <th>Clientes</th>
                <th>Técnico</th>
                <th>Data</th>
                <th>Hora</th>
                <th>Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {Relatorios.map((Relatorios) => (
  <tr key={Relatorios.relatorio_id}>
    <td>{Relatorios.relatorio_id}</td>
    <td>{Relatorios.agendamento_id}</td>
    <td>{Relatorios.cliente_nome}</td> 
    <td>{Relatorios.tecnico_nome}</td>
    <td>{Relatorios.data_agendamento}</td>
    <td>{Relatorios.hora_agendamento}</td>
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

export default Relatorios;