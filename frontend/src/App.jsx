import './App.css'
import AppContent from './componentes/useContext/AppContent';
import UsuarioProvider from './componentes/useContext/UsuarioContext';

function App() {
  // const { usuario, setUsuario } = useContext(UsuarioContext)
  // // funcion que ayudara a guardar la informacion del usuario

  return (
    <UsuarioProvider>
      <AppContent />
    </UsuarioProvider>
  )
}

export default App
