-- Todas as máquinas com os clientes
CREATE VIEW v_maquinas_clinetes AS
SELECT
    m.*, c.nome AS nome_cliente
FROM maquinas m
INNER JOIN clientes c ON c.id = m.id_cliente;

-- Relatório com as informações completas
CREATE VIEW v_relatorio_completo AS
SELECT 
    r.id AS relatorio_id,
    r.data AS data_relatorio,
    r.hora AS hora_relatorio,
    a.id AS agendamento_id,
    a.data AS data_agendamento,
    a.hora AS hora_agendamento,
    c.id AS cliente_id,
    c.nome AS cliente_nome,
    c.cnpj AS cliente_cnpj,
    c.responsavel,
    t.id AS tecnico_id,
    t.nome_completo AS tecnico_nome,
    d.id AS detalhe_id,
    d.vistoria,
    d.problemas_encontrados,
    d.o_que_foi_feito
FROM relatorio_agendamento r
JOIN agendamentos a ON r.id_agendamento = a.id
JOIN clientes c ON a.id_cliente = c.id
JOIN tecnicos t ON a.id_tecnico = t.id
LEFT JOIN relatorio_detalhes d ON r.id = d.id_relatorio;

-- Informações de relatórios
CREATE VIEW v_relatorio_detalhes AS
SELECT 
    d.id,
    d.id_relatorio,
    d.vistoria,
    d.problemas_encontrados,
    d.o_que_foi_feito,
    r.data,
    r.hora,
    r.id_agendamento,
    r.id_maquina
FROM relatorio_detalhes d
JOIN relatorio_agendamento r ON d.id_relatorio = r.id;