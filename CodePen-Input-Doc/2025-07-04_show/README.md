# SILIC 2.0 - CAIXA - Versão de Apresentação

## 📋 Descrição
Esta é a versão de apresentação do protótipo SILIC 2.0 (Sistema de Locação de Imóveis CAIXA), desenvolvida especificamente para demonstrações e validação de conceitos.

## 🎯 Características da Versão

### 📊 Base de Dados
- **100 imóveis** exatamente, com distribuição realista por status:
  - 65 Ativos (65%)
  - 15 Em prospecção (15%)
  - 10 Em mobilização (10%)
  - 8 Em desmobilização (8%)
  - 2 Desativado (2%)

### 🏢 Logo e Identidade Visual
- Logo oficial da CAIXA (`logo-caixa.svg`)
- Cores e padrões visuais seguindo identidade da CAIXA
- Interface moderna e responsiva

### 🔍 Funcionalidades de Busca e Filtro

#### Para Imóveis:
- Busca em tempo real por código, denominação ou local
- Filtro por status do imóvel
- Paginação inteligente
- Botão "Limpar Filtros"

#### Para Locadores:
- Busca por nome
- Filtro por tipo (Pessoa Física/Jurídica)
- Filtro por status de documentação
- Visualização em tabela ou cards

### 👥 Regras de Negócio Implementadas

#### Locadores por Status:
- **Apenas** imóveis com status "Em prospecção" ou "Em mobilização" podem não ter locadores
- Todos os demais status devem ter pelo menos 1 locador vinculado
- Distribuição realista: 1 a 3 locadores por imóvel

### 📄 Documentação Completa

#### A. Documentação do(s) Locador(es)

##### I. Pessoa Física:
- Documento de Identidade (CNH, RG, CPF, Passaporte, Carteira Profissional)
- Documento de Identidade do cônjuge (quando aplicável)
- Certidão Negativa de Débitos (CND/CPEND)
- Comprovante de Renda
- Comprovante de Residência
- Declaração de IR
- Carteira de Trabalho
- Certidão de Nascimento/Casamento
- Comprovante Bancário
- Declaração de Bens
- Ficha Cadastral

##### II. Pessoa Jurídica:
- CNPJ
- Contrato Social e alterações
- Certidão simplificada da Junta Comercial
- Certidão Negativa de Débitos (CND/CPEND)
- Certidão de regularidade do FGTS
- Inscrição Estadual
- Certidões Negativas (Federal, Estadual, Municipal)
- Balanço Patrimonial
- DRE - Demonstração do Resultado
- Declaração de Idoneidade
- Comprovante de Endereço da Empresa
- Ata de Nomeação de Diretoria
- Cartão CNPJ

##### III. Documentação do Representante Legal:
- Instrumento jurídico de poderes (Procuração)
- Documento de Identidade do Procurador
- Comprovante de Residência do Representante
- Termo de Responsabilidade

#### B. Documentação do Imóvel:
- Matrícula do Imóvel (até 60 dias)
- Certidão negativa de IPTU
- Averbação/Habite-se
- Permissão para atividade bancária
- Manifestação CILOG
- Escritura do Imóvel
- Planta do Imóvel
- Alvará de Funcionamento
- Laudo de Avaliação
- Certidão de Regularidade Urbana
- Memorial Descritivo

### 📈 Status de Documentos
- **Entregue** ✅ - Documento completo e validado
- **Pendente** ⚠️ - Aguardando entrega
- **Em Análise** 🔍 - Documento em processo de validação
- **Rejeitado** ❌ - Documento rejeitado, precisa reenvio

### 🎨 Interface e Usabilidade
- Dashboard com estatísticas em tempo real
- Tabelas com paginação inteligente
- Modal de detalhes completos do imóvel
- Badges coloridos para status
- Filtros em tempo real
- Design responsivo
- Ícones intuitivos

### 🚀 Funcionalidades Especiais
- **Auditoria de Dados**: Relatório completo do sistema
- **Busca no SIPGE/SAP**: Interface preparada para integração
- **Gestão de Documentos**: Upload e controle visual de status
- **Notificações Visuais**: Alertas para imóveis sem locadores
- **Exportação**: Preparado para relatórios

## 🛠️ Tecnologias
- HTML5 semântico
- CSS3 com variáveis customizadas
- JavaScript ES6+ (Classes, Arrow Functions, Async/Await)
- Design responsivo
- Padrões de acessibilidade

## 📱 Compatibilidade
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos desktop, tablet e mobile
- Suporte a leitores de tela
- Performance otimizada

## 🎯 Objetivos da Demonstração
1. Validar fluxo de trabalho completo
2. Demonstrar capacidade de gestão de grandes volumes
3. Mostrar interface intuitiva e profissional
4. Validar regras de negócio específicas da CAIXA
5. Testar usabilidade e performance

## 📝 Dados de Demonstração
Todos os dados são gerados automaticamente e incluem:
- Nomes realistas de pessoas e empresas
- Endereços válidos de cidades brasileiras
- CPFs e CNPJs com dígitos verificadores corretos
- Distribuição estatística representativa
- Situações diversas de documentação
- Cenários complexos (representantes legais, múltiplos locadores, etc.)

## 🔐 Segurança
Esta versão é apenas para demonstração e não contém dados reais ou sensíveis.

---

**Desenvolvido para CAIXA Econômica Federal**  
*Versão de Apresentação - Janeiro 2025*
