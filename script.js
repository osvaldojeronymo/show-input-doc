const locadores = [];
for (let i = 1; i <= 25; i++) {
    locadores.push({
        id: i,
        nome: `Locador ${i}`,
        documentos: {
            'Documento de Identidade': false,
            'CPF': false,
            'Comprovante de Residência': false,
            'CND Federal': false
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
            docHtml += `
            <div class="upload-box" onclick="uploadDocumento(${locador.id}, '${doc}')">
                ${doc}
                <span class="status ${locador.documentos[doc] ? 'entregue' : 'pendente'}">
                    ${locador.documentos[doc] ? 'Documento entregue' : 'Documento não entregue'}
                </span>
            </div>`;
        }
        row.innerHTML = `<td>${locador.id}</td><td>${locador.nome}</td><td>${docHtml}</td>`;
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

atualizarTabela();
