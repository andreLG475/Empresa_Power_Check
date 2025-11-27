CREATE DATABASE power_check;

CREATE TABLE tecnicos (
    id SERIAL PRIMARY KEY,
    nome_completo VARCHAR(150) NOT NULL UNIQUE,
    cpf CHAR(11) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    funcao VARCHAR(50),
    telefone VARCHAR(15),
    email VARCHAR(100),
    cep CHAR(8),
    estado VARCHAR(50),
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    rua VARCHAR(100),
    numero_estabelecimento VARCHAR(10),
    complemento VARCHAR(50)
);

CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    cnpj CHAR(14) NOT NULL UNIQUE,
    id_tecnico_responsavel INT REFERENCES tecnicos(id) ON DELETE SET NULL,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100),
    cep CHAR(8),
    estado VARCHAR(50),
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    rua VARCHAR(100),
    numero_estabelecimento VARCHAR(10),
    complemento VARCHAR(50)
);

CREATE TABLE maquinas (
    id SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    idade_maquina INT,
    status VARCHAR(50),
    marca VARCHAR(50),
    modelo VARCHAR(50),
    potencia VARCHAR(50),
    funcao VARCHAR(100),
    setor VARCHAR(100)
);

CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    id_cliente INT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    id_tecnico INT NOT NULL REFERENCES tecnicos(id) ON DELETE CASCADE
);

CREATE TABLE agendamento_maquina (
    id SERIAL PRIMARY KEY,
    id_agendamento INT NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
    id_maquina INT NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE,
    UNIQUE(id_agendamento, id_maquina)
);

CREATE TABLE relatorio_agendamento (
    id SERIAL PRIMARY KEY,
    id_agendamento INT NOT NULL REFERENCES agendamentos(id) ON DELETE CASCADE,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    id_maquina INT NOT NULL REFERENCES maquinas(id) ON DELETE CASCADE
);

CREATE TABLE relatorio_detalhes (
    id SERIAL PRIMARY KEY,
    id_relatorio INT NOT NULL REFERENCES relatorio_agendamento(id) ON DELETE CASCADE,
    vistoria TEXT,
    problemas_encontrados TEXT,
    o_que_foi_feito TEXT
);