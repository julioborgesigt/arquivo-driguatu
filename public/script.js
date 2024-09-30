
// Função para realizar login
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
            alert("Erro no login: " + data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao realizar login:', error);
        alert('Erro ao realizar login. Verifique a conexão.');
    });
}



// Função para realizar o cadastro
function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
}


// Função para gerar o PDF
// Função para gerar o PDF
function gerarPDF() {
    const numeroProcedimento = document.getElementById("procedimento").value;
    const usuarioAtivo = localStorage.getItem('usuarioAtivo'); // Pega o usuário logado

    if (!numeroProcedimento) {
        alert("Por favor, insira o número do procedimento.");
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


// Função para gerar QR Code
function generateQRCode(text) {
    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();
    return qr.createDataURL();
}



// Função para ler QR Code
function lerQRCode() {
    const qrReaderElement = document.getElementById("qr-reader");
    const usuarioAtivo = localStorage.getItem('usuarioAtivo'); // Pega o usuário logado

    if (!usuarioAtivo) {
        alert("Usuário não está logado. Por favor, faça o login novamente.");
        return;
    }

    qrReaderElement.style.display = "block"; // Mostrar o leitor de QR code
    const html5QrCode = new Html5Qrcode("qr-reader");
    let leituraEfetuada = false; // Flag para garantir que só uma leitura seja registrada

    html5QrCode.start(
        { facingMode: "environment" },  // Câmera traseira
        {
            fps: 10,  // Taxa de quadros
            qrbox: { width: 250, height: 250 }  // Tamanho da caixa de leitura
        },
        qrCodeMessage => {
            if (!leituraEfetuada) {
                leituraEfetuada = true; // Marca como já lido para evitar múltiplas leituras

                fetch('/leitura', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ qrCodeMessage, usuario: usuarioAtivo })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message); // Exibe mensagem de sucesso
                        window.location.href = `/comprovante?procedimento=${qrCodeMessage}`;
                    } else {
                        alert("Erro: " + data.message); // Exibe mensagem de erro
                    }
                    html5QrCode.stop(); // Para o leitor de QR code
                    qrReaderElement.style.display = "none"; // Esconder o leitor
                })
                .catch(error => {
                    console.error('Erro ao registrar leitura:', error);
                    alert('Erro ao registrar leitura. Tente novamente.');
                    html5QrCode.stop();
                    qrReaderElement.style.display = "none";
                });
            }
        },
        errorMessage => {
            console.log(`Erro ao ler QR Code: ${errorMessage}`);
        }
    ).catch(err => {
        console.log(`Erro ao iniciar a câmera: ${err}`);
    });
}








