import { createContext, useState } from "react";

const UsuarioContext = createContext();

export default function UsuarioProvider({ children }) {
    const [usuario, setUsuario] = useState({
        full_name: "",
        email: "",
        gender: "",
        rol: "",
    });

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
}

export { UsuarioContext };