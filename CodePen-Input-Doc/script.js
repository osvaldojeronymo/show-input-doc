// Dados do imóvel e locadores
const imovel = {
    id: 1,
    endereco: "Rua das Flores, 123 - Centro - São Paulo/SP"
};

const locadores = [];
for (let i = 1; i <= 10; i++) {
    locadores.push({
        id: i,
        nome: `Locador ${i}`,
        cpf: `***.***.***-${i.toString().padStart(2, '0')}`,
        documentos: {
            'Matrícula do Imóvel': i <= 3 ? true : false,
            'IPTU': i <= 2 ? true : false,
            'Habite-se': i <= 1 ? true : false
        }
    });
}

let paginaAtual = 1;
let itensPorPagina = 10;

document.getElementById('itensPorPaginaSelect').addEventListener('change', (e) => {
    itensPorPagina = parseInt(e.target.value);
    paginaAtual = 1;
    atualizarTabela();
});

// Atualizar informações do imóvel na interface
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.imovel-info').innerHTML = 
        `<strong>Imóvel ID ${imovel.id}:</strong> ${imovel.endereco}`;
    atualizarTabela();
});

function atualizarTabela() {
    const tbody = document.getElementById('tabelaLocadores');
    tbody.innerHTML = '';

    const totalPaginas = Math.ceil(locadores.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const paginaItens = locadores.slice(inicio, fim);

    paginaItens.forEach(locador => {
        const row = document.createElement('tr');
        let docHtml = '';
        for (let doc in locador.documentos) {
            const isEntregue = locador.documentos[doc];
            const statusClass = isEntregue ? 'entregue' : 'pendente';
            const statusText = isEntregue ? 'Documento entregue' : 'Documento não entregue';
            const clickable = !isEntregue ? `onclick="uploadDocumento(${locador.id}, '${doc}')"` : '';
            const cursor = !isEntregue ? 'clickable' : 'completed';
            
            docHtml += `
            <div class="document-dropbox ${cursor}" ${clickable}>
                <div class="document-header">
                    <span class="document-icon">📁</span>
                    <span class="document-name">${doc}</span>
                    <span class="status-indicator ${statusClass}">●</span>
                </div>
                <div class="document-status">
                    <span class="status-text ${statusClass}">${statusText}</span>
                    ${!isEntregue ? '<span class="upload-hint">(clicável para upload)</span>' : ''}
                </div>
            </div>`;
        }
        row.innerHTML = `<td>${locador.id}</td><td>${locador.nome}</td><td class="documents-cell">${docHtml}</td>`;
        tbody.appendChild(row);
    });

function atualizarTabela() {
    const tbody = document.getElementById('tabelaLocadores');
    tbody.innerHTML = '';

    const totalPaginas = Math.ceil(locadores.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const paginaItens = locadores.slice(inicio, fim);

    paginaItens.forEach(locador => {
        const row = document.createElement('tr');
        let docHtml = '';
        for (let doc in locador.documentos) {
            const isEntregue = locador.documentos[doc];
            const statusClass = isEntregue ? 'entregue' : 'pendente';
            const statusText = isEntregue ? 'Documento entregue' : 'Documento não entregue';
            const clickable = !isEntregue ? `onclick="uploadDocumento(${locador.id}, '${doc}')"` : '';
            const cursor = !isEntregue ? 'clickable' : 'completed';
            
            docHtml += `
            <div class="document-dropbox ${cursor}" ${clickable}>
                <div class="document-header">
                    <span class="document-icon">📁</span>
                    <span class="document-name">${doc}</span>
                    <span class="status-indicator ${statusClass}">●</span>
                </div>
                <div class="document-status">
                    <span class="status-text ${statusClass}">${statusText}</span>
                    ${!isEntregue ? '<span class="upload-hint">(clicável para upload)</span>' : ''}
                </div>
            </div>`;
        }
        row.innerHTML = `<td>${locador.id}</td><td>${locador.nome}</td><td class="documents-cell">${docHtml}</td>`;
        tbody.appendChild(row);
    });

    document.getElementById('pagination-info').textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    const paginationButtons = document.getElementById('pagination-buttons');
    paginationButtons.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Anterior';
    prevBtn.className = 'pagination-button';
    prevBtn.disabled = paginaAtual === 1;
    prevBtn.onclick = () => { paginaAtual--; atualizarTabela(); };

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Próxima';
    nextBtn.className = 'pagination-button';
    nextBtn.disabled = paginaAtual === totalPaginas;
    nextBtn.onclick = () => { paginaAtual++; atualizarTabela(); };

    paginationButtons.appendChild(prevBtn);
    paginationButtons.appendChild(nextBtn);
}

function uploadDocumento(id, doc) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '*/*';
    input.onchange = () => {
        if (input.files.length > 0) {
            const locador = locadores.find(l => l.id === id);
            locador.documentos[doc] = true;
            atualizarTabela();
            alert(`Documento "${doc}" entregue para ${locador.nome}`);
        }
    };
    input.click();
}
