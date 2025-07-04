// SILIC 2.0 - Sistema de Locação de Imóveis CAIXA
// Versão para Apresentação com dados de demonstração

class SistemaSILIC {
    constructor() {
        this.imoveis = [];
        this.locadores = [];
        this.imovelSelecionado = null;
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.currentView = 'table';
        
        // Paginação para imóveis
        this.currentPageImoveis = 1;
        this.itemsPerPageImoveis = 10;
        this.totalPaginasImoveis = 1;
        
        this.inicializar();
        this.carregarDadosDemo();
    }

    inicializar() {
        // Inicializar eventos dos formulários
        document.getElementById('adicionarImovel')?.addEventListener('click', () => this.adicionarImovel());
        document.getElementById('limparFormulario')?.addEventListener('click', () => this.limparFormulario());
        document.getElementById('adicionarLocador')?.addEventListener('click', () => this.adicionarLocador());
        
        // Toggle de visualização
        document.getElementById('viewTable')?.addEventListener('click', () => this.alterarVisualizacao('table'));
        document.getElementById('viewCards')?.addEventListener('click', () => this.alterarVisualizacao('cards'));
        
        // Filtros e busca de locadores
        document.getElementById('buscaLocador')?.addEventListener('input', () => this.filtrarLocadores());
        document.getElementById('filtroTipo')?.addEventListener('change', () => this.filtrarLocadores());
        document.getElementById('filtroStatus')?.addEventListener('change', () => this.filtrarLocadores());
        document.getElementById('limparFiltros')?.addEventListener('click', () => this.limparFiltros());
        
        // Filtros e busca de imóveis
        this.configurarFiltrosImoveis();
        
        // Paginação de locadores
        document.getElementById('itensPorPaginaSelect')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.atualizarListaLocadores();
        });

        // Paginação de imóveis
        document.getElementById('imoveisPorPaginaSelect')?.addEventListener('change', (e) => {
            this.itemsPerPageImoveis = parseInt(e.target.value);
            this.currentPageImoveis = 1;
            this.atualizarTabelaImoveis();
        });

        // Máscara para CEP
        this.aplicarMascaraCEP();
        
        // Event listener para fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.fecharModalDetalhes();
            }
        });
        
        this.atualizarDashboard();
    }

    carregarDadosDemo() {
        console.log('Carregando dados de demonstração...');
        
        // Gerar exatamente 100 imóveis para demonstração
        this.imoveis = this.gerarImoveisDemo(100);
        this.locadores = this.gerarLocadoresDemo();
        
        this.atualizarDashboard();
        this.atualizarTabelaImoveis();
        
        console.log('Dados de demonstração carregados:', {
            imoveis: this.imoveis.length,
            locadores: this.locadores.length
        });
    }

    gerarImoveisDemo(quantidade = 100) {
        const cidades = [
            'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte',
            'Manaus', 'Curitiba', 'Recife', 'Goiânia', 'Belém', 'Porto Alegre', 'Guarulhos',
            'Campinas', 'São Luís', 'São Gonçalo', 'Maceió', 'Duque de Caxias', 'Nova Iguaçu',
            'Teresina', 'Natal', 'Campo Grande', 'Osasco', 'Santo André', 'João Pessoa',
            'Jaboatão dos Guararapes', 'Contagem', 'São Bernardo do Campo', 'Uberlândia',
            'Sorocaba', 'Aracaju', 'Feira de Santana', 'Cuiabá', 'Joinville', 'Juiz de Fora',
            'Londrina', 'Aparecida de Goiânia', 'Niterói', 'Belford Roxo', 'Caxias do Sul',
            'Campos dos Goytacazes', 'Macapá', 'Vila Velha', 'São João de Meriti', 'Florianópolis',
            'Santos', 'Ribeirão Preto', 'Vitória', 'Serra', 'Diadema'
        ];

        // Distribuição realista de status para exatamente 100 imóveis
        const statusDistribuicao = [
            { status: 'Ativo', quantidade: 65 },
            { status: 'Em prospecção', quantidade: 15 },
            { status: 'Em mobilização', quantidade: 10 },
            { status: 'Em desmobilização', quantidade: 8 },
            { status: 'Desativado', quantidade: 2 }
        ];

        const imoveis = [];
        let id = 1;

        statusDistribuicao.forEach(dist => {
            for (let i = 0; i < dist.quantidade; i++) {
                const cidade = cidades[Math.floor(Math.random() * cidades.length)];
                const uf = this.obterUFPorCidade(cidade);
                const codigo = `2000${String(id).padStart(4, '0')}`;
                
                // Gerar datas realistas
                const inicioValidade = this.gerarDataAleatoria('2022-01-01', '2023-12-31');
                let objetoValidoAte = null;
                if (dist.status === 'Desativado' || dist.status === 'Em desmobilização') {
                    objetoValidoAte = this.gerarDataAleatoria('2023-06-01', '2024-12-31');
                }

                imoveis.push({
                    id: id,
                    codigo: codigo,
                    denominacao: `ED - CAIXA ${cidade} ${this.gerarComplementoEndereco()}, ${uf}`,
                    local: cidade,
                    endereco: this.gerarEnderecoAleatorio(),
                    cep: this.gerarCEPAleatorio(),
                    status: dist.status,
                    inicioValidade: inicioValidade,
                    objetoValidoAte: objetoValidoAte,
                    inscricaoIPTU: this.gerarInscricaoIPTU(),
                    numeroITR: Math.random() > 0.8 ? this.gerarNumeroITR() : null
                });
                
                id++;
            }
        });

        return imoveis;
    }

    gerarLocadoresDemo() {
        const nomes = [
            'João Silva Santos', 'Maria Oliveira Costa', 'Carlos Eduardo Lima', 'Ana Paula Ferreira',
            'Roberto Almeida', 'Fernanda Castro', 'Pedro Henrique Silva', 'Juliana Rocha',
            'Rafael Moreira', 'Camila Souza', 'Bruno Costa', 'Larissa Pereira',
            'Gustavo Ribeiro', 'Patrícia Martins', 'Alexandre Santos', 'Marcos Vieira',
            'Priscila Gomes', 'Rodrigo Barbosa', 'Luciana Fernandes', 'Diego Carvalho',
            'Isabela Mendes', 'Thiago Araújo', 'Vanessa Dias', 'Felipe Nascimento',
            'Aline Cardoso', 'Leonardo Pinto', 'Bianca Torres', 'Mateus Correia',
            'José Carlos Pereira', 'Amanda Silva', 'Ricardo Oliveira', 'Tatiana Campos'
        ];

        const empresas = [
            'Construtora ABC Ltda', 'Imobiliária Prime', 'Incorporadora Moderna',
            'Construções Sul S.A.', 'Empreendimentos Norte', 'Imóveis e Cia Ltda',
            'Construtora Silva e Filhos', 'Imobiliária Santos', 'Edificações Modernas S.A.',
            'Construtech Engenharia', 'Imóveis Premium Ltda', 'Construtora União',
            'Incorporadora Horizonte', 'Construtora Central', 'Imobiliária Paulista'
        ];

        const locadores = [];
        let idCounter = 1;

        this.imoveis.forEach(imovel => {
            // Regra: apenas imóveis com status 'Em prospecção' ou 'Em mobilização' podem não ter locadores
            const podeNaoTerLocadores = imovel.status === 'Em prospecção' || imovel.status === 'Em mobilização';
            
            let numeroLocadores;
            if (podeNaoTerLocadores) {
                // 30% de chance de não ter locadores para estes status
                numeroLocadores = Math.random() < 0.3 ? 0 : Math.floor(Math.random() * 3) + 1; // 0 a 3 locadores
            } else {
                // Demais status sempre têm pelo menos 1 locador
                numeroLocadores = Math.floor(Math.random() * 3) + 1; // 1 a 3 locadores
            }
            
            for (let i = 0; i < numeroLocadores; i++) {
                const ehPessoaJuridica = Math.random() > 0.6; // 40% PJ, 60% PF
                const nome = ehPessoaJuridica ? 
                    empresas[Math.floor(Math.random() * empresas.length)] :
                    nomes[Math.floor(Math.random() * nomes.length)];
                
                const locador = {
                    id: idCounter++,
                    nome: nome,
                    tipo: ehPessoaJuridica ? 'Pessoa Jurídica' : 'Pessoa Física',
                    imovelId: imovel.id,
                    documento: this.gerarDocumentoDemo(ehPessoaJuridica ? 'Pessoa Jurídica' : 'Pessoa Física'),
                    email: this.gerarEmailDemo(nome),
                    telefone: this.gerarTelefoneDemo(),
                    endereco: this.gerarEnderecoAleatorio(),
                    cep: this.gerarCEPAleatorio(),
                    documentos: this.gerarDocumentosCompletos(ehPessoaJuridica)
                };

                // Para PJ, adicionar representante legal se aplicável
                if (ehPessoaJuridica && Math.random() > 0.3) { // 70% das PJs têm representante legal
                    locador.representanteLegal = {
                        nome: nomes[Math.floor(Math.random() * nomes.length)],
                        cpf: this.gerarCPF(),
                        email: this.gerarEmailDemo(locador.representanteLegal.nome),
                        telefone: this.gerarTelefoneDemo(),
                        documentos: this.gerarDocumentosRepresentante()
                    };
                }

                locadores.push(locador);
            }
        });

        return locadores;
    }

    shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    escolherComPeso(pesos) {
        const random = Math.random();
        let acumulado = 0;
        
        for (let i = 0; i < pesos.length; i++) {
            acumulado += pesos[i];
            if (random < acumulado) {
                return i;
            }
        }
        return pesos.length - 1;
    }

    obterUFPorCidade(cidade) {
        const cidadesUF = {
            'São Paulo': 'SP', 'Rio de Janeiro': 'RJ', 'Brasília': 'DF', 'Salvador': 'BA',
            'Fortaleza': 'CE', 'Belo Horizonte': 'MG', 'Manaus': 'AM', 'Curitiba': 'PR',
            'Recife': 'PE', 'Goiânia': 'GO', 'Belém': 'PA', 'Porto Alegre': 'RS',
            'Guarulhos': 'SP', 'Campinas': 'SP', 'São Luís': 'MA', 'São Gonçalo': 'RJ',
            'Maceió': 'AL', 'Duque de Caxias': 'RJ', 'Nova Iguaçu': 'RJ', 'Teresina': 'PI',
            'Natal': 'RN', 'Campo Grande': 'MS', 'Osasco': 'SP', 'Santo André': 'SP',
            'João Pessoa': 'PB', 'Jaboatão dos Guararapes': 'PE', 'Contagem': 'MG',
            'São Bernardo do Campo': 'SP', 'Uberlândia': 'MG', 'Sorocaba': 'SP',
            'Aracaju': 'SE', 'Feira de Santana': 'BA', 'Cuiabá': 'MT', 'Joinville': 'SC',
            'Juiz de Fora': 'MG', 'Londrina': 'PR', 'Aparecida de Goiânia': 'GO',
            'Niterói': 'RJ', 'Belford Roxo': 'RJ', 'Caxias do Sul': 'RS',
            'Campos dos Goytacazes': 'RJ', 'Macapá': 'AP', 'Vila Velha': 'ES',
            'São João de Meriti': 'RJ', 'Florianópolis': 'SC', 'Santos': 'SP',
            'Ribeirão Preto': 'SP', 'Vitória': 'ES', 'Serra': 'ES', 'Diadema': 'SP'
        };
        return cidadesUF[cidade] || 'BR';
    }

    gerarComplementoEndereco() {
        const complementos = ['Centro', 'Norte', 'Sul', 'Leste', 'Oeste', 'Zona Norte', 'Zona Sul', 'Downtown', 'Business', 'Corporate'];
        return complementos[Math.floor(Math.random() * complementos.length)];
    }

    gerarEnderecoAleatorio() {
        const tipos = ['Rua', 'Avenida', 'Alameda', 'Travessa', 'Praça'];
        const nomes = ['das Flores', 'do Comércio', 'Brasil', 'da Independência', 'Santos Dumont', 'Getúlio Vargas', 'JK', 'do Centro'];
        const numero = Math.floor(Math.random() * 9999) + 1;
        
        return `${tipos[Math.floor(Math.random() * tipos.length)]} ${nomes[Math.floor(Math.random() * nomes.length)]}, ${numero}`;
    }

    gerarCEPAleatorio() {
        const parte1 = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
        const parte2 = String(Math.floor(Math.random() * 999)).padStart(3, '0');
        return `${parte1}-${parte2}`;
    }

    gerarInscricaoIPTU() {
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const prefixo = letras.charAt(Math.floor(Math.random() * letras.length)) + 
                       letras.charAt(Math.floor(Math.random() * letras.length)) + 
                       letras.charAt(Math.floor(Math.random() * letras.length));
        const numeros = String(Math.floor(Math.random() * 999999)).padStart(6, '0');
        return `${prefixo}${numeros}`;
    }

    gerarNumeroITR() {
        return String(Math.floor(Math.random() * 9999999999)).padStart(10, '0');
    }

    gerarDataAleatoria(inicio, fim) {
        const dataInicio = new Date(inicio).getTime();
        const dataFim = new Date(fim).getTime();
        const dataAleatoria = new Date(dataInicio + Math.random() * (dataFim - dataInicio));
        return dataAleatoria.toISOString().split('T')[0];
    }

    gerarDocumentosDemo() {
        const documentos = {
            'RG': Math.random() > 0.3 ? 'entregue' : 'pendente',
            'CPF': Math.random() > 0.2 ? 'entregue' : 'pendente',
            'Comprovante de Renda': Math.random() > 0.4 ? 'entregue' : 'pendente',
            'Comprovante de Residência': Math.random() > 0.3 ? 'entregue' : 'pendente',
            'Certidão de Nascimento': Math.random() > 0.5 ? 'entregue' : 'pendente',
            'Carteira de Trabalho': Math.random() > 0.6 ? 'entregue' : 'pendente'
        };
        return documentos;
    }

    aplicarMascaraCEP() {
        const cepInput = document.getElementById('cepImovel');
        if (cepInput) {
            cepInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 5) {
                    value = value.replace(/^(\d{5})(\d)/, '$1-$2');
                }
                if (value.length > 9) {
                    value = value.substr(0, 9);
                }
                e.target.value = value;
            });
        }
    }

    mostrarFormulario() {
        const formulario = document.getElementById('formularioImovel');
        if (formulario) {
            formulario.style.display = formulario.style.display === 'none' ? 'block' : 'none';
            
            if (formulario.style.display === 'block') {
                // Definir data de início automaticamente para hoje
                const hoje = new Date().toISOString().split('T')[0];
                document.getElementById('inicioValidadeObj').value = hoje;
            }
        }
    }

    adicionarImovel() {
        const codigo = document.getElementById('codigoEdificio').value;
        const denominacao = document.getElementById('denominacaoEdificio').value;
        const local = document.getElementById('localCidade').value;
        const endereco = document.getElementById('ruaEndereco').value;
        const cep = document.getElementById('cepImovel').value;
        const status = document.getElementById('statusImovel').value;
        const inicioValidade = document.getElementById('inicioValidadeObj').value;
        const objetoValidoAte = document.getElementById('objetoValidoAte').value;
        const inscricaoIPTU = document.getElementById('inscricaoIPTU').value;
        const numeroITR = document.getElementById('numeroITR').value;

        if (!codigo || !denominacao || !local || !endereco || !cep || !status) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validar formato do código
        if (!/^2000\d{4}$/.test(codigo)) {
            alert('Código do edifício deve ter 8 dígitos e iniciar com 2000.');
            return;
        }

        // Verificar se o código já existe
        if (this.imoveis.some(imovel => imovel.codigo === codigo)) {
            alert('Já existe um imóvel com este código.');
            return;
        }

        const novoImovel = {
            id: this.imoveis.length + 1,
            codigo,
            denominacao,
            local,
            endereco,
            cep,
            status,
            inicioValidade,
            objetoValidoAte: objetoValidoAte || null,
            inscricaoIPTU: inscricaoIPTU || null,
            numeroITR: numeroITR || null
        };

        this.imoveis.push(novoImovel);
        this.atualizarDashboard();
        this.atualizarTabelaImoveis();
        this.limparFormulario();
        
        // Ir para a última página para mostrar o novo imóvel
        this.currentPageImoveis = Math.ceil(this.imoveis.length / this.itemsPerPageImoveis);
        this.atualizarTabelaImoveis();
        
        alert('Imóvel cadastrado com sucesso!');
    }

    limparFormulario() {
        document.getElementById('codigoEdificio').value = '';
        document.getElementById('denominacaoEdificio').value = '';
        document.getElementById('localCidade').value = '';
        document.getElementById('ruaEndereco').value = '';
        document.getElementById('cepImovel').value = '';
        document.getElementById('statusImovel').value = '';
        document.getElementById('inicioValidadeObj').value = '';
        document.getElementById('objetoValidoAte').value = '';
        document.getElementById('inscricaoIPTU').value = '';
        document.getElementById('numeroITR').value = '';
        
        const formulario = document.getElementById('formularioImovel');
        if (formulario) {
            formulario.style.display = 'none';
        }
    }

    atualizarDashboard() {
        const totalImoveis = this.imoveis.length;
        const imoveisAtivos = this.imoveis.filter(i => i.status === 'Ativo').length;
        const imoveisProspeccao = this.imoveis.filter(i => i.status === 'Em prospecção').length;
        const imoveisMobilizacao = this.imoveis.filter(i => i.status === 'Em mobilização').length;
        const imoveisDesmobilizacao = this.imoveis.filter(i => i.status === 'Em desmobilização').length;
        const imoveisDesativado = this.imoveis.filter(i => i.status === 'Desativado').length;

        // Atualizar elementos do dashboard
        this.atualizarElemento('totalImoveis', totalImoveis);
        this.atualizarElemento('imoveisAtivos', imoveisAtivos);
        this.atualizarElemento('imoveisProspeccao', imoveisProspeccao);
        this.atualizarElemento('imoveisMobilizacao', imoveisMobilizacao);
        this.atualizarElemento('imoveisDesmobilizacao', imoveisDesmobilizacao);
        this.atualizarElemento('imoveisDesativado', imoveisDesativado);
    }

    atualizarElemento(id, valor) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    }

    atualizarTabelaImoveis() {
        // Se há filtros ativos, usar a função filtrada
        if (this.imoveisFiltrados) {
            this.atualizarTabelaImoveisFiltrados();
            return;
        }

        const tbody = document.getElementById('tabelaImoveis');
        if (!tbody) return;

        tbody.innerHTML = '';

        // Calcular paginação
        this.totalPaginasImoveis = Math.ceil(this.imoveis.length / this.itemsPerPageImoveis);
        const startIndex = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis;
        const endIndex = startIndex + this.itemsPerPageImoveis;
        const imoveisPagina = this.imoveis.slice(startIndex, endIndex);

        imoveisPagina.forEach(imovel => {
            const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
            const quantidadeLocadores = locadoresDoImovel.length;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${imovel.codigo}</strong></td>
                <td>
                    <div style="max-width: 250px; word-wrap: break-word;">
                        ${imovel.denominacao}
                    </div>
                </td>
                <td>${imovel.local}</td>
                <td>${this.formatarStatusBadge(imovel.status)}</td>
                <td>
                    <div class="locadores-count">
                        <span class="count-badge ${quantidadeLocadores === 0 ? 'zero' : quantidadeLocadores < 3 ? 'few' : 'many'}">
                            ${quantidadeLocadores}
                        </span>
                        ${quantidadeLocadores === 0 ? '<span class="warning-icon">⚠️</span>' : ''}
                    </div>
                    ${quantidadeLocadores === 0 ? '<div class="action-warning">Nenhum locador cadastrado</div>' : ''}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-info" onclick="sistema.mostrarDetalhesImovel(${imovel.id})" title="Ver detalhes completos">
                            📋 Detalhar
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="sistema.selecionarImovel(${imovel.id})" title="Selecionar para gerenciar locadores">
                            ${this.imovelSelecionado?.id === imovel.id ? '✓ Selecionado' : '👥 Locadores'}
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sistema.editarImovel(${imovel.id})" title="Editar imóvel">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="sistema.removerImovel(${imovel.id})" title="Remover imóvel">
                            🗑️ Remover
                        </button>
                    </div>
                </td>
            `;

            // Adicionar classe de destaque se não tiver locadores
            if (quantidadeLocadores === 0) {
                row.classList.add('imovel-warning');
            }
            
            // Destacar imóvel selecionado
            if (this.imovelSelecionado?.id === imovel.id) {
                row.style.backgroundColor = '#e3f2fd';
                row.style.borderLeft = '4px solid var(--color-primary)';
            }
        });

        this.atualizarPaginacaoImoveis();
        this.atualizarInfoImoveis();
    }

    formatarStatusBadge(status) {
        const statusClass = status.toLowerCase().replace(/\s+/g, '-');
        return `<span class="status-badge ${statusClass}">${status}</span>`;
    }

    atualizarPaginacaoImoveis() {
        // Atualizar informações de paginação
        const paginationInfo = document.getElementById('imoveis-pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Página ${this.currentPageImoveis} de ${this.totalPaginasImoveis}`;
        }
        
        // Atualizar botões
        const primeiraPagina = document.getElementById('primeiraPaginaImoveis');
        const anteriorPagina = document.getElementById('anteriorPaginaImoveis');
        const proximaPagina = document.getElementById('proximaPaginaImoveis');
        const ultimaPagina = document.getElementById('ultimaPaginaImoveis');
        
        if (primeiraPagina) primeiraPagina.disabled = this.currentPageImoveis === 1;
        if (anteriorPagina) anteriorPagina.disabled = this.currentPageImoveis === 1;
        if (proximaPagina) proximaPagina.disabled = this.currentPageImoveis === this.totalPaginasImoveis;
        if (ultimaPagina) ultimaPagina.disabled = this.currentPageImoveis === this.totalPaginasImoveis;
    }

    atualizarInfoImoveis() {
        const totalImoveis = this.imoveis.length;
        const startItem = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis + 1;
        const endItem = Math.min(this.currentPageImoveis * this.itemsPerPageImoveis, totalImoveis);
        
        const resultadosInfo = document.getElementById('imoveisResultadosInfo');
        if (resultadosInfo) {
            resultadosInfo.textContent = `Exibindo ${startItem}-${endItem} de ${totalImoveis} imóveis`;
        }
    }

    irParaPaginaImoveis(pagina) {
        if (pagina >= 1 && pagina <= this.totalPaginasImoveis) {
            this.currentPageImoveis = pagina;
            this.atualizarTabelaImoveis();
        }
    }

    mostrarDetalhesImovel(id) {
        const imovel = this.imoveis.find(i => i.id === id);
        if (!imovel) return;

        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
        
        const detalhesContent = document.getElementById('detalhesImovelContent');
        detalhesContent.innerHTML = `
            <div class="detalhes-section">
                <h4>🏢 Informações Básicas</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Código SIPGE/SAP</div>
                        <div class="detalhe-valor"><strong>${imovel.codigo}</strong></div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Denominação</div>
                        <div class="detalhe-valor">${imovel.denominacao}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Status</div>
                        <div class="detalhe-valor">${this.formatarStatusBadge(imovel.status)}</div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>📍 Localização</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Cidade</div>
                        <div class="detalhe-valor">${imovel.local}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Endereço Completo</div>
                        <div class="detalhe-valor">${imovel.endereco}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">CEP</div>
                        <div class="detalhe-valor"><code>${imovel.cep}</code></div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>📅 Validade do Objeto</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Início da Validade</div>
                        <div class="detalhe-valor">${this.formatarData(imovel.inicioValidade)}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Válido Até</div>
                        <div class="detalhe-valor">${imovel.objetoValidoAte ? this.formatarData(imovel.objetoValidoAte) : '<em style="color: #999;">Não definido</em>'}</div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>🏛️ Impostos e Tributos</h4>
                <div class="detalhes-grid">
                    <div class="detalhe-item">
                        <div class="detalhe-label">Inscrição IPTU</div>
                        <div class="detalhe-valor">${imovel.inscricaoIPTU || '<em style="color: #999;">Não informado</em>'}</div>
                    </div>
                    <div class="detalhe-item">
                        <div class="detalhe-label">Número ITR</div>
                        <div class="detalhe-valor">${imovel.numeroITR || '<em style="color: #999;">Não aplicável</em>'}</div>
                    </div>
                </div>
            </div>
            
            <div class="detalhes-section">
                <h4>👥 Locadores Vinculados</h4>
                <div class="detalhe-item">
                    <div class="detalhe-label">Total de Locadores</div>
                    <div class="detalhe-valor">
                        <span class="count-badge ${locadoresDoImovel.length === 0 ? 'zero' : locadoresDoImovel.length < 3 ? 'few' : 'many'}">
                            ${locadoresDoImovel.length}
                        </span>
                        ${locadoresDoImovel.length === 0 ? ' <em style="color: #dc3545;">⚠️ Nenhum locador cadastrado</em>' : ''}
                    </div>
                </div>
                ${locadoresDoImovel.length > 0 ? `
                    <div style="margin-top: 1rem;">
                        <div class="detalhe-label">Lista de Locadores:</div>
                        <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                            ${locadoresDoImovel.map(locador => `
                                <li style="margin-bottom: 0.5rem;">
                                    <strong>${locador.nome}</strong> (${locador.tipo})
                                    <br><small style="color: #666;">${locador.documento}</small>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;

        document.getElementById('modalDetalhesImovel').style.display = 'block';
    }

    formatarData(dataString) {
        if (!dataString) return '';
        const data = new Date(dataString + 'T00:00:00');
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    fecharModalDetalhes() {
        document.getElementById('modalDetalhesImovel').style.display = 'none';
    }

    editarImovelModal() {
        // Fechar modal e abrir formulário de edição
        this.fecharModalDetalhes();
        alert('Funcionalidade de edição será implementada.');
    }

    selecionarImovel(id) {
        this.imovelSelecionado = this.imoveis.find(i => i.id === id);
        this.atualizarTabelaImoveis();
        this.mostrarSecaoLocadores();
        this.atualizarListaLocadores();
    }

    mostrarSecaoLocadores() {
        const locadoresInfo = document.querySelector('.locadores-info');
        const dashboardStats = document.getElementById('dashboardStats');
        const searchFilters = document.getElementById('searchFilters');
        const viewToggle = document.getElementById('viewToggle');
        
        if (this.imovelSelecionado) {
            if (locadoresInfo) {
                locadoresInfo.innerHTML = `
                    <p><strong>Imóvel selecionado:</strong> ${this.imovelSelecionado.denominacao}</p>
                    <p><strong>Código:</strong> ${this.imovelSelecionado.codigo} | <strong>Local:</strong> ${this.imovelSelecionado.local}</p>
                `;
            }
            
            if (dashboardStats) dashboardStats.style.display = 'grid';
            if (searchFilters) searchFilters.style.display = 'block';
            if (viewToggle) viewToggle.style.display = 'flex';
        }
        
        this.atualizarDashboardLocadores();
    }

    atualizarDashboardLocadores() {
        if (!this.imovelSelecionado) return;
        
        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === this.imovelSelecionado.id);
        const totalLocadores = locadoresDoImovel.length;
        
        let docsCompletos = 0;
        let docsPendentes = 0;
        let totalDocs = 0;
        
        locadoresDoImovel.forEach(locador => {
            Object.values(locador.documentos).forEach(status => {
                totalDocs++;
                if (status === 'entregue') {
                    docsCompletos++;
                } else {
                    docsPendentes++;
                }
            });
        });
        
        const progressoGeral = totalDocs > 0 ? Math.round((docsCompletos / totalDocs) * 100) : 0;
        
        this.atualizarElemento('totalLocadores', totalLocadores);
        this.atualizarElemento('docsCompletos', docsCompletos);
        this.atualizarElemento('docsPendentes', docsPendentes);
        this.atualizarElemento('progressoGeral', `${progressoGeral}%`);
    }

    adicionarLocador() {
        if (!this.imovelSelecionado) {
            alert('Selecione um imóvel primeiro.');
            return;
        }

        const nome = document.getElementById('nomeLocador').value;
        const tipo = document.getElementById('tipoLocador').value;

        if (!nome) {
            alert('Por favor, informe o nome do locador.');
            return;
        }

        const novoLocador = {
            id: this.locadores.length + 1,
            nome,
            tipo,
            imovelId: this.imovelSelecionado.id,
            documento: this.gerarDocumentoDemo(tipo),
            documentos: this.gerarDocumentosDemo()
        };

        this.locadores.push(novoLocador);
        
        document.getElementById('nomeLocador').value = '';
        
        this.atualizarListaLocadores();
        this.atualizarDashboardLocadores();
        this.atualizarTabelaImoveis();
        
        alert('Locador adicionado com sucesso!');
    }

    gerarDocumentoDemo(tipo) {
        if (tipo === 'Pessoa Física') {
            return Math.floor(Math.random() * 900000000) + 100000000 + '-' + Math.floor(Math.random() * 90) + 10;
        } else {
            return Math.floor(Math.random() * 90000000) + 10000000 + '/0001-' + Math.floor(Math.random() * 90) + 10;
        }
    }

    atualizarListaLocadores() {
        if (!this.imovelSelecionado) return;
        
        const locadoresDoImovel = this.locadores.filter(l => l.imovelId === this.imovelSelecionado.id);
        
        if (this.currentView === 'table') {
            this.atualizarTabelaLocadores(locadoresDoImovel);
        } else {
            this.atualizarCardsLocadores(locadoresDoImovel);
        }
        
        this.atualizarPaginacao(locadoresDoImovel.length);
    }

    atualizarTabelaLocadores(locadores) {
        const tbody = document.getElementById('tabelaLocadores');
        if (!tbody) return;

        tbody.innerHTML = '';

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const locadoresPagina = locadores.slice(startIndex, endIndex);

        locadoresPagina.forEach(locador => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${locador.id}</td>
                <td>
                    <div class="locador-info">
                        <div class="locador-nome">${locador.nome}</div>
                        <div class="locador-tipo">${locador.tipo}</div>
                        <div class="locador-documento">${locador.documento}</div>
                    </div>
                </td>
                <td>
                    <div class="documents-cell">
                        ${this.gerarDocumentosHTML(locador)}
                    </div>
                </td>
            `;
        });
    }

    gerarDocumentosHTML(locador) {
        return Object.entries(locador.documentos).map(([doc, status]) => `
            <div class="document-dropbox ${status === 'entregue' ? 'completed' : 'clickable'}" 
                 onclick="sistema.toggleDocumento(${locador.id}, '${doc}')">
                <div class="document-header">
                    <span class="document-icon">${status === 'entregue' ? '✅' : '📄'}</span>
                    <span class="document-name">${doc}</span>
                    <span class="status-indicator ${status}">${status === 'entregue' ? '✓' : '⚠'}</span>
                </div>
                <div class="document-status">
                    <span class="status-text ${status}">
                        ${status === 'entregue' ? 'Documento entregue' : 'Pendente de entrega'}
                    </span>
                </div>
                ${status === 'pendente' ? '<div class="upload-hint">Clique para marcar como entregue</div>' : ''}
            </div>
        `).join('');
    }

    toggleDocumento(locadorId, documento) {
        const locador = this.locadores.find(l => l.id === locadorId);
        if (locador && locador.documentos[documento] === 'pendente') {
            locador.documentos[documento] = 'entregue';
            this.atualizarListaLocadores();
            this.atualizarDashboardLocadores();
        }
    }

    alterarVisualizacao(view) {
        this.currentView = view;
        
        const tableView = document.getElementById('tableView');
        const cardsView = document.getElementById('cardsView');
        const viewTable = document.getElementById('viewTable');
        const viewCards = document.getElementById('viewCards');
        
        if (view === 'table') {
            tableView.style.display = 'block';
            cardsView.style.display = 'none';
            viewTable.classList.add('active');
            viewCards.classList.remove('active');
        } else {
            tableView.style.display = 'none';
            cardsView.style.display = 'block';
            viewTable.classList.remove('active');
            viewCards.classList.add('active');
        }
        
        this.atualizarListaLocadores();
    }

    atualizarCardsLocadores(locadores) {
        const container = document.getElementById('cardsContainer');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const locadoresPagina = locadores.slice(startIndex, endIndex);

        container.innerHTML = locadoresPagina.map(locador => {
            const totalDocs = Object.keys(locador.documentos).length;
            const docsCompletos = Object.values(locador.documentos).filter(s => s === 'entregue').length;
            const progresso = Math.round((docsCompletos / totalDocs) * 100);
            
            return `
                <div class="locador-card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${locador.nome}</div>
                            <div class="card-subtitle">${locador.tipo}</div>
                        </div>
                        <div class="card-id">#${locador.id}</div>
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
                            <div>${docsCompletos}</div>
                            <div>Completos</div>
                        </div>
                        <div class="doc-summary-item pendentes">
                            <div>${totalDocs - docsCompletos}</div>
                            <div>Pendentes</div>
                        </div>
                        <div class="doc-summary-item total">
                            <div>${totalDocs}</div>
                            <div>Total</div>
                        </div>
                    </div>
                    
                    <div class="card-actions">
                        <button class="btn btn-sm btn-primary" onclick="sistema.verDetalhesLocador(${locador.id})">Ver Detalhes</button>
                        <button class="btn btn-sm btn-danger" onclick="sistema.removerLocador(${locador.id})">Remover</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    atualizarPaginacao(totalItens) {
        const totalPaginas = Math.ceil(totalItens / this.itemsPerPage);
        const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
        const endItem = Math.min(this.currentPage * this.itemsPerPage, totalItens);
        
        // Atualizar informações
        const resultadosInfo = document.getElementById('resultadosInfo');
        if (resultadosInfo) {
            resultadosInfo.textContent = `${startItem}-${endItem} de ${totalItens} resultados`;
        }
        
        const paginationInfo = document.getElementById('pagination-info');
        if (paginationInfo) {
            paginationInfo.textContent = `Página ${this.currentPage} de ${totalPaginas}`;
        }
        
        // Atualizar botões
        const paginationButtons = document.getElementById('pagination-buttons');
        if (paginationButtons) {
            paginationButtons.innerHTML = `
                <button class="pagination-button" ${this.currentPage === 1 ? 'disabled' : ''} 
                        onclick="sistema.irParaPagina(${this.currentPage - 1})">‹ Anterior</button>
                <button class="pagination-button" ${this.currentPage === totalPaginas ? 'disabled' : ''} 
                        onclick="sistema.irParaPagina(${this.currentPage + 1})">Próxima ›</button>
            `;
        }
    }

    irParaPagina(pagina) {
        this.currentPage = pagina;
        this.atualizarListaLocadores();
    }

    filtrarLocadores() {
        // Implementar filtros se necessário
        this.atualizarListaLocadores();
    }

    limparFiltros() {
        document.getElementById('buscaLocador').value = '';
        document.getElementById('filtroTipo').value = '';
        document.getElementById('filtroStatus').value = '';
        this.filtrarLocadores();
    }

    editarImovel(id) {
        alert('Funcionalidade de edição será implementada.');
    }

    removerImovel(id) {
        if (confirm('Tem certeza que deseja remover este imóvel?')) {
            this.imoveis = this.imoveis.filter(i => i.id !== id);
            this.locadores = this.locadores.filter(l => l.imovelId !== id);
            
            if (this.imovelSelecionado?.id === id) {
                this.imovelSelecionado = null;
                const dashboardStats = document.getElementById('dashboardStats');
                const searchFilters = document.getElementById('searchFilters');
                const viewToggle = document.getElementById('viewToggle');
                
                if (dashboardStats) dashboardStats.style.display = 'none';
                if (searchFilters) searchFilters.style.display = 'none';
                if (viewToggle) viewToggle.style.display = 'none';
                
                const locadoresInfo = document.querySelector('.locadores-info');
                if (locadoresInfo) {
                    locadoresInfo.innerHTML = '<p>Selecione um imóvel acima para vincular locadores.</p>';
                }
            }
            
            this.atualizarDashboard();
            this.atualizarTabelaImoveis();
            
            alert('Imóvel removido com sucesso!');
        }
    }

    removerLocador(id) {
        if (confirm('Tem certeza que deseja remover este locador?')) {
            this.locadores = this.locadores.filter(l => l.id !== id);
            this.atualizarListaLocadores();
            this.atualizarDashboardLocadores();
            this.atualizarTabelaImoveis();
            
            alert('Locador removido com sucesso!');
        }
    }

    verDetalhesLocador(id) {
        const locador = this.locadores.find(l => l.id === id);
        if (locador) {
            const detalhes = `
                Nome: ${locador.nome}
                Tipo: ${locador.tipo}
                Documento: ${locador.documento}
                
                Documentos:
                ${Object.entries(locador.documentos).map(([doc, status]) => 
                    `• ${doc}: ${status === 'entregue' ? '✓ Entregue' : '⚠ Pendente'}`
                ).join('\n')}
            `;
            alert(detalhes);
        }
    }

    buscarSIPGE() {
        alert('Funcionalidade de integração com SIPGE/SAP será implementada.');
    }

    executarAuditoriaInterface() {
        const totalImoveis = this.imoveis.length;
        const imoveisSemLocadores = this.imoveis.filter(imovel => 
            !this.locadores.some(locador => locador.imovelId === imovel.id)
        ).length;
        
        let docsPendentesTotal = 0;
        this.locadores.forEach(locador => {
            docsPendentesTotal += Object.values(locador.documentos).filter(status => status === 'pendente').length;
        });
        
        const relatorio = `
🔍 RELATÓRIO DE AUDITORIA SILIC 2.0

📊 ESTATÍSTICAS GERAIS:
• Total de imóveis cadastrados: ${totalImoveis}
• Imóveis sem locadores: ${imoveisSemLocadores}
• Total de locadores: ${this.locadores.length}
• Documentos pendentes: ${docsPendentesTotal}

⚠️ ALERTAS:
${imoveisSemLocadores > 0 ? `• ${imoveisSemLocadores} imóveis precisam de locadores` : '• Todos os imóveis possuem locadores'}
${docsPendentesTotal > 0 ? `• ${docsPendentesTotal} documentos aguardando entrega` : '• Todos os documentos estão em dia'}

✅ CONFORMIDADE:
• Sistema: Operacional
• Dados: ${totalImoveis > 0 ? 'Populados' : 'Vazios'}
• Interface: Responsiva
        `;
        
        alert(relatorio);
    }

    // === NOVAS FUNÇÕES DE DOCUMENTAÇÃO COMPLETA ===
    
    gerarEmailDemo(nome) {
        if (!nome) nome = 'usuario';
        const email = nome.toLowerCase()
            .replace(/\s+/g, '.')
            .replace(/[^a-z0-9.]/g, '')
            .replace(/\.+/g, '.');
        
        const dominios = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'empresa.com.br'];
        const dominio = dominios[Math.floor(Math.random() * dominios.length)];
        
        return `${email}@${dominio}`;
    }

    gerarTelefoneDemo() {
        const ddd = Math.floor(Math.random() * 89) + 11; // DDDs de 11 a 99
        const numero = Math.floor(Math.random() * 900000000) + 100000000; // 9 dígitos
        return `(${ddd}) ${numero.toString().replace(/(\d{5})(\d{4})/, '$1-$2')}`;
    }

    gerarCPF() {
        const numbers = [];
        for (let i = 0; i < 9; i++) {
            numbers.push(Math.floor(Math.random() * 10));
        }
        
        // Calcular dígitos verificadores
        let sum = numbers.reduce((acc, num, idx) => acc + num * (10 - idx), 0);
        let digit1 = 11 - (sum % 11);
        if (digit1 >= 10) digit1 = 0;
        numbers.push(digit1);
        
        sum = numbers.reduce((acc, num, idx) => acc + num * (11 - idx), 0);
        let digit2 = 11 - (sum % 11);
        if (digit2 >= 10) digit2 = 0;
        numbers.push(digit2);
        
        return numbers.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    gerarDocumentosCompletos(ehPessoaJuridica) {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.7) return 'entregue';
            if (rand < 0.85) return 'pendente';
            if (rand < 0.95) return 'em_analise';
            return 'rejeitado';
        };

        if (ehPessoaJuridica) {
            return {
                // Documentos obrigatórios para PJ
                'Contrato Social': gerarStatus(),
                'CNPJ': gerarStatus(),
                'Inscrição Estadual': gerarStatus(),
                'Certidão Negativa Federal': gerarStatus(),
                'Certidão Negativa Estadual': gerarStatus(),
                'Certidão Negativa Municipal': gerarStatus(),
                'Balanço Patrimonial': gerarStatus(),
                'DRE - Demonstração do Resultado': gerarStatus(),
                'Certidão de Regularidade FGTS': gerarStatus(),
                'Certidão de Regularidade INSS': gerarStatus(),
                'Procuração': Math.random() > 0.5 ? gerarStatus() : null,
                'Declaração de Idoneidade': gerarStatus(),
                'Comprovante de Endereço da Empresa': gerarStatus(),
                'Ata de Nomeação de Diretoria': Math.random() > 0.4 ? gerarStatus() : null,
                'Cartão CNPJ': gerarStatus()
            };
        } else {
            return {
                // Documentos obrigatórios para PF
                'RG': gerarStatus(),
                'CPF': gerarStatus(),
                'Comprovante de Renda': gerarStatus(),
                'Comprovante de Residência': gerarStatus(),
                'Declaração IR': Math.random() > 0.3 ? gerarStatus() : null,
                'Carteira de Trabalho': Math.random() > 0.4 ? gerarStatus() : null,
                'Certidão de Nascimento': Math.random() > 0.6 ? gerarStatus() : null,
                'Certidão de Casamento': Math.random() > 0.7 ? gerarStatus() : null,
                'Comprovante Bancário': gerarStatus(),
                'Declaração de Bens': Math.random() > 0.5 ? gerarStatus() : null,
                'Ficha Cadastral': gerarStatus(),
                'Contrato de Trabalho': Math.random() > 0.6 ? gerarStatus() : null
            };
        }
    }

    gerarDocumentosRepresentante() {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.8) return 'entregue';
            if (rand < 0.95) return 'pendente';
            return 'em_analise';
        };

        return {
            'RG do Representante': gerarStatus(),
            'CPF do Representante': gerarStatus(),
            'Procuração': gerarStatus(),
            'Comprovante de Residência do Representante': gerarStatus(),
            'Termo de Responsabilidade': Math.random() > 0.3 ? gerarStatus() : null
        };
    }

    gerarDocumentosImovel() {
        const gerarStatus = () => {
            const rand = Math.random();
            if (rand < 0.75) return 'entregue';
            if (rand < 0.9) return 'pendente';
            return 'em_analise';
        };

        return {
            'Escritura do Imóvel': gerarStatus(),
            'Matrícula do Imóvel': gerarStatus(),
            'IPTU': gerarStatus(),
            'Certidão Negativa de Débitos': gerarStatus(),
            'Planta do Imóvel': Math.random() > 0.4 ? gerarStatus() : null,
            'Habite-se': Math.random() > 0.3 ? gerarStatus() : null,
            'Alvará de Funcionamento': Math.random() > 0.5 ? gerarStatus() : null,
            'Laudo de Avaliação': gerarStatus(),
            'Certidão de Regularidade Urbana': Math.random() > 0.6 ? gerarStatus() : null,
            'Memorial Descritivo': Math.random() > 0.7 ? gerarStatus() : null
        };
    }

    // === FILTROS E BUSCA DE IMÓVEIS ===
    
    configurarFiltrosImoveis() {
        // Filtro de busca em tempo real
        document.getElementById('filtroImoveis')?.addEventListener('input', () => this.filtrarImoveis());
        
        // Filtro por status
        document.getElementById('filtroStatusImoveis')?.addEventListener('change', () => this.filtrarImoveis());
    }

    filtrarImoveis() {
        const termoBusca = document.getElementById('filtroImoveis')?.value.toLowerCase() || '';
        const statusFiltro = document.getElementById('filtroStatusImoveis')?.value || '';
        
        // Resetar para primeira página
        this.currentPageImoveis = 1;
        
        // Aplicar filtros
        let imoveisFiltrados = this.imoveis;
        
        if (termoBusca) {
            imoveisFiltrados = imoveisFiltrados.filter(imovel => 
                imovel.codigo.toLowerCase().includes(termoBusca) ||
                imovel.denominacao.toLowerCase().includes(termoBusca) ||
                imovel.local.toLowerCase().includes(termoBusca) ||
                imovel.endereco.toLowerCase().includes(termoBusca)
            );
        }
        
        if (statusFiltro) {
            imoveisFiltrados = imoveisFiltrados.filter(imovel => 
                imovel.status === statusFiltro
            );
        }
        
        // Atualizar a propriedade temporária para paginação
        this.imoveisFiltrados = imoveisFiltrados;
        
        this.atualizarTabelaImoveisFiltrados();
    }

    atualizarTabelaImoveisFiltrados() {
        const tbody = document.getElementById('tabelaImoveis');
        if (!tbody) return;

        tbody.innerHTML = '';
        
        const imoveisParaExibir = this.imoveisFiltrados || this.imoveis;

        // Calcular paginação
        this.totalPaginasImoveis = Math.ceil(imoveisParaExibir.length / this.itemsPerPageImoveis);
        const startIndex = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis;
        const endIndex = startIndex + this.itemsPerPageImoveis;
        const imoveisPagina = imoveisParaExibir.slice(startIndex, endIndex);

        imoveisPagina.forEach(imovel => {
            const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
            const quantidadeLocadores = locadoresDoImovel.length;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td><strong>${imovel.codigo}</strong></td>
                <td>
                    <div style="max-width: 250px; word-wrap: break-word;">
                        ${imovel.denominacao}
                    </div>
                </td>
                <td>${imovel.local}</td>
                <td>${this.formatarStatusBadge(imovel.status)}</td>
                <td>
                    <div class="locadores-count">
                        <span class="count-badge ${quantidadeLocadores === 0 ? 'zero' : quantidadeLocadores < 3 ? 'few' : 'many'}">
                            ${quantidadeLocadores}
                        </span>
                        ${quantidadeLocadores === 0 ? '<span class="warning-icon">⚠️</span>' : ''}
                    </div>
                    ${quantidadeLocadores === 0 ? '<div class="action-warning">Nenhum locador cadastrado</div>' : ''}
                </td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-info" onclick="sistema.mostrarDetalhesImovel(${imovel.id})" title="Ver detalhes completos">
                            📋 Detalhar
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="sistema.selecionarImovel(${imovel.id})" title="Selecionar para gerenciar locadores">
                            ${this.imovelSelecionado?.id === imovel.id ? '✓ Selecionado' : '👥 Locadores'}
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sistema.editarImovel(${imovel.id})" title="Editar imóvel">
                            ✏️ Editar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="sistema.removerImovel(${imovel.id})" title="Remover imóvel">
                            🗑️ Remover
                        </button>
                    </div>
                </td>
            `;

            // Adicionar classe de destaque se não tiver locadores
            if (quantidadeLocadores === 0) {
                row.classList.add('imovel-warning');
            }
            
            // Destacar imóvel selecionado
            if (this.imovelSelecionado?.id === imovel.id) {
                row.style.backgroundColor = '#e3f2fd';
                row.style.borderLeft = '4px solid var(--color-primary)';
            }
        });

        this.atualizarPaginacaoImoveis();
        this.atualizarInfoImoveisFiltrados();
    }

    atualizarInfoImoveisFiltrados() {
        const imoveisParaExibir = this.imoveisFiltrados || this.imoveis;
        const totalImoveis = imoveisParaExibir.length;
        const startItem = (this.currentPageImoveis - 1) * this.itemsPerPageImoveis + 1;
        const endItem = Math.min(this.currentPageImoveis * this.itemsPerPageImoveis, totalImoveis);
        
        const resultadosInfo = document.getElementById('imoveisResultadosInfo');
        if (resultadosInfo) {
            if (this.imoveisFiltrados && this.imoveisFiltrados.length < this.imoveis.length) {
                resultadosInfo.textContent = `Exibindo ${startItem}-${endItem} de ${totalImoveis} imóveis (${this.imoveis.length} total)`;
            } else {
                resultadosInfo.textContent = `Exibindo ${startItem}-${endItem} de ${totalImoveis} imóveis`;
            }
        }
    }

    limparFiltrosImoveis() {
        document.getElementById('filtroImoveis').value = '';
        document.getElementById('filtroStatusImoveis').value = '';
        
        this.imoveisFiltrados = null;
        this.currentPageImoveis = 1;
        
        this.atualizarTabelaImoveis();
    }
}

// Funções globais para manter compatibilidade
function abrirCentroControle() {
    alert('Centro de Controle indisponível na versão de apresentação.');
}

function simularCenario() {
    alert('Simulação de cenários indisponível na versão de apresentação.');
}

function importarDadosReais(input) {
    alert('Importação de dados indisponível na versão de apresentação.');
}

// Inicializar sistema quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.sistema = new SistemaSILIC();
    console.log('SILIC 2.0 - Versão Apresentação inicializado com sucesso!');
});
