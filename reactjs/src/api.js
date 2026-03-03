// Archivo: src/api.js

import { API_BASE_URL } from "./config";

// GET - listar contactos
export async function listarContactos() {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Error al listar contactos");
  return res.json();
}

// POST - crear contacto
export async function crearContacto(data) {
  const res = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al crear el contacto");
  return res.json();
}

// DELETE - eliminar contacto
export async function eliminarContactoPorId(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Error al eliminar el contacto");
  return true;
}

export async function editarContactoPorId(id, data) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PATCH", // 👈 cambiar esto
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Error al editar el contacto");
  return res.json();
}