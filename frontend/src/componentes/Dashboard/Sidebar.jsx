import { Link } from "react-router-dom"

const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 dark:bg-gray-800 text-white min-h-screen p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-8">Mi App</h2>
            <nav className="w-auto h-full flex flex-col gap-4 bg-gray-700 p-4">
                <Link to='/'>inicio</Link>
                <Link to='/perfil'>Perfil</Link>
            </nav>
        </aside>
    )
}
export default Sidebar