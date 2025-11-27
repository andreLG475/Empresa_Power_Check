import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Maquinas.css";
import api from '../../api/api';
import { Link } from "react-router-dom";

const Maquinas = () => {

  const [Maquinas, setMaquinas] = useState([]);

    async function atualizarDados() {
  
        const response = await api.get("/maquina");
        setMaquinas(response.data);
      };
  function excluir(id) {
    api.delete('maquina/deletar/' + id.target.id);

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
  <h1>Máquinas</h1>

  <Link to="/CadastroMaquinas" className="btn btn-cadastrar">Cadastrar nova Máquina +</Link>
</div>
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Potência</th>
                <th>Idade</th>
                <th>Status</th>
                <th>Clientes</th>
                <th>Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {Maquinas.map((Maquinas) => (
  <tr key={Maquinas.id}>
    <td>{Maquinas.id}</td>
    <td>{Maquinas.potencia} CV</td>
    <td>{Maquinas.idade_maquina} Anos</td>
    <td>{Maquinas.status}</td>
    <td>{Maquinas.nome_cliente}</td>
    <td>
      <div className="container-botoes-acao">
        <button className="btn">Editar</button>
        <button className="btn delete" onClick={excluir} id={Maquinas.id}>Excluir</button>
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

export default Maquinas;