const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Servindo o index.html na raiz
});

// Rota para capturar a leitura do QR Code
app.get('/leitura', (req, res) => {
    const procedimento = req.query.procedimento;
    const leitor = req.headers['user-agent'];

    // Lê o banco de dados
    let banco = JSON.parse(fs.readFileSync('banco.json'));

    // Adiciona a nova leitura
    banco.leituras.push({ procedimento, leitor, data: new Date() });

    // Salva no banco de dados
    fs.writeFileSync('banco.json', JSON.stringify(banco, null, 2));

    res.send('Leitura registrada com sucesso!');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
