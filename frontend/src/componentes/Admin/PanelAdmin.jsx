import { useCallback, useEffect, useState } from "react";
import EditarUsuarios from "./EditarUsuarios";
import { normalizar, solicitud_admin } from "./scriptsAdmin";


export default function PanelAdmin({ usuarioValidado }) {
    const [buscarUsuario, setBuscarUsuario] = useState("");
    const [busqueda, setBusqueda] = useState("");
    const [usuarios, setUsuarios] = useState(usuarioValidado?.usuarios || []);
    const [usuarioFiltrado, setUsuarioFiltrado] = useState([])
    const [editarUsuarios, setEditarUsuarios] = useState(false)
    const [usuarioElegido, setUsuarioElegido] = useState({})
    const [error, setError] = useState(false)
    const [errorDescripcion, setErrorDescripcion] = useState("")
    const [requestExitosa, setRequestExitosa] = useState(false)


    useEffect(() => setUsuarios(usuarioValidado.usuarios), [usuarioValidado.usuarios])



    useEffect(() => {
        if (usuarios?.id || usuarios) {
            const arr = usuarios.filter((u) =>
                normalizar(u?.first_name + u?.last_name + u?.id + u?.username).includes(normalizar(buscarUsuario))).slice(0, 5)
            setUsuarioFiltrado(arr)
        }
    }, [buscarUsuario, usuarios])


    const actualizarUsuarios = useCallback((usuarioModificado) => {
        setUsuarios(prev =>
            prev.map(u =>
                u.id === usuarioModificado.id ? usuarioModificado : u
            )
        );
    }, []);

    const eliminar = (usuarioElegido) => {
        let confirmacion = confirm("¿Estas seguro que quieres eliminar un usuario?")
        if (!confirmacion) return
        const res = { id: usuarioElegido }
        solicitud_admin(usuarioElegido, "DELETE", res, setErrorDescripcion, setError, setRequestExitosa)
    }

    let profesores = [], alumnos = [];
    if (usuarios) {
        profesores = usuarios.filter((u) => u.role === "T");
        alumnos = usuarios.filter((u) => u.role === "S");
    }


    return (
        <main className="w-full h-full relative flex items-center justify-start text-xs md:text-base flex-col bg-gray-900 border-2 border-gray-700 rounded-2xl xs:p-4 text-white">
            {editarUsuarios && <EditarUsuarios setEditarUsuarios={setEditarUsuarios} usuarioElegido={usuarioElegido} setUsuarios={setUsuarios} usuarios={usuarios} actualizarUsuarios={actualizarUsuarios} />}
            <h2 className="h-fit w-fit self-start lg:text-2xl md:text-xl text-xl">
                Panel Administrador
            </h2>
            {requestExitosa && <p>Tu petición ha sido procesada correctamente</p>}
            {error && (
                <div className="absolute p-2 rounded-lg bg-red-800 top-10 m-2 text-white pl-2 pr-2">
                    {errorDescripcion.map((err, i) => <p key={i}>{err}</p>)}
                </div>
            )}
            <div className="w-full h-full xs:px-8 px-1 py-4 flex flex-col items-center justify-start gap-2 m-2 border-sky-500 border-2 rounded-2xl">
                <h3 className="text-lg xs:text-xl">Usuarios</h3>
                <div className="flex flex-col w-full h-fit justify-center items-center xs:flex-row gap-2 rounded-2xl">
                    <button
                        className="flex-1 max-w-60 p-2.5 text-white hover:bg-sky-950 border-sky-500 border-2 rounded-2xl text-center"
                        onClick={() => setBusqueda("profesor")}
                    >
                        Buscar profesor
                    </button>
                    <button
                        className="flex-1 max-w-60 p-2.5 text-white hover:bg-sky-950 border-sky-500 border-2 rounded-2xl text-center"
                        onClick={() => setBusqueda("estudiante")}
                    >
                        Buscar estudiante
                    </button>
                </div>
                {busqueda === "estudiante" ? (
                    <div className="flex flex-col items-center justify-center w-full h-auto p-4 gap-4">
                        <label className="text-center w-full">Busca un alumno</label>
                        <input
                            onChange={(e) => setBuscarUsuario(normalizar(e.target.value))}
                            list="usuarioSugerido"
                            type="text"
                            className="w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-1 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"
                        />
                        <datalist id="usuarioSugerido">
                            {alumnos.map((alumno) => (
                                <option
                                    key={alumno.id}
                                    value={alumno.id}
                                >
                                    {alumno?.first_name + " " + alumno?.last_name}
                                </option>
                            ))}
                        </datalist>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-auto p-4 gap-4">
                        <label className="text-center">Busca un profesor</label>
                        <input
                            onChange={(e) => setBuscarUsuario(normalizar(e.target.value))}
                            list="usuarioSugerido"
                            type="text"
                            className="w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-1 sm:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"
                        />
                        <datalist id="usuarioSugerido">
                            {profesores.map((profesor) => (
                                <option
                                    key={profesor.id}
                                    value={profesor.id}
                                >
                                    {profesor?.first_name + " " + profesor?.last_name}
                                </option>
                            ))}
                        </datalist>
                    </div>
                )}
                <section className="flex items-center justify-center my-4">
                    {/* MOSTRAR USUARIO ENCONTRADO */}
                    <article className="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 w-full h-full gap-4">
                        {usuarioFiltrado.length > 0 &&
                            usuarioFiltrado.map((usuario) => (
                                <div key={usuario.id} className="overflow-hidden truncate flex flex-col items-start gap-2 text-start border-cyan-500 border-dotted border-4 rounded-2xl p-2">
                                    <p>Nombre: {usuario?.first_name} {usuario?.last_name}</p>
                                    <p>Usuario: {usuario.username}</p>
                                    <p>Rol: {usuario?.role}</p>
                                    <p>Email: {usuario?.email}</p>
                                    <p>Super usuario: {usuario?.is_superuser === true ? "si" : "no"}</p>
                                    <p>Staff: {usuario?.is_superuser === true ? "si" : "no"}</p>
                                    <div className="w-full h-auto flex items-center justify-center gap-2">
                                        <button onClick={() => { setEditarUsuarios(prev => !prev), setUsuarioElegido(usuario) }}
                                            className="self-center w-16 h-auto hover:bg-sky-950 border-sky-500 border-2 rounded-md">Editar</button>
                                        <button onClick={() => eliminar(usuario.id)}
                                            className="self-center w-16 h-auto  border-red-800 hover:bg-yellow-900 border-2 rounded-md">Eliminar</button>
                                    </div>
                                </div>
                            ))}
                    </article>
                </section>
            </div>
        </main>
    );
}
