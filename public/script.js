// Função para realizar o login
// Função para realizar o login
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login realizado com sucesso") {
            alert(data.message);
            // Armazenar o nome de usuário no localStorage
            localStorage.setItem('usuarioAtivo', username);
            // Exibir a interface do app
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            document.getElementById('user-name').textContent = username;
        } else {
            alert(data.message);
        }
    })
    .catch(error => console.error('Erro ao realizar login:', error));
}



// Função para validar o formato do nome de usuário (8 caracteres alfanuméricos)
function validarUsername(username) {
    const regex = /^[a-zA-Z0-9]{8}$/; // Exatamente 8 caracteres alfanuméricos
    return regex.test(username);
}

// Função para validar o formato da senha (6 dígitos numéricos)
function validarSenha(senha) {
    const regex = /^\d{6}$/; // Exatamente 6 dígitos numéricos
    return regex.test(senha);
}

// Função para realizar o cadastro
function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validar formato do usuário
    if (!validarUsername(username)) {
        alert("O nome de usuário deve ter exatamente 8 caracteres alfanuméricos.");
        return;
    }

    // Validar formato da senha
    if (!validarSenha(password)) {
        alert("A senha deve ter exatamente 6 dígitos numéricos.");
        return;
    }

    // Verificar se o usuário está pré-registrado pelo administrador
    fetch(`/verificarUsuario?username=${username}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Usuário está pré-registrado, continuar com o cadastro
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Cadastro realizado com sucesso!");
                } else {
                    alert("Erro ao cadastrar usuário.");
                }
            });
        } else {
            alert("Usuário não pré-registrado. Por favor, contacte o administrador.");
        }
    })
    .catch(error => {
        console.error('Erro ao verificar o usuário:', error);
        alert("Erro ao verificar o usuário. Tente novamente.");
    });
}



// Função para validar o formato do número de procedimento
function validarProcedimento(numero) {
    const regex = /^\d{3}-\d{5}\/\d{4}$/; // Novo formato: xxx-xxxxx/xxxx
    return regex.test(numero);
}


// Função para gerar o PDF
function gerarPDF() {
    const numeroProcedimento = document.getElementById("procedimento").value;
    const usuarioAtivo = localStorage.getItem('usuarioAtivo'); // Pega o usuário logado

    if (!validarProcedimento(numeroProcedimento)) {
        alert("O número do procedimento deve estar no formato xxx - xxxxx / xxxx.");
        return;
    }

    if (!usuarioAtivo) {
        alert("Usuário não está logado. Por favor, faça o login novamente.");
        return;
    }

    // Salvar o número do procedimento no banco de dados com o usuário ativo
    fetch('/salvarProcedimento', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numero: numeroProcedimento, usuario: usuarioAtivo })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Gera o PDF se o procedimento foi salvo
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFont('Arial');
            doc.setFontSize(22);
            doc.text(numeroProcedimento, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center' });

            const qrCodeUrl = `https://arquivo-driguatu-production.up.railway.app/leitura?procedimento=${numeroProcedimento}`;
            const qrCodeImg = generateQRCode(qrCodeUrl);
            doc.addImage(qrCodeImg, 'PNG', doc.internal.pageSize.getWidth() - 110, 10, 100, 100);

            doc.save(`procedimento_${numeroProcedimento}.pdf`);
        } else {
            alert("Erro ao salvar o procedimento: " + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao salvar o procedimento:', error);
        alert('Erro ao salvar o procedimento. Tente novamente.');
    });
}

// Função para consultar movimentação
function consultarMovimentacao() {
    const numeroProcedimento = document.getElementById("consulta-procedimento").value;

    if (!validarProcedimento(numeroProcedimento)) {
        alert("O número do procedimento deve estar no formato xxx - xxxxx / xxxx.");
        return;
    }

    fetch(`/consultaMovimentacao?procedimento=${numeroProcedimento}`)
    .then(response => response.json())
    .then(data => {
        const resultadoDiv = document.getElementById('resultado-consulta');
        if (data.success) {
            let html = `<h3>Movimentações para o procedimento ${numeroProcedimento}:</h3><ul>`;
            data.leituras.forEach(leitura => {
                html += `<li>${leitura.usuario}, Data: ${leitura.data}, Hora: ${leitura.hora}</li>`;
            });
            html += `</ul>`;
            resultadoDiv.innerHTML = html;
        } else {
            resultadoDiv.innerHTML = `<p>${data.message}</p>`;
        }
    })
    .catch(error => {
        console.error('Erro ao consultar movimentação:', error);
        document.getElementById('resultado-consulta').innerHTML = `<p>Erro ao consultar movimentação. Tente novamente.</p>`;
    });
}


// Função para gerar QR Code
function generateQRCode(text) {
    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();
    return qr.createDataURL();
}



function lerQRCode() {
    const qrReaderElement = document.getElementById("qr-reader");

    // Ocultar os outros elementos da página
    document.getElementById("app-container").style.display = "none";

    // Mostrar o leitor de QR code em tela cheia
    qrReaderElement.style.display = "flex";
    qrReaderElement.style.justifyContent = "center";
    qrReaderElement.style.alignItems = "center";
    qrReaderElement.style.height = "100vh";  // Toda a altura da tela
    qrReaderElement.style.width = "100vw";   // Toda a largura da tela
    qrReaderElement.style.backgroundColor = "#000";  // Fundo preto para destacar o leitor

    const html5QrCode = new Html5Qrcode("qr-reader");
    let leituraEfetuada = false;  // Flag para garantir que só uma leitura seja registrada

    html5QrCode.start(
        { facingMode: "environment" },  // Câmera traseira
        {
            fps: 10,  // Taxa de quadros
            qrbox: 250,  // Tamanho do quadrado de leitura
        },
        qrCodeMessage => {
            if (!leituraEfetuada) {
                leituraEfetuada = true;  // Evita múltiplas leituras

                alert("QR Code lido com sucesso: " + qrCodeMessage);

                html5QrCode.stop();  // Para o leitor de QR code
                qrReaderElement.style.display = "none";  // Esconder o leitor
                document.getElementById("app-container").style.display = "block";  // Mostrar a página novamente
            }
        },
        errorMessage => {
            console.log(`Erro ao ler QR Code: ${errorMessage}`);
        }
    ).catch(err => {
        console.log(`Erro ao iniciar a câmera: ${err}`);
        alert("Erro ao iniciar a câmera. Verifique as permissões.");
        qrReaderElement.style.display = "none";  // Esconder o leitor se houver erro
        document.getElementById("app-container").style.display = "block";  // Mostrar a página novamente
    });
}











