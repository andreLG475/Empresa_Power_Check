import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Clientes from "./pages/Clientes/Clientes";
import Maquinas from "./pages/Maquinas/Maquinas";
import Agendamentos from "./pages/Agendamentos/Agendamentos";
import Relatorios from "./pages/Relatorios/Relatorios";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/Maquinas" element={<Maquinas />} />
      <Route path="/Agendamentos" element={<Agendamentos />} />
      <Route path="/Relatorios" element={<Relatorios />} />
    </Routes>
  );
}

export default App;