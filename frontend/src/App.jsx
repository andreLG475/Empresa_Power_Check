import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Clientes from "./pages/Clientes/Clientes";
import Maquinas from "./pages/Maquinas/Maquinas";
import Agendamentos from "./pages/Agendamentos/Agendamentos";
import Relatorios from "./pages/Relatorios/Relatorios";
import CadastroTecnico from "./pages/CadastroTecnico/CadastroTecnico";
import CadastroClientes from "./pages/CadastroClientes/CadastroClientes";
import CadastroMaquinas from "./pages/CadastroMaquinas/CadastroMaquinas";
import CadastroAgendamento from "./pages/CadastroAgendamento/CadastroAgendamento";
import CadastroRelatorios from "./pages/CadastroRelatorios/CadastroRelatorios";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/Maquinas" element={<Maquinas />} />
      <Route path="/Agendamentos" element={<Agendamentos />} />
      <Route path="/Relatorios" element={<Relatorios />} />
      <Route path="/CadastroTecnico" element={<CadastroTecnico />} />
      <Route path="/CadastroClientes" element={<CadastroClientes />} />
      <Route path="/CadastroMaquinas" element={<CadastroMaquinas />} />
      <Route path="/CadastroAgendamento" element={<CadastroAgendamento />} />
      <Route path="/CadastroRelatorios" element={<CadastroRelatorios />} />
    </Routes>
  );
}

export default App;