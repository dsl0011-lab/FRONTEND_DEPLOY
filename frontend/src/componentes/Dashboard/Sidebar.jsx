import { Link } from "react-router-dom"

const Sidebar = () => {
    return (
        <aside className={`w-full h-screen min-h-screen absolute md:static bg-gray-800 dark:bg-gray-800 text-white 
        p-6 flex flex-col`}>
            <h2 className="text-2xl font-bold mb-8">Aula Virtual</h2>
            <nav className="w-auto h-full flex flex-col gap-4 bg-gray-700 p-4">
                <Link to='/' className="hover:text-gray-400">inicio</Link>
                <Link to='/perfil' className="hover:text-gray-400">Perfil</Link>
                <Link to='/asignaturas' className="hover:text-gray-400">Asignaturas</Link>
            </nav>
        </aside>
    )
}
export default Sidebar