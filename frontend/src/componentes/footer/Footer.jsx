import React from "react";
import "./Footer.css";
// 1. IMPORTE a imagem aqui
import logoIFC from "../../assets/imagens/IFC.png"; 

export default function Rodape() {
  return (
    <footer className="rodape">
      {/* 2. USE a variável que você importou (com chaves {}) */}
      <img
        src={logoIFC} 
        alt="Logo IFC"
        className="rodape-logo"
      />
    </footer>
  );
}