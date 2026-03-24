import {
  Ruler,
  Dumbbell,
  Zap,
  House,
  Search,
  ClipboardList,
  Globe,
  UserRound,
  Mail,
} from "lucide-react"; // 1. Corrigi os nomes aqui
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("all");

  useEffect(() => {
    async function carregarPokemons() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=101",
        );
        const data = await response.json();
        const promessas = data.results.map(async (item) => {
          const resDetalhes = await fetch(item.url);
          return await resDetalhes.json();
        });

        const resultados = await Promise.all(promessas);
        setPokemons(resultados);
        setLoading(false);
      } catch (error) {
        console.log("Erro ao buscar Pokémons:", error);
      }
    }
    carregarPokemons();
  }, []);

  const pokemonsFiltrados = pokemons.filter((poke) => {
    const matchesNome = poke.name
      .toLowerCase()
      .includes(pesquisa.toLowerCase());
    const matchesTipo =
      filtroTipo === "all" ||
      poke.types.some((t) => t.type.name === filtroTipo);
    return matchesNome && matchesTipo;
  });

  const pokemonDestaque = pokemonsFiltrados[0] || pokemons[0];

  // TRAVA DE SEGURANÇA REFORÇADA
  if (loading || !pokemonDestaque) {
    return (
      <div className="loading-screen">
        <h1 style={{ color: "#78c850" }}>Carregando Pokédex...</h1>
      </div>
    );
  }

  const tipos = [
    "all",
    "grass",
    "poison",
    "fire",
    "water",
    "bug",
    "flying",
    "normal",
    "electric",
    "ground",
    "fairy",
    "fighting",
    "psychic",
  ];

  return (
    <div className="setup-container">
      <section
        className={`pokemon-destaque ${pokemonDestaque?.types[0].type.name}`}
      >
        <div className="destaque-conteudo">
          <div className="destaque-informacoes">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg"
              alt="logo"
              className="logo-topo"
              style={{ width: "200px" }}
            />
            <h1 className="nome-destaque">{pokemonDestaque?.name}</h1>

            <div className="destaque-tipos">
              {pokemonDestaque?.types.map((t) => (
                <span key={t.type.name} className={`tag-tipo ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <p className="descricao-destaque">
              O {pokemonDestaque?.name} é um Pokémon incrível. Com habilidades
              únicas, ele se torna um parceiro confiável para qualquer
              treinador!
            </p>

            <button className="btn-principal">
              <Zap size={20} /> Mais detalhes
            </button>

            <div className="redes-sociais">
              <Globe size={24} />
              <UserRound size={24} />
              <Mail size={24} />
            </div>
          </div>

          <div className="destaque-imagem-bloco">
            <img
              src={
                pokemonDestaque?.sprites.other["official-artwork"].front_default
              }
              alt={pokemonDestaque?.name}
              className="poke-image-grande"
            />
          </div>
        </div>{" "}
        {/* Fim destaque-conteudo */}
      </section>

      <header className="pokedex-header">
        <div className="busca-bloco">
          <div className="label-container">
            <ClipboardList size={18} color="#aaa" />
            <span className="label-texto">Busque por tipo:</span>
          </div>

          <div className="barra-background-escura barra-scroll">
            {tipos.map((tipo) => (
              <div
                key={tipo}
                className={`tipo-circulo ${tipo} ${filtroTipo === tipo ? "active" : ""}`}
                onClick={() => setFiltroTipo(tipo)}
              >
                {tipo === "all" ? (
                  <House size={16} color="white" />
                ) : (
                  <img
                    src={`https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/${tipo}.svg`}
                    alt={tipo}
                    className="icon-tipo-svg"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="busca-bloco">
          <div className="label-container">
            <Search size={18} color="#aaa" />
            <span className="label-texto">Encontre seu pokémon:</span>
          </div>
          <div className="barra-background-escura input-wrapper">
            <input
              type="text"
              placeholder="Eu escolho você!"
              value={pesquisa}
              onChange={(e) => setPesquisa(e.target.value)}
            />
            <button className="botao-roxo-busca">
              <Search size={20} color="white" />
            </button>
          </div>
        </div>
      </header>

      <div className="pokemon-grid">
        {pokemonsFiltrados.map((poke) => (
          <div
            key={poke.id}
            className={`card-pokemon ${poke.types[0].type.name}`}
          >
            {/* 1. O ERRO DEVE ESTAR AQUI: Use poke.sprites, não pokemonDestaque ou algo fixo */}
            <img
              src={poke.sprites.other["official-artwork"].front_default}
              alt={poke.name}
              className="poke-imagem"
            />

            <span className="poke-id">#{String(poke.id).padStart(3, "0")}</span>

            {/* 2. Use poke.name */}
            <h2 className="poke-nome" style={{ textTransform: "capitalize" }}>
              {poke.name}
            </h2>

            <div className="poke-tipos">
              {/* 3. Use poke.types */}
              {poke.types.map((t) => (
                <span key={t.type.name} className={`tag ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>

            <div className="poke-stats">
              <div className="stat-item">
                {/* 4. Use poke.height */}
                <strong>{poke.height / 10} M</strong>
                <div className="label-icon">
                  <Ruler size={14} color="#aaa" />
                  <span>Altura</span>
                </div>
              </div>
              <div className="stat-item">
                {/* 5. Use poke.weight */}
                <strong>{poke.weight / 10}kg</strong>
                <div className="label-icon">
                  <Dumbbell size={14} color="#aaa" />
                  <span>Peso</span>
                </div>
              </div>
            </div>

            <button className="btn-detalhes">
              <Zap size={16} /> Mais detalhes
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
