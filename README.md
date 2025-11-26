<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Hotel Marketing Quiz

Um quiz interativo estilo Kahoot para eventos de marketing hoteleiro, com comunicação em tempo real entre apresentador (Host) e participantes (Players).

## 🚀 Tecnologias

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **Real-time**: Socket.IO (WebSockets)
- **Database**: PostgreSQL
- **Deploy**: Railway

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL (para desenvolvimento local) ou conta no Railway (para produção)

## 🏃 Executar Localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_quiz
NODE_ENV=development
PORT=3000
```

### 3. Inicializar banco de dados local (opcional)

Se quiser testar com PostgreSQL local:

```bash
# Criar banco de dados
createdb hotel_quiz
```

O servidor criará as tabelas automaticamente na primeira execução.

### 4. Rodar em modo desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 🚂 Deploy no Railway

### Passo 1: Preparar o repositório

1. Certifique-se de que todos os arquivos estão commitados:

```bash
git add .
git commit -m "Preparar para deploy na Railway"
git push origin main
```

### Passo 2: Criar projeto no Railway

1. Acesse [railway.app](https://railway.app) e faça login
2. Clique em **"New Project"**
3. Selecione **"Deploy from GitHub repo"**
4. Escolha este repositório
5. Railway detectará automaticamente que é um projeto Node.js

### Passo 3: Adicionar PostgreSQL

1. No painel do projeto, clique em **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway criará automaticamente a variável `DATABASE_URL`
3. O banco será conectado automaticamente ao seu serviço

### Passo 4: Configurar variáveis de ambiente

Railway já configurou automaticamente:

- ✅ `DATABASE_URL` (do plugin PostgreSQL)
- ✅ `PORT` (Railway define dinamicamente)

**Opcional**: Adicione `NODE_ENV=production` manualmente se necessário:

1. Vá em **"Variables"**
2. Adicione: `NODE_ENV` = `production`

### Passo 5: Deploy

Railway fará o deploy automaticamente ao detectar mudanças no GitHub. O processo:

1. **Build**: `npm install && npm run build` (compila o frontend React)
2. **Start**: `npm start` (inicia o servidor Node.js)

Aguarde alguns minutos. Quando concluído, clique no botão **"Open App"** para acessar seu quiz!

### 🔍 Verificar deployment

Acesse a URL fornecida pela Railway e teste:

1. **Modo Host**:

   - Inicie um quiz
   - Verifique se o timer funciona
   - Confirme exibição do QR Code

2. **Modo Player** (abra em outro dispositivo/aba):

   - Escaneie o QR Code ou acesse diretamente
   - Envie um voto
   - Confirme que aparece no gráfico do Host

3. **Banco de dados**:
   - Vá em Railway → PostgreSQL → Data
   - Verifique se a tabela `votes` foi criada
   - Confirme que os votos estão sendo salvos

## 🛠️ Troubleshooting

### Build falha no Railway

**Problema**: Railway não encontra `dist` folder  
**Solução**: Verifique se o script `build` em `package.json` está correto:

```json
"build": "vite build"
```

### WebSocket não conecta

**Problema**: Indicador vermelho no Player mode  
**Causas possíveis**:

- Firewall bloqueando WebSocket
- CORS não configurado corretamente

**Solução**: Verifique em `server.js` que CORS está permitindo conexões:

```javascript
cors: {
  origin: "*", // Em produção, troque por seu domínio Railway
  methods: ["GET", "POST"]
}
```

### Database connection error

**Problema**: `Error initializing database`  
**Soluções**:

1. Verifique se o PostgreSQL plugin está ativo no Railway
2. Confirme que `DATABASE_URL` está configurada (Railway → Variables)
3. Verifique logs: Railway → Deployments → Logs

## 📁 Estrutura do Projeto

```
hotel-marketing-quiz/
├── server.js           # Servidor Node.js + WebSocket
├── db.js               # Conexão PostgreSQL
├── App.tsx             # Componente principal React
├── components/         # Componentes React
├── views/              # Host e Player views
├── utils/              # Utilitários (sound, storage, export)
├── constants.ts        # Dados do quiz
├── types.ts            # TypeScript types
├── package.json        # Dependências e scripts
├── railway.json        # Configuração Railway
└── .env.example        # Template de variáveis
```

## 🎮 Como usar

### Modo Apresentador (Host)

1. Abra no telão/projetor
2. Configure timers (opcional)
3. Inicie o quiz
4. Participantes escanearão o QR Code
5. Acompanhe votos em tempo real nos gráficos

### Modo Participante (Player)

1. Escaneie o QR Code ou acesse a URL
2. Aguarde o Host iniciar
3. Leia a pergunta
4. Clique na opção colorida para votar
5. Aguarde próxima pergunta

## 📝 Licença

Este projeto foi criado com AI Studio e pode ser usado livremente.

## 🔗 Links

- [AI Studio App](https://ai.studio/apps/drive/1-HIDiAVDXCOnqD-rHQuC0Lei17M4WNT5)
- [Railway Docs](https://docs.railway.app/)
- [Socket.IO Docs](https://socket.io/docs/v4/)
