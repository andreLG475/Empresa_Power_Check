#PowerCheck – Sistema de Agendamentos, Máquinas, relatórios, Clientes e Técnicos

Este projeto é um sistema completo com **frontend em React** e **backend em Node.js/Express**, criado para gerenciar **clientes**, **Máquinas**,**técnicos** e **agendamentos**, permitindo operações de cadastro, listagem, edição e exclusão.

#Frontend (React + Vite)

O frontend é responsável pela interface onde o usuário faz cadastros, visualiza tabelas, edita e exclui registros.

## Funcionalidades
- Cadastro de clientes
- Cadastro de técnicos
- Cadastro de agendamentos
- Listagem de todos os registros
- Edição e exclusão

## Tecnologias do Frontend
- React
- Vite
- Axios
- CSS
- React Hooks (useState, useEffect)



frontend/
 ├── src/
 │    ├── assets/          # Imagens e logos
 │    ├── componentes/     # Componentes reutilizáveis (Footer, Header...)
 │    ├── pages/           # Páginas do sistema (Cadastros, Listagens, Login...)
 │    ├── App.jsx          # Arquivo principal
 │    └── main.jsx         # Inicialização do React
 ├── index.html
 ├── package.json
 └── vite.config.js

##  Como rodar o frontend
cd Projeto/frontend
npm install
npm run dev




backend/
 ├── src/
 │    ├── middleware/
 │    │      ├── auth.js      # Validação de token
 │    │      └── db.js        # Conexão com banco
 │    ├── routes/
 │    │      ├── auth.routes.js
 │    │      └── private.routes.js
 │    └── server.js
 ├── package.json

## Como rodar o backend
cd Projeto/backend
npm install
npm start

## Autor
André Luiz Gabiatti


