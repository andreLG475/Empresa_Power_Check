import { Navigate } from "react-router-dom";

export default function PaginaPrivada({ children }) {
    const token = localStorage.getItem("token");

    // se NÃO tiver token → manda para login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // se tiver token → mostra o conteúdo da página
    return children;
}