const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
