import Sidebar from "../../componentes/sidebar/Sidebar";
import Footer from "../../componentes/footer/Footer";
import "./Inicial.css";
import { Link } from "react-router-dom";

const Inicial = () => {

  return (
    <div className="pagina">
      <Sidebar />

      <div className="conteudo-principal">

        <div className="conteudo-principal-wrapper">

<div className="cabecalho">
  <h1>Inicial</h1>
</div>
 <img src="/src/assets/imagens/logo.png" alt="logoInicial" className="logoInicial" />

        </div> 
        <div className="footer-wrapper">
          <Footer />
        </div>

      </div>
    </div>
  );
};

export default Inicial;