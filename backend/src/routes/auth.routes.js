const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../middleware/db");
const router = require('express').Router();

// Tecnico
router.post('/tecnico/register', async (req, res) => {
    const { nome_completo, cpf, senha, funcao, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento } = req.body;
    try {
        // 1. Criptografa a senha antes de salvar (boas práticas)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        // 2. Executa a query de INSERÇÃO no PostgreSQL
        // O uso de $1, $2, etc previne ataques de SQL Injection.
        await db(
            `INSERT INTO tecnicos (nome_completo, cpf, senha, funcao, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [nome_completo, cpf, hashedPassword, funcao, telefone, email, cep, estado, cidade, bairro, rua, numero_estabelecimento, complemento]
        );
        res.status(201).json({ message: 'Técnico registrado com sucesso.' });
    } catch (error) {
        // Trata o erro de CPF duplicado (PostgreSQL)
        if (error.code === '23505') {
            return res.status(400).json({ message: 'CPF já cadastrado.' });
        }
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
});

router.get('/tecnico', async (req, res) => {
    try {
        const response = await db('SELECT * FROM tecnicos');
        res.json(response.rows);
    } catch (err) {
        res.json({message: "Ocorreu um erro interno no servidor!", err})
    }
});


router.post('/tecnico/login', async (req, res) => {
    const { nome, senha } = req.body;
    try {
        // 1. Executa a query de SELEÇÃO para buscar o técnico no PostgreSQL
        const result = await db('SELECT * FROM tecnicos WHERE nome_completo = $1', [nome]);
        const user = result.rows[0];
        
        if (!user) {
            // Se o PostgreSQL não retornou linhas, o técnico não existe.
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 2. Compara a senha digitada com o hash do PostgreSQL
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        // 3. Gera o JWT (não muda, pois o login foi validado)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1y' });

        // Retorna o sucesso. Não precisamos do res.json({ token })
        res.status(200).json({ message: 'Login bem-sucedido.', token });
        
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor.', error: error.message });
    }
});


module.exports = router;

