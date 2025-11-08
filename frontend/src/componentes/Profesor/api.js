const RAW_API = (import.meta.env.VITE_API_URL || "http://localhost:8000").trim();
const API_BASE = RAW_API.replace(/\/+$/, "").replace(/\/api$/, "");

const buildUrl = (path = "") => {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}/api${cleanPath}`;
};

export async function apiFetch(path, opts = {}) {
  const url = buildUrl(path);

  // Normaliza headers
  const headers = { Accept: "application/json", ...(opts.headers || {}) };

  // Auto-JSON si body es un objeto plano y no viene ya stringificado ni es FormData/Blob
  let body = opts.body;
  const isString = typeof body === 'string';
  const isFormData = (typeof FormData !== 'undefined') && body instanceof FormData;
  const isBlob = (typeof Blob !== 'undefined') && body instanceof Blob;
  const isArrayBuffer = (typeof ArrayBuffer !== 'undefined') && body instanceof ArrayBuffer;
  const shouldJson = body !== undefined && !isString && !isFormData && !isBlob && !isArrayBuffer;
  if (shouldJson) {
    if (!headers['Content-Type'] && !headers['content-type']) {
      headers['Content-Type'] = 'application/json';
    }
    try { body = JSON.stringify(body); } catch(e){console.error("Ha ocurrido un error:", e)}
  }

  const res = await fetch(url, {
    credentials: "include",              // cookies HttpOnly
    headers,
    ...opts,
    body,
  });

  // DELETE en DRF suele devolver 204 sin body
  if (res.status === 204) return { ok: true };

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Error ${res.status}`);
  }

  // Evita fallo si no hay body
  const text = await res.text().catch(() => "");
  if (!text) return null;

  // Si no es JSON válido, lanza error claro
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Respuesta no es JSON");
  }
}

export async function getResumenAlumnos() {
  const url = buildUrl("/profesor/cursos/resumen-alumnos/");

  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',                // Cookies HttpOnly
    headers: { 'Accept': 'application/json' }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Error ${res.status}: ${text || 'no se pudo cargar el resumen'}`);
  }
  return res.json();
}

export async function deleteTarea(id) {
  const url = buildUrl(`/profesor/tareas/${id}/`);

  const res = await fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (res.status === 204) return true; // DRF por defecto
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error ${res.status}: ${text || "no se pudo borrar la tarea"}`);
  }
  return true;
}

export const getTutorias = () => apiFetch("/profesor/tutorias/");

export const createTutoria = (payload) =>
  apiFetch("/profesor/tutorias/", {
    method: "POST",
    body: payload,
  });

export const getAlumnosCurso = (cursoId) =>
  apiFetch(`/profesor/cursos/${cursoId}/alumnos/`);

