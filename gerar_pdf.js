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
    const { qrCodeMessage, usuario } = req.body; // Receber o usuário ativo junto com o QR code
    const banco = JSON.parse(fs.readFileSync('banco.json', 'utf8'));

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
            usuario, // Usar o nome do usuário ativo
            data: new Date().toISOString().split('T')[0], // Data no formato YYYY-MM-DD
            hora: new Date().toTimeString().split(' ')[0] // Hora no formato HH:MM:SS
        });

        // Salvar o banco de dados atualizado
        fs.writeFileSync('banco.json', JSON.stringify(banco, null, 2));

        res.json({ success: true, message: "Leitura registrada com sucesso!", procedimento: numeroProcedimento });
    } else {
        res.status(404).json({ success: false, message: "Procedimento não encontrado!" });
    }
});


// Rota para salvar o procedimento no banco de dados
app.post('/salvarProcedimento', (req, res) => {
    const { numero, usuario } = req.body; // Receber o usuário do frontend
    const banco = JSON.parse(fs.readFileSync('banco.json', 'utf8'));

    // Verificar se o procedimento já existe
    const procedimentoExistente = banco.procedimentos.find(p => p.numero === numero);

    if (procedimentoExistente) {
        return res.json({ success: true, message: "Procedimento já existe." });
    }

    // Adicionar o novo procedimento com o usuário que o registrou
    banco.procedimentos.push({
        numero: numero,
        usuario: usuario, // Salvar o usuário ativo
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


// Rota para exibir o comprovante
app.get('/comprovante', (req, res) => {
    const numeroProcedimento = req.query.procedimento;
    const banco = JSON.parse(fs.readFileSync('banco.json', 'utf8'));

    // Procurar o procedimento correspondente
    const procedimento = banco.procedimentos.find(p => p.numero === numeroProcedimento);

    if (procedimento) {
        // Renderizar uma página de comprovante
        res.send(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Comprovante de Leitura</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .container { text-align: center; margin-top: 50px; }
                    .info { font-size: 18px; }
                    .info p { margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Comprovante de Leitura</h1>
                    <div class="info">
                        <p><strong>Procedimento:</strong> ${numeroProcedimento}</p>
                        <p><strong>Última Leitura:</strong> ${procedimento.leituras[procedimento.leituras.length - 1].data} ${procedimento.leituras[procedimento.leituras.length - 1].hora}</p>
                        <p><strong>Usuário:</strong> ${procedimento.leituras[procedimento.leituras.length - 1].usuario}</p>
                    </div>
                    <button onclick="window.print()">Imprimir Comprovante</button>
                </div>
            </body>
            </html>
        `);
    } else {
        res.status(404).send('Procedimento não encontrado.');
    }
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
