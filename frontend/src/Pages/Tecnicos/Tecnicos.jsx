import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Tecnicos.css";
import api from '../../api/api';
import { Link } from "react-router-dom";

const Tecnicos = () => {

  const [Tecnicos, setTecnicos] = useState([]);

    async function atualizarDados() {
  
        const response = await api.get("/tecnico");
        console.log(response.data)
        setTecnicos(response.data);
      };

  function excluir(id) {
    api.delete('Tecnicos/deletar/' + id.target.id);

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
  <h1>Tecnicos</h1>
  
<Link to="/CadastroTecnico" className="btn btn-cadastrar">Cadastrar novo técnico +</Link>


</div>
          <table className="tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>CEP</th>
                <th>Função</th>
                <th>Telefone</th>
                <th>Detalhes</th>
              </tr>
            </thead>

            <tbody>
              {Tecnicos.map((Tecnicos) => (
  <tr key={Tecnicos.id}>
    <td>{Tecnicos.id}</td>
    <td>{Tecnicos.nome_completo}</td>
    <td>{Tecnicos.cep}</td>
    <td>{Tecnicos.funcao}</td>
    <td>{Tecnicos.telefone}</td>
    <td>
      <div className="container-botoes-acao">
        <button className="btn">Editar</button>
        <button className="btn delete" onClick={excluir} id={Tecnicos.id}>Excluir</button>
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

export default Tecnicos;