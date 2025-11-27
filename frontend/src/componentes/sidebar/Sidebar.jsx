import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
  
  console.log("Função navigate:", navigate); 

  const user = {
    nome: "Nome de Usuário",
    tipo: "Técnico",
  };

    const handleNavegar = (caminho) => {
    console.log("NAVEGANDO PARA:", caminho); 
    navigate(caminho);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    localStorage.clear();
    navigate("/Login")
  }

  return (
    <div className="sidebar">
      <img src="/src/assets/imagens/logo.png" alt="logo" className="logo" />

      <div className="user-info">
        <p className="user-name">{user.nome}</p>
        <span className="user-type">{user.tipo}</span>
      </div>

      <div className="buttons-top">
        <button className="btn-small">editar perfil</button>
        <button className="btn-small" onClick={handleLeave}>Sair do perfil</button>
      </div>

      <div className="menu">
        <button className="btn" onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/clientes");}}>Clientes</button>
        <button className="btn" onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Maquinas");}}>Máquinas</button>
        <button className="btn" onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Agendamentos");}}>Agendamentos</button>
        <button className="btn"onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Relatorios");}}>Relatórios</button>
        <button className="btn"onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Tecnicos");}}>Têcnicos</button>
      </div>
    </div>
  );
}

