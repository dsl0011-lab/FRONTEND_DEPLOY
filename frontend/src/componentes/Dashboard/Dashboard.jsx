import { useContext } from "react"
import { UsuarioContext } from "../useContext/UsuarioContext"
import Sidebar from "./Sidebar"
import { Outlet } from "react-router-dom"
import Inicio from "./Inicio"
const Dashboard = () => {
    const { setUsuario } = useContext(UsuarioContext)

    return (
        <div className="flex h-full w-full min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Dashboard
            </h3> 
            <button onClick={() => setUsuario(()=>"")} className='bg-gray-600 text-lg rounded-2xl p-2 ml-2 hover:bg-gray-400 absolute top-5 right-5'>
                Cerrar sesión
            </button>
            <main className="flex-1 p-6">
                <Inicio />
                <Outlet />
            </main>
        </div>
    )}
export default Dashboard
