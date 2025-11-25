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

  useEffect(() => {

    // setMaquinas([
    //     { id: 1, Potencia: 35, Idade: 5,Status: "Funcionado",Cliente: "Tribom Alimentos" },
    //     { id: 2, Potencia: 5, Idade: 20,Status: "Funcionado",Cliente: "Mercado Fama" },
    //     { id: 3, Potencia: 10, Idade: 10,Status: "Não funcionado",Cliente: "Pavan" },
    //     { id: 4, Potencia: 35, Idade: 5,Status: "Funcionado",Cliente: "Tribom Alimentos" },
    //     { id: 5, Potencia: 5, Idade: 20,Status: "Funcionado",Cliente: "Mercado Fama" },
    //     { id: 6, Potencia: 10, Idade: 10,Status: "Não funcionado",Cliente: "Pavan" },
    //     { id: 7, Potencia: 35, Idade: 5,Status: "Funcionado",Cliente: "Tribom Alimentos" },
    //     { id: 8, Potencia: 5, Idade: 20,Status: "Funcionado",Cliente: "Mercado Fama" },
    //     { id: 9, Potencia: 10, Idade: 10,Status: "Não funcionado",Cliente: "Pavan" },
    //     { id: 10, Potencia: 35, Idade: 5,Status: "Funcionado",Cliente: "Tribom Alimentos" },
    //     { id: 11, Potencia: 5, Idade: 20,Status: "Funcionado",Cliente: "Mercado Fama" },
    //     { id: 12, Potencia: 10, Idade: 10,Status: "Não funcionado",Cliente: "Pavan" },
        
    // ]);

    atualizarDados();
  }, []);

  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>Máquinas</h1>
  
  <button className="btn btn-cadastrar">Cadastrar nova Máquina +</button>
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
    <td>{Maquinas.Potencia} CV</td>
    <td>{Maquinas.Idade} Anos</td>
    <td>{Maquinas.Status}</td>
    <td>{Maquinas.Cliente}</td>
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

export default Maquinas;