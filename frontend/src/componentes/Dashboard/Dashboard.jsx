import Sidebar from "./Sidebar"
import ProfileCard from "./ProfileCard"
import { useState, useContext } from "react"
import { UsuarioContext } from "../useContext/UsuarioContext"
const Dashboard = ({ funcUsuario }) => {
    const { usuario, setUsuario } = useContext(UsuarioContext);
    const [asignaturas, setAsignaturas] = useState([
        "Matemáticas",
        "Física",
        "Programación",
        "Historia"
    ])

    return (
        <div className="flex min-h-screen w-auto bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                    Dashboard
                <button onClick={() => setUsuario(()=>"")} className='bg-gray-600 text-lg rounded-2xl p-2 ml-2 hover:bg-gray-400 absolute top-5 right-5'>
                    Cerrar sesión
                </button>
                </h1>
                <section className="flex items-center justify-center h-60">
                <h2 className='text-white text-2xl'>
                    {usuario.gender === "M"
                        ? `Bienvenido ${usuario.full_name}`
                        : `Bienvenida ${usuario.full_name}`}
                </h2>
                </section>
                <ProfileCard funcUsuario={funcUsuario}/>
                <section className="mt-8 text-white">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                        Asignaturas
                    </h2>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {asignaturas.map((asig, i) => (
                            <li
                                key={i}
                                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow flex justify-between items-center"
                            >
                                {asig}
                                <button
                                onClick={() =>setAsignaturas(asignaturas.filter((_, index) => index !== i))}
                                className="ml-2 text-red-500 hover:text-red-700">
                                    Eliminar
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => {
                            const nueva = prompt("Nombre de la nueva asignatura")
                            if (nueva) setAsignaturas([...asignaturas, nueva])
                        }}
                        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Agregar asignatura
                    </button>
                </section>
            </main>
        </div>
    )}
export default Dashboard
