const express = require("express");
const app = express();
const server = require("http").createServer(app);
const { login, register, getAll } = require("./controller/authController");
const { MongoClient } = require("mongodb");
const { updateUserStatus } = require("./controller/userController");
const io = require("socket.io")(server, {
  cors: { origin: "http://localhost:5173" },
});

const PORT = 3000;
const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "chat_db";

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

(async () => {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(DB_NAME);

    io.use(async (socket, next) => {
      try {
        const userId = socket.handshake.auth.userId;
        if (!userId) {
          return next(new Error("Usuário não autenticado"));
        }

        socket.userId = userId;
        next();
      } catch (error) {
        return next(new Error("Erro ao autenticar o usuário"));
      }
    });

    io.on("connection", async (socket) => {
      console.log("Usuário conectado:", socket.userId);

      try {
        await updateUserStatus(socket.userId, "online");
      } catch (error) {
        console.error("Erro ao atualizar o estado do usuário:", error);
      }

      socket.on("disconnect", () => {
        console.log("Usuário desconectado:", socket.userId);

        try {
          updateUserStatus(socket.userId, "offline");
          socket.broadcast.emit("user_disconnected", socket.userId);
        } catch (error) {
          console.error("Erro ao atualizar o estado do usuário:", error);
        }
      });

      socket.on("message", (messageObject) => {
        const { text, author } = messageObject;

        saveMessage(text, author)
          .then(() => {
            io.emit("receive_message", messageObject);
          })
          .catch((error) => {
            console.error("Erro ao salvar a mensagem:", error);
          });
      });
    });
    async function saveMessage(text, author) {
      try {
        const collection = db.collection("messages");

        const message = {
          text,
          author,
          timestamp: new Date(),
        };

        await collection.insertOne(message);
        return message;
      } catch (error) {
        throw error;
      }
    }

    app.post("/login", login);
    app.post("/register", register);
    app.get("/users", getAll);

    server.listen(PORT, () => console.log("Servidor rodando na porta", PORT));
  } catch (error) {
    console.error("Falha ao conectar ao MongoDB:", error);
  }
})();
