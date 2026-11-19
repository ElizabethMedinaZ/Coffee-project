import { useMemo, useState } from "react";
import { cafes } from "./data";
import "./App.css";

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function valoresUnicos(campo) {
  return [...new Set(cafes.map((c) => c[campo]))].sort((a, b) =>
    a.localeCompare(b, "es")
  );
}

const ciudades = valoresUnicos("ciudad");
const tipos = valoresUnicos("tipo");

function TarjetaCafe({ cafe }) {
  return (
    <article className="tarjeta">
      <h2>{cafe.nombre}</h2>
      <p className="ciudad">📍 {cafe.ciudad}</p>
      <p className="descripcion">{cafe.descripcion}</p>
      <div className="meta">
        <span className="etiqueta">{cafe.tipo}</span>
        <span className="etiqueta">{cafe.precio}</span>
        <span className="estrellas">★ {cafe.calificacion.toFixed(1)}</span>
      </div>
    </article>
  );
}

function App() {
  const [busqueda, setBusqueda] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipo, setTipo] = useState("");
  const [orden, setOrden] = useState("nombre");

  const resultados = useMemo(() => {
    const termino = normalizar(busqueda.trim());

    const filtrados = cafes.filter((cafe) => {
      const coincideTexto =
        termino === "" ||
        normalizar(cafe.nombre).includes(termino) ||
        normalizar(cafe.descripcion).includes(termino);
      const coincideCiudad = ciudad === "" || cafe.ciudad === ciudad;
      const coincideTipo = tipo === "" || cafe.tipo === tipo;
      return coincideTexto && coincideCiudad && coincideTipo;
    });

    if (orden === "calificacion") {
      filtrados.sort((a, b) => b.calificacion - a.calificacion);
    } else if (orden === "precio") {
      filtrados.sort((a, b) => a.precio.length - b.precio.length);
    } else {
      filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    }

    return filtrados;
  }, [busqueda, ciudad, tipo, orden]);

  function limpiarFiltros() {
    setBusqueda("");
    setCiudad("");
    setTipo("");
    setOrden("nombre");
  }

  return (
    <>
      <header className="encabezado">
        <h1>☕ Lista de Cafés</h1>
        <p>Busca y filtra tus cafeterías favoritas.</p>
      </header>

      <main className="contenedor">
        <section className="controles" aria-label="Búsqueda y filtros">
          <input
            type="search"
            placeholder="Buscar por nombre o descripción..."
            aria-label="Buscar café"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <select
            aria-label="Filtrar por ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          >
            <option value="">Todas las ciudades</option>
            {ciudades.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            aria-label="Filtrar por tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            aria-label="Ordenar resultados"
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
          >
            <option value="nombre">Ordenar: Nombre (A-Z)</option>
            <option value="calificacion">Ordenar: Mejor calificados</option>
            <option value="precio">Ordenar: Precio (menor a mayor)</option>
          </select>

          <button type="button" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        </section>

        <p className="contador" aria-live="polite">
          Mostrando {resultados.length} de {cafes.length} cafés
        </p>

        <section className="lista" aria-label="Resultados">
          {resultados.length === 0 ? (
            <p className="vacio">No se encontraron cafés con esos filtros.</p>
          ) : (
            resultados.map((cafe) => (
              <TarjetaCafe key={cafe.nombre} cafe={cafe} />
            ))
          )}
        </section>
      </main>

      <footer className="pie">
        <p>Profe, tengo sueño</p>
      </footer>
    </>
  );
}

export default App;
