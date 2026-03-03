import { useEffect, useState } from "react";

export default function FormularioContacto({ onGuardar, contactoEditando }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    etiqueta: "",
  });

  useEffect(() => {
    if (contactoEditando) {
      setForm({
        nombre: contactoEditando.nombre || "",
        telefono: contactoEditando.telefono || "",
        correo: contactoEditando.correo || "",
        etiqueta: contactoEditando.etiqueta || "",
      });
    } else {
      setForm({
        nombre: "",
        telefono: "",
        correo: "",
        etiqueta: "",
      });
    }
  }, [contactoEditando]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (contactoEditando) {
      await onGuardar({ ...form, id: contactoEditando.id });
    } else {
      await onGuardar(form);
    }

    setForm({
      nombre: "",
      telefono: "",
      correo: "",
      etiqueta: "",
    });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">
        {contactoEditando ? "Editar contacto" : "Nuevo contacto"}
      </h2>

      <input
        name="nombre"
        value={form.nombre}
        onChange={onChange}
        placeholder="Nombre"
        className="block w-full mb-2 border p-2 rounded"
        required
      />

      <input
        name="telefono"
        value={form.telefono}
        onChange={onChange}
        placeholder="Teléfono"
        className="block w-full mb-2 border p-2 rounded"
        required
      />

      <input
        name="correo"
        value={form.correo}
        onChange={onChange}
        placeholder="Correo"
        className="block w-full mb-2 border p-2 rounded"
        required
      />

      <input
        name="etiqueta"
        value={form.etiqueta}
        onChange={onChange}
        placeholder="Etiqueta"
        className="block w-full mb-4 border p-2 rounded"
      />

      <button className="bg-purple-600 text-white px-4 py-2 rounded">
        {contactoEditando ? "Guardar cambios" : "Agregar contacto"}
      </button>
    </form>
  );
}