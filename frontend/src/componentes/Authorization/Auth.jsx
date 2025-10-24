import Register from './Registro'
import Login from './Login'
import Logo from '../../assets/logo-2.png'
import { useState } from 'react'

const Auth = ({ funcUsuario }) => {
    const [ flipped, setFlipped ] = useState(false);

    return (
        <section className='relative [perspective:1000px] w-[90vw] max-w-[600px]  h-[95vh] max-h-[600px] sm:max-h[400] flex justify-center items-center flex-col'>
            <img src={Logo} className='w-[120px] h-[75px] max-w-72 max-h-56 object-cover p-2 sm:w-fit sm:h-fit' />
            {/* // tarjeta principal del flipped */}
            <article className={`relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] bg-gray-800 rounded-2xl flex justify-center items-center
            ${flipped === true ? "[transform:rotateY(180deg)]" : ""}`}>
                {/* Cara frontal */}
                <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] p-2">
                    <Login funcUsuario={funcUsuario}  setFlipped={setFlipped} />
                </div>
                {/* Cara trasera */}
                <div className="absolute w-full h-full top-0 left-0 [backface-visibility:hidden] [transform:rotateY(180deg)] p-2 rounded-2xl
            flex flex-col">
                    <Register funcUsuario={funcUsuario} setFlipped={setFlipped} />
                </div>
            </article>
        </section>
    )
}

export default Auth