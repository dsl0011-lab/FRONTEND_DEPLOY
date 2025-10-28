import { useContext } from "react"
import { UsuarioContext } from "../useContext/UsuarioContext"

    const Inicio = () => {
    const { usuario } = useContext(UsuarioContext);
        return(
        <section className="flex items-center justify-center h-20 w-full">
            <div className='text-white text-2xl'>
                {usuario.gender === "M"
                    ? `Bienvenido ${usuario.first_name} ${usuario.last_name}`
                    : `Bienvenida ${usuario.first_name} ${usuario.last_name}`}
            </div>
        </section>
        )
    }

export default Inicio