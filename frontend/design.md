# Design - MoVo Spot (Localizador de Produtos)

## Conceito
Aplicativo mobile para gerenciamento de produtos com localização geográfica. O usuário pode cadastrar produtos, visualizar no mapa onde estão armazenados/disponíveis e gerenciar o estoque de forma visual e intuitiva.

## Telas

### 1. Tela de Login
- Campos de e-mail e senha
- Botão "Entrar"
- Link "Criar Conta"
- Autenticação via Firebase Authentication

### 2. Tela de Cadastro
- Campos: nome, e-mail, senha, confirmar senha
- Botão "Cadastrar"
- Link "Já tenho conta"

### 3. Tela Home (Lista de Produtos)
- Lista com cards dos produtos cadastrados
- Cada card mostra: nome, preço, quantidade, disponibilidade (badge verde/vermelho)
- Botão flutuante "+" para adicionar novo produto
- Ícone de mapa no header para ver todos no mapa

### 4. Tela de Mapa
- Mapa em tela cheia com marcadores dos produtos
- Ao tocar no marcador, mostra callout com nome e preço
- Botão de voltar para a lista

### 5. Tela de Cadastro/Edição de Produto
- Campo: Nome (String)
- Campo: Quantidade (Numérico inteiro)
- Campo: Preço (Numérico decimal)
- Campo: Data de Validade (Date Picker)
- Campo: Disponível (Switch/Toggle boolean)
- Seleção de localização no mapa (toque para marcar coordenadas)
- Botões: Salvar / Cancelar

## Fluxos Principais
1. Login → Home (Lista) → Ver no Mapa
2. Login → Home → Adicionar Produto → Selecionar Local no Mapa → Salvar
3. Login → Home → Tocar em Produto → Editar → Salvar
4. Login → Home → Swipe/Botão Excluir → Confirmar

## Cores
- **Primary:** #2563EB (Azul forte)
- **Background:** #FFFFFF (Branco)
- **Surface:** #F8FAFC (Cinza claro)
- **Success:** #22C55E (Verde - Disponível)
- **Error:** #EF4444 (Vermelho - Indisponível)
- **Foreground:** #1E293B (Texto escuro)

## Navegação
- Tab Bar com 2 abas: "Produtos" (lista) e "Mapa" (visualização geográfica)
- Stack navigation dentro de cada tab para formulários
