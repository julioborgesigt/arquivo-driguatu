const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const banco = JSON.parse(fs.readFileSync('banco.json'));

    const user = banco.usuarios.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ success: true, user });
    } else {
        res.json({ success: false });
    }
});

// Rota de cadastro
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    const banco = JSON.parse(fs.readFileSync('banco.json'));

    if (banco.usuarios.find(user => user.username === username)) {
        return res.json({ success: false, message: "Usuário já existe." });
    }

    banco.usuarios.push({ username, password });
    fs.writeFileSync('banco.json', JSON.stringify(banco, null, 2));
    res.json({ success: true });
});

// Rota de leitura do QR Code
app.post('/leitura', (req, res) => {
    const { qrCodeMessage } = req.body;
    const banco = JSON.parse(fs.readFileSync('banco.json'));
    const usuario = req.headers['user-agent'];

    banco.leituras.push({ qrCodeMessage, usuario, data: new Date() });
    fs.writeFileSync('banco.json', JSON.stringify(banco, null, 2));

    res.json({ success: true });
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
