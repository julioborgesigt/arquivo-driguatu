// Função para pré-cadastrar um usuário
function preCadastrarUsuario() {
    const username = document.getElementById("pre-username").value;

    if (!/^[a-zA-Z0-9]{8}$/.test(username)) {
        alert("O nome de usuário deve ter exatamente 8 caracteres alfanuméricos.");
        return;
    }

    fetch('/preCadastro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        const mensagem = document.getElementById("mensagem-admin");
        if (data.success) {
            mensagem.innerHTML = `<p>Usuário ${username} pré-cadastrado com sucesso!</p>`;
        } else {
            mensagem.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro ao pré-cadastrar usuário:', error);
        alert('Erro ao pré-cadastrar usuário. Tente novamente.');
    });
}

// Função para resetar a senha do usuário
function resetarSenha() {
    const username = document.getElementById("reset-username").value;

    fetch('/resetSenha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        const mensagem = document.getElementById("mensagem-admin");
        if (data.success) {
            mensagem.innerHTML = `<p>Senha do usuário ${username} resetada com sucesso!</p>`;
        } else {
            mensagem.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro ao resetar a senha:', error);
        alert('Erro ao resetar a senha. Tente novamente.');
    });
}



const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.arquivodriguatu,  // Seu e-mail
        pass: process.env.algoritimo   // Sua senha segura (use um App Password para Gmail)
    }
});

function enviarCodigo() {
    const email = document.getElementById('admin-email').value;
    
    if (email === 'julio.aparecido3@gmail.com') {
        // Gerar código aleatório de 6 dígitos
        codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();

        // Configurar o e-mail
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de Login de Administrador',
            text: 'Seu código de acesso é: ' + codigoGerado
        };

        // Enviar o e-mail
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
                alert('Erro ao enviar o e-mail. Tente novamente.');
            } else {
                console.log('E-mail enviado: ' + info.response);
                alert('O código foi enviado para o e-mail ' + email);
                
                // Exibir o campo para inserir o código
                document.getElementById('email-form').style.display = 'none';
                document.getElementById('codigo-form').style.display = 'block';
            }
        });
    } else {
        alert('E-mail inválido.');
    }
}


// Função para verificar o código digitado
function verificarCodigo() {
    const codigoDigitado = document.getElementById('admin-codigo').value;
    
    if (codigoDigitado === codigoGerado) {
        alert('Código verificado com sucesso!');
        sessionStorage.setItem('adminLogado', true); // Marcar como logado
        window.location.href = '/administrador.html'; // Redirecionar
    } else {
        alert('Código inválido.');
    }
}

