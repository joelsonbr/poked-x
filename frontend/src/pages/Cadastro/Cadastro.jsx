import api from "../../api/api.js";
import React, { useState } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldBan,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../../Login.css";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState("");
  const [camposVazios, setCamposVazios] = useState([]); // Guarda quem deu erro

  const navigate = useNavigate(); // Certifique-se que isso está no topo do componente

  const handleCadastro = async (e) => {
    e.preventDefault();

    let errosAtuais = [];

    // 1. Validação de campos vazios
    if (!nome) errosAtuais.push("nome");
    if (!email) errosAtuais.push("email");
    if (!senha) errosAtuais.push("senha");
    if (!confirmarSenha) errosAtuais.push("confirmarSenha");

    if (errosAtuais.length > 0) {
      setCamposVazios(errosAtuais);
      setErro("Preencha todos os campos, Treinador!");
      return;
    }

    // 2. Validação de E-mail (aquela que a gente fez)
    if (!email.includes("@") || !email.includes(".com")) {
      setCamposVazios(["email"]);
      setErro("Esse e-mail parece inválido!");
      return;
    }

    // 3. Validação de senhas iguais
    if (senha !== confirmarSenha) {
      setCamposVazios(["senha", "confirmarSenha"]);
      setErro("As senhas não coincidem!");
      return;
    }

    // --- CONEXÃO COM O BACK-END AQUI ---
    try {
      setErro("");

      const response = await api.post("/api/users/register", {
        username: nome,
        email: email,
        password: senha,
        confirmPassword: confirmarSenha,
      });

      // ✅ TUDO QUE É SUCESSO FICA AQUI DENTRO DO TRY
      console.log(response.data.message || "Treinador registrado com sucesso!");
      setCamposVazios([]);
      navigate("/login");
    } catch (error) {
      // Pega a mensagem que veio lá do seu Controller (Backend)
      const mensagemErro =
        error.response?.data?.message || "Erro ao conectar ao Centro Pokémon!";
      setErro(mensagemErro);

      // Lógica para deixar os inputs vermelhos
      if (mensagemErro.toLowerCase().includes("e-mail")) {
        setCamposVazios(["email"]);
      }
      // 🚀 AGORA ELE IDENTIFICA ERRO DE SENHA TAMBÉM:
      else if (
        mensagemErro.toLowerCase().includes("senha") ||
        mensagemErro.toLowerCase().includes("caracteres")
      ) {
        setCamposVazios(["senha", "confirmarSenha"]);
      }
    }
  };

  // Função auxiliar para decidir qual classe usar
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
          <h2>Novo Registro</h2>
          <p>Crie seu ID de Treinador</p>
        </div>

        <form onSubmit={handleCadastro} autoComplete="off" noValidate>
          <div className="login-input-group">
            <label>Nome do Treinador</label>
            <div className="input-with-icon-outside">
              <UserPlus size={22} className="sidebar-icon" />
              <input
                type="text"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  setCamposVazios([]);
                  setErro("");
                }}
                className={getClassName("nome")}
                placeholder="Ex: Joe Master"
              />
            </div>
          </div>

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
                >
                  {verSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <div className="login-input-group">
            <label>Confirmar Senha</label>
            <div className="input-with-icon-outside">
              <ShieldCheck size={22} className="sidebar-icon" />
              <input
                type={verSenha ? "text" : "password"}
                value={confirmarSenha}
                onChange={(e) => {
                  setConfirmarSenha(e.target.value);
                  setCamposVazios([]);
                  setErro("");
                }}
                className={getClassName("confirmarSenha")}
                placeholder="••••••••"
              />
            </div>
          </div>

          {erro && (
            <div className="error-container">
              <ShieldBan size={18} color="#ff4b2b" />
              <p className="error-message">{erro}</p>
            </div>
          )}

          <button type="submit" className="btn-login">
            FINALIZAR CADASTRO
          </button>

          <div className="login-footer">
            <p>
              Já possui ID de Treinador?
              <Link to="/login" className="link-cadastro">
                Entrar no Ginásio
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cadastro;
