// Sistema Integrado de Cadastro de Imóveis e Locadores com Upload de Documentos
class SistemaIntegrado {
    constructor() {
        // Configuração de dados e simulação
        this.modoSimulacao = false;
        this.dadosReaisCarregados = false;
        this.mapeamentoCampos = {};
        this.metricasPerformance = {
            temposResposta: [],
            operacoesExecutadas: 0,
            errosEncontrados: [],
            usoMemoria: []
        };
        
        // Dados iniciais do sistema original
        this.imoveis = [
            {
                id: 1,
                // Campos CAIXA
                codigoSIPGE: "20000001",
                status: "Ativo",
                denominacao: "ED - CAIXA São Paulo Centro, SP",
                cidade: "São Paulo",
                endereco: "Av. Paulista, 1578 - Bela Vista",
                cep: "01310-200",
                inicioValidade: "2024-01-15",
                fimValidade: null,
                iptu: "146.300.0023-9",
                itr: null,
                // Campos legados (compatibilidade)
                tipo: "Comercial",
                area: "250m²"
            },
            {
                id: 2,
                // Campos CAIXA
                codigoSIPGE: "20000002", 
                status: "Ativo",
                denominacao: "ED - CAIXA Rio de Janeiro Centro, RJ",
                cidade: "Rio de Janeiro",
                endereco: "Rua das Flores, 123 - Centro",
                cep: "20040-020",
                inicioValidade: "2024-02-01",
                fimValidade: null,
                iptu: "0123456789",
                itr: null,
                // Campos legados (compatibilidade)
                tipo: "Residencial",
                area: "180m²"
            },
            {
                id: 3,
                // Campos CAIXA
                codigoSIPGE: "20000003",
                status: "Em prospecção",
                denominacao: "ED - CAIXA Brasília SBS, DF",
                cidade: "Brasília",
                endereco: "Setor Bancário Sul, Quadra 4",
                cep: "70070-120",
                inicioValidade: "2024-03-01",
                fimValidade: null,
                iptu: "987654321",
                itr: "ITR2024001",
                // Campos legados (compatibilidade)
                tipo: "Comercial",
                area: "320m²"
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

        // Adicionar mais locadores para teste de UX
        for (let i = 4; i <= 15; i++) {
            this.locadores.push({
                id: i,
                nome: `Locador Teste ${i}`,
                tipo: i % 2 === 0 ? "Pessoa Jurídica" : "Pessoa Física",
                cpf: i % 2 === 1 ? `${String(i).padStart(3, '0')}.000.000-0${i % 10}` : undefined,
                cnpj: i % 2 === 0 ? `${String(i).padStart(2, '0')}.000.000/0001-${String(i % 100).padStart(2, '0')}` : undefined,
                imovelId: 1, // Todos no primeiro imóvel para testar
                status: "Ativo",
                documentos: this.gerarDocumentosAleatorios(i % 2 === 0 ? "Pessoa Jurídica" : "Pessoa Física")
            });
        }

        this.imovelSelecionado = this.imoveis[0]; // Seleciona o primeiro imóvel por padrão
        this.proximoIdImovel = 4;
        this.proximoIdLocador = 16;
        
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

    // ======================
    // FUNCIONALIDADES DE IMPORTAÇÃO
    // ======================
    
    async importarDadosReais(dadosJson) {
        console.log('📊 Iniciando importação de dados reais...');
        this.marcarInicioOperacao('importacao_dados');
        
        try {
            // Validar estrutura dos dados
            if (!this.validarEstruturaDados(dadosJson)) {
                throw new Error('Estrutura de dados inválida');
            }
            
            // Fazer backup dos dados atuais
            this.backupDados = {
                imoveis: [...this.imoveis],
                locadores: [...this.locadores]
            };
            
            // Aplicar mapeamento de campos
            const imoveisImportados = this.aplicarMapeamento(dadosJson.imoveis, 'imoveis');
            const locadoresImportados = this.aplicarMapeamento(dadosJson.locadores, 'locadores');
            
            // Substituir dados
            this.imoveis = imoveisImportados;
            this.locadores = locadoresImportados;
            
            // Atualizar IDs
            this.proximoIdImovel = Math.max(...this.imoveis.map(i => i.id)) + 1;
            this.proximoIdLocador = Math.max(...this.locadores.map(l => l.id)) + 1;
            
            // Marcar como dados reais carregados
            this.dadosReaisCarregados = true;
            this.modoSimulacao = true;
            
            // Atualizar interface
            this.atualizarInterface();
            
            // Validar integridade dos dados importados
            const relatorioIntegridade = this.validarIntegridadeDados();
            
            this.marcarFimOperacao('importacao_dados');
            this.adicionarMetrica('dados_importados', {
                totalImoveis: this.imoveis.length,
                totalLocadores: this.locadores.length,
                problemas: relatorioIntegridade.problemas.length
            });
            
            console.log('✅ Dados importados com sucesso!', relatorioIntegridade);
            this.mostrarNotificacao(`Dados importados: ${this.imoveis.length} imóveis, ${this.locadores.length} locadores`, 'success');
            
            return relatorioIntegridade;
            
        } catch (error) {
            this.marcarFimOperacao('importacao_dados', error);
            console.error('❌ Erro na importação:', error);
            this.mostrarNotificacao(`Erro na importação: ${error.message}`, 'error');
            throw error;
        }
    }
    
    validarEstruturaDados(dados) {
        if (!dados || typeof dados !== 'object') {
            console.error('Dados não é um objeto válido');
            return false;
        }
        
        if (!Array.isArray(dados.imoveis)) {
            console.error('Campo "imoveis" deve ser um array');
            return false;
        }
        
        if (!Array.isArray(dados.locadores)) {
            console.error('Campo "locadores" deve ser um array');
            return false;
        }
        
        if (dados.imoveis.length === 0) {
            console.error('Array de imóveis está vazio');
            return false;
        }
        
        return true;
    }
    
    aplicarMapeamento(dados, tipo) {
        const mapeamento = this.mapeamentoCampos[tipo] || {};
        
        return dados.map((item, index) => {
            const itemMapeado = {
                id: item.id || index + 1,
                status: 'Ativo'
            };
            
            if (tipo === 'imoveis') {
                itemMapeado.endereco = item[mapeamento.endereco] || item.endereco || `Endereço ${index + 1}`;
                itemMapeado.tipo = item[mapeamento.tipo] || item.tipo || 'Não Informado';
                itemMapeado.area = item[mapeamento.area] || item.area || 'N/A';
            } else if (tipo === 'locadores') {
                itemMapeado.nome = item[mapeamento.nome] || item.nome || `Locador ${index + 1}`;
                itemMapeado.tipo = item[mapeamento.tipoLocador] || item.tipo || 'Pessoa Física';
                itemMapeado.cpf = item[mapeamento.cpf] || item.cpf || null;
                itemMapeado.cnpj = item[mapeamento.cnpj] || item.cnpj || null;
                itemMapeado.imovelId = item[mapeamento.imovelId] || item.imovelId || 1;
                itemMapeado.documentos = this.gerarDocumentosAleatorios(itemMapeado.tipo);
            }
            
            return itemMapeado;
        });
    }
    
    configurarMapeamento(mapeamento) {
        this.mapeamentoCampos = mapeamento;
        console.log('🔗 Mapeamento de campos configurado:', mapeamento);
    }
    
    validarIntegridadeDados() {
        const relatorio = {
            resumo: {
                totalImoveis: this.imoveis.length,
                totalLocadores: this.locadores.length,
                imoveisComLocadores: 0,
                imoveisSemLocadores: 0,
                locadoresSemImoveis: 0
            },
            problemas: [],
            recomendacoes: []
        };
        
        // Verificar imóveis sem locadores
        const imoveisComLocadores = new Set(this.locadores.map(l => l.imovelId));
        const imoveisSemLocadores = this.imoveis.filter(i => !imoveisComLocadores.has(i.id));
        
        relatorio.resumo.imoveisComLocadores = imoveisComLocadores.size;
        relatorio.resumo.imoveisSemLocadores = imoveisSemLocadores.length;
        
        if (imoveisSemLocadores.length > 0) {
            relatorio.problemas.push(`${imoveisSemLocadores.length} imóveis sem locadores vinculados`);
            relatorio.recomendacoes.push('Verificar relacionamentos entre imóveis e locadores');
        }
        
        // Verificar locadores sem imóveis válidos
        const idsImoveisValidos = new Set(this.imoveis.map(i => i.id));
        const locadoresSemImoveis = this.locadores.filter(l => !idsImoveisValidos.has(l.imovelId));
        
        relatorio.resumo.locadoresSemImoveis = locadoresSemImoveis.length;
        
        if (locadoresSemImoveis.length > 0) {
            relatorio.problemas.push(`${locadoresSemImoveis.length} locadores vinculados a imóveis inexistentes`);
            relatorio.recomendacoes.push('Corrigir IDs de relacionamento dos locadores');
        }
        
        // Verificar performance com grande volume
        if (this.imoveis.length > 10000) {
            relatorio.recomendacoes.push('Volume alto de dados - considerar implementar paginação virtual');
        }
        
        if (this.locadores.length / this.imoveis.length > 5) {
            relatorio.recomendacoes.push('Muitos locadores por imóvel - otimizar interface para grandes listas');
        }
        
        return relatorio;
    }
    
    // ======================
    // MÉTRICAS E PERFORMANCE
    // ======================
    
    marcarInicioOperacao(operacao) {
        this.operacaoAtual = {
            nome: operacao,
            inicio: performance.now(),
            timestamp: new Date()
        };
    }
    
    marcarFimOperacao(operacao, erro = null) {
        if (!this.operacaoAtual) return;
        
        const fim = performance.now();
        const duracao = fim - this.operacaoAtual.inicio;
        
        this.metricasPerformance.temposResposta.push({
            operacao: operacao,
            duracao: duracao,
            timestamp: new Date(),
            sucesso: !erro
        });
        
        this.metricasPerformance.operacoesExecutadas++;
        
        if (erro) {
            this.metricasPerformance.errosEncontrados.push({
                operacao: operacao,
                erro: erro.message,
                timestamp: new Date()
            });
        }
        
        // Coletar uso de memória se disponível
        if (window.performance && window.performance.memory) {
            this.metricasPerformance.usoMemoria.push({
                usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                timestamp: new Date()
            });
        }
        
        this.operacaoAtual = null;
    }
    
    adicionarMetrica(tipo, dados) {
        if (!this.metricasPerformance.custom) {
            this.metricasPerformance.custom = [];
        }
        
        this.metricasPerformance.custom.push({
            tipo: tipo,
            dados: dados,
            timestamp: new Date()
        });
    }
    
    obterEstatisticasPerformance() {
        const tempos = this.metricasPerformance.temposResposta;
        
        if (tempos.length === 0) {
            return {
                tempoMedio: 0,
                tempoMaximo: 0,
                tempoMinimo: 0,
                operacoesExecutadas: 0,
                errosEncontrados: 0,
                taxaSucesso: 100
            };
        }
        
        const duracoes = tempos.map(t => t.duracao);
        const sucessos = tempos.filter(t => t.sucesso).length;
        
        return {
            tempoMedio: duracoes.reduce((a, b) => a + b, 0) / duracoes.length,
            tempoMaximo: Math.max(...duracoes),
            tempoMinimo: Math.min(...duracoes),
            operacoesExecutadas: this.metricasPerformance.operacoesExecutadas,
            errosEncontrados: this.metricasPerformance.errosEncontrados.length,
            taxaSucesso: (sucessos / tempos.length) * 100,
            usoMemoriaAtual: this.obterUsoMemoriaAtual()
        };
    }
    
    obterUsoMemoriaAtual() {
        if (window.performance && window.performance.memory) {
            return {
                usado: Math.round(window.performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(window.performance.memory.totalJSHeapSize / 1024 / 1024),
                unidade: 'MB'
            };
        }
        return { usado: 0, total: 0, unidade: 'MB' };
    }
    
    // ======================
    // SIMULAÇÃO DE CENÁRIOS
    // ======================
    
    simularCenarioAnalista() {
        console.log('👤 Simulando cenário: Analista de Locação');
        
        return new Promise((resolve) => {
            const acoes = [
                () => this.simularConsultaDashboard(),
                () => this.simularBuscaImoveis('centro'),
                () => this.simularCadastroImovel(),
                () => this.simularVinculacaoLocador(),
                () => this.simularUploadDocumento()
            ];
            
            let indiceAcao = 0;
            
            const executarProximaAcao = () => {
                if (indiceAcao >= acoes.length) {
                    resolve(this.obterEstatisticasPerformance());
                    return;
                }
                
                const acao = acoes[indiceAcao++];
                acao();
                
                // Simular tempo entre ações
                setTimeout(executarProximaAcao, 1000 + Math.random() * 2000);
            };
            
            executarProximaAcao();
        });
    }
    
    simularConsultaDashboard() {
        this.marcarInicioOperacao('consulta_dashboard');
        
        // Simular cálculo de estatísticas
        const stats = this.calcularEstatisticas();
        
        this.marcarFimOperacao('consulta_dashboard');
        console.log('📊 Dashboard consultado:', stats);
    }
    
    simularBuscaImoveis(termo) {
        this.marcarInicioOperacao('busca_imoveis');
        
        // Simular filtro
        this.filtros.busca = termo;
        const resultados = this.aplicarFiltros();
        
        this.marcarFimOperacao('busca_imoveis');
        console.log('🔍 Busca realizada:', resultados.length, 'resultados');
    }
    
    simularCadastroImovel() {
        this.marcarInicioOperacao('cadastro_imovel');
        
        const novoImovel = {
            id: this.proximoIdImovel++,
            endereco: `Rua Simulada ${Math.floor(Math.random() * 1000)}`,
            tipo: Math.random() > 0.5 ? 'Comercial' : 'Residencial',
            area: `${Math.floor(Math.random() * 300 + 50)}m²`,
            status: 'Ativo'
        };
        
        this.imoveis.push(novoImovel);
        
        this.marcarFimOperacao('cadastro_imovel');
        console.log('🏠 Imóvel cadastrado:', novoImovel);
    }
    
    simularVinculacaoLocador() {
        this.marcarInicioOperacao('vinculacao_locador');
        
        if (this.imoveis.length > 0) {
            const imovelId = this.imoveis[Math.floor(Math.random() * this.imoveis.length)].id;
            
            const novoLocador = {
                id: this.proximoIdLocador++,
                nome: `Locador Simulado ${Math.floor(Math.random() * 1000)}`,
                tipo: Math.random() > 0.7 ? 'Pessoa Jurídica' : 'Pessoa Física',
                imovelId: imovelId,
                status: 'Ativo',
                documentos: this.gerarDocumentosAleatorios(Math.random() > 0.7 ? 'Pessoa Jurídica' : 'Pessoa Física')
            };
            
            if (novoLocador.tipo === 'Pessoa Física') {
                novoLocador.cpf = `${Math.floor(Math.random() * 900 + 100)}.000.000-${Math.floor(Math.random() * 90 + 10)}`;
            } else {
                novoLocador.cnpj = `${Math.floor(Math.random() * 90 + 10)}.000.000/0001-${Math.floor(Math.random() * 90 + 10)}`;
            }
            
            this.locadores.push(novoLocador);
        }
        
        this.marcarFimOperacao('vinculacao_locador');
        console.log('👤 Locador vinculado');
    }
    
    simularUploadDocumento() {
        this.marcarInicioOperacao('upload_documento');
        
        // Simular tempo de upload
        setTimeout(() => {
            this.marcarFimOperacao('upload_documento');
            console.log('📎 Documento enviado');
        }, 2000 + Math.random() * 3000);
    }
    
    // ======================
    // INTERFACE APRIMORADA
    // ======================
    
    mostrarNotificacao(mensagem, tipo = 'info') {
        // Criar elemento de notificação se não existir
        let container = document.getElementById('notificacoes');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notificacoes';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }
        
        const notificacao = document.createElement('div');
        notificacao.style.cssText = `
            background: ${tipo === 'success' ? '#d4edda' : tipo === 'error' ? '#f8d7da' : '#d1ecf1'};
            border: 1px solid ${tipo === 'success' ? '#c3e6cb' : tipo === 'error' ? '#f5c6cb' : '#bee5eb'};
            color: ${tipo === 'success' ? '#155724' : tipo === 'error' ? '#721c24' : '#0c5460'};
            padding: 1rem;
            margin: 0.5rem 0;
            border-radius: 6px;
            animation: slideIn 0.3s ease-out;
        `;
        
        const icone = tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️';
        notificacao.innerHTML = `${icone} ${mensagem}`;
        
        container.appendChild(notificacao);
        
        // Remover após 5 segundos
        setTimeout(() => {
            if (notificacao.parentNode) {
                notificacao.remove();
            }
        }, 5000);
    }
    
    atualizarInterface() {
        this.renderizarTabelaImoveis();
        this.atualizarDashboard();
        this.aplicarFiltros();
    }
    
    // Método para exportar métricas
    exportarMetricas() {
        const dados = {
            timestamp: new Date().toISOString(),
            dadosReaisCarregados: this.dadosReaisCarregados,
            volumeDados: {
                imoveis: this.imoveis.length,
                locadores: this.locadores.length
            },
            estatisticas: this.obterEstatisticasPerformance(),
            metricas: this.metricasPerformance
        };
        
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `metricas-silic-${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.mostrarNotificacao('Métricas exportadas com sucesso!', 'success');
    }

    gerarDocumentosAleatorios(tipo) {
        const documentos = tipo === "Pessoa Física" ? {
            "Matrícula do Imóvel": Math.random() > 0.3,
            "Certidão Negativa IPTU": Math.random() > 0.4,
            "Habite-se": Math.random() > 0.5,
            "Permissão Atividade Bancária": Math.random() > 0.6,
            "Manifestação CILOG": Math.random() > 0.7,
            "Documento de Identidade": Math.random() > 0.2,
            "CND Federal": Math.random() > 0.5,
            "Documento Cônjuge": Math.random() > 0.6
        } : {
            "Matrícula do Imóvel": Math.random() > 0.3,
            "Certidão Negativa IPTU": Math.random() > 0.4,
            "Habite-se": Math.random() > 0.5,
            "Permissão Atividade Bancária": Math.random() > 0.6,
            "Manifestação CILOG": Math.random() > 0.7,
            "CNPJ": Math.random() > 0.2,
            "Ato Constitutivo": Math.random() > 0.4,
            "Certidão Junta Comercial": Math.random() > 0.5,
            "CND Federal": Math.random() > 0.5,
            "Certidão FGTS": Math.random() > 0.6,
            "Procuração": Math.random() > 0.7,
            "Documento Representante": Math.random() > 0.3
        };
        
        return documentos;
    }
    
    init() {
        this.setupEventListeners();
        this.renderTabelaImoveis();
        this.atualizarTabela();
        this.updateLocadoresInfo();
        this.atualizarEstatisticas(); // Atualizar dashboard inicial
    }
    
    setupEventListeners() {
        // Cadastro de imóveis - novos campos CAIXA
        document.getElementById('adicionarImovel').addEventListener('click', () => {
            this.adicionarImovel();
        });
        
        document.getElementById('limparFormulario').addEventListener('click', () => {
            this.limparFormularioImovel();
        });
        
        // Suporte a Enter em campos do formulário de imóvel
        const camposImovel = ['codigoEdificio', 'denominacaoEdificio', 'localCidade', 'ruaEndereco', 'cepImovel'];
        camposImovel.forEach(campoId => {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.adicionarImovel();
                    }
                });
            }
        });
        
        // Auto-formatação do CEP
        const cepInput = document.getElementById('cepImovel');
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 5) {
                    value = value.replace(/(\d{5})(\d{0,3})/, '$1-$2');
                }
                e.target.value = value;
            });
        }
        
        // Auto-preenchimento da data de início de validade
        const inicioValidadeInput = document.getElementById('inicioValidadeObj');
        if (inicioValidadeInput) {
            const hoje = new Date().toISOString().split('T')[0];
            inicioValidadeInput.value = hoje;
        }
        
        // Compatibilidade com campo antigo (se existir)
        const enderecoImovelAntigo = document.getElementById('enderecoImovel');
        if (enderecoImovelAntigo) {
            enderecoImovelAntigo.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.adicionarImovel();
                }
            });
        }
        
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
    
    adicionarImovel() {
        // Coletar todos os campos do formulário expandido
        const codigoEdificio = document.getElementById('codigoEdificio')?.value.trim();
        const statusImovel = document.getElementById('statusImovel')?.value;
        const denominacaoEdificio = document.getElementById('denominacaoEdificio')?.value.trim();
        const localCidade = document.getElementById('localCidade')?.value.trim();
        const ruaEndereco = document.getElementById('ruaEndereco')?.value.trim();
        const cepImovel = document.getElementById('cepImovel')?.value.trim();
        const inicioValidadeObj = document.getElementById('inicioValidadeObj')?.value;
        const objetoValidoAte = document.getElementById('objetoValidoAte')?.value;
        const inscricaoIPTU = document.getElementById('inscricaoIPTU')?.value.trim();
        const numeroITR = document.getElementById('numeroITR')?.value.trim();
        
        // Validações obrigatórias
        const camposObrigatorios = [
            { campo: codigoEdificio, nome: 'Código do Edifício (SIPGE/SAP)' },
            { campo: statusImovel, nome: 'Status do Imóvel' },
            { campo: denominacaoEdificio, nome: 'Denominação do Edifício' },
            { campo: localCidade, nome: 'Local (Cidade)' },
            { campo: ruaEndereco, nome: 'Rua/Endereço' },
            { campo: cepImovel, nome: 'CEP' },
            { campo: inicioValidadeObj, nome: 'Início Validade Obj.' }
        ];
        
        for (let validacao of camposObrigatorios) {
            if (!validacao.campo) {
                alert(`❌ Campo obrigatório: ${validacao.nome}`);
                return;
            }
        }
        
        // Validar formato do código SIPGE/SAP
        if (!/^2000\d{4}$/.test(codigoEdificio)) {
            alert('❌ Código do Edifício deve ter 8 dígitos e iniciar com 2000\nExemplo: 20001234');
            return;
        }
        
        // Validar formato do CEP
        if (!/^\d{5}-?\d{3}$/.test(cepImovel)) {
            alert('❌ CEP deve estar no formato 99999-999');
            return;
        }
        
        // Verificar se código já existe
        const codigoExiste = this.imoveis.some(imovel => imovel.codigoSIPGE === codigoEdificio);
        if (codigoExiste) {
            alert(`❌ Código SIPGE/SAP ${codigoEdificio} já está em uso!`);
            return;
        }
        
        const novoImovel = {
            id: this.proximoIdImovel++,
            // Campos obrigatórios da CAIXA
            codigoSIPGE: codigoEdificio,
            status: statusImovel,
            denominacao: denominacaoEdificio,
            cidade: localCidade,
            endereco: ruaEndereco,
            cep: cepImovel,
            inicioValidade: inicioValidadeObj,
            fimValidade: objetoValidoAte || null,
            // Campos opcionais
            iptu: inscricaoIPTU || null,
            itr: numeroITR || null,
            // Campos legados (manter compatibilidade)
            tipo: "Edifício CAIXA",
            area: "Conforme planta"
        };
        
        this.imoveis.push(novoImovel);
        this.limparFormularioImovel();
        this.ocultarFormulario();
        this.renderTabelaImoveis();
        this.atualizarEstatisticas(); // Atualizar dashboard
        
        // Selecionar automaticamente o novo imóvel e focar no campo de locador
        this.selecionarImovel(novoImovel.id);
        
        // Registrar métrica de performance
        this.registrarOperacao('cadastro_imovel', 'sucesso');
        
        // Mostrar dica para adicionar locador
        setTimeout(() => {
            if (confirm(`✅ Imóvel "${denominacaoEdificio}" cadastrado com sucesso!\n\n🏠 Deseja adicionar um locador agora?\n\n(Todo imóvel deve ter pelo menos um locador vinculado)`)) {
                document.getElementById('nomeLocador').focus();
            }
        }, 100);
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
        this.atualizarEstatisticas(); // Atualizar dashboard após adicionar locador
    }
    
    selecionarImovel(imovelId) {
        this.imovelSelecionado = this.imoveis.find(imovel => imovel.id === imovelId);
        this.paginaAtual = 1; // Reset pagination
        this.renderTabelaImoveis();
        this.atualizarTabela();
        this.updateLocadoresInfo();
    }
    
    removerImovel(imovelId) {
        // Usar validação de integridade aprimorada
        if (!this.prevenirRemocaoImovelComLocadores(imovelId)) {
            return;
        }

        const imovel = this.imoveis.find(i => i.id === imovelId);
        const confirmMsg = `🗑️ REMOVER IMÓVEL\n\nImóvel: ${imovel.denominacao || imovel.endereco}\nCódigo: ${imovel.codigoSIPGE || 'N/A'}\n\n⚠️ Esta ação não pode ser desfeita.\n\nConfirma a remoção?`;
        
        if (confirm(confirmMsg)) {
            this.imoveis = this.imoveis.filter(imovel => imovel.id !== imovelId);
            
            if (this.imovelSelecionado && this.imovelSelecionado.id === imovelId) {
                this.imovelSelecionado = this.imoveis.length > 0 ? this.imoveis[0] : null;
            }
            
            this.renderTabelaImoveis();
            this.atualizarTabela();
            this.updateLocadoresInfo();
            this.atualizarEstatisticas(); // Atualizar dashboard após remoção
        }
    }
    
    removerLocador(locadorId) {
        if (confirm('Tem certeza que deseja remover este locador?')) {
            this.locadores = this.locadores.filter(locador => locador.id !== locadorId);
            this.atualizarTabela();
            this.renderTabelaImoveis(); // Atualizar contadores na tabela de imóveis
            this.atualizarEstatisticas(); // Atualizar dashboard após remover locador
            
            // Verificar se o imóvel ficou órfão
            if (this.imovelSelecionado) {
                const locadoresRestantes = this.locadores.filter(l => l.imovelId === this.imovelSelecionado.id);
                if (locadoresRestantes.length === 0) {
                    setTimeout(() => {
                        alert(`⚠️ Atenção: O imóvel "${this.imovelSelecionado.endereco}" ficou sem locadores!\n\nConsidere adicionar um novo locador ou remover o imóvel.`);
                    }, 500);
                }
            }
        }
    }

    verificarImoveisOrfaos() {
        const imoveisOrfaos = this.imoveis.filter(imovel => {
            return this.locadores.filter(locador => locador.imovelId === imovel.id).length === 0;
        });
        
        if (imoveisOrfaos.length > 0) {
            console.warn(`⚠️ Encontrados ${imoveisOrfaos.length} imóvel(is) sem locadores:`, imoveisOrfaos.map(i => i.endereco));
        }
    }

    renderTabelaImoveis() {
        const tbody = document.getElementById('tabelaImoveis');
        
        if (this.imoveis.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="empty-state">
                            <div class="empty-state-icon">🏢</div>
                            <div class="empty-state-title">Nenhum imóvel cadastrado</div>
                            <div class="empty-state-description">
                                Comece adicionando o primeiro imóvel CAIXA no sistema
                            </div>
                            <button class="quick-action" onclick="document.getElementById('codigoEdificio').focus()">
                                ➕ Cadastrar Primeiro Imóvel
                            </button>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.imoveis.map(imovel => {
            const locadoresCount = this.locadores.filter(locador => locador.imovelId === imovel.id).length;
            const isSelected = this.imovelSelecionado && this.imovelSelecionado.id === imovel.id;
            const hasWarning = locadoresCount === 0;
            
            // Determinar classe do badge de contagem
            let countClass = 'many';
            if (locadoresCount === 0) countClass = 'zero';
            else if (locadoresCount <= 2) countClass = 'few';
            
            // Determinar status
            let statusBadge = '';
            let statusText = '';
            if (isSelected) {
                statusBadge = 'selecionado';
                statusText = 'Selecionado';
            } else if (hasWarning) {
                statusBadge = 'inativo';
                statusText = 'Sem Locadores';
            } else {
                statusBadge = 'ativo';
                statusText = 'Ativo';
            }
            
            // Botões de ação
            const canRemove = locadoresCount === 0;
            const removeButton = canRemove 
                ? `<button class="btn btn-danger btn-sm" onclick="sistema.removerImovel(${imovel.id})">🗑️ Remover</button>`
                : `<button class="btn btn-secondary btn-sm" disabled title="Remova os locadores primeiro">🔒 Protegido</button>`;
            
            const warningMessage = hasWarning 
                ? `<div class="action-warning">⚠️ Adicione pelo menos um locador</div>`
                : '';
            
            // Formatação para campos CAIXA (compatibilidade com dados antigos)
            const codigo = imovel.codigoSIPGE || `OLD-${imovel.id}`;
            const denominacao = imovel.denominacao || imovel.endereco || 'Não informado';
            const local = imovel.cidade || 'Não informado';
            const status = imovel.status || 'Ativo';
            
            return `
                <tr class="${isSelected ? 'selected-row' : ''} ${hasWarning ? 'imovel-warning' : ''}" title="Código SIPGE: ${codigo}">
                    <td>
                        <strong>${codigo}</strong>
                        ${hasWarning ? '<span class="warning-icon">⚠️</span>' : ''}
                        <br><small style="color: #666;">ID: ${imovel.id}</small>
                    </td>
                    <td>
                        <div class="denominacao-cell">
                            <strong>${denominacao}</strong>
                            ${imovel.endereco && imovel.endereco !== denominacao ? 
                                `<br><small style="color: #666;">${imovel.endereco}</small>` : 
                                ''
                            }
                        </div>
                    </td>
                    <td>
                        <div class="local-cell">
                            ${local}
                            ${imovel.cep ? `<br><small style="color: #666;">CEP: ${imovel.cep}</small>` : ''}
                        </div>
                    </td>
                    <td>
                        <span class="status-badge ${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span>
                        ${imovel.inicioValidade ? 
                            `<br><small style="color: #666;">Desde: ${new Date(imovel.inicioValidade).toLocaleDateString('pt-BR')}</small>` : 
                            ''
                        }
                    </td>
                    <td>
                        <div class="locadores-count">
                            <span class="count-badge ${countClass}">${locadoresCount}</span>
                            <span>${locadoresCount === 1 ? 'locador' : 'locadores'}</span>
                        </div>
                    </td>
                    <td>
                        <div class="table-actions">
                            <button class="btn btn-primary btn-sm" onclick="sistema.selecionarImovel(${imovel.id})" title="Gerenciar locadores">
                                📍 Selecionar
                            </button>
                            ${removeButton}
                        </div>
                        ${warningMessage}
                    </td>
                </tr>
            `;
        }).join('');
        
        // Verificar e alertar sobre imóveis sem locadores
        this.verificarImoveisOrfaos();
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
            if (totalPaginas > 1) {
                paginationButtons.appendChild(numbersContainer);
            }
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
    
    limparFormularioImovel() {
        // Limpar todos os campos do formulário expandido
        const campos = [
            'codigoEdificio', 'statusImovel', 'denominacaoEdificio',
            'localCidade', 'ruaEndereco', 'cepImovel', 'inicioValidadeObj',
            'objetoValidoAte', 'inscricaoIPTU', 'numeroITR'
        ];
        
        campos.forEach(campo => {
            const elemento = document.getElementById(campo);
            if (elemento) {
                elemento.value = '';
            }
        });
        
        // Definir data atual para início de validade
        const hoje = new Date().toISOString().split('T')[0];
        const inicioValidadeInput = document.getElementById('inicioValidadeObj');
        if (inicioValidadeInput) {
            inicioValidadeInput.value = hoje;
        }
    }
    
    // ======================
    // FUNÇÕES DE INTERFACE UX
    // ======================
    
    mostrarFormulario() {
        const formulario = document.getElementById('formularioImovel');
        if (formulario) {
            formulario.style.display = 'block';
            formulario.scrollIntoView({ behavior: 'smooth' });
            
            // Focar no primeiro campo
            setTimeout(() => {
                document.getElementById('codigoEdificio')?.focus();
            }, 300);
        }
    }
    
    ocultarFormulario() {
        const formulario = document.getElementById('formularioImovel');
        if (formulario) {
            formulario.style.display = 'none';
        }
    }
    
    buscarSIPGE() {
        const codigo = prompt('🔍 Digite o código SIPGE/SAP para buscar:\n(Formato: 20000000)');
        if (codigo && /^2000\d{4}$/.test(codigo)) {
            // Simular busca no SIPGE
            const found = this.imoveis.find(imovel => imovel.codigoSIPGE === codigo);
            if (found) {
                alert(`✅ Imóvel encontrado!\n\nCódigo: ${found.codigoSIPGE}\nDenominação: ${found.denominacao}\nStatus: ${found.status}`);
                this.selecionarImovel(found.id);
            } else {
                if (confirm(`❌ Código ${codigo} não encontrado.\n\n💡 Deseja cadastrar um novo imóvel com este código?`)) {
                    this.mostrarFormulario();
                    document.getElementById('codigoEdificio').value = codigo;
                }
            }
        } else if (codigo) {
            alert('❌ Código inválido!\nFormato correto: 8 dígitos iniciando com 2000');
        }
    }
    
    destacarImoveisSemLocadores() {
        const imoveisSemLocadores = this.imoveis.filter(imovel => {
            return this.locadores.filter(locador => locador.imovelId === imovel.id).length === 0;
        });
        
        if (imoveisSemLocadores.length === 0) {
            alert('✅ Todos os imóveis possuem pelo menos um locador vinculado!');
            return;
        }
        
        const lista = imoveisSemLocadores.map(imovel => 
            `• ${imovel.denominacao || imovel.endereco} (${imovel.codigoSIPGE || 'ID: ' + imovel.id})`
        ).join('\n');
        
        alert(`⚠️ IMÓVEIS SEM LOCADORES (${imoveisSemLocadores.length}):\n\n${lista}\n\n💡 Todo imóvel deve ter pelo menos um locador vinculado.`);
    }
    
    atualizarEstatisticas() {
        // Total de imóveis
        const totalImoveis = this.imoveis.length;
        document.getElementById('totalImoveis').textContent = totalImoveis;
        
        // Imóveis ativos
        const imoveisAtivos = this.imoveis.filter(imovel => imovel.status === 'Ativo').length;
        document.getElementById('imoveisAtivos').textContent = imoveisAtivos;
        
        // Imóveis em prospecção
        const imoveisProspeccao = this.imoveis.filter(imovel => imovel.status === 'Em prospecção').length;
        document.getElementById('imoveisProspeccao').textContent = imoveisProspeccao;
        
        // Imóveis sem locadores
        const imoveisSemLocadores = this.imoveis.filter(imovel => {
            return this.locadores.filter(locador => locador.imovelId === imovel.id).length === 0;
        }).length;
        
        const elementoSemLocadores = document.getElementById('imoveisSemLocadores');
        const numeroSemLocadores = elementoSemLocadores.querySelector('.stat-number');
        
        numeroSemLocadores.textContent = `⚠️ ${imoveisSemLocadores}`;
        
        // Adicionar efeito de alerta se houver imóveis sem locadores
        if (imoveisSemLocadores > 0) {
            elementoSemLocadores.style.animation = 'pulse 2s infinite';
            elementoSemLocadores.style.borderLeft = '4px solid #d32f2f';
        } else {
            elementoSemLocadores.style.animation = 'none';
            elementoSemLocadores.style.borderLeft = 'none';
        }
    }
    
    // ======================
    // AUDITORIA
    // ======================
    
    executarAuditoriaInterface() {
        const problemas = this.executarAuditoriaCompleta();
        
        if (problemas.length === 0) {
            alert('✅ AUDITORIA CONCLUÍDA\n\nNenhum problema encontrado!\n\n🎯 Sistema em conformidade:\n• Todos os imóveis possuem locadores\n• Nenhum código SIPGE duplicado\n• Dados íntegros e consistentes');
            return;
        }
        
        let relatorio = '🔍 RELATÓRIO DE AUDITORIA\n\n';
        
        problemas.forEach((problema, index) => {
            const emoji = problema.tipo === 'CRÍTICO' ? '🚨' : problema.tipo === 'ERRO' ? '❌' : '⚠️';
            relatorio += `${emoji} ${problema.tipo}: ${problema.categoria}\n`;
            relatorio += `   ${problema.descricao}\n`;
            
            if (problema.detalhes && problema.detalhes.length > 0) {
                relatorio += `   Detalhes: ${problema.detalhes.slice(0, 3).join(', ')}`;
                if (problema.detalhes.length > 3) {
                    relatorio += ` (e mais ${problema.detalhes.length - 3})`;
                }
                relatorio += '\n';
            }
            relatorio += '\n';
        });
        
        relatorio += '📋 RECOMENDAÇÕES:\n';
        relatorio += '• Corrija problemas críticos imediatamente\n';
        relatorio += '• Revise dados com avisos\n';
        relatorio += '• Execute auditoria regularmente\n\n';
        relatorio += `📊 Auditoria executada em: ${new Date().toLocaleString('pt-BR')}`;
        
        alert(relatorio);
        
        // Destacar imóveis com problemas no dashboard
        this.atualizarEstatisticas();
    }
    
    executarAuditoriaCompleta() {
        const problemas = [];
        
        // Verificar imóveis sem locadores
        const imoveisSemLocadores = this.imoveis.filter(imovel => {
            return this.locadores.filter(locador => locador.imovelId === imovel.id).length === 0;
        });
        
        if (imoveisSemLocadores.length > 0) {
            problemas.push({
                tipo: 'CRÍTICO',
                categoria: 'Integridade de Dados', 
                descricao: `${imoveisSemLocadores.length} imóvel(is) sem locadores vinculados`,
                detalhes: imoveisSemLocadores.map(i => i.denominacao || i.endereco)
            });
        }
        
        // Verificar códigos SIPGE duplicados
        const codigosSIPGE = this.imoveis.map(i => i.codigoSIPGE).filter(c => c);
        const duplicados = codigosSIPGE.filter((codigo, index) => codigosSIPGE.indexOf(codigo) !== index);
        
        if (duplicados.length > 0) {
            problemas.push({
                tipo: 'ERRO',
                categoria: 'Duplicação',
                descricao: `${duplicados.length} código(s) SIPGE duplicado(s)`,
                detalhes: [...new Set(duplicados)]
            });
        }
        
        // Verificar imóveis sem status ativo há muito tempo
        const imoveisInativos = this.imoveis.filter(i => i.status !== 'Ativo');
        if (imoveisInativos.length > 0) {
            problemas.push({
                tipo: 'AVISO',
                categoria: 'Status',
                descricao: `${imoveisInativos.length} imóvel(is) com status não-ativo`,
                detalhes: imoveisInativos.map(i => `${i.denominacao} (${i.status})`)
            });
        }
        
        return problemas;
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

// ======================
// FUNÇÕES GLOBAIS PARA SIMULAÇÃO
// ======================

// Importar dados reais do Excel convertido
function importarDadosReais(input) {
    const arquivo = input.files[0];
    if (!arquivo) return;
    
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const dados = JSON.parse(e.target.result);
            
            // Verificar se o sistema está inicializado
            if (!sistema) {
                alert('❌ Sistema ainda não foi inicializado. Aguarde um momento.');
                return;
            }
            
            // Configurar mapeamento automaticamente se disponível
            if (dados.mapeamento) {
                sistema.configurarMapeamento(dados.mapeamento);
            }
            
            // Importar dados
            const relatorio = await sistema.importarDadosReais(dados);
            
            // Atualizar interface de status
            atualizarStatusSimulacao();
            
            // Mostrar relatório de importação
            mostrarRelatorioImportacao(relatorio);
            
        } catch (error) {
            console.error('Erro ao importar dados:', error);
            alert(`❌ Erro ao importar dados: ${error.message}`);
        }
    };
    
    reader.readAsText(arquivo);
}

// Atualizar status da simulação na interface
function atualizarStatusSimulacao() {
    if (!sistema) return;
    
    const statusElement = document.getElementById('statusDados');
    const metricsElement = document.getElementById('metricsInfo');
    
    if (sistema.dadosReaisCarregados) {
        statusElement.textContent = `📊 Dados: ${sistema.imoveis.length} imóveis, ${sistema.locadores.length} locadores`;
        statusElement.style.color = '#28a745';
    } else {
        statusElement.textContent = '📊 Dados: Demo';
        statusElement.style.color = '#ffffff';
    }
    
    // Atualizar métricas
    const stats = sistema.obterEstatisticasPerformance();
    metricsElement.textContent = `⚡ Ops: ${stats.operacoesExecutadas} | Tempo: ${stats.tempoMedio.toFixed(0)}ms | Mem: ${stats.usoMemoriaAtual.usado}MB`;
}

// Mostrar relatório de importação
function mostrarRelatorioImportacao(relatorio) {
    const problemas = relatorio.problemas.length > 0 ? 
        `\n\n⚠️ PROBLEMAS:\n${relatorio.problemas.map(p => '• ' + p).join('\n')}` : '';
    
    const recomendacoes = relatorio.recomendacoes.length > 0 ? 
        `\n\n💡 RECOMENDAÇÕES:\n${relatorio.recomendacoes.map(r => '• ' + r).join('\n')}` : '';
    
    const mensagem = `
📊 RELATÓRIO DE IMPORTAÇÃO

✅ DADOS CARREGADOS:
• ${relatorio.resumo.totalImoveis.toLocaleString()} imóveis
• ${relatorio.resumo.totalLocadores.toLocaleString()} locadores
• ${relatorio.resumo.imoveisComLocadores} imóveis com locadores
• ${relatorio.resumo.imoveisSemLocadores} imóveis órfãos
${problemas}${recomendacoes}

🚀 Sistema pronto para simulação!
    `;
    
    alert(mensagem);
}

// Abrir centro de controle em nova aba
function abrirCentroControle() {
    window.open('centro-controle.html', '_blank');
}

// Simular cenário rápido
async function simularCenario() {
    if (!sistema) {
        alert('❌ Sistema não inicializado.');
        return;
    }
    
    // Mostrar opções de cenário
    const cenarios = [
        'Analista - Dia Típico',
        'Gestor - Consulta Relatórios', 
        'Auditor - Verificação Integridade',
        'Mobile - Consulta em Campo'
    ];
    
    const escolha = prompt(`🎬 Escolha um cenário para simular:\n\n${cenarios.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nDigite o número (1-4):`);
    
    if (!escolha || escolha < 1 || escolha > 4) {
        return;
    }
    
    const cenarioEscolhido = cenarios[parseInt(escolha) - 1];
    
    // Mostrar notificação de início
    sistema.mostrarNotificacao(`🚀 Iniciando simulação: ${cenarioEscolhido}`, 'info');
    
    try {
        // Simular cenário (aqui você pode adicionar lógicas específicas)
        const resultado = await sistema.simularCenarioAnalista(); // Por enquanto todos usam o mesmo
        
        // Atualizar métricas na interface
        atualizarStatusSimulacao();
        
        // Mostrar resultado
        const relatorio = `
🎯 SIMULAÇÃO CONCLUÍDA: ${cenarioEscolhido}

📈 RESULTADOS:
• Operações executadas: ${resultado.operacoesExecutadas}
• Tempo médio de resposta: ${resultado.tempoMedio.toFixed(2)}ms
• Tempo máximo: ${resultado.tempoMaximo.toFixed(2)}ms
• Erros encontrados: ${resultado.errosEncontrados}
• Taxa de sucesso: ${resultado.taxaSucesso.toFixed(1)}%
• Uso de memória: ${resultado.usoMemoriaAtual.usado}MB

✅ Simulação concluída com sucesso!
        `;
        
        alert(relatorio);
        sistema.mostrarNotificacao('Simulação concluída com sucesso!', 'success');
        
    } catch (error) {
        console.error('Erro na simulação:', error);
        sistema.mostrarNotificacao(`Erro na simulação: ${error.message}`, 'error');
    }
}

// Função para simular carregamento de dados de teste em massa
function carregarDadosTeste(quantidade = 'medio') {
    if (!sistema) {
        alert('❌ Sistema não inicializado.');
        return;
    }
    
    const volumes = {
        pequeno: { imoveis: 100, locadores: 300 },
        medio: { imoveis: 1000, locadores: 3000 },
        grande: { imoveis: 5000, locadores: 15000 },
        extremo: { imoveis: 10000, locadores: 30000 }
    };
    
    const volume = volumes[quantidade] || volumes.medio;
    
    sistema.mostrarNotificacao(`📊 Gerando ${volume.imoveis} imóveis e ${volume.locadores} locadores...`, 'info');
    
    // Gerar dados sintéticos
    const dadosSinteticos = gerarDadosSinteticos(volume.imoveis, volume.locadores);
    
    // Importar dados
    sistema.importarDadosReais(dadosSinteticos).then(relatorio => {
        atualizarStatusSimulacao();
        sistema.mostrarNotificacao(`Dados de teste carregados: ${volume.imoveis} imóveis`, 'success');
    }).catch(error => {
        sistema.mostrarNotificacao(`Erro ao carregar dados: ${error.message}`, 'error');
    });
}

// Gerar dados sintéticos para teste
function gerarDadosSinteticos(numImoveis, numLocadores) {
    const tipos = ['Comercial', 'Residencial', 'Industrial', 'Misto'];
    const cidades = ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Belo Horizonte', 'Salvador', 'Fortaleza'];
    const nomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira'];
    const empresas = ['LTDA', 'S/A', 'ME', 'EPP', 'EIRELI'];
    
    const imoveis = [];
    const locadores = [];
    
    // Gerar imóveis
    for (let i = 1; i <= numImoveis; i++) {
        const cidade = cidades[Math.floor(Math.random() * cidades.length)];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];
        
        imoveis.push({
            id: i,
            endereco: `Rua Teste ${i}, ${Math.floor(Math.random() * 1000)}, ${cidade}/SP`,
            tipo: tipo,
            area: `${Math.floor(Math.random() * 500 + 50)}m²`,
            status: 'Ativo'
        });
    }
    
    // Gerar locadores
    for (let i = 1; i <= numLocadores; i++) {
        const isPJ = Math.random() > 0.7;
        const nome = isPJ ? 
            `Empresa ${nomes[Math.floor(Math.random() * nomes.length)]} ${empresas[Math.floor(Math.random() * empresas.length)]}` :
            `${nomes[Math.floor(Math.random() * nomes.length)]} ${nomes[Math.floor(Math.random() * nomes.length)]}`;
        
        const imovelId = Math.floor(Math.random() * numImoveis) + 1;
        
        const locador = {
            id: i,
            nome: nome,
            tipo: isPJ ? 'Pessoa Jurídica' : 'Pessoa Física',
            imovelId: imovelId,
            status: 'Ativo'
        };
        
        if (isPJ) {
            locador.cnpj = `${String(Math.floor(Math.random() * 90 + 10))}.000.000/0001-${String(Math.floor(Math.random() * 90 + 10)).padStart(2, '0')}`;
        } else {
            locador.cpf = `${String(Math.floor(Math.random() * 900 + 100))}.000.000-${String(Math.floor(Math.random() * 90 + 10)).padStart(2, '0')}`;
        }
        
        locadores.push(locador);
    }
    
    return {
        imoveis: imoveis,
        locadores: locadores,
        metadados: {
            totalImoveis: numImoveis,
            totalLocadores: numLocadores,
            dataGeracao: new Date().toISOString(),
            tipo: 'dados_sinteticos'
        }
    };
}

// Função para abrir ferramentas auxiliares
function abrirIntegradorDados() {
    window.open('integrador-dados-excel.html', '_blank');
}

// Monitorar performance em tempo real
setInterval(() => {
    if (sistema && sistema.modoSimulacao) {
        atualizarStatusSimulacao();
    }
}, 5000); // Atualizar a cada 5 segundos

// Atalhos de teclado para simulação
document.addEventListener('keydown', (e) => {
    // Ctrl + Shift + S = Simular cenário
    if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        e.preventDefault();
        simularCenario();
    }
    
    // Ctrl + Shift + D = Dados de teste
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        carregarDadosTeste('medio');
    }
    
    // Ctrl + Shift + C = Centro de controle
    if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        abrirCentroControle();
    }
});

// Adicionar estilos para animações de entrada
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .simulation-toolbar {
        animation: slideIn 0.5s ease-out;
    }
    
    .metrics-display {
        font-family: 'Courier New', monospace;
        background: rgba(0,0,0,0.2);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
    }
`;
document.head.appendChild(style);
