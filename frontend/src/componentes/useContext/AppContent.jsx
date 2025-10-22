import { useCallback, useContext } from 'react'
import { UsuarioContext } from './UsuarioContext';
import Auth from '../Authorization/Auth';
import Dashboard from '../Dashboard/Dashboard';

function AppContent() {
    const { usuario, setUsuario } = useContext(UsuarioContext);

    const funcUsuario = useCallback((informacion) => {
        setUsuario(() => informacion)
    }, [setUsuario])

    return (
        <main className='w-screen h-screen flex justify-center flex-col items-center overflow-hidden
        bg-gradient-to-t from-gray-400 to-black'>
            {
                usuario.full_name === "" || usuario.full_name === undefined || usuario.full_name === null ? (
                    <Auth funcUsuario={funcUsuario} />
                ) : (
                    <>
                        <Dashboard />
                    </>
                )
            }
        </main>
    )
}

export default AppContent;