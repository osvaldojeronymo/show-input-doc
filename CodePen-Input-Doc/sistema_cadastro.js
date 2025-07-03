// Sistema de Cadastro de Imóveis e Locadores
class SistemaCadastro {
    constructor() {
        this.imoveis = [];
        this.locadores = [];
        this.imovelSelecionado = null;
        this.proximoIdImovel = 1;
        this.proximoIdLocador = 1;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.renderTabelaImoveis();
        this.renderTabelaLocadores();
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
            status: 'Ativo'
        };
        
        this.imoveis.push(novoImovel);
        enderecoInput.value = '';
        this.renderTabelaImoveis();
        
        // Se for o primeiro imóvel, seleciona automaticamente
        if (this.imoveis.length === 1) {
            this.selecionarImovel(novoImovel.id);
        }
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
        
        const novoLocador = {
            id: this.proximoIdLocador++,
            nome: nome,
            tipo: tipo,
            imovelId: this.imovelSelecionado.id,
            status: 'Ativo'
        };
        
        this.locadores.push(novoLocador);
        nomeInput.value = '';
        this.renderTabelaLocadores();
    }
    
    selecionarImovel(imovelId) {
        this.imovelSelecionado = this.imoveis.find(imovel => imovel.id === imovelId);
        this.renderTabelaImoveis();
        this.renderTabelaLocadores();
        this.updateLocadoresInfo();
    }
    
    removerImovel(imovelId) {
        if (confirm('Tem certeza que deseja remover este imóvel? Todos os locadores vinculados também serão removidos.')) {
            this.imoveis = this.imoveis.filter(imovel => imovel.id !== imovelId);
            this.locadores = this.locadores.filter(locador => locador.imovelId !== imovelId);
            
            if (this.imovelSelecionado && this.imovelSelecionado.id === imovelId) {
                this.imovelSelecionado = null;
            }
            
            this.renderTabelaImoveis();
            this.renderTabelaLocadores();
            this.updateLocadoresInfo();
        }
    }
    
    removerLocador(locadorId) {
        if (confirm('Tem certeza que deseja remover este locador?')) {
            this.locadores = this.locadores.filter(locador => locador.id !== locadorId);
            this.renderTabelaLocadores();
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
    
    renderTabelaLocadores() {
        const tbody = document.getElementById('tabelaLocadores');
        
        if (!this.imovelSelecionado) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #999; font-style: italic;">
                        Selecione um imóvel para visualizar os locadores
                    </td>
                </tr>
            `;
            return;
        }
        
        const locadoresDoImovel = this.locadores.filter(locador => locador.imovelId === this.imovelSelecionado.id);
        
        if (locadoresDoImovel.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: #999; font-style: italic;">
                        Nenhum locador cadastrado para este imóvel
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = locadoresDoImovel.map(locador => `
            <tr>
                <td>${locador.id}</td>
                <td>${locador.nome}</td>
                <td>${locador.tipo}</td>
                <td>
                    <div class="table-actions">
                        <span class="status-badge ativo">${locador.status}</span>
                        <button class="btn btn-danger btn-sm" onclick="sistema.removerLocador(${locador.id})">
                            Remover
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
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
    sistema = new SistemaCadastro();
});
