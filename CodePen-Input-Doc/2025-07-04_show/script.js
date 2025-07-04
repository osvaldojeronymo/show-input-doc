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
        
        // Filtros e busca
        document.getElementById('buscaLocador')?.addEventListener('input', () => this.filtrarLocadores());
        document.getElementById('filtroTipo')?.addEventListener('change', () => this.filtrarLocadores());
        document.getElementById('filtroStatus')?.addEventListener('change', () => this.filtrarLocadores());
        document.getElementById('limparFiltros')?.addEventListener('click', () => this.limparFiltros());
        
        // Paginação
        document.getElementById('itensPorPaginaSelect')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.atualizarListaLocadores();
        });

        // Máscara para CEP
        this.aplicarMascaraCEP();
        
        this.atualizarDashboard();
    }

    carregarDadosDemo() {
        // Dados de demonstração para imóveis
        const imoveisDemo = [
            {
                id: 1,
                codigo: '20001234',
                denominacao: 'ED - CAIXA Brasília Centro, DF',
                local: 'Brasília',
                endereco: 'SBS Quadra 04, Bloco A, Lote 3/4',
                cep: '70070-140',
                status: 'Ativo',
                inicioValidade: '2023-01-15',
                objetoValidoAte: null,
                inscricaoIPTU: 'BSB123456',
                numeroITR: null
            },
            {
                id: 2,
                codigo: '20005678',
                denominacao: 'ED - CAIXA São Paulo Centro, SP',
                local: 'São Paulo',
                endereco: 'Praça da Sé, 111',
                cep: '01001-000',
                status: 'Ativo',
                inicioValidade: '2023-02-20',
                objetoValidoAte: null,
                inscricaoIPTU: 'SP789123',
                numeroITR: null
            },
            {
                id: 3,
                codigo: '20009999',
                denominacao: 'ED - CAIXA Rio de Janeiro Centro, RJ',
                local: 'Rio de Janeiro',
                endereco: 'Av. Presidente Vargas, 3131',
                cep: '20210-030',
                status: 'Ativo',
                inicioValidade: '2023-03-10',
                objetoValidoAte: null,
                inscricaoIPTU: 'RJ456789',
                numeroITR: null
            },
            {
                id: 4,
                codigo: '20001111',
                denominacao: 'ED - CAIXA Belo Horizonte Centro, MG',
                local: 'Belo Horizonte',
                endereco: 'Av. Afonso Pena, 1000',
                cep: '30130-002',
                status: 'Ativo',
                inicioValidade: '2023-01-05',
                objetoValidoAte: null,
                inscricaoIPTU: 'BH123789',
                numeroITR: null
            },
            {
                id: 5,
                codigo: '20002222',
                denominacao: 'ED - CAIXA Fortaleza Centro, CE',
                local: 'Fortaleza',
                endereco: 'Rua Major Facundo, 500',
                cep: '60025-100',
                status: 'Ativo',
                inicioValidade: '2023-04-12',
                objetoValidoAte: null,
                inscricaoIPTU: 'FOR789456',
                numeroITR: null
            },
            {
                id: 6,
                codigo: '20003333',
                denominacao: 'ED - CAIXA Recife Centro, PE',
                local: 'Recife',
                endereco: 'Av. Guararapes, 250',
                cep: '50010-000',
                status: 'Em prospecção',
                inicioValidade: '2023-06-01',
                objetoValidoAte: null,
                inscricaoIPTU: 'REC456123',
                numeroITR: null
            },
            {
                id: 7,
                codigo: '20004444',
                denominacao: 'ED - CAIXA Salvador Centro, BA',
                local: 'Salvador',
                endereco: 'Rua Miguel Calmon, 285',
                cep: '40070-110',
                status: 'Ativo',
                inicioValidade: '2023-02-28',
                objetoValidoAte: null,
                inscricaoIPTU: 'SSA789123',
                numeroITR: null
            },
            {
                id: 8,
                codigo: '20005555',
                denominacao: 'ED - CAIXA Porto Alegre Centro, RS',
                local: 'Porto Alegre',
                endereco: 'Rua dos Andradas, 1001',
                cep: '90020-007',
                status: 'Ativo',
                inicioValidade: '2023-03-15',
                objetoValidoAte: null,
                inscricaoIPTU: 'POA123456',
                numeroITR: null
            },
            {
                id: 9,
                codigo: '20006666',
                denominacao: 'ED - CAIXA Curitiba Centro, PR',
                local: 'Curitiba',
                endereco: 'Rua XV de Novembro, 200',
                cep: '80020-310',
                status: 'Em mobilização',
                inicioValidade: '2023-05-20',
                objetoValidoAte: null,
                inscricaoIPTU: 'CWB789456',
                numeroITR: null
            },
            {
                id: 10,
                codigo: '20007777',
                denominacao: 'ED - CAIXA Manaus Centro, AM',
                local: 'Manaus',
                endereco: 'Av. Eduardo Ribeiro, 620',
                cep: '69010-001',
                status: 'Ativo',
                inicioValidade: '2023-04-08',
                objetoValidoAte: null,
                inscricaoIPTU: 'MAO456789',
                numeroITR: null
            },
            {
                id: 11,
                codigo: '20008888',
                denominacao: 'ED - CAIXA Belém Centro, PA',
                local: 'Belém',
                endereco: 'Av. Presidente Vargas, 800',
                cep: '66017-000',
                status: 'Ativo',
                inicioValidade: '2023-01-30',
                objetoValidoAte: null,
                inscricaoIPTU: 'BEL123789',
                numeroITR: null
            },
            {
                id: 12,
                codigo: '20009000',
                denominacao: 'ED - CAIXA Goiânia Centro, GO',
                local: 'Goiânia',
                endereco: 'Av. Goiás, 300',
                cep: '74010-010',
                status: 'Ativo',
                inicioValidade: '2023-03-22',
                objetoValidoAte: null,
                inscricaoIPTU: 'GYN789123',
                numeroITR: null
            },
            {
                id: 13,
                codigo: '20001010',
                denominacao: 'ED - CAIXA Vitória Centro, ES',
                local: 'Vitória',
                endereco: 'Av. Jerônimo Monteiro, 100',
                cep: '29010-001',
                status: 'Em prospecção',
                inicioValidade: '2023-06-15',
                objetoValidoAte: null,
                inscricaoIPTU: 'VIT456789',
                numeroITR: null
            },
            {
                id: 14,
                codigo: '20002020',
                denominacao: 'ED - CAIXA Campo Grande Centro, MS',
                local: 'Campo Grande',
                endereco: 'Av. Afonso Pena, 1500',
                cep: '79002-070',
                status: 'Ativo',
                inicioValidade: '2023-02-12',
                objetoValidoAte: null,
                inscricaoIPTU: 'CGR123456',
                numeroITR: null
            },
            {
                id: 15,
                codigo: '20003030',
                denominacao: 'ED - CAIXA Cuiabá Centro, MT',
                local: 'Cuiabá',
                endereco: 'Av. Getúlio Vargas, 600',
                cep: '78005-370',
                status: 'Ativo',
                inicioValidade: '2023-04-25',
                objetoValidoAte: null,
                inscricaoIPTU: 'CBA789456',
                numeroITR: null
            },
            {
                id: 16,
                codigo: '20004040',
                denominacao: 'ED - CAIXA João Pessoa Centro, PB',
                local: 'João Pessoa',
                endereco: 'Av. Dom Pedro II, 400',
                cep: '58010-660',
                status: 'Em desmobilização',
                inicioValidade: '2022-12-01',
                objetoValidoAte: '2023-12-31',
                inscricaoIPTU: 'JPA456123',
                numeroITR: null
            },
            {
                id: 17,
                codigo: '20005050',
                denominacao: 'ED - CAIXA Natal Centro, RN',
                local: 'Natal',
                endereco: 'Av. Rio Branco, 510',
                cep: '59025-001',
                status: 'Em prospecção',
                inicioValidade: '2023-07-01',
                objetoValidoAte: null,
                inscricaoIPTU: 'NAT789123',
                numeroITR: null
            },
            {
                id: 18,
                codigo: '20006060',
                denominacao: 'ED - CAIXA Aracaju Centro, SE',
                local: 'Aracaju',
                endereco: 'Rua João Pessoa, 120',
                cep: '49010-000',
                status: 'Ativo',
                inicioValidade: '2023-05-10',
                objetoValidoAte: null,
                inscricaoIPTU: 'AJU123789',
                numeroITR: null
            },
            {
                id: 19,
                codigo: '20007070',
                denominacao: 'ED - CAIXA Maceió Centro, AL',
                local: 'Maceió',
                endereco: 'Rua do Comércio, 200',
                cep: '57020-000',
                status: 'Em mobilização',
                inicioValidade: '2023-06-20',
                objetoValidoAte: null,
                inscricaoIPTU: 'MCZ456789',
                numeroITR: null
            },
            {
                id: 20,
                codigo: '20008080',
                denominacao: 'ED - CAIXA Teresina Centro, PI',
                local: 'Teresina',
                endereco: 'Rua Areolino de Abreu, 300',
                cep: '64000-040',
                status: 'Ativo',
                inicioValidade: '2023-03-18',
                objetoValidoAte: null,
                inscricaoIPTU: 'THE789123',
                numeroITR: null
            },
            {
                id: 21,
                codigo: '20009090',
                denominacao: 'ED - CAIXA São Luís Centro, MA',
                local: 'São Luís',
                endereco: 'Rua da Palma, 150',
                cep: '65010-440',
                status: 'Em desmobilização',
                inicioValidade: '2022-11-15',
                objetoValidoAte: '2023-11-30',
                inscricaoIPTU: 'SLZ123456',
                numeroITR: null
            },
            {
                id: 22,
                codigo: '20001212',
                denominação: 'ED - CAIXA Florianópolis Centro, SC',
                local: 'Florianópolis',
                endereco: 'Rua Felipe Schmidt, 390',
                cep: '88010-001',
                status: 'Ativo',
                inicioValidade: '2023-01-25',
                objetoValidoAte: null,
                inscricaoIPTU: 'FLN789456',
                numeroITR: null
            },
            {
                id: 23,
                codigo: '20002323',
                denominacao: 'ED - CAIXA Palmas Centro, TO',
                local: 'Palmas',
                endereco: 'Av. Teotônio Segurado, 1000',
                cep: '77001-002',
                status: 'Desativado',
                inicioValidade: '2022-06-01',
                objetoValidoAte: '2023-06-01',
                inscricaoIPTU: 'PAL456123',
                numeroITR: null
            }
        ];

        // Dados de demonstração para locadores
        const locadoresDemo = [
            // Locadores para Brasília (imovel 1)
            { id: 1, nome: 'João Silva Santos', tipo: 'Pessoa Física', imovelId: 1, documento: '123.456.789-01', documentos: this.gerarDocumentosDemo() },
            { id: 2, nome: 'Maria Oliveira Costa', tipo: 'Pessoa Física', imovelId: 1, documento: '987.654.321-02', documentos: this.gerarDocumentosDemo() },
            { id: 3, nome: 'Construtora ABC Ltda', tipo: 'Pessoa Jurídica', imovelId: 1, documento: '12.345.678/0001-90', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para São Paulo (imovel 2)
            { id: 4, nome: 'Carlos Eduardo Lima', tipo: 'Pessoa Física', imovelId: 2, documento: '456.789.123-03', documentos: this.gerarDocumentosDemo() },
            { id: 5, nome: 'Ana Paula Ferreira', tipo: 'Pessoa Física', imovelId: 2, documento: '789.123.456-04', documentos: this.gerarDocumentosDemo() },
            { id: 6, nome: 'Imobiliária Prime SP', tipo: 'Pessoa Jurídica', imovelId: 2, documento: '23.456.789/0001-81', documentos: this.gerarDocumentosDemo() },
            { id: 7, nome: 'Roberto Almeida', tipo: 'Pessoa Física', imovelId: 2, documento: '321.654.987-05', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Rio de Janeiro (imovel 3)
            { id: 8, nome: 'Fernanda Castro', tipo: 'Pessoa Física', imovelId: 3, documento: '654.321.789-06', documentos: this.gerarDocumentosDemo() },
            { id: 9, nome: 'Incorporadora RJ S/A', tipo: 'Pessoa Jurídica', imovelId: 3, documento: '34.567.890/0001-72', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Belo Horizonte (imovel 4)
            { id: 10, nome: 'Pedro Henrique Silva', tipo: 'Pessoa Física', imovelId: 4, documento: '147.258.369-07', documentos: this.gerarDocumentosDemo() },
            { id: 11, nome: 'Juliana Rocha', tipo: 'Pessoa Física', imovelId: 4, documento: '258.369.147-08', documentos: this.gerarDocumentosDemo() },
            { id: 12, nome: 'Construtora Minas Ltda', tipo: 'Pessoa Jurídica', imovelId: 4, documento: '45.678.901/0001-63', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Fortaleza (imovel 5)
            { id: 13, nome: 'Rafael Moreira', tipo: 'Pessoa Física', imovelId: 5, documento: '369.147.258-09', documentos: this.gerarDocumentosDemo() },
            { id: 14, nome: 'Camila Souza', tipo: 'Pessoa Física', imovelId: 5, documento: '741.852.963-10', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Salvador (imovel 7)
            { id: 15, nome: 'Bruno Costa', tipo: 'Pessoa Física', imovelId: 7, documento: '852.963.741-11', documentos: this.gerarDocumentosDemo() },
            { id: 16, nome: 'Larissa Pereira', tipo: 'Pessoa Física', imovelId: 7, documento: '963.741.852-12', documentos: this.gerarDocumentosDemo() },
            { id: 17, nome: 'Imóveis Bahia Ltda', tipo: 'Pessoa Jurídica', imovelId: 7, documento: '56.789.012/0001-54', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Porto Alegre (imovel 8)
            { id: 18, nome: 'Gustavo Ribeiro', tipo: 'Pessoa Física', imovelId: 8, documento: '159.357.486-13', documentos: this.gerarDocumentosDemo() },
            { id: 19, nome: 'Patrícia Martins', tipo: 'Pessoa Física', imovelId: 8, documento: '357.486.159-14', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Manaus (imovel 10)
            { id: 20, nome: 'Alexandre Santos', tipo: 'Pessoa Física', imovelId: 10, documento: '486.159.357-15', documentos: this.gerarDocumentosDemo() },
            { id: 21, nome: 'Incorporadora Amazônia', tipo: 'Pessoa Jurídica', imovelId: 10, documento: '67.890.123/0001-45', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Belém (imovel 11)
            { id: 22, nome: 'Marcos Vieira', tipo: 'Pessoa Física', imovelId: 11, documento: '159.486.357-16', documentos: this.gerarDocumentosDemo() },
            { id: 23, nome: 'Priscila Gomes', tipo: 'Pessoa Física', imovelId: 11, documento: '486.357.159-17', documentos: this.gerarDocumentosDemo() },
            
            // Locadores para Goiânia (imovel 12)
            { id: 24, nome: 'Rodrigo Barbosa', tipo: 'Pessoa Física', imovelId: 12, documento: '357.159.486-18', documentos: this.gerarDocumentosDemo() },
            { id: 25, nome: 'Construtora GO S/A', tipo: 'Pessoa Jurídica', imovelId: 12, documento: '78.901.234/0001-36', documentos: this.gerarDocumentosDemo() },
            
            // Alguns imóveis sem locadores para demonstrar alertas
        ];

        this.imoveis = imoveisDemo;
        this.locadores = locadoresDemo;
        
        this.atualizarDashboard();
        this.atualizarTabelaImoveis();
        
        console.log('Dados de demonstração carregados:', {
            imoveis: this.imoveis.length,
            locadores: this.locadores.length
        });
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
        const tbody = document.getElementById('tabelaImoveis');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.imoveis.forEach(imovel => {
            const locadoresDoImovel = this.locadores.filter(l => l.imovelId === imovel.id);
            const quantidadeLocadores = locadoresDoImovel.length;
            
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${imovel.codigo}</td>
                <td>${imovel.denominacao}</td>
                <td>${imovel.local}</td>
                <td><span class="status-badge ${imovel.status.toLowerCase().replace(' ', '-')}">${imovel.status}</span></td>
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
                        <button class="btn btn-sm btn-primary" onclick="sistema.selecionarImovel(${imovel.id})">
                            ${this.imovelSelecionado?.id === imovel.id ? '✓ Selecionado' : 'Selecionar'}
                        </button>
                        <button class="btn btn-sm btn-secondary" onclick="sistema.editarImovel(${imovel.id})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="sistema.removerImovel(${imovel.id})">Remover</button>
                    </div>
                </td>
            `;

            // Adicionar classe de destaque se não tiver locadores
            if (quantidadeLocadores === 0) {
                row.classList.add('imovel-warning');
            }
        });
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
