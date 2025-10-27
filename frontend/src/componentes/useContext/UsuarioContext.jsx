import { createContext, useState } from "react";

const UsuarioContext = createContext();

export default function UsuarioProvider({ children }) {
    const [usuario, setUsuario] = useState({
        full_name: "",
        email: "",
        gender: "",
        rol: "",
        username: ""
    });

    return (
        <UsuarioContext.Provider value={{ usuario, setUsuario }}>
            {children}
        </UsuarioContext.Provider>
    );
}

export { UsuarioContext };