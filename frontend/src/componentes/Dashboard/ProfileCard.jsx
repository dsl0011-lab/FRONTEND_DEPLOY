import { useContext, useEffect, useState } from "react"
import { UsuarioContext } from "../useContext/UsuarioContext"
const ProfileCard = () => {
    const { usuario, setUsuario } = useContext(UsuarioContext);
    const [editing, setEditing] = useState(false)
    const URL = "http://localhost:8000/api/usuarios/me/" //consultar perfil usuario actual

    useEffect(()=>{
        const profileInformation = async () => {
            try {
                const respuesta = await fetch(URL, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: 'include'
                });
                if (!respuesta.ok) {
                    const respuestaFallida = await respuesta.json()
                    console.error(respuestaFallida)
                }
                const data = await respuesta.json()
                //datos recibidos
                setUsuario(()=>data)
            } catch (e) {
                console.error("Ha ocurrido un error", e)
            }
        }
        setTimeout(() => {
            profileInformation()
        }, 500);
    },[setUsuario])

    //componente para editar informacion del perfil
    const EditarProfile = () => {
        return (
            <form className="text-black flex items-end gap-4">
                <input
                    type="text"
                    className="w-auto h-auto p-2 border rounded max-w-xs"
                />
                <input
                    type="email"
                    className="w-auto h-auto p-2 border rounded max-w-xs"
                />
                <div className="flex space-x-2 h-auto w-auto">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Guardar
                    </button>
                    <button type="button" onClick={() => (setEditing(prev => !prev))} className="px-4 py-2 rounded border bg-red-600">
                        Cancelar
                    </button>
                </div>
            </form>
        )
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-white">
            <h3 className="w-full h-12 text-lg font-bold text-gray-900 dark:text-white">Perfil</h3>
            {!editing ? (
                !usuario ? <p>Cargando datos...</p>
                    :
                    <>
                        <ul>
                            <li>Nombre: {usuario.full_name}</li>
                            <li>Nombre de usuario: {usuario.username}</li>
                            <li>Genero: {usuario.gender === "M" ? `masculino` : `femenino`}</li>
                            <li>Role: {usuario.role === "S" ? `Estudiante` : usuario.role === "T" ? "Profesor" : `Administrador`}</li>
                            <li>Fecha de registro: {usuario.date_joined}</li>
                        </ul>
                        <button type="button" onClick={() => (setEditing(prev => !prev))} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Editar información
                        </button>
                    </>
            ) : (
                <EditarProfile />
            )}
        </div>
    )
}
export default ProfileCard
