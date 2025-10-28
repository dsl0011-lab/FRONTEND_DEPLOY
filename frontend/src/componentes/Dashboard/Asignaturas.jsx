import { useState } from 'react'

function Asignaturas() {

    const [asignaturas, setAsignaturas] = useState([
        "Matemáticas",
        "Física",
        "Programación",
        "Historia"
    ])

    return (
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
    )
}

export default Asignaturas