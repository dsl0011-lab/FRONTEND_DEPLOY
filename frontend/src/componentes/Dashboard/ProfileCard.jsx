import { useContext } from "react"
import { UsuarioContext } from "../useContext/UsuarioContext"
const ProfileCard = () => {
    const { usuario, setUsuario } = useContext(UsuarioContext);
    const URL = "http://localhost:8000/api/usuarios/me/"

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
            setUsuario(data)
        } catch (e) {
            console.error("Ha ocurrido un error", e)
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow text-white">
            <button onClick={() => profileInformation()} className="bg-gray-900 p-4 m-4">Motrar perfil</button>
            <>{
                !usuario ? 
                (
                    (<p>Cargando datos...</p>)
                )
                :
                <ul>
                    <li>nombre: {usuario.full_name}</li>
                    <li>nombre de usuario: {usuario.username}</li>
                    <li>Genero: {usuario.gender === "M" ? `masculino` : `femenino`}</li>
                    <li>Role: {usuario.role === "S" ? `Estudiante` : usuario.role === "T" ? "Profesor"  : `Administrador`}</li>
                    <li>Fecha de registro: {usuario.date_joined}</li>
                </ul>
            }</>
        </div>
    )
}
export default ProfileCard
