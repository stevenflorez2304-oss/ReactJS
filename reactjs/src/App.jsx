import { useState, useEffect } from "react";
import "./App.css";
import FormularioContacto from "./components/FormularioContacto";
import ContactoCard from "./components/ContactoCard";

export default function App() {

  // 1. Leer contactos guardados en el navegador
  const contactosGuardados =
    JSON.parse(localStorage.getItem("contactos")) || [];

  // 2. Crear estado con los contactos guardados
  const [contactos, setContactos] = useState(contactosGuardados);

  // 3. Guardar automáticamente cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("contactos", JSON.stringify(contactos));
  }, [contactos]);

  // 4. Agregar contacto
  const agregarContacto = (nuevo) => {
    setContactos((prev) => [...prev, nuevo]);
  };

  // 5. Eliminar contacto por correo
  const eliminarContacto = (correo) => {
    setContactos((prev) =>
      prev.filter((c) => c.correo !== correo)
    );
  };

  return (
     <main className="max-w-2xl mx-auto mt-10 p-4">

       <h1 className="text-3xl font-bold text-morado text-center mb-2">
        Agenda ADSO v4
      </h1>
      <p className="bg-morado text-white  rounded px-2 py-1 w-fit mx-auto">
        Programa Agenda-Adso
        </p>
      

      <p className="text-gray-500 text-center mb-6">
        
        Interfaz moderna con TailwindCSS
      </p>
      <FormularioContacto onAgregar={agregarContacto} />

      {contactos.map((contacto) => (
        <ContactoCard
          key={contacto.correo}
          {...contacto}
          onEliminar={eliminarContacto}
        />
      ))}

    </main>
  );
};