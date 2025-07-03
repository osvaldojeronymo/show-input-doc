// Dados dos imóveis e locadores
const imoveis = [
    {
        id: 1,
        endereco: "Av. Paulista, 1578 - Bela Vista - São Paulo/SP",
        tipo: "Comercial",
        area: "250m²"
    },
    {
        id: 2,
        endereco: "Rua das Flores, 123 - Centro - Rio de Janeiro/RJ",
        tipo: "Residencial",
        area: "180m²"
    },
    {
        id: 3,
        endereco: "Setor Bancário Sul, Quadra 4 - Brasília/DF",
        tipo: "Comercial",
        area: "320m²"
    }
];

// Imóvel selecionado para exibição
const imovelAtual = imoveis[0];

const locadores = [
    {
        id: 1,
        nome: "João Silva Santos",
        tipo: "Pessoa Física",
        cpf: "123.456.789-01",
        documentos: {
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": true,
            "Habite-se": true,
            "Permissão Atividade Bancária": false,
            "Manifestação CILOG": false,
            "Documento de Identidade": true,
            "CND Federal": false,
            "Documento Cônjuge": true
        }
    },
    {
        id: 2,
        nome: "Maria Oliveira Lima",
        tipo: "Pessoa Física",
        cpf: "987.654.321-02",
        documentos: {
            "Matrícula do Imóvel": false,
            "Certidão Negativa IPTU": false,
            "Habite-se": true,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": true,
            "Documento de Identidade": true,
            "CND Federal": true,
            "Documento Cônjuge": false
        }
    },
    {
        id: 3,
        nome: "Imobiliária Prime LTDA",
        tipo: "Pessoa Jurídica",
        cnpj: "12.345.678/0001-90",
        documentos: {
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": true,
            "Habite-se": false,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": false,
            "CNPJ": true,
            "Ato Constitutivo": true,
            "Certidão Junta Comercial": false,
            "CND Federal": true,
            "Certidão FGTS": false,
            "Procuração": true,
            "Documento Representante": true
        }
    },
    {
        id: 4,
        nome: "Carlos Eduardo Ferreira",
        tipo: "Pessoa Física",
        cpf: "456.789.123-03",
        documentos: {
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": false,
            "Habite-se": true,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": false,
            "Documento de Identidade": true,
            "CND Federal": false,
            "Documento Cônjuge": false
        }
    },
    {
        id: 5,
        nome: "Ana Paula Costa",
        tipo: "Pessoa Física",
        cpf: "789.123.456-04",
        documentos: {
            // Documentação do Imóvel
            "Matrícula do Imóvel": false,
            "Certidão Negativa IPTU": true,
            "Habite-se": false,
            "Permissão Atividade Bancária": false,
            "Manifestação CILOG": true,
            // Documentação do Locador - Pessoa Física
            "Documento de Identidade": true,
            "CND Federal": true,
            "Documento Cônjuge": true
        }
    },
    {
        id: 6,
        nome: "Construtora Beta S.A.",
        tipo: "Pessoa Jurídica",
        cnpj: "98.765.432/0001-10",
        documentos: {
            // Documentação do Imóvel
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": true,
            "Habite-se": true,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": false,
            // Documentação do Locador - Pessoa Jurídica
            "CNPJ": true,
            "Ato Constitutivo": false,
            "Certidão Junta Comercial": true,
            "CND Federal": false,
            "Certidão FGTS": true,
            // Documentação do Representante Legal
            "Procuração": false,
            "Documento Representante": true
        }
    },
    {
        id: 7,
        nome: "Roberto Silva Machado",
        tipo: "Pessoa Física",
        cpf: "321.654.987-05",
        documentos: {
            // Documentação do Imóvel
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": true,
            "Habite-se": true,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": false,
            // Documentação do Locador - Pessoa Física
            "Documento de Identidade": true,
            "CND Federal": true,
            "Documento Cônjuge": false
        }
    },
    {
        id: 8,
        nome: "Fernanda Santos Almeida",
        tipo: "Pessoa Física",
        cpf: "654.321.789-06",
        documentos: {
            // Documentação do Imóvel
            "Matrícula do Imóvel": false,
            "Certidão Negativa IPTU": false,
            "Habite-se": true,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": true,
            // Documentação do Locador - Pessoa Física
            "Documento de Identidade": true,
            "CND Federal": false,
            "Documento Cônjuge": true
        }
    },
    {
        id: 9,
        nome: "Empreendimentos Gama LTDA",
        tipo: "Pessoa Jurídica",
        cnpj: "11.222.333/0001-44",
        documentos: {
            // Documentação do Imóvel
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": false,
            "Habite-se": false,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": false,
            // Documentação do Locador - Pessoa Jurídica
            "CNPJ": true,
            "Ato Constitutivo": true,
            "Certidão Junta Comercial": true,
            "CND Federal": true,
            "Certidão FGTS": false,
            // Documentação do Representante Legal
            "Procuração": true,
            "Documento Representante": false
        }
    },
    {
        id: 10,
        nome: "Luciana Pereira Nunes",
        tipo: "Pessoa Física",
        cpf: "147.258.369-07",
        documentos: {
            // Documentação do Imóvel
            "Matrícula do Imóvel": true,
            "Certidão Negativa IPTU": true,
            "Habite-se": true,
            "Permissão Atividade Bancária": true,
            "Manifestação CILOG": false,
            // Documentação do Locador - Pessoa Física
            "Documento de Identidade": true,
            "CND Federal": true,
            "Documento Cônjuge": true
        }
    }
];

let paginaAtual = 1;
let itensPorPagina = 10;

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - iniciando aplicação...');
    console.log('Total de locadores:', locadores.length);
    
    // Configurar evento do select de itens por página
    const selectElement = document.getElementById('itensPorPaginaSelect');
    if (selectElement) {
        selectElement.addEventListener('change', (e) => {
            itensPorPagina = parseInt(e.target.value);
            paginaAtual = 1;
            atualizarTabela();
        });
    }
    
    // Atualizar informações do imóvel
    const imovelInfoElement = document.querySelector('.imovel-info');
    if (imovelInfoElement) {
        imovelInfoElement.innerHTML = 
            `<strong>Imóvel ${imovelAtual.id}:</strong> ${imovelAtual.endereco} - ${imovelAtual.tipo} (${imovelAtual.area})`;
    }
    
    // Carregar tabela inicial
    atualizarTabela();
});

function atualizarTabela() {
    console.log('Atualizando tabela...');
    
    const tbody = document.getElementById('tabelaLocadores');
    if (!tbody) {
        console.error('Elemento tabelaLocadores não encontrado!');
        return;
    }
    
    tbody.innerHTML = '';

    const totalPaginas = Math.ceil(locadores.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const paginaItens = locadores.slice(inicio, fim);
    
    console.log(`Página ${paginaAtual} de ${totalPaginas} - Mostrando ${paginaItens.length} itens`);

    paginaItens.forEach(locador => {
        const row = document.createElement('tr');
        
        // Coluna com informações do locador
        const locadorInfo = `
            <div class="locador-info">
                <div class="locador-nome">${locador.nome}</div>
                <div class="locador-tipo">${locador.tipo}</div>
                <div class="locador-documento">${locador.tipo === 'Pessoa Física' ? locador.cpf : locador.cnpj}</div>
            </div>
        `;
        
        // Documentos organizados por categoria
        let docHtml = '';
        
        // Separar documentos por categoria
        const docsImovel = [];
        const docsLocador = [];
        const docsRepresentante = [];
        
        for (let doc in locador.documentos) {
            if (doc.includes('Matrícula') || doc.includes('IPTU') || doc.includes('Habite') || 
                doc.includes('Permissão') || doc.includes('Manifestação')) {
                docsImovel.push(doc);
            } else if (doc.includes('Procuração') || doc.includes('Representante')) {
                docsRepresentante.push(doc);
            } else {
                docsLocador.push(doc);
            }
        }
        
        // Função para criar grupo de documentos
        const criarGrupoDocumentos = (titulo, documentos, cor) => {
            if (documentos.length === 0) return '';
            
            let grupoHtml = `<div class="documento-grupo">
                <div class="grupo-titulo" style="color: ${cor};">📋 ${titulo}</div>`;
            
            documentos.forEach(doc => {
                const isEntregue = locador.documentos[doc];
                const statusClass = isEntregue ? 'entregue' : 'pendente';
                const statusText = isEntregue ? 'Documento entregue' : 'Documento não entregue';
                const clickable = !isEntregue ? `onclick="uploadDocumento(${locador.id}, '${doc}')"` : '';
                const cursor = !isEntregue ? 'clickable' : 'completed';
                
                grupoHtml += `
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
            });
            
            grupoHtml += '</div>';
            return grupoHtml;
        };
        
        // Criar grupos de documentos
        docHtml += criarGrupoDocumentos('Documentação do Imóvel', docsImovel, '#0066cc');
        docHtml += criarGrupoDocumentos('Documentação do Locador', docsLocador, '#28a745');
        if (docsRepresentante.length > 0) {
            docHtml += criarGrupoDocumentos('Representante Legal', docsRepresentante, '#dc3545');
        }
        
        row.innerHTML = `<td>${locador.id}</td><td>${locadorInfo}</td><td class="documents-cell">${docHtml}</td>`;
        tbody.appendChild(row);
    });

    // Atualizar informações de paginação
    const paginationInfo = document.getElementById('pagination-info');
    if (paginationInfo) {
        paginationInfo.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
    }
    
    const paginationButtons = document.getElementById('pagination-buttons');
    if (paginationButtons) {
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
    
    console.log('Tabela atualizada com sucesso!');
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
