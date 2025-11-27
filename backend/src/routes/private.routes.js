const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../middleware/db");
const router = require('express').Router();
const verifyToken = require('../middleware/auth');

// Exemplo de rota protegida
// A função 'verifyToken' é executada antes de a rota principal ser acessada.
// Se o token for inválido, o acesso será negado.

router.get('/tecnico', verifyToken, async (req, res) => {
    try {
        const response = await db('SELECT * FROM tecnicos');
        res.json(response.rows);
    } catch (err) {
        res.json({message: "Ocorreu um erro interno no servidor!", err})
    }
});

// Clientes
router.post('/cliente/adicionar', verifyToken, async (req, res) => {
    const {cnpj, id_tecnico_responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento} = req.body;
    try {
        const response = await db(`INSERT INTO clientes (cnpj, id_tecnico_responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [cnpj, id_tecnico_responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento]);
        res.json({message: "Cliente adicionado com sucesso!"})
    } catch (err) {
        res.json(err);
    }
});

router.delete('/cliente/deletar/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    try {
        await db(`DELETE FROM clientes WHERE id = $1`, [id]);
        res.json( {message: "Deletado com sucesso!"});
    }
    catch (err) {
        res.json( {message: "Ocorreu um erro!", err});
    } 
});

router.get('/cliente', verifyToken, async (req, res) => {
    try {
        const response = await db('SELECT * FROM clientes');
        res.json(response.rows);
    } catch (err) {
        res.json({message: "Ocorreu um erro interno no servidor!", err})
    }
});

//Máquinas
router.post('/maquina/adicionar', verifyToken, async (req, res) => {
    const {id_cliente, idade_maquina, status, marca, modelo, potencia, funcao, setor} = req.body;
    console.log(req.body);
    try {
        const response = await db(`INSERT INTO maquinas (id_cliente, idade_maquina, status, marca, modelo, potencia, funcao, setor)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [id_cliente, idade_maquina, status, marca, modelo, potencia, funcao, setor]);
        res.json({message: "Criado com sucesso!"})
    } catch (err) {
        res.json({message: "Ocorreu um erro interno no servidor!", err})
    }
});

router.get('/maquina', verifyToken, async (req, res) => {
    try {
        const response = await db(`
            SELECT * FROM v_maquinas_clinetes`);
        res.json(response.rows);
    } catch (err) {
        res.json({message: "Ocorreu um erro interno no servidor!", err})
    }
});
router.delete('/maquina/deletar/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    try {
        await db(`DELETE FROM maquinas WHERE id = $1`, [id]);
        res.json( {message: "Deletado com sucesso!"});
    }
    catch (err) {
        res.json( {message: "Ocorreu um erro!", err});
    }
    
});






// Agendamentos
router.post('/agendamento/adicionar', verifyToken, async (req, res) => {
    const { data, hora, id_cliente, id_tecnico, maquinas } = req.body;
    
    try {
        // Validar se há máquinas
        if (!maquinas || !Array.isArray(maquinas) || maquinas.length === 0) {
            return res.status(400).json({ message: "Por favor, selecione pelo menos uma máquina!" });
        }

        // Criar o agendamento
        const agendamentoResponse = await db(
            `INSERT INTO agendamentos (data, hora, id_cliente, id_tecnico)
            VALUES ($1, $2, $3, $4) RETURNING id`,
            [data, hora, id_cliente, id_tecnico]
        );
        
        const agendamentoId = agendamentoResponse.rows[0].id;

        // Adicionar todas as máquinas à tabela agendamento_maquina
        for (const idMaquina of maquinas) {
            await db(
                `INSERT INTO agendamento_maquina (id_agendamento, id_maquina)
                VALUES ($1, $2)`,
                [agendamentoId, idMaquina]
            );
        }

        res.status(201).json({ message: "Agendamento criado com sucesso!", agendamento: {
                id: agendamentoId,
                data,
                hora,
                id_cliente,
                id_tecnico,
                maquinas
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao criar o agendamento!", err: err.message });
    }
});

router.get('/agendamento', verifyToken, async (req, res) => {
    try {
        const response = await db(`
            SELECT 
                a.id,
                a.data,
                a.hora,
                a.id_cliente,
                a.id_tecnico,
                c.nome AS cliente_nome,
                c.cnpj AS cliente_cnpj,
                t.nome_completo AS tecnico_nome
            FROM agendamentos a
            LEFT JOIN clientes c ON a.id_cliente = c.id
            LEFT JOIN tecnicos t ON a.id_tecnico = t.id
            ORDER BY a.data, a.hora
        `);
        res.json(response.rows);
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro interno no servidor!", err: err.message });
    }
});

router.get('/agendamento/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const agendamentoResponse = await db(`
            SELECT 
                a.id,
                a.data,
                a.hora,
                a.id_cliente,
                a.id_tecnico,
                c.nome AS cliente_nome,
                c.cnpj AS cliente_cnpj,
                c.telefone AS cliente_telefone,
                c.email AS cliente_email,
                t.nome_completo AS tecnico_nome,
                t.telefone AS tecnico_telefone
            FROM agendamentos a
            LEFT JOIN clientes c ON a.id_cliente = c.id
            LEFT JOIN tecnicos t ON a.id_tecnico = t.id
            WHERE a.id = $1
        `, [id]);
        
        if (agendamentoResponse.rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado!" });
        }

        // Buscar as máquinas associadas ao agendamento
        const maquinasResponse = await db(`
            SELECT m.* FROM maquinas m
            INNER JOIN agendamento_maquina am ON am.id_maquina = m.id
            WHERE am.id_agendamento = $1
        `, [id]);

        const agendamento = agendamentoResponse.rows[0];
        agendamento.maquinas = maquinasResponse.rows;

        res.json(agendamento);
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro interno no servidor!", err: err.message });
    }
});


router.put('/agendamento/editar/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { data, hora, id_cliente, id_tecnico } = req.body;
    try {
        const response = await db(`
            UPDATE agendamentos 
            SET data = $1, hora = $2, id_cliente = $3, id_tecnico = $4
            WHERE id = $5
        `, [data, hora, id_cliente, id_tecnico, id]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado!" });
        }
        res.json({ message: "Agendamento atualizado com sucesso!", agendamento: response.rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o agendamento!", err: err.message });
    }
});

router.delete('/agendamento/deletar/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db(`DELETE FROM agendamentos WHERE id = $1 RETURNING *`, [id]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado!" });
        }
        res.json({ message: "Agendamento deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao deletar o agendamento!", err: err.message });
    }
});



// # Relatórios
router.post('/relatorio/adicionar', verifyToken, async (req, res) => {
    const { id_agendamento, vistorias } = req.body;
    
    try {
        // Validar se há vistorias
        if (!vistorias || !Array.isArray(vistorias) || vistorias.length === 0) {
            return res.status(400).json({ message: "Por favor, preencha a vistoria de pelo menos uma máquina!" });
        }

        // Buscar dados do agendamento para data e hora
        const agendamentoResponse = await db(
            `SELECT data, hora FROM agendamentos WHERE id = $1`,
            [id_agendamento]
        );

        if (agendamentoResponse.rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado!" });
        }

        const { data, hora } = agendamentoResponse.rows[0];
        const relatorios_criados = [];

        // Criar um relatorio_agendamento para cada máquina/vistoria
        for (const vistoria of vistorias) {
            const { id_maquina, vistoria: vistoria_texto, problemas_encontrados, o_que_foi_feito } = vistoria;

            // Criar relatorio_agendamento
            const relatorioResult = await db(
                `INSERT INTO relatorio_agendamento (id_agendamento, data, hora, id_maquina)
                VALUES ($1, $2, $3, $4) RETURNING id`,
                [id_agendamento, data, hora, id_maquina]
            );

            const id_relatorio = relatorioResult.rows[0].id;

            // Criar relatorio_detalhes
            await db(
                `INSERT INTO relatorio_detalhes (id_relatorio, vistoria, problemas_encontrados, o_que_foi_feito)
                VALUES ($1, $2, $3, $4)`,
                [id_relatorio, vistoria_texto || '', problemas_encontrados || '', o_que_foi_feito || '']
            );

            relatorios_criados.push(id_relatorio);
        }

        res.status(201).json({ 
            message: "Relatórios criados com sucesso!", 
            relatorios_ids: relatorios_criados,
            quantidade: relatorios_criados.length
        });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao criar os relatórios!", err: err.message });
    }
});

router.get('/relatorio', verifyToken, async (req, res) => {
    try {
        const response = await db(`
            SELECT * FROM v_relatorio_completo
            ORDER BY data_relatorio DESC, hora_relatorio DESC
        `);
        res.json(response.rows);
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro interno no servidor!", err: err.message });
    }
});

module.exports = router;