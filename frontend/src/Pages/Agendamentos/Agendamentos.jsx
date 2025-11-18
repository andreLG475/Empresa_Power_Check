import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Agendamentos.css";

const Agendamentos = () => {

  const [Agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {

    setAgendamentos([
        { id: 1, Clientes: "Tribom Alimentos", Tecnico: "João Silva",Data: "11/09/25",Hora: "13:00" },
        { id: 2, Clientes: "Mercado Fama", Tecnico: "Maria Souza",Data: "14/11/25",Hora: "10:40" },
        { id: 3, Clientes: "Pavan", Tecnico:  "Carlos Oliveira",Data: "26/05/26 ",Hora: "07:20" },
        { id: 4, Clientes: "Raiol Vidros", Tecnico: "André Luiz",Data: "26/03/27",Hora: "14:00" },
        { id: 5, Clientes: "Tribom Alimentos", Tecnico: "João Silva",Data: "11/09/25",Hora: "13:00" },
        { id: 6, Clientes: "Mercado Fama", Tecnico: "Maria Souza",Data: "14/11/25",Hora: "10:40" },
        { id: 7, Clientes: "Pavan", Tecnico:  "Carlos Oliveira",Data: "26/05/26 ",Hora: "07:20" },
        { id: 8, Clientes: "Raiol Vidros", Tecnico: "André Luiz",Data: "26/03/27",Hora: "14:00" },
        { id: 9, Clientes: "Tribom Alimentos", Tecnico: "João Silva",Data: "11/09/25",Hora: "13:00" },
        { id: 10, Clientes: "Mercado Fama", Tecnico: "Maria Souza",Data: "14/11/25",Hora: "10:40" },
        { id: 11, Clientes: "Pavan", Tecnico:  "Carlos Oliveira",Data: "26/05/26 ",Hora: "07:20" },
        { id: 12, Clientes: "Raiol Vidros", Tecnico: "André Luiz",Data: "26/03/27",Hora: "14:00" },
        
    ]);
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
    <td>{Agendamentos.Clientes}</td>
    <td>{Agendamentos.Tecnico}</td>
    <td>{Agendamentos.Data}</td>
    <td>{Agendamentos.Hora}</td>
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