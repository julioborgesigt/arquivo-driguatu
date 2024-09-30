const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const PORT = 3000;






app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve o arquivo HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile('banco.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Erro ao ler o banco de dados" });
        }

        const bancoDados = JSON.parse(data);

        // Verificar se o usuário existe e a senha está correta
        const usuario = bancoDados.usuarios.find(u => u.username === username && u.password === password);

        if (usuario) {
            res.status(200).json({ message: "Login realizado com sucesso", usuario: usuario });
        } else {
            res.status(401).json({ message: "Usuário ou senha incorretos" });
        }
    });
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
    const { qrCodeMessage } = req.body; // Supondo que o qrCodeMessage seja a URL completa do QR code
    const banco = JSON.parse(fs.readFileSync('banco.json', 'utf8'));
    const usuario = req.headers['user-agent']; // Obter o usuário que está fazendo a leitura

    // Extrair o número do procedimento da URL do QR code
    const urlParams = new URLSearchParams(new URL(qrCodeMessage).search);
    const numeroProcedimento = urlParams.get('procedimento');

    if (!numeroProcedimento) {
        return res.status(400).json({ success: false, message: "Número do procedimento não encontrado na URL." });
    }

    // Procurar o procedimento correspondente no banco de dados
    const procedimento = banco.procedimentos.find(p => p.numero === numeroProcedimento);

    if (procedimento) {
        // Adicionar a leitura ao procedimento
        procedimento.leituras.push({
            usuario,
            data: new Date().toISOString().split('T')[0], // Data no formato YYYY-MM-DD
            hora: new Date().toTimeString().split(' ')[0] // Hora no formato HH:MM:SS
        });

        // Salvar o banco de dados atualizado
        fs.writeFileSync('banco.json', JSON.stringify(banco, null, 2));

        res.json({ success: true, message: "Leitura registrada com sucesso!" });
    } else {
        res.status(404).json({ success: false, message: "Procedimento não encontrado!" });
    }
});



// Rota para salvar o procedimento no banco de dados
app.post('/salvarProcedimento', (req, res) => {
    const { numero } = req.body;
    const banco = JSON.parse(fs.readFileSync('banco.json', 'utf8'));

    // Verificar se o procedimento já existe
    const procedimentoExistente = banco.procedimentos.find(p => p.numero === numero);

    if (procedimentoExistente) {
        return res.json({ success: true, message: "Procedimento já existe." });
    }

    // Adicionar o novo procedimento
    banco.procedimentos.push({
        numero: numero,
        leituras: []
    });

    // Salvar no banco de dados
    fs.writeFileSync('banco.json', JSON.stringify(banco, null, 2));

    res.json({ success: true, message: "Procedimento salvo com sucesso." });
});



// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


// Rota para servir a página de consulta
app.get('/consulta', (req, res) => {
    res.sendFile(path.join(__dirname, 'consulta.html'));
});

// Rota para obter os dados do banco.json
app.get('/dados', (req, res) => {
    fs.readFile('banco.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: "Erro ao ler o banco de dados" });
        } else {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        }
    });
});
