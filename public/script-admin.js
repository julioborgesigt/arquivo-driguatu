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

// Variável global para armazenar o código gerado
let codigoGerado = '';

// Função para enviar o código ao e-mail
function enviarCodigo() {
    const email = document.getElementById('admin-email').value;
    
    if (email === 'julio.aparecido3@gmail.com') {
        // Gerar código aleatório de 6 dígitos
        codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();

        // Simulação de envio de e-mail
        alert('O código foi enviado para o e-mail ' + email + '. Código: ' + codigoGerado);

        // Exibir o campo para inserir o código
        document.getElementById('email-form').style.display = 'none';
        document.getElementById('codigo-form').style.display = 'block';
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

