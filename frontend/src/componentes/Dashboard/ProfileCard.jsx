import { useContext, useEffect, useState } from "react"
import { UsuarioContext } from "../useContext/UsuarioContext"
import { secureFetch } from "../Authorization/scripts/Security";

const ProfileCard = () => {
    const { usuario } = useContext(UsuarioContext);
    const [editing, setEditing] = useState(false)
    const URL = "http://localhost:8000/api/usuarios/me/" //consultar perfil usuario actual

    useEffect(()=>{
        secureFetch({method: "POST"})
    },[usuario])

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
            <h2 className="w-full h-12 text-lg font-bold text-gray-900 dark:text-white">Perfil</h2>
            {!editing ? (
                !usuario ? <p>Cargando datos...</p>
                    :
                    <>
                        <ul className="w-full h-full p-1 flex flex-col gap-2 m-2">
                            <li>Nombre: {usuario.first_name} {usuario.last_name}</li>
                            <li>Nombre de usuario: {usuario.username}</li>
                            <li>Genero: {usuario.gender === "M" ? `masculino` : `femenino`}</li>
                            <li>Role: {usuario.role === "S" ? `Estudiante` : usuario.role === "T" ? "Profesor" : `Administrador`}</li>
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
