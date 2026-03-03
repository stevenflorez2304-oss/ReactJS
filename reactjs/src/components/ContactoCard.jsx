export default function ContactoCard({
  nombre,
  telefono,
  correo,
  etiqueta,
  onEliminar,
  onEditar,
}) {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{nombre}</h3>
        <p>{telefono}</p>
        <p>{correo}</p>
        {etiqueta && <span className="text-sm text-gray-500">{etiqueta}</span>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEditar}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          Editar
        </button>

        <button
          onClick={onEliminar}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}