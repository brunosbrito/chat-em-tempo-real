import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import ChatContext from "../context/chatContext";
import "../styles/ChatStyle.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:3000");

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  const { loggedUser } = useContext(ChatContext);

  const navigate = useNavigate()

  socket.auth = { userId: loggedUser._id };
  socket.connect();

  useEffect(() => {
    const handleMessageReceived = (message) => {
      setMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (prevMessage, index) =>
            prevMessage.text === message.text &&
            index === prevMessages.length - 1
        );

        if (isDuplicate) {
          return prevMessages;
        } else {
          const messageWithId = { ...message, id: uuidv4() };
          return [...prevMessages, messageWithId];
        }
      });
    };

    socket.on("receive_message", handleMessageReceived);

    return () => {
      socket.off("receive_message", handleMessageReceived);
    };
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data = await response.json();

        const filterData = data.filter((user) => user._id !== loggedUser._id)
        setUsers(filterData);
      } catch (error) {
        alert("Problema com o servidor");
      }
    };
    getAllUsers();
    const interval = setInterval(() => {
      getAllUsers();
    }, 3000);


    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
    });

    socket.on("user_disconnected", (disconnectedUserId) => {
      if (selectedUser && selectedUser._id === disconnectedUserId) {
        console.log(
          "Usuário desconectado, não sera mais possivel enviar mensagem para esse usuario"
        );
        setIsConnected(false);
      }
    });
  }, [selectedUser, loggedUser]);

  const openChatWithUser = (user) => {
    if (user.status === "online") {
      setSelectedUser(user);
    } else {
      selectedUser(null);
    }
  };

  const closeChat = () => {
    setSelectedUser(null);
  };

  const sendMessage = (e) => {
    e.preventDefault();

    if (!isConnected) {
      return alert("usuario desconectado não é possivel enviar menssagem");
    }

    const obj = {
      text: message,
      author: loggedUser.username,
    };
    socket.emit("message", obj);
  };

  return (
  <div>
    {loggedUser._id ? (
      <div>
        <h1>Usuarios</h1>
        <h3 className="text">Para abrir o chat com algum usuário basta clicar no nome dele</h3>
        {users?.map((user, index) => (
          <div className="list-users" key={index} onClick={() => openChatWithUser(user)}>
            <p className='username'>
              {user.username}
              <div className={`status-indicator ${ user.status === "online" ? "online" : "offline"}`}></div>
              <span>{user.status}</span>
            </p>
          </div>
        ))}
        <h1>Chat</h1>

        {selectedUser && (
          <div>
            <h2>Chat com {selectedUser.username}</h2>
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message ${
                    msg.author === loggedUser.username ? "sent" : "received"
                  }`}
                >
                  <p className="author">{msg.author}</p>
                  <p className="text">{msg.text}</p>
                </div>
              ))}
            </div>
            <button className="closed-button" onClick={closeChat}>Fechar Chat</button>
          </div>
        )}

        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="input"
          />
          <button type="submit" className="button">
            Enviar
          </button>
        </form>
      </div>
    ) : (
      <div>
        <h2>Você precisa estar logado para acessar o chat</h2>
        <button className="button" type="button" onClick={() => navigate('/')}>Login</button>
      </div>
    )}
  </div>
);

};

export default Chat;
