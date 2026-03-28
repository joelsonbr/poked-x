import React, { useState } from "react";
import api from "../../api/api.js";
import { Mail, Lock, Eye, EyeOff, ShieldBan, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../../Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [camposVazios, setCamposVazios] = useState([]);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // Adicionamos o 'async' aqui
    e.preventDefault();
    let errosAtuais = [];

    // 1. Validação de campos vazios (Front-end)
    if (!email) errosAtuais.push("email");
    if (!senha) errosAtuais.push("senha");

    if (errosAtuais.length > 0) {
      setCamposVazios(errosAtuais);
      setErro("Preencha todos os campos, Treinador!");
      return;
    }

    // --- AGORA A CONEXÃO REAL COM O BACK-END ---
    try {
      setErro(""); // Limpa erros antes de tentar

      const response = await api.post("/api/users/login", {
        email: email,
        password: senha,
      });

      // Se o Back-end responder OK (Status 200)
      console.log("Login realizado:", response.data);

      // Dica: Salva o nome ou o ID no localStorage para saber que o user está logado
      localStorage.setItem("treinador", JSON.stringify(response.data));

      alert(`Acesso concedido! Bem-vindo, ${response.data.username}!`);

      setCamposVazios([]);
      navigate("/home"); // Manda para a página principal
    } catch (error) {
      // Pega a mensagem que criamos no Back (Ex: "E-mail ou senha inválidos!")
      const mensagemErro =
        error.response?.data?.message || "Erro ao conectar ao Ginásio!";
      setErro(mensagemErro);
      setCamposVazios(["email", "senha"]); // Destaca os campos no erro
    }
  };

  const getClassName = (campo) => {
    return `login-input ${camposVazios.includes(campo) ? "input-error-pulse" : ""}`;
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-header">
          <img
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
            alt="Pokebola"
          />
          <h2>Acesso ao Ginásio</h2>
          <p>Entre com seu ID de Treinador</p>
        </div>

        <form onSubmit={handleLogin} autoComplete="off" noValidate>
          {/* CAMPO EMAIL */}
          <div className="login-input-group">
            <label>E-mail</label>
            <div className="input-with-icon-outside">
              <Mail size={22} className="sidebar-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setCamposVazios([]);
                  setErro("");
                }}
                className={getClassName("email")}
                placeholder="treinador@poke.com"
              />
            </div>
          </div>

          {/* CAMPO SENHA */}
          <div className="login-input-group">
            <label>Senha</label>
            <div className="input-with-icon-outside">
              <Lock size={22} className="sidebar-icon" />
              <div className="password-wrapper" style={{ flex: 1 }}>
                <input
                  type={verSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => {
                    setSenha(e.target.value);
                    setCamposVazios([]);
                    setErro("");
                  }}
                  className={getClassName("senha")}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setVerSenha(!verSenha)}
                  tabIndex="-1"
                >
                  {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          {/* MENSAGEM DE ERRO COM SHIELDBAN */}
          {erro && (
            <div className="error-container">
              <ShieldBan size={18} color="#ff4b2b" />
              <p className="error-message">{erro}</p>
            </div>
          )}

          <button type="submit" className="btn-login">
            ENTRAR NO GINÁSIO
          </button>

          <div className="login-footer">
            <p>
              Ainda não é um mestre?
              <Link to="/cadastro" className="link-cadastro">
                Criar Novo Registro
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
