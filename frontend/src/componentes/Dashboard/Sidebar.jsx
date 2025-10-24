const Sidebar = () => {
    return (
        <aside className="w-64 bg-gray-800 dark:bg-gray-800 text-white min-h-screen p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-8">Mi App</h2>
            <nav className="w-auto h-full flex flex-col gap-4 bg-gray-700 p-4">
                <a href="#" className="hover:text-gray-300">Inicio</a>
                <a href="#" className="hover:text-gray-300">Perfil</a>
                <a href="#" className="hover:text-gray-300">Asignaturas</a>
                <a href="#" className="hover:text-gray-300">Configuración</a>
            </nav>
        </aside>
    )
}

export default Sidebar
