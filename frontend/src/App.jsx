/* eslint-disable react-hooks/purity */
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Login from "./pages/Login/Login";
import Cadastro from "./pages/Cadastro/Cadastro";
import Home from './pages/Home/Home';

// 🛡️ COMPONENTE DE PROTEÇÃO
const PrivateRoute = ({ children }) => {
  const treinadorRaw = localStorage.getItem("treinador");

  if (!treinadorRaw) return <Navigate to="/login" />;

  try {
    const treinador = JSON.parse(treinadorRaw);
    const token = treinador.token;
    const decoded = jwtDecode(token);
    
    // Calculando o tempo de forma que o ESLint aceite melhor
    const tempoAtual = Math.floor(Date.now() / 1000);

    if (decoded.exp < tempoAtual) {
      localStorage.removeItem("treinador");
      return <Navigate to="/login" />;
    }

    return children;
  } catch {
    // Removi o (error) aqui para sumir o erro de "unused-vars"
    localStorage.removeItem("treinador");
    return <Navigate to="/login" />;
  }
};

// 🏠 COMPONENTE DE REDIRECIONAMENTO INTELIGENTE
const PublicRoute = ({ children }) => {
  const treinadorRaw = localStorage.getItem("treinador");
  
  if (treinadorRaw) {
    try {
      const treinador = JSON.parse(treinadorRaw);
      const decoded = jwtDecode(treinador.token);
      const tempoAtual = Math.floor(Date.now() / 1000);

      if (decoded.exp > tempoAtual) {
        return <Navigate to="/home" />;
      }
    } catch {
      // Catch vazio ignora o erro e não cria variável não utilizada
      localStorage.removeItem("treinador");
    }
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrivateRoute><Navigate to="/home" /></PrivateRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/cadastro" element={<PublicRoute><Cadastro /></PublicRoute>} />

        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />

        <Route path="*" element={<PrivateRoute><Navigate to="/home" /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;