import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { initDb, saveVote, getVotesForQuestion } from "./db.js";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Ajustar para o domínio de produção
    methods: ["GET", "POST"],
  },
});

// Inicializa o banco de dados
initDb();

// Servir arquivos estáticos do build do Vite (dist)
app.use(express.static(join(__dirname, "dist")));

// Estado em memória volátil para a sessão atual (backup rápido)
let currentSessionId = uuidv4();
let currentGameState = {
  phase: "LOBBY",
  questionIndex: 0,
  timeLeft: 0,
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Envia o estado atual para quem acabou de conectar (útil para reload)
  socket.emit("state_sync", currentGameState);

  // Eventos vindos do HOST
  socket.on("host_update_state", (newState) => {
    currentGameState = newState;
    // Replica o estado para todos os PLAYERS
    socket.broadcast.emit("state_sync", newState);
  });

  socket.on("host_start_game", () => {
    // Gera nova sessão para o banco de dados
    currentSessionId = uuidv4();
    console.log("New Game Session:", currentSessionId);
  });

  // Eventos vindos dos PLAYERS
  socket.on("player_vote", async (data) => {
    // data: { questionId, optionId }
    try {
      const updatedVotes = await saveVote(
        currentSessionId,
        data.questionId,
        data.optionId
      );
      // Envia a contagem atualizada para TODOS os clientes
      io.emit("host_votes_update", updatedVotes);
    } catch (e) {
      console.error("❌ Error processing vote:", e);
    }
  });

  // Host requests votes for a specific question (useful on refresh or phase change)
  socket.on("host_request_votes", async (data) => {
    // data: { questionId }
    try {
      const votes = await getVotesForQuestion(
        currentSessionId,
        data.questionId
      );
      // Envia para TODOS para garantir sincronização
      io.emit("host_votes_update", votes);
    } catch (e) {
      console.error("❌ Error fetching votes:", e);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Rota fallback para SPA (React Router, se usasse)
app.get(/.*/, (req, res) => {
  res.sendFile(join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
