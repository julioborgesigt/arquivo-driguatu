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


/*

// Função para enviar o código ao e-mail
function enviarCodigo() {
    const email = document.getElementById('admin-email').value;
    
    if (email === 'julio.aparecido3@gmail.com') {
        // Gerar código aleatório de 6 dígitos
        codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();

        // Fazer a requisição POST para o servidor enviar o e-mail
        fetch('/enviar-codigo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, codigo: codigoGerado })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('O código foi enviado para o e-mail ' + email);
                // Exibir o campo para inserir o código
                document.getElementById('email-form').style.display = 'none';
                document.getElementById('codigo-form').style.display = 'block';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Erro ao enviar o código:', error);
            alert('Erro ao enviar o código. Tente novamente.');
        });
    } else {
        alert('E-mail inválido.');
    }
}

*/

