import React, { useEffect, useState } from 'react'
import { API_BASE } from '../Authorization/scripts/Security'
import { definirRole, solicitud_admin } from './scriptsAdmin'

export default function EditarUsuarios({ setEditarUsuarios, usuarioElegido, actualizarUsuarios }) {
    const [error, setError] = useState(false)
    const [errorDescripcion, setErrorDescripcion] = useState([])
    const [requestExitosa, setRequestExitosa] = useState(false)
    const [form, setForm] = useState(null)


    useEffect(() => {
        if (form !== null) {
            solicitud_admin(usuarioElegido.id, "PATCH", form, setErrorDescripcion, setError, setRequestExitosa, actualizarUsuarios)
        }
    }, [form, setEditarUsuarios, actualizarUsuarios, usuarioElegido])



    const saveForm = (e) => {
        e.preventDefault()
        let objLimpio = {};
        let obj = {
            first_name: e.currentTarget?.first_name_.value.trim(),
            last_name: e.currentTarget?.last_name_.value.trim(),
            username: e.currentTarget?.username_.value.trim(),
            email: e.currentTarget?.email_.value.trim(),
            gender: e.currentTarget?.gender_.value.trim(),
            role: e.currentTarget?.role_.value.trim(),
            is_active: e.currentTarget?.is_active_.value.trim(),
            is_staff: e.currentTarget?.is_staff_.value.trim(),
            is_superuser: e.currentTarget?.is_superuser_.value.trim()
        }

        for (const key in obj) {
            if (obj[key] !== "" && obj[key] !== null && obj[key] !== undefined) {
                objLimpio[key] = obj[key]
            }
        }
        setForm(objLimpio)
    }

    return (
        <main className='absolute inset-0 h-full w-full flex justify-center items-start backdrop-blur-md'>
            <section className='h-full w-full max-h-[750px] max-w-[850px] bg-slate-800 rounded-xl'>
                <article className='flex items-center justify-center flex-col w-full h-full p-4 gap-6 text-xl'>
                    <h4 className='w-full h-fit text-xl self-start'>Datos de usuario: </h4>
                    {requestExitosa && !error ? <p>Tu petición ha sido procesada correctamente</p> : <p>Error: {errorDescripcion}</p>}  
                    <div className='w-full h-full flex justify-center items-center'>
                        <form onSubmit={(e) => saveForm(e)}
                            className="w-full h-full text-lg overflow-hidden truncate p-6 flex flex-wrap items-center gap-2 text-start border-slate-600 border rounded-2xl">
                            <div className='flex-2 w-full gap-4 flex flex-col justify-between border-emerald-600 border-2 border-dotted rounded-2xl p-2'>
                                <div className='flex-1 w-full h-full flex flex-row justify-center items-center'>
                                    <p className='flex-1 self-start'>Nombre: {usuarioElegido?.first_name}</p>
                                    <input type="text" name='first_name_' className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' />
                                </div>
                                <div className='flex-1 w-full h-full flex flex-row justify-center items-center'>
                                    <p className='flex-1 self-start'>Apellidos: {usuarioElegido?.last_name}</p>
                                    <input type="text" name='last_name_' className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' />
                                </div>
                                <div className='flex-1 w-full h-full flex flex-row justify-center items-center'>
                                    <p className='flex-1 self-start'>Username: {usuarioElegido?.username}</p>
                                    <input type="text" name='username_' className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' />
                                </div>
                                <div className='flex-1 w-full h-full flex flex-row justify-center items-center'>
                                    <p className='flex-1 self-start'>Email: {usuarioElegido?.email}</p>
                                    <input type="text" name='email_' className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' />
                                </div>
                                <div className='flex-1 w-full h-full flex flex-row justify-center items-center'>
                                    <p className='flex-1 self-start'>Género: {(usuarioElegido?.gender === "F") ? ("Femenino") : ("Masculino")}</p>
                                    <select name="gender_" id="gender_" className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' >
                                        <option value="">Selecciona el género</option>
                                        <option value="M">masculino</option>
                                        <option value="F">femenino</option>
                                    </select>
                                </div>
                            </div>
                            <div className='flex-1 flex w-full gap-4'>
                                <div className='flex-1 border-emerald-600 border-2 border-dotted rounded-2xl p-4 flex flex-col gap-2'>
                                    <div className='flex-1 w-full h-full flex flex-col justify-center items-center'>
                                        <p className='flex-1 self-start'>Rol: {usuarioElegido?.role && definirRole(usuarioElegido?.role)}</p>
                                        <select name="role_" id="role" className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto max-h-10 text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' >
                                            <option value="">Selecciona el rol</option>
                                            <option value="S">Alumno</option>
                                            <option value="T">Profesor</option>
                                            <option value="A">Administrador</option>
                                        </select>
                                    </div>
                                    <div className='flex-1 w-full h-full flex flex-col justify-center items-center'>
                                        <p className='flex-1 self-start'>Esta activo: {usuarioElegido?.is_active === true ? "si" : "no"}</p>
                                        <select name="is_active_" id="is_active_" className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto max-h-10 text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' >
                                            <option value="">Selecciona su estado</option>
                                            <option value="true">si</option>
                                            <option value="false">no</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='flex-1 border-emerald-600 border-2 border-dotted rounded-2xl p-4 flex flex-col gap-2'>
                                    <div className='flex-1 w-full h-full flex flex-col justify-center items-center'>
                                        <p className='flex-1 self-start'>es Staff: {usuarioElegido?.is_staff}</p>
                                        <select name="is_staff_" id="is_staff_" className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto max-h-10 text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' >
                                            <option value="">Es staff</option>
                                            <option value="true">si</option>
                                            <option value="false">no</option>
                                        </select>
                                    </div>
                                    <div className='flex-1 w-full h-full flex flex-col justify-center items-center'>
                                        <p className='flex-1 self-start'>Super usuario: {usuarioElegido?.is_superuser === true ? "si" : "no"}</p>
                                        <select name="is_superuser_" id="is_superuser" className='flex-1 self-start w-full md:max-w-96 max-w-56 h-auto max-h-10 text-white bg-gray-50 border border-gray-300 rounded-2xl p-0.5 sm:p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-white"' >
                                            <option value="">Es super usuario</option>
                                            <option value="true">si</option>
                                            <option value="false">no</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full h-fit items-end justify-end gap-4'>
                                <button className="h-12 w-24 self-end p-2.5 text-white hover:bg-sky-950 border-sky-500 border-2 rounded-2xl text-center"
                                    type="submit">Guardar</button>
                                <button className="h-12 w-24 p-2.5 text-white hover:bg-sky-950 border-sky-500 border-2 rounded-2xl text-center"
                                    onClick={() => setEditarUsuarios(prev => !prev)} type='button'>Salir</button>
                            </div>
                        </form>
                    </div>
                </article>
            </section>
        </main>
    )
}
