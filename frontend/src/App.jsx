import './App.css'
import Auth from './componentes/Authorization/Auth';
import AppContent from './componentes/useContext/AppContent';
import UsuarioProvider from './componentes/useContext/UsuarioContext';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
      <UsuarioProvider>
        <Routes>
          <Route path='/Auth' element={<Auth />} />
          <Route  path="/*" element={<AppContent />}/>      
        </Routes>
      </UsuarioProvider>
    </BrowserRouter>
  )
}

export default App