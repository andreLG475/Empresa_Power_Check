import React, { useState, useEffect } from "react";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Relatorios.css";

const Relatorios = () => {

  const [Relatorios, setRelatorios] = useState([]);

  useEffect(() => {

    setRelatorios([
        { id: 1, Agendamento: 3, Clientes: "Tribom Alimentos", Tecnico: "João Silva",Data: "11/09/25",Hora: "13:00" },
        { id: 2, Agendamento: 4, Clientes: "Mercado Fama", Tecnico: "Maria Souza",Data: "14/11/25",Hora: "10:40" },
        { id: 3, Agendamento: 2, Clientes: "Pavan", Tecnico:  "Carlos Oliveira",Data: "26/05/26 ",Hora: "07:20" },
        { id: 4, Agendamento: 9, Clientes: "Raiol Vidros", Tecnico: "André Luiz",Data: "26/03/27",Hora: "14:00" },
        { id: 5, Agendamento: 10, Clientes: "Tribom Alimentos", Tecnico: "João Silva",Data: "11/09/25",Hora: "13:00" },
        { id: 6, Agendamento: 8, Clientes: "Mercado Fama", Tecnico: "Maria Souza",Data: "14/11/25",Hora: "10:40" },
        { id: 7, Agendamento: 12, Clientes: "Pavan", Tecnico:  "Carlos Oliveira",Data: "26/05/26 ",Hora: "07:20" },
        { id: 8, Agendamento: 9, Clientes: "Raiol Vidros", Tecnico: "André Luiz",Data: "26/03/27",Hora: "14:00" },
        { id: 9, Agendamento: 4, Clientes: "Tribom Alimentos", Tecnico: "João Silva",Data: "11/09/25",Hora: "13:00" },
        { id: 10, Agendamento: 2, Clientes: "Mercado Fama", Tecnico: "Maria Souza",Data: "14/11/25",Hora: "10:40" },
        { id: 11, Agendamento: 1, Clientes: "Pavan", Tecnico:  "Carlos Oliveira",Data: "26/05/26 ",Hora: "07:20" },
        { id: 12, Agendamento: 6, Clientes: "Raiol Vidros", Tecnico: "André Luiz",Data: "26/03/27",Hora: "14:00" },
        
    ]);
  }, []);

  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>relatórios</h1>
  
  <button className="btn btn-cadastrar">Cadastrar novo relatório +</button>
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
  <tr key={Relatorios.id}>
    <td>{Relatorios.id}</td>
    <td>{Relatorios.Agendamento}</td>
    <td>{Relatorios.Clientes}</td>
    <td>{Relatorios.Tecnico}</td>
    <td>{Relatorios.Data}</td>
    <td>{Relatorios.Hora}</td>
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