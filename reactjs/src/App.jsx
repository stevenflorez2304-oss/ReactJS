import { useEffect, useState } from "react";

// Importamos las funciones de la API (capa de datos)
import { listarContactos, crearContacto, eliminarContactoPorId } from "./api";

// Importamos la configuración global de la aplicación
import { APP_INFO } from "./config";

// Importamos componentes hijos
import FormularioContacto from "./components/formularioContacto";
import ContactoCard from "./components/contactoCard";

function App() {
  // Estado que almacena la lista de contactos obtenidos de la API
  const [contactos, setContactos] = useState([]);

  // Estado que indica si estamos cargando información (por ejemplo, al inicio)
  const [cargando, setCargando] = useState(true);

  // Estado para guardar mensajes de error generales de la aplicación
  const [error, setError] = useState("");

  // useEffect que se ejecuta una sola vez al montar el componente.
  // Aquí cargamos los contactos iniciales desde JSON Server (GET).
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true); // Indicamos que estamos cargando
        setError(""); // Limpiamos posibles errores anteriores

        const data = await listarContactos(); // Llamamos a la API
        setContactos(data); // Guardamos la lista de contactos en el estado
      } catch (error) {
        // En caso de error, lo registramos en consola para depuración
        console.error("Error al cargar contactos:", error);

        // Y mostramos un mensaje amigable al usuario
        setError(
          "No se pudieron cargar los contactos. Verifica que el servidor esté encendido e intenta de nuevo.",
        );
      } finally {
        setCargando(false); // Finalizamos el estado de carga
      }
    };

    cargarContactos();
  }, []);

  // Función que se encarga de agregar un nuevo contacto usando la API (POST)
  const onAgregarContacto = async (nuevoContacto) => {
    try {
      // Limpiamos cualquier error previo antes de intentar guardar
      setError("");

      // Llamamos al servicio que crea el contacto en JSON Server
      const creado = await crearContacto(nuevoContacto);

      // Actualizamos el estado agregando el contacto recién creado a la lista
      setContactos((prev) => [...prev, creado]);
    } catch (error) {
      // Mostramos el error en consola para facilitar la depuración
      console.error("Error al crear contacto:", error);

      // Si falla la creación, mostramos un mensaje claro y útil
      setError(
        "No se pudo guardar el contacto. Verifica tu conexión o el estado del servidor e intenta nuevamente.",
      );

      // Relanzar el error es opcional, pero útil si el formulario quiere reaccionar
      throw error;
    }
  };

  // Función para eliminar un contacto por su id (DELETE)
  const onEliminarContacto = async (id) => {
    try {
      setError(""); // Limpiamos errores previos
      await eliminarContactoPorId(id); // Llamamos al servicio de eliminación

      // Filtramos el contacto eliminado de la lista local
      setContactos((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      // Mostramos el error en consola para depurar
      console.error("Error al eliminar contacto:", error);

      // Si algo falla al eliminar, informamos al usuario
      setError(
        "No se pudo eliminar el contacto. Vuelve a intentarlo o verifica el servidor.",
      );
    }
  };

  // Estado para el término de búsqueda
  const [busqueda, setBusqueda] = useState("");
  // Estado para el orden: true = A-Z, false = Z-A
  const [ordenAsc, setOrdenAsc] = useState(true);

  // Filtramos la lista original según el término de búsqueda
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();
    // Normalizamos texto a minúsculas para comparar sin problemas
    const nombre = c.nombre.toLowerCase();
    const correo = c.correo.toLowerCase();
    const etiqueta = (c.etiqueta || "").toLowerCase();
    const telefono = c.telefono
    // Incluimos el contacto si el término aparece en alguno de estos campos
    return (
      nombre.includes(termino) ||
      correo.includes(termino) ||
      etiqueta.includes(termino) ||
      telefono.includes(termino)
    );
  });

  // Ordenamos los contactos filtrados por nombre
  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();
    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const totalVisibles = contactosOrdenados.length;
  const mensajeCantidad = totalVisibles === 1 ? "Mostrando un contacto" : `mostrando ${totalVisibles} contactos`



  // JSX que renderiza toda la aplicación
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenedor principal centrado */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Encabezado principal de la Agenda usando la configuración global */}
        <header className="mb-8">
          <p className="text-xs tracking-[0.3em] text-gray-500 uppercase">
            Desarrollo Web ReactJS Ficha {APP_INFO.ficha}
          </p>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2">
            {APP_INFO.titulo}
          </h1>
          <p className="text-sm text-gray-600 mt-1">{APP_INFO.subtitulo}</p>
        </header>

        {/* Si hay un error global, lo mostramos en un recuadro rojo */}
        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
        )}

        {/* Si estamos cargando, mostramos un mensaje de carga */}
        {cargando ? (
          <p className="text-sm text-gray-500">Cargando contactos...</p>
        ) : (
          <>
            {/* Formulario para crear nuevos contactos */}
            <FormularioContacto onAgregar={onAgregarContacto} />



            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <p className="text-lg font-semibold text-gray-900 mb-2">Buscador</p>
              <input
                type="text"
                className="w-full md:flex-1 rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm"
                placeholder="Buscar por nombre, correo, telefono o etiqueta..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <button
                type="button"
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200"
              >
                {mensajeCantidad}
              </button>


              <button
                type="button"
                onClick={() => setOrdenAsc((prev) => !prev)}
                className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200"
              >
                {ordenAsc ? "Ordenar Z-A" : "Ordenar A-Z"}
              </button>
            </div>

            {/* Listado de contactos */}
            <section className="space-y-4">
              {contactosOrdenados.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No se encontraron contactos que coincidan con la búsqueda.
                </p>
              ) : (
                contactosOrdenados.map((c) => (
                  <ContactoCard
                    key={c.id}
                    nombre={c.nombre}
                    telefono={c.telefono}
                    correo={c.correo}
                    etiqueta={c.etiqueta}
                    onEliminar={() => onEliminarContacto(c.id)}
                  />
                ))
              )}
            </section>
          </>
        )}

        {/* Pie de página con los datos del instructor */}
        <footer className="mt-8 text-xs text-gray-400">
          <p>Desarrollo Web – ReactJS | Proyecto Agenda ADSO</p>
          <p>Instructor: Gustavo Adolfo Bolaños Dorado</p>
        </footer>
      </div>
    </div>
  );
}

// Exportamos el componente principal
export default App;