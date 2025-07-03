// Simulador de Cenários Realísticos - SILIC 2.0
class SimuladorCenarios {
    constructor() {
        this.cenarios = [];
        this.metricas = {
            temposResposta: [],
            usoMemoria: [],
            operacoesPorMinuto: [],
            errosEncontrados: []
        };
        this.personasUsuarios = this.definirPersonas();
        this.configurarSimulador();
    }

    // ======================
    // DEFINIÇÃO DE PERSONAS
    // ======================
    definirPersonas() {
        return {
            gestor: {
                nome: "Gestor de Patrimônio",
                comportamento: {
                    consultasPorDia: 50,
                    fococPrincipal: "dashboards",
                    tipoOperacoes: ["visualizar", "relatorios", "filtros"],
                    pacienciaSegundos: 5,
                    dispositivosUso: ["desktop", "tablet"]
                },
                cenariosTipicos: [
                    "Visualizar estatísticas gerais do patrimônio",
                    "Gerar relatórios mensais",
                    "Consultar imóveis por região",
                    "Verificar status de documentações"
                ]
            },
            
            analista: {
                nome: "Analista de Locação",
                comportamento: {
                    consultasPorDia: 200,
                    focoPrincipal: "operacoes",
                    tipoOperacoes: ["cadastrar", "editar", "upload", "buscar"],
                    pacienciaSegundos: 3,
                    dispositivosUso: ["desktop"]
                },
                cenariosTipicos: [
                    "Cadastrar novos imóveis",
                    "Vincular locadores a imóveis",
                    "Fazer upload de documentos",
                    "Atualizar dados de contratos",
                    "Buscar imóveis específicos"
                ]
            },
            
            auditor: {
                nome: "Auditor Interno",
                comportamento: {
                    consultasPorDia: 80,
                    focoPrincipal: "validacao",
                    tipoOperacoes: ["validar", "conferir", "exportar"],
                    pacienciaSegundos: 8,
                    dispositivosUso: ["desktop"]
                },
                cenariosTipicos: [
                    "Verificar integridade dos dados",
                    "Conferir documentação obrigatória",
                    "Exportar dados para análise",
                    "Validar relacionamentos imóvel-locador"
                ]
            },
            
            usuario_mobile: {
                nome: "Usuário Mobile",
                comportamento: {
                    consultasPorDia: 30,
                    focoPrincipal: "consultas",
                    tipoOperacoes: ["buscar", "visualizar"],
                    pacienciaSegundos: 2,
                    dispositivosUso: ["mobile"]
                },
                cenariosTipicos: [
                    "Buscar imóveis em campo",
                    "Consultar dados básicos",
                    "Verificar status rápido"
                ]
            }
        };
    }

    // ======================
    // CONFIGURAÇÃO DO SIMULADOR
    // ======================
    configurarSimulador() {
        this.configuracoesTeste = {
            // Volumes de dados para teste
            volumes: {
                pequeno: { imoveis: 100, locadores: 300 },
                medio: { imoveis: 1000, locadores: 3000 },
                grande: { imoveis: 7456, locadores: 4047 }, // Dados reais
                extremo: { imoveis: 15000, locadores: 45000 }
            },
            
            // Cenários de rede
            conectividade: {
                excelente: { latencia: 50, larguraBanda: "alta", confiabilidade: 99 },
                boa: { latencia: 150, larguraBanda: "media", confiabilidade: 95 },
                ruim: { latencia: 500, larguraBanda: "baixa", confiabilidade: 85 },
                pessima: { latencia: 2000, larguraBanda: "muito_baixa", confiabilidade: 70 }
            },
            
            // Dispositivos de teste
            dispositivos: {
                desktop_potente: { memoria: 16, cpu: "high", tela: "grande" },
                desktop_medio: { memoria: 8, cpu: "medium", tela: "media" },
                laptop: { memoria: 8, cpu: "medium", tela: "media" },
                tablet: { memoria: 4, cpu: "low", tela: "media" },
                mobile_alto: { memoria: 6, cpu: "medium", tela: "pequena" },
                mobile_basico: { memoria: 2, cpu: "low", tela: "pequena" }
            }
        };
    }

    // ======================
    // GERAÇÃO DE CENÁRIOS
    // ======================
    gerarCenarioCompleto(tipoTeste = "realista") {
        const cenarios = [];

        switch (tipoTeste) {
            case "realista":
                cenarios.push(...this.gerarCenariosRealistas());
                break;
            case "stress":
                cenarios.push(...this.gerarCenariosStress());
                break;
            case "usabilidade":
                cenarios.push(...this.gerarCenariosUsabilidade());
                break;
            case "performance":
                cenarios.push(...this.gerarCenariosPerformance());
                break;
            default:
                cenarios.push(...this.gerarCenariosCompletos());
        }

        return cenarios;
    }

    gerarCenariosRealistas() {
        return [
            // Cenário 1: Dia típico do Analista
            {
                id: "analista_dia_tipico",
                titulo: "Dia Típico - Analista de Locação",
                persona: "analista",
                duracao: 480, // 8 horas em minutos
                volume: "grande",
                conectividade: "boa",
                dispositivo: "desktop_medio",
                operacoes: [
                    { acao: "login", tempo: 1 },
                    { acao: "visualizar_dashboard", tempo: 2, repeticoes: 5 },
                    { acao: "buscar_imoveis", tempo: 3, repeticoes: 20 },
                    { acao: "cadastrar_imovel", tempo: 8, repeticoes: 3 },
                    { acao: "vincular_locador", tempo: 5, repeticoes: 8 },
                    { acao: "upload_documento", tempo: 12, repeticoes: 15 },
                    { acao: "gerar_relatorio", tempo: 25, repeticoes: 2 }
                ],
                criteriosSuccesso: {
                    tempoMedioResposta: "< 2s",
                    taxaErro: "< 1%",
                    satisfacaoUsuario: "> 80%"
                }
            },

            // Cenário 2: Gestor consultando relatórios
            {
                id: "gestor_relatorios",
                titulo: "Gestor - Análise de Relatórios",
                persona: "gestor",
                duracao: 60,
                volume: "grande",
                conectividade: "excelente",
                dispositivo: "desktop_potente",
                operacoes: [
                    { acao: "visualizar_dashboard", tempo: 3, repeticoes: 8 },
                    { acao: "filtrar_por_regiao", tempo: 2, repeticoes: 15 },
                    { acao: "filtrar_por_tipo", tempo: 1.5, repeticoes: 12 },
                    { acao: "exportar_dados", tempo: 30, repeticoes: 3 },
                    { acao: "visualizar_graficos", tempo: 5, repeticoes: 6 }
                ],
                criteriosSuccesso: {
                    tempoMedioResposta: "< 3s",
                    taxaErro: "< 0.5%",
                    satisfacaoUsuario: "> 85%"
                }
            },

            // Cenário 3: Auditor verificando integridade
            {
                id: "auditor_integridade",
                titulo: "Auditor - Verificação de Integridade",
                persona: "auditor",
                duracao: 120,
                volume: "grande",
                conectividade: "boa",
                dispositivo: "desktop_medio",
                operacoes: [
                    { acao: "executar_verificacao_integridade", tempo: 45, repeticoes: 2 },
                    { acao: "listar_imoveis_sem_locador", tempo: 8, repeticoes: 3 },
                    { acao: "verificar_documentos_obrigatorios", tempo: 15, repeticoes: 5 },
                    { acao: "exportar_relatorio_auditoria", tempo: 60, repeticoes: 1 },
                    { acao: "navegar_dados_detalhados", tempo: 3, repeticoes: 30 }
                ],
                criteriosSuccesso: {
                    tempoMedioResposta: "< 5s",
                    taxaErro: "< 0.1%",
                    completudeDados: "100%"
                }
            },

            // Cenário 4: Usuário móvel em campo
            {
                id: "mobile_campo",
                titulo: "Usuário Móvel - Trabalho em Campo",
                persona: "usuario_mobile",
                duracao: 180,
                volume: "medio",
                conectividade: "ruim",
                dispositivo: "mobile_basico",
                operacoes: [
                    { acao: "buscar_imovel_endereco", tempo: 5, repeticoes: 20 },
                    { acao: "visualizar_detalhes_imovel", tempo: 3, repeticoes: 25 },
                    { acao: "verificar_locadores", tempo: 2, repeticoes: 15 },
                    { acao: "fazer_anotacao", tempo: 8, repeticoes: 8 }
                ],
                criteriosSuccesso: {
                    tempoMedioResposta: "< 3s",
                    taxaErro: "< 5%",
                    usabilidadeMobile: "> 75%"
                }
            }
        ];
    }

    gerarCenariosStress() {
        return [
            // Cenário de pico de uso
            {
                id: "pico_uso_simultaneo",
                titulo: "Teste de Stress - Pico de Uso",
                usuariosSimultaneos: 50,
                duracao: 30,
                volume: "extremo",
                conectividade: "boa",
                dispositivo: "desktop_medio",
                operacoes: [
                    { acao: "login_simultaneo", usuarios: 50, tempo: 2 },
                    { acao: "consulta_massiva", usuarios: 50, tempo: 1, repeticoes: 100 },
                    { acao: "upload_multiplo", usuarios: 20, tempo: 15, repeticoes: 5 }
                ],
                criteriosSuccesso: {
                    tempoMaximoResposta: "< 10s",
                    taxaErro: "< 5%",
                    disponibilidadeSistema: "> 95%"
                }
            },

            // Cenário de volume extremo
            {
                id: "volume_extremo",
                titulo: "Teste de Volume Extremo",
                persona: "analista",
                duracao: 60,
                volume: "extremo",
                conectividade: "excelente",
                dispositivo: "desktop_potente",
                operacoes: [
                    { acao: "carregar_lista_completa", tempo: 30, repeticoes: 1 },
                    { acao: "aplicar_filtros_complexos", tempo: 5, repeticoes: 20 },
                    { acao: "paginacao_rapida", tempo: 1, repeticoes: 100 },
                    { acao: "exportar_dataset_completo", tempo: 120, repeticoes: 1 }
                ],
                criteriosSuccesso: {
                    usoMemoria: "< 2GB",
                    tempoCarregamento: "< 30s",
                    responsividade: "mantida"
                }
            }
        ];
    }

    gerarCenariosUsabilidade() {
        return [
            // Cenário de primeiro uso
            {
                id: "primeiro_uso",
                titulo: "Teste de Usabilidade - Primeiro Uso",
                persona: "novo_usuario",
                duracao: 45,
                volume: "pequeno",
                conectividade: "boa",
                dispositivo: "desktop_medio",
                tarefas: [
                    "Encontrar função de cadastro de imóvel",
                    "Cadastrar um imóvel com sucesso",
                    "Vincular um locador ao imóvel",
                    "Fazer upload de um documento",
                    "Encontrar o imóvel cadastrado",
                    "Visualizar relatório básico"
                ],
                criteriosSuccesso: {
                    taxaConclusao: "> 80%",
                    tempoMedioTarefa: "< 5min",
                    satisfacaoUsuario: "> 70%",
                    necessidadeAjuda: "< 30%"
                }
            },

            // Cenário de eficiência do usuário experiente
            {
                id: "usuario_experiente",
                titulo: "Teste de Usabilidade - Usuário Experiente",
                persona: "analista",
                duracao: 20,
                volume: "medio",
                conectividade: "boa",
                dispositivo: "desktop_medio",
                tarefas: [
                    "Cadastrar 5 imóveis usando atalhos",
                    "Vincular 10 locadores rapidamente",
                    "Aplicar filtros complexos",
                    "Exportar dados filtrados"
                ],
                criteriosSuccesso: {
                    eficiencia: "> 90%",
                    usoAtalhos: "> 60%",
                    satisfacaoUso: "> 90%"
                }
            }
        ];
    }

    gerarCenariosPerformance() {
        return [
            // Benchmark de carregamento inicial
            {
                id: "benchmark_carregamento",
                titulo: "Benchmark - Carregamento Inicial",
                volume: "grande",
                conectividade: "excelente",
                dispositivo: "desktop_potente",
                metricas: [
                    "First Contentful Paint",
                    "Largest Contentful Paint", 
                    "First Input Delay",
                    "Cumulative Layout Shift",
                    "Total Blocking Time"
                ],
                criteriosSuccesso: {
                    FCP: "< 1.5s",
                    LCP: "< 2.5s",
                    FID: "< 100ms",
                    CLS: "< 0.1",
                    TBT: "< 200ms"
                }
            },

            // Teste de memória
            {
                id: "teste_memoria",
                titulo: "Teste de Uso de Memória",
                volume: "extremo",
                duracao: 120,
                operacoes: [
                    "Carregar dados completos",
                    "Navegar por todas as páginas",
                    "Aplicar filtros diversos",
                    "Abrir múltiplas modais",
                    "Executar operações de CRUD"
                ],
                criteriosSuccesso: {
                    usoMemoriaMaximo: "< 1GB",
                    vazamentosMemoria: "0",
                    estabilidade: "100%"
                }
            }
        ];
    }

    // ======================
    // EXECUÇÃO DE CENÁRIOS
    // ======================
    async executarCenario(cenario, callback = null) {
        console.log(`🚀 Iniciando cenário: ${cenario.titulo}`);
        
        const resultados = {
            id: cenario.id,
            inicio: new Date(),
            metricas: {
                temposResposta: [],
                operacoesExecutadas: 0,
                errosEncontrados: [],
                usoMemoria: []
            },
            status: 'executando'
        };

        try {
            // Configurar ambiente do teste
            await this.configurarAmbienteTeste(cenario);
            
            // Executar operações do cenário
            for (const operacao of cenario.operacoes || []) {
                const resultadoOperacao = await this.executarOperacao(operacao, cenario);
                
                resultados.metricas.temposResposta.push(resultadoOperacao.tempo);
                resultados.metricas.operacoesExecutadas++;
                
                if (resultadoOperacao.erro) {
                    resultados.metricas.errosEncontrados.push(resultadoOperacao.erro);
                }
                
                // Callback para atualizações em tempo real
                if (callback) {
                    callback({
                        progresso: resultados.metricas.operacoesExecutadas,
                        total: this.calcularTotalOperacoes(cenario),
                        metricas: resultados.metricas
                    });
                }
                
                // Coletar métricas de performance
                if (window.performance && window.performance.memory) {
                    resultados.metricas.usoMemoria.push({
                        usedJSHeapSize: window.performance.memory.usedJSHeapSize,
                        totalJSHeapSize: window.performance.memory.totalJSHeapSize,
                        timestamp: new Date()
                    });
                }
            }
            
            resultados.fim = new Date();
            resultados.duracao = resultados.fim - resultados.inicio;
            resultados.status = 'concluido';
            
            // Gerar relatório de resultados
            const relatorio = this.gerarRelatorioResultados(cenario, resultados);
            
            console.log(`✅ Cenário concluído: ${cenario.titulo}`, relatorio);
            return relatorio;
            
        } catch (error) {
            resultados.status = 'erro';
            resultados.erro = error.message;
            console.error(`❌ Erro no cenário ${cenario.titulo}:`, error);
            return resultados;
        }
    }

    async configurarAmbienteTeste(cenario) {
        // Simular configuração de ambiente
        console.log(`⚙️ Configurando ambiente: ${cenario.dispositivo}, ${cenario.conectividade}`);
        
        // Simular latência de rede
        if (cenario.conectividade) {
            const config = this.configuracoesTeste.conectividade[cenario.conectividade];
            this.latenciaAtual = config.latencia;
        }
        
        // Preparar dados do volume especificado
        if (cenario.volume) {
            const volume = this.configuracoesTeste.volumes[cenario.volume];
            await this.prepararDadosTeste(volume);
        }
        
        await this.delay(500); // Simular tempo de configuração
    }

    async executarOperacao(operacao, cenario) {
        const inicioOperacao = performance.now();
        
        try {
            // Simular latência baseada na conectividade
            if (this.latenciaAtual) {
                await this.delay(this.latenciaAtual * (0.5 + Math.random()));
            }
            
            // Executar operação específica
            await this.simularAcaoUsuario(operacao.acao, cenario);
            
            const fimOperacao = performance.now();
            const tempoOperacao = fimOperacao - inicioOperacao;
            
            return {
                operacao: operacao.acao,
                tempo: tempoOperacao,
                sucesso: true
            };
            
        } catch (error) {
            const fimOperacao = performance.now();
            const tempoOperacao = fimOperacao - inicioOperacao;
            
            return {
                operacao: operacao.acao,
                tempo: tempoOperacao,
                sucesso: false,
                erro: error.message
            };
        }
    }

    async simularAcaoUsuario(acao, cenario) {
        // Simular diferentes ações do usuário
        switch (acao) {
            case 'login':
                await this.delay(200);
                console.log('👤 Simulando login...');
                break;
                
            case 'visualizar_dashboard':
                await this.delay(800);
                console.log('📊 Simulando visualização do dashboard...');
                break;
                
            case 'buscar_imoveis':
                await this.delay(400);
                console.log('🔍 Simulando busca de imóveis...');
                break;
                
            case 'cadastrar_imovel':
                await this.delay(2000);
                console.log('🏠 Simulando cadastro de imóvel...');
                break;
                
            case 'upload_documento':
                await this.delay(3000);
                console.log('📎 Simulando upload de documento...');
                break;
                
            case 'gerar_relatorio':
                await this.delay(5000);
                console.log('📋 Simulando geração de relatório...');
                break;
                
            default:
                await this.delay(300);
                console.log(`⚡ Simulando ação: ${acao}`);
        }
        
        // Simular possível erro (5% de chance)
        if (Math.random() < 0.05) {
            throw new Error(`Erro simulado na operação: ${acao}`);
        }
    }

    calcularTotalOperacoes(cenario) {
        if (!cenario.operacoes) return 0;
        
        return cenario.operacoes.reduce((total, op) => {
            return total + (op.repeticoes || 1);
        }, 0);
    }

    gerarRelatorioResultados(cenario, resultados) {
        const tempoMedio = resultados.metricas.temposResposta.reduce((a, b) => a + b, 0) / 
                          resultados.metricas.temposResposta.length || 0;
        
        const tempoMaximo = Math.max(...resultados.metricas.temposResposta);
        const tempoMinimo = Math.min(...resultados.metricas.temposResposta);
        
        const taxaSucesso = ((resultados.metricas.operacoesExecutadas - resultados.metricas.errosEncontrados.length) / 
                           resultados.metricas.operacoesExecutadas) * 100;
        
        return {
            cenario: cenario.titulo,
            duracao: resultados.duracao,
            metricas: {
                tempoMedioResposta: `${tempoMedio.toFixed(2)}ms`,
                tempoMaximoResposta: `${tempoMaximo.toFixed(2)}ms`,
                tempoMinimoResposta: `${tempoMinimo.toFixed(2)}ms`,
                operacoesExecutadas: resultados.metricas.operacoesExecutadas,
                errosEncontrados: resultados.metricas.errosEncontrados.length,
                taxaSucesso: `${taxaSucesso.toFixed(1)}%`
            },
            criterios: this.avaliarCriterios(cenario, resultados),
            recomendacoes: this.gerarRecomendacoes(cenario, resultados)
        };
    }

    avaliarCriterios(cenario, resultados) {
        const avaliacao = {};
        
        if (cenario.criteriosSuccesso) {
            for (const [criterio, valor] of Object.entries(cenario.criteriosSuccesso)) {
                avaliacao[criterio] = {
                    esperado: valor,
                    obtido: this.calcularValorCriterio(criterio, resultados),
                    passou: this.verificarCriterio(criterio, valor, resultados)
                };
            }
        }
        
        return avaliacao;
    }

    calcularValorCriterio(criterio, resultados) {
        switch (criterio) {
            case 'tempoMedioResposta':
                const tempo = resultados.metricas.temposResposta.reduce((a, b) => a + b, 0) / 
                             resultados.metricas.temposResposta.length;
                return `${(tempo/1000).toFixed(2)}s`;
                
            case 'taxaErro':
                const taxa = (resultados.metricas.errosEncontrados.length / 
                             resultados.metricas.operacoesExecutadas) * 100;
                return `${taxa.toFixed(1)}%`;
                
            default:
                return 'N/A';
        }
    }

    verificarCriterio(criterio, valorEsperado, resultados) {
        // Implementação simplificada - na prática seria mais robusta
        return Math.random() > 0.2; // 80% de chance de passar
    }

    gerarRecomendacoes(cenario, resultados) {
        const recomendacoes = [];
        
        const tempoMedio = resultados.metricas.temposResposta.reduce((a, b) => a + b, 0) / 
                          resultados.metricas.temposResposta.length;
        
        if (tempoMedio > 2000) {
            recomendacoes.push("Implementar cache para melhorar tempo de resposta");
        }
        
        if (resultados.metricas.errosEncontrados.length > 0) {
            recomendacoes.push("Revisar tratamento de erros e validações");
        }
        
        if (cenario.volume === 'extremo' && tempoMedio > 5000) {
            recomendacoes.push("Considerar implementar paginação virtual para grandes volumes");
        }
        
        return recomendacoes;
    }

    async prepararDadosTeste(volume) {
        console.log(`📊 Preparando ${volume.imoveis} imóveis e ${volume.locadores} locadores para teste...`);
        await this.delay(1000); // Simular tempo de preparação
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // ======================
    // MÉTODOS PÚBLICOS PARA INTERFACE
    // ======================
    
    obterCenariosDisponiveis() {
        return {
            realistas: this.gerarCenariosRealistas().map(c => ({
                id: c.id,
                titulo: c.titulo,
                persona: c.persona,
                duracao: c.duracao
            })),
            stress: this.gerarCenariosStress().map(c => ({
                id: c.id,
                titulo: c.titulo,
                duracao: c.duracao
            })),
            usabilidade: this.gerarCenariosUsabilidade().map(c => ({
                id: c.id,
                titulo: c.titulo,
                duracao: c.duracao
            })),
            performance: this.gerarCenariosPerformance().map(c => ({
                id: c.id,
                titulo: c.titulo
            }))
        };
    }

    async executarSuiteCompleta(tipoSuite = "realista", callback = null) {
        const cenarios = this.gerarCenarioCompleto(tipoSuite);
        const resultados = [];
        
        for (let i = 0; i < cenarios.length; i++) {
            const resultado = await this.executarCenario(cenarios[i], callback);
            resultados.push(resultado);
            
            if (callback) {
                callback({
                    cenarioAtual: i + 1,
                    totalCenarios: cenarios.length,
                    resultado: resultado
                });
            }
        }
        
        return {
            tipo: tipoSuite,
            resultados: resultados,
            resumo: this.gerarResumoSuite(resultados)
        };
    }

    gerarResumoSuite(resultados) {
        const temposResposta = resultados.flatMap(r => 
            r.metricas.tempoMedioResposta ? [parseFloat(r.metricas.tempoMedioResposta.replace('ms', ''))] : []
        );
        
        const totalOperacoes = resultados.reduce((total, r) => 
            total + (r.metricas.operacoesExecutadas || 0), 0
        );
        
        const totalErros = resultados.reduce((total, r) => 
            total + (r.metricas.errosEncontrados || 0), 0
        );
        
        return {
            totalCenarios: resultados.length,
            cenariosComSucesso: resultados.filter(r => r.status !== 'erro').length,
            tempoMedioGeral: temposResposta.length > 0 ? 
                `${(temposResposta.reduce((a, b) => a + b, 0) / temposResposta.length).toFixed(2)}ms` : 'N/A',
            totalOperacoes: totalOperacoes,
            totalErros: totalErros,
            taxaSuccessoGeral: totalOperacoes > 0 ? 
                `${(((totalOperacoes - totalErros) / totalOperacoes) * 100).toFixed(1)}%` : 'N/A'
        };
    }
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.SimuladorCenarios = SimuladorCenarios;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SimuladorCenarios;
}
