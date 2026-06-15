# INSTRUÇÕES PARA A APRESENTAÇÃO (CINELOG)

## 1. CONFIGURAR O BANCO DE DADOS

Antes de rodar o backend, confirme que o PostgreSQL está aberto e que existe um banco chamado `cinelogdb`.

Configuração usada pelo backend:

```cmd
Banco: cinelogdb
Host: localhost
Porta: 5432
Usuário: postgres
Senha: 123456
```

Se o banco ainda não existir, crie no DBeaver, pgAdmin ou pelo terminal do PostgreSQL:

```cmd
CREATE DATABASE cinelogdb;
```

As tabelas são criadas/atualizadas automaticamente pelo Spring Boot.

## 2. RODAR O BACKEND (SERVIDOR)

Antes de rodar, confirme que o JDK está instalado e que a variável `JAVA_HOME` está configurada.

No Windows, abra o Prompt de Comando ou o terminal do VS Code na pasta `backend` e rode:

```cmd
mvnw.cmd spring-boot:run
```

No Linux ou macOS, abra o Terminal na pasta `backend` e rode:

```cmd
./mvnw spring-boot:run
```

O servidor do backend deve ficar disponível em `http://localhost:8080`.

## 3. RODAR O FRONTEND (APP)

No Windows, abra outro Prompt de Comando ou terminal do VS Code na pasta `frontend` e rode:

```cmd
pnpm install
npx expo start
```

Se estiver usando Linux ou macOS, os comandos são os mesmos no Terminal.

O Expo normalmente abre o app em `http://localhost:8081`. Essa porta é do frontend, enquanto `http://localhost:8080` é a porta do backend.

- **DICA:** Se o celular não conectar, use:

```cmd
npx expo start --tunnel
```

- **LINK:** [Tutorial no YouTube](https://www.youtube.com/watch?v=BmORkbOxybo)

## 4. FUNCIONALIDADES PRINCIPAIS

- Cadastro e login com Firebase.
- Cadastro, edição, listagem e exclusão de filmes.
- Avaliação por estrelas.
- Favoritos.
- Busca automática de filmes pela API do TMDB.
- Aba Explorar com filmes em alta.
- Dashboard com estatísticas e distribuição de notas.
