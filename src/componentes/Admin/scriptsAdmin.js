import { API_BASE } from "../Authorization/scripts/Security";

const url_eliminar = `${API_BASE}api/admin/`

const normalizar = (str) => {
    return String(str).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const definirRole = (rol) => {
    if (rol === "T") {
        return "Profesor"
    } else if (rol === "S") {
        return "Estudiante"
    } else if (rol === "A") {
        return "Administrador"
    }
}


const solicitud_admin = async (usuarioElegido, metodo, solicitud, setErrorDescripcion, setError, setRequestExitosa, actualizarUsuarios) =>{
    try {
        const respuesta = await fetch(`${url_eliminar}${usuarioElegido}/`, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(solicitud)
        })
        const data = await respuesta.json()
        if (data?.ok === false) {
            let errores = Object.values(data).flat()
            setErrorDescripcion(errores)
            setError(true)
        }
        actualizarUsuarios(data)
    } catch (e) {
        let errores = Object.values(e).flat()
        setErrorDescripcion(errores)
        setError(true)
    } finally {
        setRequestExitosa(true)
    }
}


export { normalizar, definirRole, solicitud_admin }