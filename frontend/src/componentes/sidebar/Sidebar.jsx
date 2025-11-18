import "./Sidebar.css";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const navigate = useNavigate();
  
  // TESTE 1: Verifique o que é a função navigate
  console.log("Função navigate:", navigate); 

  const user = {
    nome: "Nome de Usuário",
    tipo: "Técnico",
  };

    const handleNavegar = (caminho) => {
    // TESTE 2: Verifique se esta função é chamada
    console.log("NAVEGANDO PARA:", caminho); 
    navigate(caminho);
  };


  return (
    <div className="sidebar">
      <img src="/src/assets/imagens/logo.png" alt="logo" className="logo" />

      <div className="user-info">
        <p className="user-name">{user.nome}</p>
        <span className="user-type">{user.tipo}</span>
      </div>

      <div className="buttons-top">
        <button className="btn-small">editar perfil</button>
        <button className="btn-small">Sair do perfil</button>
      </div>

      <div className="menu">
        <button className="btn" onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/clientes");}}>Clientes</button>
        <button className="btn" onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Maquinas");}}>Máquinas</button>
        <button className="btn" onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Agendamentos");}}>Agendamentos</button>
        <button className="btn"onClick={() => {console.log("CLIQUE no botão"); handleNavegar("/Relatorios");}}>Relatórios</button>
      </div>
    </div>
  );
}

