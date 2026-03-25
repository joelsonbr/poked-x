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
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("all");
  const [pokemonAberto, setPokemonAberto] = useState(null);
  const [especieDados, setEspecieDados] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState("about");
  const [defesas, setDefesas] = useState(null);

  const carregarDetalhesCompletos = async (pokemon) => {
    setPokemonAberto(pokemon);
    setEspecieDados(null);
    setAbaAtiva("about"); // Sempre abre no About por padrão
    setDefesas(null); // Limpa as defesas do Pokémon anterior

    try {
      // 1. Busca os dados da Espécie (o que você já tinha)
      const respostaEspecie = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`,
      );
      const dadosEspecie = await respostaEspecie.json();
      setEspecieDados(dadosEspecie);

      // 2. Busca as Defesas (Baseado no tipo principal do Pokémon)
      // Pegamos a URL do primeiro tipo dele: pokemon.types[0].type.url
      const respostaTipo = await fetch(pokemon.types[0].type.url);
      const dadosTipo = await respostaTipo.json();

      // Salvamos as "damage_relations" que contém quem dá 2x, 0.5x, etc.
      setDefesas(dadosTipo.damage_relations);
    } catch (erro) {
      console.error("Erro ao carregar detalhes:", erro);
    }
  };

  useEffect(() => {
    async function carregarPokemons() {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=150",
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

            <button
              className="btn-principal"
              onClick={() =>
                pokemonDestaque && carregarDetalhesCompletos(pokemonDestaque)
              }
              disabled={!pokemonDestaque} // Desativa o botão se não houver pokemon carregado
            >
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

            <button
              className="btn-detalhes"
              onClick={() => carregarDetalhesCompletos(poke)}
            >
              <Zap size={16} /> Mais detalhes
            </button>
          </div>
        ))}
      </div>

      {/* a janela sobre o pokemon */}
      {pokemonAberto && (
        <div className="modal-teste">
          <div className={`modal-caixa ${pokemonAberto.types[0].type.name}`}>
            {/* Topo com Nome, ID e Botão Voltar */}
            <div className="modal-header-topo">
              <button
                className="btn-voltar"
                onClick={() => setPokemonAberto(null)}
              >
                <ArrowLeft />
              </button>
              <span className="modal-id">
                #{String(pokemonAberto.id).padStart(3, "0")}
              </span>
            </div>

            <div className="modal-info-principal">
              <h1 className="modal-nome">{pokemonAberto.name}</h1>
              <div className="modal-tipos">
                {pokemonAberto.types.map((t) => (
                  <span key={t.type.name} className="tag-modal">
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Imagem grande do Pokémon */}
            <div className="modal-imagem-container">
              <img
                src={
                  pokemonAberto.sprites.other["official-artwork"].front_default
                }
                alt={pokemonAberto.name}
                className="modal-img-poke"
              />
            </div>

            {/* NOVA PARTE: O corpo branco com os detalhes */}
            <div className="modal-detalhes-branco">
              <nav className="modal-nav">
                <span
                  className={abaAtiva === "about" ? "active" : ""}
                  onClick={() => setAbaAtiva("about")}
                >
                  About
                </span>
                <span
                  className={abaAtiva === "stats" ? "active" : ""}
                  onClick={() => setAbaAtiva("stats")}
                >
                  Base Stats
                </span>
                <span>Evolution</span>
              </nav>

              {/* CONTEÚDO DA ABA ABOUT */}
              {abaAtiva === "about" && (
                <div className="modal-stats-list animate-in">
                  <div className="modal-stats-list">
                    <div className="stat-row-clean">
                      <span className="label-cinza">Species</span>
                      <span className="valor-preto">
                        {especieDados
                          ? especieDados.genera.find(
                              (g) => g.language.name === "en",
                            )?.genus
                          : "Loading..."}
                      </span>
                    </div>

                    <div className="stat-row-clean">
                      <span className="label-cinza">Height</span>
                      <span className="valor-preto">
                        {pokemonAberto.height / 10} m (
                        {pokemonAberto.height * 10} cm)
                      </span>
                    </div>

                    <div className="stat-row-clean">
                      <span className="label-cinza">Weight</span>
                      <span className="valor-preto">
                        {pokemonAberto.weight / 10} kg
                      </span>
                    </div>

                    <div className="stat-row-clean">
                      <span className="label-cinza">Abilities</span>
                      <span className="valor-preto">
                        {pokemonAberto.abilities
                          .map((a) => a.ability.name)
                          .join(", ")}
                      </span>
                    </div>

                    <div className="breeding-section">
                      <h3 className="section-title-small">Breeding</h3>

                      <div className="stat-row-clean">
                        <span className="label-cinza">Gender</span>
                        <div className="gender-values">
                          {especieDados ? (
                            especieDados.gender_rate === -1 ? (
                              <span className="valor-preto">Genderless</span>
                            ) : (
                              <>
                                <span className="male">
                                  ♂ {100 - especieDados.gender_rate * 12.5}%
                                </span>
                                <span className="female">
                                  ♀ {especieDados.gender_rate * 12.5}%
                                </span>
                              </>
                            )
                          ) : (
                            "..."
                          )}
                        </div>
                      </div>

                      <div className="stat-row-clean">
                        <span className="label-cinza">Egg Groups</span>
                        <span className="valor-preto">
                          {especieDados
                            ? especieDados.egg_groups
                                .map((g) => g.name)
                                .join(", ")
                            : "Loading..."}
                        </span>
                      </div>

                      <div className="stat-row-clean">
                        <span className="label-cinza">Egg Cycle</span>
                        <span className="valor-preto">
                          {especieDados ? especieDados.hatch_counter : "..."}{" "}
                          steps
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTEÚDO DA ABA BASE STATS */}
              {abaAtiva === "stats" && (
                <div className="modal-stats-list animate-in">
                  {pokemonAberto.stats.map((s) => (
                    <div className="stat-row-bar" key={s.stat.name}>
                      <span className="label-cinza-stats">
                        {s.stat.name.replace("special-", "Sp. ")}
                      </span>
                      <span className="valor-status">{s.base_stat}</span>
                      <div className="bar-container">
                        <div
                          className={`bar-fill ${s.base_stat >= 50 ? "high" : "low"}`}
                          style={{ width: `${(s.base_stat / 255) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}

                  <div className="stat-row-bar">
                    <span className="label-cinza-stats">Total</span>
                    <span className="valor-status">
                      {/* Removemos os [] e deixamos só o reduce */}
                      {pokemonAberto.stats.reduce(
                        (acc, s) => acc + s.base_stat,
                        0,
                      )}
                    </span>
                    <div className="bar-container">
                      <div
                        className="bar-fill total"
                        style={{
                          width: `${(pokemonAberto.stats.reduce((acc, s) => acc + s.base_stat, 0) / 720) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* --- SEÇÃO DE DEFESAS --- */}
                  <div className="type-defenses-container">
                    <h3 className="section-title-small">Type Defenses</h3>
                    <p className="label-cinza-pequeno">
                      he effectiveness of each type on {pokemonAberto.name}
                    </p>

                    {/* --- NOVA LEGENDA COLORIDA --- */}
                    <div className="legenda-defesa">
                      <div className="legenda-item weakness">
                        <span className="ponto-cor red"></span> Weakness (2x)
                      </div>
                      <div className="legenda-item resistance">
                        <span className="ponto-cor green"></span> Resistance
                        (2x)
                      </div>
                    </div>

                    <div className="tags-defesas-grid">
                      {defesas ? (
                        <>
                          {/* Adicionei a classe 'weakness' aqui no map */}
                          {defesas.double_damage_from.map((d) => (
                            <div key={d.name} className="defesa-item weakness">
                              <span className={`tag-tipo-fixa ${d.name}`}>
                                {d.name}
                              </span>
                              <span className="multiplicador">2x</span>
                            </div>
                          ))}

                          {/* Adicionei a classe 'resistance' aqui no map */}
                          {defesas.half_damage_from.map((d) => (
                            <div
                              key={d.name}
                              className="defesa-item resistance"
                            >
                              <span className={`tag-tipo-fixa ${d.name}`}>
                                {d.name}
                              </span>
                              <span className="multiplicador">½x</span>
                            </div>
                          ))}

                          {/* Renderiza as Imunidades (Caso existam) */}
                          {defesas.no_damage_from.map((d) => (
                            <div key={d.name} className="defesa-item">
                              <span className={`tag-tipo-fixa ${d.name}`}>
                                {d.name}
                              </span>
                              <span className="multiplicador">0x</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p className="carregando">
                          Buscando dados de batalha...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
