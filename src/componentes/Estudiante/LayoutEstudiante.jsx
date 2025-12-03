import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { apiFetch } from "../Profesor/api";

function LayoutEstudiante() {
    const [ cursos, setCursos ] = useState([])
    const [ requestFinalizada, setRequestFinalizada ] = useState(false)
    const [ cursoElegido, setCursoElegido ] = useState([])

    const elegirCurso = (e)=>{
        setCursoElegido(cursos.filter((curso)=> ((curso.id == e.currentTarget.value)||(curso?.nombre.toLowerCase().includes(e?.currentTarget.value.toLowerCase())))))
    }

    useEffect(() => {
        apiFetch("/estudiante/cursos/",).then(setCursos)
            .catch(() => { setRequestFinalizada(true), setRequestFinalizada(true) })
            .finally(() => { setTimeout(() => setRequestFinalizada(true), 20) });
    }, [])


    return (
        <main className='min-h-screen flex flex-col text-white dark:bg-gray-800 rounded-lg shadow p-4'>
            <h1 className="text-xl font-bold mb-4">Panel Estudiante</h1>
            <aside className="flex items-center justify-center w-full h-fit p-2">
                <span className='w-full h-full flex items-center sm:flex-row flex-col justify-center gap-4'>
                    <nav className="flex flex-row gap-4">
                        <NavLink to="" className='bg-slate-900 hover:bg-sky-950 rounded-2xl p-2 md:p-4'>Cursos</NavLink>
                        <NavLink to="tareas" className='bg-slate-900 hover:bg-sky-950 rounded-2xl p-2 md:p-4'>Tareas</NavLink>
                        <NavLink to="calificaciones" className='bg-slate-900 hover:bg-sky-950 rounded-2xl p-2 md:p-4'>📚 Calificaciones</NavLink>
                    </nav>
                    <input className="text-white bg-gray-50 border border-gray-300 rounded-2xl w-full max-w-60 sm:max-w-96 h-auto p-1.5 sm:p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        placeholder='Busca un Curso' list="cursoSugerido" onChange={(e)=>elegirCurso(e)} />
                    {cursos?.length > 0 &&
                        <datalist id="cursoSugerido">
                            {cursos.map((curso) => (
                                <option
                                    key={curso?.id}
                                    value={curso?.id}
                                >
                                    {curso?.nombre}
                                </option>
                            ))}
                        </datalist>}
                </span>
            </aside>
            <section className="flex-1 p-4 ">
                <Outlet context={{cursos, requestFinalizada, cursoElegido}}/>
            </section>
        </main>
    )
}

export default LayoutEstudiante