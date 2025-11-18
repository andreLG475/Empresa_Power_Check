const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../middleware/db");
const router = require('express').Router();
const verifyToken = require('../middleware/auth');

// Exemplo de rota protegida
// A função 'verifyToken' é executada antes de a rota principal ser acessada.
// Se o token for inválido, o acesso será negado.
router.get('/protected', verifyToken, (req, res) => {
// Se a requisição chegou até aqui, significa que o token é válido.
res.json({ message: 'Acesso garantido, você está autenticado!' });
});

module.exports = router;