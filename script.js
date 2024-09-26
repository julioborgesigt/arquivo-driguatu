document.getElementById("formulario").addEventListener("submit", function(event) {
    event.preventDefault();
    const numeroProcedimento = document.getElementById("procedimento").value;

    // Chama a função para gerar o PDF com o QR Code
    gerarPDF(numeroProcedimento);
});


function gerarPDF(numero) {
    const doc = new jsPDF(); // Inicializa o PDF

    // Texto centralizado com Arial, tamanho 22
    doc.setFont('Arial');
    doc.setFontSize(22);
    doc.text(numero, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() / 2, { align: 'center' });

    // Gera o QR Code
    const qrCodeUrl = `https://arquivo-driguatu-production.up.railway.app=${numero}`;
    const qrCodeImg = generateQRCode(qrCodeUrl);

    // Coloca o QR Code no canto superior direito
    doc.addImage(qrCodeImg, 'PNG', doc.internal.pageSize.getWidth() - 110, 10, 100, 100);

    // Salva o PDF
    doc.save(`procedimento_${numero}.pdf`);
}

function generateQRCode(text) {
    const qr = qrcode(0, 'L');
    qr.addData(text);
    qr.make();
    return qr.createDataURL();
}
