
import { Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Login.jsx"
import Tecnicos from "./Pages/Tecnicos/Tecnicos";
import Clientes from "./Pages/Clientes/Clientes";
import Maquinas from "./Pages/Maquinas/Maquinas";
import Agendamentos from "./Pages/Agendamentos/Agendamentos";
import Relatorios from "./Pages/Relatorios/Relatorios";
import CadastroTecnico from "./Pages/CadastroTecnico/CadastroTecnico";
import CadastroClientes from "./Pages/CadastroClientes/CadastroClientes";
import CadastroMaquinas from "./Pages/CadastroMaquinas/CadastroMaquinas";
import CadastroAgendamento from "./Pages/CadastroAgendamento/CadastroAgendamento";
import CadastroRelatorios from "./Pages/CadastroRelatorios/CadastroRelatorios";
import Inicial from "./Pages/Inicial/Inicial";
import PaginaPrivada from "./componentes/PaginaPrivada.jsx";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicial />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Tecnicos" element={<PaginaPrivada><Tecnicos /></PaginaPrivada>} />
      <Route path="/clientes" element={<PaginaPrivada><Clientes /></PaginaPrivada>} />
      <Route path="/Maquinas" element={<PaginaPrivada><Maquinas /></PaginaPrivada>} />
      <Route path="/Agendamentos" element={<PaginaPrivada><Agendamentos /></PaginaPrivada>} />
      <Route path="/Relatorios" element={<PaginaPrivada><Relatorios /></PaginaPrivada>} />
      <Route path="/CadastroTecnico" element={<CadastroTecnico />} />
      <Route path="/CadastroClientes" element={<PaginaPrivada><CadastroClientes /></PaginaPrivada>} />
      <Route path="/CadastroMaquinas" element={<PaginaPrivada><CadastroMaquinas /></PaginaPrivada>} />
      <Route path="/CadastroAgendamento" element={<PaginaPrivada><CadastroAgendamento /></PaginaPrivada>} />
      <Route path="/CadastroRelatorios" element={<PaginaPrivada><CadastroRelatorios /></PaginaPrivada>} />
    </Routes>
  );
}

export default App;