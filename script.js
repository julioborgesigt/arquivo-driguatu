document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();  // Evita o comportamento padrão do formulário
    
    const numeroProcedimento = document.getElementById("procedimento").value;

    if (!numeroProcedimento) {
        alert("Por favor, insira o número do procedimento.");
        return;
    }

    // Chama a função para gerar o PDF com o QR Code
    gerarPDF(numeroProcedimento);
});

function gerarPDF(numero) {
    const doc = new jsPDF();  // Inicializa o PDF

    // Adiciona o texto do número do procedimento (Arial 22, centralizado)
    doc.setFont('Arial');
    doc.setFontSize(22);
    doc.text(numero, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center' });

    // Gera o QR Code
    const qrCodeUrl = `https://arquivo-driguatu-production.up.railway.app/leitura?procedimento=${numero}`;
    const qrCodeImg = generateQRCode(qrCodeUrl);

    // Adiciona o QR Code no canto superior direito (100x100)
    doc.addImage(qrCodeImg, 'PNG', doc.internal.pageSize.getWidth() - 110, 10, 100, 100);

    // Salva o PDF
    doc.save(`procedimento_${numero}.pdf`);
}

function generateQRCode(text) {
    const qr = qrcode(0, 'L');  // Inicializa o QR Code
    qr.addData(text);  // Adiciona o texto (URL) ao QR Code
    qr.make();  // Gera o QR Code
    return qr.createDataURL();  // Retorna a imagem do QR Code
}
