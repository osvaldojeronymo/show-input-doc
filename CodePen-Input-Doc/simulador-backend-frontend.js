// Simulador de Backend Java + Frontend Angular
class SimuladorSILIC {
    constructor() {
        this.dadosImoveis = [];
        this.dadosLocadores = [];
        this.configuracao = {
            paginacao: 10,
            maxUploadSize: 10 * 1024 * 1024, // 10MB
            timeoutAPI: 2000,
            enableCache: true
        };
        
        // Simular latência de rede
        this.latenciaRede = {
            consulta: 200,    // 200ms para consultas
            upload: 1000,     // 1s para uploads
            processamento: 500 // 500ms para processamento
        };
    }

    // ======================
    // SIMULAÇÃO BACKEND JAVA
    // ======================

    // Simular endpoints REST
    async simularEndpoint(operacao, dados = null) {
        const latencia = this.latenciaRede[operacao] || 300;
        
        // Simular tempo de resposta
        await new Promise(resolve => setTimeout(resolve, latencia));
        
        // Simular possível erro de rede (5% chance)
        if (Math.random() < 0.05) {
            throw new Error(`Erro de conexão no endpoint: ${operacao}`);
        }
        
        return { status: 'success', timestamp: new Date(), dados };
    }

    // GET /api/imoveis
    async getImoveis(filtros = {}) {
        console.log('🔍 Backend: Consultando imóveis...', filtros);
        
        try {
            let resultado = [...this.dadosImoveis];
            
            // Aplicar filtros (simular SQL WHERE)
            if (filtros.endereco) {
                resultado = resultado.filter(i => 
                    i.endereco.toLowerCase().includes(filtros.endereco.toLowerCase())
                );
            }
            
            if (filtros.tipo) {
                resultado = resultado.filter(i => i.tipo === filtros.tipo);
            }
            
            // Paginação (simular LIMIT/OFFSET)
            const page = filtros.page || 1;
            const limit = filtros.limit || this.configuracao.paginacao;
            const offset = (page - 1) * limit;
            
            const total = resultado.length;
            const itens = resultado.slice(offset, offset + limit);
            
            const response = await this.simularEndpoint('consulta', {
                itens,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasNext: offset + limit < total,
                hasPrev: page > 1
            });
            
            console.log(`✅ Backend: ${itens.length} imóveis retornados`);
            return response.dados;
            
        } catch (error) {
            console.error('❌ Backend Error:', error);
            throw error;
        }
    }

    // GET /api/imoveis/{id}/locadores  
    async getLocadores(imovelId, filtros = {}) {
        console.log(`🔍 Backend: Consultando locadores do imóvel ${imovelId}...`);
        
        try {
            let resultado = this.dadosLocadores.filter(l => l.imovelId == imovelId);
            
            // Aplicar filtros
            if (filtros.nome) {
                resultado = resultado.filter(l => 
                    l.nome.toLowerCase().includes(filtros.nome.toLowerCase())
                );
            }
            
            if (filtros.tipo) {
                resultado = resultado.filter(l => l.tipo === filtros.tipo);
            }
            
            const response = await this.simularEndpoint('consulta', resultado);
            console.log(`✅ Backend: ${resultado.length} locadores retornados`);
            return response.dados;
            
        } catch (error) {
            console.error('❌ Backend Error:', error);
            throw error;
        }
    }

    // POST /api/documentos/upload
    async uploadDocumento(arquivo, metadados) {
        console.log('📤 Backend: Processando upload...', metadados);
        
        try {
            // Simular validações
            if (arquivo.size > this.configuracao.maxUploadSize) {
                throw new Error('Arquivo muito grande. Máximo: 10MB');
            }
            
            const tiposPermitidos = ['pdf', 'jpg', 'png', 'doc', 'docx'];
            const extensao = arquivo.name.split('.').pop().toLowerCase();
            if (!tiposPermitidos.includes(extensao)) {
                throw new Error('Tipo de arquivo não permitido');
            }
            
            // Simular processamento
            const response = await this.simularEndpoint('upload', {
                id: Date.now(),
                nome: arquivo.name,
                tamanho: arquivo.size,
                tipo: arquivo.type,
                url: `https://storage.caixa.gov.br/docs/${Date.now()}_${arquivo.name}`,
                status: 'processado',
                ...metadados
            });
            
            console.log('✅ Backend: Upload concluído');
            return response.dados;
            
        } catch (error) {
            console.error('❌ Backend Upload Error:', error);
            throw error;
        }
    }

    // =========================
    // SIMULAÇÃO FRONTEND ANGULAR
    // =========================

    // Simular Serviços Angular
    criarServicosAngular() {
        return {
            // ImovelService simulation
            imovelService: {
                listar: (filtros) => this.getImoveis(filtros),
                buscar: (id) => this.getImoveis({id}).then(r => r.itens[0]),
                criar: (imovel) => this.simularEndpoint('processamento', imovel),
                atualizar: (id, dados) => this.simularEndpoint('processamento', {id, ...dados}),
                excluir: (id) => this.simularEndpoint('processamento', {id, deleted: true})
            },

            // LocadorService simulation  
            locadorService: {
                listarPorImovel: (imovelId, filtros) => this.getLocadores(imovelId, filtros),
                criar: (locador) => this.simularEndpoint('processamento', locador),
                atualizar: (id, dados) => this.simularEndpoint('processamento', {id, ...dados}),
                excluir: (id) => this.simularEndpoint('processamento', {id, deleted: true})
            },

            // DocumentoService simulation
            documentoService: {
                upload: (arquivo, metadados) => this.uploadDocumento(arquivo, metadados),
                listar: (locadorId) => this.simularEndpoint('consulta', []),
                excluir: (id) => this.simularEndpoint('processamento', {id, deleted: true})
            },

            // NotificacaoService simulation
            notificacaoService: {
                sucesso: (msg) => console.log('🟢 Sucesso:', msg),
                erro: (msg) => console.error('🔴 Erro:', msg),
                info: (msg) => console.log('🔵 Info:', msg),
                warning: (msg) => console.warn('🟡 Aviso:', msg)
            }
        };
    }

    // Simular Componentes Angular
    criarComponentesAngular() {
        return {
            // ImovelListComponent simulation
            imovelList: {
                dados: [],
                filtros: {},
                paginacao: {},
                loading: false,
                
                async carregar() {
                    this.loading = true;
                    try {
                        const resultado = await this.imovelService.listar(this.filtros);
                        this.dados = resultado.itens;
                        this.paginacao = resultado;
                    } finally {
                        this.loading = false;
                    }
                },

                aplicarFiltro(filtros) {
                    this.filtros = {...this.filtros, ...filtros};
                    this.carregar();
                }
            },

            // LocadorGridComponent simulation
            locadorGrid: {
                dados: [],
                imovelSelecionado: null,
                loading: false,
                
                async carregarLocadores(imovelId) {
                    this.loading = true;
                    this.imovelSelecionado = imovelId;
                    try {
                        this.dados = await this.locadorService.listarPorImovel(imovelId);
                    } finally {
                        this.loading = false;
                    }
                }
            },

            // UploadDocumentoComponent simulation  
            uploadDocumento: {
                progresso: 0,
                uploading: false,
                
                async enviarArquivo(arquivo, metadados) {
                    this.uploading = true;
                    this.progresso = 0;
                    
                    try {
                        // Simular progresso
                        const intervalo = setInterval(() => {
                            this.progresso += 10;
                            if (this.progresso >= 90) {
                                clearInterval(intervalo);
                            }
                        }, 100);
                        
                        const resultado = await this.documentoService.upload(arquivo, metadados);
                        
                        clearInterval(intervalo);
                        this.progresso = 100;
                        
                        return resultado;
                    } finally {
                        this.uploading = false;
                    }
                }
            }
        };
    }

    // ==================
    // MÉTRICAS E LOGS
    // ==================

    iniciarMonitoramento() {
        const metricas = {
            consultas: 0,
            uploads: 0,
            erros: 0,
            tempoMedio: 0,
            iniciado: Date.now()
        };

        // Override console para capturar métricas
        const originalLog = console.log;
        console.log = (...args) => {
            if (args[0].includes('Backend:')) {
                metricas.consultas++;
            }
            if (args[0].includes('Upload')) {
                metricas.uploads++;  
            }
            originalLog.apply(console, args);
        };

        // Relatório a cada 30 segundos
        setInterval(() => {
            const tempo = (Date.now() - metricas.iniciado) / 1000;
            console.log('📊 Métricas do Sistema:', {
                ...metricas,
                tempoExecucao: `${tempo}s`,
                consultasPorMinuto: Math.round((metricas.consultas / tempo) * 60)
            });
        }, 30000);

        return metricas;
    }

    // ================
    // INICIALIZAÇÃO
    // ================

    async inicializar(dadosImoveis, dadosLocadores) {
        console.log('🚀 Inicializando Simulador SILIC...');
        
        this.dadosImoveis = dadosImoveis;
        this.dadosLocadores = dadosLocadores;
        
        const servicos = this.criarServicosAngular();
        const componentes = this.criarComponentesAngular();
        const metricas = this.iniciarMonitoramento();
        
        console.log(`✅ Sistema simulado iniciado:
        - ${dadosImoveis.length} imóveis carregados
        - ${dadosLocadores.length} locadores carregados
        - Serviços Angular simulados
        - Monitoramento ativo`);
        
        return { servicos, componentes, metricas };
    }
}

// Exemplo de uso
window.SimuladorSILIC = SimuladorSILIC;
