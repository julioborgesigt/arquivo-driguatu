// Função chamada quando o botão "Gerar PDF" é clicado
function gerarPDF() {
    const numeroProcedimento = document.getElementById("procedimento").value;

    if (!numeroProcedimento) {
        alert("Por favor, insira o número do procedimento.");
        return;
    }

    // Inicializa o jsPDF
    const doc = new jsPDF();

    // Adiciona o número do procedimento no centro da página (Arial 22)
    doc.setFont('Arial');
    doc.setFontSize(22);
    doc.text(numeroProcedimento, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center' });

    // Gera a URL para o QR Code
    const qrCodeUrl = `https://arquivo-driguatu-production.up.railway.app/leitura?procedimento=${numeroProcedimento}`;

    // Gera o QR Code
    const qrCodeImg = generateQRCode(qrCodeUrl);

    // Adiciona o QR Code no PDF (canto superior direito)
    doc.addImage(qrCodeImg, 'PNG', doc.internal.pageSize.getWidth() - 110, 10, 100, 100);

    // Salva o PDF
    doc.save(`procedimento_${numeroProcedimento}.pdf`);
}

// Função para gerar o QR Code
function generateQRCode(text) {
    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();
    return qr.createDataURL();
}
