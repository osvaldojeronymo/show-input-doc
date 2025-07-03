// Sistema Integrado de Cadastro de Imóveis e Locadores com Upload de Documentos
class SistemaIntegrado {
    constructor() {
        // Dados iniciais do sistema original
        this.imoveis = [
            {
                id: 1,
                endereco: "Av. Paulista, 1578 - Bela Vista - São Paulo/SP",
                tipo: "Comercial",
                area: "250m²",
                status: "Ativo"
            },
            {
                id: 2,
                endereco: "Rua das Flores, 123 - Centro - Rio de Janeiro/RJ",
                tipo: "Residencial",
                area: "180m²",
                status: "Ativo"
            },
            {
                id: 3,
                endereco: "Setor Bancário Sul, Quadra 4 - Brasília/DF",
                tipo: "Comercial",
                area: "320m²",
                status: "Ativo"
            }
        ];

        this.locadores = [
            {
                id: 1,
                nome: "João Silva Santos",
                tipo: "Pessoa Física",
                cpf: "123.456.789-01",
                imovelId: 1,
                status: "Ativo",
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
                imovelId: 1,
                status: "Ativo",
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
                imovelId: 2,
                status: "Ativo",
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
            }
        ];

        this.imovelSelecionado = this.imoveis[0]; // Seleciona o primeiro imóvel por padrão
        this.proximoIdImovel = 4;
        this.proximoIdLocador = 4;
        
        // Configurações de paginação e UX
        this.paginaAtual = 1;
        this.itensPorPagina = 10;
        this.filtros = {
            busca: '',
            tipo: '',
            status: ''
        };
        this.visualizacaoAtual = 'table'; // 'table' ou 'cards'
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderTabelaImoveis();
        this.atualizarTabela();
        this.updateLocadoresInfo();
    }
    
    setupEventListeners() {
        // Cadastro de imóveis
        document.getElementById('adicionarImovel').addEventListener('click', () => {
            this.adicionarImovel();
        });
        
        document.getElementById('enderecoImovel').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.adicionarImovel();
            }
        });
        
        // Cadastro de locadores
        document.getElementById('adicionarLocador').addEventListener('click', () => {
            this.adicionarLocador();
        });
        
        document.getElementById('nomeLocador').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.adicionarLocador();
            }
        });

        // Paginação
        const selectItens = document.getElementById('itensPorPaginaSelect');
        if (selectItens) {
            selectItens.addEventListener('change', (e) => {
                this.itensPorPagina = parseInt(e.target.value);
                this.paginaAtual = 1;
                this.atualizarTabela();
            });
        }

        // Busca e Filtros
        document.getElementById('buscaLocador').addEventListener('input', (e) => {
            this.filtros.busca = e.target.value.toLowerCase();
            this.paginaAtual = 1;
            this.atualizarTabela();
        });

        document.getElementById('filtroTipo').addEventListener('change', (e) => {
            this.filtros.tipo = e.target.value;
            this.paginaAtual = 1;
            this.atualizarTabela();
        });

        document.getElementById('filtroStatus').addEventListener('change', (e) => {
            this.filtros.status = e.target.value;
            this.paginaAtual = 1;
            this.atualizarTabela();
        });

        document.getElementById('limparFiltros').addEventListener('click', () => {
            this.filtros = { busca: '', tipo: '', status: '' };
            document.getElementById('buscaLocador').value = '';
            document.getElementById('filtroTipo').value = '';
            document.getElementById('filtroStatus').value = '';
            this.paginaAtual = 1;
            this.atualizarTabela();
        });

        // Toggle de Visualização
        document.getElementById('viewTable').addEventListener('click', () => {
            this.alterarVisualizacao('table');
        });

        document.getElementById('viewCards').addEventListener('click', () => {
            this.alterarVisualizacao('cards');
        });
    }
    
    adicionarImovel() {
        const enderecoInput = document.getElementById('enderecoImovel');
        const endereco = enderecoInput.value.trim();
        
        if (!endereco) {
            alert('Por favor, digite o endereço do imóvel.');
            return;
        }
        
        const novoImovel = {
            id: this.proximoIdImovel++,
            endereco: endereco,
            tipo: "Não informado",
            area: "Não informado",
            status: 'Ativo'
        };
        
        this.imoveis.push(novoImovel);
        enderecoInput.value = '';
        this.renderTabelaImoveis();
    }
    
    adicionarLocador() {
        if (!this.imovelSelecionado) {
            alert('Por favor, selecione um imóvel primeiro.');
            return;
        }
        
        const nomeInput = document.getElementById('nomeLocador');
        const tipoSelect = document.getElementById('tipoLocador');
        
        const nome = nomeInput.value.trim();
        const tipo = tipoSelect.value;
        
        if (!nome) {
            alert('Por favor, digite o nome do locador.');
            return;
        }

        // Documentos padrão baseados no tipo
        const documentosPadrao = tipo === "Pessoa Física" ? {
            "Matrícula do Imóvel": false,
            "Certidão Negativa IPTU": false,
            "Habite-se": false,
            "Permissão Atividade Bancária": false,
            "Manifestação CILOG": false,
            "Documento de Identidade": false,
            "CND Federal": false,
            "Documento Cônjuge": false
        } : {
            "Matrícula do Imóvel": false,
            "Certidão Negativa IPTU": false,
            "Habite-se": false,
            "Permissão Atividade Bancária": false,
            "Manifestação CILOG": false,
            "CNPJ": false,
            "Ato Constitutivo": false,
            "Certidão Junta Comercial": false,
            "CND Federal": false,
            "Certidão FGTS": false,
            "Procuração": false,
            "Documento Representante": false
        };
        
        const novoLocador = {
            id: this.proximoIdLocador++,
            nome: nome,
            tipo: tipo,
            imovelId: this.imovelSelecionado.id,
            status: 'Ativo',
            documentos: documentosPadrao
        };

        if (tipo === "Pessoa Física") {
            novoLocador.cpf = "000.000.000-00"; // CPF padrão para ser editado
        } else {
            novoLocador.cnpj = "00.000.000/0000-00"; // CNPJ padrão para ser editado
        }
        
        this.locadores.push(novoLocador);
        nomeInput.value = '';
        this.atualizarTabela();
    }
    
    selecionarImovel(imovelId) {
        this.imovelSelecionado = this.imoveis.find(imovel => imovel.id === imovelId);
        this.paginaAtual = 1; // Reset pagination
        this.renderTabelaImoveis();
        this.atualizarTabela();
        this.updateLocadoresInfo();
    }
    
    removerImovel(imovelId) {
        if (confirm('Tem certeza que deseja remover este imóvel? Todos os locadores vinculados também serão removidos.')) {
            this.imoveis = this.imoveis.filter(imovel => imovel.id !== imovelId);
            this.locadores = this.locadores.filter(locador => locador.imovelId !== imovelId);
            
            if (this.imovelSelecionado && this.imovelSelecionado.id === imovelId) {
                this.imovelSelecionado = this.imoveis.length > 0 ? this.imoveis[0] : null;
            }
            
            this.renderTabelaImoveis();
            this.atualizarTabela();
            this.updateLocadoresInfo();
        }
    }
    
    removerLocador(locadorId) {
        if (confirm('Tem certeza que deseja remover este locador?')) {
            this.locadores = this.locadores.filter(locador => locador.id !== locadorId);
            this.atualizarTabela();
        }
    }
    
    renderTabelaImoveis() {
        const tbody = document.getElementById('tabelaImoveis');
        
        if (this.imoveis.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #999; font-style: italic;">
                        Nenhum imóvel cadastrado
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.imoveis.map(imovel => `
            <tr class="${this.imovelSelecionado && this.imovelSelecionado.id === imovel.id ? 'selected-row' : ''}">
                <td>${imovel.id}</td>
                <td>${imovel.endereco}</td>
                <td>
                    <span class="status-badge ${this.imovelSelecionado && this.imovelSelecionado.id === imovel.id ? 'selecionado' : 'ativo'}">
                        ${this.imovelSelecionado && this.imovelSelecionado.id === imovel.id ? 'Selecionado' : imovel.status}
                    </span>
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-primary btn-sm" onclick="sistema.selecionarImovel(${imovel.id})">
                            Selecionar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="sistema.removerImovel(${imovel.id})">
                            Remover
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Função original de atualização de tabela com documentos
    atualizarTabela() {
        if (!this.imovelSelecionado) {
            this.mostrarControlesUX(false);
            const tbody = document.getElementById('tabelaLocadores');
            tbody.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align: center; color: #999; font-style: italic;">
                        Selecione um imóvel para visualizar os locadores
                    </td>
                </tr>
            `;
            return;
        }

        // Filtrar locadores do imóvel selecionado
        let locadoresDoImovel = this.locadores.filter(locador => locador.imovelId === this.imovelSelecionado.id);
        
        // Mostrar controles UX se houver mais de 3 locadores
        const mostrarControles = locadoresDoImovel.length > 3;
        this.mostrarControlesUX(mostrarControles);
        
        // Atualizar dashboard
        if (mostrarControles) {
            this.atualizarDashboard(locadoresDoImovel);
        }
        
        // Aplicar filtros
        locadoresDoImovel = this.aplicarFiltros(locadoresDoImovel);
        
        if (locadoresDoImovel.length === 0) {
            if (this.visualizacaoAtual === 'cards') {
                this.renderCards([]);
            } else {
                const tbody = document.getElementById('tabelaLocadores');
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" style="text-align: center; color: #999; font-style: italic;">
                            Nenhum locador encontrado com os filtros aplicados
                        </td>
                    </tr>
                `;
            }
            this.atualizarPaginacao(0, 0);
            return;
        }

        // Paginação
        const totalItens = locadoresDoImovel.length;
        const totalPaginas = Math.ceil(totalItens / this.itensPorPagina);
        const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
        const fim = inicio + this.itensPorPagina;
        const locadoresPagina = locadoresDoImovel.slice(inicio, fim);

        // Renderizar conforme a visualização atual
        if (this.visualizacaoAtual === 'cards') {
            this.renderCards(locadoresPagina);
        } else {
            this.renderTabela(locadoresPagina);
        }

        // Atualizar paginação
        this.atualizarPaginacao(totalItens, totalPaginas);
    }

    renderTabela(locadores) {
        const tbody = document.getElementById('tabelaLocadores');
        tbody.innerHTML = '';

        locadores.forEach(locador => {
            const row = document.createElement('tr');
            
            // Informações do locador
            const documento = locador.cpf || locador.cnpj || 'Não informado';
            const locadorInfo = `
                <div class="locador-info">
                    <div class="locador-nome">${locador.nome}</div>
                    <div class="locador-tipo">${locador.tipo}</div>
                    <div class="locador-documento">${documento}</div>
                    <button class="btn btn-danger btn-sm" onclick="sistema.removerLocador(${locador.id})" style="margin-top: 0.5rem;">
                        Remover
                    </button>
                </div>
            `;
            
            // Documentos organizados por grupos
            let docHtml = '';
            
            const criarGrupoDocumentos = (titulo, documentos, cor) => {
                if (documentos.length === 0) return '';
                
                let grupoHtml = `<div class="documento-grupo">
                    <div class="grupo-titulo" style="color: ${cor};">${titulo}</div>`;
                
                documentos.forEach(doc => {
                    const isEntregue = locador.documentos[doc];
                    const statusClass = isEntregue ? 'entregue' : 'pendente';
                    const statusText = isEntregue ? 'Entregue' : 'Pendente';
                    const clickable = !isEntregue ? 'clickable' : 'completed';
                    const onClick = !isEntregue ? `onclick="sistema.uploadDocumento(${locador.id}, '${doc}')"` : '';
                    
                    grupoHtml += `
                        <div class="document-dropbox ${clickable}" ${onClick}>
                            <div class="document-header">
                                <span class="document-icon">${isEntregue ? '✅' : '📄'}</span>
                                <span class="document-name">${doc}</span>
                                <span class="status-indicator ${statusClass}">${isEntregue ? '✓' : '!'}</span>
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
            
            // Separar documentos por categoria
            const docsImovel = ['Matrícula do Imóvel', 'Certidão Negativa IPTU', 'Habite-se', 'Permissão Atividade Bancária', 'Manifestação CILOG'];
            const docsLocador = locador.tipo === 'Pessoa Física' 
                ? ['Documento de Identidade', 'CND Federal', 'Documento Cônjuge']
                : ['CNPJ', 'Ato Constitutivo', 'Certidão Junta Comercial', 'CND Federal', 'Certidão FGTS'];
            const docsRepresentante = locador.tipo === 'Pessoa Jurídica' 
                ? ['Procuração', 'Documento Representante'] 
                : [];
            
            // Filtrar apenas documentos que existem para este locador
            const docsImovelFiltrados = docsImovel.filter(doc => locador.documentos.hasOwnProperty(doc));
            const docsLocadorFiltrados = docsLocador.filter(doc => locador.documentos.hasOwnProperty(doc));
            const docsRepresentanteFiltrados = docsRepresentante.filter(doc => locador.documentos.hasOwnProperty(doc));
            
            // Criar grupos de documentos
            docHtml += criarGrupoDocumentos('Documentação do Imóvel', docsImovelFiltrados, '#0066cc');
            docHtml += criarGrupoDocumentos('Documentação do Locador', docsLocadorFiltrados, '#28a745');
            if (docsRepresentanteFiltrados.length > 0) {
                docHtml += criarGrupoDocumentos('Representante Legal', docsRepresentanteFiltrados, '#dc3545');
            }
            
            row.innerHTML = `<td>${locador.id}</td><td>${locadorInfo}</td><td class="documents-cell">${docHtml}</td>`;
            tbody.appendChild(row);
        });
    }

    atualizarPaginacao(totalItens, totalPaginas) {
        // Atualizar informações de paginação
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = totalPaginas > 0 ? `Página ${this.paginaAtual} de ${totalPaginas}` : '';
        }
        
        // Atualizar informações de resultados
        const resultadosInfo = document.getElementById('resultadosInfo');
        if (resultadosInfo) {
            if (totalItens > 0) {
                const inicio = (this.paginaAtual - 1) * this.itensPorPagina + 1;
                const fim = Math.min(inicio + this.itensPorPagina - 1, totalItens);
                resultadosInfo.textContent = `Mostrando ${inicio}-${fim} de ${totalItens}`;
            } else {
                resultadosInfo.textContent = '';
            }
        }
        
        const paginationButtons = document.getElementById('pagination-buttons');
        if (paginationButtons) {
            paginationButtons.innerHTML = '';

            // Botão Anterior
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '‹ Anterior';
            prevBtn.className = 'pagination-button';
            prevBtn.disabled = this.paginaAtual === 1 || totalPaginas === 0;
            prevBtn.onclick = () => { this.paginaAtual--; this.atualizarTabela(); };

            // Botão Próximo
            const nextBtn = document.createElement('button');
            nextBtn.textContent = 'Próxima ›';
            nextBtn.className = 'pagination-button';
            nextBtn.disabled = this.paginaAtual === totalPaginas || totalPaginas === 0;
            nextBtn.onclick = () => { this.paginaAtual++; this.atualizarTabela(); };

            // Números das páginas (para muitas páginas, mostrar apenas algumas)
            const numbersContainer = document.createElement('div');
            numbersContainer.className = 'pagination-numbers';
            
            if (totalPaginas <= 7) {
                // Mostrar todas as páginas
                for (let i = 1; i <= totalPaginas; i++) {
                    this.criarBotaoPagina(numbersContainer, i, i === this.paginaAtual);
                }
            } else {
                // Mostrar páginas com reticências
                this.criarBotaoPagina(numbersContainer, 1, this.paginaAtual === 1);
                
                if (this.paginaAtual > 3) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.className = 'pagination-ellipsis';
                    numbersContainer.appendChild(ellipsis);
                }
                
                const start = Math.max(2, this.paginaAtual - 1);
                const end = Math.min(totalPaginas - 1, this.paginaAtual + 1);
                
                for (let i = start; i <= end; i++) {
                    this.criarBotaoPagina(numbersContainer, i, i === this.paginaAtual);
                }
                
                if (this.paginaAtual < totalPaginas - 2) {
                    const ellipsis = document.createElement('span');
                    ellipsis.textContent = '...';
                    ellipsis.className = 'pagination-ellipsis';
                    numbersContainer.appendChild(ellipsis);
                }
                
                this.criarBotaoPagina(numbersContainer, totalPaginas, this.paginaAtual === totalPaginas);
            }

            paginationButtons.appendChild(prevBtn);
            paginationButtons.appendChild(numbersContainer);
            paginationButtons.appendChild(nextBtn);
        }
    }

    criarBotaoPagina(container, numero, ativo) {
        const btn = document.createElement('button');
        btn.textContent = numero;
        btn.className = `pagination-number ${ativo ? 'active' : ''}`;
        btn.onclick = () => {
            this.paginaAtual = numero;
            this.atualizarTabela();
        };
        container.appendChild(btn);
    }

        // Atualizar visualização em cards se selecionado
        if (this.visualizacaoAtual === 'cards') {
            this.renderCards(locadoresDoImovel);
        }
    }

    alterarVisualizacao(tipo) {
        this.visualizacaoAtual = tipo;
        
        // Atualizar botões
        document.getElementById('viewTable').classList.toggle('active', tipo === 'table');
        document.getElementById('viewCards').classList.toggle('active', tipo === 'cards');
        
        // Mostrar/esconder visualizações
        document.getElementById('tableView').style.display = tipo === 'table' ? 'block' : 'none';
        document.getElementById('cardsView').style.display = tipo === 'cards' ? 'block' : 'none';
        
        this.atualizarTabela();
    }

    aplicarFiltros(locadores) {
        return locadores.filter(locador => {
            // Filtro de busca por nome
            if (this.filtros.busca && !locador.nome.toLowerCase().includes(this.filtros.busca)) {
                return false;
            }
            
            // Filtro por tipo
            if (this.filtros.tipo && locador.tipo !== this.filtros.tipo) {
                return false;
            }
            
            // Filtro por status de documentos
            if (this.filtros.status) {
                const totalDocs = Object.keys(locador.documentos).length;
                const docsCompletos = Object.values(locador.documentos).filter(Boolean).length;
                const isCompleto = docsCompletos === totalDocs;
                
                if (this.filtros.status === 'completo' && !isCompleto) {
                    return false;
                }
                if (this.filtros.status === 'pendente' && isCompleto) {
                    return false;
                }
            }
            
            return true;
        });
    }

    calcularEstatisticas(locadores) {
        const total = locadores.length;
        let totalDocsCompletos = 0;
        let totalDocsPendentes = 0;
        let totalDocsPossiveis = 0;

        locadores.forEach(locador => {
            const docs = Object.values(locador.documentos);
            const completos = docs.filter(Boolean).length;
            const pendentes = docs.length - completos;
            
            totalDocsCompletos += completos;
            totalDocsPendentes += pendentes;
            totalDocsPossiveis += docs.length;
        });

        const progressoGeral = totalDocsPossiveis > 0 ? 
            Math.round((totalDocsCompletos / totalDocsPossiveis) * 100) : 0;

        return {
            total,
            totalDocsCompletos,
            totalDocsPendentes,
            progressoGeral
        };
    }

    atualizarDashboard(locadores) {
        const stats = this.calcularEstatisticas(locadores);
        
        document.getElementById('totalLocadores').textContent = stats.total;
        document.getElementById('docsCompletos').textContent = stats.totalDocsCompletos;
        document.getElementById('docsPendentes').textContent = stats.totalDocsPendentes;
        document.getElementById('progressoGeral').textContent = `${stats.progressoGeral}%`;
    }

    mostrarControlesUX(mostrar) {
        const elementos = ['dashboardStats', 'searchFilters', 'viewToggle'];
        elementos.forEach(id => {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.style.display = mostrar ? 'block' : 'none';
            }
        });
    }

    renderCards(locadores) {
        const container = document.getElementById('cardsContainer');
        
        if (locadores.length === 0) {
            container.innerHTML = `
                <div class="loading-state">
                    <p>Nenhum locador encontrado com os filtros aplicados.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = locadores.map(locador => {
            const totalDocs = Object.keys(locador.documentos).length;
            const docsCompletos = Object.values(locador.documentos).filter(Boolean).length;
            const docsPendentes = totalDocs - docsCompletos;
            const progresso = totalDocs > 0 ? Math.round((docsCompletos / totalDocs) * 100) : 0;
            
            const documento = locador.cpf || locador.cnpj || 'Não informado';
            
            return `
                <div class="locador-card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${locador.nome}</div>
                            <div class="card-subtitle">${locador.tipo}</div>
                            <div style="font-size: 0.8rem; color: #666; margin-top: 0.25rem;">${documento}</div>
                        </div>
                        <div class="card-id">ID: ${locador.id}</div>
                    </div>
                    
                    <div class="progress-section">
                        <div class="progress-header">
                            <span class="progress-label">Documentos</span>
                            <span class="progress-percentage">${progresso}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progresso}%"></div>
                        </div>
                    </div>
                    
                    <div class="documents-summary">
                        <div class="doc-summary-item completos">
                            <div style="font-weight: bold;">${docsCompletos}</div>
                            <div>Completos</div>
                        </div>
                        <div class="doc-summary-item pendentes">
                            <div style="font-weight: bold;">${docsPendentes}</div>
                            <div>Pendentes</div>
                        </div>
                        <div class="doc-summary-item total">
                            <div style="font-weight: bold;">${totalDocs}</div>
                            <div>Total</div>
                        </div>
                    </div>
                    
                    <div class="card-actions">
                        <button class="btn btn-primary btn-sm" onclick="sistema.abrirDocumentosLocador(${locador.id})">
                            📄 Ver Documentos
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="sistema.removerLocador(${locador.id})">
                            🗑️ Remover
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    abrirDocumentosLocador(locadorId) {
        // Alterna para visualização em tabela e mostra apenas este locador
        this.filtros.busca = '';
        const locador = this.locadores.find(l => l.id === locadorId);
        if (locador) {
            document.getElementById('buscaLocador').value = locador.nome;
            this.filtros.busca = locador.nome.toLowerCase();
            this.alterarVisualizacao('table');
            this.atualizarTabela();
        }
    }

    uploadDocumento(id, doc) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*/*';
        input.onchange = () => {
            if (input.files.length > 0) {
                const locador = this.locadores.find(l => l.id === id);
                locador.documentos[doc] = true;
                this.atualizarTabela();
                alert(`Documento "${doc}" entregue para ${locador.nome}`);
            }
        };
        input.click();
    }
    
    updateLocadoresInfo() {
        const locadoresInfo = document.querySelector('.locadores-info');
        
        if (!this.imovelSelecionado) {
            locadoresInfo.innerHTML = '<p>Selecione um imóvel acima para vincular locadores.</p>';
        } else {
            const qtdLocadores = this.locadores.filter(locador => locador.imovelId === this.imovelSelecionado.id).length;
            locadoresInfo.innerHTML = `
                <p><strong>Imóvel selecionado:</strong> ${this.imovelSelecionado.endereco}</p>
                <p><strong>Locadores vinculados:</strong> ${qtdLocadores}</p>
            `;
        }
    }
}

// Adicionar estilos para linha selecionada
const style = document.createElement('style');
style.textContent = `
    .selected-row {
        background-color: var(--color-bg-hover) !important;
    }
    
    .selected-row:hover {
        background-color: var(--color-bg-light) !important;
    }
`;
document.head.appendChild(style);

// Inicializar o sistema quando a página carregar
let sistema;
document.addEventListener('DOMContentLoaded', () => {
    sistema = new SistemaIntegrado();
});
