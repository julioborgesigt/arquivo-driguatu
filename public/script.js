// Função para realizar o login
function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById("auth-container").style.display = "none";
            document.getElementById("app-container").style.display = "block";
            document.getElementById("user-name").innerText = data.user.username;
        } else {
            alert("Usuário ou senha incorretos");
        }
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
function gerarPDF() {
    const numeroProcedimento = document.getElementById("procedimento").value;

    if (!numeroProcedimento) {
        alert("Por favor, insira o número do procedimento.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont('Arial');
    doc.setFontSize(22);
    doc.text(numeroProcedimento, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center' });

    const qrCodeUrl = `https://arquivo-driguatu-production.up.railway.app/leitura?procedimento=${numeroProcedimento}`;
    const qrCodeImg = generateQRCode(qrCodeUrl);
    doc.addImage(qrCodeImg, 'PNG', doc.internal.pageSize.getWidth() - 110, 10, 100, 100);
    doc.save(`procedimento_${numeroProcedimento}.pdf`);
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
    qrReaderElement.style.display = "block"; // Mostrar o leitor de QR code

    const html5QrCode = new Html5Qrcode("qr-reader"); // Iniciando o leitor de QR code
    html5QrCode.start(
        { facingMode: "environment" },  // Abre a câmera traseira
        {
            fps: 10,  // Taxa de quadros por segundo
            qrbox: { width: 250, height: 250 }  // Tamanho da área de leitura
        },
        qrCodeMessage => {
            fetch('/leitura', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ qrCodeMessage })
            }).then(response => response.json()).then(data => {
                alert("QR Code lido com sucesso!");
                html5QrCode.stop();
                qrReaderElement.style.display = "none"; // Esconder o leitor
            });
        },
        errorMessage => {
            console.log(`QR Code não detectado: ${errorMessage}`);
        }
    ).catch(err => {
        console.log(`Erro ao iniciar a câmera: ${err}`);
    });
}

