import { useEffect, useState } from "react";
import Swal from 'sweetalert2'; // Se mantiene SweetAlert2
import {
  listarContactos,
  crearContacto,
  actualizarContacto,
  eliminarContactoPorId,
} from "./api";
import { APP_INFO } from "./config";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

function App() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [contactoEnEdicion, setContactoEnEdicion] = useState(null);
  const [vista, setVista] = useState("crear");

  // Carga inicial
  useEffect(() => {
    const cargarContactos = async () => {
      try {
        setCargando(true);
        setError("");
        const data = await listarContactos();
        setContactos(data);
      } catch (error) {
        console.error("Error al cargar contactos:", error);
        setError("No se pudieron cargar los contactos. Verifica el servidor.");
      } finally {
        setCargando(false);
      }
    };
    cargarContactos();
  }, []);

  // Crear contacto con SweetAlert2
  const onAgregarContacto = async (nuevoContacto) => {
    try {
      setError("");
      const creado = await crearContacto(nuevoContacto);
      setContactos((prev) => [...prev, creado]);
      Swal.fire('¡Éxito!', 'Contacto guardado correctamente', 'success');
    } catch (error) {
      setError("No se pudo guardar el contacto.");
      throw error;
    }
  };

  // Actualizar contacto
  const onActualizarContacto = async (contactoActualizado) => {
    try {
      setError("");
      const actualizado = await actualizarContacto(contactoActualizado.id, contactoActualizado);
      setContactos((prev) =>
        prev.map((c) => (c.id === actualizado.id ? actualizado : c))
      );
      setContactoEnEdicion(null);
      Swal.fire('¡Actualizado!', 'El contacto ha sido modificado', 'success');
    } catch (error) {
      setError("No se pudo actualizar el contacto.");
      throw error;
    }
  };

  // Eliminar contacto con el modal de confirmación del código antiguo
  const onEliminarContacto = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
      try {
        setError("");
        await eliminarContactoPorId(id);
        setContactos((prev) => prev.filter((c) => c.id !== id));
        
        // Mantener funcionalidad de limpiar edición si se elimina el que se edita
        if (contactoEnEdicion?.id === id) setContactoEnEdicion(null);

        Swal.fire('¡Eliminado!', 'El contacto ha sido borrado.', 'success');
      } catch (error) {
        Swal.fire('Error', 'No se pudo eliminar el contacto.', 'error');
      }
    }
  };

  const onEditarClick = (contacto) => {
    setContactoEnEdicion(contacto);
    setError("");
    // Opcional: mover el foco al inicio para ver el formulario de edición
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const irAVerContactos = () => {
    setVista("contactos");
    setContactoEnEdicion(null);
  };

  const irACrearContacto = () => {
    setVista("crear");
    setContactoEnEdicion(null);
    setBusqueda("");
  };

  // Lógica de filtrado y ordenamiento (funcionalidad preservada)
  const contactosFiltrados = contactos.filter((c) => {
    const termino = busqueda.toLowerCase();
    return (
      c.nombre.toLowerCase().includes(termino) ||
      c.correo.toLowerCase().includes(termino) ||
      (c.etiqueta || "").toLowerCase().includes(termino)
    );
  });

  const contactosOrdenados = [...contactosFiltrados].sort((a, b) => {
    const nombreA = a.nombre.toLowerCase();
    const nombreB = b.nombre.toLowerCase();
    if (nombreA < nombreB) return ordenAsc ? -1 : 1;
    if (nombreA > nombreB) return ordenAsc ? 1 : -1;
    return 0;
  });

  const estaEnVistaCrear = vista === "crear";
  const estaEnVistaContactos = vista === "contactos";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900">
      <header className="border-b border-slate-800 bg-slate-950/60 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md">A</div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Proyecto ABP</p>
              <h1 className="text-sm md:text-base font-semibold text-slate-50">Agenda ADSO – ReactJS</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400">SENA CTMA</p>
            <p className="text-xs text-slate-200">Ficha {APP_INFO.ficha}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-10 pb-14">
        <div className="grid gap-8 md:grid-cols-[1.6fr,1fr] items-start">
          
          <div className="bg-white/95 rounded-3xl shadow-2xl border border-slate-100 px-6 py-7 md:px-8 md:py-8">
            <header className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">{APP_INFO.titulo}</h2>
                <p className="text-sm text-gray-600 mt-1">{APP_INFO.subtitulo}</p>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-purple-50 px-3 py-1 border border-purple-100">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-purple-800">
                    {contactos.length} contacto{contactos.length !== 1 && "s"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] uppercase tracking-[0.16em] text-gray-400">
                  {estaEnVistaCrear ? "Modo creación" : "Modo contactos"}
                </span>
                <button
                  type="button"
                  onClick={estaEnVistaCrear ? irAVerContactos : irACrearContacto}
                  className={`text-xs md:text-sm px-4 py-2 rounded-xl border transition-colors ${
                    estaEnVistaCrear 
                    ? "border-purple-200 text-purple-700 hover:bg-purple-50" 
                    : "border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {estaEnVistaCrear ? "Ver contactos" : "Volver a crear"}
                </button>
              </div>
            </header>

            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            {cargando ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : (
              <>
                {estaEnVistaCrear && (
                  <FormularioContacto
                    onAgregar={onAgregarContacto}
                    onActualizar={onActualizarContacto}
                    contactoEnEdicion={null}
                    onCancelarEdicion={() => setContactoEnEdicion(null)}
                  />
                )}

                {estaEnVistaContactos && (
                  <>
                    {contactoEnEdicion && (
                      <div className="mb-8 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                        <h3 className="text-sm font-bold text-purple-800 mb-3 uppercase tracking-wider">Editando Contacto</h3>
                        <FormularioContacto
                          onAgregar={onAgregarContacto}
                          onActualizar={onActualizarContacto}
                          contactoEnEdicion={contactoEnEdicion}
                          onCancelarEdicion={() => setContactoEnEdicion(null)}
                        />
                      </div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
                      <div className="flex-1">
                        <input
                          type="text"
                          className="w-full rounded-xl border-gray-300 focus:ring-purple-500 focus:border-purple-500 text-sm"
                          placeholder="Buscar por nombre, correo o etiqueta..."
                          value={busqueda}
                          onChange={(e) => setBusqueda(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setOrdenAsc(!ordenAsc)}
                        className="bg-gray-100 text-gray-700 text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-200"
                      >
                        {ordenAsc ? "Z-A ↓" : "A-Z ↑"}
                      </button>
                    </div>

                    <section className="space-y-4">
                      {contactosOrdenados.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-10">No se encontraron resultados.</p>
                      ) : (
                        contactosOrdenados.map((c) => (
                          <ContactoCard
                            key={c.id}
                            {...c}
                            onEliminar={() => onEliminarContacto(c.id)}
                            onEditar={() => onEditarClick(c)}
                          />
                        ))
                      )}
                    </section>
                  </>
                )}
              </>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl bg-gradient-to-br from-purple-600 to-purple-800 text-white p-6 shadow-xl">
              <h2 className="text-lg font-bold">Dashboard de Agenda</h2>
              <div className="mt-4 flex justify-between items-center border-t border-purple-400/30 pt-4">
                <span className="text-purple-100 text-sm">Total Contactos</span>
                <span className="text-2xl font-bold">{contactos.length}</span>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default App;