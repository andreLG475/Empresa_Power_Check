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

router.get('/tecnico/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    try {
        const response = await db('SELECT * FROM tecnicos WHERE id = $1', [id]);
        res.json(response.rows[0]);
    } catch (err) {
        res.json({message: "Ocorreu um erro interno no servidor!", err})
    }
});

router.put('/tecnico/atualizar', verifyToken, async (req, res) => {
    const { id, nome_completo, cpf, senha, funcao, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento } = req.body;
    try {
        let hashedPassword = null;
        
        // Criptografar senha nova
        if (senha) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(senha, salt);
        }
        
        const finalPassword = hashedPassword;
        
        await db(`
            UPDATE tecnicos 
            SET nome_completo = $1, cpf = $2, senha = $3, funcao = $4, telefone = $5, 
                email = $6, cep = $7, estado = $8, cidade = $9, bairro = $10, 
                rua = $11, numero_estabelecimento = $12, complemento = $13
            WHERE id = $14
        `, [nome_completo, cpf, finalPassword, funcao, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento, id]);
        
        res.json({ message: "Técnico atualizado com sucesso!" });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'CPF já cadastrado.' });
        }
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o técnico!", err: err.message });
    }
});

// Clientes
router.post('/cliente/adicionar', verifyToken, async (req, res) => {
    const {cnpj, responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento} = req.body;
    try {
        const response = await db(`INSERT INTO clientes (cnpj, responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [cnpj, responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento]);
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

router.get('/cliente/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    try {
        const response = await db('SELECT * FROM clientes WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Cliente não encontrado!" });
        }
        res.json(response.rows[0]);
    } catch (err) {
        res.status(500).json({message: "Ocorreu um erro interno no servidor!", err: err.message})
    }
});

router.put('/cliente/editar/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { cnpj, responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento } = req.body;
    try {
        const checkClient = await db('SELECT id FROM clientes WHERE id = $1', [id]);
        if (checkClient.rows.length === 0) {
            return res.status(404).json({ message: "Cliente não encontrado!" });
        }
        
        await db(`
            UPDATE clientes 
            SET cnpj = $1, responsavel = $2, nome = $3, telefone = $4, 
                email = $5, cep = $6, estado = $7, cidade = $8, bairro = $9, 
                rua = $10, numero_estabelecimento = $11, complemento = $12
            WHERE id = $13
        `, [cnpj, responsavel, nome, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento, id]);
        
        res.json({ message: "Cliente atualizado com sucesso!" });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ message: 'CNPJ já cadastrado.' });
        }
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o cliente!", err: err.message });
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

router.get('/maquina/:id', verifyToken, async (req, res) => {
    const {id} = req.params;
    try {
        const response = await db('SELECT * FROM maquinas WHERE id = $1', [id]);
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Máquina não encontrada!" });
        }
        res.json(response.rows[0]);
    } catch (err) {
        res.status(500).json({message: "Ocorreu um erro interno no servidor!", err: err.message})
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

router.put('/maquina/editar/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { id_cliente, idade_maquina, status, marca, modelo, potencia, funcao, setor } = req.body;
    try {
        const checkMaquina = await db('SELECT id FROM maquinas WHERE id = $1', [id]);
        if (checkMaquina.rows.length === 0) {
            return res.status(404).json({ message: "Máquina não encontrada!" });
        }
        
        await db(`
            UPDATE maquinas 
            SET id_cliente = $1, idade_maquina = $2, status = $3, marca = $4, 
                modelo = $5, potencia = $6, funcao = $7, setor = $8
            WHERE id = $9
        `, [id_cliente, idade_maquina, status, marca, modelo, potencia, funcao, setor, id]);
        
        res.json({ message: "Máquina atualizada com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao atualizar a máquina!", err: err.message });
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
    const { data, hora, id_cliente, id_tecnico, maquinas } = req.body;
    try {
        // Verificar se o agendamento existe
        const checkAgendamento = await db('SELECT id FROM agendamentos WHERE id = $1', [id]);
        if (checkAgendamento.rows.length === 0) {
            return res.status(404).json({ message: "Agendamento não encontrado!" });
        }
        
        // Atualizar dados básicos do agendamento
        await db(`
            UPDATE agendamentos 
            SET data = $1, hora = $2, id_cliente = $3, id_tecnico = $4
            WHERE id = $5
        `, [data, hora, id_cliente, id_tecnico, id]);
        
        // Se máquinas foram fornecidas, atualizar a relação
        if (maquinas && Array.isArray(maquinas) && maquinas.length > 0) {
            // Remover todas as máquinas antigas do agendamento
            await db('DELETE FROM agendamento_maquina WHERE id_agendamento = $1', [id]);
            
            // Adicionar as novas máquinas
            for (const idMaquina of maquinas) {
                await db(
                    'INSERT INTO agendamento_maquina (id_agendamento, id_maquina) VALUES ($1, $2)',
                    [id, idMaquina]
                );
            }
        }
        
        res.json({ message: "Agendamento atualizado com sucesso!" });
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

        // Criar um único relatorio_agendamento
        const relatorioResult = await db(
            `INSERT INTO relatorio_agendamento (id_agendamento, data, hora)
            VALUES ($1, $2, $3) RETURNING id`,
            [id_agendamento, data, hora]
        );

        const id_relatorio = relatorioResult.rows[0].id;

        // Criar relatorio_detalhes para cada máquina/vistoria
        for (const vistoria of vistorias) {
            const { id_maquina, vistoria: vistoria_texto, problemas_encontrados, o_que_foi_feito } = vistoria;

            await db(
                `INSERT INTO relatorio_detalhes (id_relatorio, id_maquina, vistoria, problemas_encontrados, o_que_foi_feito)
                VALUES ($1, $2, $3, $4, $5)`,
                [id_relatorio, id_maquina, vistoria_texto || '', problemas_encontrados || '', o_que_foi_feito || '']
            );
        }

        res.status(201).json({ 
            message: "Relatórios criados com sucesso!", 
            relatorio_id: id_relatorio,
            quantidade: vistorias.length
        });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao criar os relatórios!", err: err.message });
    }
});

router.get('/relatorio', verifyToken, async (req, res) => {
    try {
        const response = await db(`
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
                t.id AS tecnico_id,
                t.nome_completo AS tecnico_nome
            FROM relatorio_agendamento r
            JOIN agendamentos a ON r.id_agendamento = a.id
            JOIN clientes c ON a.id_cliente = c.id
            JOIN tecnicos t ON a.id_tecnico = t.id
            ORDER BY r.data DESC, r.hora DESC
        `);
        res.json(response.rows);
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro interno no servidor!", err: err.message });
    }
});

router.get('/relatorio/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const response = await db(`
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
                t.id AS tecnico_id,
                t.nome_completo AS tecnico_nome,
                json_agg(json_build_object(
                    'id', m.id,
                    'marca', m.marca,
                    'modelo', m.modelo,
                    'status', m.status,
                    'potencia', m.potencia,
                    'vistoria', d.vistoria,
                    'problemas_encontrados', d.problemas_encontrados,
                    'o_que_foi_feito', d.o_que_foi_feito
                )) AS maquinas
            FROM relatorio_agendamento r
            JOIN agendamentos a ON r.id_agendamento = a.id
            JOIN clientes c ON a.id_cliente = c.id
            JOIN tecnicos t ON a.id_tecnico = t.id
            JOIN relatorio_detalhes d ON r.id = d.id_relatorio
            JOIN maquinas m ON d.id_maquina = m.id
            WHERE r.id = $1
            GROUP BY r.id, a.id, c.id, t.id
        `, [id]);
        
        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Relatório não encontrado!" });
        }
        
        const row = response.rows[0];
        const relatorio = {
            relatorio_id: row.relatorio_id,
            agendamento_id: row.agendamento_id,
            data_relatorio: row.data_relatorio,
            hora_relatorio: row.hora_relatorio,
            agendamento: {
                id: row.agendamento_id,
                data: row.data_agendamento,
                hora: row.hora_agendamento,
                cliente: {
                    id: row.cliente_id,
                    nome: row.cliente_nome,
                    cnpj: row.cliente_cnpj
                },
                tecnico: {
                    id: row.tecnico_id,
                    nome: row.tecnico_nome
                }
            },
            vistorias: (row.maquinas || []).map(maq => ({
                id_maquina: maq.id,
                marca_modelo: `${maq.marca || ''} ${maq.modelo || ''}`.trim() || 'Máquina',
                vistoria: maq.vistoria || '',
                problemas_encontrados: maq.problemas_encontrados || '',
                o_que_foi_feito: maq.o_que_foi_feito || ''
            }))
        };
        
        res.json(relatorio);
    } catch (err) {
        console.error("Erro ao buscar relatório:", err);
        res.status(500).json({ message: "Ocorreu um erro interno no servidor!", err: err.message });
    }
});

router.put('/relatorio/editar/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { id_agendamento, vistorias } = req.body;
    
    try {
        // Buscar o relatório atual
        const baseRel = await db('SELECT id_agendamento, data, hora FROM relatorio_agendamento WHERE id = $1', [id]);
        if (baseRel.rows.length === 0) {
            return res.status(404).json({ message: "Relatório não encontrado!" });
        }

        let finalAgendamentoId = id_agendamento || baseRel.rows[0].id_agendamento;
        let relData = baseRel.rows[0].data;
        let relHora = baseRel.rows[0].hora;

        // Se o agendamento foi alterado, buscar nova data e hora
        if (id_agendamento && id_agendamento !== baseRel.rows[0].id_agendamento) {
            const novoAgendamento = await db(
                'SELECT data, hora FROM agendamentos WHERE id = $1',
                [id_agendamento]
            );
            if (novoAgendamento.rows.length === 0) {
                return res.status(404).json({ message: "Agendamento não encontrado!" });
            }
            relData = novoAgendamento.rows[0].data;
            relHora = novoAgendamento.rows[0].hora;

            // Atualizar o relatório_agendamento com o novo agendamento
            await db(
                'UPDATE relatorio_agendamento SET id_agendamento = $1, data = $2, hora = $3 WHERE id = $4',
                [id_agendamento, relData, relHora, id]
            );
        }

        if (!vistorias || !Array.isArray(vistorias) || vistorias.length === 0) {
            return res.status(400).json({ message: "Por favor, preencha a vistoria de pelo menos uma máquina!" });
        }

        // Para cada vistoria, atualizar ou criar relatorio_detalhes
        for (const vistoria of vistorias) {
            const { id_maquina, vistoria: vistoria_texto, problemas_encontrados, o_que_foi_feito } = vistoria;

            // Procurar relatorio_detalhes para este relatorio + máquina
            let dRes = await db(`
                SELECT id FROM relatorio_detalhes
                WHERE id_relatorio = $1 AND id_maquina = $2
            `, [id, id_maquina]);

            if (dRes.rows.length > 0) {
                // Atualizar detalhe existente
                await db(`
                    UPDATE relatorio_detalhes
                    SET vistoria = $1, problemas_encontrados = $2, o_que_foi_feito = $3
                    WHERE id = $4
                `, [vistoria_texto || '', problemas_encontrados || '', o_que_foi_feito || '', dRes.rows[0].id]);
            } else {
                // Criar novo detalhe para esta máquina
                await db(`
                    INSERT INTO relatorio_detalhes (id_relatorio, id_maquina, vistoria, problemas_encontrados, o_que_foi_feito)
                    VALUES ($1, $2, $3, $4, $5)
                `, [id, id_maquina, vistoria_texto || '', problemas_encontrados || '', o_que_foi_feito || '']);
            }
        }

        res.json({ message: "Relatório atualizado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao atualizar o relatório!", err: err.message });
    }
});

router.delete('/relatorio/deletar/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        // Verificar se o relatório existe
        const checkRelatorio = await db('SELECT id FROM relatorio_agendamento WHERE id = $1', [id]);
        if (checkRelatorio.rows.length === 0) {
            return res.status(404).json({ message: "Relatório não encontrado!" });
        }
        
        // Deletar o relatório (os detalhes serão deletados automaticamente devido ao CASCADE)
        await db('DELETE FROM relatorio_agendamento WHERE id = $1', [id]);
        
        res.json({ message: "Relatório deletado com sucesso!" });
    } catch (err) {
        res.status(500).json({ message: "Ocorreu um erro ao deletar o relatório!", err: err.message });
    }
});

module.exports = router;