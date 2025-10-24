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
        <main className='h-screen w-auto flex justify-center flex-col items-center
        bg-gradient-to-t from-gray-400 to-black box-border'>
            {
                usuario.full_name === "" || usuario.full_name === undefined || usuario.full_name === null ? (
                    <div className='w-screen h-screen overflow-hidden flex justify-center flex-col items-center'>
                        <Auth funcUsuario={funcUsuario} />
                    </div>
                ) : (
                    <div className='h-full w-full'>
                        <Dashboard />
                    </div>
                )
            }
        </main>
    )
}

export default AppContent;