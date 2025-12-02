import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Agendamentos.css";
import api from '../../api/api';
import { Link } from "react-router-dom";
import { formatData } from '../../utils/formatters';

const Agendamentos = () => {

  const [Agendamentos, setAgendamentos] = useState([]);

    async function atualizarDados() {
  
        const response = await api.get("/agendamento");
        console.log(response.data)
        setAgendamentos(response.data);
      };

  function excluir(id) {
    api.delete('agendamento/deletar/' + id.target.id);

    atualizarDados();
  }

  function editar(id) {
    localStorage.setItem('id', id.target.id);
    window.location.href = '/EditarAgendamento';
  }    

  useEffect(() => {

    atualizarDados();
  }, []);

  const handleNovoCadastro = () => {
    window.location.href='/cadastroAgendamento'
  }

  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>Agendamentos</h1>
  
  <button className="btn btn-cadastrar" onClick={handleNovoCadastro}>Cadastrar novo Agendamento +</button>
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
    <td>{formatData(Agendamentos.data)}</td>
    <td>{Agendamentos.hora}</td>
    <td>
      <div className="container-botoes-acao">
        <button className="btn" onClick={editar} id={Agendamentos.id}>Editar</button>
        <button className="btn delete" onClick={excluir} id={Agendamentos.id}>Excluir</button>
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