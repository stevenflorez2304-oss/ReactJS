import { useEffect, useState } from "react";
import {
  listarContactos,
  crearContacto,
  eliminarContactoPorId,
  editarContactoPorId,
} from "./api";

import { APP_INFO } from "./config";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [contactoEditando, setContactoEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);

  const cargarContactos = async () => {
    try {
      setCargando(true);
      const data = await listarContactos();
      setContactos(data.filter((c) => c.id)); // 🔥 blindaje contra ids null
    } catch {
      setError("No se pudieron cargar los contactos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarContactos();
  }, []);

  const onGuardarContacto = async (data) => {
    try {
      if (data.id) {
        const actualizado = await editarContactoPorId(data.id, data);
        setContactos((prev) =>
          prev.map((c) => (c.id === actualizado.id ? actualizado : c))
        );
        setContactoEditando(null);
      } else {
        const creado = await crearContacto(data);
        setContactos((prev) => [...prev, creado]);
      }
    } catch {
      setError("No se pudo guardar el contacto.");
    }
  };

  const onEliminarContacto = async (id) => {
    try {
      await eliminarContactoPorId(id);
      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch {
      setError("No se pudo eliminar el contacto.");
    }
  };

  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(termino) ||
      c.correo.toLowerCase().includes(termino) ||
      (c.etiqueta || "").toLowerCase().includes(termino) ||
      String(c.telefono).toLowerCase().includes(termino)
    );
  });

  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();
    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const totalVisibles = contactosOrdenados.length;
  const mensajeCantidad = totalVisibles === 1 ? "Mostrando un contacto" : `mostrando ${totalVisibles} contactos`

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha {APP_INFO.ficha}
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            {APP_INFO.titulo}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{APP_INFO.subtitulo}</p>
        </header>

        {error && (
          <div className="mb-4 bg-red-100 p-3 rounded">
            {error}
          </div>
        )}

        {cargando ? (
          <p>Cargando contactos...</p>
        ) : (
          <>
            <FormularioContacto
              onGuardar={onGuardarContacto}
              contactoEditando={contactoEditando}
            />

            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                type="button"
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200"
              >
                {mensajeCantidad}
              </button>
              <button
                onClick={() => setOrdenAsc((prev) => !prev)}
                className="bg-gray-200 px-3 py-2 rounded"
              >
                {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
              </button>
            </div>

            <section className="space-y-4">
              {contactosOrdenados.map((c) => (
                <ContactoCard
                  key={c.id}
                  {...c}
                  onEliminar={() => onEliminarContacto(c.id)}
                  onEditar={() => setContactoEditando(c)}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

export default App;