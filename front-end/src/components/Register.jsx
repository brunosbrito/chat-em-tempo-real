import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FormStyle.css";

export default function Register() {
  const [isUser, setIsuser] = useState(true);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = ({ target }) => {
    verifyUser();
    
    setUser({
      ...user,
      [target.name]: target.value,
    });
    
  };

  const verifyUser = () => {
    if (user.username.length > 3 && user.password.length > 3) {
      setIsuser(false);
    }else {
      setIsuser(true)
    }
  };

  const handleSubmit = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    };

    try {
      const response = await fetch(
        "http://localhost:3000/register",
        requestOptions
      );
      const data = await response.json();
      if (data.message === "Register successful") {
        alert("conta criada com sucesso");
        navigate("/");
      }
    } catch (error) {
      alert("Problema com o servidor");
    }
  };

  return (
    <div className="container">
      <h2>Cadastrar Usuário</h2>
      <div className="form">
        <label htmlFor="username">Nome de usuario</label>
        <input
          placeholder="Digite seu usuário..."
          className="input-form"
          type="text"
          name="username"
          onChange={handleChange}
        />

        <label htmlFor="password">Senha</label>
        <input
          placeholder="Digite sua senha..."
          className="input-form"
          type="password"
          name="password"
          onChange={handleChange}
        />
      </div>
      {isUser && (
        <span className="span"> O nome de usúario e senha precisam ser maior que 3 </span>
      )}
      <button
        disabled={isUser}
        className="register-button"
        type="button"
        onClick={handleSubmit}
      >
        Cadastrar
      </button>

      <button className="button" onClick={() => navigate("/")}>
        Login
      </button>
    </div>
  );
}
