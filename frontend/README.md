# MoVo Spot

Aplicativo mobile desenvolvido em React Native (Expo) para gerenciamento de produtos com localização geográfica. Permite cadastrar produtos com múltiplos atributos e visualizá-los em um mapa interativo.

## Tecnologias Utilizadas

| Tecnologia | Função |
|------------|--------|
| React Native (Expo) | Framework mobile |
| TypeScript | Tipagem estática |
| Firebase Authentication | Login e cadastro de usuários |
| React Native Maps | Mapa interativo com marcadores |
| Spring Boot + JPA | Backend (API REST) |
| PostgreSQL | Banco de dados relacional |

## Funcionalidades

- Autenticação de usuários com e-mail e senha (Firebase)
- CRUD completo de produtos
- Visualização de produtos em mapa interativo com marcadores coloridos
- Seleção de localização via toque no mapa ao cadastrar produto
- Indicador visual de disponibilidade (verde/vermelho)

## Atributos do Objeto (Produto)

| Atributo | Tipo | Descrição |
|----------|------|-----------|
| nome | String | Nome do produto |
| quantidade | int | Quantidade em estoque |
| preco | double | Preço unitário |
| dataValidade | LocalDate | Data de validade |
| disponivel | boolean | Se está disponível |
| latitude | double | Coordenada geográfica |
| longitude | double | Coordenada geográfica |

## Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Java JDK 17+ (para o backend)
- PostgreSQL 12+
- Expo Go (celular)

### Backend (Spring Boot)

1. Configure o banco PostgreSQL (crie o banco `produtodb`)
2. Ajuste `application.properties` com suas credenciais
3. Execute o projeto Spring Boot (porta 8080)

### App Mobile

1. Instale as dependências:
```bash
pnpm install
```

2. Inicie o servidor Expo:
```bash
npx expo start
```

3. Escaneie o QR Code com o Expo Go no celular

### Configuração de Rede

No arquivo `lib/api.ts`, substitua `localhost` pelo IP da sua máquina na rede local:
```typescript
const API_URL = "http://SEU_IP:8080";
```

## Estrutura do Projeto

```
app/
├── (tabs)/
│   ├── index.tsx       → Lista de Produtos
│   └── mapa.tsx        → Mapa com marcadores
├── login.tsx           → Tela de Login
├── register.tsx        → Tela de Cadastro
└── produto-form.tsx    → Formulário CRUD
lib/
├── firebase.ts         → Configuração Firebase
├── auth-context.tsx    → Contexto de autenticação
└── api.ts              → Comunicação com backend
```

## Diferenciais

- Integração com API de mapas (react-native-maps)
- Autenticação Firebase (e-mail/senha)
- Interface responsiva e intuitiva

## Autor

Gustavo Abreu
