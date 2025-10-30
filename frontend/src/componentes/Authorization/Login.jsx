import { useCallback, useEffect, useState } from "react";

const Login = ({ setFlipped, funcUsuario }) => {

    //cambiar URL del endpoint en cuestion
    const URL = "http://localhost:8000/api/auth/token/"

    const [form, setForm] = useState({
        username: "",
        password: ""
    })

    const saveForm = useCallback((e) => {
        e.preventDefault();
        setForm({
            username: e.target.usernameR.value,
            password: e.target.passwordL.value
        })
    }, [])

    useEffect(() => {
        if (form.email !== "" && form.password !== "") {
            const sendForm = async () => {
                try {
                    const datosEnviados = await fetch(URL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: 'include',
                        body: JSON.stringify(form)
                    });
                    if (!datosEnviados.ok) {
                        const respuestaFallida = await datosEnviados.json()
                        console.error(respuestaFallida)
                    }
                    const data = await datosEnviados.json()
                    funcUsuario(data)
                } catch (e) {
                    console.error("Ha ocurrido un error", e)
                }
            }
            sendForm();
        }
    }, [form, funcUsuario])

    return (
        <>
            <h1 className="text-2xl font-bold w-full h-fit leading-tight tracking-tight dark:text-white p-2">Inicio de Sesión</h1>
            <form onSubmit={(e) => saveForm(e)} className="w-full h-full flex flex-col items-center justify-center gap-6 py-5 text-sm sm:text-base">
                <input type="text" name="usernameR" id="usernameR" placeholder="Ingresa nick/username" className="text-white bg-gray-50 border border-gray-300 rounded-2xl w-full max-w-60 sm:max-w-96 h-auto p-1.5 sm:p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                <input type="password" name="passwordL" id="passwordL" placeholder="Ingresa tu contraseña" autoComplete="off" className="text-white bg-gray-50 border border-gray-300 rounded-2xl w-full max-w-60 sm:max-w-96 h-auto p-1.5 sm:p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" required />
                {/* Inicio de sesión con JWT */}
                {/* colocar un onclick con savePassword */}
                <label className="relative inline-flex items-center gap-4 cursor-pointer">
                    <input type="checkbox" className="sr-only peer" id="recordar" />
                    <span className="w-11 h-6 bg-zinc-500 rounded-full peer-checked:bg-sky-600 
                    peer-checked:after:translate-x-full after:content-[''] after:absolute 
                    after:top-[2px] after:left-[2px] after:bg-white after:rounded-full 
                    after:h-5 after:w-5 after:transition-all"></span>
                    <p className="text-white">Recordar datos</p>
                </label>
                <div className="flex justify-center items-center flex-col w-fit h-fit p-1 sm:p-4 gap-3">
                    <button type="submit" className="w-full max-w-60 h-fit max-h-24 p-1.5 sm:p-2.5 rounded-2xl text-white bg-gray-900 hover:bg-slate-800 text-center">Iniciar sesión</button>
                    <a href="#" className="w-full max-w-60 text-center text-base font-medium text-primary-600 hover:underline text-white dark:text-primary-500 p-4"
                        onClick={() => setFlipped(true)}>¿No te has registrado aún?
                    </a>
                </div>
            </form>
        </>
    )
}
export default Login