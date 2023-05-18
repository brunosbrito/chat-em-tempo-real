import { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatContext from "../context/chatContext";
import "../styles/FormStyle.css";

export default function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const { setLoggedUser } = useContext(ChatContext);

  const handleChange = ({ target }) => {
    setUser({
      ...user,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/login",
        requestOptions
      );
      const data = await response.json();
      if (data.message === "Invalid username or password") {
        alert("Usuario ou senha incorreto");
      } else {
        setLoggedUser({ ...data, status: "online" });
        navigate("/chat");
      }
    } catch (error) {
      alert("Problema com o servidor");
    }
  };

  return (
    <div className="container">
      <h1>Chat em Tempo Real</h1>
      <div className="form">
        <label className="label" htmlFor="username">
          Nome de usuário
          <input
          required
          className="input-form"
          type="text"
          name="username"
          placeholder="Digite seu usuário..."
          onChange={handleChange}
        />
        </label>
        

        <label className="label" htmlFor="password">
          Senha
          <input
          className="input-form"
          placeholder="Digite sua senha..."
          type="password"
          name="password"
          onChange={handleChange}
        />
        </label>
        
      </div>

      <button className="button" onClick={handleSubmit}>
        Entrar
      </button>
      <button
        className="register-button"
        type="button"
        onClick={() => navigate("/register")}
      >
        Cadastrar
      </button>
    </div>
  );
}
